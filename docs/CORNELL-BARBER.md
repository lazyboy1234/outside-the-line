# Barber (Cornell MS thesis, May 2026) is not Fraser

**This PDF is Thomas J. Barber, not Fraser et al.** It is a Cornell Master of Science thesis dated May 2026. The 22% CRZ / daily-max PM2.5 figure we have been using comes from **Fraser et al., *npj Clean Air* 1:39 (2025)**. Barber cites that Fraser paper once with the number 22%. Barber’s own air result is **13%**, from a raw before/after CBD average (8.70 → 7.56 µg/m³), not from Fraser’s modeled daily-max counterfactual.

Do not collapse Barber and Fraser into one “Cornell 22%” source.

Source file read in full: `/Users/bondrewd_home/Downloads/Barber_cornell_0058O_12651.pdf` (63 PDF pages; body paginated 1–54). Page numbers below are the printed thesis pages unless marked PDF.

Crops and page screenshots: `story-art/cornell/`.

---

## Exact citation

**Barber, Thomas J.** *The New York City Congestion Charge: Air Quality, Traffic, and Crime.* Master of Science thesis, Graduate School, Cornell University. Dyson School of Applied Economics and Management. May 2026. Advisor: Todd Gerarden. Committee input from Ariel Ortiz-Bobea and Mainul Hoque. Cornell thesis ID in the filename: `0058O_12651`.

Title page (PDF p. 1):

> THE NEW YORK CITY CONGESTION CHARGE: AIR QUALITY, TRAFFIC, AND CRIME  
> A Thesis Presented to the Faculty of the Graduate School of Cornell University  
> In Partial Fulfillment of the Requirements for the Degree of Master of Science  
> by Thomas J. Barber  
> May 2026

Copyright (PDF p. 2): “© 2026 Thomas J. Barber”.

Suggested bibliographic form:

> Barber, Thomas J. 2026. “The New York City Congestion Charge: Air Quality, Traffic, and Crime.” Master’s thesis, Cornell University.

---

## Fraser vs Barber vs the 22% we have been using

| Claim | Who | What it actually is |
|---|---|---|
| **22% PM2.5** | **Fraser et al. 2025, *npj Clean Air*** | The number our project already uses (`published.json` `cornell.crz_pct: -22`). Daily-max PM2.5 inside the cordon vs a modeled no-toll counterfactual, first six months. |
| **13% / −13.15% PM2.5** | **Barber 2026 thesis** | Barber’s own number. Average CBD PM2.5 before vs after the charge (Table A.8: 8.70 → 7.56 µg/m³). Generalized synthetic control ATTs are also negative post-Jan 2025; placebo says interpret carefully. |
| **22% inside Barber** | Barber **quoting Fraser** | Appears **once**, thesis p. 25. Not Barber’s estimate. |

Barber’s bibliography (p. 46) cites the same DOI we use for Fraser, with a different article title:

> Fraser, Timothy et al. (2025). “A first look into congestion pricing in the United States: PM2.5 impacts after six months of New York City cordon pricing.” *npj Clean Air* 1.1, p. 39. doi: https://doi.org/10.1038/s44407-025-00037-2.

Our project cites the same DOI / same issue as:

> Fraser et al., “Estimated air quality and health benefits of the New York City congestion pricing program.” *npj Clean Air* 1, 39 (2025). https://www.nature.com/articles/s44407-025-00037-2

Same paper. Barber is a later, separate Cornell MS thesis that *cites* Fraser. It is not the Fraser paper and it is not the source of the 22%.

---

## Every 22% / similar CRZ air percentage

### The only 22% in this thesis (Fraser, not Barber)

**Thesis p. 25** (PDF p. 34), immediately under Figure 4.3:

> “Results from Cook et al. (2025) found little to no impact on air quality from the congestion charge. **It should also be noted that similar studies, such as Fraser et al. (2025), found PM2.5 levels to have decreased by 22%.** Thus, there are three separate magnitudes of results. The analyses in this paper and in Fraser et al. (2025) found a significant decrease in the amount of air pollutants, and thus an improvement in air quality, due to the implementation of the congestion charge policy. Despite a non result from Cook et al. (2025), other analyses can be used to conclude that the congestion charge has improved air quality.”

