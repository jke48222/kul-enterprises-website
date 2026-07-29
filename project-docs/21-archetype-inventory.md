# 21. Section archetypes, and which page owns each

**The rule.** Every section shape on this site is used exactly once. The client rejected an
earlier version as "templatey and empty", and the cause was one skeleton repeated eleven times:
a headline, a one-line lede, and N equal columns under a hairline. Research confirmed an
equal-column row is fine **once**. The failure was using one shape everywhere.

This file exists because the list had grown past twenty and lived only in a handoff prompt,
which meant the next person had to be told rather than being able to look. **Add a line here
the moment you spend a shape.**

## Spent

| Shape | Owned by |
|---|---|
| Masthead with baseline meta | `/services` |
| Unbroken rail | `/services` |
| Alternating photo and text | `/services` |
| Horizontal snap scroller | `/services` |
| Centred restrained hero | `/safety` |
| Ledger table | `/safety` |
| Policy clauses, title held left | `/safety` |
| Reserved dashed box | `/safety` |
| Full-bleed documentary band | `/safety` |
| Physical object above the record it copies | `/safety`, the door decal |
| Ruled index with right-aligned status | `/road-ahead` |
| Oversized figure beside small ruled rows | `/road-ahead` |
| Asymmetric header, headline left and small text pushed right | `/road-ahead` |
| Statement plus list | `/road-ahead` |
| Directory rows, three lanes on one baseline | `/contact` |
| Two-up matched cards | `/contact` |
| Dark split capture panel | `/quote` |
| Headline hard left with a flush-right plate | `/about` |
| Small dense column against a bleeding picture | `/about` |
| Large running prose with a margin label | `/about` |
| Colophon, uneven columns, ragged bottom | `/about` |
| Hiring notice, rules full width and words in a narrow column | `/drivers` |
| Document column plus utility rail | `/drivers` |
| Form on a warm panel | `/drivers` |
| Service start column | `/carrier-packet` |
| Federal-record field grid | `/carrier-packet` |
| Madlib sentence form | `/carrier-packet` |
| Pinned word-by-word statement | `/journey` |
| Photograph beside a line held on its own | `/journey`, chapter 01 |
| Held chapter beat, label left and words right | `/journey`, chapters 02 to 04 |
| Photograph filling the frame, one line at its foot | `/journey`, chapter 05 |
| Two plates offset, wide above and narrow below right | `/journey`, chapter 06 |
| Recovery list | `/not-found` |
| Plain apology with one action | `/error` |
| Elevation row, four views on one baseline | `/` |

## Sanctioned exceptions

**`components/k/LegalPage.tsx`** serves privacy, terms, cookies, legal notices and the climate
statement from one shape. That is deliberate and recorded: they are content pages with no
commercial function, and a reader who opens two of them expects them to match. It licenses
nothing on the commercial spine.

**Two shapes repeat inside `/journey`,** and both repeat for the same reason: a sequence needs
one shape, or it stops being a sequence.

The held chapter beat runs three times, for chapters 02, 03 and 04. Those three have no
photograph and never will, because none was ever taken. Giving each a different layout to
disguise that would make the absence look like a mistake somebody was covering up. One shape
three times makes it read as a decision, which is what it is. The only thing that changes
between them is the ground, which walks from black to charcoal to blueprint.

`components/k/JourneyFrame.tsx` runs eleven times, once per photograph in chapter 05. Eleven
photographs in eleven treatments is a scrapbook. One treatment repeated is a sequence, and a
sequence is the only thing that can carry the light arc those eleven frames were curated for.
The words alternate left and right down the run, and that is the whole of the variation.

Neither licenses a repeat anywhere else. Both are inside one page, in one run, and the page is
the only one on the site with nothing to sell.

## References that were used, and ones that were not

Shapes taken from a reference actually looked at: Face Formula, KÖPPEN, mymind, Runway
Telescope, Lyssna, Wise, Waabi, Rivian, GOV.UK service start pages, the FMCSA SAFER snapshot,
and Luke Wroblewski's Madlib form write-up.

**Do not claim fidelity to a reference nobody has seen.** Several Mobbin ids cited in earlier
plans were never downloaded and do not exist: `02b4f59f`, `0791334e`, `dd7619d6`, `c92ec333`,
`3cf723db`, `1400de43`. Three more in the client's own collection are blank or missing on
Mobbin's side: `8cc8da3a`, `ba0d0b65`, `9cd05c66`. Do not spend time retrying them.

## Motion, which follows the same once-each principle

`components/k/Reveal.tsx` has five entrances: `rise` the default, `wipe` for a single block of
display type, `settle` for dense small print, `roll` for the tractor, and `RuleDraw` for
hairlines. No two adjacent sections on a page should share one.

`wipe` uncovers left to right, so it belongs on a headline alone. Putting it on a section
wrapper uncovers every column inside it in sequence, which is not what it is for.
