#!/usr/bin/env python3
"""Kid-readable story plates + enlarged paper figures for Outside the Line."""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path("/Volumes/Spiral/projects/datathon-outside-the-line")
STORY = ROOT / "story-art"
REFS = STORY / "refs"
PAPER = ROOT / "paper" / "figures"
LOCAL_REFS = ROOT / "paper" / "refs"
DERIVED = ROOT / "data" / "derived"

CREAM = "#ffffff"
WHITE = "#ffffff"
BOARD = "#f4f4f4"
INK = "#221d1a"
GRAY = "#5b5145"
CRIMSON = "#a4122f"
CRIMSON_WASH = "#f3d6d4"
GOLD = "#bd7f1f"
TEAL = "#416f4e"
TEAL_WASH = "#d7e4d6"
NAVY = "#2c4a72"

W, H = 2800, 1760
FONT = "Arial, Helvetica, sans-serif"
UA = "OutsideTheLineDatathon/1.0 (https://github.com/lazyboy1234/outside-the-line; educational reuse)"


def T(s: str) -> str:
    """Keep word spaces visible under librsvg (Helvetica Neue drops them)."""
    return s.replace(" ", "&#160;")


def load(name: str) -> dict:
    return json.loads((DERIVED / name).read_text())


def svg(title: str, body: str, w: int = W, h: int = H) -> str:
    return (
        f'<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
        f'viewBox="0 0 {w} {h}" role="img" aria-label="{title}">\n'
        f"  <title>{title}</title>\n"
        f'  <rect width="{w}" height="{h}" fill="{CREAM}"/>\n'
        f"{body}\n"
        f"</svg>\n"
    )


def write_svg(name: str, title: str, body: str) -> Path:
    path = STORY / f"{name}.svg"
    path.write_text(svg(title, body), encoding="utf-8")
    print(f"wrote {path}")
    return path


def png_from_svg(name: str, width: int = 2800) -> Path:
    src = STORY / f"{name}.svg"
    dst = STORY / f"{name}.png"
    subprocess.run(
        ["rsvg-convert", "-w", str(width), "-b", CREAM, str(src), "-o", str(dst)],
        check=True,
    )
    print(f"wrote {dst} ({dst.stat().st_size} bytes)")
    return dst


def problem_line() -> None:
    body = f"""
  <text x="140" y="150" font-family="{FONT}" font-size="86" font-weight="800" fill="{INK}">{T("They charged here. Not here.")}</text>
  <line x1="140" y1="190" x2="2660" y2="190" stroke="{GOLD}" stroke-width="8"/>

  <rect x="160" y="250" width="2480" height="560" rx="28" fill="{WHITE}" stroke="{CRIMSON}" stroke-width="8" stroke-dasharray="22 16"/>
  <text x="1400" y="400" text-anchor="middle" font-family="{FONT}" font-size="92" font-weight="800" fill="{INK}">BRONX</text>
  <text x="1400" y="490" text-anchor="middle" font-family="{FONT}" font-size="44" font-weight="600" fill="{GRAY}">{T("4 miles north")}</text>
  <text x="1400" y="680" text-anchor="middle" font-family="{FONT}" font-size="108" font-weight="800" fill="{CRIMSON}">{T("NOT HERE")}</text>

  <rect x="160" y="860" width="2480" height="130" rx="16" fill="{CRIMSON}"/>
  <text x="1400" y="950" text-anchor="middle" font-family="{FONT}" font-size="64" font-weight="800" fill="{WHITE}">{T("60TH STREET")}</text>

  <rect x="160" y="1040" width="2480" height="560" rx="28" fill="{CRIMSON_WASH}" stroke="{CRIMSON}" stroke-width="10"/>
  <text x="1400" y="1190" text-anchor="middle" font-family="{FONT}" font-size="92" font-weight="800" fill="{INK}">MANHATTAN</text>
  <text x="1400" y="1280" text-anchor="middle" font-family="{FONT}" font-size="44" font-weight="600" fill="{GRAY}">{T("Paid zone")}</text>
  <text x="1400" y="1470" text-anchor="middle" font-family="{FONT}" font-size="108" font-weight="800" fill="{CRIMSON}">{T("THEY CHARGED HERE")}</text>
"""
    write_svg("problem-line", "They charged here. Not here.", body)
    png_from_svg("problem-line")