Screenshot: `story-art/cornell/page-25-fig4.3-placebo-fraser-22pct.png`.

That is the entire 22% trail. No other page prints “22%”.

### Barber citing Fraser without repeating 22%

**Thesis p. 42** (PDF p. 51), conclusion:

> “Conclusive evidence shows that the congestion charge is working to improve air quality within the CBD, as shown by a 13% decrease in PM2.5 particles in the air after the implementation of the policy when compared to pre-policy data. **Separate studies done by Fraser et al. (2025) corroborate the directionality of this finding, but at a larger magnitude.** Placebo tests revealed that the results shown in this analysis should be interpreted carefully, as the estimated effect is not entirely different from the tested placebos.”

Screenshot: `story-art/cornell/page-42-conclusion-13pct.png`.

### Barber’s own air finding (13%, not 22%)

**Abstract (PDF p. 3, roman ii):**

> “The results show that PM2.5 particles in the air decreased by 13% and travel speeds also declined by 4% due to the policy.”

**Thesis p. 24** (PDF p. 33), under Figure 4.2:

> “Overall, the average PM2.5 level before the policy and the average after yield a decrease in PM2.5 levels in the CBD by roughly 13% after the congestion charge was implemented.”

**Thesis p. 42** (quoted above): “a 13% decrease in PM2.5 particles in the air”.

**Table A.8, thesis p. 54** (PDF p. 63):

| Variable | Avg pre | Avg post | Percent change |
|---|---:|---:|---:|
| PM2.5 | 8.70 µg/m³ | 7.56 µg/m³ | **−13.15** |
| EZ Pass speeds | 11.22 ft/s | 10.79 ft/s | −3.87 |
| Felony volume | 89.89 | 95.38 | +6.11 |
| Misdemeanor volume | 128.88 | 161.33 | +25.19 |
| Violation volume | 0.19 | 0.29 | +55.56 |

Note on the table: “PM2.5 is measured in μg/m3, EZ Pass Speeds in feet per second, and crime volumes in number of arrests per precinct per month.”

Screenshot: `story-art/cornell/page-54-table-a8-summary.png` and crop `table-a8-summary.png`.

### Other air / congestion percentages Barber reports (not 22%)

**Cook et al. 2025, as Barber states them**

- Thesis pp. 8–9: “It finds that average speeds increased by 11%, with positive spillover effects on roads outside of Manhattan. Carbon dioxide emissions were found to have decreased by 2-3% and there are no significant impacts on PM2.5 levels.”
- Thesis p. 25: Cook “found little to no impact on air quality”.
- Thesis p. 42: Cook “find the congestion charge to have increased speeds on CBD roads by 11%.”

**Barber’s own traffic result (he does not treat it as decisive)**

- Abstract: travel speeds “declined by 4%”.
- Thesis p. 27: “the average speed traveled by a car in the CBD post policy decreased by roughly 4%.” Contrasted with Cook’s +11%.
- Table A.8: −3.87%.
- Placebo: treated unit “is in no way different from the placebos.” EZ Pass file also missing ~13 May 2025–1 July 2025.

---

## How Barber states the finding (his language, not ours)

Headline claim, abstract:

> “The results show that PM2.5 particles in the air decreased by 13% and travel speeds also declined by 4% due to the policy. … These results suggest that the congestion charge policy is working to improve air quality and also demonstrate a spatial shift in crime trends.”

Results, p. 24 (method of the 13%):

> “Overall, the average PM2.5 level before the policy and the average after yield a decrease in PM2.5 levels in the CBD by roughly 13% after the congestion charge was implemented.”

He then immediately qualifies the GSC:

> “In this instance, the gap in PM2.5 values for Manhattan and a couple of the other boroughs looks relatively similar. Such an outcome reveals that the estimated effect of the policy on air quality within the CBD from the congestion charge should be interpreted carefully, as the outcome is not entirely different from a few placebos.” (p. 25)

Conclusion, p. 42, is stronger than the placebo caveat, then walks it back in the same paragraph:

