#!/usr/bin/env python3
"""Figures for the citywide corridor scan.

fig-citywide-rank.svg/.png   top 15 non-overlapping corridors under the primary (equal)
                             weights, stacked by dimension contribution; East 138th
                             highlighted where it lands, appended as a reference bar
                             when it is outside the top 15.
map-citywide-heat.png        corridor windows coloured by total (equal weights) over
                             the borough outlines; East 138th outlined.

White background, Arial. fix_svg_spaces / save copied from paper/figures/generate_figures.py.
Run (Dell):  python figures.py --out /home/jessica/otl/out --raw /home/jessica/otl/raw
"""
from __future__ import annotations

import argparse
import json
import re
import textwrap
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.colors import LinearSegmentedColormap  # noqa: E402
from matplotlib.patches import Patch  # noqa: E402

CREAM = "#ffffff"
INK = "#221d1a"
GRAY = "#5b5145"
CRIMSON = "#a4122f"
GOLD = "#bd7f1f"
TEAL = "#416f4e"
RULE = "#d9d9d9"

DIM_COLORS = {
    "exposure": "#6b4b30",
    "monitor": "#e0a93f",
    "health": CRIMSON,
    "econ": "#e0594a",
    "heat": GOLD,
    "hw": TEAL,
    "canopy_gap": "#8fb896",
    "dubois": "#2c4a72",
}
DIM_LABELS = {
    "exposure": "Highway / ramp / bridge exposure",
    "monitor": "Post-fee monitor direction",
    "health": "Asthma ED visits (UHF42)",
    "econ": "Income / poverty / NFH (PUMA)",
    "heat": "Heat vulnerability (ZCTA)",
    "hw": "Tree-effective H/W",
    "canopy_gap": "Canopy gap (few trees)",
    "dubois": "Du Bois: below/elevated highway",
}


def style() -> None:
    plt.rcParams.update({
        "svg.fonttype": "none",
        "font.family": "sans-serif",
        "font.sans-serif": ["Arial", "Liberation Sans", "DejaVu Sans"],
        "font.size": 8.5,
        "axes.edgecolor": INK, "axes.labelcolor": INK, "axes.linewidth": 0.6,
        "axes.titlesize": 10.5, "axes.titleweight": "semibold", "axes.titlecolor": INK,
        "xtick.color": INK, "ytick.color": INK,
        "xtick.major.width": 0.5, "ytick.major.width": 0.5, "xtick.major.size": 3, "ytick.major.size": 3,
        "legend.frameon": False, "legend.fontsize": 7.5,
        "figure.facecolor": CREAM, "savefig.facecolor": CREAM, "text.color": INK, "pdf.fonttype": 42,
    })


def caption_block(fig, title: str, source: str) -> None:
    fig.text(0.012, 0.975, title, fontsize=11, fontweight="semibold", color=INK, va="top", ha="left")
    fig.add_artist(plt.Line2D([0.012, 0.988], [0.932, 0.932], transform=fig.transFigure, color=GOLD, lw=1.15,
                              clip_on=False, solid_capstyle="butt"))
    fig.text(0.012, 0.012, textwrap.fill(source, 150), fontsize=6.2, color=GRAY, va="bottom", ha="left")


def fix_svg_spaces(path: Path) -> None:
    """Keep word spaces visible. Helvetica Neue / some SVG viewers drop them."""
    text = path.read_text(encoding="utf-8")
    text = text.replace("Helvetica Neue", "Arial")
    text = text.replace("'Helvetica', ", "")
    text = text.replace("Helvetica, ", "")
    text = text.replace(
        "*{stroke-linejoin: round; stroke-linecap: butt}",
        "*{stroke-linejoin:round;stroke-linecap:butt;letter-spacing:normal}",
    )

    def repl(m: re.Match[str]) -> str:
        tag, inner, end = m.group(1), m.group(2), m.group(3)
        if "letter-spacing" not in tag:
            if 'style="' in tag:
                tag = tag.replace('style="', 'style="letter-spacing:normal; ', 1)
            else:
                tag = tag[:-1] + ' style="letter-spacing:normal">'
        if "xml:space" not in tag:
            tag = tag[:-1] + ' xml:space="preserve">'
        inner = inner.replace("&#160;", "\u00a0").replace(" ", "\u00a0")
        return tag + inner + end

    text = re.sub(r"(<text\b[^>]*>)(.*?)(</text>)", repl, text, flags=re.DOTALL)
    path.write_text(text, encoding="utf-8")


