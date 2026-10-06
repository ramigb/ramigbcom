"""Estimate a depth map for the room plate with Depth Anything V2.

Usage: python3 -I scripts/make_depth.py docs/room-background.png scripts/out/depth-raw.png

Writes a 16-bit grayscale PNG of relative inverse depth (bright = near),
normalized to 0..65535, at the source image resolution.

The model runs at two input sizes and the results are blended: the default size
gets the global layout right, the larger one gives cleaner edges (the default run
leaves 14px stair-steps along the window frame).
"""
import sys

import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForDepthEstimation

src, dst = sys.argv[1], sys.argv[2]
name = "depth-anything/Depth-Anything-V2-Large-hf"
device = "cuda" if torch.cuda.is_available() else "cpu"
processor = AutoImageProcessor.from_pretrained(name)
model = AutoModelForDepthEstimation.from_pretrained(name).to(device).eval()
img = Image.open(src).convert("RGB")


def predict(height: int, width: int) -> torch.Tensor:
    inputs = processor(images=img, return_tensors="pt", size={"height": height, "width": width},
                       keep_aspect_ratio=False, ensure_multiple_of=14, do_resize=True)
    with torch.no_grad():
        out = model(**{k: v.to(device) for k, v in inputs.items()}).predicted_depth
    out = F.interpolate(out[:, None].float(), size=(img.height, img.width), mode="bicubic", align_corners=False)[0, 0]
    out = (out - out.min()) / (out.max() - out.min())
    return out.cpu()


base = predict(518, 686)
fine = predict(1036, 1372)
# Match the fine pass to the base pass's global range, then keep its edges.
fine = (fine - fine.mean()) / fine.std() * base.std() + base.mean()
low = lambda t: F.avg_pool2d(t[None, None], 31, stride=1, padding=15)[0, 0]
d = low(base) + (fine - low(fine))
d = ((d - d.min()) / (d.max() - d.min())).numpy()
Image.fromarray((d * 65535).astype(np.uint16)).save(dst)
print("saved", dst, d.shape)