def data_tolls() -> None:
    gates = [g["name"] for g in load("crz.json")["gates"]]
    assert len(gates) == 12
    dots = []
    for i in range(12):
        cx = 280 + (i % 6) * 150
        cy = 1180 + (i // 6) * 170
        dots.append(
            f'<circle cx="{cx}" cy="{cy}" r="48" fill="{CRIMSON}" stroke="{INK}" stroke-width="4"/>'
        )
    dots_svg = "\n    ".join(dots)
    body = f"""
  <text x="140" y="150" font-family="{FONT}" font-size="86" font-weight="800" fill="{INK}">{T("12 gates. 0 in the Bronx.")}</text>
  <line x1="140" y1="190" x2="2660" y2="190" stroke="{GOLD}" stroke-width="8"/>

  <rect x="140" y="260" width="1220" height="1320" rx="28" fill="{WHITE}" stroke="{INK}" stroke-width="6"/>
  <text x="750" y="520" text-anchor="middle" font-family="{FONT}" font-size="280" font-weight="800" fill="{CRIMSON}">12</text>
  <text x="750" y="680" text-anchor="middle" font-family="{FONT}" font-size="72" font-weight="800" fill="{INK}">GATES</text>
  <text x="750" y="780" text-anchor="middle" font-family="{FONT}" font-size="36" font-weight="600" fill="{GRAY}">{T("Paid-zone line")}</text>
    {dots_svg}

  <rect x="1440" y="260" width="1220" height="1320" rx="28" fill="{WHITE}" stroke="{CRIMSON}" stroke-width="8" stroke-dasharray="22 16"/>
  <text x="2050" y="520" text-anchor="middle" font-family="{FONT}" font-size="280" font-weight="800" fill="{CRIMSON}">0</text>
  <text x="2050" y="680" text-anchor="middle" font-family="{FONT}" font-size="72" font-weight="800" fill="{INK}">{T("IN THE BRONX")}</text>
  <circle cx="2050" cy="1260" r="150" fill="none" stroke="{CRIMSON}" stroke-width="10" stroke-dasharray="18 14"/>
  <text x="2050" y="1278" text-anchor="middle" font-family="{FONT}" font-size="48" font-weight="800" fill="{CRIMSON}">empty</text>
"""
    write_svg("data-tolls", "12 gates. 0 in the Bronx.", body)
    png_from_svg("data-tolls")
    write_svg("data-twelve-zero", "12 gates. 0 in the Bronx.", body)
    png_from_svg("data-twelve-zero")


def two_asks() -> None:
    trees = []
    for i, (cx, r) in enumerate(((420, 70), (560, 58), (690, 64))):
        trees.append(f'<circle cx="{cx}" cy="720" r="{r}" fill="{TEAL}"/>')
        trees.append(f'<rect x="{cx - 10}" y="780" width="20" height="90" fill="#6b4b30"/>')
    gardens = []
    for i in range(4):
        gx = 360 + i * 150
        gardens.append(
            f'<rect x="{gx}" y="980" width="120" height="46" rx="10" fill="{TEAL_WASH}" stroke="{TEAL}" stroke-width="5"/>'
        )
    trees_svg = "\n    ".join(trees)
    gardens_svg = "\n    ".join(gardens)
    body = f"""
  <text x="140" y="150" font-family="{FONT}" font-size="86" font-weight="800" fill="{INK}">{T("Street now. Lid later.")}</text>
  <line x1="140" y1="190" x2="2660" y2="190" stroke="{GOLD}" stroke-width="8"/>

  <rect x="140" y="250" width="1220" height="1320" rx="28" fill="{WHITE}" stroke="{TEAL}" stroke-width="8"/>
  <rect x="140" y="250" width="1220" height="150" rx="28" fill="{TEAL}"/>
  <rect x="140" y="340" width="1220" height="60" fill="{TEAL}"/>
  <text x="750" y="350" text-anchor="middle" font-family="{FONT}" font-size="56" font-weight="800" fill="{WHITE}">{T("STREET NOW")}</text>
    {trees_svg}
  <rect x="280" y="870" width="940" height="90" fill="#c6b298"/>
    {gardens_svg}
  <text x="750" y="1180" text-anchor="middle" font-family="{FONT}" font-size="48" font-weight="800" fill="{INK}">{T("Trees. Curb. Rain gardens.")}</text>
  <text x="750" y="1280" text-anchor="middle" font-family="{FONT}" font-size="40" font-weight="600" fill="{GRAY}">{T("NYC already pays for this.")}</text>
  <text x="750" y="1440" text-anchor="middle" font-family="{FONT}" font-size="72" font-weight="800" fill="{TEAL}">{T("THIS YEAR")}</text>

  <rect x="1440" y="250" width="1220" height="1320" rx="28" fill="{WHITE}" stroke="{NAVY}" stroke-width="8"/>
  <rect x="1440" y="250" width="1220" height="150" rx="28" fill="{NAVY}"/>
  <rect x="1440" y="340" width="1220" height="60" fill="{NAVY}"/>
  <text x="2050" y="350" text-anchor="middle" font-family="{FONT}" font-size="56" font-weight="800" fill="{WHITE}">{T("LID LATER")}</text>
  <rect x="1620" y="560" width="860" height="220" rx="18" fill="{TEAL}"/>
  <text x="2050" y="690" text-anchor="middle" font-family="{FONT}" font-size="48" font-weight="800" fill="{WHITE}">{T("PARK ON TOP")}</text>
  <rect x="1680" y="780" width="740" height="160" fill="#5b5145"/>
  <rect x="1720" y="820" width="180" height="80" fill="#c6b298"/>
  <rect x="2160" y="820" width="180" height="80" fill="#c6b298"/>
  <text x="2050" y="1080" text-anchor="middle" font-family="{FONT}" font-size="48" font-weight="800" fill="{INK}">{T("Park over the highway")}</text>
  <text x="2050" y="1180" text-anchor="middle" font-family="{FONT}" font-size="40" font-weight="600" fill="{GRAY}">{T("Big. Slow. Not next year.")}</text>
  <text x="2050" y="1440" text-anchor="middle" font-family="{FONT}" font-size="64" font-weight="800" fill="{NAVY}">{T("$250M to $1B+")}</text>
"""
    write_svg("two-asks", "Street now. Lid later.", body)
    png_from_svg("two-asks")


def _arch(x: int, y: int, color: str) -> str:
    return (
        f'<path d="M {x} {y + 70} L {x} {y + 28} '
        f'C {x} {y - 8}, {x + 120} {y - 8}, {x + 120} {y + 28} '
        f'L {x + 120} {y + 70}" fill="none" stroke="{color}" stroke-width="12" stroke-linecap="square"/>'
        f'<line x1="{x - 10}" y1="{y + 70}" x2="{x + 130}" y2="{y + 70}" stroke="{color}" stroke-width="10"/>'
    )


def data_bridges() -> None:
    bt = load("bt.json")
    bronx = bt["did"]["bronx"]["treated"]
    far = bt["did"]["bronx"]["control"]
    tunnels = bt["did"]["cordon"]["treated"]
    short = {
        "Bronx - Whitestone Bridge": "Whitestone",
        "Henry Hudson Bridge": "Henry Hudson",
        "Robert F. Kennedy Bridge Bronx": "RFK Bronx",
        "Throgs Neck Bridge": "Throgs Neck",
        "Cross Bay Bridge": "Cross Bay",
        "Marine Parkway Bridge": "Marine Parkway",
        "Verrazzano - Narrows Bridge": "Verrazzano",
        "Queens Midtown Tunnel": "Queens Midtown",
        "Hugh L. Carey Tunnel": "Hugh L. Carey",
    }

    def column(x: int, title: str, items: list[str], color: str, count: int) -> str:
        cards = [
            f'<rect x="{x}" y="250" width="780" height="1330" rx="28" fill="{WHITE}" stroke="{INK}" stroke-width="6"/>',
            f'<rect x="{x}" y="250" width="780" height="150" rx="28" fill="{color}"/>',
            f'<rect x="{x}" y="340" width="780" height="60" fill="{color}"/>',
            f'<text x="{x + 390}" y="350" text-anchor="middle" font-family="{FONT}" font-size="44" font-weight="800" fill="{WHITE}">{T(f"{title}  ·  {count}")}</text>',
        ]
        for i, name in enumerate(items):
            cy = 500 + i * 240
            label = short.get(name, name)
            cards.append(_arch(x + 80, cy, color))
            cards.append(
                f'<text x="{x + 240}" y="{cy + 58}" font-family="{FONT}" font-size="40" font-weight="800" fill="{INK}">{T(label)}</text>'
            )
        return "\n    ".join(cards)

    body = f"""
  <text x="140" y="150" font-family="{FONT}" font-size="86" font-weight="800" fill="{INK}">{T("Bridges we counted")}</text>
  <line x1="140" y1="190" x2="2660" y2="190" stroke="{GOLD}" stroke-width="8"/>
    {column(140, "BRONX", bronx, CRIMSON, 4)}
    {column(1010, "FAR", far, GOLD, 3)}
    {column(1880, "PAID TUNNELS", tunnels, TEAL, 2)}
"""
    write_svg("data-bridges", "Bridges we counted", body)
    png_from_svg("data-bridges")


def data_street() -> None:
    canyon = load("canyon.json")
    segs = canyon["segments"]
    heights = [s["h_median_ft"] for s in segs]
    traps = [s["trap_risk"] for s in segs]
    max_h = max(heights)
    n = len(segs)
    street_x, street_w = 180, 2440
    base = 1280
    gap = 18
    bw = (street_w - gap * (n - 1)) / n
    buildings = []
    for i, (ht, trap) in enumerate(zip(heights, traps)):
        x = street_x + i * (bw + gap)
        hgt = 180 + 520 * (ht / max_h)
        y = base - hgt
        fill = CRIMSON if trap else TEAL
        buildings.append(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw:.1f}" height="{hgt:.1f}" fill="{fill}" stroke="{INK}" stroke-width="4"/>'
        )
        if trap:
            buildings.append(
                f'<text x="{x + bw / 2:.1f}" y="{y - 24:.1f}" text-anchor="middle" font-family="{FONT}" font-size="34" font-weight="800" fill="{CRIMSON}">TALL</text>'
            )
    trees = []
    for i in range(14):
        tx = 260 + i * 172
        trees.append(f'<circle cx="{tx}" cy="1368" r="46" fill="{TEAL}"/>')
        trees.append(f'<rect x="{tx - 8}" y="1408" width="16" height="48" fill="#6b4b30"/>')

    body = f"""
  <text x="140" y="150" font-family="{FONT}" font-size="86" font-weight="800" fill="{INK}">{T("East 138th Street")}</text>
  <line x1="140" y1="190" x2="2660" y2="190" stroke="{GOLD}" stroke-width="8"/>
  <text x="140" y="270" font-family="{FONT}" font-size="40" font-weight="600" fill="{GRAY}">{T("Buildings + trees. Mott Haven.")}</text>
    {"".join(buildings)}
  <rect x="160" y="1280" width="2480" height="90" fill="#c6b298"/>
    {"".join(trees)}
  <rect x="160" y="1540" width="760" height="140" rx="20" fill="{TEAL_WASH}" stroke="{TEAL}" stroke-width="6"/>
  <text x="540" y="1632" text-anchor="middle" font-family="{FONT}" font-size="56" font-weight="800" fill="{TEAL}">{T("9 OPEN")}</text>
  <rect x="980" y="1540" width="760" height="140" rx="20" fill="{CRIMSON_WASH}" stroke="{CRIMSON}" stroke-width="6"/>
  <text x="1360" y="1632" text-anchor="middle" font-family="{FONT}" font-size="56" font-weight="800" fill="{CRIMSON}">{T("1 TALL")}</text>
  <rect x="1800" y="1540" width="840" height="140" rx="20" fill="{WHITE}" stroke="{INK}" stroke-width="6"/>
  <text x="2220" y="1632" text-anchor="middle" font-family="{FONT}" font-size="56" font-weight="800" fill="{INK}">{T("81 TREES")}</text>
"""
    write_svg("data-street", "East 138th Street buildings and trees", body)
    png_from_svg("data-street")


