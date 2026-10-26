#!/usr/bin/env python3
"""Prepare original manuscript figures for this static project page.

Requires Pillow and Poppler's pdftoppm. No model inference or generated imagery.
"""
import argparse
import io
from pathlib import Path
import subprocess
import tempfile
from zipfile import ZipFile

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "static/images"


def trim(image):
    image = image.convert("RGB")
    diff = ImageChops.difference(image, Image.new("RGB", image.size, "white"))
    bbox = diff.convert("L").point(lambda x: 255 if x > 35 else 0).getbbox()
    if bbox:
        l, t, r, b = bbox
        return image.crop((max(l-14, 0), max(t-14, 0), min(r+14, image.width), min(b+14, image.height)))
    return image


def save(image, name, max_width=2600):
    image.thumbnail((max_width, 4000), Image.Resampling.LANCZOS)
    image.save(IMAGES / name, "WEBP", quality=93, method=6)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--paper-zip", type=Path, required=True)
    args = parser.parse_args()
    IMAGES.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="frameforge-assets-") as temp:
        temp = Path(temp)
        with ZipFile(args.paper_zip) as source:
            figures = {}
            for stem in ("intro", "pipeline", "ip_case", "edit_case"):
                pdf = temp / f"{stem}.pdf"
                pdf.write_bytes(source.read(f"images/{stem}.pdf"))
                subprocess.run(["pdftoppm", "-scale-to", "3500", "-png", "-singlefile", str(pdf), str(temp/stem)], check=True)
                figures[stem] = Image.open(temp/f"{stem}.png").convert("RGB")
            # The comparison PDFs contain large slide margins. The editing PDF
            # also has off-figure editor annotations at the right and bottom.
            # Keep the complete comparison grid, excluding these annotations.
            subject = figures["ip_case"]
            editing = figures["edit_case"]
            save(trim(subject.crop((0, 0, subject.width, int(subject.width*.37)))), "subject-comparison.webp")
            save(trim(editing.crop((0, 0, int(editing.width*.955), int(editing.width*.37)))), "editing-comparison.webp")
            save(trim(figures["pipeline"]), "pipeline.webp")
            save(trim(figures["intro"]), "motivation.webp", 1800)
            canny = Image.open(io.BytesIO(source.read("images/canny.png"))).convert("RGB")
            save(trim(canny.copy()), "canny-comparison.webp")
            routing = Image.open(io.BytesIO(source.read("images/vis_moe.png"))).convert("RGB")
            save(trim(routing), "routing.webp")
            examples = {}
            for task, image, boxes in (
                ("subject", subject, ((.012,.136,.119,.243), (.246,.136,.353,.243))),
                ("editing", editing, ((.012,.141,.119,.248), (.246,.141,.353,.248))),
                ("canny", canny, ((9/canny.width,48/canny.width,238/canny.width,277/canny.width), (263/canny.width,48/canny.width,491/canny.width,277/canny.width))),
            ):
                for label, box in zip(("input", "output"), boxes):
                    crop = image.crop(tuple(round(v*image.width) for v in box))
                    crop = crop.resize((512,512), Image.Resampling.LANCZOS)
                    save(crop, f"{task}-{label}.webp", 512)
                    examples[f"{task}-{label}"] = crop
            # An unmodified contact sheet of the paper's outputs for sharing.
            preview = Image.new("RGB", (1200,630), "#f6f5f1")
            for index, task in enumerate(("subject", "canny", "editing")):
                crop = examples[f"{task}-output"].resize((380,380), Image.Resampling.LANCZOS)
                preview.paste(crop, (20+index*390,125))
            preview.save(IMAGES/"social-preview.png", optimize=True)
    print("Prepared original paper figures and 512x512 example crops.")


if __name__ == "__main__":
    main()
