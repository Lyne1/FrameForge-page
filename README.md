# FrameForge project page

Static academic project page for **FrameForge: Harnessing Priors of Video Foundation Models for Unified Image Generation**, built from the requested [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template).

## Preview

No Node installation or build step is needed:

```bash
cd /data2/linyj/frameforge-project-page
python3 -m http.server 8080 --bind 127.0.0.1
```

To view the remote preview on your computer, open another local terminal:

```bash
ssh -L 8080:127.0.0.1:8080 a800-hf
```

Then open <http://127.0.0.1:8080/>. Use another free port if 8080 is occupied.

## Content and assets

- `index.html`: complete paper title, author list, abstract, method, three benchmark comparisons, inference examples, and provisional citation.
- `static/css/index.css`: responsive layout and styling, on top of the template's locally bundled Bulma CSS.
- `static/js/index.js`: keyboard-accessible task tabs, figure enlargement, inference command selection, and copy buttons.
- `static/images/`: original manuscript figures converted to WebP, example input/output crops, a custom SVG favicon, and a social preview.
- `scripts/prepare_assets.py`: reproduces the website assets from the supplied paper zip. Requires Python, Pillow, and Poppler (`pdftoppm`).
- `CONTENT_SOURCES.md`: content provenance and implementation notes.

The page loads without third-party JavaScript, font CDNs, analytics, or model inference. All figures are derived from the original paper; the teaser shows input/output crops from its comparison figures. The benchmark tables retain the manuscript's values and metric directions, including the distinction between open- and closed-source editing methods.

Regenerate the images when the manuscript changes:

```bash
python3 scripts/prepare_assets.py \
  --paper-zip '/data2/linyj/HunyuanVideo-1.5/TMM_submit (1).zip'
```

## Links and publication

- Code: <https://github.com/Lyne1/FrameForge>
- Weights: <https://huggingface.co/lyneeeeeeeee/FrameForge>
- Paper: no public link has been supplied. The hero displays `Paper · Coming soon`, without a broken or invented URL. Replace that span in `index.html` with an anchor when the paper becomes available, and add `citation_pdf_url` or other metadata only when confirmed.
- The BibTeX is provisional and matches the inference repository README. No conference, acceptance status, DOI, or arXiv identifier is asserted.

The repository root can be served by any static host, including GitHub Pages. The template's `.nojekyll` is retained. Before publishing, replace the relative social-preview metadata with its absolute public URL. This task only creates the page files; it does not push or publish them.

## Attribution

Template upstream: <https://github.com/eliahuhorwitz/Academic-project-page-template>, commit `d38af1ccae1ce82c3404d2820c4c646afd409f81`.

The original template credits [Nerfies](https://nerfies.github.io/) and is licensed under [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/). These credits are retained in the page footer. This website-template license does not replace the separate licenses for the research code, model weights, or paper figures.
