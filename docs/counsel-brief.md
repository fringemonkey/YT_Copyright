# Counsel Brief (One‑Pager)

**Issue:** Automated Content ID/claim bots are flagging short commentary/educational clips en masse, diverting revenues and risking strikes without meaningful fair‑use review.

**Immediate creator actions:**
- Preserve all notices and dashboard events (PDF/CSV) and raw emails **with full headers** (.eml).
- Log a UTC timeline: claim → appeal → response → resolution; capture claimed **timecodes** and **match durations**.
- Snapshot monetization/analytics deltas pre/post claim. Hash artifacts for integrity.

**Discovery (platform) requests:**
- Complete claim event logs (UTC timestamps; claimant account; policy: track/monetize/block; **match timecodes & durations**; dedupe events; rate‑limit/anomaly flags; API client identifiers).
- Reference‑catalog scope used for the match; fingerprint IDs; versioning; supplying partner.
- Escalation trail: whether human review occurred; reviewer role; decision notes; reversal statistics.
- Downloadable, machine‑readable claim history and dispute outcomes for the creator.

**Discovery (label/agent) requests:**
- Automation stack (vendors/tools), templates, retry policies, queue parameters.
- Authority proof per claim (work, territory, time window, exclusivity) and policy settings.
- QA & fair‑use screening SOPs; appeal handling; error‑rate metrics; corrective procedures.

**Automation indicators (transparent, non‑ML):**
- Burst timing (tight inter‑arrival distributions; periodic spikes).
- Duplicate/near‑duplicate language (stable boilerplate across many claims).
- Header/user‑agent fingerprints (uniform `X‑Mailer`, `Message‑ID` format, IP/ASN clusters).
- Structured claim IDs (sequential/monotone across diverse targets).
- Repeated targets (same URLs/mirrors within narrow windows).

**Policy fixes to press for:**
- Escrow monetization during disputes; pay out on resolution.
- Minimum match‑duration + alignment thresholds for commentary/education.
- Human‑in‑the‑loop for high‑volume claimants and for education/press channels.
- Template‑fingerprint throttling (limit identical claims per window).
- Verified rights‑scope declarations with penalties for overreach.
- Auditable, exportable claim data for independent review.

*Informational only; not legal advice.*