def save(fig, out: Path, name: str, png: bool = True) -> None:
    path = out / name
    fig.savefig(path, format="svg", bbox_inches="tight", pad_inches=0.12, facecolor=CREAM, edgecolor="none",
                metadata={"Title": name, "Creator": "Outside the Line / analysis/citywide/figures.py"})
    fix_svg_spaces(path)
    print(f"wrote {path} ({path.stat().st_size} bytes)")
    if png:
        p2 = path.with_suffix(".png")
        fig.savefig(p2, format="png", dpi=220, bbox_inches="tight", pad_inches=0.12, facecolor=CREAM, edgecolor="none")
        print(f"wrote {p2} ({p2.stat().st_size} bytes)")
    plt.close(fig)


def short_street(s: str) -> str:
    s = s.title()
    for a, b in (("Ave", "Ave"), ("St", "St"), ("Blvd", "Blvd"), ("Pkwy", "Pkwy"), ("Rd", "Rd"), ("Expwy", "Expwy")):
        s = re.sub(rf"\b{a}\b", b, s)
    return s


def fig_rank(top: dict, e138: dict, out: Path, weights: str = "equal") -> None:
    rows = top["top25"][weights][:15]
    dims = list(DIM_COLORS)
    e_pos = e138["by_weights"][weights]
    e_in_top = any(r["e138_design_overlap"] > 0 for r in rows)
    if not e_in_top and e_pos:
        rows = rows + [None, e_pos["best_window"]]
    n = len(rows)
    # Wide canvas: plot left, single-column legend in the right gutter, Sources alone at bottom.
    fig = plt.figure(figsize=(9.4, 0.34 * n + 1.85), facecolor=CREAM)
    caption_block(
        fig,
        f"Citywide corridor scan: top 15 street windows, {weights} weights",
        "Sources: CSCL inkn-q76z, Building Footprints 5zhs-2jue, 2015 Street Tree Census uvpi-gqnh, HVI 4mhf-duep, NFH r3dx-pew9, "
        "EHDP asthma ED visits (UHF42), MTA B&T facilities, published post-fee monitor changes. "
        f"{top['n_windows']:,} windows of 0.8–2.0 km on {top['n_street_chains']:,} street chains; percentile-rank normalization; "
        "bars are weight × normalized dimension; non-overlapping windows. Derived: data/derived/citywide/corridors_top25.json.",
    )
    # Leave ~22% of figure width as a true right gutter for the legend.
    ax = fig.add_axes([0.24, 0.16, 0.46, 0.71])
    ax.set_facecolor(CREAM)
    ys = list(range(n))[::-1]
    labels = []
    for y, r in zip(ys, rows):
        if r is None:
            labels.append("")
            ax.axhline(y, color=RULE, lw=0.6, ls=":")
            continue
        left = 0.0
        is_e = r["e138_design_overlap"] > 0
        for d in dims:
            v = r["contributions"].get(d) or 0.0
            ax.barh(y, v, left=left, color=DIM_COLORS[d], edgecolor=INK if is_e else "none", linewidth=0.5 if is_e else 0,
                    height=0.7, zorder=2)
            left += v
        rank = r["rank_nonoverlap"]
        ax.text(left + 0.006, y, f"{left:.3f}" + (f"  (#{rank} of {e_pos['n_nonoverlap']:,} non-overlapping)" if is_e and not e_in_top else ""),
                va="center", ha="left", fontsize=6.8, color=CRIMSON if is_e else INK, fontweight="semibold" if is_e else "regular")
        lab = f"{rank}. {short_street(r['street'])}, {r['borough']}"
        labels.append(lab)
    ax.set_yticks(ys)
    ax.set_yticklabels(labels, fontsize=7.4)
    for t, r in zip(ax.get_yticklabels(), rows):
        if r is not None and r["e138_design_overlap"] > 0:
            t.set_color(CRIMSON)
            t.set_fontweight("semibold")
    ax.set_xlim(0, 1.0)
    ax.set_xlabel("Total score (weighted sum of percentile-ranked dimensions)")
    ax.spines[["top", "right"]].set_visible(False)
    ax.tick_params(axis="y", length=0)
    fig.legend(
        handles=[Patch(color=DIM_COLORS[d], label=DIM_LABELS[d]) for d in dims],
        loc="upper left",
        bbox_to_anchor=(0.72, 0.88),
        bbox_transform=fig.transFigure,
        ncol=1,
        handlelength=1.15,
        handletextpad=0.45,
        borderaxespad=0.0,
        fontsize=6.6,
        labelspacing=0.55,
    )
    if e_pos:
        n_win = e_pos["n_windows"] if "n_windows" in e_pos else e138["n_windows"]
        fig.text(
            0.24, 0.078,
            f"East 138th (Mott Haven) best window: rank {e_pos['rank_all_windows']:,} of {n_win:,} windows, "
            f"{e_pos['percentile_all_windows']:.1f}th percentile",
            ha="left", va="bottom", fontsize=6.6, color=CRIMSON, fontweight="semibold",
        )
    save(fig, out, "fig-citywide-rank.svg")


