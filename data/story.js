/* Story dictionary. index.html renders page copy from STORY only. */
(function (factory) {
  const STORY = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = STORY;
  if (typeof window !== "undefined") window.STORY = STORY;
})(function () {
  function P(parts, extra) {
    const spec = { parts: parts };
    if (extra) {
      if (extra.note) spec.note = true;
      if (extra.id) spec.id = extra.id;
      if (extra.slot) spec.slot = extra.slot;
    }
    return spec;
  }

  function resolve(section, part) {
    const bits = String(part).split(":");
    const key = bits[0];
    const idx = bits.length > 1 ? Number(bits[1]) : null;
    const val = section[key];
    if (val == null || (idx != null && val[idx] == null)) {
      throw new Error("story missing " + part);
    }
    if (idx != null) return val[idx];
    if (Array.isArray(val)) return val.join(" ");
    return val;
  }

  function materialize(section, story) {
    const out = [];
    (section.plan || []).forEach(function (spec) {
      if (spec.counters) {
        story.sections.counters.items.forEach(function (item) {
          out.push({
            text: item.claim + " " + item.refute,
            note: false,
            id: "",
            slot: spec.slot || "lead"
          });
        });
        return;
      }
      out.push({
        text: spec.parts.map(function (part) { return resolve(section, part); }).join(" "),
        note: !!spec.note,
        id: spec.id || "",
        slot: spec.slot || "lead"
      });
    });
    section.render = out;
  }

  const STORY = {
    thesis: {
      beat: "Introduction",
      beatSub: "",
      headline: "Congestion pricing didn't dump a detectable car spill on the Bronx. The real hit was local highway air on East 138th next to the Deegan, so we plant now and we put a lid on the table.",
      hook: "For some context, the downtown fee was there because Manhattan below 60th was the high-traffic core, and the idea was to push drivers onto the MTA. The open question was whether cars dumped north of that line, where nobody paid.",
      background: "The paid zone stopped at 60th Street, and the Bronx had no fee gates, so the gate file couldn't see Mott Haven at all. The spill question was the bridges. Those crossings were the only vehicle counts we could use to ask whether cars dodged the fee by going north.",
      claim: "Congestion pricing didn't dump a detectable car spill on the Bronx. The real hit was local highway air on East 138th next to the Deegan. So we plant now, and we put a lid on the table. The next pages are how we prove it.",
      cite: null,
      plan: [
        P(["hook"]),
        P(["background"]),
        P(["claim"], { note: true })
      ]
    },
    sections: {
      night_trucks: {
        beat: "Body",
        beatSub: "night air",
        headline: "Night trucks meant night air next to the highway",
        topic: "Overnight truck share against cars",
        comparison: "We compared overnight shares in the 2025 fee file, multi-unit trucks against cars.",
        numbers: "Multi-unit trucks took 31.8 percent of their entries overnight, and cars took 19.7 percent, so the gap was 12.1 points. The null was that those two shares were equal. The chi-square was about 57,241 on 1 degree of freedom, and the p-value was about 0, but the file has entries in the tens of millions, so that p-value would fire on almost any gap. Cramer's V was 0.0185, which is small. The number that proves the claim is the 12.1 point gap, not the p-value. A car paid {car_peak} in the morning and {car_overnight} at night, so a company would run trucks overnight to cut the cost, and the file lined up with that price.",
        warrant: "That gap supports the thesis because people next to a highway breathe the overnight load when windows are open and kids are home. The night share was a night air burden on the highway edge, which is the hit we are arguing, not a new car spill.",
        falsifier: "Matching overnight shares would have falsified it. We wouldn't say the trucks moved, because the file had no before, and a before with the same night share would have killed a moved claim. We didn't have that test, so we didn't make that claim.",
        cite: "The shares came from MTA fee entries.",
        bridge: "The spill question needed a before, and the next page is that file.",
        price: { peak: 9, overnight: 2.25 },
        plan: [
          P(["comparison", "numbers"], { id: "fee-line" }),
          P(["warrant", "falsifier", "cite", "bridge"])
        ]
      },
      spill: {
        beat: "Body",
        beatSub: "spill test",
        headline: "Cars didn't dodge the fee through the Bronx",
        topic: "Bronx bridges against far bridges",
        comparison: "Spill meant drivers dodging the downtown fee by taking Bronx bridges instead of the paid zone. The null was that Bronx bridges grew at the same rate as far bridges the fee shouldn't have touched, which is no spill. The alternative was that the Bronx grew faster. We compared year-over-year growth, Bronx bridges against those far bridges, 2025 against 2024.",
        numbers: "The Bronx grew about 1.04 percentage points slower than the far bridges. The 95 percent interval ran from -3.6 to +1.6, and the p-value was about 0.49. The interval crossed zero and the p-value was high, so we failed to reject the null. There was no statistically significant evidence of a spill.",
        warrant: "That result supports the first line of the thesis. A detectable car dump would have been a positive gap, the Bronx growing faster, with the interval sitting above zero. What we got was a gap the wrong way, and a test that couldn't call it different from zero. Shuffling the labels gave the same null.",
        falsifier: "An interval entirely above zero, or a p-value under 0.05 with the Bronx growing faster, would have falsified the no-spill claim.",
        evidence: "We ran the same comparison on the tunnels that go into the paid zone. Those tunnels came in 2.29 points below the far bridges, and the interval ran from -3.4 to -1.2, so it stayed below zero. January was the biggest drop, at -9.18 points. An interval that crossed zero on the tunnels would have meant the test couldn't see the fee where cars actually pay. It could see it there, and it couldn't see a Bronx spill.",
        cite: "Counts came from MTA Bridges and Tunnels.",
        bridge: "The Bronx case wasn't a new car load. The next page is the air that was already on the Deegan edge.",
        plan: [
          P(["comparison", "numbers"]),
          P(["warrant", "falsifier"]),
          P(["evidence", "cite", "bridge"])
        ]
      },
      air: {
        beat: "Body",
        beatSub: "the air",
        headline: "The Deegan rose locally, not as a citywide background rise",
        topic: "Deegan sensor against the Van Wyck and the local mean",
        takeaway: "We had no other-city air control. The control we used was the city's own. DOHMH treated the Van Wyck as a highway the fee should not have touched, and over a year they found no fee-sized change they could call.",
        comparison: "What we compared was the Deegan community sensor by the Third Avenue Bridge against that Van Wyck control, against the South Bronx Unite network, and against downtown monitors inside the paid zone.",
        numbers: "South Bronx Unite ran 19 community sensors, 2024 against 2025. Twelve to fourteen went up. The mean rise across those 19 was only +0.22 µg/m³. The Deegan edge jumped +1.29 µg/m³, right next to East 138th. If the Bronx were just riding a shared background, the Deegan wouldn't stick out that far above the local mean.",
        evidence: "Downtown moved the other way. Fraser's paper, Figure 1, showed the paid zone about 22 percent cleaner than a no-fee model of the same six months, about 3 µg/m³. That 22 percent is Fraser's Figure 1, and it is only inside the zone. Barber's thesis, Table A.8, showed downtown falling from 8.70 to 7.56, which was 13 percent. That 13 percent is Barber's Table A.8, not Fraser's 22 percent. DOHMH also noted traffic was only about 14 percent of PM2.5 here. Mott Haven's nearest official monitor sat on East 135th and was never one of Fraser's six, so the street answered to the Deegan sensor we could name, not to the zone's 22 percent in Fraser's Figure 1.",
        warrant: "The +1.29 supports the thesis because the real hit was local highway air, not a citywide background rise and not a car spill. If the rise were weather or a global background, the Van Wyck and the 19-sensor mean would have jumped with the Deegan, and downtown would have risen too. The controls stayed small, and downtown fell.",
        falsifier: "What would have falsified the local-hit claim was a Deegan change about the size of that +0.22 mean, a fee-sized change on the Van Wyck, or downtown rising with the Deegan.",
        cite: "Fraser's paper, Figure 1; Barber's thesis, Table A.8.",
        bridge: "The next page is why those controls were the right ones to trust.",
        captions: [
          "Fraser's paper, Figure 1. The bottom panel is the 22 percent, and it is only inside the paid zone."
        ],
        table: {
          caption: "What rose, what fell, what the control said.",
          rows: [
            ["Paid zone (Fraser, Figure 1)", "About 22% lower vs no-fee model"],
            ["Downtown (Barber, Table A.8)", "13% lower (8.70 to 7.56)"],
            ["SBU network mean", "+0.22 across 19 sensors"],
            ["Deegan / Third Ave Bridge", "+1.29 (peak sensor)"],
            ["Van Wyck (DOHMH control)", "No fee-sized change DOHMH could call"]
          ]
        },
        plan: [
          P(["takeaway"], { note: true }),
          P(["comparison", "numbers"]),
          P(["evidence"]),
          P(["warrant", "falsifier", "bridge"])
        ]
      },
      controls: {
        beat: "Body",
        beatSub: "the controls",
        headline: "The controls were the places the fee shouldn't have moved",
        topic: "Far bridges and the Van Wyck",
        comparison: "The spill test only proves no detectable car dump if the control is a set of crossings the fee doesn't touch. We used the far bridges, not the tunnels that enter the paid zone. Bronx bridges against those far bridges, 2025 against 2024, is the comparison on the spill page.",
        numbers: "The Bronx grew about 1.04 percentage points slower, the 95 percent interval ran from -3.6 to +1.6, and the p-value was about 0.49, so we failed to reject the null of no spill. Using the paid-zone tunnels as the control would have faked that test. We ran those tunnels as the positive check instead, and their interval stayed below zero, from -3.4 to -1.2.",
        cite: "Counts came from MTA Bridges and Tunnels.",
        falsifier: [
          "An interval entirely above zero on the Bronx comparison would have falsified this page.",
          "A Deegan change about the size of +0.22, or a fee-sized Van Wyck change, would have falsified the local hit."
        ],
        warrant: "The fee file couldn't be that test. MTA fee entries started on day one, and the Bronx had no gates in it, so it can describe the 12.1 point overnight gap and it can't see a spill. We looked for a South Bronx street in the DOT counts that was counted both before and after the fee, and we didn't find one, so we didn't invent a block-level spill test. A before in the gate file, or a paired DOT street, would have been a different test. We didn't have either, so we didn't pretend we did.",
        evidence: "The air claim only holds if a highway the fee shouldn't touch stayed put while the Deegan jumped. DOHMH's Van Wyck control had no fee-sized change. The Deegan community sensor was +1.29 µg/m³ against a South Bronx Unite mean of +0.22 across 19 sensors. Downtown went the other way. Fraser's paper, Figure 1, is the about 22 percent inside the paid zone, and Barber's thesis, Table A.8, is the 13 percent from 8.70 to 7.56. We had no other-city air control. Mixing those into one percent would have faked a citywide story the files don't support.",
        score: "The street files scored people, not a traffic change. Buildings and the 2015 tree census measured the block. The street centerline was every segment we scored. Equal weights were 1/8 on eight factors, then we renormalized. Burden used income, asthma ED, heat, and highway exposure, because an empty street shouldn't win. A score that ignored who lived there would have falsified the ranking we're about to show. The next page is that ranking.",
        plan: [
          P(["comparison", "numbers", "cite", "falsifier:0"]),
          P(["warrant"]),
          P(["evidence", "falsifier:1"]),
          P(["score"])
        ]
      },
      scores: {
        beat: "Body",
        beatSub: "the people",
        headline: "Scores ranked people on the highway edge, not empty streets",
        topic: "Equal weights, burden, and who lives on the edge",
        comparison: "The spill test said cars didn't dump onto Bronx bridges, so we still had to pick where to plant. We scored about 99,357 streets from the city's street file into 33,785 stretches. Junk stubs and zoo roads got filtered out first. Equal weights put 1/8 on each of eight factors, then we renormalized. Burden pushed the people inputs higher, health, income, and heat at 0.15 each, exposure at 0.15, and the monitor at 0.10. Feasibility pushed plantable streets instead, height-to-width, canopy gap, and exposure at 0.20 each.",
        numbers: "We didn't invent a head count. People entered through the inputs we already had: PUMA median income, poverty, and NFH; asthma ER rates by neighborhood; heat; and how close a street sat to a highway, ramp, or bridge landing. Four Mott Haven and Melrose census tracts next to the design site held about 14,525 people, and 94 to 100 percent of them were low- or moderate-income in the city's CDBG file. Adults in Hunts Point and Mott Haven went to the ER for asthma at 193.5 per 10,000 against 66.4 citywide. Those numbers support burden weights because the score was ranking people who already breathe the corridor, not empty asphalt.",
        b01: "We saw B01 needed the support; $15,510 median income was crazy, and that was another reason the burden weights belonged in the score.",
        evidence: "Under equal weights the best half-coverage window on our corridor was {rank_all} of {n_windows} ({percentile}th percentile), {nonoverlap} if you only counted non-overlapping corridors, and burden said the same thing, but feasibility knocked it to non-overlap #{feas_rank}, and it sat on the Deegan +1.29 monitor.",
        support: "That rank supports East 138th because it stayed in the top three non-overlapping corridors and it sat on the named +1.29 hit.",
        blvd: "Southern Blvd won the cleaned list on income, heat, and highway adjacency, but Monitor was blank because there was no published post-fee air monitor there.",
        grid: "We planted a Mott Haven grid, not one street alone. East 138th stayed the spine, because it is the bridge landing, the Deegan exit, and the worst community sensor, and East 141st, East 132nd, East 135th, and Exterior Street sat next to it on the same scan. The next page is why that spine, block by block.",
        scope: "Midtown Broadway stayed inside the fee. The Van Wyck was the city's fee control, and we had no other-city air control. Lower-burden corridors lost once income, asthma, and heat were in the score.",
        falsifier: [
          "Citywide asthma and citywide income on that same edge would have falsified the population case.",
          "What would have falsified the pick was equal weights and burden weights both dropping it out of that top set, or the +1.29 sensor sitting on another corridor.",
          "A named air hit on Southern Blvd would have flipped the pick.",
          "A ranking that put those corridors first would have meant the burden weights weren't doing the job."
        ],
        cite: null,
        captions: [
          "We looked at household income across districts as context for burden (Bronx ran darker / lower income). That wasn't a scoring input; our score used PUMA median income and NFH from the derived data."
        ],
        rankCaption: "Top streets under equal weights after junk streets are filtered out. Total is the length-weighted score from 0 to 1.",
        plan: [
          P(["comparison"], { slot: "lead" }),
          P(["numbers", "falsifier:0", "b01"], { slot: "lead" }),
          P(["evidence"], { slot: "lead", id: "e138-rank-line" }),
          P(["support", "falsifier:1", "blvd", "falsifier:2", "grid"], { slot: "mid" }),
          P(["scope", "falsifier:3"], { slot: "tail" })
        ]
      },
      location: {
        beat: "Body",
        beatSub: "the street",
        headline: "East 138th sat on the named air hit next to the Deegan",
        topic: "East 138th on the Deegan sensor",
        comparison: "We compared the top corridors against the one place that had a named post-fee air hit. The spill test had already failed to reject no-spill, and the Deegan jump was local, not a shared citywide rise, so the street had to be Bronx and it had to sit on that sensor. The top options were Bronx. East 138th was the closest of those to the paid zone, and it lined up with the bridge counts and the air file we already had. Other hot corridors were harder because trees were already there. Money was already going toward Deegan road work, which helped the case for staying on this trench.",
        numbers: "East 138th is where the Third Avenue Bridge lands in the Bronx, and it is where the Major Deegan exit dumps into the neighborhood, so the street takes bridge traffic and highway traffic at the same time. The community sensor that got worse after the fee sits at the Deegan by that bridge, at +1.29 µg/m³. The city's own Mott Haven monitor sits on East 135th, about 330 meters south, and it was never one of Fraser's six, so Fraser's Figure 1 (about 22 percent inside the zone) was not measured here. The street runs 1.6 km through Hunts Point, Longwood, and Melrose, about 40 meters wide face to face, with a median height-to-width of 0.38, so nine of ten blocks were open enough for trees to work. Adults here went to the ER for asthma at 193.5 per 10,000 against 66.4 citywide. Heat was 5 out of 5, and poverty was 29.3 percent.",
        warrant: "Those numbers say the street deserved the work first. They can't pick one block over another.",
        evidence: "The null on the blocks was that living trees were spread evenly, about 7 per block, and they weren't, with a chi-square of 58.86 and a p-value of 2.2e-9, so we rejected even spread. That supports planting the open blocks under the street's own average, which were 4, 3, 9, 5, 12, and 11, because the trees were clustered and those blocks were the gap.",
        bridge: "The one block at height-to-width 0.58 got wall plants plus spaced trees instead of a full row, because a closed roof there would trap air. Blocks on the map followed the real street centerline, so they sat on the road and not through buildings. The next page is what we can do now, and what we can't pretend trees will fix.",
        falsifier: [
          "A +1.29 sensor on a different landing, or a top set that wasn't Bronx, would have falsified this street.",
          "A p-value above 0.05 would have falsified that pick and left us with a blanket plant."
        ],
        cite: "Fraser's paper, Figure 1.",
        captions: [
          "We looked at FAR zoning intensity across the city as context for how built-up places were. That wasn't our H/W score, but it was the related density picture."
        ],
        blockCaption: "Ten scored 120 m blocks on East 138th, by score. Gap is living trees minus the street's own mean of 7 per block.",
        plan: [
          P(["comparison"], { slot: "lead" }),
          P(["numbers", "warrant", "falsifier:0"], { slot: "lead" }),
          P(["evidence", "falsifier:1", "bridge"], { slot: "tail" })
        ]
      },
      counters: {
        topic: "Four objections",
        cite: null,
        items: [
          {
            claim: "People will say the air rise was just weather or a global background.",
            refute: "That fails because the Van Wyck had no fee-sized change, the South Bronx Unite mean was +0.22 µg/m³, the Deegan jumped +1.29, and downtown fell. Fraser's paper, Figure 1, is the about 22 percent inside the paid zone. Barber's thesis, Table A.8, is the 13 percent, 8.70 to 7.56. We had no other-city air control, and the within-city controls still didn't move with the Deegan."
          },
          {
            claim: "People will say cars spilled north to dodge the fee.",
            refute: "That fails because the null was no difference in growth, Bronx bridges against far bridges. The estimate was about 1.04 percentage points slower, the 95 percent interval ran from -3.6 to +1.6, and the p-value was about 0.49. The interval crossed zero, so we didn't reject the null. Counts came from MTA Bridges and Tunnels."
          },
          {
            claim: "People will say trees fix the highway.",
            refute: "That fails because about 10.6 pounds of PM2.5 a year doesn't cancel +1.29 µg/m³."
          },
          {
            claim: "People will say Dallas cost $2.5 billion, so a lid is fantasy.",
            refute: "That fails because Klyde Warren Phase I was about $110 million to $112 million for about 5.2 to 5.4 acres, not $2.5 billion. Our band is $250 million to $1.2 billion for about 12.9 acres, and Dallas at about $21 million an acre sits near the low end. It is still years, and the Deegan is a state road. We plant now."
          }
        ]
      },
      close: {
        beat: "Counters",
        beatSub: "conclusion",
        headline: "We plant now, and we put a lid on the table",
        topic: "Plant now, lid on the table",
        restatement: "We didn't invent a new budget. Parks and DEP already had money in them, so we could start planting Mott Haven streets now. We put open trees and rain gardens on the open blocks, and the map shows where. We skipped dense leafy roofs near the highway, because those trap air at breathing height instead of clearing it. A roof that cleared the trench would have stayed in the plan, and this one doesn't, so we left it out.",
        recap: "We ran i-Tree on the corridor program and compared that removal to the highway hit. It removed about 10.6 pounds of PM2.5 a year and caught about 7.2 million gallons of stormwater. Those numbers don't cancel +1.29 µg/m³, because a few pounds a year isn't a concentration jump on the Deegan edge.",
        decision: "The removal wasn't on that scale, so the trees are the now move, and the lid stays on the table.",
        comparison: "We weren't architects. The Major Deegan, I-87, sits in a sunken trench through Mott Haven, so exhaust stays at breathing height on the neighborhood edge. A Deegan lid is a deck over that trench. Cars keep running underneath, and a park sits on top, with vents for the fumes. We compared that job to Klyde Warren Park in Dallas, Phase I, which was about $110 million to $112 million for about 5.2 to 5.4 acres, opened in 2012.",
        numbers: "That was the park deck, not a $2.5 billion highway program. A later Phase 2 expansion is a separate roughly $100 million to $125 million deck job. Our stretch ran about East 138th to East 149th, roughly 12.9 acres. At about $20 million to $90 million per acre from public U.S. lid comparisons, the band is about $250 million to $1.2 billion, and those were estimates. Dallas at about $21 million an acre sits near the low end of that band.",
        warrant: "Trees only help around the edges of the trench. They don't cover the highway. The Deegan is a state road, so the clock is years.",
        falsifier: [
          "An i-Tree removal on the scale of that +1.29 would have meant the trees were the fix, and we would have stopped there.",
          "A lid priced like pocket change would have killed the case that this takes years. A Phase I sticker of $2.5 billion would have killed the Dallas comparison, and Phase I was about $110 million to $112 million, so that objection fails too."
        ],
        cite: "Klyde Warren Park, Dallas, Phase I.",
        evidence: null,
        takeaway: "Congestion pricing didn't hand the Bronx a car spill we could detect. The hit we could name was local highway air on East 138th next to the Deegan. The spill interval crossed zero, the Deegan jumped while the Van Wyck and the sensor mean stayed small, downtown got cleaner, the people on that edge were already there, and 10.6 pounds a year doesn't cover the trench. We plant now, and we put a lid on the table.",
        captions: [
          "Deegan trench near Mott Haven. Road is already below grade, so a lid goes up over it; exact bays and vents are engineering, not our call.",
          "E 135th beside the Deegan wall. Neighborhood street on one side, highway grade on the other.",
          "Ramp wall at the I-87 edge. The barrier that a lid would sit over, street traffic still at the base.",
          "I-87 looking toward The Motto. The stretch where covering the road would cut fumes and light from the neighborhood edge."
        ],
        options: {
          caption: "Three options, with estimate ranges.",
          rows: [
            { name: "Street trees", estimate: "about $2,500 to $4,000 each", call: "Now", id: "est-trees" },
            { name: "Rain gardens", estimate: "about $40,000 to $50,000 each", call: "Now, with the trees", id: "est-gi" },
            { name: "Deegan cap / lid", estimate: "about $250M to $1.2B", call: "Later, locks pollution under the sunken road", id: "est-lid" }
          ]
        },
        plan: [
          P(["restatement"]),
          P(["recap", "falsifier:0", "decision"]),
          P(["comparison", "numbers", "falsifier:1", "warrant"], { note: true, id: "cost-line" }),
          { counters: true },
          P(["takeaway"], { note: true })
        ]
      }
    }
  };

  STORY.order = ["night_trucks", "spill", "air", "controls", "scores", "location", "counters", "close"];

  STORY.fill = function (text, ctx) {
    ctx = ctx || {};
    return String(text)
      .split("{car_peak}").join(ctx.car_peak || "$9")
      .split("{car_overnight}").join(ctx.car_overnight || "$2.25")
      .split("{rank_all}").join(ctx.rank_all || "22")
      .split("{n_windows}").join(ctx.n_windows || "33,785")
      .split("{percentile}").join(ctx.percentile || "99.94")
      .split("{nonoverlap}").join(ctx.nonoverlap || "third")
      .split("{feas_rank}").join(ctx.feas_rank || "13");
  };

  function derive(section) {
    if (!section.takeaway) section.takeaway = section.headline || section.claim || "";
    if (section.evidence == null && !Object.prototype.hasOwnProperty.call(section, "evidence") && (typeof section.comparison === "string" || typeof section.numbers === "string")) {
      section.evidence = [section.comparison, section.numbers].filter(function (v) { return typeof v === "string" && v; }).join(" ");
    }
  }

  derive(STORY.thesis);
  STORY.thesis.comparison = STORY.thesis.hook;
  STORY.thesis.warrant = STORY.thesis.background;
  STORY.thesis.takeaway = STORY.thesis.claim;
  STORY.order.forEach(function (key) {
    const section = STORY.sections[key];
    if (key !== "counters") derive(section);
    if (section.plan) materialize(section, STORY);
  });
  materialize(STORY.thesis, STORY);

  return STORY;
});
