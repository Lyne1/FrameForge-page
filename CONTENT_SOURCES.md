# Content provenance

## Author-supplied sources

1. `/data2/linyj/HunyuanVideo-1.5/TMM_submit (1).zip`:
   - `main.tex`: title, author order, USTC affiliation, contact addresses, and corresponding author.
   - `chapters/1_abstract.tex`: abstract, with formatting adapted to HTML.
   - `chapters/2_introduction.tex`: virtual temporal relations and motivation.
   - `chapters/4_method.tex`: MoTE, CoTR, virtual video-frame spans {17, 69, 121}, intermediate-training masking, and full-attention inference.
   - `chapters/5_experiments.tex`: DreamBench, COCO2017, and GEdit-Bench quantitative tables; inference settings; and expert-routing analysis.
   - `images/`: all six research figures used on this page.
2. `/data2/linyj/frameforge/README.md`, `configs/final.sh`, `scripts/infer.sh`, `infer.py`, and `hyvideo/pipelines/hunyuan_video_pipeline.py`: released inference configuration, weights, quick-start commands, and fixed 512 × 512 image output.
3. The author supplied `https://github.com/Lyne1/FrameForge` as the Code URL and `https://arxiv.org/pdf/2610.36545` as the paper URL. The arXiv record confirms the title, author order, and manuscript identifier.

## Figure preparation

PDF figures are rendered with Poppler. Blank slide margins are cropped. The editing comparison PDF has off-figure editor annotations at the far right and bottom; the website retains the complete comparison grid and excludes those annotations. Original figure content, labels, and comparison columns are preserved.

Teaser images are crops of the input and Ours columns: corgi / subject-driven generation, tabby cat / Canny-to-image, and orange cat / image editing. They are displayed as 512 × 512 assets. These are presentation crops of paper results, not newly run inference results.

## Scope

The public manuscript identifier is arXiv:2610.36545. The reference matches the arXiv paper and code README. No accepted venue or acceptance status is inferred. Code and model licenses remain separate from the website template license.
