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
      takeaway: "No detectable car dump hit Bronx bridges. The hit we could name was highway air on East 138th next to the Deegan.",
      lookat: "You're looking at the twelve fee gates by region. The Bronx has zero. Cars north of 60th weren't paying at a gate, so any fee dodge had to show up on bridges. We tested those bridges next. They did not grow faster than far crossings the fee shouldn't have touched.",
      blocks: [
        {
          sub: "Why the Bronx was the spill question",
          bullets: [
            "The downtown fee stopped at 60th Street because that was the high-traffic core, and the idea was to push drivers onto the MTA.",
            "Mott Haven sat north of that line with no fee gates, so the gate file couldn't see it.",
            "The only way to ask if cars dumped north was the bridge counts."
          ]
        },
        {
          sub: "What this page claims",
          bullets: [
            "Congestion pricing didn't dump a detectable car spill on the Bronx.",
            "The real hit was local highway air on East 138th next to the Deegan.",
            "We plant now, and we put a lid on the table. The next pages are how we prove it."
          ]
        }
      ],
      methods_expandable: null,
      cite: null,
      plan: [
        P(["lookat"]),
        P(["takeaway"], { note: true })
      ]
    },
    sections: {
      night_trucks: {
        beat: "Body",
        beatSub: "night air",
        headline: "Night trucks meant night air next to the highway",
        takeaway: "Overnight, multi-unit trucks took 12.1 points more of their entries than cars did (31.8% vs 19.7%). That is a night air burden for people living next to the highway.",
        blocks: [
          {
            sub: "What we compared",
            bullets: [
              "We compared overnight shares in the 2025 fee file: multi-unit trucks against cars.",
              "Trucks took 31.8 percent of their entries overnight. Cars took 19.7 percent."
            ]
          },
          {
            sub: "Why the 12.1 point gap matters",
            bullets: [
              "People next to a highway breathe that overnight load when windows are open and kids are home.",
              "Night truck share is a night air burden on the highway edge. That is the hit we are arguing, not a new car spill.",
              "A car paid {car_peak} in the morning and {car_overnight} at night, so a company had a reason to run trucks overnight to cut cost, and the file lined up with that price."
            ]
          },
          {
            sub: "What this does not claim",
            bullets: [
              "Matching overnight shares would have falsified the gap.",
              "We wouldn't say the trucks moved, because the file had no before period. We didn't make that claim."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods / how we got this",
          bullets: [
            "Null: overnight truck share equals overnight car share.",
            "Chi-square was about 57,241 on 1 degree of freedom; p-value about 0. The file has tens of millions of entries, so that p-value would fire on almost any gap.",
            "Cramer's V was 0.0185 (small). The number that proves the claim is the 12.1 point gap, not the p-value.",
            "Source: MTA fee entries."
          ]
        },
        cite: "The shares came from MTA fee entries.",
        price: { peak: 9, overnight: 2.25 },
        plan: [
          P(["takeaway"], { note: true, id: "fee-line" }),
          P(["cite"])
        ]
      },
      spill: {
        beat: "Body",
        beatSub: "spill test",
        headline: "Cars didn't dodge the fee through the Bronx",
        takeaway: "Bronx bridges did not grow faster than far bridges after the fee. We did not find a detectable car spill.",
        blocks: [
          {
            sub: "What data this page uses",
            bullets: [
              "MTA Bridges and Tunnels facility counts.",
              "Bronx bridges against far bridges the fee shouldn't have touched.",
              "Year-over-year growth, 2025 against 2024."
            ]
          },
          {
            sub: "What spill meant",
            bullets: [
              "Spill meant drivers dodging the downtown fee by taking Bronx bridges instead of the paid zone.",
              "We asked whether Bronx bridges grew faster than far bridges. Faster growth would have meant a dump."
            ]
          },
          {
            sub: "What we found",
            bullets: [
              "The Bronx grew about 1.04 percentage points slower than the far bridges.",
              "The 95 percent interval ran from -3.6 to +1.6, and it crossed zero.",
              "There was no statistically significant evidence of a spill."
            ]
          },
          {
            sub: "Did the test work where cars actually pay?",
            bullets: [
              "Tunnels into the paid zone fell 2.29 points vs far bridges (interval -3.4 to -1.2), so the test could see the fee where cars pay.",
              "January was the biggest tunnel drop, at -9.18 points."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods / how we got this",
          bullets: [
            "Design: year-over-year difference-in-differences, Bronx bridges vs far bridges, 2025 vs 2024.",
            "Null: same growth rate (no spill). Alternative: Bronx grew faster.",
            "Estimate about -1.04 points; 95% CI -3.6 to +1.6; p about 0.49. Interval crossed zero, so we failed to reject the null.",
            "AP-stats read: failing to reject is not proof of zero spill. It means we did not find statistically significant evidence of a dump.",
            "Positive check: paid-zone tunnels. Label shuffle gave the same Bronx null.",
            "Cite once: counts came from MTA Bridges and Tunnels."
          ]
        },
        cite: "Counts came from MTA Bridges and Tunnels.",
        plan: [
          P(["takeaway"], { note: true }),
          P(["cite"])
        ]
      },
      air: {
        beat: "Body",
        beatSub: "the air",
        headline: "The Deegan rose locally, not as a citywide background rise",
        takeaway: "The Deegan edge jumped +1.29 µg/m³ while the South Bronx Unite network mean rose only +0.22. That local jump is about 6× the network mean, on a highway edge where people live.",
        blocks: [
          {
            sub: "What the units mean",
            bullets: [
              "µg/m³ means micrograms of fine particles (PM2.5) per cubic meter of air. Higher is dirtier air.",
              "We are not inventing deaths from these two deltas. We are saying the Deegan change stuck out above the local background.",
              "For scale: EPA's current annual PM2.5 standard is 9 µg/m³ (primary NAAQS, revised 2024). These year-over-year changes sit on top of whatever baseline the street already had."
            ]
          },
          {
            sub: "What we compared",
            bullets: [
              "Deegan community sensor by the Third Avenue Bridge against the Van Wyck (DOHMH highway control), against the South Bronx Unite 19-sensor network, and against downtown monitors inside the paid zone.",
              "South Bronx Unite: 12 to 14 of 19 sensors went up. Network mean rise was +0.22 µg/m³. Deegan edge: +1.29 µg/m³ next to East 138th."
            ]
          },
          {
            sub: "Why that supports a local hit",
            bullets: [
              "If the Bronx were just riding a shared background, the Deegan wouldn't stick out that far above the local mean.",
              "Downtown moved the other way. Fraser's paper, Figure 1, showed the paid zone about 22 percent cleaner than a no-fee model (~3 µg/m³). Barber's thesis, Table A.8, showed downtown falling from 8.70 to 7.56 (13 percent). Those are different numbers from different files.",
              "DOHMH treated the Van Wyck as a highway the fee should not have touched and found no fee-sized change they could call."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods / how we got this",
          bullets: [
            "We had no other-city air control. The control we used was the city's own.",
            "Traffic is only about 14 percent of PM2.5 citywide (DOHMH). Mott Haven's nearest official monitor sat on East 135th and was never one of Fraser's six.",
            "What would have falsified the local-hit claim: a Deegan change about the size of +0.22, a fee-sized Van Wyck change, or downtown rising with the Deegan.",
            "Cite once for health scale: U.S. EPA annual PM2.5 NAAQS, 9 µg/m³ (2024 revision). Air deltas: Fraser Figure 1; Barber Table A.8; SBU network."
          ]
        },
        cite: "Fraser's paper, Figure 1; Barber's thesis, Table A.8. EPA annual PM2.5 NAAQS 9 µg/m³ (2024).",
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
          P(["cite"])
        ]
      },
      controls: {
        beat: "Body",
        beatSub: "the controls",
        headline: "The controls were the places the fee shouldn't have moved",
        takeaway: "Far bridges and the Van Wyck were the right controls: places the fee shouldn't move. Those stayed quiet while the Deegan jumped.",
        blocks: [
          {
            sub: "Spill control",
            bullets: [
              "We used far bridges, not the tunnels that enter the paid zone.",
              "Bronx bridges against those far bridges, 2025 against 2024, is the spill comparison.",
              "The Bronx grew about 1.04 points slower; interval -3.6 to +1.6; p about 0.49. We failed to reject no-spill."
            ]
          },
          {
            sub: "Air control",
            bullets: [
              "DOHMH's Van Wyck control had no fee-sized change.",
              "Deegan community sensor was +1.29 µg/m³ against a South Bronx Unite mean of +0.22 across 19 sensors.",
              "Downtown went the other way (Fraser Figure 1; Barber Table A.8)."
            ]
          },
          {
            sub: "What we could not use",
            bullets: [
              "MTA fee entries started on day one, and the Bronx had no gates, so that file can describe the 12.1 point overnight gap and it can't see a spill.",
              "We looked for a South Bronx street in the DOT counts counted both before and after the fee. We didn't find one, so we didn't invent a block-level spill test."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods / how we got this",
          bullets: [
            "Using paid-zone tunnels as the spill control would have faked the test. We ran those tunnels as the positive check instead (interval stayed below zero, -3.4 to -1.2).",
            "We had no other-city air control. Mixing Fraser's 22 percent and Barber's 13 percent into one citywide percent would have faked a story the files don't support.",
            "Street scores (next page) used equal 1/8 weights on eight factors, then renormalized. Burden pushed people inputs higher."
          ]
        },
        cite: "Counts came from MTA Bridges and Tunnels.",
        plan: [
          P(["takeaway"], { note: true }),
          P(["cite"])
        ]
      },
      scores: {
        beat: "Body",
        beatSub: "the people",
        headline: "Scores ranked people on the highway edge, not empty streets",
        takeaway: "Higher index means a stronger case to plant: more burden and exposure stacked together. It is not an asthma-only rank.",
        blocks: [
          {
            sub: "What the index is for",
            bullets: [
              "The spill test said cars didn't dump onto Bronx bridges, so we still had to pick where to plant.",
              "A higher total (0 to 1) means worse stacked human burden plus plantable street conditions, not \"more asthma alone.\"",
              "Four Mott Haven and Melrose census tracts next to the design site held about 14,525 people, and 94 to 100 percent of them were low- or moderate-income in the city's CDBG file."
            ]
          },
          {
            sub: "Why Southern Blvd can score highest while asthma ED looks lower",
            bullets: [
              "Southern Blvd scored about .931. East 132nd scored about .878. Asthma ED on Southern Blvd was about 132 per 10,000; East 132nd was about 193.5.",
              "That is not a bug. Asthma is only one of eight equal inputs. Southern Blvd can win on income, heat, highway exposure, and plantability even when its asthma ED is lower.",
              "The index is not \"asthma rank.\" Equal weights put 1/8 on each factor, then we renormalized. A street can lead the list without leading every column."
            ]
          },
          {
            sub: "Why we still pick East 138th",
            bullets: [
              "Under equal weights the best half-coverage window on our corridor was {rank_all} of {n_windows} ({percentile}th percentile), {nonoverlap} among non-overlapping corridors.",
              "East 138th sat on the named Deegan +1.29 monitor. Southern Blvd's monitor cell was blank (no published post-fee air monitor there).",
              "We planted a Mott Haven grid with East 138th as the spine: bridge landing, Deegan exit, and worst community sensor."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods / how we got this",
          bullets: [
            "About 99,357 streets scored into 33,785 stretches. Junk stubs and zoo roads filtered out first.",
            "Eight equal factors (each 0.125): exposure, monitor, health (asthma ED), econ (income/NFH), heat, height-to-width, canopy gap, Du Bois share. Then renormalize.",
            "Burden variant: health, income, heat, exposure at 0.15 each; monitor 0.10. Feasibility variant: height-to-width, canopy gap, and exposure at 0.20 each.",
            "Adults in Hunts Point and Mott Haven went to the ER for asthma at 193.5 per 10,000 against 66.4 citywide. Those numbers support burden weights; they do not make the equal-weight total an asthma ranking.",
            "A named air hit on Southern Blvd would have flipped the pick. Equal and burden both dropping East 138th out of the top set would have falsified it."
          ]
        },
        cite: null,
        captions: [
          "We looked at household income across districts as context for burden (Bronx ran darker / lower income). That wasn't a scoring input; our score used PUMA median income and NFH from the derived data."
        ],
        rankCaption: "Top streets under equal weights after junk streets are filtered out. Total is the length-weighted score from 0 to 1. Higher total is not \"higher asthma.\"",
        b01: "We saw B01 needed the support; $15,510 median income was crazy, and that was another reason the burden weights belonged in the score.",
        plan: [
          P(["takeaway"], { note: true, slot: "lead" }),
          P(["b01"], { slot: "mid" })
        ]
      },
      location: {
        beat: "Body",
        beatSub: "the street",
        headline: "East 138th sat on the named air hit next to the Deegan",
        takeaway: "East 138th is where the bridge lands, the Deegan exits, and the +1.29 sensor sits. That is why it is the spine.",
        blocks: [
          {
            sub: "Why this street",
            bullets: [
              "East 138th is where the Third Avenue Bridge lands in the Bronx and where the Major Deegan exit dumps into the neighborhood.",
              "The community sensor that got worse after the fee sits at the Deegan by that bridge, at +1.29 µg/m³.",
              "The city's Mott Haven monitor sits on East 135th, about 330 meters south, and it was never one of Fraser's six."
            ]
          },
          {
            sub: "Who already lives there",
            bullets: [
              "Adults here went to the ER for asthma at 193.5 per 10,000 against 66.4 citywide.",
              "Heat was 5 out of 5. Poverty was 29.3 percent.",
              "The street runs 1.6 km through Hunts Point, Longwood, and Melrose, about 40 meters wide face to face."
            ]
          },
          {
            sub: "Where trees go on the blocks",
            bullets: [
              "Living trees were clustered, not spread evenly across blocks.",
              "Open blocks under the street's own average of 7 trees per block were 4, 3, 9, 5, 12, and 11.",
              "The one block at height-to-width 0.58 got wall plants plus spaced trees instead of a full row."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods / how we got this",
          bullets: [
            "Median height-to-width was 0.38, so nine of ten blocks were open enough for trees.",
            "Living-tree even-spread test: chi-square 58.86, p 2.2e-9.",
            "Blocks on the map followed the real street centerline, so they sat on the road and not through buildings.",
            "A +1.29 sensor on a different landing, or a top set that wasn't Bronx, would have falsified this street."
          ]
        },
        cite: "Fraser's paper, Figure 1.",
        captions: [
          "We looked at FAR zoning intensity across the city as context for how built-up places were. That wasn't our H/W score, but it was the related density picture."
        ],
        blockCaption: "Ten scored 120 m blocks on East 138th, by score. Gap is living trees minus the street's own mean of 7 per block.",
        plan: [
          P(["takeaway"], { note: true, slot: "lead" }),
          P(["cite"], { slot: "tail" })
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
        takeaway: "Trees are the now move. A Deegan lid stays on the table. 10.6 pounds a year of PM2.5 removal does not cancel +1.29 µg/m³.",
        blocks: [
          {
            sub: "What we do now",
            bullets: [
              "Parks and DEP already had money in them, so we could start planting Mott Haven streets now.",
              "We put open trees and rain gardens on the open blocks.",
              "We skipped dense leafy roofs near the highway, because those trap air at breathing height."
            ]
          },
          {
            sub: "What trees can't pretend to fix",
            bullets: [
              "i-Tree on the corridor program removed about 10.6 pounds of PM2.5 a year and caught about 7.2 million gallons of stormwater.",
              "Those numbers don't cancel +1.29 µg/m³ on the Deegan edge."
            ]
          },
          {
            sub: "What a Deegan lid is",
            bullets: [
              "The Major Deegan (I-87) sits in a sunken trench through Mott Haven, so exhaust stays at breathing height on the neighborhood edge.",
              "A lid is a deck over that trench: cars underneath, park on top, vents for fumes.",
              "Klyde Warren Park in Dallas, Phase I, was about $110 million to $112 million for about 5.2 to 5.4 acres, not $2.5 billion.",
              "Our stretch ran about East 138th to East 149th, roughly 12.9 acres. Band about $250 million to $1.2 billion. The Deegan is a state road, so the clock is years."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods / how we got this",
          bullets: [
            "Dallas Phase I is the park deck sticker, not a $2.5 billion highway program.",
            "A later Phase 2 expansion is a separate roughly $100 million to $125 million deck job.",
            "Public U.S. lid comparisons sat about $20 million to $90 million per acre. Dallas at about $21 million an acre sits near the low end of our band."
          ]
        },
        cite: "Klyde Warren Park, Dallas, Phase I.",
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
          P(["takeaway"], { note: true }),
          { counters: true },
          P(["cite"], { note: true, id: "cost-line" })
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
  }

  derive(STORY.thesis);
  STORY.order.forEach(function (key) {
    const section = STORY.sections[key];
    if (key !== "counters") derive(section);
    if (section.plan) materialize(section, STORY);
  });
  materialize(STORY.thesis, STORY);

  return STORY;
});
