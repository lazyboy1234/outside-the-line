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
      beatSub: "the claim",
      headline: "We plant on East 138th because the air there got worse.",
      takeaway: "The Deegan sensor rose 1.29 micrograms.",
      lookat: "You're looking at that highway from the East 138th overpass.",
      blocks: [
        {
          sub: "Who breathes it",
          bullets: [
            "People already live on that block, next to the Deegan."
          ]
        },
        {
          sub: "The headline people heard",
          bullets: [
            "Fraser's paper, Figure 1, is the about 22 percent inside the paid zone. That number isn't this street."
          ]
        },
        {
          sub: "Outside check",
          text: "We asked if this was just the climate getting worse everywhere. Houston has no congestion-pricing cordon. EPA's Air Quality System has a monitor at North Wayside, next to truck yards and a rail yard. That annual mean went from 13.10 in 2024 to 12.17 in 2025, about 0.93 lower. If it was a national warming rise, Houston would have gone up too. It didn't. This is an outside check, not our original test, and it doesn't prove the fee caused the 1.29."
        }
      ],
      methods_expandable: {
        summary: "Methods / how we got this",
        bullets: [
          "µg/m³ means micrograms of fine particles (PM2.5) in a cubic meter of air, and higher is dirtier.",
          "We didn't invent deaths from these two deltas. EPA's annual PM2.5 standard is 9 µg/m³ in the 2024 revision, and these year-over-year changes sit on top of the baseline the street already had.",
          "Traffic is only about 14 percent of PM2.5 citywide in DOHMH's account. Mott Haven's nearest official monitor sat on East 135th and was never one of Fraser's six.",
          "We had no other-city control in the original test, so the control we used there was the city's own.",
          "Outside check: EPA Air Quality System, annual concentration by monitor, files annual_conc_by_monitor_2024.zip and annual_conc_by_monitor_2025.zip, posted 2026-06-25 at https://aqs.epa.gov/aqsweb/airdata/download_files.html.",
          "Site 48-201-0046, Houston North Wayside, 7330 1/2 North Wayside. Parameter 88101, 24-hour block average, POC 1, PM25 Annual 2024 standard, quarterly means of daily means, no events. 2024 mean 13.102121 µg/m³, completeness Y, 90 percent of observations, 330 valid days, certified. 2025 mean 12.170033 µg/m³, completeness N, 84 percent, 307 valid days, certification requested but not concurred. 12.170033 minus 13.102121 is a drop of 0.932 µg/m³, about 0.93.",
          "We didn't match South Bronx Unite's hourly design (January 2024 through December 2025 on community sensors). This Houston number is a regulatory annual mean, calendar 2024 against calendar 2025, and we didn't test whether that drop is statistically significant.",
          "TCEQ's March 5, 2024 North Wayside note puts truck yards within about 0.2 miles and the Union Pacific rail yard about 0.4 miles from that monitor. https://www.h-gac.com/getmedia/0f3b01d4-20ca-439e-9e4b-0401cb92b424/ITEM-4a-Presentation-North-Wayside-PM-Update",
          "New York is the only U.S. city with a congestion-pricing cordon. Houston isn't one. City of Chicago, congestion-fee revenue note, 2026: https://www.chicago.gov/content/dam/city/depts/COFA/RevenueResources/COFA_Revenue%20Resource_Congestion%20Fee.pdf",
          "The 22 percent is Fraser's paper, Figure 1, daily maximums inside the paid zone for the first six months, against a no-fee model. Barber's thesis, Table A.8, is the 13 percent, 8.70 to 7.56. The Deegan rose 1.29 µg/m³ and the South Bronx Unite mean rose 0.22. 12 to 14 of 19 sensors went up.",
          "A Deegan rise about the size of 0.22 would have killed the local-hit claim, and so would a fee-sized Van Wyck change or downtown rising with the Deegan.",
          "DOHMH's Van Wyck had no fee-sized change they could call. That is their NYCCAS highway control. We didn't build our own citywide NYCCAS before-and-after.",
          "The brief also names a six-site NYCCAS preprint and borough-wide drops of 1.07 and 0.70 µg/m³. We didn't rerun those, and those figures aren't our result.",
          "We didn't find a South Bronx street in the DOT counts both before and after the fee, so we didn't invent a block-level traffic test.",
          "Bridge counts are the next page. We didn't find those Bronx bridges growing faster than the far ones."
        ]
      },
      cite: "Fraser's paper, Figure 1; Barber's thesis, Table A.8. EPA annual PM2.5 NAAQS 9 µg/m³ (2024).",
      captions: [
        "Fraser's paper, Figure 1. The bottom panel is the 22 percent, and it is only inside the paid zone."
      ],
      table: {
        caption: "The paid zone went down. The Deegan went up.",
        rows: [
          ["Paid zone (Fraser, Figure 1)", "About 22% lower vs no-fee model"],
          ["Downtown (Barber, Table A.8)", "13% lower (8.70 to 7.56)"],
          ["SBU network mean", "+0.22 across 19 sensors"],
          ["Deegan / Third Ave Bridge", "+1.29 (peak sensor)"],
          ["Van Wyck (DOHMH control)", "No fee-sized change DOHMH could call"],
          ["Houston North Wayside (EPA AQS, outside check)", "Annual mean 13.10 to 12.17, about 0.93 lower. 2025 file not complete."]
        ]
      },
      plan: [
        P(["lookat"]),
        P(["takeaway"], { note: true })
      ]
    },
    sections: {
      spill: {
        beat: "Body",
        beatSub: "spill test",
        headline: "Cars didn't dump onto the Bronx.",
        takeaway: "Bronx bridges grew about 1.04 points slower than the far bridges.",
        blocks: [
          {
            sub: "What that means",
            bullets: [
              "A dump would have made those bridges grow faster. They didn't.",
              "The tunnels into the paid zone fell, so the test could see a real drop where cars pay."
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
            "Cite once: counts came from MTA Bridges and Tunnels.",
            "Tunnels into the paid zone fell 2.29 points vs far bridges, interval -3.4 to -1.2. January was the biggest tunnel drop, at -9.18 points.",
            "The face number is the Bronx gap, about 1.04 points slower. The 95 percent interval ran from -3.6 to +1.6 and crossed zero, so we didn't call a spill. Failing to reject is not proof of zero."
          ]
        },
        cite: "Counts came from MTA Bridges and Tunnels.",
        plan: [
          P(["takeaway"], { note: true }),
          P(["cite"])
        ]
      },
      controls: {
        beat: "Body",
        beatSub: "the controls",
        headline: "The quiet places stayed quiet.",
        takeaway: "The interval ran from -3.6 to +1.6.",
        blocks: [
          {
            sub: "Say it plain",
            bullets: [
              "It crossed zero, so we didn't call a spill.",
              "The Van Wyck stayed quiet. That air check is on the first page.",
              "We didn't find a South Bronx street in the DOT counts both before and after, so we didn't invent that test."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods / how we got this",
          bullets: [
            "Using paid-zone tunnels as the spill control would have faked the test. We ran those tunnels as the positive check instead (interval stayed below zero, -3.4 to -1.2).",
            "We had no other-city control in the original test. An outside EPA check for Houston is on the first page. Mixing Fraser's 22 percent and Barber's 13 percent into one citywide percent would have faked a story the files don't support.",
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
        headline: "We still plant on East 138th.",
        takeaway: "About 14,525 people live in the four tracts next to this site.",
        blocks: [
          {
            sub: "Say it plain",
            bullets: [
              "Southern Blvd scored about .931, and it has no post-fee air monitor.",
              "The photos are the streets that list put on top. East 138th is the one with the Deegan sensor."
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
            "Four Mott Haven and Melrose tracts next to the site held about 14,525 people, and 94 to 100 percent were low- or moderate-income in the city's CDBG file.",
            "Southern Blvd scored about .931. East 132nd scored about .878. Asthma ED on Southern Blvd was about 132 per 10,000; East 132nd was about 193.5. Asthma is one of eight equal inputs.",
            "Under equal weights the best half-coverage window on our corridor was {rank_all} of {n_windows} ({percentile}th percentile), {nonoverlap} among non-overlapping corridors.",
            "A named air hit on Southern Blvd would have flipped the pick. Equal and burden both dropping East 138th out of the top set would have falsified it.",
            "Street photos: Southern Blvd, East Coast Roads, June 2014. East 138th overpass, Jim Henderson, public domain. Boone Ave, East 141st, Park Ave in Crotona, and East 132nd are Street View of the ranking points. Exterior St, Flickr user imjustwalkin. Jerome Ave at 167th, DanTD, CC BY-SA 4.0. Park Ave here is the Bronx block."
          ]
        },
        cite: null,
        captions: [
          "We looked at household income across districts as context for burden (Bronx ran darker / lower income). That wasn't a scoring input; our score used PUMA median income and NFH from the derived data."
        ],
        rankCaption: "These are the top streets. A higher score means more reason to plant.",
        b01: "We saw B01 needed the support; $15,510 median income was crazy, and that was another reason the burden weights belonged in the score.",
        plan: [
          P(["takeaway"], { note: true, slot: "lead" }),
          P(["b01"], { slot: "mid" })
        ]
      },
      location: {
        beat: "Body",
        beatSub: "the street",
        headline: "This block was already the asthma neighborhood.",
        takeaway: "Adults here went to the ER for asthma at 193.5 per 10,000.",
        blocks: [
          {
            sub: "Say it plain",
            bullets: [
              "The Third Avenue Bridge and the Deegan exit both land on East 138th.",
              "One block is narrow enough that a packed tree row would trap the air, so that block gets wall plants and spaced trees."
            ]
          }
        ],
        methods_expandable: {
          summary: "Methods / how we got this",
          bullets: [
            "Median height-to-width was 0.38, so nine of ten blocks were open enough for trees.",
            "Living-tree even-spread test: chi-square 58.86, p 2.2e-9.",
            "Blocks on the map followed the real street centerline, so they sat on the road and not through buildings.",
            "A +1.29 sensor on a different landing, or a top set that wasn't Bronx, would have falsified this street.",
            "The citywide comparison is 66.4 asthma ER visits per 10,000. Heat was 5 out of 5. Poverty was 29.3 percent. The street runs 1.6 km, about 40 meters wide.",
            "Open blocks under the street's own average of 7 trees per block were 4, 3, 9, 5, 12, and 11. The narrow block is height-to-width 0.58. The brief's cutoff for a trapping canyon is above 0.5.",
            "The city's Mott Haven monitor sits on East 135th, about 330 meters south, and it was never one of Fraser's six."
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
            refute: "That fails because the Van Wyck had no fee-sized change, the South Bronx Unite mean was +0.22 µg/m³, the Deegan jumped +1.29, and downtown fell. Fraser's paper, Figure 1, is the about 22 percent inside the paid zone. Barber's thesis, Table A.8, is the 13 percent, 8.70 to 7.56. The original test had no other-city control. An outside EPA check at Houston North Wayside is on the first page, and it fell about 0.93 while the Deegan rose."
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
        headline: "Plant the trees now.",
        takeaway: "Those trees remove about 10.6 pounds of fine particles a year.",
        blocks: [
          {
            sub: "Say it plain",
            bullets: [
              "That doesn't clear the Deegan, so the lid stays for later.",
              "We didn't model tearing out the Deegan or the BQE. The road is already in a trench."
            ]
          },
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
            "Public U.S. lid comparisons sat about $20 million to $90 million per acre. Dallas at about $21 million an acre sits near the low end of our band.",
            "The brief asks what happens if the Deegan or the BQE becomes a boulevard. We didn't run that removal model. i-Tree on the planting is about 10.6 pounds of PM2.5 a year and about 7.2 million gallons of stormwater, and that doesn't cancel +1.29 µg/m³."
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

  STORY.order = ["spill", "controls", "scores", "location", "counters", "close"];

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
