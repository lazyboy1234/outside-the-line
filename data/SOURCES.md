# Data sources

Every number in this project comes from one of two places: a primary API pull that our pipeline performs and reduces, or a published result that we transcribed by hand with a citation. This file lists both, with URLs, coverage, what we used each for, and what each one cannot tell you.

Primary pulls are fetched by `analysis/fetch_data.py` into `data/raw/` and reduced by `analysis/run_analysis.py` into `data/derived/`. Transcribed published results live in the `PUBLISHED` block of `analysis/run_analysis.py` and are written verbatim to `data/derived/published.json`; we performed no computation on them beyond reporting.

---

## Primary datasets

### 1. MTA Congestion Relief Zone Vehicle Entries

| | |
|---|---|
| **Type** | Primary pull |
| **Dataset ID** | `t6yz-b64h` |
| **Portal** | NY State Open Data, data.ny.gov |
| **Landing page** | https://data.ny.gov/Transportation/MTA-Congestion-Relief-Zone-Vehicle-Entries-Beginnin/t6yz-b64h |
| **SODA endpoint** | https://data.ny.gov/resource/t6yz-b64h.json |
| **Coverage in our pull** | 2025-01-05 through 2026-09-05 |
| **Grain** | 10-minute block × detection group × detection region × vehicle class × time period |
| **Derived output** | `data/derived/crz.json`, `data/derived/one_day.json` |

**What we used it for.** Total CRZ and excluded-roadway entries for calendar 2025; the complete gate and region inventory that establishes there is no Bronx detection region; monthly totals; hour-of-day profiles by vehicle class; the peak versus overnight share comparison that produces the truck-retiming finding; and one full ten-minute day (Tuesday, 2025-03-11) animated on the map.

**Limitations.** This is the single most important caveat in the project: **the file begins on the first tolled day and contains no pre-toll observations.** No before/after test is possible on it, and any such statistic computed from it is an artifact. We use it descriptively only. It also covers cordon entry points exclusively, so it observes nothing on any Bronx roadway. Class totals in `crz.json` span the full file rather than calendar 2025; the 2025 headline totals come from a separately scoped query.

---

### 2. MTA Bridges and Tunnels Hourly Crossings

| | |
|---|---|
| **Type** | Primary pull |
| **Dataset ID** | `ebfx-2m7v` |
| **Portal** | NY State Open Data, data.ny.gov |
| **Landing page** | https://data.ny.gov/Transportation/MTA-Bridges-and-Tunnels-Hourly-Crossings-Beginning-/ebfx-2m7v |
| **SODA endpoint** | https://data.ny.gov/resource/ebfx-2m7v.json |
| **Coverage in our pull** | Daily and monthly panel from 2023-01-01; annual totals from 2019 |
| **Grain** | Hour × facility × direction, aggregated by us to day, month, and year |
| **Derived output** | `data/derived/bt.json` |

**What we used it for.** All causal work. Calendar 2024-to-2025 facility changes; a monthly facility panel; and the two difference-in-differences event studies (Bronx-adjacent crossings versus far controls, and cordon-crossing tunnels versus the same controls as a positive control), with CR1 cluster-robust standard errors and exact wild cluster bootstrap p-values.

**Limitations.** Covers MTA Bridges and Tunnels facilities only. It does not observe Port Authority crossings, free East River bridges, or any expressway or surface street, which means it cannot see traffic on the Major Deegan, Bruckner, or Cross Bronx. Facility counts are total crossings and do not break out vehicle class in our aggregation. With only ten facilities, the cluster count is small and constrains achievable p-values (floor of 1/2^(G−1): 0.016 at G = 7, 0.062 at G = 5).

---

### 3. NYC Building Footprints (OTI)

