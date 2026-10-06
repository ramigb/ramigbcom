"""Build web derivatives of the room art. Source art in docs/ is never modified.

Usage: python3 -I scripts/make_assets.py docs/room-background.png scripts/out/depth-raw.png public/scene

Outputs:
  room.webp   the visual plate, full resolution
  blur1.webp  half resolution, lightly blurred  (depth of field, near the focus)
  blur2.webp  quarter resolution, heavily blurred (far out of focus, stretched mesh)
  depth.png   8-bit smoothed disparity (bright = near) at half resolution
  og.jpg      social preview image
"""
import sys

import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image, ImageFilter

src, depth_src, out = sys.argv[1], sys.argv[2], sys.argv[3]

room = Image.open(src).convert("RGB")
room.save(f"{out}/room.webp", "WEBP", quality=90, method=6)
# Pre-blurred plates: smooth to upsample, unlike sampling high mip levels.
room.resize((room.width // 2, room.height // 2), Image.LANCZOS).filter(ImageFilter.GaussianBlur(3)).save(
    f"{out}/blur1.webp", "WEBP", quality=82, method=6)
room.resize((room.width // 4, room.height // 4), Image.LANCZOS).filter(ImageFilter.GaussianBlur(5)).save(
    f"{out}/blur2.webp", "WEBP", quality=80, method=6)
room.resize((1200, 900), Image.LANCZOS).crop((0, 135, 1200, 765)).save(f"{out}/og.jpg", "JPEG", quality=85)

def box(x, r):
    k = 2 * r + 1
    return F.avg_pool2d(F.pad(x, (r, r, r, r), mode="replicate"), k, stride=1)


def guided_filter(guide, src, r, eps):
    """He et al. guided filter: smooths src while snapping its edges to guide's edges."""
    mean_i = box(guide, r)
    mean_p = box(src, r)
    cov_ip = box(guide * src, r) - mean_i * mean_p
    var_i = box(guide * guide, r) - mean_i * mean_i
    a = cov_ip / (var_i + eps)
    b = mean_p - a * mean_i
    return box(a, r) * guide + box(b, r)


d = np.array(Image.open(depth_src)).astype(np.float32) / 65535.0
t = torch.from_numpy(d)[None, None]
# The model output is blocky along strong edges (14px patches). Guiding it with the
# photo's own luminance makes depth edges follow the real window frame and furniture.
lum = torch.from_numpy(np.asarray(room.convert("L"), dtype=np.float32) / 255.0)[None, None]
t = guided_filter(lum, t, 10, 2e-3)
t = guided_filter(lum, t, 4, 1e-3)
# Half resolution is plenty for a mesh and keeps the file small.
t = F.interpolate(t, size=(room.height // 2, room.width // 2), mode="area")
pad = 2
u = F.pad(t, (pad, pad, pad, pad), mode="replicate").unfold(2, 5, 1).unfold(3, 5, 1)
t = u.reshape(*u.shape[:4], -1).median(dim=-1).values
k = torch.arange(-4, 5, dtype=torch.float32)
g = torch.exp(-(k**2) / (2 * 1.6**2))
g = g / g.sum()
t = F.conv2d(F.pad(t, (4, 4, 0, 0), mode="replicate"), g.view(1, 1, 1, -1))
t = F.conv2d(F.pad(t, (0, 0, 4, 4), mode="replicate"), g.view(1, 1, -1, 1))
d = t[0, 0].numpy()
# Everything beyond the glass is "the city": flatten it to one far distance.
d = np.clip(d, 0.04, 1.0)
Image.fromarray(np.round(d * 255).astype(np.uint8), mode="L").save(f"{out}/depth.png", optimize=True)
print("ok", d.shape)
