# Tree siting on East 138th

Street trees go on the open blocks that are already thin. They do not go in as a closed roof on the one tall-narrow block. They do not copy the 22 percent from the paid zone.

The 22 percent is Fraser et al. in *npj Clean Air* (2025): daily-max PM2.5 inside the Congestion Relief Zone versus a modeled no-toll world. Their files live at [timothyfraser/nyc_congestion_rep](https://github.com/timothyfraser/nyc_congestion_rep). We took the monitor coordinates. We did not rebuild their weather-and-census counterfactual, so we do not claim their −3.05 µg/m³ as our number, and we do not hang trees on it.

The nearest official station is NYCCAS Mott Haven, site `36005NY11534`, on East 135th between Brown Place and Willis Avenue, about 330 m south of the middle of East 138th. It is not one of Fraser's six zone monitors. The nearest zone monitor is the Queensboro Bridge, about 5 km south. The local air number we do use is the South Bronx Unite peak, +1.29 µg/m³ at the Major Deegan and Third Avenue Bridge, on the west end of this street.

A block can take a continuous open crown if height over width is under 0.5. One of ten scored 120 m segments sits at 0.58. A Grubbs test on those ten ratios does not call 0.58 an outlier at p<0.05 (G 1.75, cutoff 2.29). The canyon flag is that 0.5 cutoff, not a significance test.

Living street trees on the ten scored blocks are not even. A chi-square test against a flat 7 trees per 120 m gives 58.86, p = 2.2e-9. That test is real. Segment 8 has 21 trees. Segment 4 has none. The plant region is the open blocks under that flat rate: 4, 3, 9, 5, 12, and 11, in score order. Rank correlation of trees per 100 m versus distance to the Deegan peak is -0.07, p = 0.84. n is 10. That is not a gradient we can sell.

Poverty (29.3% vs 20.3% city), heat (HVI 5/5), and adult asthma ED visits (193.5 vs 66.4 per 10,000) are neighborhood numbers for Hunts Point, Longwood, and Melrose. They raise the whole corridor. They do not rank one East 138th block over the next. Vegetative cover here was 18% in 2017 against a city canopy of 23.4% in 2021.

A tree score is 0.65 times the canopy gap versus the street's own mean, plus 0.35 times closeness to the Deegan peak. Open blocks get full weight. The canyon block gets 0.15, which is walls plus widely spaced trees, not a closed canopy. i-Tree's 8–15% street-level PM2.5 range is literature, not a fit on this street. About 11 lb/yr of PM2.5 does not cancel +1.29 µg/m³ at the highway sensor.

Run:

```bash
python3 analysis/tree_siting.py
python3 analysis/bundle.py
```

Numbers live in `data/derived/tree_siting.json`.