| | |
|---|---|
| **Type** | Primary pull |
| **Dataset ID** | `5zhs-2jue` |
| **Portal** | NYC Open Data, data.cityofnewyork.us |
| **Landing page** | https://data.cityofnewyork.us/City-Government/Building-Footprints/5zhs-2jue |
| **SODA endpoint** | https://data.cityofnewyork.us/resource/5zhs-2jue.json |
| **Coverage in our pull** | Bounding box −73.9330, 40.8040 to −73.9120, 40.8155 (Mott Haven / E 138th St study box) |
| **Fields used** | `bin`, `height_roof`, `ground_elevation`, `construction_year`, `the_geom` |
| **Derived output** | `data/derived/canyon.json`, `data/derived/buildings.geojson` |

**What we used it for.** The street-canyon geometry. 1,714 footprints fall in the study strip, 220 within 45 m of the fitted centerline, and 116 in the 6-to-30 m fronting band used for the height and width statistics. This yields facade-to-facade width of 40.3 m, roof-height percentiles of 50.3 ft (p50) and 57.4 ft (p75), a corridor median height-to-width ratio of 0.38, a p75 ratio of 0.43, and segment-level ratios for ten 120 m segments of which one exceeds 0.50, at 0.58.

**Limitations.** `height_roof` is a modeled roof height from photogrammetry, not a surveyed parapet elevation, and it does not distinguish rooftop mechanical structures. Our centerline is fitted to street-tree positions rather than taken from a street centerline file, so offsets carry fit error at bends. Width is inferred from building setbacks and is therefore facade-to-facade, not curb-to-curb. Segments with fewer than three fronting footprints were dropped, which is why ten of fourteen possible 120 m bins are reported. These figures are a corridor-scale proxy, not a site survey.

---

### 4. NYC 2015 Street Tree Census

| | |
|---|---|
| **Type** | Primary pull |
| **Dataset ID** | `uvpi-gqnh` |
| **Portal** | NYC Open Data, data.cityofnewyork.us |
| **Landing page** | https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/uvpi-gqnh |
| **SODA endpoint** | https://data.cityofnewyork.us/resource/uvpi-gqnh.json |
| **Coverage in our pull** | Same Mott Haven bounding box |
| **Fields used** | `tree_id`, `status`, `health`, `spc_common`, `spc_latin`, `tree_dbh`, `latitude`, `longitude`, `address` |
| **Derived output** | `data/derived/canyon.json` |

**What we used it for.** The canopy gap and the species inventory: 1,779 living trees in the study box, 81 on the corridor band within 35 m of the centerline, about 5.0 per 100 m of street, median trunk diameter 8 inches. Species on the band are honeylocust (30), American linden (7), English oak (5), American elm (5), Sophora (5), littleleaf linden (4), Japanese zelkova (4), and pin oak (4). Exactly one London planetree sits on the band, and none in the single over-threshold segment. Tree positions along the corridor also supply the 83 points used to fit the street centerline.

**Limitations.** The census is from 2015 and is the most recent complete public street-tree inventory; trees have been planted, removed, and lost in the decade since, so counts should be read as a baseline rather than a current census. It covers street trees only, not park or private-lot trees. It records trunk diameter but not crown area, so canopy extent in our model is estimated from an assumed crown diameter rather than measured.

### 4a. NYC Street Centerline (CSCL): Major Deegan alignment

| | |
|---|---|
| **Type** | Reference lookup (not fetched by the pipeline) |
| **Dataset ID** | `inkn-q76z` |
| **Portal** | NYC Open Data, data.cityofnewyork.us |
| **SODA endpoint** | https://data.cityofnewyork.us/resource/inkn-q76z.json |
| **Query** | `full_street_name = 'MAJOR DEEGAN EXPY'` within the Mott Haven box |
| **Derived output** | `DEEGAN_CENTERLINE` constant in `analysis/run_analysis.py`; `deegan_cap` ring in `data/derived/geo.json` |

**What we used it for.** Eight mainline vertices between E 138th and E 149th, read off the CSCL at 0.001-degree latitude steps, define the centerline of the proposed Deegan cap. The cap footprint is that polyline buffered 24 m each side (a 48 m deck); its area, 12.9 acres, is computed from the ring rather than assumed.

