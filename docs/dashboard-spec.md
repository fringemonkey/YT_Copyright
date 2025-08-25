# Read‑Only Dashboard Spec (Detection & Documentation)

**Goal:** Ingest exported creator claim logs and visualize *indicators of automation* for documentation only. No outbound actions.

**Inputs (mappable fields):**
`timestamp`, `claim_id`, `claimant`, `policy`, `match_start`, `match_end`, `match_duration`, `video_id/url`, `body_text`, `raw_headers`, `sender_email` (optional).

**Transforms:**
- Timestamp normalization (user TZ), inter‑arrival distributions, burst windows.
- Text normalization + stable content fingerprint; top repeated n‑grams.
- Header parsing: `User‑Agent/X‑Mailer`, `Message‑ID` regex, first public IP from `Received`.
- Claim‑ID structure checks (sequences/prefix patterns).
- Match‑duration checks (flag missing or sub‑threshold).

**Signals (0–100, with explanations):**
- **Burst Index** — share of claims in densest windows.
- **Boilerplate Score** — duplicate/near‑duplicate body fingerprints.
- **Header Uniformity** — cluster purity across senders/agents.
- **ID Monotonicity** — sequential/patterned claim IDs.
- **Duration Adequacy** — share below threshold; missing timecodes.

**Views:**
- Overview cards (per‑signal + overall).
- Timeline chart; hour/day heatmap.
- Clusters view (bar of duplicate templates) + flagged rows table.
- Export: `findings.json` + CSV of flagged rows (client‑side).

**Safeguards:**
- Prominent disclaimer (illustrative tool; not legal advice; signals ≠ proof).
- Privacy: data stays in browser; synthetic demo data included.
- No network calls; no notice workflows of any kind.