def map_heat(out: Path, raw: Path) -> None:
    import geopandas as gpd  # heavy; only needed for the map

    win = gpd.read_parquet(out / "corridor_windows.parquet").to_crs(2263)
    seg = gpd.read_parquet(out / "segments_scored.parquet", columns=["geometry", "borough"]).to_crs(2263)
    boro = gpd.read_file(raw / "puma2010.geojson").to_crs(2263)
    cmap = LinearSegmentedColormap.from_list("otl", ["#f3efe6", "#e0a93f", "#e0594a", "#a4122f", "#3b0a12"])
    # Tall canvas + tight axes: map fills the plate; colorbar sits mid-right above sources.
    fig = plt.figure(figsize=(9.0, 10.2), facecolor=CREAM)
    caption_block(
        fig,
        "Citywide corridor scan: total score (equal weights) for every 0.8–2.0 km street window",
        "Windows drawn on their trunk centerline; grey = candidate CSCL streets (rw_type 1). East 138th design corridor outlined in ink. "
        "Sources as in fig-citywide-rank. Derived: data/derived/citywide/corridors_ranked.csv.",
    )
    ax = fig.add_axes([0.01, 0.055, 0.90, 0.855])
    ax.set_facecolor(CREAM)
    boro.dissolve().boundary.plot(ax=ax, color="#bdb6aa", linewidth=0.5, zorder=1)
    seg.plot(ax=ax, color="#e4e0d8", linewidth=0.15, zorder=2)
    win = win.sort_values("total_equal")
    win.plot(ax=ax, column="total_equal", cmap=cmap, linewidth=0.9, zorder=3, legend=False, vmin=0.2, vmax=0.85)
    e = win[win["e138_design_overlap"] > 0.5]
    if not e.empty:
        e.plot(ax=ax, color="none", edgecolor=INK, linewidth=2.6, zorder=4)
        c = e.geometry.iloc[0].centroid
        ax.annotate("East 138th, Mott Haven", xy=(c.x, c.y), xytext=(c.x + 26000, c.y + 22000), fontsize=7.5, color=INK,
                    fontweight="semibold", arrowprops=dict(arrowstyle="-", color=INK, lw=0.7))
    ax.set_axis_off()
    ax.set_aspect("equal")
    # Clip empty water margins so the boroughs fill the axes.
    xmin, ymin, xmax, ymax = win.total_bounds
    pad_x = (xmax - xmin) * 0.02
    pad_y = (ymax - ymin) * 0.02
    ax.set_xlim(xmin - pad_x, xmax + pad_x)
    ax.set_ylim(ymin - pad_y, ymax + pad_y)
    sm = plt.cm.ScalarMappable(cmap=cmap, norm=plt.Normalize(0.2, 0.85))
    cax = fig.add_axes([0.915, 0.28, 0.022, 0.42])
    cb = fig.colorbar(sm, cax=cax)
    cb.set_label("Total score, equal weights (0–1)", fontsize=7.5)
    cb.ax.tick_params(labelsize=7)
    cb.outline.set_linewidth(0.5)
    p = out / "map-citywide-heat.png"
    fig.savefig(p, format="png", dpi=220, bbox_inches="tight", pad_inches=0.06, facecolor=CREAM)
    plt.close(fig)
    print(f"wrote {p} ({p.stat().st_size} bytes)")

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="/home/jessica/otl/out")
    ap.add_argument("--raw", default="/home/jessica/otl/raw")
    a = ap.parse_args()
    out, raw = Path(a.out), Path(a.raw)
    style()
    top = json.loads((out / "corridors_top25.json").read_text())
    e138 = json.loads((out / "e138_position.json").read_text())
    fig_rank(top, e138, out)
    map_heat(out, raw)


if __name__ == "__main__":
    main()