**Limitations.** The vertices are hand-transcribed, not pulled programmatically, so the alignment is accurate to roughly 10–20 m. It is a concept footprint for sizing, not an engineering right-of-way.

---

### 5. NYC DOT Automated Traffic Volume Counts

| | |
|---|---|
| **Type** | Primary pull |
| **Dataset ID** | `7ym2-wayt` |
| **Portal** | NYC Open Data, data.cityofnewyork.us |
| **Landing page** | https://data.cityofnewyork.us/Transportation/Automated-Traffic-Volume-Counts/7ym2-wayt |
| **SODA endpoint** | https://data.cityofnewyork.us/resource/7ym2-wayt.json |
| **Coverage in our pull** | 2000 through 2026, verified against the live endpoint on 2026-09-16 |
| **Grain** | One **15-minute** vehicle count per segment, direction, and timestamp |
| **Fields used** | `boro`, `yr`, `m`, `d`, `hh`, `mm`, `vol`, `segmentid`, `street`, `fromst`, `tost`, `direction`, `requestid`, `wktgeom` |
| **Fetched by** | `analysis/fetch_dot.py`, into eleven `data/raw/dot_*.json` files |
| **Derived output** | `data/derived/dot.json`, written by `analysis/analyze_dot.py` |

**What we used it for.** The street-level test of South Bronx diversion, which neither MTA dataset can perform because both observe crossings rather than surface streets. The intended design was paired and distribution-free: one median complete-weekday 24-hour volume per site, pairs keyed on segment identifier and direction, and a Wilcoxon signed-rank test on per-site log volume ratios. What came out is a coverage finding rather than an effect estimate. Citywide the dataset yields 28 usable pairs, 13 of which bracket the toll start; the Bronx yields two pairs and zero that bracket it. We also used the file to document corridor-by-corridor coverage for the roadways the prompt names (53 segments counted before tolling, 11 after, and exactly one segment on both sides) and to bank a post-tolling street-level baseline of median weekday volumes with hour-of-day profiles at every South Bronx location counted after January 2025.

**Limitations.** `vol` is a 15-minute count, not an hourly one; reading it as hourly overstates every volume fourfold. These are short-duration automated studies that rotate locations year to year, so the dataset is a sample of places rather than a continuous time series: roughly 100 distinct segments are counted citywide per year (104 in 2024, 101 in 2025), and the Bronx carries 12 and 16 in those two years. Aggregate coverage on both sides of 2025-01-05 therefore does not imply panel coverage at any given location, and for the South Bronx roadways in the prompt it does not exist at all. The file records volumes only, with no vehicle classification, so it cannot speak to the truck share that drives South Bronx air-quality concern. Two specific data-quality traps are recorded in `data/derived/dot.json` and discussed in `SUBMISSION.md`: Pelham Parkway segment `9008825` is a single study filed twice across 2024 and 2025 under request 38599, with identical daily volumes and flipped direction labels; and Bruckner Boulevard segment `9014571` has a genuine 2018-versus-2025 repeat whose only complete 2018 days are a Saturday and a Sunday.

**Alternatives checked and rejected.** Both were examined before settling on `7ym2-wayt`, and both are recorded here because a rejected source is part of an honest trail.

| Dataset | ID | Why rejected |
|---|---|---|
| Traffic Volume Counts (Historical) | `btm5-ppia` | Coverage ends 2021-05-09, so it holds no post-congestion-pricing observations at all. |
| Vehicle Classification Counts (2011–2025) | `96ay-ea4r` | 117 counted segments in 2024 and 308 in 2025 and later, with **zero** `segmentid` overlap between them anywhere in the city, so it supports no paired pre/post design either. It also carries no borough column. Endpoint: https://data.cityofnewyork.us/resource/96ay-ea4r.json |

---

## Transcribed published results

None of these were recomputed by us. Each is reported as published, with its citation, and the four air-quality studies are deliberately kept separate and never averaged. All are stored in `data/derived/published.json`.

### 6. Cornell / npj Clean Air: counterfactual modeling inside the zone