def data_money() -> None:
    body = f"""
  <text x="140" y="150" font-family="{FONT}" font-size="86" font-weight="800" fill="{INK}">{T("$15,510 vs $31,238")}</text>
  <line x1="140" y1="190" x2="2660" y2="190" stroke="{GOLD}" stroke-width="8"/>

  <rect x="180" y="700" width="820" height="520" rx="12" fill="{CRIMSON}" stroke="{INK}" stroke-width="6"/>
  <text x="590" y="920" text-anchor="middle" font-family="{FONT}" font-size="92" font-weight="800" fill="{WHITE}">$15,510</text>
  <text x="590" y="1020" text-anchor="middle" font-family="{FONT}" font-size="48" font-weight="800" fill="{WHITE}">HERE</text>

  <rect x="1100" y="360" width="820" height="860" rx="12" fill="{NAVY}" stroke="{INK}" stroke-width="6"/>
  <text x="1510" y="760" text-anchor="middle" font-family="{FONT}" font-size="92" font-weight="800" fill="{WHITE}">$31,238</text>
  <text x="1510" y="860" text-anchor="middle" font-family="{FONT}" font-size="48" font-weight="800" fill="{WHITE}">CITY</text>

  <rect x="2040" y="360" width="580" height="860" rx="28" fill="{WHITE}" stroke="{CRIMSON}" stroke-width="8"/>
  <text x="2330" y="480" text-anchor="middle" font-family="{FONT}" font-size="48" font-weight="800" fill="{INK}">HEAT</text>
  <text x="2330" y="620" text-anchor="middle" font-family="{FONT}" font-size="140" font-weight="800" fill="{CRIMSON}">5/5</text>
"""
    chips = []
    for i in range(5):
        chips.append(
            f'<rect x="{2098 + i * 92}" y="1020" width="80" height="80" rx="8" fill="{CRIMSON}" stroke="{INK}" stroke-width="4"/>'
        )
    body = body + "  " + "\n  ".join(chips)
    write_svg("data-money", "$15,510 vs $31,238. Heat 5/5.", body)
    png_from_svg("data-money")