> “Conclusive evidence shows that the congestion charge is working to improve air quality within the CBD, as shown by a 13% decrease in PM2.5 particles … Placebo tests revealed that the results shown in this analysis should be interpreted carefully … Considering that other research, however, also reports declining PM2.5 values post policy it is reasonable to conclude that air quality is improving in NYC as a result of the congestion charge.”

He treats Fraser as same-direction, larger magnitude; Cook as a PM2.5 non-result. He does not claim Fraser’s 22%, does not use “daily-max,” and does not use “Congestion Relief Zone” / CRZ. He says **CBD** / **central business district** / **congestion charge**.

---

## Dataset

Barber never names NYCCAS, AirNow, or a Socrata four-four ID. Do not invent those names for this thesis.

**What he does name (Ch. 3, p. 10):**

> “The primary data utilized in the following analysis was obtained from the New York City open data portal. Data for both crime within the city and EZ Pass toll information were provided along with shapefiles and geospatial data regarding the Central Business District location and public transportation stops. Air Quality data was made available on the nyc.gov Environment and Health Data Portal.”

| Series | Source as written | What he uses | Years visible in the thesis | Stations / units |
|---|---|---|---|---|
| **PM2.5** | nyc.gov Environment and Health Data Portal | Station readings: “PM2.5 level, time of reading, and the station of recording.” Outcome is **monthly PM2.5**. Treated unit = CBD; controls = remaining boroughs. | Table A.1: **May 2024–June 2025** | **“15 air quality recording stations, with 6 of those stations being within Manhattan’s CBD.”** Figure 3.1 maps dots. **No station names.** |
| **Speeds** | NYC Open Data, “EZ Pass toll data” | Speed in **feet per second**, polyline location, borough, time. Treated = CBD cameras; control = EZ Pass cameras outside the CBD. | Table A.2: **Aug 2024–Aug 2025**, June 2025 missing. Text p. 27: collection gap **~13 May 2025 until 1 July 2025**. | Unnamed toll/camera locations |
| **Crime** | NYC Open Data | Individual arrests with lat/lon, offense, offender demographics. GSC at precinct × month × (in/out CBD). DiD on weekly CBD vs other-borough aggregates. | Crime ATT tables: **Jan 2023–June 2025**. Figure A.1 weekly series from 2023 through 2025. | Precincts; CBD vs rest of city |
| **Geography** | Shapefiles | CBD south of 60th Street; bus and subway stop locations for distance rings (10 / 25 / 50 / 100 / >100 ft). | — | Figure 1.1 CBD; Figure 3.2 transit |

Unbalanced panels: “some air quality monitoring sites did not collect for a certain period of time” (p. 13). That is why he uses generalized synthetic control / matrix completion.

---

## Methods (what model)

Two families (abstract and Ch. 3):

1. **Generalized synthetic control (GSC)** for air quality, traffic, and crime *type* (felony / misdemeanor / violation), estimated **separately** per outcome.
2. **Difference-in-differences** (and a triple-difference) for crime *volume* and *location*, plus **post-double-selection LASSO**.

**GSC specification (pp. 13–14), following Xu (2017) and Cook et al. (2025):**

\[
Y_{it} = \delta_{it} D_{it} + x'_{it}\beta + \lambda'_i f_t + \varepsilon_{it}
\]