| | |
|---|---|
| **Type** | Transcribed published result |
| **Citation** | Fraser et al., *npj Clean Air* 1:39 (2025) |
| **URL** | https://www.nature.com/articles/s44407-025-00037-2 |
| **Coverage** | First six months of tolling, 2025 |

**What we used.** A 22 percent reduction in daily-maximum PM2.5 inside the Congestion Relief Zone relative to a modeled no-toll counterfactual, equal to −3.05 µg/m³ against a 13.8 µg/m³ baseline; −1.07 µg/m³ across the five boroughs; −0.70 µg/m³ metro-wide; 11 percent traffic reduction.

**Limitations.** The comparison is against a modeled counterfactual, so the estimate inherits that model's assumptions. It describes daily-maximum concentrations inside the zone over six months and is not an annual-mean or citywide figure; it must not be quoted as one.

### 7. Research Square preprint: difference-in-differences at NYCCAS sites

| | |
|---|---|
| **Type** | Transcribed published result (preprint, not peer reviewed) |
| **Citation** | "Variable Short-Term Air Quality Impacts of NYC Congestion Pricing," Research Square preprint, December 2025 |
| **URL** | https://doi.org/10.21203/rs.3.rs-8158429/v1 |
| **Coverage** | Six real-time NYCCAS monitoring sites, 2025 |

**What we used.** PM2.5 coefficients at four reported sites: Queensboro Bridge −9.08 percent (the only significant decrease), Williamsburg Bridge +6.30 percent, Cross Bronx Expressway +3.74 percent, Broadway at West 35th Street +2.46 percent; NO2 down 23 percent in Manhattan with increases up to 33 percent in the eastern boroughs.

**Limitations.** Preprint status means no peer review. Six sites were tested at α = 0.05, giving a family-wise error rate near 26 percent, so the single significant decrease may not survive a Benjamini-Hochberg correction. Site coverage is sparse relative to the geography being described.

### 8. South Bronx Unite with Columbia, Brown, and CU Boulder: community sensors

| | |
|---|---|
| **Type** | Transcribed published result |
| **Citation** | South Bronx Unite with Columbia University, Brown University, and CU Boulder (2026) |
| **URL** | https://www.southbronxunite.org/press-and-media/slight-increase-in-air-pollution-post-congestion-pricing |
| **Coverage** | 19 community PM2.5 sensors, calendar 2024 versus 2025 |

**What we used.** Increases at 12 to 14 of 19 sensors; mean change +0.22 µg/m³; peak +1.29 µg/m³ at the Major Deegan and Third Avenue Bridge, which is the sensor nearest our design site.

**Limitations.** Low-cost community sensors require humidity correction and co-location calibration; the comparison is a year-over-year difference rather than a controlled design, so it does not isolate a congestion-pricing effect from weather, regional background, or local activity. We cite it as a measurement of what the air did, not as evidence of a diversion mechanism.

### 9. NYC DOHMH: congestion pricing air quality report

| | |
|---|---|
| **Type** | Transcribed published result |
| **Citation** | NYC Department of Health and Mental Hygiene, Congestion Pricing Air Quality Report |
| **URL** | https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/congestion-pricing-report/ |
| **Coverage** | Integrated NYCCAS monitors, one year post-implementation, Van Wyck Expressway as a non-affected control |

**What we used.** The finding of no statistically significant congestion-pricing-attributable change at either CRZ or environmental-justice highway corridors; traffic's share of NYC PM2.5 at roughly 14 percent and of NOx at roughly 20 percent.

**Limitations.** Integrated (filter-based) monitors have coarse time resolution relative to event studies, and one year is a short window for detecting small annual-mean changes. A null here is a null, not evidence of no effect.

### 10. NYC Environment and Health Data Portal: Hunts Point and Mott Haven

| | |
|---|---|
| **Type** | Transcribed published result |
| **Citation** | NYC Environment & Health Data Portal, Hunts Point–Mott Haven neighborhood report, Asthma and the Environment |
| **URL** | https://a816-dohbesp.nyc.gov/IndicatorPublic/neighborhood-reports/hunts_point_mott_haven/asthma_and_the_environment/ |
| **Coverage** | Neighborhood-level indicators; vegetative cover 2017; citywide canopy 2021 |

