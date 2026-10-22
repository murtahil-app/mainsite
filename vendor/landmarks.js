/* Murtahil - city landmarks drawn inline, the countries' drawings made from them, and the country flags.
 *
 * Every landmark is one SVG, drawn on 320 x 96 and standing on the bottom edge. Parts carry
 * classes, never colours, and style.css draws them two ways:
 *   .lm              a flat silhouette in currentColor (the unselected city buttons);
 *   .lm.is-shown     the landmarks in colour, with sky, water and details (the selected city).
 * So the same drawing serves both, and switching is a class, not a second picture.
 *
 * Sky, hills, water and ground run far beyond the drawing (x -300 to 620) and the SVG does not
 * clip them, so a button of any width is filled edge to edge; the button itself clips.
 *
 * Part classes: lm-sky, lm-far (distant hills / skyline), lm-stone, lm-stone-2 (a second, lighter
 * stone), lm-green, lm-gold, lm-glass, lm-glass-dark, lm-metal, lm-water, lm-spray (fountain spray),
 * lm-slate (lead roofs, steel), lm-white, lm-red and lm-cream (the tram), lm-trees, lm-c1..c5 (stained
 * glass), lm-wood (stroked, not filled), lm-timber (wood, filled), lm-detail (windows and openings: hidden in the
 * silhouette), lm-line (thin strokes), lm-tower, lm-tower-2, lm-tower-3 (its pale tiers) and lm-rib (stroked): the
 * Khobar Water Tower, lit green at night; lm-glow (light on the water at night: hidden by day and in the silhouette);
 * lm-steel, lm-steel-2 (shade), lm-steel-hi (sheen), lm-steel-edge (stroked) and lm-band (stroked, dark glazed
 * bands: hidden in the silhouette): Ithra's brushed steel.
 * Bahrain: lm-led-1..3 (the Sakhir Tower's LED bands), lm-bic-glass, lm-bic-mark (stroked: mullions and the
 * bands' pattern); lm-bfh, lm-bfh-2, lm-bfh-hi (sun on the glass), lm-bfh-line and lm-bfh-led (stroked: floors
 * and edges): the Harbour Towers; lm-wtc (louvred faces), lm-wtc-glass, lm-wtc-line and lm-wtc-edge (stroked):
 * the World Trade Center; lm-fs, lm-fs-2, lm-fs-fin, lm-fs-rib, lm-fs-glass, lm-fs-hall: the Four Seasons;
 * lm-glow-v, lm-glow-w (violet and warm light on the water at night) and lm-lights (the island's lights at
 * night). The stroked ones, the glows and the lights are hidden in the silhouette.
 * Cairo: lm-pyr, lm-pyr-2 (the pyramids' faces in sun and shade), lm-pyr-line (stroked courses: hidden in the
 * silhouette), lm-sand (the desert); lm-ctw, lm-ctw-2, lm-ctw-hole (the lattice's openings), lm-ctw-glass: the
 * Cairo Tower; lm-azh, lm-azh-2, lm-azh-dome, lm-azh-tile, lm-azh-red (Qaytbay's bands): Al-Azhar; lm-brn,
 * lm-brn-2, lm-brn-3 (cornices and balustrades): the Baron Empain Palace.
 *
 * Flags are the official SVGs from Wikimedia Commons, in flags/ (Bahrain's drawn to its specification).
 */
