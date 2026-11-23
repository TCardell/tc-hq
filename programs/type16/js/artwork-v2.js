/**
 * TYPE/16 — Illustration library, Version 2 (12 original geometric emblems).
 *
 * V2 is a distinct design direction, not a recoloring or altered frame of V1.
 * The motifs use the same 220 × 145 viewBox and {INK|GOLD|ROSE|PAPER|BLUE}
 * palette substitutions as the historical V1 masters. V1 is never overwritten.
 *
 * To introduce V3 in the future, add an artwork-v3.js module with the same
 * twelve motif IDs, then register it in artwork.js (VERSION_LIBRARY).
 */
export const ARTWORK_V2=Object.freeze({
  // A still interior: nested gables instead of V1's crescent moon.
  sanctuary:`
    <path d="M68 120V57L110 21L152 57V120" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M86 120V66L110 47L134 66V120" fill="{BLUE}" fill-opacity=".18" stroke="{GOLD}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M102 120V89a8 8 0 0 1 16 0v31" fill="{INK}" fill-opacity=".18" stroke="{INK}" stroke-width="2.5"/>
    <circle cx="110" cy="77" r="3.8" fill="{ROSE}"/>
    <path d="M58 120H162M110 10v7" stroke="{GOLD}" stroke-width="2" stroke-linecap="round"/>
  `,
  // An aperture of light between flat panels, rather than V1's two arched doors.
  threshold:`
    <path d="M61 32h37v87H61zM122 32h37v87h-37z" fill="{BLUE}" fill-opacity=".13" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M98 32v87m24-87v87" stroke="{GOLD}" stroke-width="3"/>
    <path d="M110 43v62m-10-49 10-13 10 13m-20 36 10 13 10-13" fill="none" stroke="{ROSE}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="79" cy="76" r="4" fill="{GOLD}"/><circle cx="141" cy="76" r="4" fill="{GOLD}"/>
    <path d="M51 120h118" stroke="{INK}" stroke-width="2"/>
  `,
  // A genuine dialogue of two geometric speech banners, not intersecting discs.
  exchange:`
    <path d="M45 27h87q12 0 12 12v32q0 12-12 12H88L69 98V83H45q-12 0-12-12V39q0-12 12-12z" fill="{BLUE}" fill-opacity=".34" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M100 65h71q12 0 12 12v24q0 11-12 11h-17v15l-18-15h-36q-11 0-11-11V77q0-12 11-12z" fill="{ROSE}" fill-opacity=".25" stroke="{ROSE}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M54 53h67M112 90h48" stroke="{GOLD}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="128" cy="53" r="3.5" fill="{INK}"/><circle cx="103" cy="90" r="3.5" fill="{ROSE}"/>
  `,
  // A magnifying lens and handle replace V1's concentric target.
  focus:`
    <circle cx="95" cy="60" r="37" fill="{BLUE}" fill-opacity=".13" stroke="{INK}" stroke-width="4"/>
    <circle cx="95" cy="60" r="22" fill="none" stroke="{GOLD}" stroke-width="2"/>
    <path d="M122 88l39 38" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M122 88l39 38" stroke="{ROSE}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="95" cy="60" r="5" fill="{ROSE}"/>
    <path d="M91 28h8M95 24v8M62 59h8" stroke="{GOLD}" stroke-width="2"/>
  `,
  // Repeated tessellated lozenges, not the V1 matrix of dots.
  pattern:`
    <path d="M110 18L137 45L110 72L83 45Z" fill="{ROSE}" fill-opacity=".42" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M83 45L110 72L83 99L56 72Z" fill="{BLUE}" fill-opacity=".44" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M137 45L164 72L137 99L110 72Z" fill="{GOLD}" fill-opacity=".40" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M110 72L137 99L110 126L83 99Z" fill="{PAPER}" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M56 72h108M110 18v108" fill="none" stroke="{GOLD}" stroke-width="1.7" stroke-opacity=".65"/>
    <circle cx="110" cy="72" r="4" fill="{ROSE}"/>
  `,
  // Offset square windows and light beams replace the triangular prism.
  prism:`
    <path d="M70 48l48-22 22 48-48 22z" fill="{BLUE}" fill-opacity=".22" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M88 59l48-22 22 48-48 22z" fill="{GOLD}" fill-opacity=".14" stroke="{ROSE}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M42 75h49M143 78h41" stroke="{GOLD}" stroke-width="3" stroke-linecap="round"/>
    <path d="M151 70l32-27m-32 43 32 25" stroke="{ROSE}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="115" cy="64" r="4" fill="{INK}"/>
  `,
  // A stable seesaw on a triangular fulcrum, without the traditional hanging pans.
  balance:`
    <path d="M110 83L83 120h54z" fill="{BLUE}" fill-opacity=".33" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M51 71h118" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="65" cy="58" r="14" fill="{ROSE}" fill-opacity=".6" stroke="{ROSE}" stroke-width="2.5"/>
    <circle cx="155" cy="58" r="14" fill="{GOLD}" fill-opacity=".65" stroke="{GOLD}" stroke-width="2.5"/>
    <path d="M65 71V83m90-12v12M80 125h60" stroke="{GOLD}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="110" cy="71" r="5.5" fill="{PAPER}" stroke="{INK}" stroke-width="2"/>
  `,
  // Two open cupped forms protect a seed; different silhouette from intersecting V1 circles.
  consideration:`
    <path d="M53 52q-18 29 5 53q17 15 40 13" fill="none" stroke="{ROSE}" stroke-width="4" stroke-linecap="round"/>
    <path d="M167 52q18 29-5 53q-17 15-40 13" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M70 66q14 20 40 17q26 3 40-17" fill="none" stroke="{GOLD}" stroke-width="3" stroke-linecap="round"/>
    <path d="M110 43q-18 15 0 31q18-16 0-31z" fill="{BLUE}" fill-opacity=".4" stroke="{INK}" stroke-width="2.6" stroke-linejoin="round"/>
    <circle cx="110" cy="35" r="4" fill="{ROSE}"/>
    <path d="M83 125h54" stroke="{GOLD}" stroke-width="2"/>
  `,
  // A ledger of principles/criteria instead of a compass rose.
  criteria:`
    <rect x="65" y="22" width="90" height="101" rx="4" fill="{BLUE}" fill-opacity=".13" stroke="{INK}" stroke-width="3.5"/>
    <path d="M84 48l7 7 11-14M84 79l7 7 11-14" fill="none" stroke="{ROSE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M111 49h28M111 81h28M83 108h57" stroke="{GOLD}" stroke-width="3" stroke-linecap="round"/>
    <path d="M82 108l5 5 9-9" fill="none" stroke="{INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="157" cy="21" r="5" fill="{GOLD}"/>
  `,
  // A round dial with just four ticks replaces the triangular hourglass.
  interval:`
    <circle cx="110" cy="72" r="52" fill="{BLUE}" fill-opacity=".14" stroke="{INK}" stroke-width="3.8"/>
    <circle cx="110" cy="72" r="41" fill="none" stroke="{GOLD}" stroke-width="2"/>
    <path d="M110 36v10M110 98v10M74 72h10m52 0h10" stroke="{GOLD}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M110 48v24l22 16" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="110" cy="72" r="5.5" fill="{ROSE}"/>
    <path d="M101 17h18" stroke="{ROSE}" stroke-width="3" stroke-linecap="round"/>
  `,
  // A square meander/labyrinth in contrast with V1's branching diagram.
  paths:`
    <path d="M64 38h92v80H77V53h63v49H92V68h33v20" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>
    <path d="M64 38V24h18M156 38V23h-18" fill="none" stroke="{GOLD}" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="125" cy="88" r="6.5" fill="{ROSE}"/>
    <path d="M77 118h23" stroke="{GOLD}" stroke-width="3"/>
    <path d="M92 68h-15" stroke="{ROSE}" stroke-width="2.6"/>
  `,
  // An opened lock (possibility resolved) replaces the literal V1 metal key.
  key:`
    <path d="M83 67V45a27 27 0 0 1 54 0" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>
    <path d="M137 45V61" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>
    <rect x="67" y="66" width="86" height="62" rx="8" fill="{BLUE}" fill-opacity=".19" stroke="{GOLD}" stroke-width="3.5"/>
    <circle cx="110" cy="91" r="8" fill="{ROSE}"/>
    <path d="M110 98v12" stroke="{ROSE}" stroke-width="5" stroke-linecap="round"/>
    <path d="M147 27l8-8m0 19 8-2" stroke="{GOLD}" stroke-width="2.7" stroke-linecap="round"/>
  `
});