**What we used.** Adult asthma emergency department visits 193.5 per 10,000 versus 66.4 citywide; child (5–17) visits 266.2 per 10,000 versus 143.7 citywide; PM2.5-attributable child asthma ED visits 147 per 100,000 versus 62 citywide; vegetative cover 18 percent in 2017; NYC tree canopy 23.4 percent in 2021 against a 30 percent goal for 2040.

**Limitations.** Neighborhood-level (community district scale) rates conceal within-neighborhood variation. The indicator years differ from each other and from our traffic window. PM2.5-attributable counts are themselves model estimates produced from a concentration-response function, not direct observations.

### 11. MTA first-anniversary press release

| | |
|---|---|
| **Type** | Transcribed published result |
| **Citation** | MTA press release, congestion pricing first anniversary |
| **URL** | https://www.mta.info/press-release/icymi-less-traffic-better-transit-its-first-anniversary-governor-hochul-celebrates |
| **Coverage** | First year of tolling |

**What we used.** CRZ entries roughly 11 percent below the no-toll counterfactual, about 27 million fewer vehicles.

**Limitations.** An agency communication rather than a peer-reviewed analysis, and a counterfactual comparison whose modeling is not published alongside it. We report it as the operator's stated figure, and our own causal estimates are independent of it.

### 12. i-Tree Eco methodology

| | |
|---|---|
| **Type** | Methodology reference, applied by us at planning grade |
| **Source** | i-Tree Eco, USDA Forest Service: https://www.itreetools.org/ ; removal rates after Nowak and Hirabayashi urban-forest pollutant-removal work |
| **PM2.5 rate citation** | Nowak, Hirabayashi, Bodine and Hoehn, "Modeled PM2.5 removal by trees in ten U.S. cities and associated health effects," *Environmental Pollution* 178:395-402 (2013), which models 2010 conditions and publishes 0.24 g/m²/yr for New York City specifically |
| **URL** | https://doi.org/10.1016/j.envpol.2013.03.050 |
| **Applied in** | `data/derived/itree.json` |

**What we used.** Annual removal multipliers per square meter of effective canopy: PM2.5 0.24 g/m²/yr, NO2 0.70 g/m²/yr, O3 1.20 g/m²/yr, with green wall weighted at 0.5 effectiveness and green roof at 0.35, and 1.27 m of annual rainfall for the stormwater estimate. Applied to a program of 180 open-crown trees, 40,000 ft² of green wall, 8 acres of green roof, and 36 bioswales, this yields about 10.6 lb/yr PM2.5, 31.0 lb/yr NO2, 53.2 lb/yr O3, and about 7.2 million gallons per year of stormwater interception, plus 25 lb/yr of additional PM2.5 removal from the 12.9-acre Deegan cap concept.

**Where each multiplier comes from.** PM2.5 at 0.24 g/m²/yr is the New York City value in Nowak, Hirabayashi, Bodine and Hoehn (2013), cited above. NO2 at 0.70 g/m²/yr is the conterminous-US urban-area average in Nowak, Hirabayashi, Bodine and Greenfield, "Tree and forest effects on air quality and human health in the United States," *Environmental Pollution* 193:119-129 (2014), Table 5; it is a published figure, but not a New York one. O3 at 1.20 g/m²/yr cannot be traced to a published source: the same 2014 table gives 5.40 g/m²/yr for urban areas, and Nowak, Crane and Stevens (2006) gives 3.7 g/m²/yr for New York. Both the NO2 and O3 rates therefore fall below the published values, so the NO2 and O3 removal figures above understate removal.

**Limitations.** This is a planning-grade calculation, not an i-Tree Eco field run and not a dispersion model. It assumes a 7 m crown diameter at maturity and applies flat literature rates rather than species-specific, leaf-area-indexed, local-meteorology-driven deposition. The 8-to-15 percent street-level PM2.5 reduction range is a literature range, not our own estimate. Treat every figure here as an order-of-magnitude planning number, which is exactly how the submission uses it.