def enlarge_paper_figures() -> None:
    src = (PAPER / "generate_figures.py").read_text(encoding="utf-8")
    src = src.replace('OUT = ROOT / "paper" / "figures"', 'OUT = ROOT / "story-art"')
    src = src.replace(
        '"font.sans-serif": ["Arial", "DejaVu Sans"]',
        '"font.sans-serif": ["Arial", "DejaVu Sans"]',
    )
    src = src.replace(
        "fig.savefig(\n        path,\n        format=\"svg\",",
        "fig.savefig(path.with_suffix('.png'), dpi=160, facecolor=CREAM, edgecolor='none')\n    fig.savefig(\n        path,\n        format=\"svg\",",
    )

    def bump_num(match: re.Match[str]) -> str:
        raw = match.group(0)
        val = float(raw)
        if val < 3:
            return raw
        return f"{val * 1.85:.2f}".rstrip("0").rstrip(".")

    src = re.sub(r'(?<=fontsize=)(\d+(?:\.\d+)?)', bump_num, src)
    src = re.sub(r'(?<=fontsize": )(\d+(?:\.\d+)?)', bump_num, src)
    src = re.sub(r'(?<=\bfs=)(\d+(?:\.\d+)?)', bump_num, src)
    src = src.replace(
        "fig = plt.figure(figsize=(w, h), facecolor=CREAM)",
        "fig = plt.figure(figsize=(w * 1.75, h * 1.75), facecolor=CREAM)",
    )
    src = src.replace('"font.size": 8.5', '"font.size": 16')
    src = src.replace('"axes.titlesize": 10.5', '"axes.titlesize": 20')
    src = src.replace('"legend.fontsize": 7.5', '"legend.fontsize": 14')
    tmp = STORY / "_gen_paper_big.py"
    tmp.write_text(src, encoding="utf-8")
    subprocess.run(["python3", str(tmp)], check=True)
    tmp.unlink()
    print("paper figures written from matplotlib (Arial, no rsvg)")


