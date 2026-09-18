# Citywide corridor scan

Exhaustive score of every vehicular CSCL street segment in five boroughs, chained into 0.8–2.0 km corridor windows, ranked under three weight sets. Run on Dell ablesBeast (40 cores). Code: `analysis/citywide/`. Raw stay on the Dell at `/home/jessica/otl/raw/`; scored parquet stays there too (~21 MB segments, ~3.5 MB windows).

## Verdict

**East 138th Street holds.** Among 33,785 corridor windows, the best window that covers at least half of our East 138th design centerline ranks:

| Weights | Rank (all windows) | Percentile | Non-overlap rank | Bronx rank |
|---|---:|---:|---:|---:|
| equal | 22 / 33785 | 99.94 | 3 / 4163 | 22 / 3981 |
| burden | 21 / 33785 | 99.94 | 3 / 4158 | 21 / 3981 |
| feasibility | 82 / 33785 | 99.76 | 13 / 4156 | 60 / 3981 |

After dropping zoo / airport / unnamed / service-road junk (Jungle World Rd, JFK access, unnamed stubs), the top of the equal and burden lists is Southern Blvd, then East 138th. Southern Blvd wins on canopy gap + heat + asthma without a published post-fee monitor on the corridor. East 138th is the highest-ranked corridor that also sits on a measured post-fee air hit (SBU / Deegan + Third Ave Bridge) and a bridge landing.

## What was scored

Per CSCL `rw_type=1` segment (99,357 candidates; highways and ramps are exposure sources, not candidates):

- Facade H/W from Building Footprints `5zhs-2jue` (1.08M roofs) within 25 m / 60 m
- Living trees per 100 m from Street Tree Census `uvpi-gqnh`
- Distance-decayed exposure to MTA bridge landings, CSCL ramps (`rw_type=9`), CSCL highways (`rw_type=2`)
- Nearest published post-fee monitor within 1.5 km (`data/derived/published.json`)
- HVI (`4mhf-duep` + ZCTA), NFH (`r3dx-pew9` + 2010 PUMA), asthma ED by UHF42 (EHDP 2380 / 2379 / 2048, 2023)
- Du Bois flag: within 400 m of a below-grade or elevated CSCL highway

Windows slide along each street chain to ~1.6 km. Dimensions are percentile-ranked citywide (1 = strongest case). Weights: equal 1/8 each; burden (air/health/econ/heat heavy); feasibility (H/W + canopy + exposure heavy).

## Top streets (junk filtered)

Equal / burden: Southern Blvd, **E 138 St**, Boone Ave, E 141 St / Park Ave. Feasibility pulls in more Queens service geometry; after the same junk filter Southern Blvd still leads, then 148 St, Park Ave, Westchester Ave.

Full tables: `data/derived/citywide/corridors_top25.json`, position: `e138_position.json`. Figures: `story-art/fig-citywide-rank.{svg,png}`, `story-art/map-citywide-heat.png`.

## Bridge spill DiD (Job B)

Bronx-adjacent MTA crossings vs Verrazzano / Cross Bay / Marine Parkway, same Jan 5–Dec 31 window, 2024 vs 2025.

- Point estimate: **−0.15%** (log DiD −0.00146)
- Exact facility-label permutation p (two-sided): **0.77** (35 assignments)
- Week block-bootstrap 95% CI: **[−1.10%, +0.80%]** (10,000 boots)
- Leave-one-facility jackknife range: **[−0.44%, +0.23%]**

No evidence of a Bronx dump in the MTA crossing series. File: `data/derived/citywide/did_inference.json`.

## Limits

- Grain mismatches: PUMA vs ZCTA vs UHF42 vs CSCL segment.
- Monitor coverage is thin (6.7k of 99k segments have a published monitor within 1.5 km); most of the city has null `monitor_signal` and that dimension is dropped from those windows' weighted mean.
- CSCL street names include zoo roads and airport stubs; filter before reading the top of the list.
- Facade H/W needs buildings on both sides; otherwise we fall back to CSCL curb width, which is narrower and makes more segments look "tree-effective."
- Overpass was not used for the citywide job (CSCL only). The separate 10-candidate site-selection script still fights Overpass; OSMnx is the right fix there.
- Staten Island was included (prompt allowed dropping it).

## Reproduce

```bash
bash analysis/citywide/run_on_dell.sh
# then on Dell:
/home/jessica/.conda/envs/otl/bin/python code/segments.py --procs 36
/home/jessica/.conda/envs/otl/bin/python code/corridors.py
/home/jessica/.conda/envs/otl/bin/python code/figures.py
/home/jessica/.conda/envs/otl/bin/python code/did_inference.py --procs 36
```
