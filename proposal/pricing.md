# Pricing

**RFP #:** MC-2026-0417  
**Prepared for:** Meridian Components, Inc.  
**Section:** §4.5 — Pricing

---

## Required Scope — Fixed Fee

All four required items (R1–R4) are priced as fixed fees per phase. Meridian pays for outcomes, not hours.

| Phase | Requirement | Deliverable | Fixed Fee |
|-------|-------------|-------------|----------:|
| 1 | R3 | Automated browser test suite | $8,500 |
| 2 | R1 | Reports module remediation | $14,000 |
| 3 | R2 | Restocking recommendations view | $22,000 |
| 4 | R4 | Architecture documentation | $5,500 |
| | | **Total — Required Scope** | **$50,000** |

Payment terms: 25% on kickoff, 25% on Phase 2 completion, 50% on final acceptance of Phase 4.

---

## Desired Items — T&M with Not-to-Exceed

Optional items are priced time-and-materials with a hard not-to-exceed cap. Meridian can authorize any combination independently.

| Item | Requirement | NTE Cap |
|------|-------------|--------:|
| i18n extension | D2 | $7,500 |
| Dark mode | D3 | $6,000 |
| UI modernization | D1 | $28,000 |
| **All optionals** | D1–D3 | **$41,500** |

D2 (i18n) is the best value optional — the infrastructure is already in place, and the remaining gap is localized to two views we're already touching in Phase 2. If Meridian is considering any optional items, we'd recommend starting here.

---

## Pricing Assumptions

The fees above are based on the following assumptions. Material changes to these may require a pricing adjustment, which we would notify Meridian of before proceeding.

1. **Remote engagement.** No on-site travel required. If site visits are needed, travel costs are billed at cost with no markup.
2. **Defect tracker access.** Meridian shares their issue tracker within 3 business days of contract award. If the tracker reveals significantly more defects than the 8+ referenced in the RFP, Phase 2 scope will be reviewed jointly.
3. **Staging environment.** Meridian provides a staging environment (or equivalent) within 2 business days of kickoff. Development against a local clone is acceptable if staging is unavailable.
4. **No database migration.** The current JSON-based data layer remains in place. If Meridian wants a database introduction, that is out of scope for this engagement.
5. **Single codebase.** The source code provided with the RFP package is the authoritative version. No parallel branches or undisclosed forks.
6. **Acceptance criteria.** Each phase is accepted when automated tests pass and Meridian's designated reviewer signs off. Reasonable revision cycles (up to 2 rounds per phase) are included in the fixed fee.

---

## What's Not Included

- Hosting, infrastructure, or deployment changes
- Data migration or database setup
- Training or documentation beyond the architecture overview (R4)
- Support or maintenance after final acceptance
- Any work on the **Demand**, **Spending**, **Inventory**, or **Orders** views unless defects in those views are directly caused by the filter system changes made during R1

---

*Questions on pricing? Contact us per RFP §6 before April 28.*