### 13. Cornell Urban Horticulture Institute: species salt tolerance

| | |
|---|---|
| **Type** | Methodology reference for species selection |
| **Source** | Cornell Urban Horticulture Institute, urban tree species selection guidance: http://www.hort.cornell.edu/uhi/ |

**What we used.** Salt-tolerance ratings supporting the selection of honeylocust (*Gleditsia triacanthos* var. *inermis*), Kentucky coffeetree (*Gymnocladus dioicus*), and Japanese zelkova (*Zelkova serrata*) for a heavily salted truck route.

**Limitations.** Tolerance ratings are qualitative and regional. They do not substitute for a soil test or a site-specific planting assessment.

### 14. NYC Neighborhood Financial Health Digital Mapping and Data Tool

| | |
|---|---|
| **Type** | Primary pull |
| **Dataset ID** | `r3dx-pew9` |
| **Portal** | NYC Open Data |
| **Landing page** | https://data.cityofnewyork.us/Business/Neighborhood-Financial-Health-Digital-Mapping-and-/r3dx-pew9 |
| **SODA endpoint** | https://data.cityofnewyork.us/resource/r3dx-pew9.json |
| **Coverage in our pull** | Full table, year_published 2020; 55 PUMAs × goal rows (~385) |
| **Grain** | PUMA × financial-health goal |
| **Derived output** | `data/derived/economics.json` via `analysis/derive_econ.py` |

**What we used it for.** Site PUMA 3710 (Hunts Point, Longwood & Melrose; BX Community Districts 1 & 2): median income $15,510, poverty rate 29.3%, Overall Neighborhood Financial Health rank 51 / Bottom score band, Jobs & Income rank 55. Citywide PUMA averages for income and poverty, plus income rank ascending (2nd-lowest citywide). Contrast to CRZ-core Manhattan PUMA 3807 (Chelsea / Clinton / Midtown).

**Limitations.** PUMA geography is coarser than the East 138th design strip. Mott Haven sits inside PUMA 3710 with Hunts Point, Longwood, and Melrose; we do not claim block-level income from this file. Ranks are relative within the published tool, not a causal model of congestion pricing.

### 15. NYC Heat Vulnerability Index (HVI)

| | |
|---|---|
| **Type** | Primary pull |
| **Dataset ID** | `4mhf-duep` |
| **Portal** | NYC Open Data |
| **Landing page** | https://data.cityofnewyork.us/Health/Heat-Vulnerability-Index-HVI-/4mhf-duep |
| **SODA endpoint** | https://data.cityofnewyork.us/resource/4mhf-duep.json |
| **Coverage in our pull** | ZCTAs 10451, 10454, 10455, 10459 |
| **Grain** | ZCTA |
| **Derived output** | `data/derived/economics.json` (`hvi` block) |

**What we used it for.** All four site ZCTAs score **5** on the 1–5 Heat Vulnerability Index scale (maximum).

**Limitations.** HVI is a composite neighborhood heat-risk score, not a measured temperature or a traffic-pollution outcome. We use it as equity context beside asthma and income, not as a congestion-pricing effect.

### 16. NYC CDBG Eligibility by Census Tract (optional support)

| | |
|---|---|
| **Type** | Primary pull (optional) |
| **Dataset ID** | `qmcw-ur37` |
| **Portal** | NYC Open Data |
| **SODA endpoint** | https://data.cityofnewyork.us/resource/qmcw-ur37.json |
| **Coverage in our pull** | Bronx tracts (`borocode=2`) |
| **Derived output** | Optional `cdbg` block in `data/derived/economics.json` |

**What we used it for.** A short derived fact that selected Mott Haven / Melrose tracts near the design site are CD Eligible with high low-moderate income share (`lomod_pct`). Support only; not a headline figure on the map.

**Limitations.** Tract boundaries are not the East 138th corridor. We report only sampled CD Eligible tracts we can place near the site; we do not invent eligibility.
