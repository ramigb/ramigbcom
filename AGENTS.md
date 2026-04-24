# Agent Instructions For Rami GB Personal Site

This repository is a small static personal website. Treat it like a simple CMS:
the Markdown files are the content source of truth, and `index.html` is the
rendered public page.

## Site Contract

- Keep the site static: HTML, CSS, Markdown, and image assets only.
- Do not add build tooling, frameworks, package managers, JavaScript, or generated
  dependencies unless the user explicitly asks for them.
- Keep the design modern, sleek, light, and welcoming.
- Preserve the wide home hero image treatment using `assets/imgs/me.png`.
- Keep the visual language aligned with `assets/css/style.css`.
- Use existing CSS variables before introducing new colors.
- Keep cards and framed surfaces at `8px` border radius or less.
- Prefer restrained editorial layouts over decorative effects.
- Do not add gradient blobs, ornamental SVG backgrounds, or unrelated stock art.
- Use ASCII text unless the existing file or user-provided copy requires otherwise.

## Files

- `index.html`: public one-page website.
- `assets/css/style.css`: complete visual system and responsive behavior.
- `assets/imgs/me.png`: wide hero background image. Maintain the wide aspect
  ratio and do not crop it into a portrait asset.
- `menu.md`: ordered navigation/content sections, one slug per line.
- `pages/about.md`: source copy for the About and Interests sections.
- `pages/side-projects.md`: source list for the Work section.

When making content changes, update both the relevant Markdown source and the
rendered `index.html` so the source and page stay in sync.

## Deterministic CMS Commands

If the user gives a short command, interpret it using these rules.

### "Update the side projects"

1. Read `pages/side-projects.md`.
2. Add or edit projects in exactly this format:

   ```md
   # ProjectName
   link: https://example.com/project
   about: One concise sentence about the project.
   ```

3. For multiple projects, separate project blocks with exactly one blank line.
4. Preserve the order already present unless the user asks for sorting.
5. If adding a project and any of `ProjectName`, `link`, or `about` is missing,
   ask the user for the missing fields before editing.
6. Reflect the project in `index.html` inside the `#work` section.
7. Use the existing project layout:
   - Keep `.feature-band`, `.feature-copy`, `.feature-link`, and `.project-meta`
     classes.
   - If there is one project, render one large feature band.
   - If there are multiple projects, render repeated `.feature-band` articles in
     the same order as `pages/side-projects.md`.
   - Link text should be `Open on GitHub` for GitHub links and `Open project` for
     non-GitHub links.
   - Keep descriptions concise. Do not invent claims beyond the Markdown source.

### "Update about"

1. Read `pages/about.md`.
2. Preserve the existing question-style headings unless the user asks to rename
   them.
3. Apply copy edits in the Markdown first.
4. Reflect the meaningful content in `index.html` without copying every sentence
   verbatim if the current page uses shorter edited copy.
5. Keep the About section focused on background, development, and current work.
6. Keep music, gaming, and social media content in the Interests section.

### "Update the menu" or "Add a section"

1. Read `menu.md`.
2. Each line is a section slug, lowercase, using hyphens for spaces.
3. Add new slugs in the requested order.
4. Update the nav links in `index.html`.
5. Add a matching page section only when the user provides content or asks for an
   empty placeholder.
6. Do not remove existing sections unless the user explicitly asks.

### "Update the home page" or "Update hero"

1. Keep `assets/imgs/me.png` as the hero background.
2. Maintain the wide hero composition:
   - Desktop uses a wide framed hero with dark left overlay and visible image.
   - Mobile may crop for legibility but must keep the image recognizable.
3. Keep the H1 as `Rami GB` unless the user explicitly changes the site identity.
4. Keep hero copy short: one paragraph, no more than two sentences.
5. Keep at most two hero buttons unless the user asks for more.

### "Update contact" or "Update links"

1. Update contact links in `index.html`.
2. If a professional profile is updated, also update the matching source mention
   in `pages/about.md` when relevant.
3. Use short link labels such as `LinkedIn`, `GitHub`, `Email`, or the service
   name.

### "Restyle the site"

1. Read `assets/css/style.css` before editing.
2. Preserve the existing palette variables:
   - `--bg`, `--surface`, `--surface-2`, `--border`
   - `--text`, `--text-muted`
   - `--accent`, `--accent-hover`, `--accent-soft`
   - `--blue`, `--green`, `--red`
   - light theme variables such as `--page`, `--paper`, `--ink`, and `--line`
3. Prefer changing variable values and existing selectors over adding new systems.
4. Keep the site light and welcoming. The dark colors should mainly support the
   hero overlay and featured project bands.
5. Check responsive rules after visual changes.

## Content Rules

- Respect the user's voice: direct, personal, lightly humorous, not corporate.
- Clean up obvious spelling or grammar issues only when it does not flatten the
  personality of the text.
- Do not rewrite personal facts without user direction.
- If a fact is missing, ask rather than inventing it.
- External links must use full `https://` URLs.
- Keep summaries tight enough for a one-page personal website.

## HTML Rules

- Keep `index.html` readable and hand-editable.
- Preserve semantic sections and IDs: `home`, `about`, `work`, `interests`,
  `contact`.
- Use `article` for repeated project or interest entries.
- Keep navigation labels short.
- Do not add visible instructions explaining how to use the website.
- Do not add JavaScript for basic content updates.

## CSS Rules

- Reuse existing classes where possible.
- Add classes only when the current layout cannot express the needed content.
- Keep responsive behavior explicit with media queries.
- Use stable layout dimensions with `min()`, `clamp()`, grid tracks, and
  `minmax()` as already used in the stylesheet.
- Do not use viewport-width font scaling.
- Do not use negative letter spacing.
- Ensure text does not overflow buttons, cards, or narrow mobile screens.

## Verification

After edits:

1. Run a quick read of changed files.
2. Confirm links and image paths are relative and valid.
3. Confirm Markdown source and `index.html` agree.
4. If only HTML/CSS/Markdown changed, no build step is required.
5. Tell the user exactly which files changed and note that the site can be opened
   directly from `index.html`.

## When To Ask Questions

Ask before editing when:

- A required content field is missing.
- The user asks to add a project but does not provide a name.
- The user asks for a new section without saying where it should appear or what it
  should contain.
- A requested design change conflicts with the current light, sleek, welcoming
  direction.
- The request would require adding tooling, JavaScript, third-party dependencies,
  or network-fetched assets.

Otherwise, make a reasonable deterministic edit and keep moving.
