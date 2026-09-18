# Outside the Line

**Macaulay Honors College Datathon 2026, "Reimagining NYC: Congestion Pricing, Air Quality & Environmental Justice." Part 1 and Part 2.**

Team: **Cody Wong** and **Daniel Postelnik**, Macaulay Honors College. Contact: CODY.WONG96@login.cuny.edu, DANIEL.POSTELNIK61@login.cuny.edu.

Live site (the submission): **https://lazyboy1234.github.io/outside-the-line/**
Research page: https://lazyboy1234.github.io/outside-the-line/paper.html
Code and data: https://github.com/lazyboy1234/outside-the-line

Category targeted: **Best Urban Design.**

Every number in this document comes out of `data/derived/*.json`, built by `analysis/fetch_data.py`, `analysis/run_analysis.py`, `analysis/fetch_dot.py`, `analysis/analyze_dot.py`, and `analysis/tree_siting.py`. Published numbers are cited to the paper, the page, and the figure or table every time they show up.

---

## 1. How we came up with the idea

For some context, congestion prices in downtown Manhattan are there because it's obviously a high-traffic area. Trains would logically cut car use by discouraging people who drive from taking a car, and getting them onto the MTA instead. Now the issue is whether this fee is eliminating the pollution by actually encouraging more MTA use, or whether it's increasing car use on other pathways.

That was the question before we opened a single file. The brief hands every team the same headline. Fraser et al., *npj Clean Air* 1:39 (2025), report that "average daily maximum PM2.5 concentrations declined by 3.05 μg/m³ (SE = 0.022) within the CRZ during the first six months. This represents a 22% reduction from a projected average of 13.8 μg/m³ without the policy." That sentence is the paper's abstract; the bars are Fig. 1 and the nine models behind the bars are Table 1 [1]. The brief then asks whether "the 22% headline obscured a more mixed daily/peak-hour picture."

We took the 22 percent seriously, which meant reading where it lives. Fraser's 22 percent is measured at six monitors inside the zone, 3,114 monitor-days, against a model of what the air would have done with no toll (Fraser et al. 2025, Methods and Fig. 2A) [1]. Mott Haven is about four miles north of the nearest of those six. So the first thing we asked wasn't "is 22 right." It was "22 where."

Then we pulled the fee file, MTA Congestion Relief Zone Vehicle Entries (`t6yz-b64h`) [6]. It has twelve detection gates in seven detection regions: Brooklyn, East 60th St, FDR Drive, New Jersey, Queens, West 60th St, West Side Highway. The Bronx region list is empty. Zero gates. That's the whole reason the Bronx became our question. The gate situation for picking the Bronx can be best explained by the fact only bridges exist up top. A car coming out of the Bronx into Manhattan crosses the Harlem River on a bridge; the fee gates sit at 60th Street, miles south of that. So a Bronx driver never touches the fee file, and the fee file can never tell you what happened in the Bronx. If we wanted to know whether cars piled up there, we had to ask on the bridges, with a file that has a before. That file is MTA Bridges and Tunnels Hourly Crossings (`ebfx-2m7v`) [7].

That gave us Part 1. The brief also says the two parts are one argument: you can't put Du Bois's forest inside a city until something stops needing the land at street level. Our Part 1 said the Bronx never got the policy, so nothing was freed up there. That's what sent us to East 138th Street with a tape measure instead of a slogan. Part 2 is where the trees go on that street, block by block, and what each piece costs.

---

## 2. What data was online, what we picked, what we skipped and why

The brief's "Possible Data Sources" list names NYCCAS, the DOHMH evaluation, MTA bridge and tunnel counts, DOT counts, asthma rates, EJ designations, the truck route network, the NYC Tree Map and i-Tree Eco, and the MTA environmental review. We went through each. The column that mattered most was "has a before?", because the toll started January 5, 2025, and any claim about change needs data from both sides of that date.