- \(D_{it} = 1\) if unit \(i\) is treated by time \(t\).
- Interactive fixed effects \(\lambda'_i f_t\).
- Estimator: **matrix completion** (Athey et al. 2021) for unbalanced panels.
- Two-way fixed effects for time and unit.
- ATT is monthly post-treatment (equation 3.1).
- Air: treated = CBD, outcome = monthly PM2.5, donor = other boroughs.
- Traffic: treated = CBD EZ Pass speeds, donor = non-CBD EZ Pass speeds.
- Crime GSC: precincts outside CBD as donors; separate SC per crime type.
- Inference: in-space **placebo** (treat each control as treated).

**DiD / crime (pp. 15–21):**

- Parallel-pretrend check: `Arrests_it = week_t · within CBD_i + ε_it`. F = 0.2, p = 1.
- Simple DiD (3.2), demographics (3.3), distance rings (3.4–3.5), triple interaction CBD × Post × distance ring (3.6).
- PDS LASSO via R `rlassoEffect` on the high-dimensional arrest file. Interaction estimate ≈ 0, p = 0.32 (Table 4.2).

He is not running Fraser’s chemical-transport / reduced-form daily-max model. He is not running a citywide annual-mean health-benefits model.

---

## Figures and tables about congestion pricing / PM2.5

| Item | Thesis page | What it shows | File |
|---|---|---|---|
| Fig 1.1 Central Business District Outline | 2 | Five boroughs; Manhattan south of 60th Street filled as “Manhattan CBD” / congestion charge implemented | `fig-1.1-cbd-outline.png` |
| Fig 3.1 Air Quality Station Locations | 11 | 15 unlabeled red dots (6 in the CBD per text). Staten Island 1, Manhattan cluster, Bronx / Queens / Brooklyn scattered | `fig-3.1-aq-stations.png` |
| Fig 4.1 Air Quality Synthetic Control | 23 | Monthly PM2.5, CBD (black) vs synthetic CBD (red). Vertical line at Jan 2025. Pre-period tracks; post-period CBD below synthetic, both spike at the last month | `fig-4.1-aq-synthetic-control.png` |
| Fig 4.2 Air Quality ATTs | 24 | ATT ≈ 0 before Jan 2025; drops to about −1.0 after the charge, then −0.6 to −1.1 | `fig-4.2-aq-atts.png` |
| Fig 4.3 Air Quality Placebo Plot | 25 | CBD gap (black) vs control placebos (gray). CBD is not cleanly separated. **22% Fraser sentence is on this page** | `fig-4.3-aq-placebo.png` |
| Table A.1 Air Quality ATTs | 48 | Monthly ATTs May 2024–June 2025. Pre: +0.12 to −0.09. Post: Jan −0.97, Feb −0.98, Mar −0.58, Apr −0.78, May −0.57, Jun −1.12 | `table-a1-aq-atts.png` |
| Table A.2 EZ Pass ATTs | 48 | Speed ATTs; June missing; Apr 2025 +1.42, Jul 2025 −0.92 | `table-a2-ezpass-atts.png` |
| Table A.8 Summary of Results | 54 | The −13.15% PM2.5 row | `table-a8-summary.png` |

Full-page screenshots of the same leaves are also in `story-art/cornell/page-*.png`.

Traffic figures 4.4–4.6 (EZ Pass GSC / ATT / placebo) are in the thesis (pp. 26–28) but are speed, not PM2.5. Crime figures 4.7–4.15 and Tables 4.1–4.3 are crime, not air.

---

## How this should be cited in our project

- Keep **Fraser et al. *npj Clean Air* 2025** as the source of **22% daily-max PM2.5 inside the zone**.
- If we mention Barber, attribute **13%** (raw CBD mean 8.70 → 7.56 µg/m³; GSC ATTs about −0.6 to −1.1 µg/m³ by month) and say he **cites** Fraser’s 22% as a larger-magnitude same-direction result.
- Do not write “Cornell 22% (Barber)” or “Barber / Fraser.”
- Barber’s 13% is a before/after CBD average plus a borough-donor GSC. Fraser’s 22% is a daily-max vs no-toll model. They are not interchangeable.

---

## Artifact list

Extracted from the PDF with `pdftoppm` at 200 dpi, then cropped:

```
story-art/cornell/
  page-01-title.png
  page-03-abstract.png
  page-02-fig1.1-cbd.png
  page-11-fig3.1-stations.png
  page-23-fig4.1-gsc.png
  page-24-fig4.2-atts-13pct.png
  page-25-fig4.3-placebo-fraser-22pct.png
  page-42-conclusion-13pct.png
  page-46-fraser-bibliography.png
  page-48-tables-a1-a2.png
  page-54-table-a8-summary.png
  fig-1.1-cbd-outline.png
  fig-3.1-aq-stations.png
  fig-4.1-aq-synthetic-control.png
  fig-4.2-aq-atts.png
  fig-4.3-aq-placebo.png
  table-a1-aq-atts.png
  table-a2-ezpass-atts.png
  table-a8-summary.png
```