def commons_file_info(title: str) -> dict:
    if not title.startswith("File:"):
        title = f"File:{title}"
    qs = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|size|mime",
            "format": "json",
        }
    )
    req = urllib.request.Request(
        f"https://commons.wikimedia.org/w/api.php?{qs}",
        headers={"User-Agent": UA},
    )
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = json.load(resp)
    page = next(iter(data["query"]["pages"].values()))
    info = page["imageinfo"][0]
    meta = info.get("extmetadata", {})
    return {
        "title": page.get("title", title),
        "url": info["url"],
        "descriptionurl": info.get("descriptionurl", ""),
        "artist": meta.get("Artist", {}).get("value", ""),
        "license": meta.get("LicenseShortName", {}).get("value", ""),
        "credit": meta.get("Credit", {}).get("value", ""),
    }


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=90) as resp, dest.open("wb") as out:
        shutil.copyfileobj(resp, out)
    print(f"fetched {dest.name} ({dest.stat().st_size} bytes)")


def strip_tags(html: str) -> str:
    return re.sub(r"<[^>]+>", "", html or "").strip()


def fetch_refs() -> list[dict]:
    REFS.mkdir(parents=True, exist_ok=True)
    copies = [
        ("cbdtp-mta-sign.jpg", "crz-cbdtp-sign.jpg"),
        ("crz-gantry-9th-ave.jpg", "crz-gantry-9th-ave.jpg"),
        ("crz-dot-sign.svg", "crz-dot-sign.svg"),
        ("e138th-coned-truck.jpg", "mott-haven-e138th.jpg"),
        ("deegan-from-e138th-jeh.jpg", "deegan-from-e138th-jeh.jpg"),
        ("deegan-from-e138th-south.jpg", "deegan-from-e138th-south.jpg"),
    ]
    for src_name, dst_name in copies:
        src = LOCAL_REFS / src_name
        dst = REFS / dst_name
        if src.exists():
            shutil.copy2(src, dst)
            print(f"copied {src_name} -> {dst_name}")
        else:
            print(f"missing local {src_name}")

    fetch_list = [
        (
            "St. Ann's Avenue and 138th Street, 2024-06-16, Mott Haven, South Bronx, New York.jpg",
            "mott-haven-st-anns-138th.jpg",
        ),
        (
            "05 13 2022 Parade Ground Brooklyn NYC Sidewalk Thornless Honey locust.jpg",
            "street-trees-honeylocust.jpg",
        ),
    ]
    records = []
    for commons_name, dest_name in fetch_list:
        info = commons_file_info(commons_name)
        dest = REFS / dest_name
        download(info["url"], dest)
        records.append(
            {
                "file": dest_name,
                "commons": info["title"],
                "page": info["descriptionurl"],
                "license": info["license"],
                "artist": strip_tags(info["artist"]),
            }
        )
    return records


