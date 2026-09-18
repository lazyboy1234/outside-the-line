#!/usr/bin/env python3
"""Stitch public OSM raster tiles into story-art plates. One-time export."""

from __future__ import annotations

import io
import math
import time
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path("/Volumes/Spiral/projects/datathon-outside-the-line")
OUT = ROOT / "story-art"
UA = "OutsideTheLineDatathon/1.0 (https://github.com/lazyboy1234/outside-the-line; educational reuse)"
TILE = 256
W, H = 1280, 1680

# lat, lon, zoom — locked geography from data/derived/geo.json
PLATES = {
    "osm-cordon": (40.768, -73.965, 13),       # 60th Street line; paid Manhattan south; Mott Haven north
    "osm-mott-haven": (40.809, -73.922, 16),   # Mott Haven / E 138th
    "osm-findings": (40.810, -73.922, 15),     # E 138th, Deegan, Mott Haven
    "osm-deegan": (40.814, -73.928, 16),       # Deegan 138th–149th, Bronx side
}


def deg2num(lat: float, lon: float, z: int) -> tuple[float, float]:
    n = 2**z
    xtile = (lon + 180.0) / 360.0 * n
    lat_rad = math.radians(lat)
    ytile = (1.0 - math.log(math.tan(lat_rad) + 1.0 / math.cos(lat_rad)) / math.pi) / 2.0 * n
    return xtile, ytile


def fetch_tile(z: int, x: int, y: int) -> Image.Image:
    n = 2**z
    x %= n
    y = min(max(y, 0), n - 1)
    url = f"https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return Image.open(io.BytesIO(resp.read())).convert("RGB")


def stitch(lat: float, lon: float, z: int) -> Image.Image:
    cx, cy = deg2num(lat, lon, z)
    left = cx * TILE - W / 2
    top = cy * TILE - H / 2
    x0 = int(math.floor(left / TILE))
    y0 = int(math.floor(top / TILE))
    x1 = int(math.floor((left + W - 1) / TILE))
    y1 = int(math.floor((top + H - 1) / TILE))
    canvas = Image.new("RGB", (W, H), "#e6e2d8")
    for ty in range(y0, y1 + 1):
        for tx in range(x0, x1 + 1):
            tile = fetch_tile(z, tx, ty)
            canvas.paste(tile, (int(tx * TILE - left), int(ty * TILE - top)))
            time.sleep(0.2)
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (lat, lon, z) in PLATES.items():
        path = OUT / f"{name}.jpg"
        print(f"export {name} z{z} {lat},{lon}")
        im = stitch(lat, lon, z)
        im.save(path, "JPEG", quality=84, optimize=True)
        print(f"wrote {path} ({path.stat().st_size} bytes)")
    (OUT / "OSM-SOURCES.txt").write_text(
        "OpenStreetMap raster tiles (https://tile.openstreetmap.org), © OpenStreetMap contributors, ODbL.\n"
        "Exported once for this page. See https://www.openstreetmap.org/copyright\n"
        "osm-cordon: 40.768, -73.965, z13 — 60th Street line; paid Manhattan south; Mott Haven north\n"
        "osm-mott-haven: 40.809, -73.922, z16 — Mott Haven / East 138th\n"
        "osm-findings: 40.810, -73.922, z15 — East 138th, Deegan, Mott Haven\n"
        "osm-deegan: 40.814, -73.928, z16 — Deegan 138th–149th, Bronx side\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