| Source | ID / cite | What it is | Has a before? | What we used it for | Why we picked it, or why we skipped it |
|---|---|---|---|---|---|
| MTA Congestion Relief Zone Vehicle Entries | `t6yz-b64h` [6] | 10-minute counts at every fee gate, by vehicle class and time period, 2025-01-05 to 2026-09-05 | **No.** Starts on the first tolled day. | Gate inventory (12 gates, 0 Bronx). 2025 totals. Overnight share by class. One full Tuesday (2025-03-11) animated on the map. | Picked, descriptive only. Any before/after computed inside this file compares tolled days to tolled days. |
| MTA Bridges and Tunnels Hourly Crossings | `ebfx-2m7v` [7] | Hourly crossings at 10 MTA facilities, 2019 on | **Yes.** Daily and monthly from 2023, annual from 2019. | All causal work. The Bronx bridge test and the paid-tunnel check. | Picked. The only traffic file we found with a real pre-period at places a Bronx driver actually crosses. |
| NYC DOT Automated Traffic Volume Counts | `7ym2-wayt` [8] | 15-minute counts at rotating street segments, 2000 to 2026 | **In aggregate yes, at any one South Bronx segment no.** | The street-level test the brief asks for. Result is a coverage hole, reported as a finding. | Picked, then reported honestly. The brief names DOT counts; we had to show what they can and can't do. |
| DOT Traffic Volume Counts (Historical) | `btm5-ppia` | Older DOT count file | Ends 2021-05-09 | Nothing | Skipped. No post-toll rows. |
| DOT Vehicle Classification Counts | `96ay-ea4r` | Counts by vehicle class, 2011 to 2025 | Zero segment overlap between 2024 and 2025 anywhere in the city | Nothing | Skipped. No paired design possible; no borough column. |
| NYC Building Footprints | `5zhs-2jue` [9] | Every building polygon with `height_roof` | n/a (geometry) | Height-to-width ratio for ten 120 m blocks of East 138th | Picked. This is how we measured the street instead of guessing. |
| NYC 2015 Street Tree Census | `uvpi-gqnh` [10] | Every street tree, species, trunk size, location | n/a (2015 baseline) | 81 living trees on the corridor band; which blocks are thin; the centerline fit | Picked. It's the last complete public street-tree count. It's a decade old and we say so. |
| NYC Street Centerline | `inkn-q76z` | Street geometry | n/a | Eight Deegan vertices to size the lid footprint (12.9 acres) | Reference lookup only, hand-read. |
| Neighborhood Financial Health | `r3dx-pew9` [11] | Income, poverty, financial-health rank by PUMA, 2020 | n/a | $15,510 median income, 29.3% poverty, Bottom NFH for Hunts Point, Longwood & Melrose | Picked. The SODA endpoint works without a key. |
| Heat Vulnerability Index | `4mhf-duep` [12] | Heat risk 1 to 5 by ZIP area | n/a | HVI 5 of 5 at 10451, 10454, 10455, 10459 | Picked. |
| CDBG Eligibility by Tract | `qmcw-ur37` | Low-moderate income share by tract | n/a | Four tracts near the site, 94 to 100 percent low-moderate | Support only. Not on the map. |
| Census Reporter / ACS API | | Block-group income | n/a | Nothing | Skipped. Blocked without a key at build time; we didn't want to depend on it. |
| Fraser et al. replication files | [timothyfraser/nyc_congestion_rep](https://github.com/timothyfraser/nyc_congestion_rep) [1] | R code, `NYC_PM25_Monitor_Location.csv`, hourly PM2.5 2019 to 2025, zone entries, census and weather pulls | Yes (their panel) | Monitor coordinates, to place the six zone monitors and the Mott Haven station relative to East 138th | Picked for geography. We did not rebuild their nine models; see Section 4. |
| Barber, Cornell MS thesis (May 2026) | [2] | Generalized synthetic control on monthly PM2.5, CBD vs other boroughs, 15 stations | Yes (May 2024 to June 2025) | His 13 percent, Table A.8, p. 54. His p. 25 quote of Fraser's 22 percent. | Picked as a second, separate Cornell number. Not merged with Fraser. |
| Research Square DiD preprint (Dec 2025) | [3] | Difference-in-differences at six NYCCAS real-time sites | Yes | Site-level PM2.5 coefficients | Transcribed, kept apart. Preprint, not peer reviewed. |
| South Bronx Unite with Columbia, Brown, CU Boulder (2026) | [4] | 19 community PM2.5 sensors, 2024 vs 2025 | Yes | The +1.29 μg/m³ peak at the Major Deegan and Third Avenue Bridge | Transcribed, kept apart. Nearest measurement to our street. |
| NYC DOHMH Congestion Pricing Air Quality Report | [5] | Integrated NYCCAS monitors, one year, Van Wyck as control | Yes | Their null; traffic's 14 percent share of PM2.5 | Transcribed, kept apart. |
| NYC EH Data Portal, Hunts Point–Mott Haven | [13] | Asthma ED rates, vegetative cover | n/a | 193.5 vs 66.4 adult asthma ED per 10,000; 18 percent vegetative cover 2017 | Transcribed. |
| NYCCAS raw monitor data | | The city's own PM2.5 network | Yes | Coordinates only | We did not compute an air-quality effect ourselves. The MTA Open Data team's note on this prompt says air needs wind and weather controls; the four published studies have those and we don't. We cite instead of assert. |
| i-Tree Eco / Nowak et al. | [14][15] | Pollutant-removal rates per m² of canopy | n/a | Planning-grade pounds per year for the corridor | Picked as the brief asks. Planning grade, not a field run. |

The rule we followed: primary pulls get computed on, published results get transcribed and cited, and the two are never mixed into one number.

---

## 3. Part 1 method and results

### 3.1 Trucks at $9 and $2.25

A car pays $9 in the morning and $2.25 at night, so more trucks go at night because if you're a company you'd cut your trucking cost by going at night, which is what people do. The truck schedule is steeper than the car one: a small truck pays $14.40 peak and $3.60 overnight, a large multi-unit truck pays $21.60 peak and $5.40 overnight, and trucks pay on every entry while cars pay once a day (MTA CRZ toll schedule, 2025-2027, `data/derived/policy_cost.json`) [16].

We checked this against the fee file. In `t6yz-b64h`, multi-unit trucks take 31.8 percent of their entries in the overnight window. Cars take 19.7 percent. That's a 12.1-point gap. With 166 million car entries and 625 thousand multi-unit truck entries the chi-square p-value is zero for any gap at all, so it carries no information; the effect size, Cramér's V, is 0.0185, and the 12.1 points is the substantive result (`data/derived/crz.json`, `truck_overnight_test`).

What we can't say is that trucks "moved" to the night because of the toll. The fee file has no day before the toll. This is a cross-section of 2025 behavior that lines up with the price schedule; it isn't a before/after. Fraser et al. do have a before on entries, and their Fig. 5B shows "a notable early drop in multi-unit truck entries," with heavy-duty truck entries down about 18 percent from January to June 2025 (Fraser et al. 2025, Fig. 5B) [1]. That is their number from their panel, and we report it as theirs.

### 3.2 The Bronx bridges did not fill up

The popular story is that the toll pushed cars out of Manhattan and into the South Bronx. We tested it on the bridges, because up top the bridges are the only place a Bronx driver gets counted.

**Design.** `ebfx-2m7v` gives a monthly panel per facility. The outcome is the year-over-year change in log monthly vehicles, which takes out each bridge's own seasonal shape. Facility fixed effects, month fixed effects, and a treated-by-month event study indexed to January 2025 with December 2024 as the reference, window January 2024 through December 2025. Treated: Robert F. Kennedy Bridge Bronx approach, Bronx-Whitestone, Throgs Neck, Henry Hudson. Controls: Verrazzano-Narrows, Cross Bay, Marine Parkway, all far from the zone with no toll-dodging route through it. Standard errors are CR1 cluster-robust by facility; with seven clusters the t-stat over-rejects, so the pooled p-value is an exact wild cluster bootstrap with Rademacher weights, all 2^G sign flips, null imposed. That bootstrap has a floor of 1/2^(G-1): 0.016 at seven clusters, 0.062 at five. We print the floor.

**Raw 2024 to 2025 first** (`data/derived/bt.json`):

| Facility | Group | 2024 | 2025 | Change |
|---|---|---:|---:|---:|
| RFK Bridge Bronx | Bronx-adjacent | 52,506,343 | 52,574,751 | +0.13% |
| Bronx-Whitestone | Bronx-adjacent | 49,893,667 | 50,700,608 | +1.62% |
| Throgs Neck | Bronx-adjacent | 45,182,230 | 45,245,619 | +0.14% |
| Henry Hudson | Bronx-adjacent | 25,243,179 | 25,313,379 | +0.28% |
| Queens Midtown Tunnel | Paid-zone tunnel | 30,433,062 | 30,024,381 | -1.34% |
| Hugh L. Carey Tunnel | Paid-zone tunnel | 22,626,078 | 21,981,320 | -2.85% |
| Verrazzano-Narrows | Far control | 81,000,607 | 81,160,067 | +0.20% |
| Cross Bay | Far control | 7,774,075 | 7,823,341 | +0.63% |
| Marine Parkway | Far control | 7,994,115 | 8,113,733 | +1.50% |

Every Bronx bridge grew less than Marine Parkway, a small bridge in southern Queens with nothing to do with the toll.

**Bronx result.** Pooled difference-in-differences, Bronx-adjacent versus far controls: **-1.04 percent, 95 percent CI [-3.63, +1.61], wild cluster bootstrap p = 0.49** (t = -0.78, 168 facility-months, 7 clusters, 128 draws). Mean absolute pre-period coefficient is 1.24 percent; that's the noise floor and it supports parallel trends. Post-period mean is -1.29 percent. The treated-minus-control gap never opens upward after January 2025. The two months that are individually significant are February 2025 at -5.20 percent [-9.80, -0.36] and April 2025 at -4.53 percent [-8.38, -0.51], both down, both inside the swing already present before the toll (June 2024 reads -5.08 percent). We did not find an increase. We don't claim a decrease either.

**Positive control.** A null only means something if the method can see an effect where one should be. So we ran the same model on the two tunnels that feed the paid zone, Queens Midtown and Hugh L. Carey, against the same three controls: **-2.29 percent, 95 percent CI [-3.39, -1.18], p = 0.0625** (t = -4.03, 120 facility-months, 5 clusters). January 2025 alone is **-9.18 percent [-11.33, -6.98]**, then -7.90, -7.98, -6.79 through April before it eases over the summer. The 0.0625 is the exact bootstrap floor for five clusters; it's the smallest number this design can print, not a weak signal. The method catches a nine-percent January drop where the toll bit and catches nothing at the Bronx bridges.

**What this doesn't cover.** These are MTA tolled crossings. The free Harlem River bridges (Third Avenue, Willis Avenue, Madison Avenue, 145th Street and the rest) belong to NYC DOT and aren't in `ebfx-2m7v`. The Major Deegan, the Bruckner, and the Cross Bronx aren't in it either. The CI rules out a large pile-up at the tolled Bronx crossings; it doesn't rule out a small one, and it says nothing about free roads. That's why we went to DOT next.

### 3.3 The DOT hole

The brief names DOT traffic counts. `7ym2-wayt` is the live one: 15-minute counts (not hourly; reading `vol` as hourly overstates every number fourfold), 2000 through 2026, at short-duration count sites that rotate around the city. About 100 segments get counted per year citywide (104 in 2024, 101 in 2025). The Bronx got 12 and 16.

We set up a paired test: one median complete-weekday 24-hour volume per site, pairs keyed on segment ID and direction so lane count and geometry cancel, Wilcoxon signed-rank on the per-site log ratios. Three filters: complete 24-hour days only, weekdays only, same segment and direction on both sides.

Citywide that gives 28 usable pairs, 13 that bracket January 5, 2025. **The Bronx gives two pairs and zero that bracket the toll.** No South Bronx roadway named in the brief was counted on both sides of the toll start at the same segment. East 138th Street itself was last counted in 2015 and 2016. The Major Deegan has pre-toll counts on segments 135152 and 140178 and its post-toll count on segment 139020, three different places on one highway. Across the named corridors, 53 segments have a pre-toll count, 11 have a post-toll count, one appears on both sides, and that one (Bruckner Boulevard, `9014571` eastbound) has only a Saturday and a Sunday as its complete 2018 days against Tuesday through Thursday in 2025, so the weekday filter drops it. A second tempting pair, Pelham Parkway `9008825`, is the same seven daily volumes filed twice under request 38599 with the direction label flipped; pairing it would print a fake 0.0 percent change.

So the DOT source neither supports nor refutes diversion into the South Bronx. The sample is empty. We report the empty sample rather than paper over it, and we banked a post-toll baseline for whoever asks this in 2027: Major Deegan northbound 47,965 vehicles per weekday, East 132nd eastbound 26,734, East 135th westbound 19,374, Bruckner Boulevard eastbound 8,483, Southern Boulevard southbound 8,327, Lincoln Avenue southbound 3,216 (`data/derived/dot.json`).

I would say that the hole is itself a finding. The fee file can't see the Bronx because the gates are at 60th Street. The DOT file can't see the Bronx across the toll because nobody counted the same block twice. A neighborhood can't prove what a policy did to it if nobody was measuring there first. Putting counters on those corridors costs less than anything in Part 2.

### 3.4 Four air studies, kept apart

We didn't compute an air-quality effect. We read four studies, transcribed each one with its citation into `data/derived/published.json`, and never averaged them.

**Fraser et al., *npj Clean Air* 1:39 (2025).** Their words: "average daily maximum PM2.5 concentrations declined by 3.05 μg/m³ (SE = 0.022) within the CRZ during the first six months. This represents a 22% reduction from a projected average of 13.8 μg/m³ without the policy." Five boroughs -1.07 μg/m³ (SE = 0.006); metro area -0.70 μg/m³ (SE = 0.004). The bars are Fig. 1 ("Policy effects on NYC air quality"), the monitor map is Fig. 2A, Models M1 through M9 are Table 1, and the weekly build-up from about 0.8 μg/m³ in Week 1 to about 4.9 μg/m³ by Week 20 is Fig. 5A [1]. Their sample inside the zone is six monitors and 3,114 monitor-days. Their replication code and data are public at timothyfraser/nyc_congestion_rep, and we used `NYC_PM25_Monitor_Location.csv` from it to place those six monitors against our street. The nearest of the six to East 138th is the Queensboro Bridge station, about 6.4 km away (`data/derived/tree_siting.json`). Fraser's 22 percent is a daily-max, inside-the-zone, first-six-months number against a modeled no-toll world. It isn't a citywide annual mean and it isn't a Bronx number, and the paper doesn't say it is.

We didn't rerun Fraser's models. Their ATT needs the monitor-day panel, meteorology, census buffers, and a thousand-draw Monte Carlo, and a half-built copy of that would have been worse than citing the real one. What we ran ourselves is on traffic (3.2) and on the street (5).

**Barber, Cornell MS thesis (May 2026).** This is a second Cornell paper and it isn't Fraser. Barber runs a generalized synthetic control on monthly PM2.5 with the CBD as the treated unit and the other boroughs as donors, 15 stations, six inside the CBD. His own number is 13 percent: "the average PM2.5 level before the policy and the average after yield a decrease in PM2.5 levels in the CBD by roughly 13%" (p. 24, under Fig. 4.2), and Table A.8 on p. 54 prints it as 8.70 to 7.56 μg/m³, -13.15 percent [2]. His monthly ATTs after January 2025 run about -0.6 to -1.1 μg/m³ (Table A.1, p. 48). He quotes Fraser once, on p. 25 under Fig. 4.3: "similar studies, such as Fraser et al. (2025), found PM2.5 levels to have decreased by 22%." He then says his own placebo plot means the result "should be interpreted carefully, as the outcome is not entirely different from a few placebos" (p. 25). So Cornell has two numbers, 22 percent (Fraser, Fig. 1 and Table 1) and 13 percent (Barber, Table A.8), from two methods, and we keep them as two. Crops of Barber's pages are in `story-art/cornell/`.

**Research Square DiD preprint (December 2025).** Six NYCCAS real-time sites. One significant PM2.5 decrease, Queensboro Bridge at -9.08 percent. The others go the other way: Williamsburg Bridge +6.30, Cross Bronx Expressway +3.74, Broadway at West 35th +2.46. NO2 down 23 percent in Manhattan and up as much as 33 percent in the eastern boroughs [3]. Six tests at 0.05 gives a family-wise error rate near 26 percent, so the one significant drop might not survive a multiple-comparison correction. We say that so a judge doesn't have to.

**South Bronx Unite with Columbia, Brown, and CU Boulder (2026).** Nineteen community PM2.5 sensors, 2024 against 2025. Twelve to fourteen of them went up; mean change +0.22 μg/m³; peak +1.29 μg/m³ at the Major Deegan and Third Avenue Bridge [4]. That sensor sits at the west end of East 138th. Our bridge test doesn't find the traffic that would explain it, and the DOT file can't speak to it, but the air at that sensor got worse whatever the cause, and it's the closest reading to our street.

**NYC DOHMH.** Integrated NYCCAS monitors, one year, Van Wyck Expressway as the non-affected control: no statistically significant change they could pin on congestion pricing at either the paid zone or the highway corridors. Traffic is about 14 percent of NYC PM2.5 and 20 percent of NOx in their accounting [5]. That 14 percent bounds what any traffic policy can do to the air.

Put together: inside the zone, Fraser says 22 percent (Fig. 1, Table 1), Barber says 13 percent (Table A.8), DOHMH says nothing they can pin. Outside, the preprint is mixed to adverse and the South Bronx sensors are up. Not one of the four reports an improvement at any Bronx site.

**The third answer.** The brief asks whether the fee is eliminating pollution or moving it. In the South Bronx we'd say neither. The policy never arrived. Zero gates, zero fee exposure, zero measured improvement. Relief was the shape of the line at 60th Street, and Mott Haven is outside it.

---

## 4. Who never got the deal

Hunts Point, Longwood, and Melrose is the neighborhood grain the public files come in (PUMA 3710, Bronx Community Districts 1 and 2). East 138th sits inside it.

Adult asthma emergency visits run **193.5 per 10,000** against **66.4** citywide, about three times. Children 5 to 17: **266.2 per 10,000** against **143.7**. PM2.5-attributable child asthma ED visits: **147 per 100,000** against **62**. Vegetative cover was **18 percent** in 2017 against a citywide tree canopy of **23.4 percent** in 2021 and a 30 percent goal for 2040 (NYC EH Data Portal, Hunts Point–Mott Haven, Asthma and the Environment) [13].

Median income is **$15,510**. The citywide PUMA average is about **$31,238**. Poverty is **29.3 percent** against about **20.3 percent** citywide. The neighborhood ranks **51 of 55** on Overall Neighborhood Financial Health, score band **Bottom**, and **55 of 55** on Jobs & Income (Neighborhood Financial Health tool, `r3dx-pew9`, 2020) [11]. Inside the paid zone, Chelsea, Clinton and Midtown (PUMA 3807) reads $65,905 and 10.8 percent poverty, rank 1, Top. All four site ZIP areas (10451, 10454, 10455, 10459) score **5 of 5** on the Heat Vulnerability Index (`4mhf-duep`) [12]. Four census tracts by the site are CDBG eligible at 94 to 100 percent low-moderate income (`qmcw-ur37`).

The neighborhood with three times the asthma, half the money, the worst heat score, and the thinner canopy is also the neighborhood with zero gates, zero fee, zero measured improvement, and zero street counts on both sides of the toll. I wouldn't say the toll made Mott Haven worse; I would say the clean air stopped at 60th Street and the people it stopped short of were already carrying the most.

---

## 5. Part 2 method: where trees go

### 5.0 Why East 138th Street

The brief asked for one specific place that the Part 1 map showed as underserved or newly burdened, and it named a bridge approach as one kind of place that counts. East 138th Street is where the Third Avenue Bridge lands in the Bronx and where the Major Deegan exit dumps into the neighborhood, so it is the one street in Mott Haven that takes the bridge traffic and the highway traffic at the same time. The only monitor result in our air map that got worse after the fee is the South Bronx Unite sensor at the Deegan by the Third Avenue Bridge, at +1.29 µg/m³, and that sensor sits at the west end of this street. The city's NYCCAS Mott Haven monitor is on East 135th, about 330 m south, so it is also the most measured street in the neighborhood. It runs 1.6 km through Hunts Point, Longwood, and Melrose, the part of the Bronx people call Asthma Alley, and it is about 40 m from building face to building face with a median H/W of 0.38, so it is open enough that trees clear the air instead of trapping it on nine of ten blocks. Worst-hit sensor, bridge approach, highway exit, most at-risk neighborhood, and a street shape that works for trees is why we measured this street and nowhere else.

The brief's Part 2 rule is the one most teams will skip: in a street canyon with height-to-width above 0.5, a dense canopy traps pollutants at breathing height, so "plant more trees" can make the air worse. We measured our street before deciding anything.

### 5.1 Measuring East 138th

We fit a centerline to East 138th from 83 street-tree positions (`uvpi-gqnh`), 1,618 m long. We projected 1,714 building footprints (`5zhs-2jue`, `height_roof`) onto it: 220 within 45 m, 116 in the 6 to 30 m fronting band. Facade-to-facade width is the median north offset plus the median south offset, 40.3 m. Median roof height 50.3 ft, 75th percentile 57.4 ft. Corridor **median H/W 0.38**, 75th percentile 0.43. Then we cut it into 120 m segments and scored every segment with at least three fronting buildings. Ten segments qualify.

| Segment | H/W | Width (m) | Median roof (ft) | Living trees | Call |
|---:|---:|---:|---:|---:|---|
| 2 | 0.15 | 40.4 | 19.3 | 15 | already thick |
| 3 | 0.30 | 41.7 | 41.4 | 4 | plant, open-top |
| 4 | 0.37 | 40.7 | 49.0 | 0 | plant, open-top |
| 5 | 0.36 | 46.0 | 53.8 | 4 | plant, open-top |
| 7 | 0.35 | 48.6 | 55.1 | 12 | already thick |
| 8 | 0.38 | 34.4 | 42.8 | 21 | already thick |
| 9 | 0.46 | 32.4 | 48.8 | 2 | plant, open-top (buffer) |
| **10** | **0.58** | **30.6** | **58.7** | 2 | **canyon: walls + spaced trees** |
| 11 | 0.24 | 33.3 | 26.6 | 6 | plant, open-top |
| 12 | 0.08 | 40.0 | 10.8 | 4 | plant, open-top |

Nine of ten sit under 0.5. One, segment 10 near 40.8073° N, 73.9186° W, sits at 0.58 where the buildings rise to a median 58.7 ft and the street pinches to 30.6 m. (`data/derived/canyon.json`, `data/derived/tree_siting.json`)

### 5.2 What the tests say and don't say

**The canyon flag is a typology cutoff, not a p-value.** We ran a Grubbs test on the ten H/W values to see whether 0.58 is a statistical outlier. It isn't: G = 1.75 against a two-sided 0.05 critical value of 2.29 (mean 0.327, sd 0.145, n = 10). The block gets flagged because 0.58 is over the 0.5 line the brief and the street-canyon literature use, not because a test singled it out. We say that plainly so nobody reads "the canyon block" as a significant result.

**The trees are clustered, and that test is real.** Seventy living street trees sit in the ten scored segments, so a flat rate would be 7 per segment. A chi-square goodness-of-fit against that flat rate gives **58.86, p = 2.2e-9**. All expected cells are 7 (over 5), so the approximation holds. Segment 8 has 21 trees (standardized residual +5.29). Segment 4 has none (-2.65). This is a clustering test on the 2015 census, not a congestion-pricing effect.

**There's no gradient toward the highway we can sell.** Spearman rank correlation of trees per 100 m against distance to the South Bronx Unite peak sensor is rho = -0.07, p = 0.84, n = 10. Ten blocks can't show a gradient and we don't pretend they do.

### 5.3 The plant region

A segment is in the plant region if it's open-top (H/W under 0.5) and its living-tree count is under the flat 7 from the chi-square. That's six blocks. We rank them with a score: 0.65 times the canopy gap against the corridor's own mean, plus 0.35 times closeness to the Deegan peak sensor. Open blocks get full weight. The canyon block gets 0.15, which means walls plus widely spaced trees, not a roof.

Plant order: **segments 4, 3, 9, 5, 12, 11.** Segment 4 is first because it has zero trees and sits 590 m from the Deegan peak. Segments 2, 7, and 8 are already thick and get nothing new. Segment 10 gets green walls on the tall frontage and open-crown trees pruned for a clear ventilation corridor; the two trees already there stay, and no London planetree or other closing-crown species goes in.

Species for the open blocks: honeylocust, Kentucky coffeetree, Japanese zelkova. All three are rated salt-tolerant by the Cornell Urban Horticulture Institute [17], and East 138th is a truck route that gets salted. Honeylocust is already the dominant tree on the corridor (30 of 81), so the palette extends what has survived here.

### 5.4 Community overlay

Poverty (29.3 percent, `r3dx-pew9`), heat (HVI 5 of 5, `4mhf-duep`), and asthma (193.5 per 10,000, EH Data Portal) all come at the neighborhood grain. The same number sits on every block of East 138th. They raise the whole corridor's priority against the rest of the city; they don't rank segment 4 over segment 11. We kept them as an overlay and not as a block-level score input, because pretending a PUMA number varies block to block would be inventing precision.

### 5.5 Projected removal, planning grade

The near-term program is 180 open-crown trees, 40,000 ft² of green wall on the canyon frontage, 8 acres of green roof on the big industrial and institutional roofs, and 36 rain gardens. Using i-Tree Eco-style rates (PM2.5 0.24 g/m²/yr, the New York City value in Nowak et al. 2013 [14]; NO2 0.70 g/m²/yr, the US urban average in Nowak et al. 2014, Table 5 [15]; O3 1.20 g/m²/yr, which we couldn't trace to a source and which sits below published values), green wall at 0.5 effectiveness and green roof at 0.35:

- PM2.5 about **10.6 lb/yr**
- NO2 about **31.0 lb/yr**
- O3 about **53.2 lb/yr**
- Stormwater intercepted about **7.2 million gallons/yr**

Street-level PM2.5 reduction on the planted blocks is the literature's 8 to 15 percent range, not a fit on this street. About 11 lb/yr of PM2.5 does not cancel a +1.29 μg/m³ rise at the Deegan sensor (South Bronx Unite 2026) [4]. Trees are a breathing-height kit for the sidewalk. The source is the highway. Every multiplier is printed in `data/derived/itree.json`.

---

## 6. What solutions were on the table and costs

The brief asks for a green corridor and also asks what would happen if the Major Deegan were removed or repurposed. We priced both from public records (`data/derived/policy_cost.json`).

| Solution | Unit cost | Source | Our corridor |
|---|---|---|---|
| Street tree, planted by NYC Parks | about **$3,110** per tree, FY2025 citywide average | Parks Commissioner Susan Donoghue to City Council Parks Committee, 2025-03-20 [18] | 180 trees is about $560,000 |
| Rain garden, DDC build | about **$44,600** each | NYC Comptroller audit of 545 DDC rain gardens, FY2020-2021 [19] | 36 rain gardens is about $1.6 million |
| DEP Green Infrastructure program | **$3.5 billion** citywide, $1.4 billion encumbered by end of 2025, encumber by 2040 | DEP Green Infrastructure Annual Report 2025 [20] | Neighborhood jobs on record: about 300 rain gardens in Sunnyside, Maspeth, Ridgewood for $7.3 million (2017); about 115 in Flushing for $2.6 million (2017) |
| Green walls, green roofs | no public unit cost we'd stand behind | | Not priced. We won't invent one. |
| Highway park lid over the Deegan, 138th to 149th | **$20 million to $90 million or more per acre** from U.S. comps | Klyde Warren Park, Dallas: about $110 million on about 5.2 acres [21]. Seattle I-5 lid studies from $13 million to $102 million per acre [22] | 12.9 acres measured from the CSCL alignment: **$258 million to $1.16 billion** |

The clocks matter as much as the money. The Deegan is I-87, a state road under NYSDOT. A lid with federal money needs FHWA NEPA review (EA public comment 30 days; draft EIS comment 45 to 60 days, 23 CFR 771.119 and 771.123) plus city CEQR (draft EIS comment 30 days). If a park map or land use changes, ULURP under NYC Charter 197-c and 197-d runs 60 days at the Community Board, 30 at the Borough President, 60 at City Planning, 50 at the City Council. NYSDOT has never priced a lid on I-87. The closest live cousin is DOT's BQE Central, which is years of study before steel.

So the two asks are not the same size. The street package is about $2 million of trees and rain gardens plus walls, under programs Parks, DOT, and DEP already run. The lid is a quarter-billion to a billion dollars and a decade of process.

---

## 7. What we would build

**Now: the street package on East 138th.** Plant segments 4, 3, 9, 5, 12, 11 with open-crown honeylocust, Kentucky coffeetree, and zelkova through Parks and DOT curb work. Put the 36 rain gardens through DEP Green Infrastructure, which already budgets this kind of neighborhood job in the low millions. Green walls on the tall frontage of segment 10, through building-side permits, with widely spaced trees and no closed canopy there. Leave segments 2, 7, and 8 alone; they're already thick.

We picked this first because it fits the neighborhood's position. Bottom on financial health, 5 of 5 on heat, three times the asthma rate, outside the fee line. A neighborhood in that position shouldn't wait ten years on a NEPA clock for its first tree. The Bronx already has trees; the new thing here is measuring which block gets which planting so the one canyon block doesn't get a roof.

**Later: the Deegan lid.** About 12.9 acres of deck park between 138th and 149th. By the same removal rates it adds about 25 lb/yr of PM2.5, and that number badly undersells it, because a lid doesn't filter the source, it covers it and lifts the exhaust off the sidewalk and the windows. The removal model can only price leaves. We keep the lid on the table because the street package can't touch the highway and something has to. We don't sell it as next year's Parks contract, because it isn't, and a submission that did would be selling something.

The order is the argument. Du Bois looked out his window in 2150 and saw gardens, then orchards, then forest, then the sea. The brief reads that as a claim about land: you can't put a forest in a city until something stops needing the ground. Downtown, the toll took cars off the grid and the tunnels show it. In Mott Haven nothing was taken off, so we start with the ground we can reach, the sidewalk, and keep the highway as the second half of the sentence.

---

## 8. Limits

We didn't measure air. We cite four studies and computed nothing on air ourselves.

The Bronx bridge null is on MTA tolled crossings. The CI, [-3.63, +1.61] percent, rules out a big pile-up there and not a small one, and says nothing about the free Harlem River bridges or the Deegan.

The DOT counts can't confirm or deny South Bronx diversion. The sample that brackets the toll is empty. Absence of contradiction isn't support.

The truck number is a 2025 cross-section. We can't say trucks moved to the night because of the toll; the fee file has no day before it. Fraser's Fig. 5B is the before/after on truck entries, and it's theirs.

Fraser's 22 percent (Fig. 1, Table 1) is daily-max PM2.5 inside the zone for six months against a modeled no-toll world. Barber's 13 percent is Table A.8, a CBD average with a placebo caveat on his own page. We didn't rerun either and we didn't average them.

The street geometry is a proxy. `height_roof` is photogrammetry, not a survey. The centerline is fitted to tree positions, so it carries fit error at bends. Width is facade to facade, not curb to curb. Four of fourteen possible 120 m bins were dropped for having fewer than three fronting buildings.

The tree census is from 2015. Trees have been planted and lost since. The 81 is a baseline, not today's count.

The 0.5 cutoff is typology. Grubbs doesn't call 0.58 an outlier. Ten blocks can't support a gradient toward the highway (rho -0.07, p 0.84).

The i-Tree pounds are planning grade with flat rates, not a dispersion model. The O3 rate couldn't be traced. The 8 to 15 percent street-level range is literature, not this street.

The lid cost is a per-acre band from other cities on land we measured. No engineer has priced I-87.

Community numbers are neighborhood grain. They don't rank one block over the next and we didn't let them.

---

## 9. Figures

Generated plates (SVG and PNG), `story-art/` and `paper/figures/`:

| File | Shows | Data |
|---|---|---|
| `story-art/problem-line.png` | The line at 60th Street and Mott Haven four miles north | `data/derived/geo.json` |
| `story-art/data-twelve-zero.png`, `paper/figures/fig1-gates.svg` | Twelve gates, seven regions, zero Bronx | `crz.json` from `t6yz-b64h` |
| `story-art/data-tolls.png`, `paper/figures/fig2-trucks.svg` | Overnight share: multi-unit trucks 31.8 percent, cars 19.7 percent | `crz.json` |
| `story-art/data-bridges.png`, `paper/figures/fig3-did.svg` | Bronx bridge event study beside the paid-tunnel positive control | `bt.json` from `ebfx-2m7v` |
| `story-art/data-street.png`, `paper/figures/fig4-canyon.svg` | East 138th H/W by segment, line at 0.5, nine open and one canyon | `canyon.json` |
| `story-art/data-money.png`, `paper/figures/fig5-econ.svg` | $15,510 vs $31,238; poverty; HVI | `economics.json` |
| `story-art/fig-picked.svg` | Which datasets we picked and skipped | Section 2 |
| `story-art/fig-solutions.svg` | Solutions and costs, street package beside the lid | `policy_cost.json` |
| `story-art/two-asks.png` | Street now, lid later | |
| `story-art/osm-cordon.jpg`, `osm-mott-haven.jpg`, `osm-findings.jpg`, `osm-deegan.jpg` | OpenStreetMap plates for the line, the street, the Deegan span | OSM, ODbL |

Published figures we point at:

| File | What it is |
|---|---|
| `paper/refs/cornell-npj-fig1.png` | Fraser et al. 2025, Fig. 1, the ATT bars behind the 22 percent (CC BY 4.0) [1] |
| `story-art/cornell/page-25-fig4.3-placebo-fraser-22pct.png` | Barber 2026, p. 25: Fig. 4.3 placebo plot and the one sentence quoting Fraser's 22 percent [2] |
| `story-art/cornell/page-24-fig4.2-atts-13pct.png` | Barber 2026, p. 24: Fig. 4.2 ATTs and the "roughly 13%" sentence [2] |
| `story-art/cornell/table-a8-summary.png` | Barber 2026, Table A.8, p. 54: PM2.5 8.70 to 7.56, -13.15 percent [2] |
| `story-art/cornell/fig-4.1-aq-synthetic-control.png` | Barber 2026, Fig. 4.1, CBD vs synthetic CBD [2] |
| `story-art/cornell/fig-3.1-aq-stations.png` | Barber 2026, Fig. 3.1, his 15 stations [2] |
| `paper/refs/sbu-press-air-pollution.jpeg` | South Bronx Unite press plate [4] |
| `paper/refs/eh-hunts-point-mott-haven-asthma.jpg` | EH Data Portal asthma graphic [13] |
| `paper/refs/hvi-nyc-datawrapper.png` | Official HVI map [12] |

Photographs (public, credits in `paper/refs/SOURCES.txt` and `story-art/refs/SOURCES.txt`): `crz-gantry-9th-ave.jpg` (fee cameras at the 60th Street line), `deegan-from-e138th-jeh.jpg` and `deegan-from-e138th-south.jpg` (the Deegan from the East 138th overpass), `e138th-coned-truck.jpg` (East 138th, May 2024), `mott-haven-street.jpg`, `mott-haven-park.jpg`.

## Screenshots

We drove the live site ourselves with a script (`analysis/shoot_site.py`, Playwright, 1440 by 900 at 2x). It clicks every step, scrolls the text pane where it overflows, opens Explore the map, taps a bridge dot for its one sentence, and reshoots the first and tree steps on a 390 by 844 phone.

![Step 1, context](screenshots/step-1-context.png)

Step 1. Cody's context paragraphs, Fraser's 22 percent and Barber's 13 percent kept apart, and why the Bronx: only bridges exist up top. Right: the paid zone outline with Mott Haven north of it.

![Step 2, the fee file](screenshots/step-2-what-the-fee-file-shows.png)

Step 2. $9 in the morning, $2.25 at night, and the truck share overnight. The file has no before, so we never say "moved".

![Step 3, the datasets](screenshots/step-3-the-datasets.png)

![Step 3, scrolled](screenshots/step-3-the-datasets-scrolled.png)

Step 3. Every file we looked at, with what it is, what we used it for, and why we kept or skipped it. Scrolled down: Barber's Table A.8, the actual 8.70 to 7.56. Right: every tunnel, bridge, and fee gate.

![Step 4, methodology](screenshots/step-4-methodology.png)

![Step 4, scrolled](screenshots/step-4-methodology-scrolled.png)

Step 4. The four Bronx crossings against three far bridges come out at −1.04 points, p = 0.49, so null; the Queens Midtown and Hugh L. Carey tunnels come out at −2.29 points with −9.18 in January, so the tool works.

![Step 5, the air](screenshots/step-5-the-air.png)

![Step 5, scrolled](screenshots/step-5-the-air-scrolled.png)

Step 5. Every air study we read, kept apart, with Fraser's actual Figure 1 at the bottom. Right: every monitor result as a dot, green where the air went down, red where it went up, grey for the city's Van Wyck control, and black for the official Mott Haven monitor on East 135th that was never one of Fraser's six.

![Step 6, solutions on the table](screenshots/step-6-what-solutions-were-on-the-table.png)

![Step 6, scrolled](screenshots/step-6-what-solutions-were-on-the-table-scrolled.png)

Step 6. Four options with real prices: $3,110 a tree, $44,600 a rain garden, $258M to $1.16B for the lid. Right: the Deegan lid footprint over Mott Haven.

![Step 7, where the trees go](screenshots/step-7-where-the-trees-go.png)

![Step 7, scrolled](screenshots/step-7-where-the-trees-go-scrolled.png)

Step 7. Ten scored blocks, chi-square 58.86, p = 2.2e-9, then why the Bronx goes first and which species and tree-pit design we would use. Right: East 138th on its real OpenStreetMap centerline, colored plant, walls, or already full, with the SBU Deegan peak.

![Step 8, what we would build](screenshots/step-8-what-we-would-build.png)

![Step 8, scrolled](screenshots/step-8-what-we-would-build-scrolled.png)

Step 8. Two moves in order: the street package now through Parks and DEP, then the Deegan lid, explained as a deck over the I-87 trench from East 138th to East 149th with the permitting clocks, and the Du Bois passage that the brief built the competition on. Right: the tilted 3D view of East 138th and the lid area.

![Explore the map](screenshots/explore-map.png)

![Tap a dot](screenshots/marker-popup.png)

Explore the map. Every crossing as a dot; tapping RFK gives one sentence: the Manhattan side of the RFK Bridge sits north of the paid line.

![Phone, step 1](screenshots/mobile-step-1.png) ![Phone, step 7](screenshots/mobile-step-7.png)

Phone. Text stacks on top, map below, both scroll on their own.

---

## 10. References

1. Fraser, T., Park, Y.G., Lu, D., Tarayani, M., Deng, H., Gao, O. "A first look into congestion pricing in the United States: PM2.5 impacts after six months of New York City cordon pricing." *npj Clean Air* 1, 39 (2025). https://doi.org/10.1038/s44407-025-00037-2. Replication: https://github.com/timothyfraser/nyc_congestion_rep. Numbers used: 22 percent / -3.05 μg/m³ / 13.8 baseline (Abstract, Fig. 1, Table 1); -1.07 five boroughs; -0.70 CBSA; Fig. 2A monitor map; Fig. 5A weekly ATT; Fig. 5B truck entries.
2. Barber, Thomas J. "The New York City Congestion Charge: Air Quality, Traffic, and Crime." Master of Science thesis, Cornell University, Dyson School, May 2026. Numbers used: 13 percent (Abstract; p. 24 under Fig. 4.2; p. 42); Table A.8, p. 54 (8.70 to 7.56 μg/m³, -13.15 percent); Table A.1, p. 48 (monthly ATTs); p. 25 quote of Fraser's 22 percent under Fig. 4.3.
3. "Variable Short-Term Air Quality Impacts of New York City's Congestion Pricing Policy." Research Square preprint, December 15, 2025. https://doi.org/10.21203/rs.3.rs-8158429/v1
4. South Bronx Unite with Columbia University, Brown University, and University of Colorado Boulder. "South Bronx study shows slight increase in air pollution post-congestion pricing" (2026). https://www.southbronxunite.org/press-and-media/slight-increase-in-air-pollution-post-congestion-pricing
5. NYC Department of Health and Mental Hygiene. Congestion Pricing Air Quality Report. https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/congestion-pricing-report/
6. MTA. Congestion Relief Zone Vehicle Entries: Beginning January 2025. NY State Open Data `t6yz-b64h`. https://data.ny.gov/Transportation/MTA-Congestion-Relief-Zone-Vehicle-Entries-Beginnin/t6yz-b64h
7. MTA. Bridges and Tunnels Hourly Crossings: Beginning 2019. NY State Open Data `ebfx-2m7v`. https://data.ny.gov/Transportation/MTA-Bridges-and-Tunnels-Hourly-Crossings-Beginning-/ebfx-2m7v
8. NYC DOT. Automated Traffic Volume Counts. NYC Open Data `7ym2-wayt`. https://data.cityofnewyork.us/Transportation/Automated-Traffic-Volume-Counts/7ym2-wayt
9. NYC OTI. Building Footprints. NYC Open Data `5zhs-2jue`. https://data.cityofnewyork.us/City-Government/Building-Footprints/5zhs-2jue
10. NYC Parks. 2015 Street Tree Census, Tree Data. NYC Open Data `uvpi-gqnh`. https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/uvpi-gqnh
11. NYC. Neighborhood Financial Health Digital Mapping and Data Tool (2020). NYC Open Data `r3dx-pew9`. https://data.cityofnewyork.us/Business/Neighborhood-Financial-Health-Digital-Mapping-and-/r3dx-pew9
12. NYC DOHMH. Heat Vulnerability Index (HVI). NYC Open Data `4mhf-duep`. https://data.cityofnewyork.us/Health/Heat-Vulnerability-Index-HVI-/4mhf-duep
13. NYC Environment & Health Data Portal. Hunts Point–Mott Haven neighborhood report, Asthma and the Environment. https://a816-dohbesp.nyc.gov/IndicatorPublic/neighborhood-reports/hunts_point_mott_haven/asthma_and_the_environment/
14. Nowak, D.J., Hirabayashi, S., Bodine, A., Hoehn, R. "Modeled PM2.5 removal by trees in ten U.S. cities and associated health effects." *Environmental Pollution* 178:395-402 (2013). https://doi.org/10.1016/j.envpol.2013.03.050
15. Nowak, D.J., Hirabayashi, S., Bodine, A., Greenfield, E. "Tree and forest effects on air quality and human health in the United States." *Environmental Pollution* 193:119-129 (2014). Table 5.
16. MTA. Congestion Relief Zone tolls, about page and toll schedule 2025-2027. https://www.mta.info/fares-tolls/tolls/congestion-relief-zone/about. Statute: N.Y. Vehicle and Traffic Law Article 44-C, sections 1701-1706.
17. Cornell Urban Horticulture Institute. Urban tree species selection guidance. http://www.hort.cornell.edu/uhi/
18. NYC Council Committee on Parks and Recreation, hearing of 2025-03-20, street tree planting costs. https://citymeetings.nyc/meetings/new-york-city-council/2025-03-20-0100-pm-committee-on-parks-and-recreation/chapter/discussion-on-street-tree-planting-costs-and-allocation/
19. NYC Comptroller. Audit Report on the Department of Design and Construction's Oversight of Maintenance of Rain Gardens During the Guarantee Periods. https://comptroller.nyc.gov/reports/audit-report-on-the-department-of-design-and-constructions-oversight-of-maintenance-of-rain-gardens-during-the-guarantee-periods/
20. NYC DEP. Green Infrastructure Annual Report 2025. https://www.nyc.gov/assets/dep/downloads/pdf/water/stormwater/green-infrastructure/gi-annual-report-2025.pdf. Neighborhood job press releases: https://www.nyc.gov/html/dep/html/press_releases/17-085pr.shtml, https://www.nyc.gov/html/dep/html/press_releases/17-072pr.shtml
21. Klyde Warren Park, Dallas. https://www.klydewarrenpark.org/our-story; FHWA project profile https://www.fhwa.dot.gov/ipd/project_profiles/tx_klyde_warren_park.aspx
22. The Urbanist. "Lidding I-5 in Downtown Seattle: Cost Estimates and Three Case Studies." https://www.theurbanist.org/lidding-i-5-in-downtown-seattle-cost-estimates-and-three-case-studies/
23. NYC Charter sections 197-c and 197-d (ULURP). 23 CFR 771.119 and 771.123 (FHWA NEPA). NYC CEQR Technical Manual, Procedures (2025).
24. MTA press release, congestion pricing first anniversary. https://www.mta.info/press-release/icymi-less-traffic-better-transit-its-first-anniversary-governor-hochul-celebrates
25. Du Bois, W.E.B. "AD 2150" (1950), quoted in the Datathon 2026 brief.
26. Macaulay Honors College. Datathon 2026 Context and Overview; Reimagining NYC: Congestion Pricing, Air Quality & Environmental Justice (brief).

---

_Rebuild: `python3 analysis/fetch_data.py && python3 analysis/run_analysis.py && python3 analysis/tree_siting.py && python3 analysis/bundle.py`. DOT: `python3 analysis/fetch_dot.py && python3 analysis/analyze_dot.py`. Sources and limits per dataset: `data/SOURCES.md`. Number-to-source map: `PROVENANCE.md`._
