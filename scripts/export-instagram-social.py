#!/usr/bin/env python3
"""
Export Instagram-friendly sizes from public/images/social/*.png

- 1080×1080 (1:1 feed)
- 1080×1350 (4:5 portrait — more vertical space in feed)

Images are scaled to fit (contain), centered on a ClaimSaver-style navy background.
"""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image

# Slate-900-ish navy; matches typical ClaimSaver+ brand feel
BG = (15, 23, 42)
SIZES = (
    ("1x1", 1080, 1080),
    ("4x5", 1080, 1350),
)


def fit_on_canvas(img: Image.Image, cw: int, ch: int) -> Image.Image:
    # Downsample very large sources first so resize stays fast
    iw, ih = img.size
    max_target = max(cw, ch)
    max_src = max(iw, ih)
    if max_src > max_target * 3:
        pre_scale = (max_target * 3) / max_src
        img = img.resize(
            (max(1, int(iw * pre_scale)), max(1, int(ih * pre_scale))),
            Image.Resampling.LANCZOS,
        )
        iw, ih = img.size

    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
        bg_rgba = Image.new("RGBA", (cw, ch), (*BG, 255))
        scale = min(cw / iw, ch / ih)
        nw, nh = max(1, int(iw * scale)), max(1, int(ih * scale))
        resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
        x, y = (cw - nw) // 2, (ch - nh) // 2
        bg_rgba.paste(resized, (x, y), resized)
        return bg_rgba.convert("RGB")
    img = img.convert("RGB")
    canvas = Image.new("RGB", (cw, ch), BG)
    iw, ih = img.size
    scale = min(cw / iw, ch / ih)
    nw, nh = max(1, int(iw * scale)), max(1, int(ih * scale))
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    x, y = (cw - nw) // 2, (ch - nh) // 2
    canvas.paste(resized, (x, y))
    return canvas


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    social = root / "public" / "images" / "social"
    for label, w, h in SIZES:
        out_dir = social / "instagram" / label
        out_dir.mkdir(parents=True, exist_ok=True)

    count = 0
    for path in sorted(social.glob("week*.png")):
        if path.parent.name == "instagram":
            continue
        with Image.open(path) as im:
            for label, w, h in SIZES:
                out = fit_on_canvas(im.copy(), w, h)
                dest = social / "instagram" / label / path.name
                # Default zlib level; avoid optimize=True (very slow on large PNGs)
                out.save(dest, "PNG", compress_level=6)
                count += 1
    print(f"Wrote {count} files under {social / 'instagram'}")


if __name__ == "__main__":
    main()