def write_sources(fetched: list[dict]) -> None:
    rows = [
        "filename\tcommons / source\twhat it is\tlicense / attribution",
        "crz-cbdtp-sign.jpg\thttps://commons.wikimedia.org/wiki/File:CBDTP_Sign.jpg\tMTA CBDTP / congestion-pricing street sign\tCC BY 2.0; MTAPhotos / Metropolitan Transportation Authority",
        "crz-gantry-9th-ave.jpg\thttps://commons.wikimedia.org/wiki/File:Congestion_pricing_cameras_9th_Av_2023_jeh.jpg\tCRZ gantry cameras on Ninth Avenue at the 60th Street cordon\tCC BY-SA 4.0; Jim.henderson",
        "crz-dot-sign.svg\thttps://commons.wikimedia.org/wiki/File:NYCDOT_SI-1816M.svg\tNYC DOT congestion-pricing regulatory sign artwork (SI-1816M)\tPublic domain; design NYC DOT; vectorization Bigguy637",
        "mott-haven-e138th.jpg\thttps://commons.wikimedia.org/wiki/File:2024-05-30_11_27_34_Consolidated_Edison_(ConEd)_truck_along_East_138th_Street_in_the_Bronx,_New_York_City,_New_York.jpg\tEast 138th Street, Mott Haven, May 2024\tCC BY-SA 4.0; Famartin",
        "deegan-from-e138th-jeh.jpg\thttps://commons.wikimedia.org/wiki/File:Major_Deegan_Expressway_from_138th_Street_overpass_jeh.jpg\tMajor Deegan Expressway from the East 138th Street overpass\tPublic domain; Jim.henderson",
        "deegan-from-e138th-south.jpg\thttps://commons.wikimedia.org/wiki/File:2024-05-30_11_36_20_View_south_along_Interstate_87_(Major_Deegan_Expressway)_from_the_overpass_for_East_138th_Street_in_the_Bronx,_New_York_City,_New_York.jpg\tI-87 Major Deegan looking south from East 138th Street, 2024\tCC BY-SA 4.0; Famartin",
    ]
    for rec in fetched:
        rows.append(
            f"{rec['file']}\t{rec['page']}\t{rec['commons']}\t{rec['license']}; {rec['artist']}"
        )
    rows.extend(
        [
            "",
            "# Diagrams in ../ were drawn for this site from project derived JSON.",
            "# problem-line, data-tolls, data-twelve-zero ← data/derived/crz.json ← NYC Open Data t6yz-b64h",
            "# two-asks ← street package now / Deegan lid later (HANDOFF two-horizon close)",
            "# data-bridges ← data/derived/bt.json ← MTA B&T ebfx-2m7v",
            "# data-street ← data/derived/canyon.json ← OTI 5zhs-2jue + Street Tree Census uvpi-gqnh",
            "# data-money ← data/derived/economics.json ← NFH r3dx-pew9 + HVI 4mhf-duep",
            "# fig1–fig5 are enlarged regenerations of paper/figures.",
            "# No pirated PDFs. Wikimedia / MTA public / NYC open only.",
        ]
    )
    path = REFS / "SOURCES.txt"
    path.write_text("\n".join(rows) + "\n", encoding="utf-8")
    print(f"wrote {path}")


def resize_refs(max_edge: int = 2400) -> None:
    for path in sorted(REFS.glob("*")):
        if path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        if path.stat().st_size < 1_200_000:
            continue
        tmp = path.with_suffix(path.suffix + ".tmp")
        subprocess.run(
            [
                "magick",
                str(path),
                "-resize",
                f"{max_edge}x{max_edge}>",
                "-quality",
                "84",
                str(tmp),
            ],
            check=True,
        )
        tmp.replace(path)
        print(f"resized {path.name} ({path.stat().st_size} bytes)")


def main() -> None:
    import sys

    skip_fetch = "--skip-fetch" in sys.argv
    STORY.mkdir(parents=True, exist_ok=True)
    REFS.mkdir(parents=True, exist_ok=True)
    problem_line()
    data_tolls()
    two_asks()
    data_bridges()
    data_street()
    data_money()
    enlarge_paper_figures()
    if skip_fetch:
        resize_refs()
        return
    fetched = fetch_refs()
    write_sources(fetched)
    resize_refs()


if __name__ == "__main__":
    main()