(function (global) {
    'use strict';

    var X0 = -300, X1 = 620;                     // how far the backdrop runs past the drawing

    function svg(body, label) {
        return '<svg class="lm" viewBox="-24 -6 368 102" preserveAspectRatio="xMidYMax meet" overflow="visible" role="img" aria-label="' + label +
            '" focusable="false"><rect class="lm-sky" x="' + X0 + '" y="-200" width="' + (X1 - X0) + '" height="296"/>' + body + '</svg>';
    }

    function f(n) { return Math.round(n * 10) / 10; }

    // Rolling hills (or a far skyline's base) across the whole backdrop, or up to x1.
    function hills(cls, base, amp, phase, x1) {
        x1 = x1 === undefined ? X1 : x1;
        var d = 'M' + X0 + ' 96V' + f(base);
        for (var x = X0; x <= x1; x += 20) {
            var y = base - amp * (0.6 * Math.sin((x + phase) / 53) + 0.4 * Math.sin((x + phase * 2) / 23));
            d += 'L' + x + ' ' + f(y);
        }
        return '<path class="' + cls + '" d="' + d + 'V96Z"/>';
    }

    // A band of water with a gentle swell, from x0 to x1 (the whole backdrop by default).
    function water(top, x0, x1) {
        x0 = x0 === undefined ? X0 : x0; x1 = x1 === undefined ? X1 : x1;
        var d = 'M' + x0 + ' 96V' + top;
        for (var x = x0; x < x1; x += 30) d += 'Q' + (x + 7.5) + ' ' + (top - 1.4) + ' ' + (x + 15) + ' ' + top + 'T' + (x + 30) + ' ' + top;
        return '<path class="lm-water" d="' + d + 'V96Z"/>';
    }

    function ground(cls, top) {
        return '<rect class="' + cls + '" x="' + X0 + '" y="' + top + '" width="' + (X1 - X0) + '" height="' + (96 - top) + '"/>';
    }

    function crescent(x, y) {
        return '<path class="lm-gold" d="M' + (x - 1.6) + ' ' + y + 'a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/>' +
            '<rect class="lm-gold" x="' + (x - 0.35) + '" y="' + (y + 0.6) + '" width="0.7" height="2.2"/>';
    }

    // A minaret: shaft from `top` to the ground, balconies, and a cap.
    function minaret(x, top, w, opts) {
        opts = opts || {};
        var h = 96 - top, half = w / 2, out = '';
        var cls = opts.cls || 'lm-stone';
        out += '<rect class="' + cls + '" x="' + (x - half) + '" y="' + top + '" width="' + w + '" height="' + h + '"/>';
        (opts.balconies || [top + h * 0.25]).forEach(function (y) {
            out += '<rect class="' + cls + '" x="' + (x - half - 1.4) + '" y="' + y + '" width="' + (w + 2.8) + '" height="2" rx="0.6"/>';
        });
        var capTop = top;
        if (opts.cap === 'cone') {
            capTop = top - w * 3.2;
            out += '<path class="' + (opts.capCls || cls) + '" d="M' + (x - half) + ' ' + top + 'L' + x + ' ' + capTop + 'L' + (x + half) + ' ' + top + 'Z"/>';
        } else if (opts.cap === 'bulb') {
            capTop = top - w * 1.9;
            out += '<path class="' + (opts.capCls || cls) + '" d="M' + (x - half) + ' ' + top + 'C' + (x - half - 1) + ' ' + (top - w * 0.9) + ' ' + (x - 0.6) + ' ' + (top - w * 1.1) +
                ' ' + x + ' ' + capTop + 'C' + (x + 0.6) + ' ' + (top - w * 1.1) + ' ' + (x + half + 1) + ' ' + (top - w * 0.9) + ' ' + (x + half) + ' ' + top + 'Z"/>';
        } else if (opts.cap === 'pyramid') {
            capTop = top - w * 1.6;
            out += '<path class="' + (opts.capCls || cls) + '" d="M' + (x - half - 0.5) + ' ' + top + 'L' + x + ' ' + capTop + 'L' + (x + half + 0.5) + ' ' + top + 'Z"/>';
        }
        if (opts.crescent) out += crescent(x, capTop - 2.4);
        return out;
    }

    function arches(x0, y, w, h, n, gap, cls) {
        var out = '';
        for (var i = 0; i < n; i++) {
            var x = x0 + i * (w + gap);
            out += '<path class="' + (cls || 'lm-detail') + '" d="M' + f(x) + ' ' + (y + h) + 'V' + (y + w / 2) + 'a' + (w / 2) + ' ' + (w / 2) + ' 0 0 1 ' + w + ' 0V' + (y + h) + 'Z"/>';
        }
        return out;
    }

    function windows(x0, y0, cols, rows, w, h, gx, gy) {
        var out = '';
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                out += '<rect class="lm-detail" x="' + f(x0 + c * (w + gx)) + '" y="' + f(y0 + r * (h + gy)) + '" width="' + w + '" height="' + h + '"/>';
            }
        }
        return out;
    }

    var L = {};

    // ---------------------------------------------------------------- Damascus
    // Mount Qasioun behind the Umayyad Mosque: the long prayer hall under its grey gabled roof, the
    // taller transept with its gabled front and the lead Dome of the Eagle over the crossing, the
    // two-storey courtyard arcade, and three minarets (the square one with its bulb on the west,
    // the slender pointed one behind the transept, the Minaret of Jesus on the east).
    // To the right, the Damascene Sword of Umayyad Square: one white frame (a long needle over four
    // points, sweeping down to a single foot) with stained glass inside.
    function damasceneSword(x) {
        var o = function (dx, y) { return f(x + dx) + ' ' + y; };
        // one white frame: the needle, concave flanks out to the arm points, then the lower edges
        // sweeping round and in to a single narrow foot
        var outer = 'M' + o(0, -4) + 'L' + o(1.5, 16) + 'Q' + o(3, 52) + ' ' + o(27, 59.4) + 'L' + o(25.8, 62.4) +
            'Q' + o(8, 66) + ' ' + o(3.4, 90.4) + 'L' + o(-3.4, 90.4) + 'Q' + o(-8, 66) + ' ' + o(-25.8, 62.4) + 'L' + o(-27, 59.4) +
            'Q' + o(-3, 52) + ' ' + o(-1.5, 16) + 'Z';
        var inner = 'M' + o(0, 7) + 'L' + o(0.7, 20) + 'Q' + o(2, 53) + ' ' + o(22, 60.6) + 'Q' + o(6.2, 65) + ' ' + o(1.4, 84.6) +
            'L' + o(-1.4, 84.6) + 'Q' + o(-6.2, 65) + ' ' + o(-22, 60.6) + 'Q' + o(-2, 53) + ' ' + o(-0.7, 20) + 'Z';
        // One clip per position: the switcher shows Damascus's sword and Syria's at once.
        var id = 'lm-dsw-' + Math.round(x);
        return '<defs><clipPath id="' + id + '"><path d="' + inner + '"/></clipPath></defs>' +
            '<rect class="lm-stone-2" x="' + (x - 16) + '" y="89.4" width="32" height="2"/>' +
            '<path class="lm-white" d="' + outer + '"/>' +
            '<g clip-path="url(#' + id + ')">' +
            '<path class="lm-c3" d="' + inner + '"/>' +
            '<rect class="lm-c2" x="' + (x - 4) + '" y="7" width="8" height="8"/>' +
            '<rect class="lm-c5" x="' + (x - 4) + '" y="15" width="8" height="3"/>' +
            '<rect class="lm-c1" x="' + (x - 4) + '" y="18" width="8" height="6"/>' +
            '<rect class="lm-c4" x="' + (x - 4) + '" y="24" width="8" height="10"/>' +
            '<path class="lm-c4" d="M' + o(-18, 54) + 'Q' + o(2, 42) + ' ' + o(18, 52) + 'L' + o(18, 55.4) + 'Q' + o(2, 46.6) + ' ' + o(-18, 57.6) + 'Z"/>' +
            '<circle class="lm-c2" cx="' + x + '" cy="62" r="8"/><circle class="lm-c1" cx="' + (x + 1) + '" cy="62" r="5.6"/>' +
            '<circle class="lm-c2" cx="' + (x + 2) + '" cy="61.2" r="2.4"/>' +
            '<path class="lm-c5" d="M' + o(-14, 69) + 'L' + o(14, 69) + 'L' + o(14, 71) + 'L' + o(-14, 71) + 'Z"/>' +
            '</g>';
    }
    L.damascus = svg(
        hills('lm-far', 50, 9, 40) +
        ground('lm-stone-2', 90) +
        // the minarets behind the hall: the slender pointed one and the Minaret of Jesus
        minaret(118, 20, 5, { balconies: [30, 42], cap: 'cone', capCls: 'lm-slate', crescent: true }) +
        '<rect class="lm-stone" x="232" y="24" width="12" height="40"/>' +
        '<rect class="lm-stone" x="230.6" y="30" width="14.8" height="2"/>' +
        '<rect class="lm-stone" x="234" y="14" width="8" height="10"/><rect class="lm-stone" x="232.6" y="22" width="10.8" height="2"/>' +
        '<path class="lm-slate" d="M234 14L238 -3L242 14Z"/>' + crescent(238, -5.4) +
        windows(234.6, 16, 3, 1, 1.4, 4, 1.4, 0) +
        // Dome of the Eagle over the crossing: its drum stands on the roof, on a square base
        '<rect class="lm-stone" x="136" y="36" width="32" height="20"/>' +
        '<rect class="lm-stone" x="140" y="24" width="24" height="14"/>' + windows(142.6, 27, 5, 1, 2, 6, 2.6, 0) +
        '<path class="lm-slate" d="M137 26C137 12 145 5 152 3.5C159 5 167 12 167 26Z"/>' +
        '<rect class="lm-gold" x="151.4" y="-3" width="1.2" height="7"/>' + crescent(152, -5.2) +
        // prayer hall and its long gabled roof
        '<rect class="lm-stone" x="60" y="62" width="196" height="28"/>' +
        arches(66, 68, 4, 9, 7, 5) + arches(174, 68, 4, 9, 9, 5) +
        '<path class="lm-slate" d="M56 63.5L68 52H246L258 63.5Z"/>' +
        '<path class="lm-line" d="M72 56H242M64 60H250"/>' +
        // the transept: gabled front with its great arch and mosaic band
        '<path class="lm-stone" d="M134 90V51L152 39L170 51V90Z"/>' +
        '<path class="lm-slate" d="M131 52L152 37L173 52L170.6 53.4L152 40.6L133.4 53.4Z"/>' +
        '<path class="lm-green" d="M139 56H165V60H139Z" opacity="0.85"/><path class="lm-gold" d="M139 60H165V61H139Z"/>' +
        arches(146, 64, 12, 26, 1, 0) + arches(138.4, 70, 4.6, 10, 1, 0) + arches(161, 70, 4.6, 10, 1, 0) +
        // courtyard arcade: two storeys of arches
        '<rect class="lm-stone" x="22" y="72" width="108" height="18"/>' +
        arches(26, 73.5, 3.4, 5.5, 13, 4.6) + arches(25, 81, 5, 9, 11, 4.6) +
        // the square minaret on the west, with its bulb
        '<rect class="lm-stone" x="12" y="24" width="11" height="66"/>' +
        '<rect class="lm-stone" x="10.6" y="34" width="13.8" height="2.2"/>' +
        '<rect class="lm-stone" x="14" y="12" width="7" height="12"/><rect class="lm-stone" x="12.6" y="22" width="9.8" height="2"/>' +
        windows(15.8, 14, 2, 1, 1.4, 5, 0.6, 0) + windows(14.6, 40, 2, 3, 1.8, 5, 2, 7) +
        '<path class="lm-slate" d="M14 12C13 7 16.6 5.6 17.5 1C18.4 5.6 22 7 21 12Z"/>' + crescent(17.5, -1.4) +
        damasceneSword(294)
    , 'The Umayyad Mosque, Mount Qasioun and the Damascene Sword');

    // ---------------------------------------------------------------- Hama
    // The norias (wooden water wheels) on the Orontes, and the aqueduct they fill.
    function noria(cx, cy, r) {
        var out = '<g class="lm-wood"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 4) + '"/>';
        for (var i = 0; i < 12; i++) {
            var a = Math.PI * 2 * i / 12;
            out += '<line x1="' + cx + '" y1="' + cy + '" x2="' + f(cx + Math.cos(a) * r) + '" y2="' + f(cy + Math.sin(a) * r) + '"/>';
        }
        for (var k = 0; k < 36; k++) {
            var b = Math.PI * 2 * k / 36;
            out += '<line x1="' + f(cx + Math.cos(b) * r) + '" y1="' + f(cy + Math.sin(b) * r) + '" x2="' + f(cx + Math.cos(b) * (r + 2.6)) + '" y2="' + f(cy + Math.sin(b) * (r + 2.6)) + '"/>';
        }
        return out + '<circle cx="' + cx + '" cy="' + cy + '" r="2.4"/></g>';
    }
    function aqueduct(x0, x1) {
        var d = 'M' + x0 + ' 40H' + x1 + 'V96H' + x0 + 'Z';
        for (var x = x0 + 10; x + 18 <= x1; x += 28) d += 'M' + x + ' 96V62a9 9 0 0 1 18 0V96Z';
        return '<path class="lm-stone" fill-rule="evenodd" d="' + d + '"/>' +
            '<rect class="lm-stone-2" x="' + x0 + '" y="36" width="' + (x1 - x0) + '" height="5"/>';
    }
    L.hama = svg(
        hills('lm-far', 58, 5, 10) +
        // the Great Mosque's minaret, far behind
        '<path class="lm-stone-2" d="M16 96V64Q34 54 52 64V96Z"/>' +
        minaret(34, 44, 7, { balconies: [52], cap: 'pyramid', cls: 'lm-stone-2', crescent: true }) +
        aqueduct(150, X1) +
        water(84) +
        noria(118, 50, 38) +
        noria(214, 62, 24) +
        '<rect class="lm-stone" x="112" y="48" width="12" height="48"/>' +
        '<rect class="lm-stone" x="209" y="60" width="10" height="36"/>'
    , 'The norias of Hama');

    // ---------------------------------------------------------------- Jeddah, Makkah and Medina
    // West to east, as on the map: King Fahd's Fountain rising from the Red Sea (Jeddah); the
    // Abraj Al-Bait clock tower and its podium towers (Makkah); Masjid an-Nabawi with the Green
    // Dome, its minarets and courtyard umbrellas (Medina).
    function umbrella(x, top) {
        return '<path class="lm-stone-2" d="M' + (x - 10) + ' ' + (top + 5) + 'Q' + (x - 5) + ' ' + top + ' ' + x + ' ' + (top - 1) + 'Q' + (x + 5) + ' ' + top + ' ' + (x + 10) + ' ' + (top + 5) +
            'L' + (x + 5) + ' ' + (top + 3.6) + 'L' + x + ' ' + (top + 5.2) + 'L' + (x - 5) + ' ' + (top + 3.6) + 'Z"/>' +
            '<rect class="lm-stone-2" x="' + (x - 0.6) + '" y="' + (top + 4) + '" width="1.2" height="' + (92 - top - 4) + '"/>';
    }
    L.haramayn = svg(
        hills('lm-far', 58, 7, 90) +
        ground('lm-stone-2', 91) +
        // Jeddah: King Fahd's Fountain, one straight jet from its lit base on the sea, its top
        // rounded over and the spray falling back downwind as a broad curtain to the water
        water(84, X0, 70) +
        '<path class="lm-spray" d="M34 85L34.6 9Q34.8 1.5 31 2Q24 4 18.5 20Q13 38 10 58Q8 72 4 85Z" opacity="0.45"/>' +
        '<path class="lm-spray" d="M33.6 85L34 12Q34 5.5 31.2 6.4Q26.5 9 22.5 24Q19 40 17.5 58Q16.6 72 15 85Z" opacity="0.6"/>' +
        '<path class="lm-spray" d="M8 70Q9 78 7 85H9.4Q11 78 10.4 70ZM20 66Q21 76 19.4 85H21.6Q23 76 22.4 66Z" opacity="0.5"/>' +
        '<path class="lm-spray" d="M32.8 85L33.2 7Q33.4 3.4 34.3 4L35 85Z"/>' +
        '<rect class="lm-gold" x="31.5" y="83.4" width="5" height="2" rx="1"/>' +
        '<rect class="lm-stone-2" x="26" y="85" width="44" height="1.6"/>' +
        // Makkah: podium and flanking towers of Abraj Al-Bait
        '<rect class="lm-stone-2" x="84" y="72" width="104" height="24"/>' +
        '<rect class="lm-stone-2" x="92" y="46" width="18" height="50"/><path class="lm-stone-2" d="M92 46L101 38L110 46Z"/>' +
        '<rect class="lm-stone-2" x="162" y="46" width="18" height="50"/><path class="lm-stone-2" d="M162 46L171 38L180 46Z"/>' +
        '<rect class="lm-stone-2" x="80" y="60" width="12" height="36"/><rect class="lm-stone-2" x="180" y="60" width="12" height="36"/>' +
        windows(95, 50, 3, 9, 2.6, 2, 3.4, 3.2) + windows(165, 50, 3, 9, 2.6, 2, 3.4, 3.2) +
        // the Clock Tower: shaft, clock stage, crown and golden spire with its crescent
        '<rect class="lm-stone" x="118" y="36" width="36" height="60"/>' +
        '<rect class="lm-stone" x="121" y="14" width="30" height="22"/>' +
        '<circle class="lm-glass" cx="136" cy="25" r="9"/><circle class="lm-detail" cx="136" cy="25" r="7.4"/>' +
        '<path class="lm-line" d="M136 25V19.5M136 25L140 27"/>' +
        '<path class="lm-green" d="M125 14H147V11H125Z"/>' +
        '<path class="lm-stone" d="M124 11L129 4H143L148 11Z"/>' +
        '<path class="lm-gold" d="M132.5 4L136 -3L139.5 4Z"/><rect class="lm-gold" x="135.4" y="-4" width="1.2" height="3"/>' +
        crescent(136, -5.6) +
        windows(122, 40, 5, 11, 3, 2, 3.8, 2.6) +
        // the podium's ground floor
        arches(88, 84, 4, 8, 10, 5.6) +
        // Medina: Masjid an-Nabawi, the Green Dome and the silver domes, minarets, umbrellas
        '<rect class="lm-stone" x="218" y="70" width="112" height="26"/>' + arches(223, 76, 6, 16, 11, 3.6) +
        '<rect class="lm-stone" x="249" y="57" width="28" height="13"/>' +
        '<path class="lm-green" d="M245 59C245 45 254 38 263 34C272 38 281 45 281 59Z"/>' +
        '<rect class="lm-gold" x="262.4" y="22" width="1.2" height="12"/>' + crescent(263, 20.6) +
        '<path class="lm-slate" d="M284 70C284 63 288 60 292 59C296 60 300 63 300 70Z"/>' +
        '<path class="lm-slate" d="M226 70C226 64 229.5 61.5 233 61C236.5 61.5 240 64 240 70Z"/>' +
        minaret(222, 18, 5.6, { balconies: [30, 44, 58], cap: 'bulb', capCls: 'lm-slate', crescent: true }) +
        minaret(310, 18, 5.6, { balconies: [30, 44, 58], cap: 'bulb', capCls: 'lm-slate', crescent: true }) +
        minaret(330, 30, 5, { balconies: [42, 56], cap: 'bulb', capCls: 'lm-slate', cls: 'lm-stone-2', crescent: true }) +
        umbrella(244, 80) + umbrella(282, 80) + umbrella(304, 80)
    , 'King Fahd’s Fountain, the Abraj Al-Bait Clock Tower and Masjid an-Nabawi');

    // ---------------------------------------------------------------- Istanbul
    // The Blue Mosque over the sea: small domes cascading up to the half domes and the great
    // dome, four turrets at its corners, six pencil minarets. Galata Tower on its hill, a red
    // nostalgic tram, and the Bosphorus Bridge running off to the east.
    function smallDomes(x0, x1, y, r) {
        var out = '';
        for (var x = x0; x <= x1; x += r * 2 + 1.6) out += '<path class="lm-slate" d="M' + f(x - r) + ' ' + y + 'a' + r + ' ' + f(r * 0.85) + ' 0 0 1 ' + (r * 2) + ' 0Z"/>';
        return out;
    }
    function turret(x, top) {
        return '<rect class="lm-stone" x="' + (x - 3) + '" y="' + top + '" width="6" height="' + (54 - top) + '"/>' +
            '<path class="lm-slate" d="M' + (x - 3.4) + ' ' + top + 'a3.4 3.2 0 0 1 6.8 0Z"/>' +
            '<rect class="lm-gold" x="' + (x - 0.4) + '" y="' + (top - 6) + '" width="0.8" height="3.4"/>';
    }
    L.istanbul = svg(
        hills('lm-far', 64, 4, 200) +
        water(70) +
        // the two minarets behind the mosque
        minaret(64, 26, 4, { balconies: [38, 50], cap: 'cone', capCls: 'lm-slate', crescent: true }) +
        minaret(156, 26, 4, { balconies: [38, 50], cap: 'cone', capCls: 'lm-slate', crescent: true }) +
        // the great dome on its windowed drum, corner turrets, half domes, then the cascade
        '<rect class="lm-stone" x="92" y="41" width="36" height="10"/>' + windows(94.6, 43.5, 9, 1, 1.6, 4, 2.2, 0) +
        '<path class="lm-slate" d="M89.5 43C89.5 29 100.5 22 110 21C119.5 22 130.5 29 130.5 43Z"/>' +
        '<rect class="lm-gold" x="109.4" y="12" width="1.2" height="9"/>' + crescent(110, 10.4) +
        turret(86, 46) + turret(134, 46) +
        '<rect class="lm-stone" x="72" y="56" width="76" height="8"/>' +
        '<path class="lm-slate" d="M72 57a13 9 0 0 1 26 0Z"/><path class="lm-slate" d="M122 57a13 9 0 0 1 26 0Z"/>' +
        '<path class="lm-slate" d="M97 55a13 9 0 0 1 26 0Z"/>' +
        smallDomes(78, 142, 64, 4) +
        '<rect class="lm-stone" x="60" y="64" width="100" height="10"/>' + windows(63, 66.5, 16, 1, 2, 4, 4, 0) +
        smallDomes(64, 156, 74, 3.4) +
        '<rect class="lm-stone" x="50" y="74" width="120" height="14"/>' + arches(54, 77, 4, 10, 14, 4.4) +
        // four front minarets with three balconies each
        minaret(30, 16, 4.4, { balconies: [30, 44, 58], cap: 'cone', capCls: 'lm-slate', crescent: true }) +
        minaret(46, 20, 4.4, { balconies: [34, 48, 62], cap: 'cone', capCls: 'lm-slate', crescent: true }) +
        minaret(174, 20, 4.4, { balconies: [34, 48, 62], cap: 'cone', capCls: 'lm-slate', crescent: true }) +
        minaret(190, 16, 4.4, { balconies: [30, 44, 58], cap: 'cone', capCls: 'lm-slate', crescent: true }) +
        // Galata Tower on its hill
        '<path class="lm-far" d="M198 96V80Q214 66 232 72Q240 76 244 96Z"/>' +
        '<rect class="lm-stone" x="208" y="36" width="15" height="42"/>' +
        '<rect class="lm-stone" x="205.8" y="35" width="19.4" height="2.6"/>' +
        '<rect class="lm-stone" x="209" y="30.4" width="13" height="4.6"/>' + windows(211, 31.4, 3, 1, 1.6, 2.2, 2.6, 0) +
        '<path class="lm-slate" d="M207 31L215.5 8L224 31Z"/><rect class="lm-gold" x="214.9" y="3" width="1.2" height="5.4"/>' +
        windows(211.2, 41, 3, 4, 1.6, 4.4, 2.6, 4.6) +
        // the Bosphorus Bridge, behind the street
        '<rect class="lm-stone-2" x="300" y="34" width="3.2" height="50"/><rect class="lm-stone-2" x="338" y="34" width="3.2" height="50"/>' +
        '<path class="lm-line" d="M252 70Q280 66 301.6 35M301.6 35Q320 64 339.6 35M339.6 35Q350 62 ' + X1 + ' 68"/>' +
        '<rect class="lm-stone-2" x="252" y="69" width="' + (X1 - 252) + '" height="2.2"/>' +
        // the street, the overhead wire and the red nostalgic tram
        '<rect class="lm-stone-2" x="236" y="86" width="' + (X1 - 236) + '" height="10"/>' +
        '<path class="lm-line" d="M236 64H' + X1 + '"/>' +
        '<path class="lm-line" d="M276 71.4L268 64"/>' +
        '<rect class="lm-slate" x="258" y="71" width="34" height="1.6" rx="0.8"/>' +
        '<path class="lm-red" d="M252 86V77Q252 72.4 256.5 72.4H293.5Q298 72.4 298 77V86Z"/>' +
        '<rect class="lm-cream" x="252" y="80.6" width="46" height="2.2"/>' +
        '<g class="lm-detail">' + windows(255, 74.6, 7, 1, 4, 4.4, 2, 0).replace(/ class="lm-detail"/g, '') + '</g>' +
        '<circle class="lm-slate" cx="259" cy="86.4" r="1.8"/><circle class="lm-slate" cx="291" cy="86.4" r="1.8"/>' +
        // trees at the foot of the mosque
        '<path class="lm-trees" d="M' + X0 + ' 96V90Q0 84 20 88Q34 82 48 88Q62 83 76 88Q92 83 108 88Q124 83 140 88Q156 82 172 88Q188 83 200 88Q214 84 236 90V96Z"/>'
    , 'The Blue Mosque, Galata Tower, a nostalgic tram and the Bosphorus Bridge');

    // ---------------------------------------------------------------- Riyadh
    // The Kingdom Centre: a tall slab of dark glass with a deep U cut from its top, spanned by the
    // sky bridge; Al Faisaliah Tower: a straight-sided pyramid of louvres with the golden sphere near
    // its top and an open lattice above it; Masmak Fort; a Riyadh Metro train on its viaduct.
    L.riyadh = svg(
        '<path class="lm-far" d="M' + X0 + ' 96V74H-200V66H-180V72H-120V62H-100V70H-40V64H-20V70H10V60H24V68H60V72H100V66H112V96ZM230 96V64H238V56H246V70H300V62H316V68H' + X1 + 'V96Z"/>' +
        ground('lm-stone-2', 92) +
        // Kingdom Centre
        '<rect class="lm-stone-2" x="112" y="82" width="78" height="10"/>' + windows(116, 85, 10, 1, 4.6, 4, 2.6, 0) +
        '<path class="lm-glass-dark" fill-rule="evenodd" d="M131.5 92L133 -3H167L168.5 92Z' +
        'M137.4 2.2Q150 4.4 162.6 2.2Q150 72 137.4 2.2Z"/>' +
        '<path class="lm-line" d="M137.4 2.2Q150 72 162.6 2.2"/>' +
        windows(135, 44, 7, 6, 2.2, 1.2, 2.8, 5.6) +
        // Al Faisaliah Tower
        '<path class="lm-metal" d="M198 92L208.3 22H215.7L226 92Z"/>' +
        '<g class="lm-line"><path d="M207.4 28H216.6M206.3 36H217.7M205.2 44H218.8M204 52H220M202.9 60H221.1M201.8 68H222.2M200.6 76H223.4M199.5 84H224.5"/>' +
        '<path d="M206.4 40L212 44L217.6 40M203.2 62L212 66L220.8 62"/></g>' +
        '<rect class="lm-metal" x="207.4" y="20.6" width="9.2" height="2"/>' +
        '<circle class="lm-gold" cx="212" cy="16.4" r="4.2"/>' +
        '<path class="lm-metal" d="M208.5 12.6L212 -5L215.5 12.6H214.3L212 1.6L209.7 12.6Z"/>' +
        '<path class="lm-line" d="M209.4 9H214.6M210.2 5H213.8M211 1.2H213"/>' +
        // Masmak Fort: mud-brick walls, towers, the gate
        '<path class="lm-stone" d="M244 92V64H250V58H258V64H262V72H292V64H296V58H304V64H310V92Z"/>' +
        '<g class="lm-detail"><rect x="252" y="68" width="2.4" height="5"/><rect x="298" y="68" width="2.4" height="5"/><path d="M271 92V82a6 6 0 0 1 12 0V92Z"/><rect x="266" y="76" width="2" height="3"/><rect x="286" y="76" width="2" height="3"/></g>' +
        // metro viaduct and a train
        '<rect class="lm-stone-2" x="' + X0 + '" y="80" width="' + (112 - X0) + '" height="3"/>' +
        '<rect class="lm-stone-2" x="12" y="83" width="4" height="9"/><rect class="lm-stone-2" x="70" y="83" width="4" height="9"/>' +
        '<path class="lm-green" d="M4 80V72.5Q4 69 9 69H80Q87 69 89 74.5V80Z"/>' +
        '<g class="lm-detail">' + windows(12, 71.5, 7, 1, 6, 4, 3.6, 0).replace(/ class="lm-detail"/g, '') + '</g>'
    , 'The Kingdom Centre, Al Faisaliah Tower, Masmak Fort and the Riyadh Metro');

    // ---------------------------------------------------------------- Eastern Province
    // West to east, as on the map: the gate of Souq Al-Qaysariyah in Hofuf (Al-Ahsa), under its
    // stepped crenellations, with arched wooden shutters, a timber canopy and a carved pointed arch,
    // between date palms; Ithra (the King Abdulaziz Center for World Culture) in Dhahran, silver
    // steel pebbles around its banded tower; the Khobar Water Tower on its island in the Gulf, the tank
    // ringed with arched windows on a slim shaft, lit green at night.
    function merlons(x0, x1, y, w, gap, cls) {
        var out = '';
        for (var x = x0; x + w <= x1 + 0.01; x += w + gap) {
            out += '<path class="' + (cls || 'lm-stone') + '" d="M' + f(x) + ' ' + y + 'V' + f(y - 2.2) + 'H' + f(x + w * 0.25) + 'V' + f(y - 3.8) +
                'H' + f(x + w * 0.75) + 'V' + f(y - 2.2) + 'H' + f(x + w) + 'V' + y + 'Z"/>';
        }
        return out;
    }
    function palm(x, top, lean) {
        var out = '<path class="lm-wood" d="M' + x + ' 91Q' + (x + lean) + ' ' + f((91 + top) / 2) + ' ' + (x + lean * 0.6) + ' ' + top + '"/>';
        var tx = x + lean * 0.6;
        [[-11, 7], [-8, 1.5], [-3.5, -2.5], [3.5, -2.5], [8, 1.5], [11, 7]].forEach(function (p) {
            out += '<path class="lm-trees" d="M' + f(tx) + ' ' + top + 'Q' + f(tx + p[0] * 0.5) + ' ' + f(top - 4 + p[1] * 0.3) + ' ' + f(tx + p[0]) + ' ' + f(top + p[1]) +
                'Q' + f(tx + p[0] * 0.45) + ' ' + f(top - 1.6 + p[1] * 0.3) + ' ' + f(tx) + ' ' + f(top + 0.8) + 'Z"/>';
        });
        return out;
    }
    function qaysariyah() {
        return (
            // the wings: a blind wall with a small arch and a door on the west, an arcade on the east
            '<rect class="lm-stone" x="-16" y="56" width="38" height="35"/>' + merlons(-15.4, 20, 56, 3.4, 2.2) +
            windows(-12, 61, 5, 1, 2, 2, 5, 0) +
            '<rect class="lm-timber" x="-13" y="79" width="7" height="12"/>' +
            '<path class="lm-stone-2" d="M-1.5 91V77Q-1.5 70.6 5 68.6Q11.5 70.6 11.5 77V91Z"/>' +
            '<path class="lm-detail" d="M0.6 91V78Q0.6 72.8 5 71.2Q9.4 72.8 9.4 78V91Z"/>' +
            '<rect class="lm-stone" x="60" y="52" width="40" height="39"/>' + merlons(60.6, 100, 52, 3.4, 2.2) +
            windows(64.6, 56.4, 6, 1, 2, 2, 4.4, 0) +
            arches(64.4, 62, 8, 29, 3, 3.6) +
            // the gate tower: corner piers with stepped crowns, crenellated top, louvred screens
            '<rect class="lm-stone" x="20" y="36" width="42" height="55"/>' +
            '<rect class="lm-stone" x="18.5" y="31" width="7.4" height="60"/><rect class="lm-stone" x="56.1" y="31" width="7.4" height="60"/>' +
            merlons(18.5, 25.9, 31, 7.4, 0) + merlons(56.1, 63.5, 31, 7.4, 0) + merlons(27.5, 55, 36, 3, 2.1) +
            '<rect class="lm-timber" x="27.4" y="37.6" width="9" height="2.6"/><rect class="lm-timber" x="45.6" y="37.6" width="9" height="2.6"/>' +
            '<path class="lm-line" d="M27.4 38.9H36.4M45.6 38.9H54.6"/>' +
            windows(30.2, 42.4, 3, 1, 2.6, 2.6, 6.4, 0) +
            arches(31.8, 46.4, 4, 7.4, 3, 3.2) +
            arches(20.6, 44, 3.4, 8, 1, 0) + arches(58, 44, 3.4, 8, 1, 0) +
            // the timber canopy on its brackets
            '<path class="lm-timber" d="M25.6 55H56.4L55 57.4H27Z"/>' +
            windows(28.4, 57.4, 9, 1, 0.8, 1.6, 2.5, 0).replace(/lm-detail/g, 'lm-timber') +
            // the carved pointed arch, open to the souq behind
            '<path class="lm-stone-2" d="M26.6 91V72Q26.6 62.4 41 58.6Q55.4 62.4 55.4 72V91Z"/>' +
            '<path class="lm-line" stroke-dasharray="1 0.9" d="M29 91V72.3Q29 64.2 41 60.9Q53 64.2 53 72.3V91"/>' +
            '<path class="lm-sky" d="M31 91V73Q31 66 41 62.8Q51 66 51 73V91Z"/>'
        );
    }
    function ithra() {
        // Brushed steel. Dark glazed bands wrap the tower: a straight one near the top, one rising
        // from the west that arches over to the east edge, two seams sweeping down from the crown,
        // and one near the foot (as seen from the south-west).
        var tower = 'M147.6 91L147 16Q147 4.4 152.4 4L171.6 4.2Q177 4.6 177 16L176 91Z';
        return '<defs><clipPath id="lm-ithra"><path d="' + tower + '"/></clipPath></defs>' +
            // drawn 30 wide, shown 36 (a broad slab, as from the south-west)
            '<g transform="translate(162 0) scale(1.2 1) translate(-162 0)">' +
            '<path class="lm-steel" d="' + tower + '"/>' +
            '<g clip-path="url(#lm-ithra)">' +
            '<path class="lm-steel-hi" d="M150.6 0Q149.2 45 151 91H155.2Q153.6 45 154.8 0Z"/>' +
            '<path class="lm-steel-2" d="M172.4 0H180V91H171.6Q174 50 172.4 0Z"/>' +
            '<g class="lm-band">' +
            '<path stroke-width="1.8" d="M143 21.4L181 13"/>' +
            '<path stroke-width="1.8" d="M143 55L159 30.4Q164 21.4 169 20.2Q174.4 19.6 180 31"/>' +
            '<path stroke-width="1.5" d="M164.6 3Q159.2 9.4 158.9 26L159 70"/>' +
            '<path stroke-width="1.1" d="M167.4 3Q162.2 12.8 161.8 28.4Q161.4 50 161 70"/>' +
            '<path stroke-width="1.8" d="M150 72.4L180 61.6"/>' +
            '</g></g>' +
            '<path class="lm-steel-edge" d="M147.6 91L147 16Q147 4.4 152.4 4L171.6 4.2Q177 4.6 177 16L176 91"/></g>' +
            // the capsule leaning on the tower's foot, its end glazed
            '<path class="lm-steel" d="M148.4 71Q149.4 57.8 156.6 57.4Q164.6 57.4 166.8 66.4Q168.4 75 167.6 85Q167 91 162 91H151Z"/>' +
            '<path class="lm-steel-hi" d="M151 66Q153 59.6 157 59.4Q153.4 61.6 152.6 68Z"/>' +
            '<path class="lm-steel-edge" d="M148.4 71Q149.4 57.8 156.6 57.4Q164.6 57.4 166.8 66.4Q168.4 75 167.6 85Q167 91 162 91"/>' +
            '<ellipse class="lm-glass-dark" cx="163.4" cy="82" rx="2.2" ry="3.8" transform="rotate(-14 163.4 82)"/>' +
            // the broad pebble to the west and the long one to the east
            '<path class="lm-steel" d="M106 91Q104.6 72 122 66.4Q138 62.6 151 65.4Q159.6 67.6 159 79Q158.4 88 155 91Z"/>' +
            '<path class="lm-steel-hi" d="M112 76Q118 68.4 132 66.2Q120 70 114 78Z"/>' +
            '<path class="lm-steel-edge" d="M106 91Q104.6 72 122 66.4Q138 62.6 151 65.4Q159.6 67.6 159 79Q158.4 88 155 91"/>' +
            '<path class="lm-steel-edge" opacity="0.5" d="M108 84Q122 71 150 70.6M110 89Q128 77 157 77"/>' +
            '<path class="lm-steel" d="M169.6 91Q168 74 179 69Q195 65 209 68.6Q219.6 71.6 220.6 83Q221 88 219.6 91Z"/>' +
            '<path class="lm-steel-2" d="M212 70Q219.6 73 220.6 83Q221 88 219.6 91H214Q216 80 212 70Z"/>' +
            '<path class="lm-steel-edge" d="M169.6 91Q168 74 179 69Q195 65 209 68.6Q219.6 71.6 220.6 83Q221 88 219.6 91"/>' +
            '<path class="lm-steel-edge" opacity="0.5" d="M172 80Q190 70.4 216 76M171 87Q192 78 219 84"/>' +
            // the low walls of the garden
            '<rect class="lm-stone-2" x="104" y="88" width="115" height="3.4"/>';
    }
    function waterTower(x) {
        var o = function (dx) { return f(x + dx); };
        var ribs = '', i;
        for (i = 0; i <= 8; i++) ribs += 'M' + o(-21.5 + i * 5.375) + ' 18.8Q' + o((-21.5 + i * 5.375) * 0.55) + ' 24.6 ' + o(-4.8 + i * 1.2) + ' 30.4';
        var petals = '';
        for (i = 0; i < 18; i++) petals += 'M' + o(-23 + i * 46 / 18) + ' 18.6L' + o(-23 + (i + 0.5) * 46 / 18) + ' 20.4L' + o(-23 + (i + 1) * 46 / 18) + ' 18.6';
        return (
            // light on the water at night
            '<path class="lm-glow" d="M' + o(-10) + ' 86.6H' + o(10) + 'L' + o(14) + ' 96H' + o(-14) + 'Z" opacity="0.5"/>' +
            '<path class="lm-glow" d="M' + o(-4) + ' 86.6H' + o(4) + 'L' + o(6) + ' 96H' + o(-6) + 'Z"/>' +
            // the island
            '<path class="lm-stone-2" d="M' + o(-50) + ' 86.6Q' + o(-42) + ' 84 ' + o(-30) + ' 84H' + o(36) + 'Q' + o(48) + ' 84 ' + o(56) + ' 86.6Z"/>' +
            // the flared foot and the shaft, with its glazed slit
            '<path class="lm-tower" d="M' + o(-5.5) + ' 60Q' + o(-6) + ' 75 ' + o(-20) + ' 79H' + o(20) + 'Q' + o(6) + ' 75 ' + o(5.5) + ' 60Z"/>' +
            '<rect class="lm-tower" x="' + o(-5.5) + '" y="29" width="11" height="33"/>' +
            '<path class="lm-rib" d="M' + o(-3.6) + ' 34V62Q' + o(-4) + ' 74 ' + o(-14) + ' 79M' + o(3.6) + ' 34V62Q' + o(4) + ' 74 ' + o(14) + ' 79' +
            'M' + o(-5.5) + ' 30L' + x + ' 34L' + o(5.5) + ' 30M' + o(-5.5) + ' 34L' + x + ' 30L' + o(5.5) + ' 34"/>' +
            '<rect class="lm-glass-dark" x="' + o(-0.7) + '" y="35" width="1.4" height="42"/>' +
            // the tank: petalled underside, scalloped rim, a ring of arched windows, the dome and lantern
            '<path class="lm-tower-2" d="M' + o(-23) + ' 18.6C' + o(-18) + ' 24 ' + o(-10) + ' 26 ' + o(-6) + ' 31H' + o(6) + 'C' + o(10) + ' 26 ' + o(18) + ' 24 ' + o(23) + ' 18.6Z"/>' +
            '<path class="lm-rib" d="' + ribs + '"/>' +
            '<path class="lm-tower" d="M' + o(-18) + ' 10L' + o(-22.4) + ' 16.6H' + o(22.4) + 'L' + o(18) + ' 10Z"/>' +
            arches(x - 18.7, 11.2, 2.6, 4.6, 9, 1.75, 'lm-glass-dark') +
            '<path class="lm-tower-3" d="M' + o(-23.6) + ' 16.4H' + o(23.6) + 'L' + o(23) + ' 18.8H' + o(-23) + 'Z"/>' +
            '<path class="lm-tower-3" d="' + petals + 'Z"/>' +
            '<path class="lm-tower-3" d="M' + o(-16.4) + ' 10.4Q' + o(-15) + ' 4 ' + x + ' 3Q' + o(15) + ' 4 ' + o(16.4) + ' 10.4Z"/>' +
            arches(x - 11.8, 7.4, 2, 3, 7, 1.6, 'lm-glass-dark') +
            '<path class="lm-tower" d="M' + o(-6) + ' 3.6Q' + o(-5.6) + ' -1.6 ' + x + ' -2Q' + o(5.6) + ' -1.6 ' + o(6) + ' 3.6Z"/>' +
            '<path class="lm-rib" d="M' + o(-3) + ' 3.4Q' + o(-2.6) + ' -0.4 ' + x + ' -1.8M' + o(3) + ' 3.4Q' + o(2.6) + ' -0.4 ' + x + ' -1.8M' + x + ' 3.4V-1.8"/>' +
            '<rect class="lm-tower" x="' + o(-0.6) + '" y="-4.4" width="1.2" height="2.6"/>' +
            // the pavilion at its foot: lattice domes and a long glazed arcade
            '<path class="lm-white" d="M' + o(-35) + ' 78Q' + o(-35) + ' 73 ' + o(-30.4) + ' 72.6Q' + o(-25.8) + ' 73 ' + o(-25.8) + ' 78Z"/>' +
            '<path class="lm-white" d="M' + o(-27) + ' 78Q' + o(-27) + ' 73.6 ' + o(-22.8) + ' 73.2Q' + o(-18.6) + ' 73.6 ' + o(-18.6) + ' 78Z"/>' +
            '<rect class="lm-stone" x="' + o(-36) + '" y="78" width="78" height="6"/>' +
            '<rect class="lm-white" x="' + o(-36.6) + '" y="77.4" width="79.2" height="1.2"/>' +
            arches(x - 34, 79, 3.2, 5, 15, 1.9, 'lm-glass-dark')
        );
    }
    L.eastern = svg(
        // low dunes inland; the Gulf from Al Khobar east
        hills('lm-far', 80, 3, 60, 222) +
        ground('lm-stone-2', 91) +
        water(86, 218) +
        qaysariyah() +
        ithra() +
        palm(-20, 50, 1.6) + palm(103, 52, -1.4) + palm(109, 60, 1.2) +
        waterTower(276)
    , 'Souq Al-Qaysariyah, Ithra (the King Abdulaziz Center for World Culture) and the Khobar Water Tower');

    // ---------------------------------------------------------------- Bahrain
    // West to east, as on the map: the Sakhir Tower of the Bahrain International Circuit in the
    // desert, its floors ringed with LED bands (lit in colour by day, silver and patterned by night)
    // under a crown of white tents and the flag; then on the Manama waterfront the Harbour Towers of
    // Bahrain Financial Harbour, two green glass sails whose feet sweep in to meet; the Bahrain World
    // Trade Center, two blade towers with a wind turbine on each of the three bridges between them;
    // and the Four Seasons Bahrain Bay on its island, two bronze slabs joined by a sky bridge, a dark
    // glass block hung between them.
    function poly(pts) { return 'M' + pts.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join('L'); }

    // A floodlight mast of the circuit.
    function mast(x, top) {
        return '<rect class="lm-slate" x="' + f(x - 0.35) + '" y="' + top + '" width="0.7" height="' + (91 - top) + '"/>' +
            '<rect class="lm-white" x="' + f(x - 1.9) + '" y="' + (top - 2.2) + '" width="3.8" height="2.6" rx="0.4"/>' +
            windows(x - 1.5, top - 1.8, 3, 2, 0.8, 0.8, 0.35, 0.3);
    }
    // A white tent of the paddock, rising to a point.
    function tent(x, peak, half) {
        return '<path class="lm-white" d="M' + f(x - half) + ' 90.4Q' + f(x - half * 0.3) + ' 88.6 ' + f(x - 0.3) + ' ' + (peak + 2.6) + 'L' + x + ' ' + peak +
            'L' + f(x + 0.3) + ' ' + (peak + 2.6) + 'Q' + f(x + half * 0.3) + ' 88.6 ' + f(x + half) + ' 90.4Z"/>';
    }
    function sakhirTower(cx) {
        // eight floors, each a band round a recessed glazed storey; the drum is widest near the top
        var W = [23, 23.6, 23.4, 23, 22.4, 21.6, 20.8, 19.8];
        // each band's colour, and a second colour flowing over part of it (from x offset a to b)
        var LED = [[1, 2, -6, 6], [2, 3, 4, 14], [3, 1, -16, -6], [3, 2, 2, 16], [2, 1, -14, -2], [3, 2, 6, 18], [1, 3, -10, 4], [1, 2, -18, -8]];
        var top = 42, pitch = 5.25, h = 3, out = '', i, y, x;
        // a band's edge from x offset a to b: seen from below, it bows down in the middle
        function arc(w, y, s, a, b) {
            var pts = [];
            for (var k = 0; k <= 8; k++) {
                var dx = a + (b - a) * k / 8, t = (dx + w) / (2 * w);
                pts.push([cx + dx, y + 2 * s * t * (1 - t)]);
            }
            return pts;
        }
        function band(w, y, s, a, b) { return poly(arc(w, y, s, a, b).concat(arc(w, y + h, s, a, b).reverse())) + 'Z'; }
        // the glazed storeys behind the bands, down to the ground floor, with their mullions
        var left = [], right = [];
        for (i = 0; i < 8; i++) {
            y = top + i * pitch;
            left.push([cx - W[i] + 1.8, y + 1]); right.unshift([cx + W[i] - 1.8, y + 1]);
        }
        left.push([cx - 17, 91]); right.unshift([cx + 17, 91]);
        out += '<path class="lm-bic-glass" d="' + poly(left.concat(right)) + 'Z"/>';
        var mull = '';
        for (x = -16; x <= 16; x += 3.2) mull += 'M' + f(cx + x) + ' ' + (top + 2) + 'V91';
        out += '<path class="lm-bic-mark" stroke-width="0.3" d="' + mull + '"/>';
        // the bands, and the pattern printed on them (shown by night)
        for (i = 0; i < 8; i++) {
            y = top + i * pitch;
            var s = 1.7 - i * 0.14;
            out += '<path class="lm-led-' + LED[i][0] + '" d="' + band(W[i], y, s, -W[i], W[i]) + '"/>' +
                '<path class="lm-led-' + LED[i][1] + '" d="' + band(W[i], y, s, LED[i][2], LED[i][3]) + '"/>' +
                '<path class="lm-bic-mark" stroke-width="0.6" stroke-dasharray="2.2 0.7 0.6 0.7 1.3 1.1" d="' + poly(arc(W[i], y + h / 2, s, 0.6 - W[i], W[i] - 0.6)) + '"/>';
        }
        // the crown: white tents on a ring of masts
        var peaks = [[-24, 35, 5], [-17, 31, 7], [-9, 29.4, 8], [0, 28, 9], [9, 29.4, 8], [17, 31, 7], [24, 35, 5]];
        var prev = [-27.5, 40.6], d = 'M' + f(cx - 27.5) + ' 42.2V40.6', needles = '';
        peaks.forEach(function (p, k) {
            var next = k < peaks.length - 1 ? [(p[0] + peaks[k + 1][0]) / 2, 39.4] : [27.5, 40.6];
            d += 'Q' + f(cx + p[0] - 0.3 * (p[0] - prev[0])) + ' ' + prev[1] + ' ' + f(cx + p[0]) + ' ' + p[1] +
                'Q' + f(cx + p[0] + 0.3 * (next[0] - p[0])) + ' ' + next[1] + ' ' + f(cx + next[0]) + ' ' + next[1];
            needles += 'M' + f(cx + p[0] - 0.35) + ' ' + (p[1] + 0.4) + 'L' + f(cx + p[0]) + ' ' + (p[1] - p[2]) + 'L' + f(cx + p[0] + 0.35) + ' ' + (p[1] + 0.4) + 'Z';
            prev = next;
        });
        out += '<path class="lm-white" d="' + d + 'V42.2Z"/><path class="lm-white" d="' + needles + '"/>';
        // the flag of Bahrain on its pole: white at the hoist, five points into the red
        var fx = cx - 6;
        out += '<rect class="lm-white" x="' + f(fx - 0.25) + '" y="11.6" width="0.5" height="29"/>' +
            '<rect class="lm-white" x="' + f(fx + 0.25) + '" y="12" width="8" height="5"/>' +
            '<path class="lm-red" d="M' + f(fx + 2.2) + ' 12H' + f(fx + 8.25) + 'V17H' + f(fx + 2.2) +
            'L' + f(fx + 3.2) + ' 16.5L' + f(fx + 2.2) + ' 16L' + f(fx + 3.2) + ' 15.5L' + f(fx + 2.2) + ' 15L' + f(fx + 3.2) + ' 14.5L' +
            f(fx + 2.2) + ' 14L' + f(fx + 3.2) + ' 13.5L' + f(fx + 2.2) + ' 13L' + f(fx + 3.2) + ' 12.5Z"/>';
        // the red entrance, and the paddock's tents in front
        out += '<rect class="lm-red" x="' + f(cx - 5) + '" y="85.6" width="10" height="5.4"/>' +
            '<rect class="lm-detail" x="' + f(cx - 3) + '" y="87.2" width="6" height="3.8"/>' +
            tent(cx - 14, 72, 10) + tent(cx - 1, 75, 8.5);
        return out;
    }

    // The two sails of Bahrain Financial Harbour, from x0 (the west tower's west face).
    function harbourTowers(x0) {
        var B = 87;
        var o = function (dx) { return f(x0 + dx); };
        // the inner edges, as an offset at a height: each flares out at the foot to meet the other
        function westEdge(y) {
            return y <= 21.5 ? 16.9 + 1.3 * (y - 2) / 19.5 : y <= 47.5 ? 18.2 : 18.2 + 14.8 * Math.pow(Math.min(1, (y - 47.5) / 36.5), 2.2);
        }
        function eastEdge(y) { return y <= 47 ? 49.4 : 49.4 - 15.4 * Math.pow(Math.min(1, (y - 47) / 37), 2.2); }
        function along(edge, y0, y1) {
            var pts = [];
            for (var y = y0; y < y1; y += 1.5) pts.push([x0 + edge(y), y]);
            pts.push([x0 + edge(y1), y1]);
            return pts;
        }
        // a strip running beside an edge, from offset a to b
        function strip(edge, a, b, y0, y1) {
            var near = along(edge, y0, y1).map(function (p) { return [p[0] + a, p[1]]; });
            var far = along(edge, y0, y1).map(function (p) { return [p[0] + b, p[1]]; }).reverse();
            return poly(near.concat(far)) + 'Z';
        }
        var west = 'M' + o(0) + ' ' + B + 'V11H' + o(5) + 'Q' + o(11) + ' 9.6 ' + o(16.9) + ' 2' + poly(along(westEdge, 2, B)).replace('M', 'L') + 'H' + o(0) + 'Z';
        var east = 'M' + o(60.5) + ' ' + B + 'V22.8L' + o(57.2) + ' 12.5Q' + o(53.6) + ' 21.6 ' + o(49.4) + ' 26' + poly(along(eastEdge, 28, B)).replace('M', 'L') + 'Z';
        // floors, broken into lit windows by night
        var floors = '', y;
        for (y = 13; y < 86; y += 2.4) floors += 'M' + o(0.6) + ' ' + f(y) + 'H' + o(westEdge(y) - 0.6);
        for (y = 28.6; y < 86; y += 2.4) floors += 'M' + o(eastEdge(y) + 0.6) + ' ' + f(y) + 'H' + o(59.9);
        return (
            '<path class="lm-bfh" d="' + east + '"/>' +
            '<path class="lm-bfh-2" d="' + strip(eastEdge, 0, 4.2, 26, B) + '"/>' +
            '<path class="lm-bfh-hi" d="' + strip(eastEdge, 1.4, 2.2, 50, B) + '"/>' +
            '<rect class="lm-bfh-hi" x="' + o(57.4) + '" y="26" width="1.2" height="' + (B - 26) + '"/>' +
            '<path class="lm-bfh" d="' + west + '"/>' +
            '<path class="lm-bfh-2" d="' + strip(westEdge, -4.2, 0, 3, B) + '"/>' +
            '<path class="lm-bfh-hi" d="' + strip(westEdge, -2.2, -1.4, 24, B) + strip(westEdge, -3.8, -3.2, 50, B) + '"/>' +
            '<path class="lm-bfh-line" stroke-width="0.5" stroke-dasharray="1.6 0.7 0.9 0.7 2.2 0.9" d="' + floors + '"/>' +
            // the metal edges of the sails (purple lights by night), the crown's joint, the spires
            '<path class="lm-bfh-led" d="M' + o(5) + ' 11Q' + o(11) + ' 9.6 ' + o(16.9) + ' 2' + poly(along(westEdge, 2, B)).replace('M', 'L') +
            'M' + o(0) + ' 21.5H' + o(18.2) +
            'M' + o(34) + ' ' + B + poly(along(eastEdge, 28, B).reverse()).replace('M', 'L') + 'L' + o(49.4) + ' 26Q' + o(53.6) + ' 21.6 ' + o(57.2) + ' 12.5L' + o(60.5) + ' 22.8"/>' +
            '<path class="lm-metal" d="M' + o(2.4) + ' 11.2L' + o(4) + ' 1.6L' + o(5.6) + ' 11.2Z"/>' +
            '<rect class="lm-metal" x="' + o(3.75) + '" y="-4" width="0.5" height="6"/>' +
            '<path class="lm-metal" d="M' + o(55.8) + ' 16L' + o(57.2) + ' 7L' + o(58.6) + ' 16Z"/>' +
            '<rect class="lm-metal" x="' + o(56.95) + '" y="-1" width="0.5" height="8.5"/>' +
            // the podium in front
            '<rect class="lm-stone" x="' + o(-6) + '" y="76" width="74" height="' + (B - 76) + '"/>' +
            windows(x0 - 4, 78.2, 1, 3, 70, 1.3, 0, 1.6)
        );
    }

    // A wind turbine: three slim blades from the hub, turned to `deg`.
    function turbine(x, y, r, deg) {
        var d = '';
        for (var k = 0; k < 3; k++) {
            var a = (deg + k * 120) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
            d += 'M' + f(x - s * 0.45) + ' ' + f(y + c * 0.45) + 'L' + f(x + c * r) + ' ' + f(y + s * r) + 'L' + f(x + s * 0.45) + ' ' + f(y - c * 0.45) + 'Z';
        }
        return '<path class="lm-white" d="' + d + '"/><circle class="lm-slate" cx="' + x + '" cy="' + f(y) + '" r="0.6"/>';
    }
    // The Bahrain World Trade Center, centred on cx: two triangular blades facing each other. On each,
    // the outer face is louvred in pale bands (lit gold by night), the inner face glazed in blue.
    function worldTradeCenter(cx) {
        var A = 3, B = 87, I = 5, W = 25, S = 11;     // apex, base; offsets from cx: inner edge, base width, glazed width at the base
        var outer = function (y) { return I + W * (y - A) / (B - A); };
        var split = function (y) { return I + 1 + (S - 1) * (y - 14) / (B - 14); };
        var out = '';
        [-1, 1].forEach(function (side) {
            var X = function (dx) { return f(cx + side * dx); };
            var bands = '', floors = '', y;
            for (y = 16; y < B - 0.5; y += 1.9) bands += 'M' + X(split(y) + 0.3) + ' ' + f(y) + 'H' + X(outer(y) - 0.3);
            for (y = 8; y < B; y += 3.2) {
                var end = Math.min(split(y), outer(y)) - 0.3;
                if (end > I + 0.6) floors += 'M' + X(I + 0.3) + ' ' + f(y) + 'H' + X(end);
            }
            out += '<path class="lm-wtc-glass" d="M' + X(I) + ' ' + A + 'L' + X(outer(B)) + ' ' + B + 'H' + X(I) + 'Z"/>' +
                '<path class="lm-wtc" d="M' + X(split(14)) + ' 14L' + X(outer(14)) + ' 14L' + X(outer(B)) + ' ' + B + 'H' + X(split(B)) + 'Z"/>' +
                '<path class="lm-wtc-line" stroke-width="0.8" d="' + bands + '"/>' +
                '<path class="lm-wtc-line" stroke-width="0.35" d="' + floors + '"/>' +
                '<path class="lm-wtc-edge" d="M' + X(I) + ' ' + B + 'V' + A + 'L' + X(outer(B)) + ' ' + B + 'M' + X(split(14)) + ' 14L' + X(split(B)) + ' ' + B + '"/>';
        });
        // the three bridges, each carrying a turbine
        [40, 53.4, 66.8].forEach(function (y, k) {
            out += '<rect class="lm-slate" x="' + f(cx - I - 0.6) + '" y="' + y + '" width="' + (2 * I + 1.2) + '" height="1.3"/>' +
                turbine(cx, y - 0.3, 4.6, [15, 65, 100][k]);
        });
        // the shell-roofed podium between the feet
        return out + '<path class="lm-glass" d="M' + (cx - 10) + ' ' + B + 'V84.4Q' + cx + ' 81.6 ' + (cx + 10) + ' 84.4V' + B + 'Z"/>' +
            '<path class="lm-white" d="M' + f(cx - 10.6) + ' 84.6Q' + cx + ' 81.4 ' + f(cx + 10.6) + ' 84.6L' + f(cx + 10.6) + ' 83.8Q' + cx + ' 80.6 ' + f(cx - 10.6) + ' 83.8Z"/>';
    }

    // Windows in a grid, of which only some are lit; `seed` picks which, the same every time.
    function litWindows(x0, y0, cols, rows, w, h, gx, gy, share, seed) {
        var out = '';
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                seed = (seed * 9301 + 49297) % 233280;
                if (seed / 233280 < share) out += '<rect class="lm-detail" x="' + f(x0 + c * (w + gx)) + '" y="' + f(y0 + r * (h + gy)) + '" width="' + w + '" height="' + h + '"/>';
            }
        }
        return out;
    }
    // The Four Seasons Bahrain Bay, centred on cx, on its island.
    function fourSeasons(cx) {
        var out = '';
        // two champagne slabs (floodlit amber by night), each with a strip of bronze fins down its east
        // side, dark glass between the fins where a few windows are lit
        [[-20, -5, 0.7], [5, 20, 1.4]].forEach(function (s, i) {
            out += '<rect class="lm-fs" x="' + (cx + s[0]) + '" y="4" width="15" height="81"/>' +
                '<rect class="lm-fs-2" x="' + (cx + s[0]) + '" y="4" width="' + s[2] + '" height="81"/>' +
                '<rect class="lm-fs-fin" x="' + (cx + s[1] - 3) + '" y="4" width="3" height="81"/>';
            for (var k = 0; k < 4; k++) out += '<rect class="lm-fs-rib" x="' + f(cx + s[1] - 2.7 + k * 0.8) + '" y="4" width="0.3" height="81"/>';
            out += litWindows(cx + s[1] - 2.6, 6, 3, 34, 0.6, 0.7, 0.3, 1.6, 0.3, 7 + i * 13);
        });
        // the sky bridge near the top, and the dark glass block hung between the slabs
        out += '<rect class="lm-fs-glass" x="' + (cx - 6) + '" y="9.6" width="15" height="6.4"/>' +
            '<rect class="lm-fs-fin" x="' + (cx - 6) + '" y="9.6" width="15" height="0.6"/><rect class="lm-fs-fin" x="' + (cx - 6) + '" y="15.4" width="15" height="0.6"/>' +
            litWindows(cx - 5.2, 11, 9, 2, 1, 1, 0.6, 1.2, 0.7, 3) +
            '<rect class="lm-fs-glass" x="' + (cx - 5.6) + '" y="36" width="18" height="35"/>' +
            '<rect class="lm-fs-fin" x="' + (cx - 5.6) + '" y="36" width="18" height="0.7"/>' +
            litWindows(cx - 4.8, 37.8, 10, 14, 1, 1, 0.6, 1.3, 0.55, 11);
        // the conference hall, two stacked boxes glowing by night; the island's gardens, strung with
        // lights by night, and its rim; the footbridge from the shore
        out += '<rect class="lm-fs-hall" x="' + (cx - 40) + '" y="77.4" width="17" height="7"/>' +
            '<rect class="lm-fs-2" x="' + (cx - 40) + '" y="77.4" width="17" height="0.8"/>' +
            '<rect class="lm-fs-hall" x="' + (cx - 43) + '" y="81.6" width="12" height="5"/>' +
            '<rect class="lm-fs-2" x="' + (cx - 43) + '" y="81.6" width="12" height="0.8"/>' +
            '<path class="lm-trees" d="M' + (cx - 44) + ' 89Q' + (cx - 41) + ' 85.4 ' + (cx - 30) + ' 85.6Q' + (cx - 26) + ' 82.6 ' + (cx - 22) + ' 84Q' + (cx - 14) + ' 82.4 ' +
            (cx - 6) + ' 83.8Q' + (cx + 4) + ' 82.2 ' + (cx + 14) + ' 83.6Q' + (cx + 24) + ' 82.4 ' + (cx + 32) + ' 84.2Q' + (cx + 42) + ' 84.2 ' + (cx + 46) + ' 89Z"/>' +
            '<rect class="lm-stone-2" x="' + (cx - 46) + '" y="88.2" width="94" height="1.4" rx="0.7"/>';
        var lights = '', seed = 5, x;
        for (x = cx - 44; x <= cx + 46; x += 2.2) lights += 'M' + f(x) + ' 88.5h0.7v0.7h-0.7Z';
        for (x = cx - 26; x <= cx + 42; x += 1.9) {
            seed = (seed * 9301 + 49297) % 233280;
            lights += 'M' + f(x) + ' ' + f(84.8 + 3 * seed / 233280) + 'h0.6v0.6h-0.6Z';
        }
        out += '<path class="lm-lights" d="' + lights + '"/>' +
            '<rect class="lm-stone-2" x="' + (cx - 62) + '" y="87.4" width="18" height="1"/>' +
            '<rect class="lm-stone-2" x="' + (cx - 58) + '" y="88.4" width="0.8" height="2.4"/><rect class="lm-stone-2" x="' + (cx - 51) + '" y="88.4" width="0.8" height="2.4"/>';
        return out;
    }

    // A landmark drawn round x = 0 and standing on `base`, moved to x and scaled by k from its foot.
    function place(x, base, k, body) {
        return '<g transform="translate(' + x + ' ' + base + ') scale(' + k + ') translate(0 ' + (-base) + ')">' + body + '</g>';
    }
    // Light on the water by night, under a tower centred on x.
    function glow(cls, x, w) {
        return '<path class="' + cls + '" d="M' + f(x - w / 2) + ' 89.6H' + f(x + w / 2) + 'L' + f(x + w / 2 - 2) + ' 96H' + f(x - w / 2 + 2) + 'Z"/>';
    }

    // Four landmarks are too many for 320 wide: they are drawn larger and spread over the width a city
    // card shows (about x -70 to 390); the narrow city button crops the ends.
    L.bahrain = svg(
        // dunes round Sakhir; Manama's skyline behind the waterfront
        hills('lm-far', 80, 2.5, 120, 44) +
        '<path class="lm-far" d="M44 96V76H50V68H56V74H140V64H146V58H151V70H232V66H238V60H244V72H252V62H258V70H340V66H346V58H352V64H358V72H370V64H378V70H' + X1 + 'V96Z"/>' +
        ground('lm-stone-2', 91) +
        '<rect class="lm-trees" x="' + X0 + '" y="89.4" width="' + (46 - X0) + '" height="1.8"/>' +
        // the sea from Manama east, the corniche, and the towers' light on the water by night
        water(89, 44) +
        '<rect class="lm-stone-2" x="46" y="86.6" width="184" height="3"/>' +
        glow('lm-glow-w', 69, 14) + glow('lm-glow-w', 117, 16) +
        glow('lm-glow-v', 169, 20) + glow('lm-glow-v', 211, 20) +
        glow('lm-glow-w', 286, 18) + glow('lm-glow-w', 314, 18) +
        place(-4, 91, 1.3, mast(-31, 54) + sakhirTower(0) + palm(-25, 68, -1.2) + palm(21, 70, 1.4) + mast(30, 54)) +
        place(58, 87, 1.15, harbourTowers(0)) +
        place(190, 87, 1.15, worldTradeCenter(0)) +
        place(300, 89, 1.15, fourSeasons(0))
    , 'The Sakhir Tower of the Bahrain International Circuit, the Bahrain Financial Harbour towers, the Bahrain World Trade Center and the Four Seasons Bahrain Bay');

    // ---------------------------------------------------------------- Ankara
    // West to east, as on the map: YDA Center, two glass towers under one roofline, a rounded peak
    // and a sharp one with a deep U between them (ribbed with fins by day; by night its floors are
    // lit and blue light runs along the roofline); Atakule, a white shaft under a head of decks and
    // a geodesic glass dome (floodlit pink by night), over its shopping centre; Kocatepe Mosque, the
    // lead dome on its windowed drum over a hall of white stone, with four slender minarets of three
    // balconies; and the Clock Tower, beside a café parasol and two old Ankara houses.

    // A far skyline of apartment blocks along the whole backdrop; `seed` picks the heights.
    function blocks(cls, base, seed) {
        var d = 'M' + X0 + ' 96V' + base;
        for (var x = X0; x < X1;) {
            seed = (seed * 9301 + 49297) % 233280;
            var w = 6 + Math.round(10 * seed / 233280);
            seed = (seed * 9301 + 49297) % 233280;
            d += 'H' + x + 'V' + f(base - 3 - 9 * seed / 233280) + 'H' + Math.min(x + w, X1) + 'V' + base;
            x += w + 2;
        }
        return '<path class="' + cls + '" d="' + d + 'H' + X1 + 'V96Z"/>';
    }

    // YDA Center, from x0 (its west face).
    function ydaCenter(x0) {
        var o = function (dx) { return f(x0 + dx); };
        var roof = 'M' + o(0) + ' 12Q' + o(0) + ' 4.6 ' + o(7) + ' 4.6C' + o(19) + ' 4.6 ' + o(21) + ' 47 ' + o(30) + ' 48' +
            'Q' + o(36) + ' 48.4 ' + o(40) + ' 40L' + o(54) + ' 7L' + o(64) + ' 20';
        var fins = '', floors = '', x, y;
        for (x = 1.6; x < 64; x += 2.2) fins += 'M' + o(x) + ' 4V91';
        for (y = 8; y < 84; y += 2.6) floors += 'M' + o(0.8) + ' ' + f(y) + 'H' + o(63.2);
        return '<defs><clipPath id="lm-yda"><path d="' + roof + 'V91H' + o(0) + 'Z"/></clipPath></defs>' +
            '<path class="lm-yda" d="' + roof + 'V91H' + o(0) + 'Z"/>' +
            '<g clip-path="url(#lm-yda)">' +
            // the east tower's side, and the seam where the towers meet
            '<path class="lm-yda-2" d="M' + o(54) + ' 7L' + o(64) + ' 20V91H' + o(54) + 'Z"/>' +
            '<rect class="lm-yda-2" x="' + o(29) + '" y="40" width="2.2" height="51"/>' +
            '<path class="lm-yda-fin" stroke-width="0.4" d="' + fins + '"/>' +
            '<path class="lm-yda-lit" stroke-width="0.7" stroke-dasharray="1.6 0.7 0.9 0.7 2.2 0.9 0.6 1.2" d="' + floors + '"/>' +
            '</g>' +
            '<path class="lm-yda-led" stroke-width="0.8" d="' + roof + '"/>' +
            '<rect class="lm-white" x="' + o(52.8) + '" y="13" width="3.6" height="1.2"/>' +
            // the glazed podium under its curved white canopy
            '<rect class="lm-yda-2" x="' + o(-4) + '" y="85" width="72" height="6"/>' +
            windows(x0 - 2.4, 87, 17, 1, 2.6, 2.4, 1.4, 0) +
            '<path class="lm-white" d="M' + o(4) + ' 85.4Q' + o(22) + ' 81 ' + o(42) + ' 85.4V86.4Q' + o(22) + ' 82 ' + o(4) + ' 86.4Z"/>';
    }

    // The geodesic dome of Atakule, centred on cx, standing on `base`: parallels, and triangles
    // between them (nodes spaced as on a sphere), meeting at the top.
    function geodesic(cx, base, rx, ry) {
        var lat = [0, 24, 46, 66], n = [11, 9, 7, 4], d = '';
        // a point on parallel k, t from 0 (west) to 1 (east)
        var at = function (k, t) {
            var a = lat[k] * Math.PI / 180;
            return [cx + rx * Math.cos(a) * Math.sin((t - 0.5) * Math.PI), base - ry * Math.sin(a)];
        };
        for (var k = 0; k < lat.length; k++) {
            if (k) d += poly([at(k, 0), at(k, 1)]);
            // up to the next parallel (or the top): nodes at i / n below, (i + 0.5) / n above
            var zig = [];
            for (var i = 0; i <= n[k]; i++) {
                zig.push(at(k, i / n[k]));
                if (i < n[k]) zig.push(k + 1 < lat.length ? at(k + 1, (i + 0.5) / n[k]) : [cx, base - ry]);
            }
            d += poly(zig);
        }
        return d;
    }

    // Atakule, centred on cx.
    function atakule(cx) {
        var o = function (dx) { return f(cx + dx); };
        return (
            // the shopping centre at its foot: its facade, glazed bands and the big screen
            '<rect class="lm-ata-2" x="' + o(-26) + '" y="79" width="54" height="12"/>' +
            '<rect class="lm-ata" x="' + o(-27) + '" y="78" width="56" height="1.6"/>' +
            '<rect class="lm-ata-glass" x="' + o(-26) + '" y="82" width="54" height="1.4"/>' +
            '<rect class="lm-ata-glass" x="' + o(-26) + '" y="85.6" width="54" height="1.4"/>' +
            '<rect class="lm-ata-screen" x="' + o(-12) + '" y="80.6" width="13" height="6.4"/>' +
            // the shaft, rounded by a shaded edge, with its lift in a dark glazed strip
            '<rect class="lm-ata" x="' + o(-4.5) + '" y="26" width="9" height="53"/>' +
            '<rect class="lm-ata-2" x="' + o(2.6) + '" y="26" width="1.9" height="53"/>' +
            '<rect class="lm-ata-glass" x="' + o(0.4) + '" y="29" width="1.4" height="49"/>' +
            // the flared collar, the observation balcony and the restaurant drum
            '<path class="lm-ata" d="M' + o(-4.5) + ' 28.4L' + o(-7.2) + ' 23.6H' + o(7.2) + 'L' + o(4.5) + ' 28.4Z"/>' +
            '<rect class="lm-ata-glass" x="' + o(-7.6) + '" y="21" width="15.2" height="2.6"/>' +
            '<rect class="lm-ata" x="' + o(-8.8) + '" y="20.2" width="17.6" height="1.2"/>' +
            '<path class="lm-ata" d="M' + o(-8.4) + ' 20.4Q' + o(-11.6) + ' 17.6 ' + o(-10.8) + ' 14.6H' + o(10.8) + 'Q' + o(11.6) + ' 17.6 ' + o(8.4) + ' 20.4Z"/>' +
            '<rect class="lm-ata-glass" x="' + o(-11) + '" y="16.2" width="22" height="2.8"/>' +
            '<path class="lm-ata-led" stroke-width="1.1" stroke-dasharray="0.7 0.35 1.2 0.35 0.5 0.6 0.9 0.35" d="M' + o(-10.2) + ' 17.6H' + o(10.2) + '"/>' +
            '<rect class="lm-ata" x="' + o(-11.6) + '" y="13.4" width="23.2" height="1.4" rx="0.6"/>' +
            // the geodesic dome and its spire
            '<path class="lm-ata-dome" d="M' + o(-11) + ' 13.6A11 15.6 0 0 1 ' + o(11) + ' 13.6Z"/>' +
            '<path class="lm-ata-lattice" stroke-width="0.35" d="' + geodesic(cx, 13.6, 11, 15.6) + '"/>' +
            '<rect class="lm-ata" x="' + o(-0.4) + '" y="-5.6" width="0.8" height="4"/>'
        );
    }

    // Kocatepe Mosque, centred on cx (on the dome).
    function kocatepe(cx) {
        var o = function (dx) { return f(cx + dx); };
        var min = function (x, top, cls) {
            return minaret(x, top, 3.8, { cls: cls, capCls: 'lm-koc-dome', balconies: [top + 8, top + 19, top + 30], cap: 'cone', crescent: true });
        };
        var domes = function (x0, x1, y, r) {
            var out = '';
            for (var x = x0; x <= x1; x += r * 2 + 1.4) out += '<path class="lm-koc-dome" d="M' + f(x - r) + ' ' + y + 'a' + r + ' ' + f(r * 0.9) + ' 0 0 1 ' + (r * 2) + ' 0Z"/>';
            return out;
        };
        var turret = function (x) {
            return '<rect class="lm-koc" x="' + f(x - 2.4) + '" y="49" width="4.8" height="15"/>' +
                '<path class="lm-koc-dome" d="M' + f(x - 2.8) + ' 49a2.8 2.8 0 0 1 5.6 0Z"/>' +
                '<rect class="lm-gold" x="' + f(x - 0.3) + '" y="43.4" width="0.6" height="3"/>';
        };
        return (
            // the two minarets behind
            min(cx - 42, 17, 'lm-koc-2') + min(cx + 48, 17, 'lm-koc-2') +
            // the wings along the sides, under their small domes
            '<rect class="lm-koc-2" x="' + o(-56) + '" y="74" width="18" height="17"/>' + domes(cx - 52, cx - 40, 74, 3.2) +
            '<rect class="lm-koc-2" x="' + o(38) + '" y="74" width="28" height="17"/>' + domes(cx + 42, cx + 64, 74, 3.2) +
            arches(cx - 54, 79, 2.6, 7, 4, 1.6) + arches(cx + 41, 79, 2.6, 7, 6, 1.6) +
            // the windowed drum and the great dome, with its finial
            '<rect class="lm-koc" x="' + o(-16) + '" y="52" width="32" height="8"/>' + windows(cx - 14.2, 54, 10, 1, 1.4, 3.6, 1.6, 0) +
            '<path class="lm-koc-dome" d="M' + o(-18.4) + ' 53.4C' + o(-18.4) + ' 42.4 ' + o(-10) + ' 36.4 ' + cx + ' 35.8C' + o(10) + ' 36.4 ' + o(18.4) + ' 42.4 ' + o(18.4) + ' 53.4Z"/>' +
            '<rect class="lm-gold" x="' + o(-0.4) + '" y="29.6" width="0.8" height="6.4"/>' + crescent(cx, 27.4) +
            // corner turrets, the half domes, and the hall of white stone with two rows of windows
            turret(cx - 21) + turret(cx + 21) +
            '<path class="lm-koc-dome" d="M' + o(-37) + ' 64a13.5 8.6 0 0 1 27 0Z"/><path class="lm-koc-dome" d="M' + o(10) + ' 64a13.5 8.6 0 0 1 27 0Z"/>' +
            '<rect class="lm-koc" x="' + o(-40) + '" y="63" width="80" height="28"/>' +
            '<rect class="lm-koc-2" x="' + o(-41) + '" y="62.4" width="82" height="1.4"/>' +
            arches(cx - 35.4, 67, 4, 8, 9, 4.6) + arches(cx - 35.4, 79, 4, 10, 9, 4.6) +
            // the two minarets in front
            min(cx - 51, 13, 'lm-koc') + min(cx + 58, 13, 'lm-koc')
        );
    }

    // The Clock Tower, centred on cx, and its square.
    function clockTower(cx) {
        var o = function (dx) { return f(cx + dx); };
        var dentils = '';
        for (var x = -7; x < 7; x += 1.4) dentils += 'M' + o(x) + ' 30.6h0.7v0.9h-0.7Z';
        return (
            // the stepped plinth, the shaft with its corner pilasters and the tall arched door
            '<rect class="lm-clk-2" x="' + o(-10) + '" y="88.6" width="20" height="2.4"/>' +
            '<rect class="lm-clk-2" x="' + o(-8.6) + '" y="86.2" width="17.2" height="2.6"/>' +
            '<rect class="lm-clk" x="' + o(-7) + '" y="52" width="14" height="34.4"/>' +
            '<rect class="lm-clk-2" x="' + o(-7) + '" y="52" width="1.3" height="34.4"/><rect class="lm-clk-2" x="' + o(5.7) + '" y="52" width="1.3" height="34.4"/>' +
            '<path class="lm-detail" d="M' + o(-3.4) + ' 86.2V71a3.4 3.4 0 0 1 6.8 0V86.2Z"/>' +
            '<path class="lm-clk-2" d="M' + o(-1.9) + ' 86.2V70h0.5V86.2ZM' + o(-0.25) + ' 86.2V68.2h0.5V86.2ZM' + o(1.4) + ' 86.2V70h0.5V86.2ZM' + o(-3.4) + ' 77h6.8v0.5h-6.8Z"/>' +
            '<rect class="lm-clk-2" x="' + o(-8) + '" y="50.6" width="16" height="1.8"/>' +
            // a stage of blind niches, then the open arcade under a balustrade
            '<rect class="lm-clk" x="' + o(-6) + '" y="40.6" width="12" height="10.2"/>' + arches(cx - 4.4, 43.2, 2, 5.6, 3, 1.4) +
            '<rect class="lm-clk-2" x="' + o(-7) + '" y="39.4" width="14" height="1.6"/>' +
            '<rect class="lm-clk" x="' + o(-6.4) + '" y="31.4" width="12.8" height="8.2"/>' + arches(cx - 5, 32.6, 2.6, 7, 3, 1.1) +
            '<rect class="lm-clk-2" x="' + o(-7.4) + '" y="29.4" width="14.8" height="1.4"/>' +
            '<path class="lm-clk-2" d="' + dentils + '"/>' +
            // the clock stage, a face on each side, and the pointed cap
            '<rect class="lm-clk" x="' + o(-5) + '" y="19.4" width="10" height="10.2"/>' +
            '<circle class="lm-white" cx="' + cx + '" cy="24.6" r="3.4"/>' +
            '<path class="lm-slate" d="M' + o(-0.22) + ' 24.6V21.9h0.44V24.6ZM' + cx + ' 24.38L' + o(1.9) + ' 25.3L' + o(1.8) + ' 25.6L' + o(-0.1) + ' 24.8Z"/>' +
            '<rect class="lm-clk-2" x="' + o(-5.8) + '" y="18.6" width="11.6" height="1.2"/>' +
            '<path class="lm-slate" d="M' + o(-5) + ' 18.8L' + cx + ' 9.4L' + o(5) + ' 18.8Z"/>' +
            '<circle class="lm-gold" cx="' + cx + '" cy="8.6" r="0.9"/><rect class="lm-gold" x="' + o(-0.25) + '" y="5.2" width="0.5" height="3"/>'
        );
    }

    // An old Ankara house from x, w wide: a white ground floor, the upper floor jettied out on timber
    // brackets, framed in timber, under a hipped tile roof.
    function ankaraHouse(x, w, eaves) {
        var o = function (dx) { return f(x + dx); };
        var up = eaves + 1.2, floor = up + 13;
        return '<rect class="lm-white" x="' + x + '" y="' + floor + '" width="' + w + '" height="' + (91 - floor) + '"/>' +
            windows(x + 3, floor + 3, Math.floor((w - 4) / 6), 1, 2.4, 4, 3.6, 0) +
            '<path class="lm-timber" d="M' + o(0) + ' ' + (floor + 2) + 'L' + o(-1.6) + ' ' + floor + 'H' + o(w + 1.6) + 'L' + o(w) + ' ' + (floor + 2) + 'Z"/>' +
            '<rect class="lm-white" x="' + o(-1.6) + '" y="' + up + '" width="' + (w + 3.2) + '" height="' + (floor - up) + '"/>' +
            '<path class="lm-timber" d="M' + o(-1.6) + ' ' + up + 'h0.8V' + floor + 'h-0.8ZM' + o(w + 0.8) + ' ' + up + 'h0.8V' + floor + 'h-0.8ZM' +
            o(-1.6) + ' ' + f(floor - 0.8) + 'H' + o(w + 1.6) + 'v0.8H' + o(-1.6) + 'Z"/>' +
            windows(x + 1.4, up + 3, Math.floor((w - 1) / 4.4), 1, 2.4, 6, 2, 0) +
            '<path class="lm-roof" d="M' + o(-3.4) + ' ' + up + 'L' + o(3) + ' ' + (eaves - 5) + 'H' + o(w - 3) + 'L' + o(w + 3.4) + ' ' + up + 'Z"/>';
    }

    L.ankara = svg(
        hills('lm-far', 72, 5, 30) +
        blocks('lm-far', 82, 17) +
        ydaCenter(-58) +
        atakule(64) +
        '<path class="lm-trees" d="M6 91Q8 86.6 13 87.2Q17 84.4 22 86.8Q27 85 31 87.4Q35 86.4 38 91ZM92 91Q94 86 100 86.6Q105 83.6 111 86.2Q117 84 122 86.6Q128 85.2 134 91Z"/>' +
        kocatepe(190) +
        // the café parasol, the Clock Tower and the houses on its square
        '<rect class="lm-slate" x="275.7" y="80" width="0.6" height="11"/><path class="lm-red" d="M268.4 81.6Q276 76.4 283.6 81.6Z"/>' +
        clockTower(296) +
        ankaraHouse(316, 22, 64) + ankaraHouse(346, 26, 60) +
        // the ground last: the minarets run down into it
        ground('lm-stone-2', 91)
    , 'YDA Center, Atakule, Kocatepe Mosque and the Clock Tower');

    // ---------------------------------------------------------------- Cairo
    // West to east, as on the map: the Great Pyramid of Giza at the desert's edge, its smaller neighbour
    // behind; the Nile with a felucca, and the Cairo Tower rising from the palms of Gezira, its shaft a
    // lattice of lotus stems opening into petals under the observation decks and the mast (lit gold by
    // night); Al-Azhar Mosque behind its crenellated wall and gate, with al-Ghuri's double-headed minaret
    // and its tiled stage, a slender minaret, the ribbed dome and Qaytbay's banded minaret (floodlit
    // white by night); and the Baron Empain Palace in Heliopolis, its tiered Hindu tower beside two
    // storeys of colonnades on a terrace, between cypresses (floodlit amber by night).

    // A pyramid centred on cx, its flat top (the Great Pyramid lost its capstone) at `top`: the face to
    // the west in the sun, the east one in shade, meeting on a ridge that comes down at cx + ridge, and
    // its courses of stone.
    function pyramid(cx, top, half, ridge, flat) {
        var o = function (dx) { return f(cx + dx); };
        var courses = '';
        for (var y = top + 2.6; y < 90; y += 2.6) {
            var w = flat + (half - flat) * (y - top) / (91 - top);
            courses += 'M' + o(-w) + ' ' + f(y) + 'H' + o(w);
        }
        return '<path class="lm-pyr" d="M' + o(-half) + ' 91L' + o(-flat) + ' ' + top + 'H' + o(flat) + 'L' + o(ridge) + ' 91Z"/>' +
            '<path class="lm-pyr-2" d="M' + o(ridge) + ' 91L' + o(flat) + ' ' + top + 'L' + o(half) + ' 91Z"/>' +
            '<path class="lm-pyr-line" stroke-width="0.35" d="' + courses + '"/>';
    }

    // A felucca under its lateen sail, sailing on the water at x.
    function felucca(x) {
        var o = function (dx) { return f(x + dx); };
        return '<path class="lm-white" d="M' + o(-9) + ' 86Q' + o(1) + ' 76 ' + o(11) + ' 61.6Q' + o(9.6) + ' 76 ' + o(8) + ' 87Z"/>' +
            '<path class="lm-timber" d="M' + o(-9.6) + ' 86.6L' + o(11.6) + ' 60.8L' + o(12) + ' 61.2L' + o(-9) + ' 87Z"/>' +
            '<rect class="lm-timber" x="' + o(0.6) + '" y="68" width="0.6" height="20"/>' +
            '<path class="lm-timber" d="M' + o(-10) + ' 87.6H' + o(11) + 'Q' + o(8) + ' 91 ' + o(0) + ' 91Q' + o(-7) + ' 91 ' + o(-10) + ' 87.6Z"/>';
    }

    // The Cairo Tower, centred on cx.
    function cairoTower(cx) {
        var o = function (dx) { return f(cx + dx); };
        // the lattice: diamond openings in rows round the shaft, narrowing towards its sides
        var holes = '';
        for (var k = 0, y = 78.4; y > 28; k++, y -= 1.6) {
            var r = 4.3 + 0.5 * (80 - y) / 54;
            (k % 2 ? [-72, -36, 0, 36, 72] : [-54, -18, 18, 54]).forEach(function (deg) {
                var a = deg * Math.PI / 180, hw = 0.82 * Math.cos(a);
                if (hw < 0.3) return;
                var x = cx + r * Math.sin(a);
                holes += 'M' + f(x - hw) + ' ' + f(y) + 'L' + f(x) + ' ' + f(y - 1.05) + 'L' + f(x + hw) + ' ' + f(y) + 'L' + f(x) + ' ' + f(y + 1.05) + 'Z';
            });
        }
        // the lotus petals the lattice opens into at the top
        var petals = 'M' + o(-4.8) + ' 26.4';
        [[-7.2, 22], [-5, 24.4], [-3.6, 21.4], [-1.8, 24], [0, 21.2], [1.8, 24], [3.6, 21.4], [5, 24.4], [7.2, 22]].forEach(function (p) {
            petals += 'L' + o(p[0]) + ' ' + p[1];
        });
        petals += 'L' + o(4.8) + ' 26.4Z';
        var mullions = '';
        for (var x = -4.4; x < 4.6; x += 1.6) mullions += '<rect class="lm-ctw" x="' + o(x) + '" y="14" width="0.4" height="7.6"/>';
        return (
            // the pavilion at its foot
            '<rect class="lm-ctw-2" x="' + o(-13) + '" y="80" width="26" height="11"/>' +
            '<rect class="lm-ctw" x="' + o(-13) + '" y="80" width="17" height="11"/>' +
            '<rect class="lm-ctw-glass" x="' + o(-12) + '" y="82.6" width="24" height="2.6"/>' +
            '<rect class="lm-ctw" x="' + o(-14) + '" y="78.8" width="28" height="1.8" rx="0.6"/>' +
            // the shaft, shaded on its east side, and its lattice
            '<path class="lm-ctw" d="M' + o(-4.3) + ' 79L' + o(-4.8) + ' 26H' + o(4.8) + 'L' + o(4.3) + ' 79Z"/>' +
            '<path class="lm-ctw-2" d="M' + o(1.7) + ' 79L' + o(1.9) + ' 26H' + o(4.8) + 'L' + o(4.3) + ' 79Z"/>' +
            '<path class="lm-ctw-hole" d="' + holes + '"/>' +
            // the observation decks: two glazed storeys under a cornice, the upper drum and the dome
            '<rect class="lm-ctw" x="' + o(-5) + '" y="13" width="10" height="10"/>' +
            '<rect class="lm-ctw-glass" x="' + o(-5) + '" y="14.4" width="10" height="2.8"/>' +
            '<rect class="lm-ctw-glass" x="' + o(-5) + '" y="18.6" width="10" height="2.8"/>' + mullions +
            '<rect class="lm-ctw-2" x="' + o(2.4) + '" y="13" width="2.6" height="10" opacity="0.6"/>' +
            '<rect class="lm-ctw" x="' + o(-5.8) + '" y="12" width="11.6" height="1.4" rx="0.5"/>' +
            '<rect class="lm-ctw" x="' + o(-3.8) + '" y="8.6" width="7.6" height="3.6"/>' +
            '<rect class="lm-ctw-glass" x="' + o(-3.8) + '" y="9.6" width="7.6" height="1.4"/>' +
            '<path class="lm-ctw" d="M' + o(-3.8) + ' 8.8Q' + o(-3.6) + ' 5.2 ' + cx + ' 4.8Q' + o(3.6) + ' 5.2 ' + o(3.8) + ' 8.8Z"/>' +
            '<path class="lm-ctw" d="' + petals + '"/>' +
            // the mast, its ring and its red light
            '<rect class="lm-slate" x="' + o(-0.4) + '" y="-4" width="0.8" height="9.2"/>' +
            '<rect class="lm-slate" x="' + o(-1.1) + '" y="0.6" width="2.2" height="0.8" rx="0.3"/>' +
            '<circle class="lm-red" cx="' + cx + '" cy="-4.4" r="0.8"/>'
        );
    }

    // A minaret of Al-Azhar from its stages, bottom up: [half width, top, balcony?, class] each; the cap
    // stands on the last. `heads` are the x offsets of its heads (al-Ghuri's has two).
    function azharMinaret(x, stages, heads) {
        var o = function (dx) { return f(x + dx); };
        var out = '', bottom = 91;
        stages.forEach(function (s) {
            out += '<rect class="' + (s[3] || 'lm-azh') + '" x="' + o(-s[0]) + '" y="' + s[1] + '" width="' + f(s[0] * 2) + '" height="' + f(bottom - s[1]) + '"/>';
            if (s[2]) out += '<rect class="lm-azh" x="' + o(-s[0] - 1.3) + '" y="' + f(s[1] - 0.4) + '" width="' + f(s[0] * 2 + 2.6) + '" height="1.8" rx="0.5"/>';
            bottom = s[1];
        });
        (heads || [0]).forEach(function (h) {
            var hx = x + h, w = heads ? 1.2 : stages[stages.length - 1][0];
            out += '<path class="lm-azh-dome" d="M' + f(hx - w) + ' ' + bottom + 'C' + f(hx - w - 0.6) + ' ' + f(bottom - 2.4) + ' ' + f(hx - 0.4) + ' ' + f(bottom - 3.2) + ' ' + f(hx) + ' ' + f(bottom - 4.4) +
                'C' + f(hx + 0.4) + ' ' + f(bottom - 3.2) + ' ' + f(hx + w + 0.6) + ' ' + f(bottom - 2.4) + ' ' + f(hx + w) + ' ' + bottom + 'Z"/>' +
                '<rect class="lm-gold" x="' + f(hx - 0.25) + '" y="' + f(bottom - 7.4) + '" width="0.5" height="3.2"/>' + crescent(hx, bottom - 9.4);
        });
        return out;
    }

    // Al-Azhar Mosque, from x0 (the west end of its wall) to x0 + 100.
    function alAzhar(x0) {
        var o = function (dx) { return f(x0 + dx); };
        var ribs = '';
        for (var k = -4; k <= 4; k++) ribs += 'M' + o(69 + k * 2.6) + ' 53Q' + o(69 + k * 1.5) + ' 42 ' + o(69) + ' 38.6';
        var bands = '';
        for (var y = 50; y < 70; y += 3.2) bands += '<rect class="lm-azh-red" x="' + o(83.4) + '" y="' + y + '" width="7.2" height="1.4"/>';
        return (
            // al-Ghuri's minaret, its tiled middle stage and its two heads
            azharMinaret(x0 + 10, [[4, 34, true], [3.2, 20, true, 'lm-azh-tile'], [2.6, 15]], [-1.4, 1.4]) +
            '<rect class="lm-azh" x="' + o(7.6) + '" y="20" width="0.8" height="14"/><rect class="lm-azh" x="' + o(11.6) + '" y="20" width="0.8" height="14"/>' +
            // the slender minaret
            azharMinaret(x0 + 52, [[2.4, 32, true], [1.9, 23, true], [1.5, 18]]) +
            // the ribbed dome on its windowed drum
            '<rect class="lm-azh" x="' + o(58) + '" y="52.4" width="22" height="18"/>' + arches(x0 + 60.6, 56, 2.4, 6, 6, 1.1) +
            '<path class="lm-azh-dome" d="M' + o(57.4) + ' 53.4C' + o(57.4) + ' 43.6 ' + o(62.8) + ' 39 ' + o(69) + ' 37.8C' + o(75.2) + ' 39 ' + o(80.6) + ' 43.6 ' + o(80.6) + ' 53.4Z"/>' +
            '<path class="lm-line" stroke-width="0.45" d="' + ribs + '"/>' +
            '<rect class="lm-gold" x="' + o(68.7) + '" y="33" width="0.6" height="5"/>' + crescent(x0 + 69, 31) +
            // Qaytbay's minaret: banded red and stone, a carved stage, an open pavilion
            azharMinaret(x0 + 87, [[3.6, 36, true], [2.8, 25, true, 'lm-azh-2'], [2.2, 17]]) + bands +
            arches(x0 + 85.2, 18.4, 1.4, 4.4, 2, 0.8) + arches(x0 + 85.6, 27, 1.2, 4.4, 2, 1) +
            // the wall, its cresting and its windows
            '<rect class="lm-azh" x="' + o(0) + '" y="70" width="100" height="21"/>' +
            merlons(x0, x0 + 100, 70, 2.6, 1.2, 'lm-azh') +
            arches(x0 + 4, 77, 3.2, 6, 3, 1.8) + arches(x0 + 42, 77, 3.2, 6, 11, 1.8) +
            '<rect class="lm-azh-2" x="' + o(0) + '" y="70" width="100" height="1"/>' +
            // the gate: a projecting block with its own cresting, a keel-arched recess and the door
            '<rect class="lm-azh" x="' + o(20) + '" y="63" width="18" height="28"/>' +
            merlons(x0 + 20, x0 + 38, 63, 2.6, 0.9, 'lm-azh') +
            '<path class="lm-azh-2" d="M' + o(23) + ' 91V71Q' + o(23.4) + ' 67 ' + o(29) + ' 65Q' + o(34.6) + ' 67 ' + o(35) + ' 71V91Z"/>' +
            '<path class="lm-detail" d="M' + o(26.2) + ' 91V80Q' + o(26.4) + ' 77.4 ' + o(29) + ' 76.4Q' + o(31.6) + ' 77.4 ' + o(31.8) + ' 80V91Z"/>' +
            '<rect class="lm-azh-2" x="' + o(19.4) + '" y="63" width="19.2" height="1"/>'
        );
    }

    // The Baron Empain Palace, from x0 (its tower's west face) to x0 + 84.
    function baronPalace(x0) {
        var o = function (dx) { return f(x0 + dx); };
        var tiers = '', ribs = '';
        // the tower's spire: tiers narrowing up a curved profile to the ribbed disc and the finial
        var edge = function (y) { return 11 * Math.pow((y - 10) / 30, 0.62); };
        for (var y = 14; y < 40; y += 3.4) tiers += '<rect class="lm-brn-2" x="' + o(11 - edge(y) - 0.4) + '" y="' + f(y) + '" width="' + f(edge(y) * 2 + 0.8) + '" height="1"/>';
        var spire = 'M' + o(0) + ' 40';
        for (var t = 40; t >= 10; t -= 2) spire += 'L' + o(11 - edge(t)) + ' ' + t;
        for (t = 10; t <= 40; t += 2) spire += 'L' + o(11 + edge(t)) + ' ' + t;
        [-0.6, -0.3, 0, 0.3, 0.6].forEach(function (k) {
            for (var y = 39.6; y >= 12; y -= 2.3) ribs += (y === 39.6 ? 'M' : 'L') + o(11 + k * edge(y)) + ' ' + f(y);
        });
        return (
            // the tower: a block of balconies and windows under the spire
            '<rect class="lm-brn" x="' + o(0) + '" y="40" width="22" height="46"/>' +
            '<rect class="lm-brn-2" x="' + o(16) + '" y="40" width="6" height="46"/>' +
            windows(x0 + 3, 44, 3, 6, 2.6, 3.6, 3.2, 3.4) +
            '<rect class="lm-brn-3" x="' + o(-1) + '" y="52.4" width="24" height="1.2"/><rect class="lm-brn-3" x="' + o(-1) + '" y="66" width="24" height="1.2"/>' +
            '<path class="lm-brn" d="' + spire + 'Z"/>' + tiers +
            '<path class="lm-line" stroke-width="0.4" d="' + ribs + '"/>' +
            '<ellipse class="lm-brn-2" cx="' + o(11) + '" cy="10.4" rx="3.2" ry="1.3"/>' +
            '<path class="lm-brn" d="M' + o(9.6) + ' 9.4Q' + o(11) + ' 5.4 ' + o(12.4) + ' 9.4Z"/><rect class="lm-brn" x="' + o(10.7) + '" y="1.8" width="0.6" height="5"/>' +
            // the main block: two storeys of colonnades between cornices, shaded on the east
            '<rect class="lm-brn" x="' + o(22) + '" y="57" width="58" height="29"/>' +
            '<rect class="lm-brn-2" x="' + o(74) + '" y="57" width="6" height="29"/>' +
            arches(x0 + 24.6, 74, 3.4, 11, 9, 2.4) + arches(x0 + 25.4, 60.6, 2.6, 8.4, 11, 2.4) +
            '<rect class="lm-brn-3" x="' + o(21) + '" y="71" width="60" height="1.6"/>' +
            '<rect class="lm-brn-3" x="' + o(21) + '" y="56" width="60" height="1.6"/>' +
            // the dome over the middle and the open pavilion on the east, with its domed kiosks
            '<rect class="lm-brn" x="' + o(43) + '" y="50" width="12" height="6.4"/>' + windows(x0 + 44.6, 51.4, 4, 1, 1.4, 3.4, 1.4, 0) +
            '<path class="lm-brn" d="M' + o(42.6) + ' 50.4C' + o(42.6) + ' 44.4 ' + o(46) + ' 41.6 ' + o(49) + ' 41.2C' + o(52) + ' 41.6 ' + o(55.4) + ' 44.4 ' + o(55.4) + ' 50.4Z"/>' +
            '<rect class="lm-brn" x="' + o(48.7) + '" y="36" width="0.6" height="5.4"/>' +
            '<rect class="lm-brn" x="' + o(64) + '" y="45" width="15" height="11.6"/>' + arches(x0 + 65.6, 47, 2.4, 9.6, 4, 1.1) +
            '<rect class="lm-brn-3" x="' + o(63.4) + '" y="44.4" width="16.2" height="1.2"/>' +
            '<path class="lm-brn" d="M' + o(63.4) + ' 44.6Q' + o(65.6) + ' 39.6 ' + o(67.8) + ' 44.6ZM' + o(75.2) + ' 44.6Q' + o(77.4) + ' 39.6 ' + o(79.6) + ' 44.6Z"/>' +
            '<rect class="lm-brn" x="' + o(65.3) + '" y="37.4" width="0.6" height="3.4"/><rect class="lm-brn" x="' + o(77.1) + '" y="37.4" width="0.6" height="3.4"/>' +
            // the terrace, its balustrade and the stair
            '<rect class="lm-brn-2" x="' + o(-6) + '" y="85.6" width="96" height="5.4"/>' +
            '<rect class="lm-brn-3" x="' + o(-6) + '" y="84.8" width="96" height="1"/>' +
            '<path class="lm-brn-3" d="M' + o(42) + ' 91V86.4H' + o(56) + 'V91ZM' + o(43.6) + ' 87.6H' + o(54.4) + 'M' + o(43) + ' 89.2H' + o(55) + '"/>' +
            '<path class="lm-brn-2" d="M' + o(43.6) + ' 87.4H' + o(54.4) + 'V88H' + o(43.6) + 'ZM' + o(43) + ' 89H' + o(55) + 'V89.6H' + o(43) + 'Z"/>'
        );
    }

    // A cypress, a tall narrow flame of green.
    function cypress(x, top, w) {
        return '<path class="lm-trees" d="M' + f(x) + ' ' + top + 'C' + f(x + w * 0.7) + ' ' + f(top + 8) + ' ' + f(x + w) + ' ' + f(top + 20) + ' ' + f(x + w * 0.5) + ' 91H' + f(x - w * 0.5) +
            'C' + f(x - w) + ' ' + f(top + 20) + ' ' + f(x - w * 0.7) + ' ' + f(top + 8) + ' ' + f(x) + ' ' + top + 'Z"/>';
    }

    L.cairo = svg(
        // the Muqattam hills behind the city
        hills('lm-far', 74, 4, 70) +
        // Giza: the smaller pyramid behind, the Great Pyramid, the desert at their feet
        pyramid(-80, 50, 34, 8, 0.6) +
        pyramid(-18, 30, 54, 10, 1.2) +
        '<path class="lm-sand" d="M' + X0 + ' 96V88Q-120 85.6 -60 88.4Q-20 90.2 26 88.8V96Z"/>' +
        ground('lm-stone-2', 91) +
        // Al-Azhar and the Baron Palace, between its cypresses
        alAzhar(184) +
        cypress(290, 58, 3.6) + cypress(297, 64, 3.2) +
        baronPalace(302) +
        cypress(392, 62, 3.4) +
        // the Cairo Tower among the palms and trees of Gezira
        palm(80, 64, -2) + palm(90, 70, 1.4) +
        cairoTower(108) +
        '<path class="lm-trees" d="M78 91Q80 84.4 87 85.6Q91 82.4 97 84.8Q101 82.2 106 84.8Q111 82 117 84.6Q122 82.6 128 85.4Q134 83.6 140 86.2Q146 85 150 91Z"/>' +
        palm(126, 66, 1.6) + palm(138, 60, 2.4) + palm(150, 70, -1.2) +
        // the Nile, the tower's light on it by night, and a felucca
        water(88, 26, 176) +
        glow('lm-glow-w', 108, 10) +
        felucca(48)
    , 'The Great Pyramid of Giza, a felucca on the Nile, the Cairo Tower, Al-Azhar Mosque and the Baron Empain Palace in Heliopolis');

    // ---------------------------------------------------------------- countries
    // The switcher's first step: each country of more than one city drawn from the best landmark of each of
    // its cities, smaller, on one ground (the Android app's country drawings). A country of one city
    // (Bahrain, Egypt) shows that city's own drawing.
    var C = {};

    // A landmark drawn round x = 0 and standing on `from`, moved to x on the ground (y 91) and scaled by k.
    function stand(x, from, k, body) {
        return '<g transform="translate(' + x + ' 91) scale(' + k + ') translate(0 ' + (-from) + ')">' + body + '</g>';
    }

    // Syria: the Damascene Sword, the Umayyad Mosque, and the norias of Hama on the Orontes before their aqueduct.
    C.SY = svg(
        hills('lm-far', 58, 8, 40) +
        stand(11, 91, 0.93, damasceneSword(0)) +
        stand(124, 90, 0.93, '<rect class="lm-stone" x="-36.5" y="20" width="5" height="76"/><rect class="lm-stone" x="-37.9" y="30" width="7.8" height="2" rx="0.6"/><rect class="lm-stone" x="-37.9" y="42" width="7.8" height="2" rx="0.6"/><path class="lm-slate" d="M-36.5 20L-34 4L-31.5 20Z"/><path class="lm-gold" d="M-35.6 1.6a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="-34.35" y="2.2" width="0.7" height="2.2"/><rect class="lm-stone" x="42" y="24" width="12" height="40"/><rect class="lm-stone" x="40.6" y="30" width="14.8" height="2"/><rect class="lm-stone" x="44" y="14" width="8" height="10"/><rect class="lm-stone" x="42.6" y="22" width="10.8" height="2"/><path class="lm-slate" d="M44 14L48 -3L52 14Z"/><path class="lm-gold" d="M46.4 -5.4a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="47.65" y="-4.800000000000001" width="0.7" height="2.2"/><rect class="lm-detail" x="44.6" y="16" width="1.4" height="4"/><rect class="lm-detail" x="47.4" y="16" width="1.4" height="4"/><rect class="lm-detail" x="50.2" y="16" width="1.4" height="4"/><rect class="lm-stone" x="-16" y="36" width="32" height="20"/><rect class="lm-stone" x="-12" y="24" width="24" height="14"/><rect class="lm-detail" x="-9.4" y="27" width="2" height="6"/><rect class="lm-detail" x="-4.8" y="27" width="2" height="6"/><rect class="lm-detail" x="-0.2" y="27" width="2" height="6"/><rect class="lm-detail" x="4.4" y="27" width="2" height="6"/><rect class="lm-detail" x="9" y="27" width="2" height="6"/><path class="lm-slate" d="M-15 26C-15 12 -7 5 0 3.5C7 5 15 12 15 26Z"/><rect class="lm-gold" x="-0.6" y="-3" width="1.2" height="7"/><path class="lm-gold" d="M-1.6 -5.2a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="-0.35" y="-4.6000000000000005" width="0.7" height="2.2"/><rect class="lm-stone" x="-56" y="62" width="114" height="28"/><path class="lm-detail" d="M-50 77V70a2 2 0 0 1 4 0V77Z"/><path class="lm-detail" d="M-41 77V70a2 2 0 0 1 4 0V77Z"/><path class="lm-detail" d="M-32 77V70a2 2 0 0 1 4 0V77Z"/><path class="lm-detail" d="M22 77V70a2 2 0 0 1 4 0V77Z"/><path class="lm-detail" d="M31 77V70a2 2 0 0 1 4 0V77Z"/><path class="lm-detail" d="M40 77V70a2 2 0 0 1 4 0V77Z"/><path class="lm-detail" d="M49 77V70a2 2 0 0 1 4 0V77Z"/><path class="lm-slate" d="M-60 63.5L-48 52H48L60 63.5Z"/><path class="lm-line" d="M-44 56H44M-52 60H52"/><path class="lm-stone" d="M-18 90V51L0 39L18 51V90Z"/><path class="lm-slate" d="M-21 52L0 37L21 52L18.6 53.4L0 40.6L-18.6 53.4Z"/><path class="lm-green" d="M-13 56H13V60H-13Z" opacity="0.85"/><path class="lm-gold" d="M-13 60H13V61H-13Z"/><path class="lm-detail" d="M-6 90V70a6 6 0 0 1 12 0V90Z"/><path class="lm-detail" d="M-13.6 80V72.3a2.3 2.3 0 0 1 4.6 0V80Z"/><path class="lm-detail" d="M9 80V72.3a2.3 2.3 0 0 1 4.6 0V80Z"/>') +
        stand(246, 96, 0.93, '<path class="lm-stone" fill-rule="evenodd" d="M0 64H200V96H0ZM6 96V80a8 8 0 0 1 16 0V96ZM30 96V80a8 8 0 0 1 16 0V96ZM54 96V80a8 8 0 0 1 16 0V96ZM78 96V80a8 8 0 0 1 16 0V96ZM102 96V80a8 8 0 0 1 16 0V96ZM126 96V80a8 8 0 0 1 16 0V96ZM150 96V80a8 8 0 0 1 16 0V96ZM174 96V80a8 8 0 0 1 16 0V96Z"/><rect class="lm-stone-2" x="0" y="60.5" width="200" height="4.5"/>') +
        water(86, 200, 591) +
        stand(246, 96, 0.93, '<g class="lm-wood"><circle cx="0" cy="54" r="34"/><circle cx="0" cy="54" r="30"/><line x1="0" y1="54" x2="34" y2="54"/><line x1="0" y1="54" x2="29.4" y2="71"/><line x1="0" y1="54" x2="17" y2="83.4"/><line x1="0" y1="54" x2="0" y2="88"/><line x1="0" y1="54" x2="-17" y2="83.4"/><line x1="0" y1="54" x2="-29.4" y2="71"/><line x1="0" y1="54" x2="-34" y2="54"/><line x1="0" y1="54" x2="-29.4" y2="37"/><line x1="0" y1="54" x2="-17" y2="24.6"/><line x1="0" y1="54" x2="0" y2="20"/><line x1="0" y1="54" x2="17" y2="24.6"/><line x1="0" y1="54" x2="29.4" y2="37"/><line x1="34" y1="54" x2="36.6" y2="54"/><line x1="33.5" y1="59.9" x2="36" y2="60.4"/><line x1="31.9" y1="65.6" x2="34.4" y2="66.5"/><line x1="29.4" y1="71" x2="31.7" y2="72.3"/><line x1="26" y1="75.9" x2="28" y2="77.5"/><line x1="21.9" y1="80" x2="23.5" y2="82"/><line x1="17" y1="83.4" x2="18.3" y2="85.7"/><line x1="11.6" y1="85.9" x2="12.5" y2="88.4"/><line x1="5.9" y1="87.5" x2="6.4" y2="90"/><line x1="0" y1="88" x2="0" y2="90.6"/><line x1="-5.9" y1="87.5" x2="-6.4" y2="90"/><line x1="-11.6" y1="85.9" x2="-12.5" y2="88.4"/><line x1="-17" y1="83.4" x2="-18.3" y2="85.7"/><line x1="-21.9" y1="80" x2="-23.5" y2="82"/><line x1="-26" y1="75.9" x2="-28" y2="77.5"/><line x1="-29.4" y1="71" x2="-31.7" y2="72.3"/><line x1="-31.9" y1="65.6" x2="-34.4" y2="66.5"/><line x1="-33.5" y1="59.9" x2="-36" y2="60.4"/><line x1="-34" y1="54" x2="-36.6" y2="54"/><line x1="-33.5" y1="48.1" x2="-36" y2="47.6"/><line x1="-31.9" y1="42.4" x2="-34.4" y2="41.5"/><line x1="-29.4" y1="37" x2="-31.7" y2="35.7"/><line x1="-26" y1="32.1" x2="-28" y2="30.5"/><line x1="-21.9" y1="28" x2="-23.5" y2="26"/><line x1="-17" y1="24.6" x2="-18.3" y2="22.3"/><line x1="-11.6" y1="22.1" x2="-12.5" y2="19.6"/><line x1="-5.9" y1="20.5" x2="-6.4" y2="18"/><line x1="0" y1="20" x2="0" y2="17.4"/><line x1="5.9" y1="20.5" x2="6.4" y2="18"/><line x1="11.6" y1="22.1" x2="12.5" y2="19.6"/><line x1="17" y1="24.6" x2="18.3" y2="22.3"/><line x1="21.9" y1="28" x2="23.5" y2="26"/><line x1="26" y1="32.1" x2="28" y2="30.5"/><line x1="29.4" y1="37" x2="31.7" y2="35.7"/><line x1="31.9" y1="42.4" x2="34.4" y2="41.5"/><line x1="33.5" y1="48.1" x2="36" y2="47.6"/><circle cx="0" cy="54" r="2.4"/></g><rect class="lm-stone" x="-5.4" y="52" width="10.9" height="44"/>') +
        stand(308, 96, 0.93, '<g class="lm-wood"><circle cx="0" cy="68" r="21"/><circle cx="0" cy="68" r="17"/><line x1="0" y1="68" x2="21" y2="68"/><line x1="0" y1="68" x2="18.2" y2="78.5"/><line x1="0" y1="68" x2="10.5" y2="86.2"/><line x1="0" y1="68" x2="0" y2="89"/><line x1="0" y1="68" x2="-10.5" y2="86.2"/><line x1="0" y1="68" x2="-18.2" y2="78.5"/><line x1="0" y1="68" x2="-21" y2="68"/><line x1="0" y1="68" x2="-18.2" y2="57.5"/><line x1="0" y1="68" x2="-10.5" y2="49.8"/><line x1="0" y1="68" x2="0" y2="47"/><line x1="0" y1="68" x2="10.5" y2="49.8"/><line x1="0" y1="68" x2="18.2" y2="57.5"/><line x1="21" y1="68" x2="23.6" y2="68"/><line x1="20.7" y1="71.6" x2="23.2" y2="72.1"/><line x1="19.7" y1="75.2" x2="22.2" y2="76.1"/><line x1="18.2" y1="78.5" x2="20.4" y2="79.8"/><line x1="16.1" y1="81.5" x2="18.1" y2="83.2"/><line x1="13.5" y1="84.1" x2="15.2" y2="86.1"/><line x1="10.5" y1="86.2" x2="11.8" y2="88.4"/><line x1="7.2" y1="87.7" x2="8.1" y2="90.2"/><line x1="3.6" y1="88.7" x2="4.1" y2="91.2"/><line x1="0" y1="89" x2="0" y2="91.6"/><line x1="-3.6" y1="88.7" x2="-4.1" y2="91.2"/><line x1="-7.2" y1="87.7" x2="-8.1" y2="90.2"/><line x1="-10.5" y1="86.2" x2="-11.8" y2="88.4"/><line x1="-13.5" y1="84.1" x2="-15.2" y2="86.1"/><line x1="-16.1" y1="81.5" x2="-18.1" y2="83.2"/><line x1="-18.2" y1="78.5" x2="-20.4" y2="79.8"/><line x1="-19.7" y1="75.2" x2="-22.2" y2="76.1"/><line x1="-20.7" y1="71.6" x2="-23.2" y2="72.1"/><line x1="-21" y1="68" x2="-23.6" y2="68"/><line x1="-20.7" y1="64.4" x2="-23.2" y2="63.9"/><line x1="-19.7" y1="60.8" x2="-22.2" y2="59.9"/><line x1="-18.2" y1="57.5" x2="-20.4" y2="56.2"/><line x1="-16.1" y1="54.5" x2="-18.1" y2="52.8"/><line x1="-13.5" y1="51.9" x2="-15.2" y2="49.9"/><line x1="-10.5" y1="49.8" x2="-11.8" y2="47.6"/><line x1="-7.2" y1="48.3" x2="-8.1" y2="45.8"/><line x1="-3.6" y1="47.3" x2="-4.1" y2="44.8"/><line x1="0" y1="47" x2="0" y2="44.4"/><line x1="3.6" y1="47.3" x2="4.1" y2="44.8"/><line x1="7.2" y1="48.3" x2="8.1" y2="45.8"/><line x1="10.5" y1="49.8" x2="11.8" y2="47.6"/><line x1="13.5" y1="51.9" x2="15.2" y2="49.9"/><line x1="16.1" y1="54.5" x2="18.1" y2="52.8"/><line x1="18.2" y1="57.5" x2="20.4" y2="56.2"/><line x1="19.7" y1="60.8" x2="22.2" y2="59.9"/><line x1="20.7" y1="64.4" x2="23.2" y2="63.9"/><circle cx="0" cy="68" r="2.4"/></g><rect class="lm-stone" x="-3.4" y="66" width="6.7" height="30"/>') +
        '<rect class="lm-stone-2" x="-300" y="91" width="500" height="5"/>'
    , 'The Damascene Sword, the Umayyad Mosque and the norias of Hama');

    // Saudi Arabia: the Abraj Al-Bait Clock Tower (Makkah), Masjid an-Nabawi (Medina), the Kingdom Centre (Riyadh)
    // and the Khobar Water Tower (Eastern Province).
    C.SA = svg(
        '<path class="lm-far" d="M-300 96V76L-300 72.1L-280 72.8L-260 75.1L-240 77.9L-220 79.9L-200 80.2L-180 79L-160 77.4L-140 76.5L-120 76.6L-100 77.2L-80 77.3L-60 76.1L-40 74L-20 71.8L0 71L20 72L40 74.4L60 76.8L80 78.1L100 78.1L120 77.3L140 76.8L160 77.4L180 78.7L200 79.8L220 80.9L240 83.3L250 86V96Z"/>' +
        ground('lm-stone-2', 91) +
        water(86, 250, 611) +
        stand(23, 96, 0.86, '<rect class="lm-stone-2" x="-48" y="72" width="96" height="24"/><rect class="lm-stone-2" x="-44" y="46" width="18" height="50"/><path class="lm-stone-2" d="M-44 46L-35 38L-26 46Z"/><rect class="lm-stone-2" x="26" y="46" width="18" height="50"/><path class="lm-stone-2" d="M26 46L35 38L44 46Z"/><rect class="lm-detail" x="-41" y="50" width="2.6" height="2"/><rect class="lm-detail" x="-35" y="50" width="2.6" height="2"/><rect class="lm-detail" x="-29" y="50" width="2.6" height="2"/><rect class="lm-detail" x="-41" y="55.2" width="2.6" height="2"/><rect class="lm-detail" x="-35" y="55.2" width="2.6" height="2"/><rect class="lm-detail" x="-29" y="55.2" width="2.6" height="2"/><rect class="lm-detail" x="-41" y="60.4" width="2.6" height="2"/><rect class="lm-detail" x="-35" y="60.4" width="2.6" height="2"/><rect class="lm-detail" x="-29" y="60.4" width="2.6" height="2"/><rect class="lm-detail" x="-41" y="65.6" width="2.6" height="2"/><rect class="lm-detail" x="-35" y="65.6" width="2.6" height="2"/><rect class="lm-detail" x="-29" y="65.6" width="2.6" height="2"/><rect class="lm-detail" x="-41" y="70.8" width="2.6" height="2"/><rect class="lm-detail" x="-35" y="70.8" width="2.6" height="2"/><rect class="lm-detail" x="-29" y="70.8" width="2.6" height="2"/><rect class="lm-detail" x="-41" y="76" width="2.6" height="2"/><rect class="lm-detail" x="-35" y="76" width="2.6" height="2"/><rect class="lm-detail" x="-29" y="76" width="2.6" height="2"/><rect class="lm-detail" x="29" y="50" width="2.6" height="2"/><rect class="lm-detail" x="35" y="50" width="2.6" height="2"/><rect class="lm-detail" x="41" y="50" width="2.6" height="2"/><rect class="lm-detail" x="29" y="55.2" width="2.6" height="2"/><rect class="lm-detail" x="35" y="55.2" width="2.6" height="2"/><rect class="lm-detail" x="41" y="55.2" width="2.6" height="2"/><rect class="lm-detail" x="29" y="60.4" width="2.6" height="2"/><rect class="lm-detail" x="35" y="60.4" width="2.6" height="2"/><rect class="lm-detail" x="41" y="60.4" width="2.6" height="2"/><rect class="lm-detail" x="29" y="65.6" width="2.6" height="2"/><rect class="lm-detail" x="35" y="65.6" width="2.6" height="2"/><rect class="lm-detail" x="41" y="65.6" width="2.6" height="2"/><rect class="lm-detail" x="29" y="70.8" width="2.6" height="2"/><rect class="lm-detail" x="35" y="70.8" width="2.6" height="2"/><rect class="lm-detail" x="41" y="70.8" width="2.6" height="2"/><rect class="lm-detail" x="29" y="76" width="2.6" height="2"/><rect class="lm-detail" x="35" y="76" width="2.6" height="2"/><rect class="lm-detail" x="41" y="76" width="2.6" height="2"/><rect class="lm-stone" x="-18" y="36" width="36" height="60"/><rect class="lm-stone" x="-15" y="14" width="30" height="22"/><circle class="lm-glass" cx="0" cy="25" r="9"/><circle class="lm-detail" cx="0" cy="25" r="7.4"/><path class="lm-line" d="M0 25V19.5M0 25L4 27"/><path class="lm-green" d="M-11 14H11V11H-11Z"/><path class="lm-stone" d="M-12 11L-7 4H7L12 11Z"/><path class="lm-gold" d="M-3.5 4L0 -3L3.5 4Z"/><rect class="lm-gold" x="-0.6" y="-4" width="1.2" height="3"/><path class="lm-gold" d="M-1.6 -5.6a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="-0.35" y="-5" width="0.7" height="2.2"/><rect class="lm-detail" x="-14" y="40" width="3" height="2"/><rect class="lm-detail" x="-7.2" y="40" width="3" height="2"/><rect class="lm-detail" x="-0.4" y="40" width="3" height="2"/><rect class="lm-detail" x="6.4" y="40" width="3" height="2"/><rect class="lm-detail" x="13.2" y="40" width="3" height="2"/><rect class="lm-detail" x="-14" y="44.6" width="3" height="2"/><rect class="lm-detail" x="-7.2" y="44.6" width="3" height="2"/><rect class="lm-detail" x="-0.4" y="44.6" width="3" height="2"/><rect class="lm-detail" x="6.4" y="44.6" width="3" height="2"/><rect class="lm-detail" x="13.2" y="44.6" width="3" height="2"/><rect class="lm-detail" x="-14" y="49.2" width="3" height="2"/><rect class="lm-detail" x="-7.2" y="49.2" width="3" height="2"/><rect class="lm-detail" x="-0.4" y="49.2" width="3" height="2"/><rect class="lm-detail" x="6.4" y="49.2" width="3" height="2"/><rect class="lm-detail" x="13.2" y="49.2" width="3" height="2"/><rect class="lm-detail" x="-14" y="53.8" width="3" height="2"/><rect class="lm-detail" x="-7.2" y="53.8" width="3" height="2"/><rect class="lm-detail" x="-0.4" y="53.8" width="3" height="2"/><rect class="lm-detail" x="6.4" y="53.8" width="3" height="2"/><rect class="lm-detail" x="13.2" y="53.8" width="3" height="2"/><rect class="lm-detail" x="-14" y="58.4" width="3" height="2"/><rect class="lm-detail" x="-7.2" y="58.4" width="3" height="2"/><rect class="lm-detail" x="-0.4" y="58.4" width="3" height="2"/><rect class="lm-detail" x="6.4" y="58.4" width="3" height="2"/><rect class="lm-detail" x="13.2" y="58.4" width="3" height="2"/><rect class="lm-detail" x="-14" y="63" width="3" height="2"/><rect class="lm-detail" x="-7.2" y="63" width="3" height="2"/><rect class="lm-detail" x="-0.4" y="63" width="3" height="2"/><rect class="lm-detail" x="6.4" y="63" width="3" height="2"/><rect class="lm-detail" x="13.2" y="63" width="3" height="2"/><rect class="lm-detail" x="-14" y="67.6" width="3" height="2"/><rect class="lm-detail" x="-7.2" y="67.6" width="3" height="2"/><rect class="lm-detail" x="-0.4" y="67.6" width="3" height="2"/><rect class="lm-detail" x="6.4" y="67.6" width="3" height="2"/><rect class="lm-detail" x="13.2" y="67.6" width="3" height="2"/><rect class="lm-detail" x="-14" y="72.2" width="3" height="2"/><rect class="lm-detail" x="-7.2" y="72.2" width="3" height="2"/><rect class="lm-detail" x="-0.4" y="72.2" width="3" height="2"/><rect class="lm-detail" x="6.4" y="72.2" width="3" height="2"/><rect class="lm-detail" x="13.2" y="72.2" width="3" height="2"/><rect class="lm-detail" x="-14" y="76.8" width="3" height="2"/><rect class="lm-detail" x="-7.2" y="76.8" width="3" height="2"/><rect class="lm-detail" x="-0.4" y="76.8" width="3" height="2"/><rect class="lm-detail" x="6.4" y="76.8" width="3" height="2"/><rect class="lm-detail" x="13.2" y="76.8" width="3" height="2"/><path class="lm-detail" d="M-45.2 92V86a2 2 0 0 1 4 0V92Z"/><path class="lm-detail" d="M-35.6 92V86a2 2 0 0 1 4 0V92Z"/><path class="lm-detail" d="M-26 92V86a2 2 0 0 1 4 0V92Z"/><path class="lm-detail" d="M-16.4 92V86a2 2 0 0 1 4 0V92Z"/><path class="lm-detail" d="M-6.8 92V86a2 2 0 0 1 4 0V92Z"/><path class="lm-detail" d="M2.8 92V86a2 2 0 0 1 4 0V92Z"/><path class="lm-detail" d="M12.4 92V86a2 2 0 0 1 4 0V92Z"/><path class="lm-detail" d="M22 92V86a2 2 0 0 1 4 0V92Z"/><path class="lm-detail" d="M31.6 92V86a2 2 0 0 1 4 0V92Z"/><path class="lm-detail" d="M41.2 92V86a2 2 0 0 1 4 0V92Z"/>') +
        stand(125, 96, 0.86, '<rect class="lm-stone" x="-45" y="70" width="98" height="26"/><path class="lm-detail" d="M-40 92V79a3 3 0 0 1 6 0V92Z"/><path class="lm-detail" d="M-30.4 92V79a3 3 0 0 1 6 0V92Z"/><path class="lm-detail" d="M-20.8 92V79a3 3 0 0 1 6 0V92Z"/><path class="lm-detail" d="M-11.2 92V79a3 3 0 0 1 6 0V92Z"/><path class="lm-detail" d="M-1.6 92V79a3 3 0 0 1 6 0V92Z"/><path class="lm-detail" d="M8 92V79a3 3 0 0 1 6 0V92Z"/><path class="lm-detail" d="M17.6 92V79a3 3 0 0 1 6 0V92Z"/><path class="lm-detail" d="M27.2 92V79a3 3 0 0 1 6 0V92Z"/><path class="lm-detail" d="M36.8 92V79a3 3 0 0 1 6 0V92Z"/><rect class="lm-stone" x="-14" y="57" width="28" height="13"/><path class="lm-green" d="M-18 59C-18 45 -9 38 0 34C9 38 18 45 18 59Z"/><rect class="lm-gold" x="-0.6" y="22" width="1.2" height="12"/><path class="lm-gold" d="M-1.6 20.6a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="-0.35" y="21.200000000000003" width="0.7" height="2.2"/><path class="lm-slate" d="M21 70C21 63 25 60 29 59C33 60 37 63 37 70Z"/><path class="lm-slate" d="M-37 70C-37 64 -33.5 61.5 -30 61C-26.5 61.5 -23 64 -23 70Z"/><rect class="lm-stone" x="-43.8" y="18" width="5.6" height="78"/><rect class="lm-stone" x="-45.199999999999996" y="30" width="8.399999999999999" height="2" rx="0.6"/><rect class="lm-stone" x="-45.199999999999996" y="44" width="8.399999999999999" height="2" rx="0.6"/><rect class="lm-stone" x="-45.199999999999996" y="58" width="8.399999999999999" height="2" rx="0.6"/><path class="lm-slate" d="M-43.8 18C-44.8 12.96 -41.6 11.84 -41 7.360000000000001C-40.4 11.84 -37.2 12.96 -38.2 18Z"/><path class="lm-gold" d="M-42.6 4.960000000000001a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="-41.35" y="5.5600000000000005" width="0.7" height="2.2"/><rect class="lm-stone" x="44.2" y="18" width="5.6" height="78"/><rect class="lm-stone" x="42.800000000000004" y="30" width="8.399999999999999" height="2" rx="0.6"/><rect class="lm-stone" x="42.800000000000004" y="44" width="8.399999999999999" height="2" rx="0.6"/><rect class="lm-stone" x="42.800000000000004" y="58" width="8.399999999999999" height="2" rx="0.6"/><path class="lm-slate" d="M44.2 18C43.2 12.96 46.4 11.84 47 7.360000000000001C47.6 11.84 50.8 12.96 49.8 18Z"/><path class="lm-gold" d="M45.4 4.960000000000001a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="46.65" y="5.5600000000000005" width="0.7" height="2.2"/><path class="lm-stone-2" d="M-29 85Q-24 80 -19 79Q-14 80 -9 85L-14 83.6L-19 85.2L-24 83.6Z"/><rect class="lm-stone-2" x="-19.6" y="84" width="1.2" height="8"/><path class="lm-stone-2" d="M9 85Q14 80 19 79Q24 80 29 85L24 83.6L19 85.2L14 83.6Z"/><rect class="lm-stone-2" x="18.4" y="84" width="1.2" height="8"/>') +
        stand(216, 92, 0.86, '<rect class="lm-stone-2" x="-35" y="82" width="70" height="10"/><rect class="lm-detail" x="-31" y="85" width="4.6" height="4"/><rect class="lm-detail" x="-24.4" y="85" width="4.6" height="4"/><rect class="lm-detail" x="19.8" y="85" width="4.6" height="4"/><rect class="lm-detail" x="26.4" y="85" width="4.6" height="4"/><path class="lm-glass-dark" fill-rule="evenodd" d="M-18.5 92L-17 -3H17L18.5 92ZM-12.6 2.2Q0 4.4 12.6 2.2Q0 72 -12.6 2.2Z"/><path class="lm-line" d="M-12.6 2.2Q0 72 12.6 2.2"/><rect class="lm-detail" x="-15" y="44" width="2.2" height="1.2"/><rect class="lm-detail" x="-10" y="44" width="2.2" height="1.2"/><rect class="lm-detail" x="-5" y="44" width="2.2" height="1.2"/><rect class="lm-detail" x="0" y="44" width="2.2" height="1.2"/><rect class="lm-detail" x="5" y="44" width="2.2" height="1.2"/><rect class="lm-detail" x="10" y="44" width="2.2" height="1.2"/><rect class="lm-detail" x="15" y="44" width="2.2" height="1.2"/><rect class="lm-detail" x="-15" y="50.8" width="2.2" height="1.2"/><rect class="lm-detail" x="-10" y="50.8" width="2.2" height="1.2"/><rect class="lm-detail" x="-5" y="50.8" width="2.2" height="1.2"/><rect class="lm-detail" x="0" y="50.8" width="2.2" height="1.2"/><rect class="lm-detail" x="5" y="50.8" width="2.2" height="1.2"/><rect class="lm-detail" x="10" y="50.8" width="2.2" height="1.2"/><rect class="lm-detail" x="15" y="50.8" width="2.2" height="1.2"/><rect class="lm-detail" x="-15" y="57.6" width="2.2" height="1.2"/><rect class="lm-detail" x="-10" y="57.6" width="2.2" height="1.2"/><rect class="lm-detail" x="-5" y="57.6" width="2.2" height="1.2"/><rect class="lm-detail" x="0" y="57.6" width="2.2" height="1.2"/><rect class="lm-detail" x="5" y="57.6" width="2.2" height="1.2"/><rect class="lm-detail" x="10" y="57.6" width="2.2" height="1.2"/><rect class="lm-detail" x="15" y="57.6" width="2.2" height="1.2"/><rect class="lm-detail" x="-15" y="64.4" width="2.2" height="1.2"/><rect class="lm-detail" x="-10" y="64.4" width="2.2" height="1.2"/><rect class="lm-detail" x="-5" y="64.4" width="2.2" height="1.2"/><rect class="lm-detail" x="0" y="64.4" width="2.2" height="1.2"/><rect class="lm-detail" x="5" y="64.4" width="2.2" height="1.2"/><rect class="lm-detail" x="10" y="64.4" width="2.2" height="1.2"/><rect class="lm-detail" x="15" y="64.4" width="2.2" height="1.2"/><rect class="lm-detail" x="-15" y="71.2" width="2.2" height="1.2"/><rect class="lm-detail" x="-10" y="71.2" width="2.2" height="1.2"/><rect class="lm-detail" x="-5" y="71.2" width="2.2" height="1.2"/><rect class="lm-detail" x="0" y="71.2" width="2.2" height="1.2"/><rect class="lm-detail" x="5" y="71.2" width="2.2" height="1.2"/><rect class="lm-detail" x="10" y="71.2" width="2.2" height="1.2"/><rect class="lm-detail" x="15" y="71.2" width="2.2" height="1.2"/><rect class="lm-detail" x="-15" y="78" width="2.2" height="1.2"/><rect class="lm-detail" x="-10" y="78" width="2.2" height="1.2"/><rect class="lm-detail" x="-5" y="78" width="2.2" height="1.2"/><rect class="lm-detail" x="0" y="78" width="2.2" height="1.2"/><rect class="lm-detail" x="5" y="78" width="2.2" height="1.2"/><rect class="lm-detail" x="10" y="78" width="2.2" height="1.2"/><rect class="lm-detail" x="15" y="78" width="2.2" height="1.2"/>') +
        stand(297, 91, 0.86, '<path class="lm-glow" d="M-10 86.6H10L14 96H-14Z" opacity="0.5"/><path class="lm-glow" d="M-4 86.6H4L6 96H-6Z"/><path class="lm-stone-2" d="M-38 86.6Q-32 84 -24 84H30Q38 84 44 86.6Z"/><path class="lm-tower" d="M-5.5 60Q-6 75 -20 79H20Q6 75 5.5 60Z"/><rect class="lm-tower" x="-5.5" y="29" width="11" height="33"/><path class="lm-rib" d="M-3.6 34V62Q-4 74 -14 79M3.6 34V62Q4 74 14 79M-5.5 30L0 34L5.5 30M-5.5 34L0 30L5.5 34"/><rect class="lm-glass-dark" x="-0.7" y="35" width="1.4" height="42"/><path class="lm-tower-2" d="M-23 18.6C-18 24 -10 26 -6 31H6C10 26 18 24 23 18.6Z"/><path class="lm-rib" d="M-21.5 18.8Q-11.8 24.6 -4.8 30.4M-16.1 18.8Q-8.9 24.6 -3.6 30.4M-10.7 18.8Q-5.9 24.6 -2.4 30.4M-5.4 18.8Q-3 24.6 -1.2 30.4M0 18.8Q0 24.6 0 30.4M5.4 18.8Q3 24.6 1.2 30.4M10.8 18.8Q5.9 24.6 2.4 30.4M16.1 18.8Q8.9 24.6 3.6 30.4M21.5 18.8Q11.8 24.6 4.8 30.4"/><path class="lm-tower" d="M-18 10L-22.4 16.6H22.4L18 10Z"/><path class="lm-glass-dark" d="M-18.7 15.799999999999999V12.5a1.3 1.3 0 0 1 2.6 0V15.799999999999999Z"/><path class="lm-glass-dark" d="M-14.3 15.799999999999999V12.5a1.3 1.3 0 0 1 2.6 0V15.799999999999999Z"/><path class="lm-glass-dark" d="M-10 15.799999999999999V12.5a1.3 1.3 0 0 1 2.6 0V15.799999999999999Z"/><path class="lm-glass-dark" d="M-5.6 15.799999999999999V12.5a1.3 1.3 0 0 1 2.6 0V15.799999999999999Z"/><path class="lm-glass-dark" d="M-1.3 15.799999999999999V12.5a1.3 1.3 0 0 1 2.6 0V15.799999999999999Z"/><path class="lm-glass-dark" d="M3.1 15.799999999999999V12.5a1.3 1.3 0 0 1 2.6 0V15.799999999999999Z"/><path class="lm-glass-dark" d="M7.4 15.799999999999999V12.5a1.3 1.3 0 0 1 2.6 0V15.799999999999999Z"/><path class="lm-glass-dark" d="M11.7 15.799999999999999V12.5a1.3 1.3 0 0 1 2.6 0V15.799999999999999Z"/><path class="lm-glass-dark" d="M16.1 15.799999999999999V12.5a1.3 1.3 0 0 1 2.6 0V15.799999999999999Z"/><path class="lm-tower-3" d="M-23.6 16.4H23.6L23 18.8H-23Z"/><path class="lm-tower-3" d="M-23 18.6L-21.7 20.4L-20.4 18.6M-20.4 18.6L-19.2 20.4L-17.9 18.6M-17.9 18.6L-16.6 20.4L-15.3 18.6M-15.3 18.6L-14.1 20.4L-12.8 18.6M-12.8 18.6L-11.5 20.4L-10.2 18.6M-10.2 18.6L-8.9 20.4L-7.7 18.6M-7.7 18.6L-6.4 20.4L-5.1 18.6M-5.1 18.6L-3.8 20.4L-2.6 18.6M-2.6 18.6L-1.3 20.4L0 18.6M0 18.6L1.3 20.4L2.6 18.6M2.6 18.6L3.8 20.4L5.1 18.6M5.1 18.6L6.4 20.4L7.7 18.6M7.7 18.6L8.9 20.4L10.2 18.6M10.2 18.6L11.5 20.4L12.8 18.6M12.8 18.6L14.1 20.4L15.3 18.6M15.3 18.6L16.6 20.4L17.9 18.6M17.9 18.6L19.2 20.4L20.4 18.6M20.4 18.6L21.7 20.4L23 18.6Z"/><path class="lm-tower-3" d="M-16.4 10.4Q-15 4 0 3Q15 4 16.4 10.4Z"/><path class="lm-glass-dark" d="M-11.8 10.4V8.4a1 1 0 0 1 2 0V10.4Z"/><path class="lm-glass-dark" d="M-8.2 10.4V8.4a1 1 0 0 1 2 0V10.4Z"/><path class="lm-glass-dark" d="M-4.6 10.4V8.4a1 1 0 0 1 2 0V10.4Z"/><path class="lm-glass-dark" d="M-1 10.4V8.4a1 1 0 0 1 2 0V10.4Z"/><path class="lm-glass-dark" d="M2.6 10.4V8.4a1 1 0 0 1 2 0V10.4Z"/><path class="lm-glass-dark" d="M6.2 10.4V8.4a1 1 0 0 1 2 0V10.4Z"/><path class="lm-glass-dark" d="M9.8 10.4V8.4a1 1 0 0 1 2 0V10.4Z"/><path class="lm-tower" d="M-6 3.6Q-5.6 -1.6 0 -2Q5.6 -1.6 6 3.6Z"/><path class="lm-rib" d="M-3 3.4Q-2.6 -0.4 0 -1.8M3 3.4Q2.6 -0.4 0 -1.8M0 3.4V-1.8"/><rect class="lm-tower" x="-0.6" y="-4.4" width="1.2" height="2.6"/><path class="lm-white" d="M-27 78Q-27 73 -22.4 72.6Q-17.8 73 -17.8 78Z"/><path class="lm-white" d="M-19 78Q-19 73.6 -14.8 73.2Q-10.6 73.6 -10.6 78Z"/><rect class="lm-stone" x="-28" y="78" width="62" height="6"/><rect class="lm-white" x="-28.6" y="77.4" width="63.2" height="1.2"/><path class="lm-glass-dark" d="M-26 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/><path class="lm-glass-dark" d="M-20.9 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/><path class="lm-glass-dark" d="M-15.8 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/><path class="lm-glass-dark" d="M-10.7 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/><path class="lm-glass-dark" d="M-5.6 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/><path class="lm-glass-dark" d="M-0.5 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/><path class="lm-glass-dark" d="M4.6 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/><path class="lm-glass-dark" d="M9.7 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/><path class="lm-glass-dark" d="M14.8 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/><path class="lm-glass-dark" d="M19.9 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/><path class="lm-glass-dark" d="M25 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/><path class="lm-glass-dark" d="M30.1 84V80.6a1.6 1.6 0 0 1 3.2 0V84Z"/>')
    , 'The Abraj Al-Bait Clock Tower, Masjid an-Nabawi, the Kingdom Centre and the Khobar Water Tower');

    // Türkiye: Galata Tower and the Blue Mosque over the sea (Istanbul), Atakule and the Clock Tower (Ankara).
    C.TR = svg(
        hills('lm-far', 68, 4, 200) +
        water(74, X0, 121) +
        stand(11, 96, 0.95, '<rect class="lm-stone" x="-7.5" y="36" width="15" height="48"/><rect class="lm-stone" x="-9.7" y="35" width="19.4" height="2.6"/><rect class="lm-stone" x="-6.5" y="30.4" width="13" height="4.6"/><rect class="lm-detail" x="-4.5" y="31.4" width="1.6" height="2.2"/><rect class="lm-detail" x="-0.3" y="31.4" width="1.6" height="2.2"/><rect class="lm-detail" x="3.9" y="31.4" width="1.6" height="2.2"/><path class="lm-slate" d="M-8.5 31L0 8L8.5 31Z"/><rect class="lm-gold" x="-0.6" y="3" width="1.2" height="5.4"/><rect class="lm-detail" x="-4.3" y="41" width="1.6" height="4.4"/><rect class="lm-detail" x="-0.1" y="41" width="1.6" height="4.4"/><rect class="lm-detail" x="4.1" y="41" width="1.6" height="4.4"/><rect class="lm-detail" x="-4.3" y="50" width="1.6" height="4.4"/><rect class="lm-detail" x="-0.1" y="50" width="1.6" height="4.4"/><rect class="lm-detail" x="4.1" y="50" width="1.6" height="4.4"/><rect class="lm-detail" x="-4.3" y="59" width="1.6" height="4.4"/><rect class="lm-detail" x="-0.1" y="59" width="1.6" height="4.4"/><rect class="lm-detail" x="4.1" y="59" width="1.6" height="4.4"/><rect class="lm-detail" x="-4.3" y="68" width="1.6" height="4.4"/><rect class="lm-detail" x="-0.1" y="68" width="1.6" height="4.4"/><rect class="lm-detail" x="4.1" y="68" width="1.6" height="4.4"/><path class="lm-trees" d="M-24 96V86Q-14 77 -2 78.4Q8 75.6 18 80Q26 84 30 96Z"/>') +
        stand(118, 96, 0.95, '<rect class="lm-stone" x="-48" y="26" width="4" height="70"/><rect class="lm-stone" x="-49.4" y="38" width="6.8" height="2" rx="0.6"/><rect class="lm-stone" x="-49.4" y="50" width="6.8" height="2" rx="0.6"/><path class="lm-slate" d="M-48 26L-46 13.2L-44 26Z"/><path class="lm-gold" d="M-47.6 10.799999999999999a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="-46.35" y="11.399999999999999" width="0.7" height="2.2"/><rect class="lm-stone" x="44" y="26" width="4" height="70"/><rect class="lm-stone" x="42.6" y="38" width="6.8" height="2" rx="0.6"/><rect class="lm-stone" x="42.6" y="50" width="6.8" height="2" rx="0.6"/><path class="lm-slate" d="M44 26L46 13.2L48 26Z"/><path class="lm-gold" d="M44.4 10.799999999999999a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="45.65" y="11.399999999999999" width="0.7" height="2.2"/><rect class="lm-stone" x="-18" y="41" width="36" height="10"/><rect class="lm-detail" x="-15.4" y="43.5" width="1.6" height="4"/><rect class="lm-detail" x="-11.6" y="43.5" width="1.6" height="4"/><rect class="lm-detail" x="-7.8" y="43.5" width="1.6" height="4"/><rect class="lm-detail" x="-4" y="43.5" width="1.6" height="4"/><rect class="lm-detail" x="-0.2" y="43.5" width="1.6" height="4"/><rect class="lm-detail" x="3.6" y="43.5" width="1.6" height="4"/><rect class="lm-detail" x="7.4" y="43.5" width="1.6" height="4"/><rect class="lm-detail" x="11.2" y="43.5" width="1.6" height="4"/><rect class="lm-detail" x="15" y="43.5" width="1.6" height="4"/><path class="lm-slate" d="M-20.5 43C-20.5 29 -9.5 22 0 21C9.5 22 20.5 29 20.5 43Z"/><rect class="lm-gold" x="-0.6" y="12" width="1.2" height="9"/><path class="lm-gold" d="M-1.6 10.4a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="-0.35" y="11" width="0.7" height="2.2"/><rect class="lm-stone" x="-27" y="46" width="6" height="8"/><path class="lm-slate" d="M-27.4 46a3.4 3.2 0 0 1 6.8 0Z"/><rect class="lm-gold" x="-24.4" y="40" width="0.8" height="3.4"/><rect class="lm-stone" x="21" y="46" width="6" height="8"/><path class="lm-slate" d="M20.6 46a3.4 3.2 0 0 1 6.8 0Z"/><rect class="lm-gold" x="23.6" y="40" width="0.8" height="3.4"/><rect class="lm-stone" x="-38" y="56" width="76" height="8"/><path class="lm-slate" d="M-38 57a13 9 0 0 1 26 0Z"/><path class="lm-slate" d="M12 57a13 9 0 0 1 26 0Z"/><path class="lm-slate" d="M-13 55a13 9 0 0 1 26 0Z"/><path class="lm-slate" d="M-36 64a4 3.4 0 0 1 8 0Z"/><path class="lm-slate" d="M-26.4 64a4 3.4 0 0 1 8 0Z"/><path class="lm-slate" d="M-16.8 64a4 3.4 0 0 1 8 0Z"/><path class="lm-slate" d="M-7.2 64a4 3.4 0 0 1 8 0Z"/><path class="lm-slate" d="M2.4 64a4 3.4 0 0 1 8 0Z"/><path class="lm-slate" d="M12 64a4 3.4 0 0 1 8 0Z"/><path class="lm-slate" d="M21.6 64a4 3.4 0 0 1 8 0Z"/><rect class="lm-stone" x="-50" y="64" width="100" height="10"/><rect class="lm-detail" x="-47" y="66.5" width="2" height="4"/><rect class="lm-detail" x="-41" y="66.5" width="2" height="4"/><rect class="lm-detail" x="-35" y="66.5" width="2" height="4"/><rect class="lm-detail" x="-29" y="66.5" width="2" height="4"/><rect class="lm-detail" x="-23" y="66.5" width="2" height="4"/><rect class="lm-detail" x="-17" y="66.5" width="2" height="4"/><rect class="lm-detail" x="-11" y="66.5" width="2" height="4"/><rect class="lm-detail" x="-5" y="66.5" width="2" height="4"/><rect class="lm-detail" x="1" y="66.5" width="2" height="4"/><rect class="lm-detail" x="7" y="66.5" width="2" height="4"/><rect class="lm-detail" x="13" y="66.5" width="2" height="4"/><rect class="lm-detail" x="19" y="66.5" width="2" height="4"/><rect class="lm-detail" x="25" y="66.5" width="2" height="4"/><rect class="lm-detail" x="31" y="66.5" width="2" height="4"/><rect class="lm-detail" x="37" y="66.5" width="2" height="4"/><rect class="lm-detail" x="43" y="66.5" width="2" height="4"/><path class="lm-slate" d="M-49.4 74a3.4 2.9 0 0 1 6.8 0Z"/><path class="lm-slate" d="M-41 74a3.4 2.9 0 0 1 6.8 0Z"/><path class="lm-slate" d="M-32.6 74a3.4 2.9 0 0 1 6.8 0Z"/><path class="lm-slate" d="M-24.2 74a3.4 2.9 0 0 1 6.8 0Z"/><path class="lm-slate" d="M-15.8 74a3.4 2.9 0 0 1 6.8 0Z"/><path class="lm-slate" d="M-7.4 74a3.4 2.9 0 0 1 6.8 0Z"/><path class="lm-slate" d="M1 74a3.4 2.9 0 0 1 6.8 0Z"/><path class="lm-slate" d="M9.4 74a3.4 2.9 0 0 1 6.8 0Z"/><path class="lm-slate" d="M17.8 74a3.4 2.9 0 0 1 6.8 0Z"/><path class="lm-slate" d="M26.2 74a3.4 2.9 0 0 1 6.8 0Z"/><path class="lm-slate" d="M34.6 74a3.4 2.9 0 0 1 6.8 0Z"/><rect class="lm-stone" x="-60" y="74" width="120" height="14"/><path class="lm-detail" d="M-56 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M-47.6 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M-39.2 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M-30.8 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M-22.4 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M-14 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M-5.6 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M2.8 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M11.2 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M19.6 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M28 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M36.4 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M44.8 87V79a2 2 0 0 1 4 0V87Z"/><path class="lm-detail" d="M53.2 87V79a2 2 0 0 1 4 0V87Z"/><rect class="lm-stone" x="-82.2" y="16" width="4.4" height="80"/><rect class="lm-stone" x="-83.60000000000001" y="30" width="7.2" height="2" rx="0.6"/><rect class="lm-stone" x="-83.60000000000001" y="44" width="7.2" height="2" rx="0.6"/><rect class="lm-stone" x="-83.60000000000001" y="58" width="7.2" height="2" rx="0.6"/><path class="lm-slate" d="M-82.2 16L-80 1.9199999999999982L-77.8 16Z"/><path class="lm-gold" d="M-81.6 -0.48000000000000176a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="-80.35" y="0.11999999999999822" width="0.7" height="2.2"/><rect class="lm-stone" x="-66.2" y="20" width="4.4" height="76"/><rect class="lm-stone" x="-67.60000000000001" y="34" width="7.2" height="2" rx="0.6"/><rect class="lm-stone" x="-67.60000000000001" y="48" width="7.2" height="2" rx="0.6"/><rect class="lm-stone" x="-67.60000000000001" y="62" width="7.2" height="2" rx="0.6"/><path class="lm-slate" d="M-66.2 20L-64 5.919999999999998L-61.8 20Z"/><path class="lm-gold" d="M-65.6 3.5199999999999982a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="-64.35" y="4.119999999999998" width="0.7" height="2.2"/><rect class="lm-stone" x="61.8" y="20" width="4.4" height="76"/><rect class="lm-stone" x="60.4" y="34" width="7.2" height="2" rx="0.6"/><rect class="lm-stone" x="60.4" y="48" width="7.2" height="2" rx="0.6"/><rect class="lm-stone" x="60.4" y="62" width="7.2" height="2" rx="0.6"/><path class="lm-slate" d="M61.8 20L64 5.919999999999998L66.2 20Z"/><path class="lm-gold" d="M62.4 3.5199999999999982a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="63.65" y="4.119999999999998" width="0.7" height="2.2"/><rect class="lm-stone" x="77.8" y="16" width="4.4" height="80"/><rect class="lm-stone" x="76.39999999999999" y="30" width="7.2" height="2" rx="0.6"/><rect class="lm-stone" x="76.39999999999999" y="44" width="7.2" height="2" rx="0.6"/><rect class="lm-stone" x="76.39999999999999" y="58" width="7.2" height="2" rx="0.6"/><path class="lm-slate" d="M77.8 16L80 1.9199999999999982L82.2 16Z"/><path class="lm-gold" d="M78.4 -0.48000000000000176a1.8 1.8 0 1 0 3.2 0a1.4 1.4 0 1 1 -3.2 0Z"/><rect class="lm-gold" x="79.65" y="0.11999999999999822" width="0.7" height="2.2"/>') +
        '<path class="lm-trees" d="M-300 96V90Q36 84 52 88Q66 82 80 88Q94 83 108 88Q124 83 140 88Q156 83 172 88Q188 82 204 88Q216 85 228 91V96Z"/>' +
        stand(248, 91, 0.95, atakule(0)) +
        '<path class="lm-trees" d="M277 91Q279 86.6 284 87.2Q288 84.4 293 86.8Q297 85 300 87.4Q303 86.4 305 91Z"/>' +
        stand(309, 91, 0.95, clockTower(0)) +
        ground('lm-stone-2', 91)
    , 'Galata Tower, the Blue Mosque, Atakule and the Ankara Clock Tower');

    // ---------------------------------------------------------------- flags
    // Official flags from Wikimedia Commons: Syria (since 2025), Saudi Arabia, Türkiye; Bahrain drawn
    // to its 2002 specification (3:5, five white points); Egypt drawn to its 1984 specification (2:3, the
    // Eagle of Saladin in gold on the white band).
    var FLAG_FILES = { SY: 'flags/sy.svg', SA: 'flags/sa.svg', TR: 'flags/tr.svg', BH: 'flags/bh.svg', EG: 'flags/eg.svg' };
    var FLAGS = {};
    Object.keys(FLAG_FILES).forEach(function (k) {
        FLAGS[k] = '<img class="flag" src="' + FLAG_FILES[k] + '" alt="" width="30" height="20" decoding="async">';
    });

    global.MurtahilArt = { landmarks: L, countries: C, flags: FLAGS };
})(window);
