this.Up = this.Up || {};
(function (exports,main_core) {
  'use strict';

  /*!
   * @kurkle/color v0.3.2
   * https://github.com/kurkle/color#readme
   * (c) 2023 Jukka Kurkela
   * Released under the MIT License
   */
  function round(v) {
    return v + 0.5 | 0;
  }
  var lim = function lim(v, l, h) {
    return Math.max(Math.min(v, h), l);
  };
  function p2b(v) {
    return lim(round(v * 2.55), 0, 255);
  }
  function n2b(v) {
    return lim(round(v * 255), 0, 255);
  }
  function b2n(v) {
    return lim(round(v / 2.55) / 100, 0, 1);
  }
  function n2p(v) {
    return lim(round(v * 100), 0, 100);
  }
  var map$1 = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15
  };
  var hex = babelHelpers.toConsumableArray('0123456789ABCDEF');
  var h1 = function h1(b) {
    return hex[b & 0xF];
  };
  var h2 = function h2(b) {
    return hex[(b & 0xF0) >> 4] + hex[b & 0xF];
  };
  var eq = function eq(b) {
    return (b & 0xF0) >> 4 === (b & 0xF);
  };
  var isShort = function isShort(v) {
    return eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
  };
  function hexParse(str) {
    var len = str.length;
    var ret;
    if (str[0] === '#') {
      if (len === 4 || len === 5) {
        ret = {
          r: 255 & map$1[str[1]] * 17,
          g: 255 & map$1[str[2]] * 17,
          b: 255 & map$1[str[3]] * 17,
          a: len === 5 ? map$1[str[4]] * 17 : 255
        };
      } else if (len === 7 || len === 9) {
        ret = {
          r: map$1[str[1]] << 4 | map$1[str[2]],
          g: map$1[str[3]] << 4 | map$1[str[4]],
          b: map$1[str[5]] << 4 | map$1[str[6]],
          a: len === 9 ? map$1[str[7]] << 4 | map$1[str[8]] : 255
        };
      }
    }
    return ret;
  }
  var alpha = function alpha(a, f) {
    return a < 255 ? f(a) : '';
  };
  function _hexString(v) {
    var f = isShort(v) ? h1 : h2;
    return v ? '#' + f(v.r) + f(v.g) + f(v.b) + alpha(v.a, f) : undefined;
  }
  var HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
  function hsl2rgbn(h, s, l) {
    var a = s * Math.min(l, 1 - l);
    var f = function f(n) {
      var k = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (n + h / 30) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    return [f(0), f(8), f(4)];
  }
  function hsv2rgbn(h, s, v) {
    var f = function f(n) {
      var k = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (n + h / 60) % 6;
      return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    };
    return [f(5), f(3), f(1)];
  }
  function hwb2rgbn(h, w, b) {
    var rgb = hsl2rgbn(h, 1, 0.5);
    var i;
    if (w + b > 1) {
      i = 1 / (w + b);
      w *= i;
      b *= i;
    }
    for (i = 0; i < 3; i++) {
      rgb[i] *= 1 - w - b;
      rgb[i] += w;
    }
    return rgb;
  }
  function hueValue(r, g, b, d, max) {
    if (r === max) {
      return (g - b) / d + (g < b ? 6 : 0);
    }
    if (g === max) {
      return (b - r) / d + 2;
    }
    return (r - g) / d + 4;
  }
  function rgb2hsl(v) {
    var range = 255;
    var r = v.r / range;
    var g = v.g / range;
    var b = v.b / range;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var l = (max + min) / 2;
    var h, s, d;
    if (max !== min) {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = hueValue(r, g, b, d, max);
      h = h * 60 + 0.5;
    }
    return [h | 0, s || 0, l];
  }
  function calln(f, a, b, c) {
    return (Array.isArray(a) ? f(a[0], a[1], a[2]) : f(a, b, c)).map(n2b);
  }
  function hsl2rgb(h, s, l) {
    return calln(hsl2rgbn, h, s, l);
  }
  function hwb2rgb(h, w, b) {
    return calln(hwb2rgbn, h, w, b);
  }
  function hsv2rgb(h, s, v) {
    return calln(hsv2rgbn, h, s, v);
  }
  function hue(h) {
    return (h % 360 + 360) % 360;
  }
  function hueParse(str) {
    var m = HUE_RE.exec(str);
    var a = 255;
    var v;
    if (!m) {
      return;
    }
    if (m[5] !== v) {
      a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
    }
    var h = hue(+m[2]);
    var p1 = +m[3] / 100;
    var p2 = +m[4] / 100;
    if (m[1] === 'hwb') {
      v = hwb2rgb(h, p1, p2);
    } else if (m[1] === 'hsv') {
      v = hsv2rgb(h, p1, p2);
    } else {
      v = hsl2rgb(h, p1, p2);
    }
    return {
      r: v[0],
      g: v[1],
      b: v[2],
      a: a
    };
  }
  function _rotate(v, deg) {
    var h = rgb2hsl(v);
    h[0] = hue(h[0] + deg);
    h = hsl2rgb(h);
    v.r = h[0];
    v.g = h[1];
    v.b = h[2];
  }
  function _hslString(v) {
    if (!v) {
      return;
    }
    var a = rgb2hsl(v);
    var h = a[0];
    var s = n2p(a[1]);
    var l = n2p(a[2]);
    return v.a < 255 ? "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(b2n(v.a), ")") : "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)");
  }
  var map = {
    x: 'dark',
    Z: 'light',
    Y: 're',
    X: 'blu',
    W: 'gr',
    V: 'medium',
    U: 'slate',
    A: 'ee',
    T: 'ol',
    S: 'or',
    B: 'ra',
    C: 'lateg',
    D: 'ights',
    R: 'in',
    Q: 'turquois',
    E: 'hi',
    P: 'ro',
    O: 'al',
    N: 'le',
    M: 'de',
    L: 'yello',
    F: 'en',
    K: 'ch',
    G: 'arks',
    H: 'ea',
    I: 'ightg',
    J: 'wh'
  };
  var names$1 = {
    OiceXe: 'f0f8ff',
    antiquewEte: 'faebd7',
    aqua: 'ffff',
    aquamarRe: '7fffd4',
    azuY: 'f0ffff',
    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '0',
    blanKedOmond: 'ffebcd',
    Xe: 'ff',
    XeviTet: '8a2be2',
    bPwn: 'a52a2a',
    burlywood: 'deb887',
    caMtXe: '5f9ea0',
    KartYuse: '7fff00',
    KocTate: 'd2691e',
    cSO: 'ff7f50',
    cSnflowerXe: '6495ed',
    cSnsilk: 'fff8dc',
    crimson: 'dc143c',
    cyan: 'ffff',
    xXe: '8b',
    xcyan: '8b8b',
    xgTMnPd: 'b8860b',
    xWay: 'a9a9a9',
    xgYF: '6400',
    xgYy: 'a9a9a9',
    xkhaki: 'bdb76b',
    xmagFta: '8b008b',
    xTivegYF: '556b2f',
    xSange: 'ff8c00',
    xScEd: '9932cc',
    xYd: '8b0000',
    xsOmon: 'e9967a',
    xsHgYF: '8fbc8f',
    xUXe: '483d8b',
    xUWay: '2f4f4f',
    xUgYy: '2f4f4f',
    xQe: 'ced1',
    xviTet: '9400d3',
    dAppRk: 'ff1493',
    dApskyXe: 'bfff',
    dimWay: '696969',
    dimgYy: '696969',
    dodgerXe: '1e90ff',
    fiYbrick: 'b22222',
    flSOwEte: 'fffaf0',
    foYstWAn: '228b22',
    fuKsia: 'ff00ff',
    gaRsbSo: 'dcdcdc',
    ghostwEte: 'f8f8ff',
    gTd: 'ffd700',
    gTMnPd: 'daa520',
    Way: '808080',
    gYF: '8000',
    gYFLw: 'adff2f',
    gYy: '808080',
    honeyMw: 'f0fff0',
    hotpRk: 'ff69b4',
    RdianYd: 'cd5c5c',
    Rdigo: '4b0082',
    ivSy: 'fffff0',
    khaki: 'f0e68c',
    lavFMr: 'e6e6fa',
    lavFMrXsh: 'fff0f5',
    lawngYF: '7cfc00',
    NmoncEffon: 'fffacd',
    ZXe: 'add8e6',
    ZcSO: 'f08080',
    Zcyan: 'e0ffff',
    ZgTMnPdLw: 'fafad2',
    ZWay: 'd3d3d3',
    ZgYF: '90ee90',
    ZgYy: 'd3d3d3',
    ZpRk: 'ffb6c1',
    ZsOmon: 'ffa07a',
    ZsHgYF: '20b2aa',
    ZskyXe: '87cefa',
    ZUWay: '778899',
    ZUgYy: '778899',
    ZstAlXe: 'b0c4de',
    ZLw: 'ffffe0',
    lime: 'ff00',
    limegYF: '32cd32',
    lRF: 'faf0e6',
    magFta: 'ff00ff',
    maPon: '800000',
    VaquamarRe: '66cdaa',
    VXe: 'cd',
    VScEd: 'ba55d3',
    VpurpN: '9370db',
    VsHgYF: '3cb371',
    VUXe: '7b68ee',
    VsprRggYF: 'fa9a',
    VQe: '48d1cc',
    VviTetYd: 'c71585',
    midnightXe: '191970',
    mRtcYam: 'f5fffa',
    mistyPse: 'ffe4e1',
    moccasR: 'ffe4b5',
    navajowEte: 'ffdead',
    navy: '80',
    Tdlace: 'fdf5e6',
    Tive: '808000',
    TivedBb: '6b8e23',
    Sange: 'ffa500',
    SangeYd: 'ff4500',
    ScEd: 'da70d6',
    pOegTMnPd: 'eee8aa',
    pOegYF: '98fb98',
    pOeQe: 'afeeee',
    pOeviTetYd: 'db7093',
    papayawEp: 'ffefd5',
    pHKpuff: 'ffdab9',
    peru: 'cd853f',
    pRk: 'ffc0cb',
    plum: 'dda0dd',
    powMrXe: 'b0e0e6',
    purpN: '800080',
    YbeccapurpN: '663399',
    Yd: 'ff0000',
    Psybrown: 'bc8f8f',
    PyOXe: '4169e1',
    saddNbPwn: '8b4513',
    sOmon: 'fa8072',
    sandybPwn: 'f4a460',
    sHgYF: '2e8b57',
    sHshell: 'fff5ee',
    siFna: 'a0522d',
    silver: 'c0c0c0',
    skyXe: '87ceeb',
    UXe: '6a5acd',
    UWay: '708090',
    UgYy: '708090',
    snow: 'fffafa',
    sprRggYF: 'ff7f',
    stAlXe: '4682b4',
    tan: 'd2b48c',
    teO: '8080',
    tEstN: 'd8bfd8',
    tomato: 'ff6347',
    Qe: '40e0d0',
    viTet: 'ee82ee',
    JHt: 'f5deb3',
    wEte: 'ffffff',
    wEtesmoke: 'f5f5f5',
    Lw: 'ffff00',
    LwgYF: '9acd32'
  };
  function unpack() {
    var unpacked = {};
    var keys = Object.keys(names$1);
    var tkeys = Object.keys(map);
    var i, j, k, ok, nk;
    for (i = 0; i < keys.length; i++) {
      ok = nk = keys[i];
      for (j = 0; j < tkeys.length; j++) {
        k = tkeys[j];
        nk = nk.replace(k, map[k]);
      }
      k = parseInt(names$1[ok], 16);
      unpacked[nk] = [k >> 16 & 0xFF, k >> 8 & 0xFF, k & 0xFF];
    }
    return unpacked;
  }
  var names;
  function nameParse(str) {
    if (!names) {
      names = unpack();
      names.transparent = [0, 0, 0, 0];
    }
    var a = names[str.toLowerCase()];
    return a && {
      r: a[0],
      g: a[1],
      b: a[2],
      a: a.length === 4 ? a[3] : 255
    };
  }
  var RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
  function rgbParse(str) {
    var m = RGB_RE.exec(str);
    var a = 255;
    var r, g, b;
    if (!m) {
      return;
    }
    if (m[7] !== r) {
      var v = +m[7];
      a = m[8] ? p2b(v) : lim(v * 255, 0, 255);
    }
    r = +m[1];
    g = +m[3];
    b = +m[5];
    r = 255 & (m[2] ? p2b(r) : lim(r, 0, 255));
    g = 255 & (m[4] ? p2b(g) : lim(g, 0, 255));
    b = 255 & (m[6] ? p2b(b) : lim(b, 0, 255));
    return {
      r: r,
      g: g,
      b: b,
      a: a
    };
  }
  function _rgbString(v) {
    return v && (v.a < 255 ? "rgba(".concat(v.r, ", ").concat(v.g, ", ").concat(v.b, ", ").concat(b2n(v.a), ")") : "rgb(".concat(v.r, ", ").concat(v.g, ", ").concat(v.b, ")"));
  }
  var to = function to(v) {
    return v <= 0.0031308 ? v * 12.92 : Math.pow(v, 1.0 / 2.4) * 1.055 - 0.055;
  };
  var from = function from(v) {
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  function _interpolate(rgb1, rgb2, t) {
    var r = from(b2n(rgb1.r));
    var g = from(b2n(rgb1.g));
    var b = from(b2n(rgb1.b));
    return {
      r: n2b(to(r + t * (from(b2n(rgb2.r)) - r))),
      g: n2b(to(g + t * (from(b2n(rgb2.g)) - g))),
      b: n2b(to(b + t * (from(b2n(rgb2.b)) - b))),
      a: rgb1.a + t * (rgb2.a - rgb1.a)
    };
  }
  function modHSL(v, i, ratio) {
    if (v) {
      var tmp = rgb2hsl(v);
      tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
      tmp = hsl2rgb(tmp);
      v.r = tmp[0];
      v.g = tmp[1];
      v.b = tmp[2];
    }
  }
  function clone(v, proto) {
    return v ? Object.assign(proto || {}, v) : v;
  }
  function fromObject(input) {
    var v = {
      r: 0,
      g: 0,
      b: 0,
      a: 255
    };
    if (Array.isArray(input)) {
      if (input.length >= 3) {
        v = {
          r: input[0],
          g: input[1],
          b: input[2],
          a: 255
        };
        if (input.length > 3) {
          v.a = n2b(input[3]);
        }
      }
    } else {
      v = clone(input, {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      });
      v.a = n2b(v.a);
    }
    return v;
  }
  function functionParse(str) {
    if (str.charAt(0) === 'r') {
      return rgbParse(str);
    }
    return hueParse(str);
  }
  var Color = /*#__PURE__*/function () {
    function Color(input) {
      babelHelpers.classCallCheck(this, Color);
      if (input instanceof Color) {
        return input;
      }
      var type = babelHelpers["typeof"](input);
      var v;
      if (type === 'object') {
        v = fromObject(input);
      } else if (type === 'string') {
        v = hexParse(input) || nameParse(input) || functionParse(input);
      }
      this._rgb = v;
      this._valid = !!v;
    }
    babelHelpers.createClass(Color, [{
      key: "rgbString",
      value: function rgbString() {
        return this._valid ? _rgbString(this._rgb) : undefined;
      }
    }, {
      key: "hexString",
      value: function hexString() {
        return this._valid ? _hexString(this._rgb) : undefined;
      }
    }, {
      key: "hslString",
      value: function hslString() {
        return this._valid ? _hslString(this._rgb) : undefined;
      }
    }, {
      key: "mix",
      value: function mix(color, weight) {
        if (color) {
          var c1 = this.rgb;
          var c2 = color.rgb;
          var w2;
          var p = weight === w2 ? 0.5 : weight;
          var w = 2 * p - 1;
          var a = c1.a - c2.a;
          var w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
          w2 = 1 - w1;
          c1.r = 0xFF & w1 * c1.r + w2 * c2.r + 0.5;
          c1.g = 0xFF & w1 * c1.g + w2 * c2.g + 0.5;
          c1.b = 0xFF & w1 * c1.b + w2 * c2.b + 0.5;
          c1.a = p * c1.a + (1 - p) * c2.a;
          this.rgb = c1;
        }
        return this;
      }
    }, {
      key: "interpolate",
      value: function interpolate(color, t) {
        if (color) {
          this._rgb = _interpolate(this._rgb, color._rgb, t);
        }
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Color(this.rgb);
      }
    }, {
      key: "alpha",
      value: function alpha(a) {
        this._rgb.a = n2b(a);
        return this;
      }
    }, {
      key: "clearer",
      value: function clearer(ratio) {
        var rgb = this._rgb;
        rgb.a *= 1 - ratio;
        return this;
      }
    }, {
      key: "greyscale",
      value: function greyscale() {
        var rgb = this._rgb;
        var val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
        rgb.r = rgb.g = rgb.b = val;
        return this;
      }
    }, {
      key: "opaquer",
      value: function opaquer(ratio) {
        var rgb = this._rgb;
        rgb.a *= 1 + ratio;
        return this;
      }
    }, {
      key: "negate",
      value: function negate() {
        var v = this._rgb;
        v.r = 255 - v.r;
        v.g = 255 - v.g;
        v.b = 255 - v.b;
        return this;
      }
    }, {
      key: "lighten",
      value: function lighten(ratio) {
        modHSL(this._rgb, 2, ratio);
        return this;
      }
    }, {
      key: "darken",
      value: function darken(ratio) {
        modHSL(this._rgb, 2, -ratio);
        return this;
      }
    }, {
      key: "saturate",
      value: function saturate(ratio) {
        modHSL(this._rgb, 1, ratio);
        return this;
      }
    }, {
      key: "desaturate",
      value: function desaturate(ratio) {
        modHSL(this._rgb, 1, -ratio);
        return this;
      }
    }, {
      key: "rotate",
      value: function rotate(deg) {
        _rotate(this._rgb, deg);
        return this;
      }
    }, {
      key: "valid",
      get: function get() {
        return this._valid;
      }
    }, {
      key: "rgb",
      get: function get() {
        var v = clone(this._rgb);
        if (v) {
          v.a = b2n(v.a);
        }
        return v;
      },
      set: function set(obj) {
        this._rgb = fromObject(obj);
      }
    }]);
    return Color;
  }();

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

  /**
   * @namespace Chart.helpers
   */ /**
      * An empty function that can be used, for example, for optional callback.
      */
  function noop() {
    /* noop */}
  /**
   * Returns a unique id, sequentially generated from a global variable.
   */
  var uid = function () {
    var id = 0;
    return function () {
      return id++;
    };
  }();
  /**
   * Returns true if `value` is neither null nor undefined, else returns false.
   * @param value - The value to test.
   * @since 2.7.0
   */
  function isNullOrUndef(value) {
    return value === null || typeof value === 'undefined';
  }
  /**
   * Returns true if `value` is an array (including typed arrays), else returns false.
   * @param value - The value to test.
   * @function
   */
  function isArray(value) {
    if (Array.isArray && Array.isArray(value)) {
      return true;
    }
    var type = Object.prototype.toString.call(value);
    if (type.slice(0, 7) === '[object' && type.slice(-6) === 'Array]') {
      return true;
    }
    return false;
  }
  /**
   * Returns true if `value` is an object (excluding null), else returns false.
   * @param value - The value to test.
   * @since 2.7.0
   */
  function isObject(value) {
    return value !== null && Object.prototype.toString.call(value) === '[object Object]';
  }
  /**
   * Returns true if `value` is a finite number, else returns false
   * @param value  - The value to test.
   */
  function isNumberFinite(value) {
    return (typeof value === 'number' || value instanceof Number) && isFinite(+value);
  }
  /**
   * Returns `value` if finite, else returns `defaultValue`.
   * @param value - The value to return if defined.
   * @param defaultValue - The value to return if `value` is not finite.
   */
  function finiteOrDefault(value, defaultValue) {
    return isNumberFinite(value) ? value : defaultValue;
  }
  /**
   * Returns `value` if defined, else returns `defaultValue`.
   * @param value - The value to return if defined.
   * @param defaultValue - The value to return if `value` is undefined.
   */
  function valueOrDefault(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
  }
  var toPercentage = function toPercentage(value, dimension) {
    return typeof value === 'string' && value.endsWith('%') ? parseFloat(value) / 100 : +value / dimension;
  };
  var toDimension = function toDimension(value, dimension) {
    return typeof value === 'string' && value.endsWith('%') ? parseFloat(value) / 100 * dimension : +value;
  };
  /**
   * Calls `fn` with the given `args` in the scope defined by `thisArg` and returns the
   * value returned by `fn`. If `fn` is not a function, this method returns undefined.
   * @param fn - The function to call.
   * @param args - The arguments with which `fn` should be called.
   * @param [thisArg] - The value of `this` provided for the call to `fn`.
   */
  function callback(fn, args, thisArg) {
    if (fn && typeof fn.call === 'function') {
      return fn.apply(thisArg, args);
    }
  }
  function each(loopable, fn, thisArg, reverse) {
    var i, len, keys;
    if (isArray(loopable)) {
      len = loopable.length;
      if (reverse) {
        for (i = len - 1; i >= 0; i--) {
          fn.call(thisArg, loopable[i], i);
        }
      } else {
        for (i = 0; i < len; i++) {
          fn.call(thisArg, loopable[i], i);
        }
      }
    } else if (isObject(loopable)) {
      keys = Object.keys(loopable);
      len = keys.length;
      for (i = 0; i < len; i++) {
        fn.call(thisArg, loopable[keys[i]], keys[i]);
      }
    }
  }
  /**
   * Returns true if the `a0` and `a1` arrays have the same content, else returns false.
   * @param a0 - The array to compare
   * @param a1 - The array to compare
   * @private
   */
  function _elementsEqual(a0, a1) {
    var i, ilen, v0, v1;
    if (!a0 || !a1 || a0.length !== a1.length) {
      return false;
    }
    for (i = 0, ilen = a0.length; i < ilen; ++i) {
      v0 = a0[i];
      v1 = a1[i];
      if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
        return false;
      }
    }
    return true;
  }
  /**
   * Returns a deep copy of `source` without keeping references on objects and arrays.
   * @param source - The value to clone.
   */
  function clone$1(source) {
    if (isArray(source)) {
      return source.map(clone$1);
    }
    if (isObject(source)) {
      var target = Object.create(null);
      var keys = Object.keys(source);
      var klen = keys.length;
      var k = 0;
      for (; k < klen; ++k) {
        target[keys[k]] = clone$1(source[keys[k]]);
      }
      return target;
    }
    return source;
  }
  function isValidKey(key) {
    return ['__proto__', 'prototype', 'constructor'].indexOf(key) === -1;
  }
  /**
   * The default merger when Chart.helpers.merge is called without merger option.
   * Note(SB): also used by mergeConfig and mergeScaleConfig as fallback.
   * @private
   */
  function _merger(key, target, source, options) {
    if (!isValidKey(key)) {
      return;
    }
    var tval = target[key];
    var sval = source[key];
    if (isObject(tval) && isObject(sval)) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      merge(tval, sval, options);
    } else {
      target[key] = clone$1(sval);
    }
  }
  function merge(target, source, options) {
    var sources = isArray(source) ? source : [source];
    var ilen = sources.length;
    if (!isObject(target)) {
      return target;
    }
    options = options || {};
    var merger = options.merger || _merger;
    var current;
    for (var i = 0; i < ilen; ++i) {
      current = sources[i];
      if (!isObject(current)) {
        continue;
      }
      var keys = Object.keys(current);
      for (var k = 0, klen = keys.length; k < klen; ++k) {
        merger(keys[k], target, current, options);
      }
    }
    return target;
  }
  function mergeIf(target, source) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return merge(target, source, {
      merger: _mergerIf
    });
  }
  /**
   * Merges source[key] in target[key] only if target[key] is undefined.
   * @private
   */
  function _mergerIf(key, target, source) {
    if (!isValidKey(key)) {
      return;
    }
    var tval = target[key];
    var sval = source[key];
    if (isObject(tval) && isObject(sval)) {
      mergeIf(tval, sval);
    } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
      target[key] = clone$1(sval);
    }
  }
  // resolveObjectKey resolver cache
  var keyResolvers = {
    // Chart.helpers.core resolveObjectKey should resolve empty key to root object
    '': function _(v) {
      return v;
    },
    // default resolvers
    x: function x(o) {
      return o.x;
    },
    y: function y(o) {
      return o.y;
    }
  };
  /**
   * @private
   */
  function _splitKey(key) {
    var parts = key.split('.');
    var keys = [];
    var tmp = '';
    var _iterator = _createForOfIteratorHelper(parts),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var part = _step.value;
        tmp += part;
        if (tmp.endsWith('\\')) {
          tmp = tmp.slice(0, -1) + '.';
        } else {
          keys.push(tmp);
          tmp = '';
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return keys;
  }
  function _getKeyResolver(key) {
    var keys = _splitKey(key);
    return function (obj) {
      var _iterator2 = _createForOfIteratorHelper(keys),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var k = _step2.value;
          if (k === '') {
            break;
          }
          obj = obj && obj[k];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return obj;
    };
  }
  function resolveObjectKey(obj, key) {
    var resolver = keyResolvers[key] || (keyResolvers[key] = _getKeyResolver(key));
    return resolver(obj);
  }
  /**
   * @private
   */
  function _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  var defined = function defined(value) {
    return typeof value !== 'undefined';
  };
  var isFunction = function isFunction(value) {
    return typeof value === 'function';
  };
  // Adapted from https://stackoverflow.com/questions/31128855/comparing-ecma6-sets-for-equality#31129384
  var setsEqual = function setsEqual(a, b) {
    if (a.size !== b.size) {
      return false;
    }
    var _iterator3 = _createForOfIteratorHelper(a),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var item = _step3.value;
        if (!b.has(item)) {
          return false;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return true;
  };
  /**
   * @param e - The event
   * @private
   */
  function _isClickEvent(e) {
    return e.type === 'mouseup' || e.type === 'click' || e.type === 'contextmenu';
  }

  /**
   * @alias Chart.helpers.math
   * @namespace
   */
  var PI = Math.PI;
  var TAU = 2 * PI;
  var PITAU = TAU + PI;
  var INFINITY = Number.POSITIVE_INFINITY;
  var RAD_PER_DEG = PI / 180;
  var HALF_PI = PI / 2;
  var QUARTER_PI = PI / 4;
  var TWO_THIRDS_PI = PI * 2 / 3;
  var log10 = Math.log10;
  var sign = Math.sign;
  function almostEquals(x, y, epsilon) {
    return Math.abs(x - y) < epsilon;
  }
  /**
   * Implementation of the nice number algorithm used in determining where axis labels will go
   */
  function niceNum(range) {
    var roundedRange = Math.round(range);
    range = almostEquals(range, roundedRange, range / 1000) ? roundedRange : range;
    var niceRange = Math.pow(10, Math.floor(log10(range)));
    var fraction = range / niceRange;
    var niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
    return niceFraction * niceRange;
  }
  /**
   * Returns an array of factors sorted from 1 to sqrt(value)
   * @private
   */
  function _factorize(value) {
    var result = [];
    var sqrt = Math.sqrt(value);
    var i;
    for (i = 1; i < sqrt; i++) {
      if (value % i === 0) {
        result.push(i);
        result.push(value / i);
      }
    }
    if (sqrt === (sqrt | 0)) {
      result.push(sqrt);
    }
    result.sort(function (a, b) {
      return a - b;
    }).pop();
    return result;
  }
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  function almostWhole(x, epsilon) {
    var rounded = Math.round(x);
    return rounded - epsilon <= x && rounded + epsilon >= x;
  }
  /**
   * @private
   */
  function _setMinAndMaxByKey(array, target, property) {
    var i, ilen, value;
    for (i = 0, ilen = array.length; i < ilen; i++) {
      value = array[i][property];
      if (!isNaN(value)) {
        target.min = Math.min(target.min, value);
        target.max = Math.max(target.max, value);
      }
    }
  }
  function toRadians(degrees) {
    return degrees * (PI / 180);
  }
  function toDegrees(radians) {
    return radians * (180 / PI);
  }
  /**
   * Returns the number of decimal places
   * i.e. the number of digits after the decimal point, of the value of this Number.
   * @param x - A number.
   * @returns The number of decimal places.
   * @private
   */
  function _decimalPlaces(x) {
    if (!isNumberFinite(x)) {
      return;
    }
    var e = 1;
    var p = 0;
    while (Math.round(x * e) / e !== x) {
      e *= 10;
      p++;
    }
    return p;
  }
  // Gets the angle from vertical upright to the point about a centre.
  function getAngleFromPoint(centrePoint, anglePoint) {
    var distanceFromXCenter = anglePoint.x - centrePoint.x;
    var distanceFromYCenter = anglePoint.y - centrePoint.y;
    var radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
    var angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
    if (angle < -0.5 * PI) {
      angle += TAU; // make sure the returned angle is in the range of (-PI/2, 3PI/2]
    }

    return {
      angle: angle,
      distance: radialDistanceFromCenter
    };
  }
  function distanceBetweenPoints(pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
  }
  /**
   * Shortest distance between angles, in either direction.
   * @private
   */
  function _angleDiff(a, b) {
    return (a - b + PITAU) % TAU - PI;
  }
  /**
   * Normalize angle to be between 0 and 2*PI
   * @private
   */
  function _normalizeAngle(a) {
    return (a % TAU + TAU) % TAU;
  }
  /**
   * @private
   */
  function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
    var a = _normalizeAngle(angle);
    var s = _normalizeAngle(start);
    var e = _normalizeAngle(end);
    var angleToStart = _normalizeAngle(s - a);
    var angleToEnd = _normalizeAngle(e - a);
    var startToAngle = _normalizeAngle(a - s);
    var endToAngle = _normalizeAngle(a - e);
    return a === s || a === e || sameAngleIsFullCircle && s === e || angleToStart > angleToEnd && startToAngle < endToAngle;
  }
  /**
   * Limit `value` between `min` and `max`
   * @param value
   * @param min
   * @param max
   * @private
   */
  function _limitValue(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  /**
   * @param {number} value
   * @private
   */
  function _int16Range(value) {
    return _limitValue(value, -32768, 32767);
  }
  /**
   * @param value
   * @param start
   * @param end
   * @param [epsilon]
   * @private
   */
  function _isBetween(value, start, end) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1e-6;
    return value >= Math.min(start, end) - epsilon && value <= Math.max(start, end) + epsilon;
  }
  function _lookup(table, value, cmp) {
    cmp = cmp || function (index) {
      return table[index] < value;
    };
    var hi = table.length - 1;
    var lo = 0;
    var mid;
    while (hi - lo > 1) {
      mid = lo + hi >> 1;
      if (cmp(mid)) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return {
      lo: lo,
      hi: hi
    };
  }
  /**
   * Binary search
   * @param table - the table search. must be sorted!
   * @param key - property name for the value in each entry
   * @param value - value to find
   * @param last - lookup last index
   * @private
   */
  var _lookupByKey = function _lookupByKey(table, key, value, last) {
    return _lookup(table, value, last ? function (index) {
      var ti = table[index][key];
      return ti < value || ti === value && table[index + 1][key] === value;
    } : function (index) {
      return table[index][key] < value;
    });
  };
  /**
   * Reverse binary search
   * @param table - the table search. must be sorted!
   * @param key - property name for the value in each entry
   * @param value - value to find
   * @private
   */
  var _rlookupByKey = function _rlookupByKey(table, key, value) {
    return _lookup(table, value, function (index) {
      return table[index][key] >= value;
    });
  };
  /**
   * Return subset of `values` between `min` and `max` inclusive.
   * Values are assumed to be in sorted order.
   * @param values - sorted array of values
   * @param min - min value
   * @param max - max value
   */
  function _filterBetween(values, min, max) {
    var start = 0;
    var end = values.length;
    while (start < end && values[start] < min) {
      start++;
    }
    while (end > start && values[end - 1] > max) {
      end--;
    }
    return start > 0 || end < values.length ? values.slice(start, end) : values;
  }
  var arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];
  function listenArrayEvents(array, listener) {
    if (array._chartjs) {
      array._chartjs.listeners.push(listener);
      return;
    }
    Object.defineProperty(array, '_chartjs', {
      configurable: true,
      enumerable: false,
      value: {
        listeners: [listener]
      }
    });
    arrayEvents.forEach(function (key) {
      var method = '_onData' + _capitalize(key);
      var base = array[key];
      Object.defineProperty(array, key, {
        configurable: true,
        enumerable: false,
        value: function value() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          var res = base.apply(this, args);
          array._chartjs.listeners.forEach(function (object) {
            if (typeof object[method] === 'function') {
              object[method].apply(object, args);
            }
          });
          return res;
        }
      });
    });
  }
  function unlistenArrayEvents(array, listener) {
    var stub = array._chartjs;
    if (!stub) {
      return;
    }
    var listeners = stub.listeners;
    var index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    if (listeners.length > 0) {
      return;
    }
    arrayEvents.forEach(function (key) {
      delete array[key];
    });
    delete array._chartjs;
  }
  /**
   * @param items
   */
  function _arrayUnique(items) {
    var set = new Set();
    var i, ilen;
    for (i = 0, ilen = items.length; i < ilen; ++i) {
      set.add(items[i]);
    }
    if (set.size === ilen) {
      return items;
    }
    return Array.from(set);
  }
  /**
  * Request animation polyfill
  */
  var requestAnimFrame = function () {
    if (typeof window === 'undefined') {
      return function (callback) {
        return callback();
      };
    }
    return window.requestAnimationFrame;
  }();
  /**
   * Throttles calling `fn` once per animation frame
   * Latest arguments are used on the actual call
   */
  function throttled(fn, thisArg) {
    var argsToUse = [];
    var ticking = false;
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      // Save the args for use later
      argsToUse = args;
      if (!ticking) {
        ticking = true;
        requestAnimFrame.call(window, function () {
          ticking = false;
          fn.apply(thisArg, argsToUse);
        });
      }
    };
  }
  /**
   * Debounces calling `fn` for `delay` ms
   */
  function debounce(fn, delay) {
    var timeout;
    return function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      if (delay) {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay, args);
      } else {
        fn.apply(this, args);
      }
      return delay;
    };
  }
  /**
   * Converts 'start' to 'left', 'end' to 'right' and others to 'center'
   * @private
   */
  var _toLeftRightCenter = function _toLeftRightCenter(align) {
    return align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
  };
  /**
   * Returns `start`, `end` or `(start + end) / 2` depending on `align`. Defaults to `center`
   * @private
   */
  var _alignStartEnd = function _alignStartEnd(align, start, end) {
    return align === 'start' ? start : align === 'end' ? end : (start + end) / 2;
  };
  /**
   * Returns `left`, `right` or `(left + right) / 2` depending on `align`. Defaults to `left`
   * @private
   */
  var _textX = function _textX(align, left, right, rtl) {
    var check = rtl ? 'left' : 'right';
    return align === check ? right : align === 'center' ? (left + right) / 2 : left;
  };
  /**
   * Return start and count of visible points.
   * @private
   */
  function _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
    var pointCount = points.length;
    var start = 0;
    var count = pointCount;
    if (meta._sorted) {
      var iScale = meta.iScale,
        _parsed = meta._parsed;
      var axis = iScale.axis;
      var _iScale$getUserBounds = iScale.getUserBounds(),
        min = _iScale$getUserBounds.min,
        max = _iScale$getUserBounds.max,
        minDefined = _iScale$getUserBounds.minDefined,
        maxDefined = _iScale$getUserBounds.maxDefined;
      if (minDefined) {
        start = _limitValue(Math.min(
        // @ts-expect-error Need to type _parsed
        _lookupByKey(_parsed, iScale.axis, min).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        animationsDisabled ? pointCount : _lookupByKey(points, axis, iScale.getPixelForValue(min)).lo), 0, pointCount - 1);
      }
      if (maxDefined) {
        count = _limitValue(Math.max(
        // @ts-expect-error Need to type _parsed
        _lookupByKey(_parsed, iScale.axis, max, true).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        animationsDisabled ? 0 : _lookupByKey(points, axis, iScale.getPixelForValue(max), true).hi + 1), start, pointCount) - start;
      } else {
        count = pointCount - start;
      }
    }
    return {
      start: start,
      count: count
    };
  }
  /**
   * Checks if the scale ranges have changed.
   * @param {object} meta - dataset meta.
   * @returns {boolean}
   * @private
   */
  function _scaleRangesChanged(meta) {
    var xScale = meta.xScale,
      yScale = meta.yScale,
      _scaleRanges = meta._scaleRanges;
    var newRanges = {
      xmin: xScale.min,
      xmax: xScale.max,
      ymin: yScale.min,
      ymax: yScale.max
    };
    if (!_scaleRanges) {
      meta._scaleRanges = newRanges;
      return true;
    }
    var changed = _scaleRanges.xmin !== xScale.min || _scaleRanges.xmax !== xScale.max || _scaleRanges.ymin !== yScale.min || _scaleRanges.ymax !== yScale.max;
    Object.assign(_scaleRanges, newRanges);
    return changed;
  }
  var atEdge = function atEdge(t) {
    return t === 0 || t === 1;
  };
  var elasticIn = function elasticIn(t, s, p) {
    return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));
  };
  var elasticOut = function elasticOut(t, s, p) {
    return Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;
  };
  /**
   * Easing functions adapted from Robert Penner's easing equations.
   * @namespace Chart.helpers.easing.effects
   * @see http://www.robertpenner.com/easing/
   */
  var effects = {
    linear: function linear(t) {
      return t;
    },
    easeInQuad: function easeInQuad(t) {
      return t * t;
    },
    easeOutQuad: function easeOutQuad(t) {
      return -t * (t - 2);
    },
    easeInOutQuad: function easeInOutQuad(t) {
      return (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
    },
    easeInCubic: function easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic: function easeOutCubic(t) {
      return (t -= 1) * t * t + 1;
    },
    easeInOutCubic: function easeInOutCubic(t) {
      return (t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2);
    },
    easeInQuart: function easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart: function easeOutQuart(t) {
      return -((t -= 1) * t * t * t - 1);
    },
    easeInOutQuart: function easeInOutQuart(t) {
      return (t /= 0.5) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2);
    },
    easeInQuint: function easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function easeOutQuint(t) {
      return (t -= 1) * t * t * t * t + 1;
    },
    easeInOutQuint: function easeInOutQuint(t) {
      return (t /= 0.5) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2);
    },
    easeInSine: function easeInSine(t) {
      return -Math.cos(t * HALF_PI) + 1;
    },
    easeOutSine: function easeOutSine(t) {
      return Math.sin(t * HALF_PI);
    },
    easeInOutSine: function easeInOutSine(t) {
      return -0.5 * (Math.cos(PI * t) - 1);
    },
    easeInExpo: function easeInExpo(t) {
      return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    },
    easeOutExpo: function easeOutExpo(t) {
      return t === 1 ? 1 : -Math.pow(2, -10 * t) + 1;
    },
    easeInOutExpo: function easeInOutExpo(t) {
      return atEdge(t) ? t : t < 0.5 ? 0.5 * Math.pow(2, 10 * (t * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2);
    },
    easeInCirc: function easeInCirc(t) {
      return t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1);
    },
    easeOutCirc: function easeOutCirc(t) {
      return Math.sqrt(1 - (t -= 1) * t);
    },
    easeInOutCirc: function easeInOutCirc(t) {
      return (t /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    },
    easeInElastic: function easeInElastic(t) {
      return atEdge(t) ? t : elasticIn(t, 0.075, 0.3);
    },
    easeOutElastic: function easeOutElastic(t) {
      return atEdge(t) ? t : elasticOut(t, 0.075, 0.3);
    },
    easeInOutElastic: function easeInOutElastic(t) {
      var s = 0.1125;
      var p = 0.45;
      return atEdge(t) ? t : t < 0.5 ? 0.5 * elasticIn(t * 2, s, p) : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p);
    },
    easeInBack: function easeInBack(t) {
      var s = 1.70158;
      return t * t * ((s + 1) * t - s);
    },
    easeOutBack: function easeOutBack(t) {
      var s = 1.70158;
      return (t -= 1) * t * ((s + 1) * t + s) + 1;
    },
    easeInOutBack: function easeInOutBack(t) {
      var s = 1.70158;
      if ((t /= 0.5) < 1) {
        return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
      }
      return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
    },
    easeInBounce: function easeInBounce(t) {
      return 1 - effects.easeOutBounce(1 - t);
    },
    easeOutBounce: function easeOutBounce(t) {
      var m = 7.5625;
      var d = 2.75;
      if (t < 1 / d) {
        return m * t * t;
      }
      if (t < 2 / d) {
        return m * (t -= 1.5 / d) * t + 0.75;
      }
      if (t < 2.5 / d) {
        return m * (t -= 2.25 / d) * t + 0.9375;
      }
      return m * (t -= 2.625 / d) * t + 0.984375;
    },
    easeInOutBounce: function easeInOutBounce(t) {
      return t < 0.5 ? effects.easeInBounce(t * 2) * 0.5 : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
    }
  };
  function isPatternOrGradient(value) {
    if (value && babelHelpers["typeof"](value) === 'object') {
      var type = value.toString();
      return type === '[object CanvasPattern]' || type === '[object CanvasGradient]';
    }
    return false;
  }
  function color(value) {
    return isPatternOrGradient(value) ? value : new Color(value);
  }
  function getHoverColor(value) {
    return isPatternOrGradient(value) ? value : new Color(value).saturate(0.5).darken(0.1).hexString();
  }
  var numbers = ['x', 'y', 'borderWidth', 'radius', 'tension'];
  var colors = ['color', 'borderColor', 'backgroundColor'];
  function applyAnimationsDefaults(defaults) {
    defaults.set('animation', {
      delay: undefined,
      duration: 1000,
      easing: 'easeOutQuart',
      fn: undefined,
      from: undefined,
      loop: undefined,
      to: undefined,
      type: undefined
    });
    defaults.describe('animation', {
      _fallback: false,
      _indexable: false,
      _scriptable: function _scriptable(name) {
        return name !== 'onProgress' && name !== 'onComplete' && name !== 'fn';
      }
    });
    defaults.set('animations', {
      colors: {
        type: 'color',
        properties: colors
      },
      numbers: {
        type: 'number',
        properties: numbers
      }
    });
    defaults.describe('animations', {
      _fallback: 'animation'
    });
    defaults.set('transitions', {
      active: {
        animation: {
          duration: 400
        }
      },
      resize: {
        animation: {
          duration: 0
        }
      },
      show: {
        animations: {
          colors: {
            from: 'transparent'
          },
          visible: {
            type: 'boolean',
            duration: 0
          }
        }
      },
      hide: {
        animations: {
          colors: {
            to: 'transparent'
          },
          visible: {
            type: 'boolean',
            easing: 'linear',
            fn: function fn(v) {
              return v | 0;
            }
          }
        }
      }
    });
  }
  function applyLayoutsDefaults(defaults) {
    defaults.set('layout', {
      autoPadding: true,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });
  }
  var intlCache = new Map();
  function getNumberFormat(locale, options) {
    options = options || {};
    var cacheKey = locale + JSON.stringify(options);
    var formatter = intlCache.get(cacheKey);
    if (!formatter) {
      formatter = new Intl.NumberFormat(locale, options);
      intlCache.set(cacheKey, formatter);
    }
    return formatter;
  }
  function formatNumber(num, locale, options) {
    return getNumberFormat(locale, options).format(num);
  }
  var formatters = {
    values: function values(value) {
      return isArray(value) ? value : '' + value;
    },
    numeric: function numeric(tickValue, index, ticks) {
      if (tickValue === 0) {
        return '0';
      }
      var locale = this.chart.options.locale;
      var notation;
      var delta = tickValue;
      if (ticks.length > 1) {
        var maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
        if (maxTick < 1e-4 || maxTick > 1e+15) {
          notation = 'scientific';
        }
        delta = calculateDelta(tickValue, ticks);
      }
      var logDelta = log10(Math.abs(delta));
      var numDecimal = Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0);
      var options = {
        notation: notation,
        minimumFractionDigits: numDecimal,
        maximumFractionDigits: numDecimal
      };
      Object.assign(options, this.options.ticks.format);
      return formatNumber(tickValue, locale, options);
    },
    logarithmic: function logarithmic(tickValue, index, ticks) {
      if (tickValue === 0) {
        return '0';
      }
      var remain = ticks[index].significand || tickValue / Math.pow(10, Math.floor(log10(tickValue)));
      if ([1, 2, 3, 5, 10, 15].includes(remain) || index > 0.8 * ticks.length) {
        return formatters.numeric.call(this, tickValue, index, ticks);
      }
      return '';
    }
  };
  function calculateDelta(tickValue, ticks) {
    var delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;
    if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
      delta = tickValue - Math.floor(tickValue);
    }
    return delta;
  }
  var Ticks = {
    formatters: formatters
  };
  function applyScaleDefaults(defaults) {
    defaults.set('scale', {
      display: true,
      offset: false,
      reverse: false,
      beginAtZero: false,
      bounds: 'ticks',
      grace: 0,
      grid: {
        display: true,
        lineWidth: 1,
        drawOnChartArea: true,
        drawTicks: true,
        tickLength: 8,
        tickWidth: function tickWidth(_ctx, options) {
          return options.lineWidth;
        },
        tickColor: function tickColor(_ctx, options) {
          return options.color;
        },
        offset: false
      },
      border: {
        display: true,
        dash: [],
        dashOffset: 0.0,
        width: 1
      },
      title: {
        display: false,
        text: '',
        padding: {
          top: 4,
          bottom: 4
        }
      },
      ticks: {
        minRotation: 0,
        maxRotation: 50,
        mirror: false,
        textStrokeWidth: 0,
        textStrokeColor: '',
        padding: 3,
        display: true,
        autoSkip: true,
        autoSkipPadding: 3,
        labelOffset: 0,
        callback: Ticks.formatters.values,
        minor: {},
        major: {},
        align: 'center',
        crossAlign: 'near',
        showLabelBackdrop: false,
        backdropColor: 'rgba(255, 255, 255, 0.75)',
        backdropPadding: 2
      }
    });
    defaults.route('scale.ticks', 'color', '', 'color');
    defaults.route('scale.grid', 'color', '', 'borderColor');
    defaults.route('scale.border', 'color', '', 'borderColor');
    defaults.route('scale.title', 'color', '', 'color');
    defaults.describe('scale', {
      _fallback: false,
      _scriptable: function _scriptable(name) {
        return !name.startsWith('before') && !name.startsWith('after') && name !== 'callback' && name !== 'parser';
      },
      _indexable: function _indexable(name) {
        return name !== 'borderDash' && name !== 'tickBorderDash' && name !== 'dash';
      }
    });
    defaults.describe('scales', {
      _fallback: 'scale'
    });
    defaults.describe('scale.ticks', {
      _scriptable: function _scriptable(name) {
        return name !== 'backdropPadding' && name !== 'callback';
      },
      _indexable: function _indexable(name) {
        return name !== 'backdropPadding';
      }
    });
  }
  var overrides = Object.create(null);
  var descriptors = Object.create(null);
  function getScope$1(node, key) {
    if (!key) {
      return node;
    }
    var keys = key.split('.');
    for (var i = 0, n = keys.length; i < n; ++i) {
      var k = keys[i];
      node = node[k] || (node[k] = Object.create(null));
    }
    return node;
  }
  function _set(root, scope, values) {
    if (typeof scope === 'string') {
      return merge(getScope$1(root, scope), values);
    }
    return merge(getScope$1(root, ''), scope);
  }
  var Defaults = /*#__PURE__*/function () {
    function Defaults(_descriptors, _appliers) {
      babelHelpers.classCallCheck(this, Defaults);
      this.animation = undefined;
      this.backgroundColor = 'rgba(0,0,0,0.1)';
      this.borderColor = 'rgba(0,0,0,0.1)';
      this.color = '#666';
      this.datasets = {};
      this.devicePixelRatio = function (context) {
        return context.chart.platform.getDevicePixelRatio();
      };
      this.elements = {};
      this.events = ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'];
      this.font = {
        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        size: 12,
        style: 'normal',
        lineHeight: 1.2,
        weight: null
      };
      this.hover = {};
      this.hoverBackgroundColor = function (ctx, options) {
        return getHoverColor(options.backgroundColor);
      };
      this.hoverBorderColor = function (ctx, options) {
        return getHoverColor(options.borderColor);
      };
      this.hoverColor = function (ctx, options) {
        return getHoverColor(options.color);
      };
      this.indexAxis = 'x';
      this.interaction = {
        mode: 'nearest',
        intersect: true,
        includeInvisible: false
      };
      this.maintainAspectRatio = true;
      this.onHover = null;
      this.onClick = null;
      this.parsing = true;
      this.plugins = {};
      this.responsive = true;
      this.scale = undefined;
      this.scales = {};
      this.showLine = true;
      this.drawActiveElementsOnTop = true;
      this.describe(_descriptors);
      this.apply(_appliers);
    }
    babelHelpers.createClass(Defaults, [{
      key: "set",
      value: function set(scope, values) {
        return _set(this, scope, values);
      }
    }, {
      key: "get",
      value: function get(scope) {
        return getScope$1(this, scope);
      }
    }, {
      key: "describe",
      value: function describe(scope, values) {
        return _set(descriptors, scope, values);
      }
    }, {
      key: "override",
      value: function override(scope, values) {
        return _set(overrides, scope, values);
      }
    }, {
      key: "route",
      value: function route(scope, name, targetScope, targetName) {
        var _Object$definePropert;
        var scopeObject = getScope$1(this, scope);
        var targetScopeObject = getScope$1(this, targetScope);
        var privateName = '_' + name;
        Object.defineProperties(scopeObject, (_Object$definePropert = {}, babelHelpers.defineProperty(_Object$definePropert, privateName, {
          value: scopeObject[name],
          writable: true
        }), babelHelpers.defineProperty(_Object$definePropert, name, {
          enumerable: true,
          get: function get() {
            var local = this[privateName];
            var target = targetScopeObject[targetName];
            if (isObject(local)) {
              return Object.assign({}, target, local);
            }
            return valueOrDefault(local, target);
          },
          set: function set(value) {
            this[privateName] = value;
          }
        }), _Object$definePropert));
      }
    }, {
      key: "apply",
      value: function apply(appliers) {
        var _this = this;
        appliers.forEach(function (apply) {
          return apply(_this);
        });
      }
    }]);
    return Defaults;
  }();
  var defaults = /* #__PURE__ */new Defaults({
    _scriptable: function _scriptable(name) {
      return !name.startsWith('on');
    },
    _indexable: function _indexable(name) {
      return name !== 'events';
    },
    hover: {
      _fallback: 'interaction'
    },
    interaction: {
      _scriptable: false,
      _indexable: false
    }
  }, [applyAnimationsDefaults, applyLayoutsDefaults, applyScaleDefaults]);
  function toFontString(font) {
    if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
      return null;
    }
    return (font.style ? font.style + ' ' : '') + (font.weight ? font.weight + ' ' : '') + font.size + 'px ' + font.family;
  }
  function _measureText(ctx, data, gc, longest, string) {
    var textWidth = data[string];
    if (!textWidth) {
      textWidth = data[string] = ctx.measureText(string).width;
      gc.push(string);
    }
    if (textWidth > longest) {
      longest = textWidth;
    }
    return longest;
  }
  function _longestText(ctx, font, arrayOfThings, cache) {
    cache = cache || {};
    var data = cache.data = cache.data || {};
    var gc = cache.garbageCollect = cache.garbageCollect || [];
    if (cache.font !== font) {
      data = cache.data = {};
      gc = cache.garbageCollect = [];
      cache.font = font;
    }
    ctx.save();
    ctx.font = font;
    var longest = 0;
    var ilen = arrayOfThings.length;
    var i, j, jlen, thing, nestedThing;
    for (i = 0; i < ilen; i++) {
      thing = arrayOfThings[i];
      if (thing !== undefined && thing !== null && isArray(thing) !== true) {
        longest = _measureText(ctx, data, gc, longest, thing);
      } else if (isArray(thing)) {
        for (j = 0, jlen = thing.length; j < jlen; j++) {
          nestedThing = thing[j];
          if (nestedThing !== undefined && nestedThing !== null && !isArray(nestedThing)) {
            longest = _measureText(ctx, data, gc, longest, nestedThing);
          }
        }
      }
    }
    ctx.restore();
    var gcLen = gc.length / 2;
    if (gcLen > arrayOfThings.length) {
      for (i = 0; i < gcLen; i++) {
        delete data[gc[i]];
      }
      gc.splice(0, gcLen);
    }
    return longest;
  }
  function _alignPixel(chart, pixel, width) {
    var devicePixelRatio = chart.currentDevicePixelRatio;
    var halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
    return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
  }
  function clearCanvas(canvas, ctx) {
    ctx = ctx || canvas.getContext('2d');
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  function drawPoint(ctx, options, x, y) {
    drawPointLegend(ctx, options, x, y, null);
  }
  function drawPointLegend(ctx, options, x, y, w) {
    var type, xOffset, yOffset, size, cornerRadius, width, xOffsetW, yOffsetW;
    var style = options.pointStyle;
    var rotation = options.rotation;
    var radius = options.radius;
    var rad = (rotation || 0) * RAD_PER_DEG;
    if (style && babelHelpers["typeof"](style) === 'object') {
      type = style.toString();
      if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rad);
        ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
        ctx.restore();
        return;
      }
    }
    if (isNaN(radius) || radius <= 0) {
      return;
    }
    ctx.beginPath();
    switch (style) {
      default:
        if (w) {
          ctx.ellipse(x, y, w / 2, radius, 0, 0, TAU);
        } else {
          ctx.arc(x, y, radius, 0, TAU);
        }
        ctx.closePath();
        break;
      case 'triangle':
        width = w ? w / 2 : radius;
        ctx.moveTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
        rad += TWO_THIRDS_PI;
        ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
        rad += TWO_THIRDS_PI;
        ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
        ctx.closePath();
        break;
      case 'rectRounded':
        cornerRadius = radius * 0.516;
        size = radius - cornerRadius;
        xOffset = Math.cos(rad + QUARTER_PI) * size;
        xOffsetW = Math.cos(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
        yOffset = Math.sin(rad + QUARTER_PI) * size;
        yOffsetW = Math.sin(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
        ctx.arc(x - xOffsetW, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
        ctx.arc(x + yOffsetW, y - xOffset, cornerRadius, rad - HALF_PI, rad);
        ctx.arc(x + xOffsetW, y + yOffset, cornerRadius, rad, rad + HALF_PI);
        ctx.arc(x - yOffsetW, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
        ctx.closePath();
        break;
      case 'rect':
        if (!rotation) {
          size = Math.SQRT1_2 * radius;
          width = w ? w / 2 : size;
          ctx.rect(x - width, y - size, 2 * width, 2 * size);
          break;
        }
        rad += QUARTER_PI;
      case 'rectRot':
        xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
        ctx.moveTo(x - xOffsetW, y - yOffset);
        ctx.lineTo(x + yOffsetW, y - xOffset);
        ctx.lineTo(x + xOffsetW, y + yOffset);
        ctx.lineTo(x - yOffsetW, y + xOffset);
        ctx.closePath();
        break;
      case 'crossRot':
        rad += QUARTER_PI;
      case 'cross':
        xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
        ctx.moveTo(x - xOffsetW, y - yOffset);
        ctx.lineTo(x + xOffsetW, y + yOffset);
        ctx.moveTo(x + yOffsetW, y - xOffset);
        ctx.lineTo(x - yOffsetW, y + xOffset);
        break;
      case 'star':
        xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
        ctx.moveTo(x - xOffsetW, y - yOffset);
        ctx.lineTo(x + xOffsetW, y + yOffset);
        ctx.moveTo(x + yOffsetW, y - xOffset);
        ctx.lineTo(x - yOffsetW, y + xOffset);
        rad += QUARTER_PI;
        xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
        ctx.moveTo(x - xOffsetW, y - yOffset);
        ctx.lineTo(x + xOffsetW, y + yOffset);
        ctx.moveTo(x + yOffsetW, y - xOffset);
        ctx.lineTo(x - yOffsetW, y + xOffset);
        break;
      case 'line':
        xOffset = w ? w / 2 : Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        ctx.moveTo(x - xOffset, y - yOffset);
        ctx.lineTo(x + xOffset, y + yOffset);
        break;
      case 'dash':
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(rad) * (w ? w / 2 : radius), y + Math.sin(rad) * radius);
        break;
      case false:
        ctx.closePath();
        break;
    }
    ctx.fill();
    if (options.borderWidth > 0) {
      ctx.stroke();
    }
  }
  function _isPointInArea(point, area, margin) {
    margin = margin || 0.5;
    return !area || point && point.x > area.left - margin && point.x < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
  }
  function clipArea(ctx, area) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
    ctx.clip();
  }
  function unclipArea(ctx) {
    ctx.restore();
  }
  function _steppedLineTo(ctx, previous, target, flip, mode) {
    if (!previous) {
      return ctx.lineTo(target.x, target.y);
    }
    if (mode === 'middle') {
      var midpoint = (previous.x + target.x) / 2.0;
      ctx.lineTo(midpoint, previous.y);
      ctx.lineTo(midpoint, target.y);
    } else if (mode === 'after' !== !!flip) {
      ctx.lineTo(previous.x, target.y);
    } else {
      ctx.lineTo(target.x, previous.y);
    }
    ctx.lineTo(target.x, target.y);
  }
  function _bezierCurveTo(ctx, previous, target, flip) {
    if (!previous) {
      return ctx.lineTo(target.x, target.y);
    }
    ctx.bezierCurveTo(flip ? previous.cp1x : previous.cp2x, flip ? previous.cp1y : previous.cp2y, flip ? target.cp2x : target.cp1x, flip ? target.cp2y : target.cp1y, target.x, target.y);
  }
  function renderText(ctx, text, x, y, font) {
    var opts = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var lines = isArray(text) ? text : [text];
    var stroke = opts.strokeWidth > 0 && opts.strokeColor !== '';
    var i, line;
    ctx.save();
    ctx.font = font.string;
    setRenderOpts(ctx, opts);
    for (i = 0; i < lines.length; ++i) {
      line = lines[i];
      if (opts.backdrop) {
        drawBackdrop(ctx, opts.backdrop);
      }
      if (stroke) {
        if (opts.strokeColor) {
          ctx.strokeStyle = opts.strokeColor;
        }
        if (!isNullOrUndef(opts.strokeWidth)) {
          ctx.lineWidth = opts.strokeWidth;
        }
        ctx.strokeText(line, x, y, opts.maxWidth);
      }
      ctx.fillText(line, x, y, opts.maxWidth);
      decorateText(ctx, x, y, line, opts);
      y += font.lineHeight;
    }
    ctx.restore();
  }
  function setRenderOpts(ctx, opts) {
    if (opts.translation) {
      ctx.translate(opts.translation[0], opts.translation[1]);
    }
    if (!isNullOrUndef(opts.rotation)) {
      ctx.rotate(opts.rotation);
    }
    if (opts.color) {
      ctx.fillStyle = opts.color;
    }
    if (opts.textAlign) {
      ctx.textAlign = opts.textAlign;
    }
    if (opts.textBaseline) {
      ctx.textBaseline = opts.textBaseline;
    }
  }
  function decorateText(ctx, x, y, line, opts) {
    if (opts.strikethrough || opts.underline) {
      var metrics = ctx.measureText(line);
      var left = x - metrics.actualBoundingBoxLeft;
      var right = x + metrics.actualBoundingBoxRight;
      var top = y - metrics.actualBoundingBoxAscent;
      var bottom = y + metrics.actualBoundingBoxDescent;
      var yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.beginPath();
      ctx.lineWidth = opts.decorationWidth || 2;
      ctx.moveTo(left, yDecoration);
      ctx.lineTo(right, yDecoration);
      ctx.stroke();
    }
  }
  function drawBackdrop(ctx, opts) {
    var oldColor = ctx.fillStyle;
    ctx.fillStyle = opts.color;
    ctx.fillRect(opts.left, opts.top, opts.width, opts.height);
    ctx.fillStyle = oldColor;
  }
  function addRoundedRectPath(ctx, rect) {
    var x = rect.x,
      y = rect.y,
      w = rect.w,
      h = rect.h,
      radius = rect.radius;
    ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, -HALF_PI, PI, true);
    ctx.lineTo(x, y + h - radius.bottomLeft);
    ctx.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
    ctx.lineTo(x + w - radius.bottomRight, y + h);
    ctx.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
    ctx.lineTo(x + w, y + radius.topRight);
    ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
    ctx.lineTo(x + radius.topLeft, y);
  }
  var LINE_HEIGHT = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/;
  var FONT_STYLE = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
  /**
   * @alias Chart.helpers.options
   * @namespace
   */ /**
      * Converts the given line height `value` in pixels for a specific font `size`.
      * @param value - The lineHeight to parse (eg. 1.6, '14px', '75%', '1.6em').
      * @param size - The font size (in pixels) used to resolve relative `value`.
      * @returns The effective line height in pixels (size * 1.2 if value is invalid).
      * @see https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
      * @since 2.7.0
      */
  function toLineHeight(value, size) {
    var matches = ('' + value).match(LINE_HEIGHT);
    if (!matches || matches[1] === 'normal') {
      return size * 1.2;
    }
    value = +matches[2];
    switch (matches[3]) {
      case 'px':
        return value;
      case '%':
        value /= 100;
        break;
    }
    return size * value;
  }
  var numberOrZero = function numberOrZero(v) {
    return +v || 0;
  };
  function _readValueToProps(value, props) {
    var ret = {};
    var objProps = isObject(props);
    var keys = objProps ? Object.keys(props) : props;
    var read = isObject(value) ? objProps ? function (prop) {
      return valueOrDefault(value[prop], value[props[prop]]);
    } : function (prop) {
      return value[prop];
    } : function () {
      return value;
    };
    var _iterator4 = _createForOfIteratorHelper(keys),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var prop = _step4.value;
        ret[prop] = numberOrZero(read(prop));
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    return ret;
  }
  /**
   * Converts the given value into a TRBL object.
   * @param value - If a number, set the value to all TRBL component,
   *  else, if an object, use defined properties and sets undefined ones to 0.
   *  x / y are shorthands for same value for left/right and top/bottom.
   * @returns The padding values (top, right, bottom, left)
   * @since 3.0.0
   */
  function toTRBL(value) {
    return _readValueToProps(value, {
      top: 'y',
      right: 'x',
      bottom: 'y',
      left: 'x'
    });
  }
  /**
   * Converts the given value into a TRBL corners object (similar with css border-radius).
   * @param value - If a number, set the value to all TRBL corner components,
   *  else, if an object, use defined properties and sets undefined ones to 0.
   * @returns The TRBL corner values (topLeft, topRight, bottomLeft, bottomRight)
   * @since 3.0.0
   */
  function toTRBLCorners(value) {
    return _readValueToProps(value, ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']);
  }
  /**
   * Converts the given value into a padding object with pre-computed width/height.
   * @param value - If a number, set the value to all TRBL component,
   *  else, if an object, use defined properties and sets undefined ones to 0.
   *  x / y are shorthands for same value for left/right and top/bottom.
   * @returns The padding values (top, right, bottom, left, width, height)
   * @since 2.7.0
   */
  function toPadding(value) {
    var obj = toTRBL(value);
    obj.width = obj.left + obj.right;
    obj.height = obj.top + obj.bottom;
    return obj;
  }
  /**
   * Parses font options and returns the font object.
   * @param options - A object that contains font options to be parsed.
   * @param fallback - A object that contains fallback font options.
   * @return The font object.
   * @private
   */
  function toFont(options, fallback) {
    options = options || {};
    fallback = fallback || defaults.font;
    var size = valueOrDefault(options.size, fallback.size);
    if (typeof size === 'string') {
      size = parseInt(size, 10);
    }
    var style = valueOrDefault(options.style, fallback.style);
    if (style && !('' + style).match(FONT_STYLE)) {
      console.warn('Invalid font style specified: "' + style + '"');
      style = undefined;
    }
    var font = {
      family: valueOrDefault(options.family, fallback.family),
      lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
      size: size,
      style: style,
      weight: valueOrDefault(options.weight, fallback.weight),
      string: ''
    };
    font.string = toFontString(font);
    return font;
  }
  /**
   * Evaluates the given `inputs` sequentially and returns the first defined value.
   * @param inputs - An array of values, falling back to the last value.
   * @param context - If defined and the current value is a function, the value
   * is called with `context` as first argument and the result becomes the new input.
   * @param index - If defined and the current value is an array, the value
   * at `index` become the new input.
   * @param info - object to return information about resolution in
   * @param info.cacheable - Will be set to `false` if option is not cacheable.
   * @since 2.7.0
   */
  function resolve(inputs, context, index, info) {
    var cacheable = true;
    var i, ilen, value;
    for (i = 0, ilen = inputs.length; i < ilen; ++i) {
      value = inputs[i];
      if (value === undefined) {
        continue;
      }
      if (context !== undefined && typeof value === 'function') {
        value = value(context);
        cacheable = false;
      }
      if (index !== undefined && isArray(value)) {
        value = value[index % value.length];
        cacheable = false;
      }
      if (value !== undefined) {
        if (info && !cacheable) {
          info.cacheable = false;
        }
        return value;
      }
    }
  }
  /**
   * @param minmax
   * @param grace
   * @param beginAtZero
   * @private
   */
  function _addGrace(minmax, grace, beginAtZero) {
    var min = minmax.min,
      max = minmax.max;
    var change = toDimension(grace, (max - min) / 2);
    var keepZero = function keepZero(value, add) {
      return beginAtZero && value === 0 ? 0 : value + add;
    };
    return {
      min: keepZero(min, -Math.abs(change)),
      max: keepZero(max, change)
    };
  }
  function createContext(parentContext, context) {
    return Object.assign(Object.create(parentContext), context);
  }
  function _createResolver(scopes) {
    var _cache;
    var prefixes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [''];
    var rootScopes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : scopes;
    var fallback = arguments.length > 3 ? arguments[3] : undefined;
    var getTarget = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {
      return scopes[0];
    };
    if (!defined(fallback)) {
      fallback = _resolve('_fallback', scopes);
    }
    var cache = (_cache = {}, babelHelpers.defineProperty(_cache, Symbol.toStringTag, 'Object'), babelHelpers.defineProperty(_cache, "_cacheable", true), babelHelpers.defineProperty(_cache, "_scopes", scopes), babelHelpers.defineProperty(_cache, "_rootScopes", rootScopes), babelHelpers.defineProperty(_cache, "_fallback", fallback), babelHelpers.defineProperty(_cache, "_getTarget", getTarget), babelHelpers.defineProperty(_cache, "override", function override(scope) {
      return _createResolver([scope].concat(babelHelpers.toConsumableArray(scopes)), prefixes, rootScopes, fallback);
    }), _cache);
    return new Proxy(cache, {
      deleteProperty: function deleteProperty(target, prop) {
        delete target[prop];
        delete target._keys;
        delete scopes[0][prop];
        return true;
      },
      get: function get(target, prop) {
        return _cached(target, prop, function () {
          return _resolveWithPrefixes(prop, prefixes, scopes, target);
        });
      },
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, prop) {
        return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
      },
      getPrototypeOf: function getPrototypeOf() {
        return Reflect.getPrototypeOf(scopes[0]);
      },
      has: function has(target, prop) {
        return getKeysFromAllScopes(target).includes(prop);
      },
      ownKeys: function ownKeys(target) {
        return getKeysFromAllScopes(target);
      },
      set: function set(target, prop, value) {
        var storage = target._storage || (target._storage = getTarget());
        target[prop] = storage[prop] = value;
        delete target._keys;
        return true;
      }
    });
  }
  function _attachContext(proxy, context, subProxy, descriptorDefaults) {
    var cache = {
      _cacheable: false,
      _proxy: proxy,
      _context: context,
      _subProxy: subProxy,
      _stack: new Set(),
      _descriptors: _descriptors(proxy, descriptorDefaults),
      setContext: function setContext(ctx) {
        return _attachContext(proxy, ctx, subProxy, descriptorDefaults);
      },
      override: function override(scope) {
        return _attachContext(proxy.override(scope), context, subProxy, descriptorDefaults);
      }
    };
    return new Proxy(cache, {
      deleteProperty: function deleteProperty(target, prop) {
        delete target[prop];
        delete proxy[prop];
        return true;
      },
      get: function get(target, prop, receiver) {
        return _cached(target, prop, function () {
          return _resolveWithContext(target, prop, receiver);
        });
      },
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, prop) {
        return target._descriptors.allKeys ? Reflect.has(proxy, prop) ? {
          enumerable: true,
          configurable: true
        } : undefined : Reflect.getOwnPropertyDescriptor(proxy, prop);
      },
      getPrototypeOf: function getPrototypeOf() {
        return Reflect.getPrototypeOf(proxy);
      },
      has: function has(target, prop) {
        return Reflect.has(proxy, prop);
      },
      ownKeys: function ownKeys() {
        return Reflect.ownKeys(proxy);
      },
      set: function set(target, prop, value) {
        proxy[prop] = value;
        delete target[prop];
        return true;
      }
    });
  }
  function _descriptors(proxy) {
    var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      scriptable: true,
      indexable: true
    };
    var _proxy$_scriptable = proxy._scriptable,
      _scriptable = _proxy$_scriptable === void 0 ? defaults.scriptable : _proxy$_scriptable,
      _proxy$_indexable = proxy._indexable,
      _indexable = _proxy$_indexable === void 0 ? defaults.indexable : _proxy$_indexable,
      _proxy$_allKeys = proxy._allKeys,
      _allKeys = _proxy$_allKeys === void 0 ? defaults.allKeys : _proxy$_allKeys;
    return {
      allKeys: _allKeys,
      scriptable: _scriptable,
      indexable: _indexable,
      isScriptable: isFunction(_scriptable) ? _scriptable : function () {
        return _scriptable;
      },
      isIndexable: isFunction(_indexable) ? _indexable : function () {
        return _indexable;
      }
    };
  }
  var readKey = function readKey(prefix, name) {
    return prefix ? prefix + _capitalize(name) : name;
  };
  var needsSubResolver = function needsSubResolver(prop, value) {
    return isObject(value) && prop !== 'adapters' && (Object.getPrototypeOf(value) === null || value.constructor === Object);
  };
  function _cached(target, prop, resolve) {
    if (Object.prototype.hasOwnProperty.call(target, prop)) {
      return target[prop];
    }
    var value = resolve();
    target[prop] = value;
    return value;
  }
  function _resolveWithContext(target, prop, receiver) {
    var _proxy = target._proxy,
      _context = target._context,
      _subProxy = target._subProxy,
      descriptors = target._descriptors;
    var value = _proxy[prop];
    if (isFunction(value) && descriptors.isScriptable(prop)) {
      value = _resolveScriptable(prop, value, target, receiver);
    }
    if (isArray(value) && value.length) {
      value = _resolveArray(prop, value, target, descriptors.isIndexable);
    }
    if (needsSubResolver(prop, value)) {
      value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors);
    }
    return value;
  }
  function _resolveScriptable(prop, value, target, receiver) {
    var _proxy = target._proxy,
      _context = target._context,
      _subProxy = target._subProxy,
      _stack = target._stack;
    if (_stack.has(prop)) {
      throw new Error('Recursion detected: ' + Array.from(_stack).join('->') + '->' + prop);
    }
    _stack.add(prop);
    value = value(_context, _subProxy || receiver);
    _stack["delete"](prop);
    if (needsSubResolver(prop, value)) {
      value = createSubResolver(_proxy._scopes, _proxy, prop, value);
    }
    return value;
  }
  function _resolveArray(prop, value, target, isIndexable) {
    var _proxy = target._proxy,
      _context = target._context,
      _subProxy = target._subProxy,
      descriptors = target._descriptors;
    if (defined(_context.index) && isIndexable(prop)) {
      value = value[_context.index % value.length];
    } else if (isObject(value[0])) {
      var arr = value;
      var scopes = _proxy._scopes.filter(function (s) {
        return s !== arr;
      });
      value = [];
      var _iterator5 = _createForOfIteratorHelper(arr),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var item = _step5.value;
          var resolver = createSubResolver(scopes, _proxy, prop, item);
          value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors));
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
    return value;
  }
  function resolveFallback(fallback, prop, value) {
    return isFunction(fallback) ? fallback(prop, value) : fallback;
  }
  var getScope = function getScope(key, parent) {
    return key === true ? parent : typeof key === 'string' ? resolveObjectKey(parent, key) : undefined;
  };
  function addScopes(set, parentScopes, key, parentFallback, value) {
    var _iterator6 = _createForOfIteratorHelper(parentScopes),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var parent = _step6.value;
        var scope = getScope(key, parent);
        if (scope) {
          set.add(scope);
          var fallback = resolveFallback(scope._fallback, key, value);
          if (defined(fallback) && fallback !== key && fallback !== parentFallback) {
            return fallback;
          }
        } else if (scope === false && defined(parentFallback) && key !== parentFallback) {
          return null;
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    return false;
  }
  function createSubResolver(parentScopes, resolver, prop, value) {
    var rootScopes = resolver._rootScopes;
    var fallback = resolveFallback(resolver._fallback, prop, value);
    var allScopes = [].concat(babelHelpers.toConsumableArray(parentScopes), babelHelpers.toConsumableArray(rootScopes));
    var set = new Set();
    set.add(value);
    var key = addScopesFromKey(set, allScopes, prop, fallback || prop, value);
    if (key === null) {
      return false;
    }
    if (defined(fallback) && fallback !== prop) {
      key = addScopesFromKey(set, allScopes, fallback, key, value);
      if (key === null) {
        return false;
      }
    }
    return _createResolver(Array.from(set), [''], rootScopes, fallback, function () {
      return subGetTarget(resolver, prop, value);
    });
  }
  function addScopesFromKey(set, allScopes, key, fallback, item) {
    while (key) {
      key = addScopes(set, allScopes, key, fallback, item);
    }
    return key;
  }
  function subGetTarget(resolver, prop, value) {
    var parent = resolver._getTarget();
    if (!(prop in parent)) {
      parent[prop] = {};
    }
    var target = parent[prop];
    if (isArray(target) && isObject(value)) {
      return value;
    }
    return target || {};
  }
  function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
    var value;
    var _iterator7 = _createForOfIteratorHelper(prefixes),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var prefix = _step7.value;
        value = _resolve(readKey(prefix, prop), scopes);
        if (defined(value)) {
          return needsSubResolver(prop, value) ? createSubResolver(scopes, proxy, prop, value) : value;
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
  }
  function _resolve(key, scopes) {
    var _iterator8 = _createForOfIteratorHelper(scopes),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var scope = _step8.value;
        if (!scope) {
          continue;
        }
        var value = scope[key];
        if (defined(value)) {
          return value;
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
  }
  function getKeysFromAllScopes(target) {
    var keys = target._keys;
    if (!keys) {
      keys = target._keys = resolveKeysFromAllScopes(target._scopes);
    }
    return keys;
  }
  function resolveKeysFromAllScopes(scopes) {
    var set = new Set();
    var _iterator9 = _createForOfIteratorHelper(scopes),
      _step9;
    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var scope = _step9.value;
        var _iterator10 = _createForOfIteratorHelper(Object.keys(scope).filter(function (k) {
            return !k.startsWith('_');
          })),
          _step10;
        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var key = _step10.value;
            set.add(key);
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
    return Array.from(set);
  }
  function _parseObjectDataRadialScale(meta, data, start, count) {
    var iScale = meta.iScale;
    var _this$_parsing$key = this._parsing.key,
      key = _this$_parsing$key === void 0 ? 'r' : _this$_parsing$key;
    var parsed = new Array(count);
    var i, ilen, index, item;
    for (i = 0, ilen = count; i < ilen; ++i) {
      index = i + start;
      item = data[index];
      parsed[i] = {
        r: iScale.parse(resolveObjectKey(item, key), index)
      };
    }
    return parsed;
  }
  var EPSILON = Number.EPSILON || 1e-14;
  var getPoint = function getPoint(points, i) {
    return i < points.length && !points[i].skip && points[i];
  };
  var getValueAxis = function getValueAxis(indexAxis) {
    return indexAxis === 'x' ? 'y' : 'x';
  };
  function splineCurve(firstPoint, middlePoint, afterPoint, t) {
    // Props to Rob Spencer at scaled innovation for his post on splining between points
    // http://scaledinnovation.com/analytics/splines/aboutSplines.html
    // This function must also respect "skipped" points
    var previous = firstPoint.skip ? middlePoint : firstPoint;
    var current = middlePoint;
    var next = afterPoint.skip ? middlePoint : afterPoint;
    var d01 = distanceBetweenPoints(current, previous);
    var d12 = distanceBetweenPoints(next, current);
    var s01 = d01 / (d01 + d12);
    var s12 = d12 / (d01 + d12);
    // If all points are the same, s01 & s02 will be inf
    s01 = isNaN(s01) ? 0 : s01;
    s12 = isNaN(s12) ? 0 : s12;
    var fa = t * s01; // scaling factor for triangle Ta
    var fb = t * s12;
    return {
      previous: {
        x: current.x - fa * (next.x - previous.x),
        y: current.y - fa * (next.y - previous.y)
      },
      next: {
        x: current.x + fb * (next.x - previous.x),
        y: current.y + fb * (next.y - previous.y)
      }
    };
  }
  /**
   * Adjust tangents to ensure monotonic properties
   */
  function monotoneAdjust(points, deltaK, mK) {
    var pointsLen = points.length;
    var alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
    var pointAfter = getPoint(points, 0);
    for (var i = 0; i < pointsLen - 1; ++i) {
      pointCurrent = pointAfter;
      pointAfter = getPoint(points, i + 1);
      if (!pointCurrent || !pointAfter) {
        continue;
      }
      if (almostEquals(deltaK[i], 0, EPSILON)) {
        mK[i] = mK[i + 1] = 0;
        continue;
      }
      alphaK = mK[i] / deltaK[i];
      betaK = mK[i + 1] / deltaK[i];
      squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
      if (squaredMagnitude <= 9) {
        continue;
      }
      tauK = 3 / Math.sqrt(squaredMagnitude);
      mK[i] = alphaK * tauK * deltaK[i];
      mK[i + 1] = betaK * tauK * deltaK[i];
    }
  }
  function monotoneCompute(points, mK) {
    var indexAxis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'x';
    var valueAxis = getValueAxis(indexAxis);
    var pointsLen = points.length;
    var delta, pointBefore, pointCurrent;
    var pointAfter = getPoint(points, 0);
    for (var i = 0; i < pointsLen; ++i) {
      pointBefore = pointCurrent;
      pointCurrent = pointAfter;
      pointAfter = getPoint(points, i + 1);
      if (!pointCurrent) {
        continue;
      }
      var iPixel = pointCurrent[indexAxis];
      var vPixel = pointCurrent[valueAxis];
      if (pointBefore) {
        delta = (iPixel - pointBefore[indexAxis]) / 3;
        pointCurrent["cp1".concat(indexAxis)] = iPixel - delta;
        pointCurrent["cp1".concat(valueAxis)] = vPixel - delta * mK[i];
      }
      if (pointAfter) {
        delta = (pointAfter[indexAxis] - iPixel) / 3;
        pointCurrent["cp2".concat(indexAxis)] = iPixel + delta;
        pointCurrent["cp2".concat(valueAxis)] = vPixel + delta * mK[i];
      }
    }
  }
  /**
   * This function calculates BГ©zier control points in a similar way than |splineCurve|,
   * but preserves monotonicity of the provided data and ensures no local extremums are added
   * between the dataset discrete points due to the interpolation.
   * See : https://en.wikipedia.org/wiki/Monotone_cubic_interpolation
   */
  function splineCurveMonotone(points) {
    var indexAxis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'x';
    var valueAxis = getValueAxis(indexAxis);
    var pointsLen = points.length;
    var deltaK = Array(pointsLen).fill(0);
    var mK = Array(pointsLen);
    // Calculate slopes (deltaK) and initialize tangents (mK)
    var i, pointBefore, pointCurrent;
    var pointAfter = getPoint(points, 0);
    for (i = 0; i < pointsLen; ++i) {
      pointBefore = pointCurrent;
      pointCurrent = pointAfter;
      pointAfter = getPoint(points, i + 1);
      if (!pointCurrent) {
        continue;
      }
      if (pointAfter) {
        var slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis];
        // In the case of two points that appear at the same x pixel, slopeDeltaX is 0
        deltaK[i] = slopeDelta !== 0 ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) / slopeDelta : 0;
      }
      mK[i] = !pointBefore ? deltaK[i] : !pointAfter ? deltaK[i - 1] : sign(deltaK[i - 1]) !== sign(deltaK[i]) ? 0 : (deltaK[i - 1] + deltaK[i]) / 2;
    }
    monotoneAdjust(points, deltaK, mK);
    monotoneCompute(points, mK, indexAxis);
  }
  function capControlPoint(pt, min, max) {
    return Math.max(Math.min(pt, max), min);
  }
  function capBezierPoints(points, area) {
    var i, ilen, point, inArea, inAreaPrev;
    var inAreaNext = _isPointInArea(points[0], area);
    for (i = 0, ilen = points.length; i < ilen; ++i) {
      inAreaPrev = inArea;
      inArea = inAreaNext;
      inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area);
      if (!inArea) {
        continue;
      }
      point = points[i];
      if (inAreaPrev) {
        point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
        point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
      }
      if (inAreaNext) {
        point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
        point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
      }
    }
  }
  /**
   * @private
   */
  function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
    var i, ilen, point, controlPoints;
    // Only consider points that are drawn in case the spanGaps option is used
    if (options.spanGaps) {
      points = points.filter(function (pt) {
        return !pt.skip;
      });
    }
    if (options.cubicInterpolationMode === 'monotone') {
      splineCurveMonotone(points, indexAxis);
    } else {
      var prev = loop ? points[points.length - 1] : points[0];
      for (i = 0, ilen = points.length; i < ilen; ++i) {
        point = points[i];
        controlPoints = splineCurve(prev, point, points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen], options.tension);
        point.cp1x = controlPoints.previous.x;
        point.cp1y = controlPoints.previous.y;
        point.cp2x = controlPoints.next.x;
        point.cp2y = controlPoints.next.y;
        prev = point;
      }
    }
    if (options.capBezierPoints) {
      capBezierPoints(points, area);
    }
  }

  /**
   * Note: typedefs are auto-exported, so use a made-up `dom` namespace where
   * necessary to avoid duplicates with `export * from './helpers`; see
   * https://github.com/microsoft/TypeScript/issues/46011
   * @typedef { import('../core/core.controller.js').default } dom.Chart
   * @typedef { import('../../types').ChartEvent } ChartEvent
   */ /**
      * @private
      */
  function _isDomSupported() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
  /**
   * @private
   */
  function _getParentNode(domNode) {
    var parent = domNode.parentNode;
    if (parent && parent.toString() === '[object ShadowRoot]') {
      parent = parent.host;
    }
    return parent;
  }
  /**
   * convert max-width/max-height values that may be percentages into a number
   * @private
   */
  function parseMaxStyle(styleValue, node, parentProperty) {
    var valueInPixels;
    if (typeof styleValue === 'string') {
      valueInPixels = parseInt(styleValue, 10);
      if (styleValue.indexOf('%') !== -1) {
        // percentage * size in dimension
        valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
      }
    } else {
      valueInPixels = styleValue;
    }
    return valueInPixels;
  }
  var getComputedStyle = function getComputedStyle(element) {
    return element.ownerDocument.defaultView.getComputedStyle(element, null);
  };
  function getStyle(el, property) {
    return getComputedStyle(el).getPropertyValue(property);
  }
  var positions = ['top', 'right', 'bottom', 'left'];
  function getPositionedStyle(styles, style, suffix) {
    var result = {};
    suffix = suffix ? '-' + suffix : '';
    for (var i = 0; i < 4; i++) {
      var pos = positions[i];
      result[pos] = parseFloat(styles[style + '-' + pos + suffix]) || 0;
    }
    result.width = result.left + result.right;
    result.height = result.top + result.bottom;
    return result;
  }
  var useOffsetPos = function useOffsetPos(x, y, target) {
    return (x > 0 || y > 0) && (!target || !target.shadowRoot);
  };
  /**
   * @param e
   * @param canvas
   * @returns Canvas position
   */
  function getCanvasPosition(e, canvas) {
    var touches = e.touches;
    var source = touches && touches.length ? touches[0] : e;
    var offsetX = source.offsetX,
      offsetY = source.offsetY;
    var box = false;
    var x, y;
    if (useOffsetPos(offsetX, offsetY, e.target)) {
      x = offsetX;
      y = offsetY;
    } else {
      var rect = canvas.getBoundingClientRect();
      x = source.clientX - rect.left;
      y = source.clientY - rect.top;
      box = true;
    }
    return {
      x: x,
      y: y,
      box: box
    };
  }
  /**
   * Gets an event's x, y coordinates, relative to the chart area
   * @param event
   * @param chart
   * @returns x and y coordinates of the event
   */
  function getRelativePosition(event, chart) {
    if ('native' in event) {
      return event;
    }
    var canvas = chart.canvas,
      currentDevicePixelRatio = chart.currentDevicePixelRatio;
    var style = getComputedStyle(canvas);
    var borderBox = style.boxSizing === 'border-box';
    var paddings = getPositionedStyle(style, 'padding');
    var borders = getPositionedStyle(style, 'border', 'width');
    var _getCanvasPosition = getCanvasPosition(event, canvas),
      x = _getCanvasPosition.x,
      y = _getCanvasPosition.y,
      box = _getCanvasPosition.box;
    var xOffset = paddings.left + (box && borders.left);
    var yOffset = paddings.top + (box && borders.top);
    var width = chart.width,
      height = chart.height;
    if (borderBox) {
      width -= paddings.width + borders.width;
      height -= paddings.height + borders.height;
    }
    return {
      x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
      y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
    };
  }
  function getContainerSize(canvas, width, height) {
    var maxWidth, maxHeight;
    if (width === undefined || height === undefined) {
      var container = _getParentNode(canvas);
      if (!container) {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
      } else {
        var rect = container.getBoundingClientRect(); // this is the border box of the container
        var containerStyle = getComputedStyle(container);
        var containerBorder = getPositionedStyle(containerStyle, 'border', 'width');
        var containerPadding = getPositionedStyle(containerStyle, 'padding');
        width = rect.width - containerPadding.width - containerBorder.width;
        height = rect.height - containerPadding.height - containerBorder.height;
        maxWidth = parseMaxStyle(containerStyle.maxWidth, container, 'clientWidth');
        maxHeight = parseMaxStyle(containerStyle.maxHeight, container, 'clientHeight');
      }
    }
    return {
      width: width,
      height: height,
      maxWidth: maxWidth || INFINITY,
      maxHeight: maxHeight || INFINITY
    };
  }
  var round1 = function round1(v) {
    return Math.round(v * 10) / 10;
  };
  // eslint-disable-next-line complexity
  function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
    var style = getComputedStyle(canvas);
    var margins = getPositionedStyle(style, 'margin');
    var maxWidth = parseMaxStyle(style.maxWidth, canvas, 'clientWidth') || INFINITY;
    var maxHeight = parseMaxStyle(style.maxHeight, canvas, 'clientHeight') || INFINITY;
    var containerSize = getContainerSize(canvas, bbWidth, bbHeight);
    var width = containerSize.width,
      height = containerSize.height;
    if (style.boxSizing === 'content-box') {
      var borders = getPositionedStyle(style, 'border', 'width');
      var paddings = getPositionedStyle(style, 'padding');
      width -= paddings.width + borders.width;
      height -= paddings.height + borders.height;
    }
    width = Math.max(0, width - margins.width);
    height = Math.max(0, aspectRatio ? width / aspectRatio : height - margins.height);
    width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
    height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
    if (width && !height) {
      // https://github.com/chartjs/Chart.js/issues/4659
      // If the canvas has width, but no height, default to aspectRatio of 2 (canvas default)
      height = round1(width / 2);
    }
    var maintainHeight = bbWidth !== undefined || bbHeight !== undefined;
    if (maintainHeight && aspectRatio && containerSize.height && height > containerSize.height) {
      height = containerSize.height;
      width = round1(Math.floor(height * aspectRatio));
    }
    return {
      width: width,
      height: height
    };
  }
  /**
   * @param chart
   * @param forceRatio
   * @param forceStyle
   * @returns True if the canvas context size or transformation has changed.
   */
  function retinaScale(chart, forceRatio, forceStyle) {
    var pixelRatio = forceRatio || 1;
    var deviceHeight = Math.floor(chart.height * pixelRatio);
    var deviceWidth = Math.floor(chart.width * pixelRatio);
    chart.height = Math.floor(chart.height);
    chart.width = Math.floor(chart.width);
    var canvas = chart.canvas;
    // If no style has been set on the canvas, the render size is used as display size,
    // making the chart visually bigger, so let's enforce it to the "correct" values.
    // See https://github.com/chartjs/Chart.js/issues/3575
    if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
      canvas.style.height = "".concat(chart.height, "px");
      canvas.style.width = "".concat(chart.width, "px");
    }
    if (chart.currentDevicePixelRatio !== pixelRatio || canvas.height !== deviceHeight || canvas.width !== deviceWidth) {
      chart.currentDevicePixelRatio = pixelRatio;
      canvas.height = deviceHeight;
      canvas.width = deviceWidth;
      chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      return true;
    }
    return false;
  }
  /**
   * Detects support for options object argument in addEventListener.
   * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
   * @private
   */
  var supportsEventListenerOptions = function () {
    var passiveSupported = false;
    try {
      var options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (e) {
      // continue regardless of error
    }
    return passiveSupported;
  }();
  /**
   * The "used" size is the final value of a dimension property after all calculations have
   * been performed. This method uses the computed style of `element` but returns undefined
   * if the computed style is not expressed in pixels. That can happen in some cases where
   * `element` has a size relative to its parent and this last one is not yet displayed,
   * for example because of `display: none` on a parent node.
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
   * @returns Size in pixels or undefined if unknown.
   */
  function readUsedSize(element, property) {
    var value = getStyle(element, property);
    var matches = value && value.match(/^(\d+)(\.\d+)?px$/);
    return matches ? +matches[1] : undefined;
  }

  /**
   * @private
   */
  function _pointInLine(p1, p2, t, mode) {
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y)
    };
  }
  /**
   * @private
   */
  function _steppedInterpolation(p1, p2, t, mode) {
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: mode === 'middle' ? t < 0.5 ? p1.y : p2.y : mode === 'after' ? t < 1 ? p1.y : p2.y : t > 0 ? p2.y : p1.y
    };
  }
  /**
   * @private
   */
  function _bezierInterpolation(p1, p2, t, mode) {
    var cp1 = {
      x: p1.cp2x,
      y: p1.cp2y
    };
    var cp2 = {
      x: p2.cp1x,
      y: p2.cp1y
    };
    var a = _pointInLine(p1, cp1, t);
    var b = _pointInLine(cp1, cp2, t);
    var c = _pointInLine(cp2, p2, t);
    var d = _pointInLine(a, b, t);
    var e = _pointInLine(b, c, t);
    return _pointInLine(d, e, t);
  }
  var getRightToLeftAdapter = function getRightToLeftAdapter(rectX, width) {
    return {
      x: function x(_x) {
        return rectX + rectX + width - _x;
      },
      setWidth: function setWidth(w) {
        width = w;
      },
      textAlign: function textAlign(align) {
        if (align === 'center') {
          return align;
        }
        return align === 'right' ? 'left' : 'right';
      },
      xPlus: function xPlus(x, value) {
        return x - value;
      },
      leftForLtr: function leftForLtr(x, itemWidth) {
        return x - itemWidth;
      }
    };
  };
  var getLeftToRightAdapter = function getLeftToRightAdapter() {
    return {
      x: function x(_x2) {
        return _x2;
      },
      setWidth: function setWidth(w) {},
      textAlign: function textAlign(align) {
        return align;
      },
      xPlus: function xPlus(x, value) {
        return x + value;
      },
      leftForLtr: function leftForLtr(x, _itemWidth) {
        return x;
      }
    };
  };
  function getRtlAdapter(rtl, rectX, width) {
    return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
  }
  function overrideTextDirection(ctx, direction) {
    var style, original;
    if (direction === 'ltr' || direction === 'rtl') {
      style = ctx.canvas.style;
      original = [style.getPropertyValue('direction'), style.getPropertyPriority('direction')];
      style.setProperty('direction', direction, 'important');
      ctx.prevTextDirection = original;
    }
  }
  function restoreTextDirection(ctx, original) {
    if (original !== undefined) {
      delete ctx.prevTextDirection;
      ctx.canvas.style.setProperty('direction', original[0], original[1]);
    }
  }
  function propertyFn(property) {
    if (property === 'angle') {
      return {
        between: _angleBetween,
        compare: _angleDiff,
        normalize: _normalizeAngle
      };
    }
    return {
      between: _isBetween,
      compare: function compare(a, b) {
        return a - b;
      },
      normalize: function normalize(x) {
        return x;
      }
    };
  }
  function normalizeSegment(_ref) {
    var start = _ref.start,
      end = _ref.end,
      count = _ref.count,
      loop = _ref.loop,
      style = _ref.style;
    return {
      start: start % count,
      end: end % count,
      loop: loop && (end - start + 1) % count === 0,
      style: style
    };
  }
  function getSegment(segment, points, bounds) {
    var property = bounds.property,
      startBound = bounds.start,
      endBound = bounds.end;
    var _propertyFn = propertyFn(property),
      between = _propertyFn.between,
      normalize = _propertyFn.normalize;
    var count = points.length;
    var start = segment.start,
      end = segment.end,
      loop = segment.loop;
    var i, ilen;
    if (loop) {
      start += count;
      end += count;
      for (i = 0, ilen = count; i < ilen; ++i) {
        if (!between(normalize(points[start % count][property]), startBound, endBound)) {
          break;
        }
        start--;
        end--;
      }
      start %= count;
      end %= count;
    }
    if (end < start) {
      end += count;
    }
    return {
      start: start,
      end: end,
      loop: loop,
      style: segment.style
    };
  }
  function _boundSegment(segment, points, bounds) {
    if (!bounds) {
      return [segment];
    }
    var property = bounds.property,
      startBound = bounds.start,
      endBound = bounds.end;
    var count = points.length;
    var _propertyFn2 = propertyFn(property),
      compare = _propertyFn2.compare,
      between = _propertyFn2.between,
      normalize = _propertyFn2.normalize;
    var _getSegment = getSegment(segment, points, bounds),
      start = _getSegment.start,
      end = _getSegment.end,
      loop = _getSegment.loop,
      style = _getSegment.style;
    var result = [];
    var inside = false;
    var subStart = null;
    var value, point, prevValue;
    var startIsBefore = function startIsBefore() {
      return between(startBound, prevValue, value) && compare(startBound, prevValue) !== 0;
    };
    var endIsBefore = function endIsBefore() {
      return compare(endBound, value) === 0 || between(endBound, prevValue, value);
    };
    var shouldStart = function shouldStart() {
      return inside || startIsBefore();
    };
    var shouldStop = function shouldStop() {
      return !inside || endIsBefore();
    };
    for (var i = start, prev = start; i <= end; ++i) {
      point = points[i % count];
      if (point.skip) {
        continue;
      }
      value = normalize(point[property]);
      if (value === prevValue) {
        continue;
      }
      inside = between(value, startBound, endBound);
      if (subStart === null && shouldStart()) {
        subStart = compare(value, startBound) === 0 ? i : prev;
      }
      if (subStart !== null && shouldStop()) {
        result.push(normalizeSegment({
          start: subStart,
          end: i,
          loop: loop,
          count: count,
          style: style
        }));
        subStart = null;
      }
      prev = i;
      prevValue = value;
    }
    if (subStart !== null) {
      result.push(normalizeSegment({
        start: subStart,
        end: end,
        loop: loop,
        count: count,
        style: style
      }));
    }
    return result;
  }
  function _boundSegments(line, bounds) {
    var result = [];
    var segments = line.segments;
    for (var i = 0; i < segments.length; i++) {
      var sub = _boundSegment(segments[i], line.points, bounds);
      if (sub.length) {
        result.push.apply(result, babelHelpers.toConsumableArray(sub));
      }
    }
    return result;
  }
  function findStartAndEnd(points, count, loop, spanGaps) {
    var start = 0;
    var end = count - 1;
    if (loop && !spanGaps) {
      while (start < count && !points[start].skip) {
        start++;
      }
    }
    while (start < count && points[start].skip) {
      start++;
    }
    start %= count;
    if (loop) {
      end += start;
    }
    while (end > start && points[end % count].skip) {
      end--;
    }
    end %= count;
    return {
      start: start,
      end: end
    };
  }
  function solidSegments(points, start, max, loop) {
    var count = points.length;
    var result = [];
    var last = start;
    var prev = points[start];
    var end;
    for (end = start + 1; end <= max; ++end) {
      var cur = points[end % count];
      if (cur.skip || cur.stop) {
        if (!prev.skip) {
          loop = false;
          result.push({
            start: start % count,
            end: (end - 1) % count,
            loop: loop
          });
          start = last = cur.stop ? end : null;
        }
      } else {
        last = end;
        if (prev.skip) {
          start = end;
        }
      }
      prev = cur;
    }
    if (last !== null) {
      result.push({
        start: start % count,
        end: last % count,
        loop: loop
      });
    }
    return result;
  }
  function _computeSegments(line, segmentOptions) {
    var points = line.points;
    var spanGaps = line.options.spanGaps;
    var count = points.length;
    if (!count) {
      return [];
    }
    var loop = !!line._loop;
    var _findStartAndEnd = findStartAndEnd(points, count, loop, spanGaps),
      start = _findStartAndEnd.start,
      end = _findStartAndEnd.end;
    if (spanGaps === true) {
      return splitByStyles(line, [{
        start: start,
        end: end,
        loop: loop
      }], points, segmentOptions);
    }
    var max = end < start ? end + count : end;
    var completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
    return splitByStyles(line, solidSegments(points, start, max, completeLoop), points, segmentOptions);
  }
  function splitByStyles(line, segments, points, segmentOptions) {
    if (!segmentOptions || !segmentOptions.setContext || !points) {
      return segments;
    }
    return doSplitByStyles(line, segments, points, segmentOptions);
  }
  function doSplitByStyles(line, segments, points, segmentOptions) {
    var chartContext = line._chart.getContext();
    var baseStyle = readStyle(line.options);
    var datasetIndex = line._datasetIndex,
      spanGaps = line.options.spanGaps;
    var count = points.length;
    var result = [];
    var prevStyle = baseStyle;
    var start = segments[0].start;
    var i = start;
    function addStyle(s, e, l, st) {
      var dir = spanGaps ? -1 : 1;
      if (s === e) {
        return;
      }
      s += count;
      while (points[s % count].skip) {
        s -= dir;
      }
      while (points[e % count].skip) {
        e += dir;
      }
      if (s % count !== e % count) {
        result.push({
          start: s % count,
          end: e % count,
          loop: l,
          style: st
        });
        prevStyle = st;
        start = e % count;
      }
    }
    var _iterator11 = _createForOfIteratorHelper(segments),
      _step11;
    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var segment = _step11.value;
        start = spanGaps ? start : segment.start;
        var prev = points[start % count];
        var style = void 0;
        for (i = start + 1; i <= segment.end; i++) {
          var pt = points[i % count];
          style = readStyle(segmentOptions.setContext(createContext(chartContext, {
            type: 'segment',
            p0: prev,
            p1: pt,
            p0DataIndex: (i - 1) % count,
            p1DataIndex: i % count,
            datasetIndex: datasetIndex
          })));
          if (styleChanged(style, prevStyle)) {
            addStyle(start, i - 1, segment.loop, prevStyle);
          }
          prev = pt;
          prevStyle = style;
        }
        if (start < i - 1) {
          addStyle(start, i - 1, segment.loop, prevStyle);
        }
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }
    return result;
  }
  function readStyle(options) {
    return {
      backgroundColor: options.backgroundColor,
      borderCapStyle: options.borderCapStyle,
      borderDash: options.borderDash,
      borderDashOffset: options.borderDashOffset,
      borderJoinStyle: options.borderJoinStyle,
      borderWidth: options.borderWidth,
      borderColor: options.borderColor
    };
  }
  function styleChanged(style, prevStyle) {
    return prevStyle && JSON.stringify(style) !== JSON.stringify(prevStyle);
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
  function _objectSpread(target) { for (var i$$1 = 1; i$$1 < arguments.length; i$$1++) { var source = null != arguments[i$$1] ? arguments[i$$1] : {}; i$$1 % 2 ? ownKeys(Object(source), !0).forEach(function (key) { babelHelpers.defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function _createForOfIteratorHelper$1(o$$1, allowArrayLike) { var it = typeof Symbol !== "undefined" && o$$1[Symbol.iterator] || o$$1["@@iterator"]; if (!it) { if (Array.isArray(o$$1) || (it = _unsupportedIterableToArray$1(o$$1)) || allowArrayLike && o$$1 && typeof o$$1.length === "number") { if (it) o$$1 = it; var i$$1 = 0; var F$$1 = function F$$1() {}; return { s: F$$1, n: function n$$1() { if (i$$1 >= o$$1.length) return { done: true }; return { done: false, value: o$$1[i$$1++] }; }, e: function e$$1(_e) { throw _e; }, f: F$$1 }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s$$1() { it = it.call(o$$1); }, n: function n$$1() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e$$1(_e2) { didErr = true; err = _e2; }, f: function f$$1() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
  function _unsupportedIterableToArray$1(o$$1, minLen) { if (!o$$1) return; if (typeof o$$1 === "string") return _arrayLikeToArray$1(o$$1, minLen); var n$$1 = Object.prototype.toString.call(o$$1).slice(8, -1); if (n$$1 === "Object" && o$$1.constructor) n$$1 = o$$1.constructor.name; if (n$$1 === "Map" || n$$1 === "Set") return Array.from(o$$1); if (n$$1 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n$$1)) return _arrayLikeToArray$1(o$$1, minLen); }
  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i$$1 = 0, arr2 = new Array(len); i$$1 < len; i$$1++) arr2[i$$1] = arr[i$$1]; return arr2; }
  var Animator = /*#__PURE__*/function () {
    function Animator() {
      babelHelpers.classCallCheck(this, Animator);
      this._request = null;
      this._charts = new Map();
      this._running = false;
      this._lastDate = undefined;
    }
    babelHelpers.createClass(Animator, [{
      key: "_notify",
      value: function _notify(chart, anims, date, type) {
        var callbacks = anims.listeners[type];
        var numSteps = anims.duration;
        callbacks.forEach(function (fn) {
          return fn({
            chart: chart,
            initial: anims.initial,
            numSteps: numSteps,
            currentStep: Math.min(date - anims.start, numSteps)
          });
        });
      }
    }, {
      key: "_refresh",
      value: function _refresh() {
        var _this = this;
        if (this._request) {
          return;
        }
        this._running = true;
        this._request = requestAnimFrame.call(window, function () {
          _this._update();
          _this._request = null;
          if (_this._running) {
            _this._refresh();
          }
        });
      }
    }, {
      key: "_update",
      value: function _update() {
        var _this2 = this;
        var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Date.now();
        var remaining = 0;
        this._charts.forEach(function (anims, chart) {
          if (!anims.running || !anims.items.length) {
            return;
          }
          var items = anims.items;
          var i$$1 = items.length - 1;
          var draw = false;
          var item;
          for (; i$$1 >= 0; --i$$1) {
            item = items[i$$1];
            if (item._active) {
              if (item._total > anims.duration) {
                anims.duration = item._total;
              }
              item.tick(date);
              draw = true;
            } else {
              items[i$$1] = items[items.length - 1];
              items.pop();
            }
          }
          if (draw) {
            chart.draw();
            _this2._notify(chart, anims, date, 'progress');
          }
          if (!items.length) {
            anims.running = false;
            _this2._notify(chart, anims, date, 'complete');
            anims.initial = false;
          }
          remaining += items.length;
        });
        this._lastDate = date;
        if (remaining === 0) {
          this._running = false;
        }
      }
    }, {
      key: "_getAnims",
      value: function _getAnims(chart) {
        var charts = this._charts;
        var anims = charts.get(chart);
        if (!anims) {
          anims = {
            running: false,
            initial: true,
            items: [],
            listeners: {
              complete: [],
              progress: []
            }
          };
          charts.set(chart, anims);
        }
        return anims;
      }
    }, {
      key: "listen",
      value: function listen(chart, event, cb) {
        this._getAnims(chart).listeners[event].push(cb);
      }
    }, {
      key: "add",
      value: function add(chart, items) {
        var _this$_getAnims$items;
        if (!items || !items.length) {
          return;
        }
        (_this$_getAnims$items = this._getAnims(chart).items).push.apply(_this$_getAnims$items, babelHelpers.toConsumableArray(items));
      }
    }, {
      key: "has",
      value: function has(chart) {
        return this._getAnims(chart).items.length > 0;
      }
    }, {
      key: "start",
      value: function start(chart) {
        var anims = this._charts.get(chart);
        if (!anims) {
          return;
        }
        anims.running = true;
        anims.start = Date.now();
        anims.duration = anims.items.reduce(function (acc, cur) {
          return Math.max(acc, cur._duration);
        }, 0);
        this._refresh();
      }
    }, {
      key: "running",
      value: function running(chart) {
        if (!this._running) {
          return false;
        }
        var anims = this._charts.get(chart);
        if (!anims || !anims.running || !anims.items.length) {
          return false;
        }
        return true;
      }
    }, {
      key: "stop",
      value: function stop(chart) {
        var anims = this._charts.get(chart);
        if (!anims || !anims.items.length) {
          return;
        }
        var items = anims.items;
        var i$$1 = items.length - 1;
        for (; i$$1 >= 0; --i$$1) {
          items[i$$1].cancel();
        }
        anims.items = [];
        this._notify(chart, anims, Date.now(), 'complete');
      }
    }, {
      key: "remove",
      value: function remove(chart) {
        return this._charts["delete"](chart);
      }
    }]);
    return Animator;
  }();
  var animator = /* #__PURE__ */new Animator();
  var transparent = 'transparent';
  var interpolators = {
    "boolean": function boolean(from, to, factor) {
      return factor > 0.5 ? to : from;
    },
    color: function color$$1(from, to, factor) {
      var c0 = color(from || transparent);
      var c1 = c0.valid && color(to || transparent);
      return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to;
    },
    number: function number(from, to, factor) {
      return from + (to - from) * factor;
    }
  };
  var Animation = /*#__PURE__*/function () {
    function Animation(cfg, target, prop, to) {
      babelHelpers.classCallCheck(this, Animation);
      var currentValue = target[prop];
      to = resolve([cfg.to, to, currentValue, cfg.from]);
      var from = resolve([cfg.from, currentValue, to]);
      this._active = true;
      this._fn = cfg.fn || interpolators[cfg.type || babelHelpers["typeof"](from)];
      this._easing = effects[cfg.easing] || effects.linear;
      this._start = Math.floor(Date.now() + (cfg.delay || 0));
      this._duration = this._total = Math.floor(cfg.duration);
      this._loop = !!cfg.loop;
      this._target = target;
      this._prop = prop;
      this._from = from;
      this._to = to;
      this._promises = undefined;
    }
    babelHelpers.createClass(Animation, [{
      key: "active",
      value: function active() {
        return this._active;
      }
    }, {
      key: "update",
      value: function update(cfg, to, date) {
        if (this._active) {
          this._notify(false);
          var currentValue = this._target[this._prop];
          var elapsed = date - this._start;
          var remain = this._duration - elapsed;
          this._start = date;
          this._duration = Math.floor(Math.max(remain, cfg.duration));
          this._total += elapsed;
          this._loop = !!cfg.loop;
          this._to = resolve([cfg.to, to, currentValue, cfg.from]);
          this._from = resolve([cfg.from, currentValue, to]);
        }
      }
    }, {
      key: "cancel",
      value: function cancel() {
        if (this._active) {
          this.tick(Date.now());
          this._active = false;
          this._notify(false);
        }
      }
    }, {
      key: "tick",
      value: function tick(date) {
        var elapsed = date - this._start;
        var duration = this._duration;
        var prop = this._prop;
        var from = this._from;
        var loop = this._loop;
        var to = this._to;
        var factor;
        this._active = from !== to && (loop || elapsed < duration);
        if (!this._active) {
          this._target[prop] = to;
          this._notify(true);
          return;
        }
        if (elapsed < 0) {
          this._target[prop] = from;
          return;
        }
        factor = elapsed / duration % 2;
        factor = loop && factor > 1 ? 2 - factor : factor;
        factor = this._easing(Math.min(1, Math.max(0, factor)));
        this._target[prop] = this._fn(from, to, factor);
      }
    }, {
      key: "wait",
      value: function wait() {
        var promises = this._promises || (this._promises = []);
        return new Promise(function (res, rej) {
          promises.push({
            res: res,
            rej: rej
          });
        });
      }
    }, {
      key: "_notify",
      value: function _notify(resolved) {
        var method = resolved ? 'res' : 'rej';
        var promises = this._promises || [];
        for (var i$$1 = 0; i$$1 < promises.length; i$$1++) {
          promises[i$$1][method]();
        }
      }
    }]);
    return Animation;
  }();
  var Animations = /*#__PURE__*/function () {
    function Animations(chart, config) {
      babelHelpers.classCallCheck(this, Animations);
      this._chart = chart;
      this._properties = new Map();
      this.configure(config);
    }
    babelHelpers.createClass(Animations, [{
      key: "configure",
      value: function configure(config) {
        if (!isObject(config)) {
          return;
        }
        var animationOptions = Object.keys(defaults.animation);
        var animatedProps = this._properties;
        Object.getOwnPropertyNames(config).forEach(function (key) {
          var cfg = config[key];
          if (!isObject(cfg)) {
            return;
          }
          var resolved = {};
          for (var _i = 0, _animationOptions = animationOptions; _i < _animationOptions.length; _i++) {
            var option = _animationOptions[_i];
            resolved[option] = cfg[option];
          }
          (isArray(cfg.properties) && cfg.properties || [key]).forEach(function (prop) {
            if (prop === key || !animatedProps.has(prop)) {
              animatedProps.set(prop, resolved);
            }
          });
        });
      }
    }, {
      key: "_animateOptions",
      value: function _animateOptions(target, values) {
        var newOptions = values.options;
        var options = resolveTargetOptions(target, newOptions);
        if (!options) {
          return [];
        }
        var animations = this._createAnimations(options, newOptions);
        if (newOptions.$shared) {
          awaitAll(target.options.$animations, newOptions).then(function () {
            target.options = newOptions;
          }, function () {});
        }
        return animations;
      }
    }, {
      key: "_createAnimations",
      value: function _createAnimations(target, values) {
        var animatedProps = this._properties;
        var animations = [];
        var running = target.$animations || (target.$animations = {});
        var props = Object.keys(values);
        var date = Date.now();
        var i$$1;
        for (i$$1 = props.length - 1; i$$1 >= 0; --i$$1) {
          var prop = props[i$$1];
          if (prop.charAt(0) === '$') {
            continue;
          }
          if (prop === 'options') {
            animations.push.apply(animations, babelHelpers.toConsumableArray(this._animateOptions(target, values)));
            continue;
          }
          var value = values[prop];
          var animation = running[prop];
          var cfg = animatedProps.get(prop);
          if (animation) {
            if (cfg && animation.active()) {
              animation.update(cfg, value, date);
              continue;
            } else {
              animation.cancel();
            }
          }
          if (!cfg || !cfg.duration) {
            target[prop] = value;
            continue;
          }
          running[prop] = animation = new Animation(cfg, target, prop, value);
          animations.push(animation);
        }
        return animations;
      }
    }, {
      key: "update",
      value: function update(target, values) {
        if (this._properties.size === 0) {
          Object.assign(target, values);
          return;
        }
        var animations = this._createAnimations(target, values);
        if (animations.length) {
          animator.add(this._chart, animations);
          return true;
        }
      }
    }]);
    return Animations;
  }();
  function awaitAll(animations, properties) {
    var running = [];
    var keys = Object.keys(properties);
    for (var i$$1 = 0; i$$1 < keys.length; i$$1++) {
      var anim = animations[keys[i$$1]];
      if (anim && anim.active()) {
        running.push(anim.wait());
      }
    }
    return Promise.all(running);
  }
  function resolveTargetOptions(target, newOptions) {
    if (!newOptions) {
      return;
    }
    var options = target.options;
    if (!options) {
      target.options = newOptions;
      return;
    }
    if (options.$shared) {
      target.options = options = Object.assign({}, options, {
        $shared: false,
        $animations: {}
      });
    }
    return options;
  }
  function scaleClip(scale, allowedOverflow) {
    var opts = scale && scale.options || {};
    var reverse = opts.reverse;
    var min = opts.min === undefined ? allowedOverflow : 0;
    var max = opts.max === undefined ? allowedOverflow : 0;
    return {
      start: reverse ? max : min,
      end: reverse ? min : max
    };
  }
  function defaultClip(xScale, yScale, allowedOverflow) {
    if (allowedOverflow === false) {
      return false;
    }
    var x$$1 = scaleClip(xScale, allowedOverflow);
    var y$$1 = scaleClip(yScale, allowedOverflow);
    return {
      top: y$$1.end,
      right: x$$1.end,
      bottom: y$$1.start,
      left: x$$1.start
    };
  }
  function toClip(value) {
    var t$$1, r$$1, b$$1, l$$1;
    if (isObject(value)) {
      t$$1 = value.top;
      r$$1 = value.right;
      b$$1 = value.bottom;
      l$$1 = value.left;
    } else {
      t$$1 = r$$1 = b$$1 = l$$1 = value;
    }
    return {
      top: t$$1,
      right: r$$1,
      bottom: b$$1,
      left: l$$1,
      disabled: value === false
    };
  }
  function getSortedDatasetIndices(chart, filterVisible) {
    var keys = [];
    var metasets = chart._getSortedDatasetMetas(filterVisible);
    var i$$1, ilen;
    for (i$$1 = 0, ilen = metasets.length; i$$1 < ilen; ++i$$1) {
      keys.push(metasets[i$$1].index);
    }
    return keys;
  }
  function _applyStack(stack, value, dsIndex) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var keys = stack.keys;
    var singleMode = options.mode === 'single';
    var i$$1, ilen, datasetIndex, otherValue;
    if (value === null) {
      return;
    }
    for (i$$1 = 0, ilen = keys.length; i$$1 < ilen; ++i$$1) {
      datasetIndex = +keys[i$$1];
      if (datasetIndex === dsIndex) {
        if (options.all) {
          continue;
        }
        break;
      }
      otherValue = stack.values[datasetIndex];
      if (isNumberFinite(otherValue) && (singleMode || value === 0 || sign(value) === sign(otherValue))) {
        value += otherValue;
      }
    }
    return value;
  }
  function convertObjectDataToArray(data) {
    var keys = Object.keys(data);
    var adata = new Array(keys.length);
    var i$$1, ilen, key;
    for (i$$1 = 0, ilen = keys.length; i$$1 < ilen; ++i$$1) {
      key = keys[i$$1];
      adata[i$$1] = {
        x: key,
        y: data[key]
      };
    }
    return adata;
  }
  function isStacked(scale, meta) {
    var stacked = scale && scale.options.stacked;
    return stacked || stacked === undefined && meta.stack !== undefined;
  }
  function getStackKey(indexScale, valueScale, meta) {
    return "".concat(indexScale.id, ".").concat(valueScale.id, ".").concat(meta.stack || meta.type);
  }
  function getUserBounds(scale) {
    var _scale$getUserBounds = scale.getUserBounds(),
      min = _scale$getUserBounds.min,
      max = _scale$getUserBounds.max,
      minDefined = _scale$getUserBounds.minDefined,
      maxDefined = _scale$getUserBounds.maxDefined;
    return {
      min: minDefined ? min : Number.NEGATIVE_INFINITY,
      max: maxDefined ? max : Number.POSITIVE_INFINITY
    };
  }
  function getOrCreateStack(stacks, stackKey, indexValue) {
    var subStack = stacks[stackKey] || (stacks[stackKey] = {});
    return subStack[indexValue] || (subStack[indexValue] = {});
  }
  function getLastIndexInStack(stack, vScale, positive, type) {
    var _iterator = _createForOfIteratorHelper$1(vScale.getMatchingVisibleMetas(type).reverse()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var meta = _step.value;
        var value = stack[meta.index];
        if (positive && value > 0 || !positive && value < 0) {
          return meta.index;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return null;
  }
  function updateStacks(controller, parsed) {
    var chart = controller.chart,
      meta = controller._cachedMeta;
    var stacks = chart._stacks || (chart._stacks = {});
    var iScale = meta.iScale,
      vScale = meta.vScale,
      datasetIndex = meta.index;
    var iAxis = iScale.axis;
    var vAxis = vScale.axis;
    var key = getStackKey(iScale, vScale, meta);
    var ilen = parsed.length;
    var stack;
    for (var i$$1 = 0; i$$1 < ilen; ++i$$1) {
      var item = parsed[i$$1];
      var _index = item[iAxis],
        value = item[vAxis];
      var itemStacks = item._stacks || (item._stacks = {});
      stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, _index);
      stack[datasetIndex] = value;
      stack._top = getLastIndexInStack(stack, vScale, true, meta.type);
      stack._bottom = getLastIndexInStack(stack, vScale, false, meta.type);
      var visualValues = stack._visualValues || (stack._visualValues = {});
      visualValues[datasetIndex] = value;
    }
  }
  function getFirstScaleId(chart, axis) {
    var scales = chart.scales;
    return Object.keys(scales).filter(function (key) {
      return scales[key].axis === axis;
    }).shift();
  }
  function createDatasetContext(parent, index) {
    return createContext(parent, {
      active: false,
      dataset: undefined,
      datasetIndex: index,
      index: index,
      mode: 'default',
      type: 'dataset'
    });
  }
  function createDataContext(parent, index, element) {
    return createContext(parent, {
      active: false,
      dataIndex: index,
      parsed: undefined,
      raw: undefined,
      element: element,
      index: index,
      mode: 'default',
      type: 'data'
    });
  }
  function clearStacks(meta, items) {
    var datasetIndex = meta.controller.index;
    var axis = meta.vScale && meta.vScale.axis;
    if (!axis) {
      return;
    }
    items = items || meta._parsed;
    var _iterator2 = _createForOfIteratorHelper$1(items),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var parsed = _step2.value;
        var stacks = parsed._stacks;
        if (!stacks || stacks[axis] === undefined || stacks[axis][datasetIndex] === undefined) {
          return;
        }
        delete stacks[axis][datasetIndex];
        if (stacks[axis]._visualValues !== undefined && stacks[axis]._visualValues[datasetIndex] !== undefined) {
          delete stacks[axis]._visualValues[datasetIndex];
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
  var isDirectUpdateMode = function isDirectUpdateMode(mode) {
    return mode === 'reset' || mode === 'none';
  };
  var cloneIfNotShared = function cloneIfNotShared(cached, shared) {
    return shared ? cached : Object.assign({}, cached);
  };
  var createStack = function createStack(canStack, meta, chart) {
    return canStack && !meta.hidden && meta._stacked && {
      keys: getSortedDatasetIndices(chart, true),
      values: null
    };
  };
  var DatasetController = /*#__PURE__*/function () {
    function DatasetController(chart, datasetIndex) {
      babelHelpers.classCallCheck(this, DatasetController);
      this.chart = chart;
      this._ctx = chart.ctx;
      this.index = datasetIndex;
      this._cachedDataOpts = {};
      this._cachedMeta = this.getMeta();
      this._type = this._cachedMeta.type;
      this.options = undefined;
      this._parsing = false;
      this._data = undefined;
      this._objectData = undefined;
      this._sharedOptions = undefined;
      this._drawStart = undefined;
      this._drawCount = undefined;
      this.enableOptionSharing = false;
      this.supportsDecimation = false;
      this.$context = undefined;
      this._syncList = [];
      this.datasetElementType = (this instanceof DatasetController ? this.constructor : void 0).datasetElementType;
      this.dataElementType = (this instanceof DatasetController ? this.constructor : void 0).dataElementType;
      this.initialize();
    }
    babelHelpers.createClass(DatasetController, [{
      key: "initialize",
      value: function initialize() {
        var meta = this._cachedMeta;
        this.configure();
        this.linkScales();
        meta._stacked = isStacked(meta.vScale, meta);
        this.addElements();
        if (this.options.fill && !this.chart.isPluginEnabled('filler')) {
          console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
        }
      }
    }, {
      key: "updateIndex",
      value: function updateIndex(datasetIndex) {
        if (this.index !== datasetIndex) {
          clearStacks(this._cachedMeta);
        }
        this.index = datasetIndex;
      }
    }, {
      key: "linkScales",
      value: function linkScales() {
        var chart = this.chart;
        var meta = this._cachedMeta;
        var dataset = this.getDataset();
        var chooseId = function chooseId(axis, x$$1, y$$1, r$$1) {
          return axis === 'x' ? x$$1 : axis === 'r' ? r$$1 : y$$1;
        };
        var xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, 'x'));
        var yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, 'y'));
        var rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, 'r'));
        var indexAxis = meta.indexAxis;
        var iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
        var vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
        meta.xScale = this.getScaleForId(xid);
        meta.yScale = this.getScaleForId(yid);
        meta.rScale = this.getScaleForId(rid);
        meta.iScale = this.getScaleForId(iid);
        meta.vScale = this.getScaleForId(vid);
      }
    }, {
      key: "getDataset",
      value: function getDataset() {
        return this.chart.data.datasets[this.index];
      }
    }, {
      key: "getMeta",
      value: function getMeta() {
        return this.chart.getDatasetMeta(this.index);
      }
    }, {
      key: "getScaleForId",
      value: function getScaleForId(scaleID) {
        return this.chart.scales[scaleID];
      }
    }, {
      key: "_getOtherScale",
      value: function _getOtherScale(scale) {
        var meta = this._cachedMeta;
        return scale === meta.iScale ? meta.vScale : meta.iScale;
      }
    }, {
      key: "reset",
      value: function reset() {
        this._update('reset');
      }
    }, {
      key: "_destroy",
      value: function _destroy() {
        var meta = this._cachedMeta;
        if (this._data) {
          unlistenArrayEvents(this._data, this);
        }
        if (meta._stacked) {
          clearStacks(meta);
        }
      }
    }, {
      key: "_dataCheck",
      value: function _dataCheck() {
        var dataset = this.getDataset();
        var data = dataset.data || (dataset.data = []);
        var _data = this._data;
        if (isObject(data)) {
          this._data = convertObjectDataToArray(data);
        } else if (_data !== data) {
          if (_data) {
            unlistenArrayEvents(_data, this);
            var meta = this._cachedMeta;
            clearStacks(meta);
            meta._parsed = [];
          }
          if (data && Object.isExtensible(data)) {
            listenArrayEvents(data, this);
          }
          this._syncList = [];
          this._data = data;
        }
      }
    }, {
      key: "addElements",
      value: function addElements() {
        var meta = this._cachedMeta;
        this._dataCheck();
        if (this.datasetElementType) {
          meta.dataset = new this.datasetElementType();
        }
      }
    }, {
      key: "buildOrUpdateElements",
      value: function buildOrUpdateElements(resetNewElements) {
        var meta = this._cachedMeta;
        var dataset = this.getDataset();
        var stackChanged = false;
        this._dataCheck();
        var oldStacked = meta._stacked;
        meta._stacked = isStacked(meta.vScale, meta);
        if (meta.stack !== dataset.stack) {
          stackChanged = true;
          clearStacks(meta);
          meta.stack = dataset.stack;
        }
        this._resyncElements(resetNewElements);
        if (stackChanged || oldStacked !== meta._stacked) {
          updateStacks(this, meta._parsed);
        }
      }
    }, {
      key: "configure",
      value: function configure() {
        var config = this.chart.config;
        var scopeKeys = config.datasetScopeKeys(this._type);
        var scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
        this.options = config.createResolver(scopes, this.getContext());
        this._parsing = this.options.parsing;
        this._cachedDataOpts = {};
      }
    }, {
      key: "parse",
      value: function parse(start, count) {
        var meta = this._cachedMeta,
          data = this._data;
        var iScale = meta.iScale,
          _stacked = meta._stacked;
        var iAxis = iScale.axis;
        var sorted = start === 0 && count === data.length ? true : meta._sorted;
        var prev = start > 0 && meta._parsed[start - 1];
        var i$$1, cur, parsed;
        if (this._parsing === false) {
          meta._parsed = data;
          meta._sorted = true;
          parsed = data;
        } else {
          if (isArray(data[start])) {
            parsed = this.parseArrayData(meta, data, start, count);
          } else if (isObject(data[start])) {
            parsed = this.parseObjectData(meta, data, start, count);
          } else {
            parsed = this.parsePrimitiveData(meta, data, start, count);
          }
          var isNotInOrderComparedToPrev = function isNotInOrderComparedToPrev() {
            return cur[iAxis] === null || prev && cur[iAxis] < prev[iAxis];
          };
          for (i$$1 = 0; i$$1 < count; ++i$$1) {
            meta._parsed[i$$1 + start] = cur = parsed[i$$1];
            if (sorted) {
              if (isNotInOrderComparedToPrev()) {
                sorted = false;
              }
              prev = cur;
            }
          }
          meta._sorted = sorted;
        }
        if (_stacked) {
          updateStacks(this, parsed);
        }
      }
    }, {
      key: "parsePrimitiveData",
      value: function parsePrimitiveData(meta, data, start, count) {
        var iScale = meta.iScale,
          vScale = meta.vScale;
        var iAxis = iScale.axis;
        var vAxis = vScale.axis;
        var labels = iScale.getLabels();
        var singleScale = iScale === vScale;
        var parsed = new Array(count);
        var i$$1, ilen, index;
        for (i$$1 = 0, ilen = count; i$$1 < ilen; ++i$$1) {
          var _parsed$i;
          index = i$$1 + start;
          parsed[i$$1] = (_parsed$i = {}, babelHelpers.defineProperty(_parsed$i, iAxis, singleScale || iScale.parse(labels[index], index)), babelHelpers.defineProperty(_parsed$i, vAxis, vScale.parse(data[index], index)), _parsed$i);
        }
        return parsed;
      }
    }, {
      key: "parseArrayData",
      value: function parseArrayData(meta, data, start, count) {
        var xScale = meta.xScale,
          yScale = meta.yScale;
        var parsed = new Array(count);
        var i$$1, ilen, index, item;
        for (i$$1 = 0, ilen = count; i$$1 < ilen; ++i$$1) {
          index = i$$1 + start;
          item = data[index];
          parsed[i$$1] = {
            x: xScale.parse(item[0], index),
            y: yScale.parse(item[1], index)
          };
        }
        return parsed;
      }
    }, {
      key: "parseObjectData",
      value: function parseObjectData(meta, data, start, count) {
        var xScale = meta.xScale,
          yScale = meta.yScale;
        var _this$_parsing = this._parsing,
          _this$_parsing$xAxisK = _this$_parsing.xAxisKey,
          xAxisKey = _this$_parsing$xAxisK === void 0 ? 'x' : _this$_parsing$xAxisK,
          _this$_parsing$yAxisK = _this$_parsing.yAxisKey,
          yAxisKey = _this$_parsing$yAxisK === void 0 ? 'y' : _this$_parsing$yAxisK;
        var parsed = new Array(count);
        var i$$1, ilen, index, item;
        for (i$$1 = 0, ilen = count; i$$1 < ilen; ++i$$1) {
          index = i$$1 + start;
          item = data[index];
          parsed[i$$1] = {
            x: xScale.parse(resolveObjectKey(item, xAxisKey), index),
            y: yScale.parse(resolveObjectKey(item, yAxisKey), index)
          };
        }
        return parsed;
      }
    }, {
      key: "getParsed",
      value: function getParsed(index) {
        return this._cachedMeta._parsed[index];
      }
    }, {
      key: "getDataElement",
      value: function getDataElement(index) {
        return this._cachedMeta.data[index];
      }
    }, {
      key: "applyStack",
      value: function applyStack(scale, parsed, mode) {
        var chart = this.chart;
        var meta = this._cachedMeta;
        var value = parsed[scale.axis];
        var stack = {
          keys: getSortedDatasetIndices(chart, true),
          values: parsed._stacks[scale.axis]._visualValues
        };
        return _applyStack(stack, value, meta.index, {
          mode: mode
        });
      }
    }, {
      key: "updateRangeFromParsed",
      value: function updateRangeFromParsed(range, scale, parsed, stack) {
        var parsedValue = parsed[scale.axis];
        var value = parsedValue === null ? NaN : parsedValue;
        var values = stack && parsed._stacks[scale.axis];
        if (stack && values) {
          stack.values = values;
          value = _applyStack(stack, parsedValue, this._cachedMeta.index);
        }
        range.min = Math.min(range.min, value);
        range.max = Math.max(range.max, value);
      }
    }, {
      key: "getMinMax",
      value: function getMinMax(scale, canStack) {
        var meta = this._cachedMeta;
        var _parsed = meta._parsed;
        var sorted = meta._sorted && scale === meta.iScale;
        var ilen = _parsed.length;
        var otherScale = this._getOtherScale(scale);
        var stack = createStack(canStack, meta, this.chart);
        var range = {
          min: Number.POSITIVE_INFINITY,
          max: Number.NEGATIVE_INFINITY
        };
        var _getUserBounds = getUserBounds(otherScale),
          otherMin = _getUserBounds.min,
          otherMax = _getUserBounds.max;
        var i$$1, parsed;
        function _skip() {
          parsed = _parsed[i$$1];
          var otherValue = parsed[otherScale.axis];
          return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
        }
        for (i$$1 = 0; i$$1 < ilen; ++i$$1) {
          if (_skip()) {
            continue;
          }
          this.updateRangeFromParsed(range, scale, parsed, stack);
          if (sorted) {
            break;
          }
        }
        if (sorted) {
          for (i$$1 = ilen - 1; i$$1 >= 0; --i$$1) {
            if (_skip()) {
              continue;
            }
            this.updateRangeFromParsed(range, scale, parsed, stack);
            break;
          }
        }
        return range;
      }
    }, {
      key: "getAllParsedValues",
      value: function getAllParsedValues(scale) {
        var parsed = this._cachedMeta._parsed;
        var values = [];
        var i$$1, ilen, value;
        for (i$$1 = 0, ilen = parsed.length; i$$1 < ilen; ++i$$1) {
          value = parsed[i$$1][scale.axis];
          if (isNumberFinite(value)) {
            values.push(value);
          }
        }
        return values;
      }
    }, {
      key: "getMaxOverflow",
      value: function getMaxOverflow() {
        return false;
      }
    }, {
      key: "getLabelAndValue",
      value: function getLabelAndValue(index) {
        var meta = this._cachedMeta;
        var iScale = meta.iScale;
        var vScale = meta.vScale;
        var parsed = this.getParsed(index);
        return {
          label: iScale ? '' + iScale.getLabelForValue(parsed[iScale.axis]) : '',
          value: vScale ? '' + vScale.getLabelForValue(parsed[vScale.axis]) : ''
        };
      }
    }, {
      key: "_update",
      value: function _update(mode) {
        var meta = this._cachedMeta;
        this.update(mode || 'default');
        meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
      }
    }, {
      key: "update",
      value: function update(mode) {}
    }, {
      key: "draw",
      value: function draw() {
        var ctx = this._ctx;
        var chart = this.chart;
        var meta = this._cachedMeta;
        var elements = meta.data || [];
        var area = chart.chartArea;
        var active = [];
        var start = this._drawStart || 0;
        var count = this._drawCount || elements.length - start;
        var drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
        var i$$1;
        if (meta.dataset) {
          meta.dataset.draw(ctx, area, start, count);
        }
        for (i$$1 = start; i$$1 < start + count; ++i$$1) {
          var element = elements[i$$1];
          if (element.hidden) {
            continue;
          }
          if (element.active && drawActiveElementsOnTop) {
            active.push(element);
          } else {
            element.draw(ctx, area);
          }
        }
        for (i$$1 = 0; i$$1 < active.length; ++i$$1) {
          active[i$$1].draw(ctx, area);
        }
      }
    }, {
      key: "getStyle",
      value: function getStyle$$1(index, active) {
        var mode = active ? 'active' : 'default';
        return index === undefined && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index || 0, mode);
      }
    }, {
      key: "getContext",
      value: function getContext(index, active, mode) {
        var dataset = this.getDataset();
        var context;
        if (index >= 0 && index < this._cachedMeta.data.length) {
          var element = this._cachedMeta.data[index];
          context = element.$context || (element.$context = createDataContext(this.getContext(), index, element));
          context.parsed = this.getParsed(index);
          context.raw = dataset.data[index];
          context.index = context.dataIndex = index;
        } else {
          context = this.$context || (this.$context = createDatasetContext(this.chart.getContext(), this.index));
          context.dataset = dataset;
          context.index = context.datasetIndex = this.index;
        }
        context.active = !!active;
        context.mode = mode;
        return context;
      }
    }, {
      key: "resolveDatasetElementOptions",
      value: function resolveDatasetElementOptions(mode) {
        return this._resolveElementOptions(this.datasetElementType.id, mode);
      }
    }, {
      key: "resolveDataElementOptions",
      value: function resolveDataElementOptions(index, mode) {
        return this._resolveElementOptions(this.dataElementType.id, mode, index);
      }
    }, {
      key: "_resolveElementOptions",
      value: function _resolveElementOptions(elementType) {
        var _this3 = this;
        var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
        var index = arguments.length > 2 ? arguments[2] : undefined;
        var active = mode === 'active';
        var cache = this._cachedDataOpts;
        var cacheKey = elementType + '-' + mode;
        var cached = cache[cacheKey];
        var sharing = this.enableOptionSharing && defined(index);
        if (cached) {
          return cloneIfNotShared(cached, sharing);
        }
        var config = this.chart.config;
        var scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
        var prefixes = active ? ["".concat(elementType, "Hover"), 'hover', elementType, ''] : [elementType, ''];
        var scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
        var names = Object.keys(defaults.elements[elementType]);
        var context = function context() {
          return _this3.getContext(index, active, mode);
        };
        var values = config.resolveNamedOptions(scopes, names, context, prefixes);
        if (values.$shared) {
          values.$shared = sharing;
          cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
        }
        return values;
      }
    }, {
      key: "_resolveAnimations",
      value: function _resolveAnimations(index, transition, active) {
        var chart = this.chart;
        var cache = this._cachedDataOpts;
        var cacheKey = "animation-".concat(transition);
        var cached = cache[cacheKey];
        if (cached) {
          return cached;
        }
        var options;
        if (chart.options.animation !== false) {
          var config = this.chart.config;
          var scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
          var scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
          options = config.createResolver(scopes, this.getContext(index, active, transition));
        }
        var animations = new Animations(chart, options && options.animations);
        if (options && options._cacheable) {
          cache[cacheKey] = Object.freeze(animations);
        }
        return animations;
      }
    }, {
      key: "getSharedOptions",
      value: function getSharedOptions(options) {
        if (!options.$shared) {
          return;
        }
        return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
      }
    }, {
      key: "includeOptions",
      value: function includeOptions(mode, sharedOptions) {
        return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
      }
    }, {
      key: "_getSharedOptions",
      value: function _getSharedOptions(start, mode) {
        var firstOpts = this.resolveDataElementOptions(start, mode);
        var previouslySharedOptions = this._sharedOptions;
        var sharedOptions = this.getSharedOptions(firstOpts);
        var includeOptions = this.includeOptions(mode, sharedOptions) || sharedOptions !== previouslySharedOptions;
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
        return {
          sharedOptions: sharedOptions,
          includeOptions: includeOptions
        };
      }
    }, {
      key: "updateElement",
      value: function updateElement(element, index, properties, mode) {
        if (isDirectUpdateMode(mode)) {
          Object.assign(element, properties);
        } else {
          this._resolveAnimations(index, mode).update(element, properties);
        }
      }
    }, {
      key: "updateSharedOptions",
      value: function updateSharedOptions(sharedOptions, mode, newOptions) {
        if (sharedOptions && !isDirectUpdateMode(mode)) {
          this._resolveAnimations(undefined, mode).update(sharedOptions, newOptions);
        }
      }
    }, {
      key: "_setStyle",
      value: function _setStyle(element, index, mode, active) {
        element.active = active;
        var options = this.getStyle(index, active);
        this._resolveAnimations(index, mode, active).update(element, {
          options: !active && this.getSharedOptions(options) || options
        });
      }
    }, {
      key: "removeHoverStyle",
      value: function removeHoverStyle(element, datasetIndex, index) {
        this._setStyle(element, index, 'active', false);
      }
    }, {
      key: "setHoverStyle",
      value: function setHoverStyle(element, datasetIndex, index) {
        this._setStyle(element, index, 'active', true);
      }
    }, {
      key: "_removeDatasetHoverStyle",
      value: function _removeDatasetHoverStyle() {
        var element = this._cachedMeta.dataset;
        if (element) {
          this._setStyle(element, undefined, 'active', false);
        }
      }
    }, {
      key: "_setDatasetHoverStyle",
      value: function _setDatasetHoverStyle() {
        var element = this._cachedMeta.dataset;
        if (element) {
          this._setStyle(element, undefined, 'active', true);
        }
      }
    }, {
      key: "_resyncElements",
      value: function _resyncElements(resetNewElements) {
        var data = this._data;
        var elements = this._cachedMeta.data;
        var _iterator3 = _createForOfIteratorHelper$1(this._syncList),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _step3$value = babelHelpers.slicedToArray(_step3.value, 3),
              method = _step3$value[0],
              arg1 = _step3$value[1],
              arg2 = _step3$value[2];
            this[method](arg1, arg2);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        this._syncList = [];
        var numMeta = elements.length;
        var numData = data.length;
        var count = Math.min(numData, numMeta);
        if (count) {
          this.parse(0, count);
        }
        if (numData > numMeta) {
          this._insertElements(numMeta, numData - numMeta, resetNewElements);
        } else if (numData < numMeta) {
          this._removeElements(numData, numMeta - numData);
        }
      }
    }, {
      key: "_insertElements",
      value: function _insertElements(start, count) {
        var resetNewElements = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var meta = this._cachedMeta;
        var data = meta.data;
        var end = start + count;
        var i$$1;
        var move = function move(arr) {
          arr.length += count;
          for (i$$1 = arr.length - 1; i$$1 >= end; i$$1--) {
            arr[i$$1] = arr[i$$1 - count];
          }
        };
        move(data);
        for (i$$1 = start; i$$1 < end; ++i$$1) {
          data[i$$1] = new this.dataElementType();
        }
        if (this._parsing) {
          move(meta._parsed);
        }
        this.parse(start, count);
        if (resetNewElements) {
          this.updateElements(data, start, count, 'reset');
        }
      }
    }, {
      key: "updateElements",
      value: function updateElements(element, start, count, mode) {}
    }, {
      key: "_removeElements",
      value: function _removeElements(start, count) {
        var meta = this._cachedMeta;
        if (this._parsing) {
          var removed = meta._parsed.splice(start, count);
          if (meta._stacked) {
            clearStacks(meta, removed);
          }
        }
        meta.data.splice(start, count);
      }
    }, {
      key: "_sync",
      value: function _sync(args) {
        if (this._parsing) {
          this._syncList.push(args);
        } else {
          var _args2 = babelHelpers.slicedToArray(args, 3),
            method = _args2[0],
            arg1 = _args2[1],
            arg2 = _args2[2];
          this[method](arg1, arg2);
        }
        this.chart._dataChanges.push([this.index].concat(babelHelpers.toConsumableArray(args)));
      }
    }, {
      key: "_onDataPush",
      value: function _onDataPush() {
        var count = arguments.length;
        this._sync(['_insertElements', this.getDataset().data.length - count, count]);
      }
    }, {
      key: "_onDataPop",
      value: function _onDataPop() {
        this._sync(['_removeElements', this._cachedMeta.data.length - 1, 1]);
      }
    }, {
      key: "_onDataShift",
      value: function _onDataShift() {
        this._sync(['_removeElements', 0, 1]);
      }
    }, {
      key: "_onDataSplice",
      value: function _onDataSplice(start, count) {
        if (count) {
          this._sync(['_removeElements', start, count]);
        }
        var newCount = arguments.length - 2;
        if (newCount) {
          this._sync(['_insertElements', start, newCount]);
        }
      }
    }, {
      key: "_onDataUnshift",
      value: function _onDataUnshift() {
        this._sync(['_insertElements', 0, arguments.length]);
      }
    }]);
    return DatasetController;
  }();
  babelHelpers.defineProperty(DatasetController, "defaults", {});
  babelHelpers.defineProperty(DatasetController, "datasetElementType", null);
  babelHelpers.defineProperty(DatasetController, "dataElementType", null);
  function getAllScaleValues(scale, type) {
    if (!scale._cache.$bar) {
      var visibleMetas = scale.getMatchingVisibleMetas(type);
      var values = [];
      for (var i$$1 = 0, ilen = visibleMetas.length; i$$1 < ilen; i$$1++) {
        values = values.concat(visibleMetas[i$$1].controller.getAllParsedValues(scale));
      }
      scale._cache.$bar = _arrayUnique(values.sort(function (a$$1, b$$1) {
        return a$$1 - b$$1;
      }));
    }
    return scale._cache.$bar;
  }
  function computeMinSampleSize(meta) {
    var scale = meta.iScale;
    var values = getAllScaleValues(scale, meta.type);
    var min = scale._length;
    var i$$1, ilen, curr, prev;
    var updateMinAndPrev = function updateMinAndPrev() {
      if (curr === 32767 || curr === -32768) {
        return;
      }
      if (defined(prev)) {
        min = Math.min(min, Math.abs(curr - prev) || min);
      }
      prev = curr;
    };
    for (i$$1 = 0, ilen = values.length; i$$1 < ilen; ++i$$1) {
      curr = scale.getPixelForValue(values[i$$1]);
      updateMinAndPrev();
    }
    prev = undefined;
    for (i$$1 = 0, ilen = scale.ticks.length; i$$1 < ilen; ++i$$1) {
      curr = scale.getPixelForTick(i$$1);
      updateMinAndPrev();
    }
    return min;
  }
  function computeFitCategoryTraits(index, ruler, options, stackCount) {
    var thickness = options.barThickness;
    var size, ratio;
    if (isNullOrUndef(thickness)) {
      size = ruler.min * options.categoryPercentage;
      ratio = options.barPercentage;
    } else {
      size = thickness * stackCount;
      ratio = 1;
    }
    return {
      chunk: size / stackCount,
      ratio: ratio,
      start: ruler.pixels[index] - size / 2
    };
  }
  function computeFlexCategoryTraits(index, ruler, options, stackCount) {
    var pixels = ruler.pixels;
    var curr = pixels[index];
    var prev = index > 0 ? pixels[index - 1] : null;
    var next = index < pixels.length - 1 ? pixels[index + 1] : null;
    var percent = options.categoryPercentage;
    if (prev === null) {
      prev = curr - (next === null ? ruler.end - ruler.start : next - curr);
    }
    if (next === null) {
      next = curr + curr - prev;
    }
    var start = curr - (curr - Math.min(prev, next)) / 2 * percent;
    var size = Math.abs(next - prev) / 2 * percent;
    return {
      chunk: size / stackCount,
      ratio: options.barPercentage,
      start: start
    };
  }
  function parseFloatBar(entry, item, vScale, i$$1) {
    var startValue = vScale.parse(entry[0], i$$1);
    var endValue = vScale.parse(entry[1], i$$1);
    var min = Math.min(startValue, endValue);
    var max = Math.max(startValue, endValue);
    var barStart = min;
    var barEnd = max;
    if (Math.abs(min) > Math.abs(max)) {
      barStart = max;
      barEnd = min;
    }
    item[vScale.axis] = barEnd;
    item._custom = {
      barStart: barStart,
      barEnd: barEnd,
      start: startValue,
      end: endValue,
      min: min,
      max: max
    };
  }
  function parseValue(entry, item, vScale, i$$1) {
    if (isArray(entry)) {
      parseFloatBar(entry, item, vScale, i$$1);
    } else {
      item[vScale.axis] = vScale.parse(entry, i$$1);
    }
    return item;
  }
  function parseArrayOrPrimitive(meta, data, start, count) {
    var iScale = meta.iScale;
    var vScale = meta.vScale;
    var labels = iScale.getLabels();
    var singleScale = iScale === vScale;
    var parsed = [];
    var i$$1, ilen, item, entry;
    for (i$$1 = start, ilen = start + count; i$$1 < ilen; ++i$$1) {
      entry = data[i$$1];
      item = {};
      item[iScale.axis] = singleScale || iScale.parse(labels[i$$1], i$$1);
      parsed.push(parseValue(entry, item, vScale, i$$1));
    }
    return parsed;
  }
  function isFloatBar(custom) {
    return custom && custom.barStart !== undefined && custom.barEnd !== undefined;
  }
  function barSign(size, vScale, actualBase) {
    if (size !== 0) {
      return sign(size);
    }
    return (vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1);
  }
  function borderProps(properties) {
    var reverse, start, end, top, bottom;
    if (properties.horizontal) {
      reverse = properties.base > properties.x;
      start = 'left';
      end = 'right';
    } else {
      reverse = properties.base < properties.y;
      start = 'bottom';
      end = 'top';
    }
    if (reverse) {
      top = 'end';
      bottom = 'start';
    } else {
      top = 'start';
      bottom = 'end';
    }
    return {
      start: start,
      end: end,
      reverse: reverse,
      top: top,
      bottom: bottom
    };
  }
  function setBorderSkipped(properties, options, stack, index) {
    var edge = options.borderSkipped;
    var res = {};
    if (!edge) {
      properties.borderSkipped = res;
      return;
    }
    if (edge === true) {
      properties.borderSkipped = {
        top: true,
        right: true,
        bottom: true,
        left: true
      };
      return;
    }
    var _borderProps = borderProps(properties),
      start = _borderProps.start,
      end = _borderProps.end,
      reverse = _borderProps.reverse,
      top = _borderProps.top,
      bottom = _borderProps.bottom;
    if (edge === 'middle' && stack) {
      properties.enableBorderRadius = true;
      if ((stack._top || 0) === index) {
        edge = top;
      } else if ((stack._bottom || 0) === index) {
        edge = bottom;
      } else {
        res[parseEdge(bottom, start, end, reverse)] = true;
        edge = top;
      }
    }
    res[parseEdge(edge, start, end, reverse)] = true;
    properties.borderSkipped = res;
  }
  function parseEdge(edge, a$$1, b$$1, reverse) {
    if (reverse) {
      edge = swap(edge, a$$1, b$$1);
      edge = startEnd(edge, b$$1, a$$1);
    } else {
      edge = startEnd(edge, a$$1, b$$1);
    }
    return edge;
  }
  function swap(orig, v1, v2) {
    return orig === v1 ? v2 : orig === v2 ? v1 : orig;
  }
  function startEnd(v$$1, start, end) {
    return v$$1 === 'start' ? start : v$$1 === 'end' ? end : v$$1;
  }
  function setInflateAmount(properties, _ref, ratio) {
    var inflateAmount = _ref.inflateAmount;
    properties.inflateAmount = inflateAmount === 'auto' ? ratio === 1 ? 0.33 : 0 : inflateAmount;
  }
  var BarController = /*#__PURE__*/function (_DatasetController) {
    babelHelpers.inherits(BarController, _DatasetController);
    function BarController() {
      babelHelpers.classCallCheck(this, BarController);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(BarController).apply(this, arguments));
    }
    babelHelpers.createClass(BarController, [{
      key: "parsePrimitiveData",
      value: function parsePrimitiveData(meta, data, start, count) {
        return parseArrayOrPrimitive(meta, data, start, count);
      }
    }, {
      key: "parseArrayData",
      value: function parseArrayData(meta, data, start, count) {
        return parseArrayOrPrimitive(meta, data, start, count);
      }
    }, {
      key: "parseObjectData",
      value: function parseObjectData(meta, data, start, count) {
        var iScale = meta.iScale,
          vScale = meta.vScale;
        var _this$_parsing2 = this._parsing,
          _this$_parsing2$xAxis = _this$_parsing2.xAxisKey,
          xAxisKey = _this$_parsing2$xAxis === void 0 ? 'x' : _this$_parsing2$xAxis,
          _this$_parsing2$yAxis = _this$_parsing2.yAxisKey,
          yAxisKey = _this$_parsing2$yAxis === void 0 ? 'y' : _this$_parsing2$yAxis;
        var iAxisKey = iScale.axis === 'x' ? xAxisKey : yAxisKey;
        var vAxisKey = vScale.axis === 'x' ? xAxisKey : yAxisKey;
        var parsed = [];
        var i$$1, ilen, item, obj;
        for (i$$1 = start, ilen = start + count; i$$1 < ilen; ++i$$1) {
          obj = data[i$$1];
          item = {};
          item[iScale.axis] = iScale.parse(resolveObjectKey(obj, iAxisKey), i$$1);
          parsed.push(parseValue(resolveObjectKey(obj, vAxisKey), item, vScale, i$$1));
        }
        return parsed;
      }
    }, {
      key: "updateRangeFromParsed",
      value: function updateRangeFromParsed(range, scale, parsed, stack) {
        babelHelpers.get(babelHelpers.getPrototypeOf(BarController.prototype), "updateRangeFromParsed", this).call(this, range, scale, parsed, stack);
        var custom = parsed._custom;
        if (custom && scale === this._cachedMeta.vScale) {
          range.min = Math.min(range.min, custom.min);
          range.max = Math.max(range.max, custom.max);
        }
      }
    }, {
      key: "getMaxOverflow",
      value: function getMaxOverflow() {
        return 0;
      }
    }, {
      key: "getLabelAndValue",
      value: function getLabelAndValue(index) {
        var meta = this._cachedMeta;
        var iScale = meta.iScale,
          vScale = meta.vScale;
        var parsed = this.getParsed(index);
        var custom = parsed._custom;
        var value = isFloatBar(custom) ? '[' + custom.start + ', ' + custom.end + ']' : '' + vScale.getLabelForValue(parsed[vScale.axis]);
        return {
          label: '' + iScale.getLabelForValue(parsed[iScale.axis]),
          value: value
        };
      }
    }, {
      key: "initialize",
      value: function initialize() {
        this.enableOptionSharing = true;
        babelHelpers.get(babelHelpers.getPrototypeOf(BarController.prototype), "initialize", this).call(this);
        var meta = this._cachedMeta;
        meta.stack = this.getDataset().stack;
      }
    }, {
      key: "update",
      value: function update(mode) {
        var meta = this._cachedMeta;
        this.updateElements(meta.data, 0, meta.data.length, mode);
      }
    }, {
      key: "updateElements",
      value: function updateElements(bars, start, count, mode) {
        var reset = mode === 'reset';
        var index = this.index,
          vScale = this._cachedMeta.vScale;
        var base = vScale.getBasePixel();
        var horizontal = vScale.isHorizontal();
        var ruler = this._getRuler();
        var _this$_getSharedOptio = this._getSharedOptions(start, mode),
          sharedOptions = _this$_getSharedOptio.sharedOptions,
          includeOptions = _this$_getSharedOptio.includeOptions;
        for (var i$$1 = start; i$$1 < start + count; i$$1++) {
          var parsed = this.getParsed(i$$1);
          var vpixels = reset || isNullOrUndef(parsed[vScale.axis]) ? {
            base: base,
            head: base
          } : this._calculateBarValuePixels(i$$1);
          var ipixels = this._calculateBarIndexPixels(i$$1, ruler);
          var stack = (parsed._stacks || {})[vScale.axis];
          var properties = {
            horizontal: horizontal,
            base: vpixels.base,
            enableBorderRadius: !stack || isFloatBar(parsed._custom) || index === stack._top || index === stack._bottom,
            x: horizontal ? vpixels.head : ipixels.center,
            y: horizontal ? ipixels.center : vpixels.head,
            height: horizontal ? ipixels.size : Math.abs(vpixels.size),
            width: horizontal ? Math.abs(vpixels.size) : ipixels.size
          };
          if (includeOptions) {
            properties.options = sharedOptions || this.resolveDataElementOptions(i$$1, bars[i$$1].active ? 'active' : mode);
          }
          var options = properties.options || bars[i$$1].options;
          setBorderSkipped(properties, options, stack, index);
          setInflateAmount(properties, options, ruler.ratio);
          this.updateElement(bars[i$$1], i$$1, properties, mode);
        }
      }
    }, {
      key: "_getStacks",
      value: function _getStacks(last, dataIndex) {
        var iScale = this._cachedMeta.iScale;
        var metasets = iScale.getMatchingVisibleMetas(this._type).filter(function (meta) {
          return meta.controller.options.grouped;
        });
        var stacked = iScale.options.stacked;
        var stacks = [];
        var skipNull = function skipNull(meta) {
          var parsed = meta.controller.getParsed(dataIndex);
          var val = parsed && parsed[meta.vScale.axis];
          if (isNullOrUndef(val) || isNaN(val)) {
            return true;
          }
        };
        var _iterator4 = _createForOfIteratorHelper$1(metasets),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var meta = _step4.value;
            if (dataIndex !== undefined && skipNull(meta)) {
              continue;
            }
            if (stacked === false || stacks.indexOf(meta.stack) === -1 || stacked === undefined && meta.stack === undefined) {
              stacks.push(meta.stack);
            }
            if (meta.index === last) {
              break;
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
        if (!stacks.length) {
          stacks.push(undefined);
        }
        return stacks;
      }
    }, {
      key: "_getStackCount",
      value: function _getStackCount(index) {
        return this._getStacks(undefined, index).length;
      }
    }, {
      key: "_getStackIndex",
      value: function _getStackIndex(datasetIndex, name, dataIndex) {
        var stacks = this._getStacks(datasetIndex, dataIndex);
        var index = name !== undefined ? stacks.indexOf(name) : -1;
        return index === -1 ? stacks.length - 1 : index;
      }
    }, {
      key: "_getRuler",
      value: function _getRuler() {
        var opts = this.options;
        var meta = this._cachedMeta;
        var iScale = meta.iScale;
        var pixels = [];
        var i$$1, ilen;
        for (i$$1 = 0, ilen = meta.data.length; i$$1 < ilen; ++i$$1) {
          pixels.push(iScale.getPixelForValue(this.getParsed(i$$1)[iScale.axis], i$$1));
        }
        var barThickness = opts.barThickness;
        var min = barThickness || computeMinSampleSize(meta);
        return {
          min: min,
          pixels: pixels,
          start: iScale._startPixel,
          end: iScale._endPixel,
          stackCount: this._getStackCount(),
          scale: iScale,
          grouped: opts.grouped,
          ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
        };
      }
    }, {
      key: "_calculateBarValuePixels",
      value: function _calculateBarValuePixels(index) {
        var _this$_cachedMeta = this._cachedMeta,
          vScale = _this$_cachedMeta.vScale,
          _stacked = _this$_cachedMeta._stacked,
          datasetIndex = _this$_cachedMeta.index,
          _this$options = this.options,
          baseValue = _this$options.base,
          minBarLength = _this$options.minBarLength;
        var actualBase = baseValue || 0;
        var parsed = this.getParsed(index);
        var custom = parsed._custom;
        var floating = isFloatBar(custom);
        var value = parsed[vScale.axis];
        var start = 0;
        var length = _stacked ? this.applyStack(vScale, parsed, _stacked) : value;
        var head, size;
        if (length !== value) {
          start = length - value;
          length = value;
        }
        if (floating) {
          value = custom.barStart;
          length = custom.barEnd - custom.barStart;
          if (value !== 0 && sign(value) !== sign(custom.barEnd)) {
            start = 0;
          }
          start += value;
        }
        var startValue = !isNullOrUndef(baseValue) && !floating ? baseValue : start;
        var base = vScale.getPixelForValue(startValue);
        if (this.chart.getDataVisibility(index)) {
          head = vScale.getPixelForValue(start + length);
        } else {
          head = base;
        }
        size = head - base;
        if (Math.abs(size) < minBarLength) {
          size = barSign(size, vScale, actualBase) * minBarLength;
          if (value === actualBase) {
            base -= size / 2;
          }
          var startPixel = vScale.getPixelForDecimal(0);
          var endPixel = vScale.getPixelForDecimal(1);
          var min = Math.min(startPixel, endPixel);
          var max = Math.max(startPixel, endPixel);
          base = Math.max(Math.min(base, max), min);
          head = base + size;
          if (_stacked && !floating) {
            parsed._stacks[vScale.axis]._visualValues[datasetIndex] = vScale.getValueForPixel(head) - vScale.getValueForPixel(base);
          }
        }
        if (base === vScale.getPixelForValue(actualBase)) {
          var halfGrid = sign(size) * vScale.getLineWidthForValue(actualBase) / 2;
          base += halfGrid;
          size -= halfGrid;
        }
        return {
          size: size,
          base: base,
          head: head,
          center: head + size / 2
        };
      }
    }, {
      key: "_calculateBarIndexPixels",
      value: function _calculateBarIndexPixels(index, ruler) {
        var scale = ruler.scale;
        var options = this.options;
        var skipNull = options.skipNull;
        var maxBarThickness = valueOrDefault(options.maxBarThickness, Infinity);
        var center, size;
        if (ruler.grouped) {
          var stackCount = skipNull ? this._getStackCount(index) : ruler.stackCount;
          var range = options.barThickness === 'flex' ? computeFlexCategoryTraits(index, ruler, options, stackCount) : computeFitCategoryTraits(index, ruler, options, stackCount);
          var stackIndex = this._getStackIndex(this.index, this._cachedMeta.stack, skipNull ? index : undefined);
          center = range.start + range.chunk * stackIndex + range.chunk / 2;
          size = Math.min(maxBarThickness, range.chunk * range.ratio);
        } else {
          center = scale.getPixelForValue(this.getParsed(index)[scale.axis], index);
          size = Math.min(maxBarThickness, ruler.min * ruler.ratio);
        }
        return {
          base: center - size / 2,
          head: center + size / 2,
          center: center,
          size: size
        };
      }
    }, {
      key: "draw",
      value: function draw() {
        var meta = this._cachedMeta;
        var vScale = meta.vScale;
        var rects = meta.data;
        var ilen = rects.length;
        var i$$1 = 0;
        for (; i$$1 < ilen; ++i$$1) {
          if (this.getParsed(i$$1)[vScale.axis] !== null) {
            rects[i$$1].draw(this._ctx);
          }
        }
      }
    }]);
    return BarController;
  }(DatasetController);
  babelHelpers.defineProperty(BarController, "id", 'bar');
  babelHelpers.defineProperty(BarController, "defaults", {
    datasetElementType: false,
    dataElementType: 'bar',
    categoryPercentage: 0.8,
    barPercentage: 0.9,
    grouped: true,
    animations: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'base', 'width', 'height']
      }
    }
  });
  babelHelpers.defineProperty(BarController, "overrides", {
    scales: {
      _index_: {
        type: 'category',
        offset: true,
        grid: {
          offset: true
        }
      },
      _value_: {
        type: 'linear',
        beginAtZero: true
      }
    }
  });
  var BubbleController = /*#__PURE__*/function (_DatasetController2) {
    babelHelpers.inherits(BubbleController, _DatasetController2);
    function BubbleController() {
      babelHelpers.classCallCheck(this, BubbleController);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(BubbleController).apply(this, arguments));
    }
    babelHelpers.createClass(BubbleController, [{
      key: "initialize",
      value: function initialize() {
        this.enableOptionSharing = true;
        babelHelpers.get(babelHelpers.getPrototypeOf(BubbleController.prototype), "initialize", this).call(this);
      }
    }, {
      key: "parsePrimitiveData",
      value: function parsePrimitiveData(meta, data, start, count) {
        var parsed = babelHelpers.get(babelHelpers.getPrototypeOf(BubbleController.prototype), "parsePrimitiveData", this).call(this, meta, data, start, count);
        for (var i$$1 = 0; i$$1 < parsed.length; i$$1++) {
          parsed[i$$1]._custom = this.resolveDataElementOptions(i$$1 + start).radius;
        }
        return parsed;
      }
    }, {
      key: "parseArrayData",
      value: function parseArrayData(meta, data, start, count) {
        var parsed = babelHelpers.get(babelHelpers.getPrototypeOf(BubbleController.prototype), "parseArrayData", this).call(this, meta, data, start, count);
        for (var i$$1 = 0; i$$1 < parsed.length; i$$1++) {
          var item = data[start + i$$1];
          parsed[i$$1]._custom = valueOrDefault(item[2], this.resolveDataElementOptions(i$$1 + start).radius);
        }
        return parsed;
      }
    }, {
      key: "parseObjectData",
      value: function parseObjectData(meta, data, start, count) {
        var parsed = babelHelpers.get(babelHelpers.getPrototypeOf(BubbleController.prototype), "parseObjectData", this).call(this, meta, data, start, count);
        for (var i$$1 = 0; i$$1 < parsed.length; i$$1++) {
          var item = data[start + i$$1];
          parsed[i$$1]._custom = valueOrDefault(item && item.r && +item.r, this.resolveDataElementOptions(i$$1 + start).radius);
        }
        return parsed;
      }
    }, {
      key: "getMaxOverflow",
      value: function getMaxOverflow() {
        var data = this._cachedMeta.data;
        var max = 0;
        for (var i$$1 = data.length - 1; i$$1 >= 0; --i$$1) {
          max = Math.max(max, data[i$$1].size(this.resolveDataElementOptions(i$$1)) / 2);
        }
        return max > 0 && max;
      }
    }, {
      key: "getLabelAndValue",
      value: function getLabelAndValue(index) {
        var meta = this._cachedMeta;
        var labels = this.chart.data.labels || [];
        var xScale = meta.xScale,
          yScale = meta.yScale;
        var parsed = this.getParsed(index);
        var x$$1 = xScale.getLabelForValue(parsed.x);
        var y$$1 = yScale.getLabelForValue(parsed.y);
        var r$$1 = parsed._custom;
        return {
          label: labels[index] || '',
          value: '(' + x$$1 + ', ' + y$$1 + (r$$1 ? ', ' + r$$1 : '') + ')'
        };
      }
    }, {
      key: "update",
      value: function update(mode) {
        var points = this._cachedMeta.data;
        this.updateElements(points, 0, points.length, mode);
      }
    }, {
      key: "updateElements",
      value: function updateElements(points, start, count, mode) {
        var reset = mode === 'reset';
        var _this$_cachedMeta2 = this._cachedMeta,
          iScale = _this$_cachedMeta2.iScale,
          vScale = _this$_cachedMeta2.vScale;
        var _this$_getSharedOptio2 = this._getSharedOptions(start, mode),
          sharedOptions = _this$_getSharedOptio2.sharedOptions,
          includeOptions = _this$_getSharedOptio2.includeOptions;
        var iAxis = iScale.axis;
        var vAxis = vScale.axis;
        for (var i$$1 = start; i$$1 < start + count; i$$1++) {
          var point = points[i$$1];
          var parsed = !reset && this.getParsed(i$$1);
          var properties = {};
          var iPixel = properties[iAxis] = reset ? iScale.getPixelForDecimal(0.5) : iScale.getPixelForValue(parsed[iAxis]);
          var vPixel = properties[vAxis] = reset ? vScale.getBasePixel() : vScale.getPixelForValue(parsed[vAxis]);
          properties.skip = isNaN(iPixel) || isNaN(vPixel);
          if (includeOptions) {
            properties.options = sharedOptions || this.resolveDataElementOptions(i$$1, point.active ? 'active' : mode);
            if (reset) {
              properties.options.radius = 0;
            }
          }
          this.updateElement(point, i$$1, properties, mode);
        }
      }
    }, {
      key: "resolveDataElementOptions",
      value: function resolveDataElementOptions(index, mode) {
        var parsed = this.getParsed(index);
        var values = babelHelpers.get(babelHelpers.getPrototypeOf(BubbleController.prototype), "resolveDataElementOptions", this).call(this, index, mode);
        if (values.$shared) {
          values = Object.assign({}, values, {
            $shared: false
          });
        }
        var radius = values.radius;
        if (mode !== 'active') {
          values.radius = 0;
        }
        values.radius += valueOrDefault(parsed && parsed._custom, radius);
        return values;
      }
    }]);
    return BubbleController;
  }(DatasetController);
  babelHelpers.defineProperty(BubbleController, "id", 'bubble');
  babelHelpers.defineProperty(BubbleController, "defaults", {
    datasetElementType: false,
    dataElementType: 'point',
    animations: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'borderWidth', 'radius']
      }
    }
  });
  babelHelpers.defineProperty(BubbleController, "overrides", {
    scales: {
      x: {
        type: 'linear'
      },
      y: {
        type: 'linear'
      }
    }
  });
  function getRatioAndOffset(rotation, circumference, cutout) {
    var ratioX = 1;
    var ratioY = 1;
    var offsetX = 0;
    var offsetY = 0;
    if (circumference < TAU) {
      var startAngle = rotation;
      var endAngle = startAngle + circumference;
      var startX = Math.cos(startAngle);
      var startY = Math.sin(startAngle);
      var endX = Math.cos(endAngle);
      var endY = Math.sin(endAngle);
      var calcMax = function calcMax(angle, a$$1, b$$1) {
        return _angleBetween(angle, startAngle, endAngle, true) ? 1 : Math.max(a$$1, a$$1 * cutout, b$$1, b$$1 * cutout);
      };
      var calcMin = function calcMin(angle, a$$1, b$$1) {
        return _angleBetween(angle, startAngle, endAngle, true) ? -1 : Math.min(a$$1, a$$1 * cutout, b$$1, b$$1 * cutout);
      };
      var maxX = calcMax(0, startX, endX);
      var maxY = calcMax(HALF_PI, startY, endY);
      var minX = calcMin(PI, startX, endX);
      var minY = calcMin(PI + HALF_PI, startY, endY);
      ratioX = (maxX - minX) / 2;
      ratioY = (maxY - minY) / 2;
      offsetX = -(maxX + minX) / 2;
      offsetY = -(maxY + minY) / 2;
    }
    return {
      ratioX: ratioX,
      ratioY: ratioY,
      offsetX: offsetX,
      offsetY: offsetY
    };
  }
  var DoughnutController = /*#__PURE__*/function (_DatasetController3) {
    babelHelpers.inherits(DoughnutController, _DatasetController3);
    function DoughnutController(chart, datasetIndex) {
      var _this4;
      babelHelpers.classCallCheck(this, DoughnutController);
      _this4 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(DoughnutController).call(this, chart, datasetIndex));
      _this4.enableOptionSharing = true;
      _this4.innerRadius = undefined;
      _this4.outerRadius = undefined;
      _this4.offsetX = undefined;
      _this4.offsetY = undefined;
      return _this4;
    }
    babelHelpers.createClass(DoughnutController, [{
      key: "linkScales",
      value: function linkScales() {}
    }, {
      key: "parse",
      value: function parse(start, count) {
        var data = this.getDataset().data;
        var meta = this._cachedMeta;
        if (this._parsing === false) {
          meta._parsed = data;
        } else {
          var getter = function getter(i$$1) {
            return +data[i$$1];
          };
          if (isObject(data[start])) {
            var _this$_parsing$key = this._parsing.key,
              key = _this$_parsing$key === void 0 ? 'value' : _this$_parsing$key;
            getter = function getter(i$$1) {
              return +resolveObjectKey(data[i$$1], key);
            };
          }
          var i$$1, ilen;
          for (i$$1 = start, ilen = start + count; i$$1 < ilen; ++i$$1) {
            meta._parsed[i$$1] = getter(i$$1);
          }
        }
      }
    }, {
      key: "_getRotation",
      value: function _getRotation() {
        return toRadians(this.options.rotation - 90);
      }
    }, {
      key: "_getCircumference",
      value: function _getCircumference() {
        return toRadians(this.options.circumference);
      }
    }, {
      key: "_getRotationExtents",
      value: function _getRotationExtents() {
        var min = TAU;
        var max = -TAU;
        for (var i$$1 = 0; i$$1 < this.chart.data.datasets.length; ++i$$1) {
          if (this.chart.isDatasetVisible(i$$1) && this.chart.getDatasetMeta(i$$1).type === this._type) {
            var controller = this.chart.getDatasetMeta(i$$1).controller;
            var rotation = controller._getRotation();
            var circumference = controller._getCircumference();
            min = Math.min(min, rotation);
            max = Math.max(max, rotation + circumference);
          }
        }
        return {
          rotation: min,
          circumference: max - min
        };
      }
    }, {
      key: "update",
      value: function update(mode) {
        var chart = this.chart;
        var chartArea = chart.chartArea;
        var meta = this._cachedMeta;
        var arcs = meta.data;
        var spacing = this.getMaxBorderWidth() + this.getMaxOffset(arcs) + this.options.spacing;
        var maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
        var cutout = Math.min(toPercentage(this.options.cutout, maxSize), 1);
        var chartWeight = this._getRingWeight(this.index);
        var _this$_getRotationExt = this._getRotationExtents(),
          circumference = _this$_getRotationExt.circumference,
          rotation = _this$_getRotationExt.rotation;
        var _getRatioAndOffset = getRatioAndOffset(rotation, circumference, cutout),
          ratioX = _getRatioAndOffset.ratioX,
          ratioY = _getRatioAndOffset.ratioY,
          offsetX = _getRatioAndOffset.offsetX,
          offsetY = _getRatioAndOffset.offsetY;
        var maxWidth = (chartArea.width - spacing) / ratioX;
        var maxHeight = (chartArea.height - spacing) / ratioY;
        var maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0);
        var outerRadius = toDimension(this.options.radius, maxRadius);
        var innerRadius = Math.max(outerRadius * cutout, 0);
        var radiusLength = (outerRadius - innerRadius) / this._getVisibleDatasetWeightTotal();
        this.offsetX = offsetX * outerRadius;
        this.offsetY = offsetY * outerRadius;
        meta.total = this.calculateTotal();
        this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.index);
        this.innerRadius = Math.max(this.outerRadius - radiusLength * chartWeight, 0);
        this.updateElements(arcs, 0, arcs.length, mode);
      }
    }, {
      key: "_circumference",
      value: function _circumference(i$$1, reset) {
        var opts = this.options;
        var meta = this._cachedMeta;
        var circumference = this._getCircumference();
        if (reset && opts.animation.animateRotate || !this.chart.getDataVisibility(i$$1) || meta._parsed[i$$1] === null || meta.data[i$$1].hidden) {
          return 0;
        }
        return this.calculateCircumference(meta._parsed[i$$1] * circumference / TAU);
      }
    }, {
      key: "updateElements",
      value: function updateElements(arcs, start, count, mode) {
        var reset = mode === 'reset';
        var chart = this.chart;
        var chartArea = chart.chartArea;
        var opts = chart.options;
        var animationOpts = opts.animation;
        var centerX = (chartArea.left + chartArea.right) / 2;
        var centerY = (chartArea.top + chartArea.bottom) / 2;
        var animateScale = reset && animationOpts.animateScale;
        var innerRadius = animateScale ? 0 : this.innerRadius;
        var outerRadius = animateScale ? 0 : this.outerRadius;
        var _this$_getSharedOptio3 = this._getSharedOptions(start, mode),
          sharedOptions = _this$_getSharedOptio3.sharedOptions,
          includeOptions = _this$_getSharedOptio3.includeOptions;
        var startAngle = this._getRotation();
        var i$$1;
        for (i$$1 = 0; i$$1 < start; ++i$$1) {
          startAngle += this._circumference(i$$1, reset);
        }
        for (i$$1 = start; i$$1 < start + count; ++i$$1) {
          var circumference = this._circumference(i$$1, reset);
          var arc = arcs[i$$1];
          var properties = {
            x: centerX + this.offsetX,
            y: centerY + this.offsetY,
            startAngle: startAngle,
            endAngle: startAngle + circumference,
            circumference: circumference,
            outerRadius: outerRadius,
            innerRadius: innerRadius
          };
          if (includeOptions) {
            properties.options = sharedOptions || this.resolveDataElementOptions(i$$1, arc.active ? 'active' : mode);
          }
          startAngle += circumference;
          this.updateElement(arc, i$$1, properties, mode);
        }
      }
    }, {
      key: "calculateTotal",
      value: function calculateTotal() {
        var meta = this._cachedMeta;
        var metaData = meta.data;
        var total = 0;
        var i$$1;
        for (i$$1 = 0; i$$1 < metaData.length; i$$1++) {
          var value = meta._parsed[i$$1];
          if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i$$1) && !metaData[i$$1].hidden) {
            total += Math.abs(value);
          }
        }
        return total;
      }
    }, {
      key: "calculateCircumference",
      value: function calculateCircumference(value) {
        var total = this._cachedMeta.total;
        if (total > 0 && !isNaN(value)) {
          return TAU * (Math.abs(value) / total);
        }
        return 0;
      }
    }, {
      key: "getLabelAndValue",
      value: function getLabelAndValue(index) {
        var meta = this._cachedMeta;
        var chart = this.chart;
        var labels = chart.data.labels || [];
        var value = formatNumber(meta._parsed[index], chart.options.locale);
        return {
          label: labels[index] || '',
          value: value
        };
      }
    }, {
      key: "getMaxBorderWidth",
      value: function getMaxBorderWidth(arcs) {
        var max = 0;
        var chart = this.chart;
        var i$$1, ilen, meta, controller, options;
        if (!arcs) {
          for (i$$1 = 0, ilen = chart.data.datasets.length; i$$1 < ilen; ++i$$1) {
            if (chart.isDatasetVisible(i$$1)) {
              meta = chart.getDatasetMeta(i$$1);
              arcs = meta.data;
              controller = meta.controller;
              break;
            }
          }
        }
        if (!arcs) {
          return 0;
        }
        for (i$$1 = 0, ilen = arcs.length; i$$1 < ilen; ++i$$1) {
          options = controller.resolveDataElementOptions(i$$1);
          if (options.borderAlign !== 'inner') {
            max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0);
          }
        }
        return max;
      }
    }, {
      key: "getMaxOffset",
      value: function getMaxOffset(arcs) {
        var max = 0;
        for (var i$$1 = 0, ilen = arcs.length; i$$1 < ilen; ++i$$1) {
          var options = this.resolveDataElementOptions(i$$1);
          max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
        }
        return max;
      }
    }, {
      key: "_getRingWeightOffset",
      value: function _getRingWeightOffset(datasetIndex) {
        var ringWeightOffset = 0;
        for (var i$$1 = 0; i$$1 < datasetIndex; ++i$$1) {
          if (this.chart.isDatasetVisible(i$$1)) {
            ringWeightOffset += this._getRingWeight(i$$1);
          }
        }
        return ringWeightOffset;
      }
    }, {
      key: "_getRingWeight",
      value: function _getRingWeight(datasetIndex) {
        return Math.max(valueOrDefault(this.chart.data.datasets[datasetIndex].weight, 1), 0);
      }
    }, {
      key: "_getVisibleDatasetWeightTotal",
      value: function _getVisibleDatasetWeightTotal() {
        return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
      }
    }]);
    return DoughnutController;
  }(DatasetController);
  babelHelpers.defineProperty(DoughnutController, "id", 'doughnut');
  babelHelpers.defineProperty(DoughnutController, "defaults", {
    datasetElementType: false,
    dataElementType: 'arc',
    animation: {
      animateRotate: true,
      animateScale: false
    },
    animations: {
      numbers: {
        type: 'number',
        properties: ['circumference', 'endAngle', 'innerRadius', 'outerRadius', 'startAngle', 'x', 'y', 'offset', 'borderWidth', 'spacing']
      }
    },
    cutout: '50%',
    rotation: 0,
    circumference: 360,
    radius: '100%',
    spacing: 0,
    indexAxis: 'r'
  });
  babelHelpers.defineProperty(DoughnutController, "descriptors", {
    _scriptable: function _scriptable(name) {
      return name !== 'spacing';
    },
    _indexable: function _indexable(name) {
      return name !== 'spacing';
    }
  });
  babelHelpers.defineProperty(DoughnutController, "overrides", {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels: function generateLabels(chart) {
            var data = chart.data;
            if (data.labels.length && data.datasets.length) {
              var _chart$legend$options2 = chart.legend.options.labels,
                pointStyle = _chart$legend$options2.pointStyle,
                color$$1 = _chart$legend$options2.color;
              return data.labels.map(function (label, i$$1) {
                var meta = chart.getDatasetMeta(0);
                var style = meta.controller.getStyle(i$$1);
                return {
                  text: label,
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  fontColor: color$$1,
                  lineWidth: style.borderWidth,
                  pointStyle: pointStyle,
                  hidden: !chart.getDataVisibility(i$$1),
                  index: i$$1
                };
              });
            }
            return [];
          }
        },
        onClick: function onClick(e$$1, legendItem, legend) {
          legend.chart.toggleDataVisibility(legendItem.index);
          legend.chart.update();
        }
      }
    }
  });
  var LineController = /*#__PURE__*/function (_DatasetController4) {
    babelHelpers.inherits(LineController, _DatasetController4);
    function LineController() {
      babelHelpers.classCallCheck(this, LineController);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(LineController).apply(this, arguments));
    }
    babelHelpers.createClass(LineController, [{
      key: "initialize",
      value: function initialize() {
        this.enableOptionSharing = true;
        this.supportsDecimation = true;
        babelHelpers.get(babelHelpers.getPrototypeOf(LineController.prototype), "initialize", this).call(this);
      }
    }, {
      key: "update",
      value: function update(mode) {
        var meta = this._cachedMeta;
        var line = meta.dataset,
          _meta$data = meta.data,
          points = _meta$data === void 0 ? [] : _meta$data,
          _dataset = meta._dataset;
        var animationsDisabled = this.chart._animationsDisabled;
        var _getStartAndCountOfVi = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled),
          start = _getStartAndCountOfVi.start,
          count = _getStartAndCountOfVi.count;
        this._drawStart = start;
        this._drawCount = count;
        if (_scaleRangesChanged(meta)) {
          start = 0;
          count = points.length;
        }
        line._chart = this.chart;
        line._datasetIndex = this.index;
        line._decimated = !!_dataset._decimated;
        line.points = points;
        var options = this.resolveDatasetElementOptions(mode);
        if (!this.options.showLine) {
          options.borderWidth = 0;
        }
        options.segment = this.options.segment;
        this.updateElement(line, undefined, {
          animated: !animationsDisabled,
          options: options
        }, mode);
        this.updateElements(points, start, count, mode);
      }
    }, {
      key: "updateElements",
      value: function updateElements(points, start, count, mode) {
        var reset = mode === 'reset';
        var _this$_cachedMeta3 = this._cachedMeta,
          iScale = _this$_cachedMeta3.iScale,
          vScale = _this$_cachedMeta3.vScale,
          _stacked = _this$_cachedMeta3._stacked,
          _dataset = _this$_cachedMeta3._dataset;
        var _this$_getSharedOptio4 = this._getSharedOptions(start, mode),
          sharedOptions = _this$_getSharedOptio4.sharedOptions,
          includeOptions = _this$_getSharedOptio4.includeOptions;
        var iAxis = iScale.axis;
        var vAxis = vScale.axis;
        var _this$options2 = this.options,
          spanGaps = _this$options2.spanGaps,
          segment = _this$options2.segment;
        var maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
        var directUpdate = this.chart._animationsDisabled || reset || mode === 'none';
        var end = start + count;
        var pointsCount = points.length;
        var prevParsed = start > 0 && this.getParsed(start - 1);
        for (var i$$1 = 0; i$$1 < pointsCount; ++i$$1) {
          var point = points[i$$1];
          var properties = directUpdate ? point : {};
          if (i$$1 < start || i$$1 >= end) {
            properties.skip = true;
            continue;
          }
          var parsed = this.getParsed(i$$1);
          var nullData = isNullOrUndef(parsed[vAxis]);
          var iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i$$1);
          var vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i$$1);
          properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
          properties.stop = i$$1 > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
          if (segment) {
            properties.parsed = parsed;
            properties.raw = _dataset.data[i$$1];
          }
          if (includeOptions) {
            properties.options = sharedOptions || this.resolveDataElementOptions(i$$1, point.active ? 'active' : mode);
          }
          if (!directUpdate) {
            this.updateElement(point, i$$1, properties, mode);
          }
          prevParsed = parsed;
        }
      }
    }, {
      key: "getMaxOverflow",
      value: function getMaxOverflow() {
        var meta = this._cachedMeta;
        var dataset = meta.dataset;
        var border = dataset.options && dataset.options.borderWidth || 0;
        var data = meta.data || [];
        if (!data.length) {
          return border;
        }
        var firstPoint = data[0].size(this.resolveDataElementOptions(0));
        var lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
        return Math.max(border, firstPoint, lastPoint) / 2;
      }
    }, {
      key: "draw",
      value: function draw() {
        var meta = this._cachedMeta;
        meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.axis);
        babelHelpers.get(babelHelpers.getPrototypeOf(LineController.prototype), "draw", this).call(this);
      }
    }]);
    return LineController;
  }(DatasetController);
  babelHelpers.defineProperty(LineController, "id", 'line');
  babelHelpers.defineProperty(LineController, "defaults", {
    datasetElementType: 'line',
    dataElementType: 'point',
    showLine: true,
    spanGaps: false
  });
  babelHelpers.defineProperty(LineController, "overrides", {
    scales: {
      _index_: {
        type: 'category'
      },
      _value_: {
        type: 'linear'
      }
    }
  });
  var PolarAreaController = /*#__PURE__*/function (_DatasetController5) {
    babelHelpers.inherits(PolarAreaController, _DatasetController5);
    function PolarAreaController(chart, datasetIndex) {
      var _this5;
      babelHelpers.classCallCheck(this, PolarAreaController);
      _this5 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PolarAreaController).call(this, chart, datasetIndex));
      _this5.innerRadius = undefined;
      _this5.outerRadius = undefined;
      return _this5;
    }
    babelHelpers.createClass(PolarAreaController, [{
      key: "getLabelAndValue",
      value: function getLabelAndValue(index) {
        var meta = this._cachedMeta;
        var chart = this.chart;
        var labels = chart.data.labels || [];
        var value = formatNumber(meta._parsed[index].r, chart.options.locale);
        return {
          label: labels[index] || '',
          value: value
        };
      }
    }, {
      key: "parseObjectData",
      value: function parseObjectData(meta, data, start, count) {
        return _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
      }
    }, {
      key: "update",
      value: function update(mode) {
        var arcs = this._cachedMeta.data;
        this._updateRadius();
        this.updateElements(arcs, 0, arcs.length, mode);
      }
    }, {
      key: "getMinMax",
      value: function getMinMax() {
        var _this6 = this;
        var meta = this._cachedMeta;
        var range = {
          min: Number.POSITIVE_INFINITY,
          max: Number.NEGATIVE_INFINITY
        };
        meta.data.forEach(function (element, index) {
          var parsed = _this6.getParsed(index).r;
          if (!isNaN(parsed) && _this6.chart.getDataVisibility(index)) {
            if (parsed < range.min) {
              range.min = parsed;
            }
            if (parsed > range.max) {
              range.max = parsed;
            }
          }
        });
        return range;
      }
    }, {
      key: "_updateRadius",
      value: function _updateRadius() {
        var chart = this.chart;
        var chartArea = chart.chartArea;
        var opts = chart.options;
        var minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
        var outerRadius = Math.max(minSize / 2, 0);
        var innerRadius = Math.max(opts.cutoutPercentage ? outerRadius / 100 * opts.cutoutPercentage : 1, 0);
        var radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
        this.outerRadius = outerRadius - radiusLength * this.index;
        this.innerRadius = this.outerRadius - radiusLength;
      }
    }, {
      key: "updateElements",
      value: function updateElements(arcs, start, count, mode) {
        var reset = mode === 'reset';
        var chart = this.chart;
        var opts = chart.options;
        var animationOpts = opts.animation;
        var scale = this._cachedMeta.rScale;
        var centerX = scale.xCenter;
        var centerY = scale.yCenter;
        var datasetStartAngle = scale.getIndexAngle(0) - 0.5 * PI;
        var angle = datasetStartAngle;
        var i$$1;
        var defaultAngle = 360 / this.countVisibleElements();
        for (i$$1 = 0; i$$1 < start; ++i$$1) {
          angle += this._computeAngle(i$$1, mode, defaultAngle);
        }
        for (i$$1 = start; i$$1 < start + count; i$$1++) {
          var arc = arcs[i$$1];
          var startAngle = angle;
          var endAngle = angle + this._computeAngle(i$$1, mode, defaultAngle);
          var outerRadius = chart.getDataVisibility(i$$1) ? scale.getDistanceFromCenterForValue(this.getParsed(i$$1).r) : 0;
          angle = endAngle;
          if (reset) {
            if (animationOpts.animateScale) {
              outerRadius = 0;
            }
            if (animationOpts.animateRotate) {
              startAngle = endAngle = datasetStartAngle;
            }
          }
          var properties = {
            x: centerX,
            y: centerY,
            innerRadius: 0,
            outerRadius: outerRadius,
            startAngle: startAngle,
            endAngle: endAngle,
            options: this.resolveDataElementOptions(i$$1, arc.active ? 'active' : mode)
          };
          this.updateElement(arc, i$$1, properties, mode);
        }
      }
    }, {
      key: "countVisibleElements",
      value: function countVisibleElements() {
        var _this7 = this;
        var meta = this._cachedMeta;
        var count = 0;
        meta.data.forEach(function (element, index) {
          if (!isNaN(_this7.getParsed(index).r) && _this7.chart.getDataVisibility(index)) {
            count++;
          }
        });
        return count;
      }
    }, {
      key: "_computeAngle",
      value: function _computeAngle(index, mode, defaultAngle) {
        return this.chart.getDataVisibility(index) ? toRadians(this.resolveDataElementOptions(index, mode).angle || defaultAngle) : 0;
      }
    }]);
    return PolarAreaController;
  }(DatasetController);
  babelHelpers.defineProperty(PolarAreaController, "id", 'polarArea');
  babelHelpers.defineProperty(PolarAreaController, "defaults", {
    dataElementType: 'arc',
    animation: {
      animateRotate: true,
      animateScale: true
    },
    animations: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'startAngle', 'endAngle', 'innerRadius', 'outerRadius']
      }
    },
    indexAxis: 'r',
    startAngle: 0
  });
  babelHelpers.defineProperty(PolarAreaController, "overrides", {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels: function generateLabels(chart) {
            var data = chart.data;
            if (data.labels.length && data.datasets.length) {
              var _chart$legend$options3 = chart.legend.options.labels,
                pointStyle = _chart$legend$options3.pointStyle,
                color$$1 = _chart$legend$options3.color;
              return data.labels.map(function (label, i$$1) {
                var meta = chart.getDatasetMeta(0);
                var style = meta.controller.getStyle(i$$1);
                return {
                  text: label,
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  fontColor: color$$1,
                  lineWidth: style.borderWidth,
                  pointStyle: pointStyle,
                  hidden: !chart.getDataVisibility(i$$1),
                  index: i$$1
                };
              });
            }
            return [];
          }
        },
        onClick: function onClick(e$$1, legendItem, legend) {
          legend.chart.toggleDataVisibility(legendItem.index);
          legend.chart.update();
        }
      }
    },
    scales: {
      r: {
        type: 'radialLinear',
        angleLines: {
          display: false
        },
        beginAtZero: true,
        grid: {
          circular: true
        },
        pointLabels: {
          display: false
        },
        startAngle: 0
      }
    }
  });
  var PieController = /*#__PURE__*/function (_DoughnutController) {
    babelHelpers.inherits(PieController, _DoughnutController);
    function PieController() {
      babelHelpers.classCallCheck(this, PieController);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PieController).apply(this, arguments));
    }
    return PieController;
  }(DoughnutController);
  babelHelpers.defineProperty(PieController, "id", 'pie');
  babelHelpers.defineProperty(PieController, "defaults", {
    cutout: 0,
    rotation: 0,
    circumference: 360,
    radius: '100%'
  });
  var RadarController = /*#__PURE__*/function (_DatasetController6) {
    babelHelpers.inherits(RadarController, _DatasetController6);
    function RadarController() {
      babelHelpers.classCallCheck(this, RadarController);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(RadarController).apply(this, arguments));
    }
    babelHelpers.createClass(RadarController, [{
      key: "getLabelAndValue",
      value: function getLabelAndValue(index) {
        var vScale = this._cachedMeta.vScale;
        var parsed = this.getParsed(index);
        return {
          label: vScale.getLabels()[index],
          value: '' + vScale.getLabelForValue(parsed[vScale.axis])
        };
      }
    }, {
      key: "parseObjectData",
      value: function parseObjectData(meta, data, start, count) {
        return _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
      }
    }, {
      key: "update",
      value: function update(mode) {
        var meta = this._cachedMeta;
        var line = meta.dataset;
        var points = meta.data || [];
        var labels = meta.iScale.getLabels();
        line.points = points;
        if (mode !== 'resize') {
          var options = this.resolveDatasetElementOptions(mode);
          if (!this.options.showLine) {
            options.borderWidth = 0;
          }
          var properties = {
            _loop: true,
            _fullLoop: labels.length === points.length,
            options: options
          };
          this.updateElement(line, undefined, properties, mode);
        }
        this.updateElements(points, 0, points.length, mode);
      }
    }, {
      key: "updateElements",
      value: function updateElements(points, start, count, mode) {
        var scale = this._cachedMeta.rScale;
        var reset = mode === 'reset';
        for (var i$$1 = start; i$$1 < start + count; i$$1++) {
          var point = points[i$$1];
          var options = this.resolveDataElementOptions(i$$1, point.active ? 'active' : mode);
          var pointPosition = scale.getPointPositionForValue(i$$1, this.getParsed(i$$1).r);
          var x$$1 = reset ? scale.xCenter : pointPosition.x;
          var y$$1 = reset ? scale.yCenter : pointPosition.y;
          var properties = {
            x: x$$1,
            y: y$$1,
            angle: pointPosition.angle,
            skip: isNaN(x$$1) || isNaN(y$$1),
            options: options
          };
          this.updateElement(point, i$$1, properties, mode);
        }
      }
    }]);
    return RadarController;
  }(DatasetController);
  babelHelpers.defineProperty(RadarController, "id", 'radar');
  babelHelpers.defineProperty(RadarController, "defaults", {
    datasetElementType: 'line',
    dataElementType: 'point',
    indexAxis: 'r',
    showLine: true,
    elements: {
      line: {
        fill: 'start'
      }
    }
  });
  babelHelpers.defineProperty(RadarController, "overrides", {
    aspectRatio: 1,
    scales: {
      r: {
        type: 'radialLinear'
      }
    }
  });
  var ScatterController = /*#__PURE__*/function (_DatasetController7) {
    babelHelpers.inherits(ScatterController, _DatasetController7);
    function ScatterController() {
      babelHelpers.classCallCheck(this, ScatterController);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(ScatterController).apply(this, arguments));
    }
    babelHelpers.createClass(ScatterController, [{
      key: "getLabelAndValue",
      value: function getLabelAndValue(index) {
        var meta = this._cachedMeta;
        var labels = this.chart.data.labels || [];
        var xScale = meta.xScale,
          yScale = meta.yScale;
        var parsed = this.getParsed(index);
        var x$$1 = xScale.getLabelForValue(parsed.x);
        var y$$1 = yScale.getLabelForValue(parsed.y);
        return {
          label: labels[index] || '',
          value: '(' + x$$1 + ', ' + y$$1 + ')'
        };
      }
    }, {
      key: "update",
      value: function update(mode) {
        var meta = this._cachedMeta;
        var _meta$data2 = meta.data,
          points = _meta$data2 === void 0 ? [] : _meta$data2;
        var animationsDisabled = this.chart._animationsDisabled;
        var _getStartAndCountOfVi2 = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled),
          start = _getStartAndCountOfVi2.start,
          count = _getStartAndCountOfVi2.count;
        this._drawStart = start;
        this._drawCount = count;
        if (_scaleRangesChanged(meta)) {
          start = 0;
          count = points.length;
        }
        if (this.options.showLine) {
          var line = meta.dataset,
            _dataset = meta._dataset;
          line._chart = this.chart;
          line._datasetIndex = this.index;
          line._decimated = !!_dataset._decimated;
          line.points = points;
          var options = this.resolveDatasetElementOptions(mode);
          options.segment = this.options.segment;
          this.updateElement(line, undefined, {
            animated: !animationsDisabled,
            options: options
          }, mode);
        }
        this.updateElements(points, start, count, mode);
      }
    }, {
      key: "addElements",
      value: function addElements() {
        var showLine = this.options.showLine;
        if (!this.datasetElementType && showLine) {
          this.datasetElementType = this.chart.registry.getElement('line');
        }
        babelHelpers.get(babelHelpers.getPrototypeOf(ScatterController.prototype), "addElements", this).call(this);
      }
    }, {
      key: "updateElements",
      value: function updateElements(points, start, count, mode) {
        var reset = mode === 'reset';
        var _this$_cachedMeta4 = this._cachedMeta,
          iScale = _this$_cachedMeta4.iScale,
          vScale = _this$_cachedMeta4.vScale,
          _stacked = _this$_cachedMeta4._stacked,
          _dataset = _this$_cachedMeta4._dataset;
        var firstOpts = this.resolveDataElementOptions(start, mode);
        var sharedOptions = this.getSharedOptions(firstOpts);
        var includeOptions = this.includeOptions(mode, sharedOptions);
        var iAxis = iScale.axis;
        var vAxis = vScale.axis;
        var _this$options3 = this.options,
          spanGaps = _this$options3.spanGaps,
          segment = _this$options3.segment;
        var maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
        var directUpdate = this.chart._animationsDisabled || reset || mode === 'none';
        var prevParsed = start > 0 && this.getParsed(start - 1);
        for (var i$$1 = start; i$$1 < start + count; ++i$$1) {
          var point = points[i$$1];
          var parsed = this.getParsed(i$$1);
          var properties = directUpdate ? point : {};
          var nullData = isNullOrUndef(parsed[vAxis]);
          var iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i$$1);
          var vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i$$1);
          properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
          properties.stop = i$$1 > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
          if (segment) {
            properties.parsed = parsed;
            properties.raw = _dataset.data[i$$1];
          }
          if (includeOptions) {
            properties.options = sharedOptions || this.resolveDataElementOptions(i$$1, point.active ? 'active' : mode);
          }
          if (!directUpdate) {
            this.updateElement(point, i$$1, properties, mode);
          }
          prevParsed = parsed;
        }
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
      }
    }, {
      key: "getMaxOverflow",
      value: function getMaxOverflow() {
        var meta = this._cachedMeta;
        var data = meta.data || [];
        if (!this.options.showLine) {
          var max = 0;
          for (var i$$1 = data.length - 1; i$$1 >= 0; --i$$1) {
            max = Math.max(max, data[i$$1].size(this.resolveDataElementOptions(i$$1)) / 2);
          }
          return max > 0 && max;
        }
        var dataset = meta.dataset;
        var border = dataset.options && dataset.options.borderWidth || 0;
        if (!data.length) {
          return border;
        }
        var firstPoint = data[0].size(this.resolveDataElementOptions(0));
        var lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
        return Math.max(border, firstPoint, lastPoint) / 2;
      }
    }]);
    return ScatterController;
  }(DatasetController);
  babelHelpers.defineProperty(ScatterController, "id", 'scatter');
  babelHelpers.defineProperty(ScatterController, "defaults", {
    datasetElementType: false,
    dataElementType: 'point',
    showLine: false,
    fill: false
  });
  babelHelpers.defineProperty(ScatterController, "overrides", {
    interaction: {
      mode: 'point'
    },
    scales: {
      x: {
        type: 'linear'
      },
      y: {
        type: 'linear'
      }
    }
  });
  var controllers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BarController: BarController,
    BubbleController: BubbleController,
    DoughnutController: DoughnutController,
    LineController: LineController,
    PolarAreaController: PolarAreaController,
    PieController: PieController,
    RadarController: RadarController,
    ScatterController: ScatterController
  });

  /**
   * @namespace Chart._adapters
   * @since 2.8.0
   * @private
   */
  function _abstract() {
    throw new Error('This method is not implemented: Check that a complete date adapter is provided.');
  }
  /**
   * Date adapter (current used by the time scale)
   * @namespace Chart._adapters._date
   * @memberof Chart._adapters
   * @private
   */
  var DateAdapterBase = /*#__PURE__*/function () {
    babelHelpers.createClass(DateAdapterBase, null, [{
      key: "override",
      /**
      * Override default date adapter methods.
      * Accepts type parameter to define options type.
      * @example
      * Chart._adapters._date.override<{myAdapterOption: string}>({
      *   init() {
      *     console.log(this.options.myAdapterOption);
      *   }
      * })
      */
      value: function override(members) {
        Object.assign(DateAdapterBase.prototype, members);
      }
    }]);
    function DateAdapterBase(options) {
      babelHelpers.classCallCheck(this, DateAdapterBase);
      this.options = options || {};
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    babelHelpers.createClass(DateAdapterBase, [{
      key: "init",
      value: function init() {}
    }, {
      key: "formats",
      value: function formats() {
        return _abstract();
      }
    }, {
      key: "parse",
      value: function parse() {
        return _abstract();
      }
    }, {
      key: "format",
      value: function format() {
        return _abstract();
      }
    }, {
      key: "add",
      value: function add() {
        return _abstract();
      }
    }, {
      key: "diff",
      value: function diff() {
        return _abstract();
      }
    }, {
      key: "startOf",
      value: function startOf() {
        return _abstract();
      }
    }, {
      key: "endOf",
      value: function endOf() {
        return _abstract();
      }
    }]);
    return DateAdapterBase;
  }();
  var adapters = {
    _date: DateAdapterBase
  };
  function binarySearch(metaset, axis, value, intersect) {
    var controller = metaset.controller,
      data = metaset.data,
      _sorted = metaset._sorted;
    var iScale = controller._cachedMeta.iScale;
    if (iScale && axis === iScale.axis && axis !== 'r' && _sorted && data.length) {
      var lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
      if (!intersect) {
        return lookupMethod(data, axis, value);
      } else if (controller._sharedOptions) {
        var el = data[0];
        var range = typeof el.getRange === 'function' && el.getRange(axis);
        if (range) {
          var start = lookupMethod(data, axis, value - range);
          var end = lookupMethod(data, axis, value + range);
          return {
            lo: start.lo,
            hi: end.hi
          };
        }
      }
    }
    return {
      lo: 0,
      hi: data.length - 1
    };
  }
  function evaluateInteractionItems(chart, axis, position, handler, intersect) {
    var metasets = chart.getSortedVisibleDatasetMetas();
    var value = position[axis];
    for (var i$$1 = 0, ilen = metasets.length; i$$1 < ilen; ++i$$1) {
      var _metasets$i = metasets[i$$1],
        _index2 = _metasets$i.index,
        data = _metasets$i.data;
      var _binarySearch = binarySearch(metasets[i$$1], axis, value, intersect),
        lo = _binarySearch.lo,
        hi = _binarySearch.hi;
      for (var j$$1 = lo; j$$1 <= hi; ++j$$1) {
        var element = data[j$$1];
        if (!element.skip) {
          handler(element, _index2, j$$1);
        }
      }
    }
  }
  function getDistanceMetricForAxis(axis) {
    var useX = axis.indexOf('x') !== -1;
    var useY = axis.indexOf('y') !== -1;
    return function (pt1, pt2) {
      var deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
      var deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
      return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    };
  }
  function getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) {
    var items = [];
    if (!includeInvisible && !chart.isPointInArea(position)) {
      return items;
    }
    var evaluationFunc = function evaluationFunc(element, datasetIndex, index) {
      if (!includeInvisible && !_isPointInArea(element, chart.chartArea, 0)) {
        return;
      }
      if (element.inRange(position.x, position.y, useFinalPosition)) {
        items.push({
          element: element,
          datasetIndex: datasetIndex,
          index: index
        });
      }
    };
    evaluateInteractionItems(chart, axis, position, evaluationFunc, true);
    return items;
  }
  function getNearestRadialItems(chart, position, axis, useFinalPosition) {
    var items = [];
    function evaluationFunc(element, datasetIndex, index) {
      var _element$getProps = element.getProps(['startAngle', 'endAngle'], useFinalPosition),
        startAngle = _element$getProps.startAngle,
        endAngle = _element$getProps.endAngle;
      var _getAngleFromPoint = getAngleFromPoint(element, {
          x: position.x,
          y: position.y
        }),
        angle = _getAngleFromPoint.angle;
      if (_angleBetween(angle, startAngle, endAngle)) {
        items.push({
          element: element,
          datasetIndex: datasetIndex,
          index: index
        });
      }
    }
    evaluateInteractionItems(chart, axis, position, evaluationFunc);
    return items;
  }
  function getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
    var items = [];
    var distanceMetric = getDistanceMetricForAxis(axis);
    var minDistance = Number.POSITIVE_INFINITY;
    function evaluationFunc(element, datasetIndex, index) {
      var inRange = element.inRange(position.x, position.y, useFinalPosition);
      if (intersect && !inRange) {
        return;
      }
      var center = element.getCenterPoint(useFinalPosition);
      var pointInArea = !!includeInvisible || chart.isPointInArea(center);
      if (!pointInArea && !inRange) {
        return;
      }
      var distance = distanceMetric(position, center);
      if (distance < minDistance) {
        items = [{
          element: element,
          datasetIndex: datasetIndex,
          index: index
        }];
        minDistance = distance;
      } else if (distance === minDistance) {
        items.push({
          element: element,
          datasetIndex: datasetIndex,
          index: index
        });
      }
    }
    evaluateInteractionItems(chart, axis, position, evaluationFunc);
    return items;
  }
  function getNearestItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
    if (!includeInvisible && !chart.isPointInArea(position)) {
      return [];
    }
    return axis === 'r' && !intersect ? getNearestRadialItems(chart, position, axis, useFinalPosition) : getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible);
  }
  function getAxisItems(chart, position, axis, intersect, useFinalPosition) {
    var items = [];
    var rangeMethod = axis === 'x' ? 'inXRange' : 'inYRange';
    var intersectsItem = false;
    evaluateInteractionItems(chart, axis, position, function (element, datasetIndex, index) {
      if (element[rangeMethod](position[axis], useFinalPosition)) {
        items.push({
          element: element,
          datasetIndex: datasetIndex,
          index: index
        });
        intersectsItem = intersectsItem || element.inRange(position.x, position.y, useFinalPosition);
      }
    });
    if (intersect && !intersectsItem) {
      return [];
    }
    return items;
  }
  var Interaction = {
    evaluateInteractionItems: evaluateInteractionItems,
    modes: {
      index: function index(chart, e$$1, options, useFinalPosition) {
        var position = getRelativePosition(e$$1, chart);
        var axis = options.axis || 'x';
        var includeInvisible = options.includeInvisible || false;
        var items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
        var elements = [];
        if (!items.length) {
          return [];
        }
        chart.getSortedVisibleDatasetMetas().forEach(function (meta) {
          var index = items[0].index;
          var element = meta.data[index];
          if (element && !element.skip) {
            elements.push({
              element: element,
              datasetIndex: meta.index,
              index: index
            });
          }
        });
        return elements;
      },
      dataset: function dataset(chart, e$$1, options, useFinalPosition) {
        var position = getRelativePosition(e$$1, chart);
        var axis = options.axis || 'xy';
        var includeInvisible = options.includeInvisible || false;
        var items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
        if (items.length > 0) {
          var datasetIndex = items[0].datasetIndex;
          var data = chart.getDatasetMeta(datasetIndex).data;
          items = [];
          for (var i$$1 = 0; i$$1 < data.length; ++i$$1) {
            items.push({
              element: data[i$$1],
              datasetIndex: datasetIndex,
              index: i$$1
            });
          }
        }
        return items;
      },
      point: function point(chart, e$$1, options, useFinalPosition) {
        var position = getRelativePosition(e$$1, chart);
        var axis = options.axis || 'xy';
        var includeInvisible = options.includeInvisible || false;
        return getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible);
      },
      nearest: function nearest(chart, e$$1, options, useFinalPosition) {
        var position = getRelativePosition(e$$1, chart);
        var axis = options.axis || 'xy';
        var includeInvisible = options.includeInvisible || false;
        return getNearestItems(chart, position, axis, options.intersect, useFinalPosition, includeInvisible);
      },
      x: function x$$1(chart, e$$1, options, useFinalPosition) {
        var position = getRelativePosition(e$$1, chart);
        return getAxisItems(chart, position, 'x', options.intersect, useFinalPosition);
      },
      y: function y$$1(chart, e$$1, options, useFinalPosition) {
        var position = getRelativePosition(e$$1, chart);
        return getAxisItems(chart, position, 'y', options.intersect, useFinalPosition);
      }
    }
  };
  var STATIC_POSITIONS = ['left', 'top', 'right', 'bottom'];
  function filterByPosition(array, position) {
    return array.filter(function (v$$1) {
      return v$$1.pos === position;
    });
  }
  function filterDynamicPositionByAxis(array, axis) {
    return array.filter(function (v$$1) {
      return STATIC_POSITIONS.indexOf(v$$1.pos) === -1 && v$$1.box.axis === axis;
    });
  }
  function sortByWeight(array, reverse) {
    return array.sort(function (a$$1, b$$1) {
      var v0 = reverse ? b$$1 : a$$1;
      var v1 = reverse ? a$$1 : b$$1;
      return v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
    });
  }
  function wrapBoxes(boxes) {
    var layoutBoxes = [];
    var i$$1, ilen, box, pos, stack, stackWeight;
    for (i$$1 = 0, ilen = (boxes || []).length; i$$1 < ilen; ++i$$1) {
      box = boxes[i$$1];
      var _box = box;
      pos = _box.position;
      var _box$options = _box.options;
      stack = _box$options.stack;
      var _box$options$stackWei = _box$options.stackWeight;
      stackWeight = _box$options$stackWei === void 0 ? 1 : _box$options$stackWei;
      layoutBoxes.push({
        index: i$$1,
        box: box,
        pos: pos,
        horizontal: box.isHorizontal(),
        weight: box.weight,
        stack: stack && pos + stack,
        stackWeight: stackWeight
      });
    }
    return layoutBoxes;
  }
  function buildStacks(layouts) {
    var stacks = {};
    var _iterator5 = _createForOfIteratorHelper$1(layouts),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var wrap = _step5.value;
        var stack = wrap.stack,
          pos = wrap.pos,
          stackWeight = wrap.stackWeight;
        if (!stack || !STATIC_POSITIONS.includes(pos)) {
          continue;
        }
        var _stack = stacks[stack] || (stacks[stack] = {
          count: 0,
          placed: 0,
          weight: 0,
          size: 0
        });
        _stack.count++;
        _stack.weight += stackWeight;
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    return stacks;
  }
  function setLayoutDims(layouts, params) {
    var stacks = buildStacks(layouts);
    var vBoxMaxWidth = params.vBoxMaxWidth,
      hBoxMaxHeight = params.hBoxMaxHeight;
    var i$$1, ilen, layout;
    for (i$$1 = 0, ilen = layouts.length; i$$1 < ilen; ++i$$1) {
      layout = layouts[i$$1];
      var fullSize = layout.box.fullSize;
      var stack = stacks[layout.stack];
      var factor = stack && layout.stackWeight / stack.weight;
      if (layout.horizontal) {
        layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
        layout.height = hBoxMaxHeight;
      } else {
        layout.width = vBoxMaxWidth;
        layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
      }
    }
    return stacks;
  }
  function buildLayoutBoxes(boxes) {
    var layoutBoxes = wrapBoxes(boxes);
    var fullSize = sortByWeight(layoutBoxes.filter(function (wrap) {
      return wrap.box.fullSize;
    }), true);
    var left = sortByWeight(filterByPosition(layoutBoxes, 'left'), true);
    var right = sortByWeight(filterByPosition(layoutBoxes, 'right'));
    var top = sortByWeight(filterByPosition(layoutBoxes, 'top'), true);
    var bottom = sortByWeight(filterByPosition(layoutBoxes, 'bottom'));
    var centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, 'x');
    var centerVertical = filterDynamicPositionByAxis(layoutBoxes, 'y');
    return {
      fullSize: fullSize,
      leftAndTop: left.concat(top),
      rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
      chartArea: filterByPosition(layoutBoxes, 'chartArea'),
      vertical: left.concat(right).concat(centerVertical),
      horizontal: top.concat(bottom).concat(centerHorizontal)
    };
  }
  function getCombinedMax(maxPadding, chartArea, a$$1, b$$1) {
    return Math.max(maxPadding[a$$1], chartArea[a$$1]) + Math.max(maxPadding[b$$1], chartArea[b$$1]);
  }
  function updateMaxPadding(maxPadding, boxPadding) {
    maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
    maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
    maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
    maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
  }
  function updateDims(chartArea, params, layout, stacks) {
    var pos = layout.pos,
      box = layout.box;
    var maxPadding = chartArea.maxPadding;
    if (!isObject(pos)) {
      if (layout.size) {
        chartArea[pos] -= layout.size;
      }
      var stack = stacks[layout.stack] || {
        size: 0,
        count: 1
      };
      stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width);
      layout.size = stack.size / stack.count;
      chartArea[pos] += layout.size;
    }
    if (box.getPadding) {
      updateMaxPadding(maxPadding, box.getPadding());
    }
    var newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, 'left', 'right'));
    var newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, 'top', 'bottom'));
    var widthChanged = newWidth !== chartArea.w;
    var heightChanged = newHeight !== chartArea.h;
    chartArea.w = newWidth;
    chartArea.h = newHeight;
    return layout.horizontal ? {
      same: widthChanged,
      other: heightChanged
    } : {
      same: heightChanged,
      other: widthChanged
    };
  }
  function handleMaxPadding(chartArea) {
    var maxPadding = chartArea.maxPadding;
    function updatePos(pos) {
      var change = Math.max(maxPadding[pos] - chartArea[pos], 0);
      chartArea[pos] += change;
      return change;
    }
    chartArea.y += updatePos('top');
    chartArea.x += updatePos('left');
    updatePos('right');
    updatePos('bottom');
  }
  function getMargins(horizontal, chartArea) {
    var maxPadding = chartArea.maxPadding;
    function marginForPositions(positions) {
      var margin = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };
      positions.forEach(function (pos) {
        margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
      });
      return margin;
    }
    return horizontal ? marginForPositions(['left', 'right']) : marginForPositions(['top', 'bottom']);
  }
  function fitBoxes(boxes, chartArea, params, stacks) {
    var refitBoxes = [];
    var i$$1, ilen, layout, box, refit, changed;
    for (i$$1 = 0, ilen = boxes.length, refit = 0; i$$1 < ilen; ++i$$1) {
      layout = boxes[i$$1];
      box = layout.box;
      box.update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
      var _updateDims = updateDims(chartArea, params, layout, stacks),
        same = _updateDims.same,
        other = _updateDims.other;
      refit |= same && refitBoxes.length;
      changed = changed || other;
      if (!box.fullSize) {
        refitBoxes.push(layout);
      }
    }
    return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
  }
  function setBoxDims(box, left, top, width, height) {
    box.top = top;
    box.left = left;
    box.right = left + width;
    box.bottom = top + height;
    box.width = width;
    box.height = height;
  }
  function placeBoxes(boxes, chartArea, params, stacks) {
    var userPadding = params.padding;
    var x$$1 = chartArea.x,
      y$$1 = chartArea.y;
    var _iterator6 = _createForOfIteratorHelper$1(boxes),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var layout = _step6.value;
        var box = layout.box;
        var stack = stacks[layout.stack] || {
          count: 1,
          placed: 0,
          weight: 1
        };
        var weight = layout.stackWeight / stack.weight || 1;
        if (layout.horizontal) {
          var width = chartArea.w * weight;
          var height = stack.size || box.height;
          if (defined(stack.start)) {
            y$$1 = stack.start;
          }
          if (box.fullSize) {
            setBoxDims(box, userPadding.left, y$$1, params.outerWidth - userPadding.right - userPadding.left, height);
          } else {
            setBoxDims(box, chartArea.left + stack.placed, y$$1, width, height);
          }
          stack.start = y$$1;
          stack.placed += width;
          y$$1 = box.bottom;
        } else {
          var height1 = chartArea.h * weight;
          var width1 = stack.size || box.width;
          if (defined(stack.start)) {
            x$$1 = stack.start;
          }
          if (box.fullSize) {
            setBoxDims(box, x$$1, userPadding.top, width1, params.outerHeight - userPadding.bottom - userPadding.top);
          } else {
            setBoxDims(box, x$$1, chartArea.top + stack.placed, width1, height1);
          }
          stack.start = x$$1;
          stack.placed += height1;
          x$$1 = box.right;
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    chartArea.x = x$$1;
    chartArea.y = y$$1;
  }
  var layouts = {
    addBox: function addBox(chart, item) {
      if (!chart.boxes) {
        chart.boxes = [];
      }
      item.fullSize = item.fullSize || false;
      item.position = item.position || 'top';
      item.weight = item.weight || 0;
      item._layers = item._layers || function () {
        return [{
          z: 0,
          draw: function draw(chartArea) {
            item.draw(chartArea);
          }
        }];
      };
      chart.boxes.push(item);
    },
    removeBox: function removeBox(chart, layoutItem) {
      var index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
      if (index !== -1) {
        chart.boxes.splice(index, 1);
      }
    },
    configure: function configure(chart, item, options) {
      item.fullSize = options.fullSize;
      item.position = options.position;
      item.weight = options.weight;
    },
    update: function update(chart, width, height, minPadding) {
      if (!chart) {
        return;
      }
      var padding = toPadding(chart.options.layout.padding);
      var availableWidth = Math.max(width - padding.width, 0);
      var availableHeight = Math.max(height - padding.height, 0);
      var boxes = buildLayoutBoxes(chart.boxes);
      var verticalBoxes = boxes.vertical;
      var horizontalBoxes = boxes.horizontal;
      each(chart.boxes, function (box) {
        if (typeof box.beforeLayout === 'function') {
          box.beforeLayout();
        }
      });
      var visibleVerticalBoxCount = verticalBoxes.reduce(function (total, wrap) {
        return wrap.box.options && wrap.box.options.display === false ? total : total + 1;
      }, 0) || 1;
      var params = Object.freeze({
        outerWidth: width,
        outerHeight: height,
        padding: padding,
        availableWidth: availableWidth,
        availableHeight: availableHeight,
        vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
        hBoxMaxHeight: availableHeight / 2
      });
      var maxPadding = Object.assign({}, padding);
      updateMaxPadding(maxPadding, toPadding(minPadding));
      var chartArea = Object.assign({
        maxPadding: maxPadding,
        w: availableWidth,
        h: availableHeight,
        x: padding.left,
        y: padding.top
      }, padding);
      var stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
      fitBoxes(boxes.fullSize, chartArea, params, stacks);
      fitBoxes(verticalBoxes, chartArea, params, stacks);
      if (fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
        fitBoxes(verticalBoxes, chartArea, params, stacks);
      }
      handleMaxPadding(chartArea);
      placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
      chartArea.x += chartArea.w;
      chartArea.y += chartArea.h;
      placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
      chart.chartArea = {
        left: chartArea.left,
        top: chartArea.top,
        right: chartArea.left + chartArea.w,
        bottom: chartArea.top + chartArea.h,
        height: chartArea.h,
        width: chartArea.w
      };
      each(boxes.chartArea, function (layout) {
        var box = layout.box;
        Object.assign(box, chart.chartArea);
        box.update(chartArea.w, chartArea.h, {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        });
      });
    }
  };
  var BasePlatform = /*#__PURE__*/function () {
    function BasePlatform() {
      babelHelpers.classCallCheck(this, BasePlatform);
    }
    babelHelpers.createClass(BasePlatform, [{
      key: "acquireContext",
      value: function acquireContext(canvas, aspectRatio) {}
    }, {
      key: "releaseContext",
      value: function releaseContext(context) {
        return false;
      }
    }, {
      key: "addEventListener",
      value: function addEventListener(chart, type, listener) {}
    }, {
      key: "removeEventListener",
      value: function removeEventListener(chart, type, listener) {}
    }, {
      key: "getDevicePixelRatio",
      value: function getDevicePixelRatio() {
        return 1;
      }
    }, {
      key: "getMaximumSize",
      value: function getMaximumSize$$1(element, width, height, aspectRatio) {
        width = Math.max(0, width || element.width);
        height = height || element.height;
        return {
          width: width,
          height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
        };
      }
    }, {
      key: "isAttached",
      value: function isAttached(canvas) {
        return true;
      }
    }, {
      key: "updateConfig",
      value: function updateConfig(config) {}
    }]);
    return BasePlatform;
  }();
  var BasicPlatform = /*#__PURE__*/function (_BasePlatform) {
    babelHelpers.inherits(BasicPlatform, _BasePlatform);
    function BasicPlatform() {
      babelHelpers.classCallCheck(this, BasicPlatform);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(BasicPlatform).apply(this, arguments));
    }
    babelHelpers.createClass(BasicPlatform, [{
      key: "acquireContext",
      value: function acquireContext(item) {
        return item && item.getContext && item.getContext('2d') || null;
      }
    }, {
      key: "updateConfig",
      value: function updateConfig(config) {
        config.options.animation = false;
      }
    }]);
    return BasicPlatform;
  }(BasePlatform);
  var EXPANDO_KEY = '$chartjs';
  var EVENT_TYPES = {
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup',
    pointerenter: 'mouseenter',
    pointerdown: 'mousedown',
    pointermove: 'mousemove',
    pointerup: 'mouseup',
    pointerleave: 'mouseout',
    pointerout: 'mouseout'
  };
  var isNullOrEmpty = function isNullOrEmpty(value) {
    return value === null || value === '';
  };
  function initCanvas(canvas, aspectRatio) {
    var style = canvas.style;
    var renderHeight = canvas.getAttribute('height');
    var renderWidth = canvas.getAttribute('width');
    canvas[EXPANDO_KEY] = {
      initial: {
        height: renderHeight,
        width: renderWidth,
        style: {
          display: style.display,
          height: style.height,
          width: style.width
        }
      }
    };
    style.display = style.display || 'block';
    style.boxSizing = style.boxSizing || 'border-box';
    if (isNullOrEmpty(renderWidth)) {
      var displayWidth = readUsedSize(canvas, 'width');
      if (displayWidth !== undefined) {
        canvas.width = displayWidth;
      }
    }
    if (isNullOrEmpty(renderHeight)) {
      if (canvas.style.height === '') {
        canvas.height = canvas.width / (aspectRatio || 2);
      } else {
        var displayHeight = readUsedSize(canvas, 'height');
        if (displayHeight !== undefined) {
          canvas.height = displayHeight;
        }
      }
    }
    return canvas;
  }
  var eventListenerOptions = supportsEventListenerOptions ? {
    passive: true
  } : false;
  function addListener(node, type, listener) {
    node.addEventListener(type, listener, eventListenerOptions);
  }
  function removeListener(chart, type, listener) {
    chart.canvas.removeEventListener(type, listener, eventListenerOptions);
  }
  function fromNativeEvent(event, chart) {
    var type = EVENT_TYPES[event.type] || event.type;
    var _getRelativePosition = getRelativePosition(event, chart),
      x$$1 = _getRelativePosition.x,
      y$$1 = _getRelativePosition.y;
    return {
      type: type,
      chart: chart,
      "native": event,
      x: x$$1 !== undefined ? x$$1 : null,
      y: y$$1 !== undefined ? y$$1 : null
    };
  }
  function nodeListContains(nodeList, canvas) {
    var _iterator7 = _createForOfIteratorHelper$1(nodeList),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var node = _step7.value;
        if (node === canvas || node.contains(canvas)) {
          return true;
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
  }
  function createAttachObserver(chart, type, listener) {
    var canvas = chart.canvas;
    var observer = new MutationObserver(function (entries) {
      var trigger = false;
      var _iterator8 = _createForOfIteratorHelper$1(entries),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var entry = _step8.value;
          trigger = trigger || nodeListContains(entry.addedNodes, canvas);
          trigger = trigger && !nodeListContains(entry.removedNodes, canvas);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
      if (trigger) {
        listener();
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });
    return observer;
  }
  function createDetachObserver(chart, type, listener) {
    var canvas = chart.canvas;
    var observer = new MutationObserver(function (entries) {
      var trigger = false;
      var _iterator9 = _createForOfIteratorHelper$1(entries),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var entry = _step9.value;
          trigger = trigger || nodeListContains(entry.removedNodes, canvas);
          trigger = trigger && !nodeListContains(entry.addedNodes, canvas);
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
      if (trigger) {
        listener();
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });
    return observer;
  }
  var drpListeningCharts = new Map();
  var oldDevicePixelRatio = 0;
  function onWindowResize() {
    var dpr = window.devicePixelRatio;
    if (dpr === oldDevicePixelRatio) {
      return;
    }
    oldDevicePixelRatio = dpr;
    drpListeningCharts.forEach(function (resize, chart) {
      if (chart.currentDevicePixelRatio !== dpr) {
        resize();
      }
    });
  }
  function listenDevicePixelRatioChanges(chart, resize) {
    if (!drpListeningCharts.size) {
      window.addEventListener('resize', onWindowResize);
    }
    drpListeningCharts.set(chart, resize);
  }
  function unlistenDevicePixelRatioChanges(chart) {
    drpListeningCharts["delete"](chart);
    if (!drpListeningCharts.size) {
      window.removeEventListener('resize', onWindowResize);
    }
  }
  function createResizeObserver(chart, type, listener) {
    var canvas = chart.canvas;
    var container = canvas && _getParentNode(canvas);
    if (!container) {
      return;
    }
    var resize = throttled(function (width, height) {
      var w$$1 = container.clientWidth;
      listener(width, height);
      if (w$$1 < container.clientWidth) {
        listener();
      }
    }, window);
    var observer = new ResizeObserver(function (entries) {
      var entry = entries[0];
      var width = entry.contentRect.width;
      var height = entry.contentRect.height;
      if (width === 0 && height === 0) {
        return;
      }
      resize(width, height);
    });
    observer.observe(container);
    listenDevicePixelRatioChanges(chart, resize);
    return observer;
  }
  function releaseObserver(chart, type, observer) {
    if (observer) {
      observer.disconnect();
    }
    if (type === 'resize') {
      unlistenDevicePixelRatioChanges(chart);
    }
  }
  function createProxyAndListen(chart, type, listener) {
    var canvas = chart.canvas;
    var proxy = throttled(function (event) {
      if (chart.ctx !== null) {
        listener(fromNativeEvent(event, chart));
      }
    }, chart);
    addListener(canvas, type, proxy);
    return proxy;
  }
  var DomPlatform = /*#__PURE__*/function (_BasePlatform2) {
    babelHelpers.inherits(DomPlatform, _BasePlatform2);
    function DomPlatform() {
      babelHelpers.classCallCheck(this, DomPlatform);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(DomPlatform).apply(this, arguments));
    }
    babelHelpers.createClass(DomPlatform, [{
      key: "acquireContext",
      value: function acquireContext(canvas, aspectRatio) {
        var context = canvas && canvas.getContext && canvas.getContext('2d');
        if (context && context.canvas === canvas) {
          initCanvas(canvas, aspectRatio);
          return context;
        }
        return null;
      }
    }, {
      key: "releaseContext",
      value: function releaseContext(context) {
        var canvas = context.canvas;
        if (!canvas[EXPANDO_KEY]) {
          return false;
        }
        var initial = canvas[EXPANDO_KEY].initial;
        ['height', 'width'].forEach(function (prop) {
          var value = initial[prop];
          if (isNullOrUndef(value)) {
            canvas.removeAttribute(prop);
          } else {
            canvas.setAttribute(prop, value);
          }
        });
        var style = initial.style || {};
        Object.keys(style).forEach(function (key) {
          canvas.style[key] = style[key];
        });
        canvas.width = canvas.width;
        delete canvas[EXPANDO_KEY];
        return true;
      }
    }, {
      key: "addEventListener",
      value: function addEventListener(chart, type, listener) {
        this.removeEventListener(chart, type);
        var proxies = chart.$proxies || (chart.$proxies = {});
        var handlers = {
          attach: createAttachObserver,
          detach: createDetachObserver,
          resize: createResizeObserver
        };
        var handler = handlers[type] || createProxyAndListen;
        proxies[type] = handler(chart, type, listener);
      }
    }, {
      key: "removeEventListener",
      value: function removeEventListener(chart, type) {
        var proxies = chart.$proxies || (chart.$proxies = {});
        var proxy = proxies[type];
        if (!proxy) {
          return;
        }
        var handlers = {
          attach: releaseObserver,
          detach: releaseObserver,
          resize: releaseObserver
        };
        var handler = handlers[type] || removeListener;
        handler(chart, type, proxy);
        proxies[type] = undefined;
      }
    }, {
      key: "getDevicePixelRatio",
      value: function getDevicePixelRatio() {
        return window.devicePixelRatio;
      }
    }, {
      key: "getMaximumSize",
      value: function getMaximumSize$$1(canvas, width, height, aspectRatio) {
        return getMaximumSize(canvas, width, height, aspectRatio);
      }
    }, {
      key: "isAttached",
      value: function isAttached(canvas) {
        var container = _getParentNode(canvas);
        return !!(container && container.isConnected);
      }
    }]);
    return DomPlatform;
  }(BasePlatform);
  function _detectPlatform(canvas) {
    if (!_isDomSupported() || typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
      return BasicPlatform;
    }
    return DomPlatform;
  }
  var Element = /*#__PURE__*/function () {
    function Element() {
      babelHelpers.classCallCheck(this, Element);
      babelHelpers.defineProperty(this, "active", false);
    }
    babelHelpers.createClass(Element, [{
      key: "tooltipPosition",
      value: function tooltipPosition(useFinalPosition) {
        var _this$getProps = this.getProps(['x', 'y'], useFinalPosition),
          x$$1 = _this$getProps.x,
          y$$1 = _this$getProps.y;
        return {
          x: x$$1,
          y: y$$1
        };
      }
    }, {
      key: "hasValue",
      value: function hasValue() {
        return isNumber(this.x) && isNumber(this.y);
      }
    }, {
      key: "getProps",
      value: function getProps(props, _final) {
        var _this8 = this;
        var anims = this.$animations;
        if (!_final || !anims) {
          // let's not create an object, if not needed
          return this;
        }
        var ret = {};
        props.forEach(function (prop) {
          ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : _this8[prop];
        });
        return ret;
      }
    }]);
    return Element;
  }();
  babelHelpers.defineProperty(Element, "defaults", {});
  babelHelpers.defineProperty(Element, "defaultRoutes", undefined);
  function autoSkip(scale, ticks) {
    var tickOpts = scale.options.ticks;
    var determinedMaxTicks = determineMaxTicks(scale);
    var ticksLimit = Math.min(tickOpts.maxTicksLimit || determinedMaxTicks, determinedMaxTicks);
    var majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
    var numMajorIndices = majorIndices.length;
    var first = majorIndices[0];
    var last = majorIndices[numMajorIndices - 1];
    var newTicks = [];
    if (numMajorIndices > ticksLimit) {
      skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
      return newTicks;
    }
    var spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
    if (numMajorIndices > 0) {
      var i$$1, ilen;
      var avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
      skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
      for (i$$1 = 0, ilen = numMajorIndices - 1; i$$1 < ilen; i$$1++) {
        skip(ticks, newTicks, spacing, majorIndices[i$$1], majorIndices[i$$1 + 1]);
      }
      skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
      return newTicks;
    }
    skip(ticks, newTicks, spacing);
    return newTicks;
  }
  function determineMaxTicks(scale) {
    var offset = scale.options.offset;
    var tickLength = scale._tickSize();
    var maxScale = scale._length / tickLength + (offset ? 0 : 1);
    var maxChart = scale._maxLength / tickLength;
    return Math.floor(Math.min(maxScale, maxChart));
  }
  function calculateSpacing(majorIndices, ticks, ticksLimit) {
    var evenMajorSpacing = getEvenSpacing(majorIndices);
    var spacing = ticks.length / ticksLimit;
    if (!evenMajorSpacing) {
      return Math.max(spacing, 1);
    }
    var factors = _factorize(evenMajorSpacing);
    for (var i$$1 = 0, ilen = factors.length - 1; i$$1 < ilen; i$$1++) {
      var factor = factors[i$$1];
      if (factor > spacing) {
        return factor;
      }
    }
    return Math.max(spacing, 1);
  }
  function getMajorIndices(ticks) {
    var result = [];
    var i$$1, ilen;
    for (i$$1 = 0, ilen = ticks.length; i$$1 < ilen; i$$1++) {
      if (ticks[i$$1].major) {
        result.push(i$$1);
      }
    }
    return result;
  }
  function skipMajors(ticks, newTicks, majorIndices, spacing) {
    var count = 0;
    var next = majorIndices[0];
    var i$$1;
    spacing = Math.ceil(spacing);
    for (i$$1 = 0; i$$1 < ticks.length; i$$1++) {
      if (i$$1 === next) {
        newTicks.push(ticks[i$$1]);
        count++;
        next = majorIndices[count * spacing];
      }
    }
  }
  function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
    var start = valueOrDefault(majorStart, 0);
    var end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
    var count = 0;
    var length, i$$1, next;
    spacing = Math.ceil(spacing);
    if (majorEnd) {
      length = majorEnd - majorStart;
      spacing = length / Math.floor(length / spacing);
    }
    next = start;
    while (next < 0) {
      count++;
      next = Math.round(start + count * spacing);
    }
    for (i$$1 = Math.max(start, 0); i$$1 < end; i$$1++) {
      if (i$$1 === next) {
        newTicks.push(ticks[i$$1]);
        count++;
        next = Math.round(start + count * spacing);
      }
    }
  }
  function getEvenSpacing(arr) {
    var len = arr.length;
    var i$$1, diff;
    if (len < 2) {
      return false;
    }
    for (diff = arr[0], i$$1 = 1; i$$1 < len; ++i$$1) {
      if (arr[i$$1] - arr[i$$1 - 1] !== diff) {
        return false;
      }
    }
    return diff;
  }
  var reverseAlign = function reverseAlign(align) {
    return align === 'left' ? 'right' : align === 'right' ? 'left' : align;
  };
  var offsetFromEdge = function offsetFromEdge(scale, edge, offset) {
    return edge === 'top' || edge === 'left' ? scale[edge] + offset : scale[edge] - offset;
  };
  var getTicksLimit = function getTicksLimit(ticksLength, maxTicksLimit) {
    return Math.min(maxTicksLimit || ticksLength, ticksLength);
  };
  function sample(arr, numItems) {
    var result = [];
    var increment = arr.length / numItems;
    var len = arr.length;
    var i$$1 = 0;
    for (; i$$1 < len; i$$1 += increment) {
      result.push(arr[Math.floor(i$$1)]);
    }
    return result;
  }
  function getPixelForGridLine(scale, index, offsetGridLines) {
    var length = scale.ticks.length;
    var validIndex = Math.min(index, length - 1);
    var start = scale._startPixel;
    var end = scale._endPixel;
    var epsilon = 1e-6;
    var lineValue = scale.getPixelForTick(validIndex);
    var offset;
    if (offsetGridLines) {
      if (length === 1) {
        offset = Math.max(lineValue - start, end - lineValue);
      } else if (index === 0) {
        offset = (scale.getPixelForTick(1) - lineValue) / 2;
      } else {
        offset = (lineValue - scale.getPixelForTick(validIndex - 1)) / 2;
      }
      lineValue += validIndex < index ? offset : -offset;
      if (lineValue < start - epsilon || lineValue > end + epsilon) {
        return;
      }
    }
    return lineValue;
  }
  function garbageCollect(caches, length) {
    each(caches, function (cache) {
      var gc = cache.gc;
      var gcLen = gc.length / 2;
      var i$$1;
      if (gcLen > length) {
        for (i$$1 = 0; i$$1 < gcLen; ++i$$1) {
          delete cache.data[gc[i$$1]];
        }
        gc.splice(0, gcLen);
      }
    });
  }
  function getTickMarkLength(options) {
    return options.drawTicks ? options.tickLength : 0;
  }
  function getTitleHeight(options, fallback) {
    if (!options.display) {
      return 0;
    }
    var font = toFont(options.font, fallback);
    var padding = toPadding(options.padding);
    var lines = isArray(options.text) ? options.text.length : 1;
    return lines * font.lineHeight + padding.height;
  }
  function createScaleContext(parent, scale) {
    return createContext(parent, {
      scale: scale,
      type: 'scale'
    });
  }
  function createTickContext(parent, index, tick) {
    return createContext(parent, {
      tick: tick,
      index: index,
      type: 'tick'
    });
  }
  function titleAlign(align, position, reverse) {
    var ret = _toLeftRightCenter(align);
    if (reverse && position !== 'right' || !reverse && position === 'right') {
      ret = reverseAlign(ret);
    }
    return ret;
  }
  function titleArgs(scale, offset, position, align) {
    var top = scale.top,
      left = scale.left,
      bottom = scale.bottom,
      right = scale.right,
      chart = scale.chart;
    var chartArea = chart.chartArea,
      scales = chart.scales;
    var rotation = 0;
    var maxWidth, titleX, titleY;
    var height = bottom - top;
    var width = right - left;
    if (scale.isHorizontal()) {
      titleX = _alignStartEnd(align, left, right);
      if (isObject(position)) {
        var positionAxisID = Object.keys(position)[0];
        var value = position[positionAxisID];
        titleY = scales[positionAxisID].getPixelForValue(value) + height - offset;
      } else if (position === 'center') {
        titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
      } else {
        titleY = offsetFromEdge(scale, position, offset);
      }
      maxWidth = right - left;
    } else {
      if (isObject(position)) {
        var positionAxisID1 = Object.keys(position)[0];
        var value1 = position[positionAxisID1];
        titleX = scales[positionAxisID1].getPixelForValue(value1) - width + offset;
      } else if (position === 'center') {
        titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
      } else {
        titleX = offsetFromEdge(scale, position, offset);
      }
      titleY = _alignStartEnd(align, bottom, top);
      rotation = position === 'left' ? -HALF_PI : HALF_PI;
    }
    return {
      titleX: titleX,
      titleY: titleY,
      maxWidth: maxWidth,
      rotation: rotation
    };
  }
  var Scale = /*#__PURE__*/function (_Element) {
    babelHelpers.inherits(Scale, _Element);
    function Scale(cfg) {
      var _this9;
      babelHelpers.classCallCheck(this, Scale);
      _this9 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Scale).call(this));
      _this9.id = cfg.id;
      _this9.type = cfg.type;
      _this9.options = undefined;
      _this9.ctx = cfg.ctx;
      _this9.chart = cfg.chart;
      _this9.top = undefined;
      _this9.bottom = undefined;
      _this9.left = undefined;
      _this9.right = undefined;
      _this9.width = undefined;
      _this9.height = undefined;
      _this9._margins = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };
      _this9.maxWidth = undefined;
      _this9.maxHeight = undefined;
      _this9.paddingTop = undefined;
      _this9.paddingBottom = undefined;
      _this9.paddingLeft = undefined;
      _this9.paddingRight = undefined;
      _this9.axis = undefined;
      _this9.labelRotation = undefined;
      _this9.min = undefined;
      _this9.max = undefined;
      _this9._range = undefined;
      _this9.ticks = [];
      _this9._gridLineItems = null;
      _this9._labelItems = null;
      _this9._labelSizes = null;
      _this9._length = 0;
      _this9._maxLength = 0;
      _this9._longestTextCache = {};
      _this9._startPixel = undefined;
      _this9._endPixel = undefined;
      _this9._reversePixels = false;
      _this9._userMax = undefined;
      _this9._userMin = undefined;
      _this9._suggestedMax = undefined;
      _this9._suggestedMin = undefined;
      _this9._ticksLength = 0;
      _this9._borderValue = 0;
      _this9._cache = {};
      _this9._dataLimitsCached = false;
      _this9.$context = undefined;
      return _this9;
    }
    babelHelpers.createClass(Scale, [{
      key: "init",
      value: function init(options) {
        this.options = options.setContext(this.getContext());
        this.axis = options.axis;
        this._userMin = this.parse(options.min);
        this._userMax = this.parse(options.max);
        this._suggestedMin = this.parse(options.suggestedMin);
        this._suggestedMax = this.parse(options.suggestedMax);
      }
    }, {
      key: "parse",
      value: function parse(raw, index) {
        return raw;
      }
    }, {
      key: "getUserBounds",
      value: function getUserBounds() {
        var _userMin = this._userMin,
          _userMax = this._userMax,
          _suggestedMin = this._suggestedMin,
          _suggestedMax = this._suggestedMax;
        _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
        _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
        _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
        _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
        return {
          min: finiteOrDefault(_userMin, _suggestedMin),
          max: finiteOrDefault(_userMax, _suggestedMax),
          minDefined: isNumberFinite(_userMin),
          maxDefined: isNumberFinite(_userMax)
        };
      }
    }, {
      key: "getMinMax",
      value: function getMinMax(canStack) {
        var _this$getUserBounds = this.getUserBounds(),
          min = _this$getUserBounds.min,
          max = _this$getUserBounds.max,
          minDefined = _this$getUserBounds.minDefined,
          maxDefined = _this$getUserBounds.maxDefined;
        var range;
        if (minDefined && maxDefined) {
          return {
            min: min,
            max: max
          };
        }
        var metas = this.getMatchingVisibleMetas();
        for (var i$$1 = 0, ilen = metas.length; i$$1 < ilen; ++i$$1) {
          range = metas[i$$1].controller.getMinMax(this, canStack);
          if (!minDefined) {
            min = Math.min(min, range.min);
          }
          if (!maxDefined) {
            max = Math.max(max, range.max);
          }
        }
        min = maxDefined && min > max ? max : min;
        max = minDefined && min > max ? min : max;
        return {
          min: finiteOrDefault(min, finiteOrDefault(max, min)),
          max: finiteOrDefault(max, finiteOrDefault(min, max))
        };
      }
    }, {
      key: "getPadding",
      value: function getPadding() {
        return {
          left: this.paddingLeft || 0,
          top: this.paddingTop || 0,
          right: this.paddingRight || 0,
          bottom: this.paddingBottom || 0
        };
      }
    }, {
      key: "getTicks",
      value: function getTicks() {
        return this.ticks;
      }
    }, {
      key: "getLabels",
      value: function getLabels() {
        var data = this.chart.data;
        return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
      }
    }, {
      key: "getLabelItems",
      value: function getLabelItems() {
        var chartArea = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.chart.chartArea;
        var items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
        return items;
      }
    }, {
      key: "beforeLayout",
      value: function beforeLayout() {
        this._cache = {};
        this._dataLimitsCached = false;
      }
    }, {
      key: "beforeUpdate",
      value: function beforeUpdate() {
        callback(this.options.beforeUpdate, [this]);
      }
    }, {
      key: "update",
      value: function update(maxWidth, maxHeight, margins) {
        var _this$options4 = this.options,
          beginAtZero = _this$options4.beginAtZero,
          grace = _this$options4.grace,
          tickOpts = _this$options4.ticks;
        var sampleSize = tickOpts.sampleSize;
        this.beforeUpdate();
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this._margins = margins = Object.assign({
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }, margins);
        this.ticks = null;
        this._labelSizes = null;
        this._gridLineItems = null;
        this._labelItems = null;
        this.beforeSetDimensions();
        this.setDimensions();
        this.afterSetDimensions();
        this._maxLength = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom;
        if (!this._dataLimitsCached) {
          this.beforeDataLimits();
          this.determineDataLimits();
          this.afterDataLimits();
          this._range = _addGrace(this, grace, beginAtZero);
          this._dataLimitsCached = true;
        }
        this.beforeBuildTicks();
        this.ticks = this.buildTicks() || [];
        this.afterBuildTicks();
        var samplingEnabled = sampleSize < this.ticks.length;
        this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
        this.configure();
        this.beforeCalculateLabelRotation();
        this.calculateLabelRotation();
        this.afterCalculateLabelRotation();
        if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === 'auto')) {
          this.ticks = autoSkip(this, this.ticks);
          this._labelSizes = null;
          this.afterAutoSkip();
        }
        if (samplingEnabled) {
          this._convertTicksToLabels(this.ticks);
        }
        this.beforeFit();
        this.fit();
        this.afterFit();
        this.afterUpdate();
      }
    }, {
      key: "configure",
      value: function configure() {
        var reversePixels = this.options.reverse;
        var startPixel, endPixel;
        if (this.isHorizontal()) {
          startPixel = this.left;
          endPixel = this.right;
        } else {
          startPixel = this.top;
          endPixel = this.bottom;
          reversePixels = !reversePixels;
        }
        this._startPixel = startPixel;
        this._endPixel = endPixel;
        this._reversePixels = reversePixels;
        this._length = endPixel - startPixel;
        this._alignToPixels = this.options.alignToPixels;
      }
    }, {
      key: "afterUpdate",
      value: function afterUpdate() {
        callback(this.options.afterUpdate, [this]);
      }
    }, {
      key: "beforeSetDimensions",
      value: function beforeSetDimensions() {
        callback(this.options.beforeSetDimensions, [this]);
      }
    }, {
      key: "setDimensions",
      value: function setDimensions() {
        if (this.isHorizontal()) {
          this.width = this.maxWidth;
          this.left = 0;
          this.right = this.width;
        } else {
          this.height = this.maxHeight;
          this.top = 0;
          this.bottom = this.height;
        }
        this.paddingLeft = 0;
        this.paddingTop = 0;
        this.paddingRight = 0;
        this.paddingBottom = 0;
      }
    }, {
      key: "afterSetDimensions",
      value: function afterSetDimensions() {
        callback(this.options.afterSetDimensions, [this]);
      }
    }, {
      key: "_callHooks",
      value: function _callHooks(name) {
        this.chart.notifyPlugins(name, this.getContext());
        callback(this.options[name], [this]);
      }
    }, {
      key: "beforeDataLimits",
      value: function beforeDataLimits() {
        this._callHooks('beforeDataLimits');
      }
    }, {
      key: "determineDataLimits",
      value: function determineDataLimits() {}
    }, {
      key: "afterDataLimits",
      value: function afterDataLimits() {
        this._callHooks('afterDataLimits');
      }
    }, {
      key: "beforeBuildTicks",
      value: function beforeBuildTicks() {
        this._callHooks('beforeBuildTicks');
      }
    }, {
      key: "buildTicks",
      value: function buildTicks() {
        return [];
      }
    }, {
      key: "afterBuildTicks",
      value: function afterBuildTicks() {
        this._callHooks('afterBuildTicks');
      }
    }, {
      key: "beforeTickToLabelConversion",
      value: function beforeTickToLabelConversion() {
        callback(this.options.beforeTickToLabelConversion, [this]);
      }
    }, {
      key: "generateTickLabels",
      value: function generateTickLabels(ticks) {
        var tickOpts = this.options.ticks;
        var i$$1, ilen, tick;
        for (i$$1 = 0, ilen = ticks.length; i$$1 < ilen; i$$1++) {
          tick = ticks[i$$1];
          tick.label = callback(tickOpts.callback, [tick.value, i$$1, ticks], this);
        }
      }
    }, {
      key: "afterTickToLabelConversion",
      value: function afterTickToLabelConversion() {
        callback(this.options.afterTickToLabelConversion, [this]);
      }
    }, {
      key: "beforeCalculateLabelRotation",
      value: function beforeCalculateLabelRotation() {
        callback(this.options.beforeCalculateLabelRotation, [this]);
      }
    }, {
      key: "calculateLabelRotation",
      value: function calculateLabelRotation() {
        var options = this.options;
        var tickOpts = options.ticks;
        var numTicks = getTicksLimit(this.ticks.length, options.ticks.maxTicksLimit);
        var minRotation = tickOpts.minRotation || 0;
        var maxRotation = tickOpts.maxRotation;
        var labelRotation = minRotation;
        var tickWidth, maxHeight, maxLabelDiagonal;
        if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
          this.labelRotation = minRotation;
          return;
        }
        var labelSizes = this._getLabelSizes();
        var maxLabelWidth = labelSizes.widest.width;
        var maxLabelHeight = labelSizes.highest.height;
        var maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
        tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
        if (maxLabelWidth + 6 > tickWidth) {
          tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
          maxHeight = this.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
          maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
          labelRotation = toDegrees(Math.min(Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)), Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))));
          labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
        }
        this.labelRotation = labelRotation;
      }
    }, {
      key: "afterCalculateLabelRotation",
      value: function afterCalculateLabelRotation() {
        callback(this.options.afterCalculateLabelRotation, [this]);
      }
    }, {
      key: "afterAutoSkip",
      value: function afterAutoSkip() {}
    }, {
      key: "beforeFit",
      value: function beforeFit() {
        callback(this.options.beforeFit, [this]);
      }
    }, {
      key: "fit",
      value: function fit() {
        var minSize = {
          width: 0,
          height: 0
        };
        var chart = this.chart,
          _this$options5 = this.options,
          tickOpts = _this$options5.ticks,
          titleOpts = _this$options5.title,
          gridOpts = _this$options5.grid;
        var display = this._isVisible();
        var isHorizontal = this.isHorizontal();
        if (display) {
          var titleHeight = getTitleHeight(titleOpts, chart.options.font);
          if (isHorizontal) {
            minSize.width = this.maxWidth;
            minSize.height = getTickMarkLength(gridOpts) + titleHeight;
          } else {
            minSize.height = this.maxHeight;
            minSize.width = getTickMarkLength(gridOpts) + titleHeight;
          }
          if (tickOpts.display && this.ticks.length) {
            var _this$_getLabelSizes = this._getLabelSizes(),
              first = _this$_getLabelSizes.first,
              last = _this$_getLabelSizes.last,
              widest = _this$_getLabelSizes.widest,
              highest = _this$_getLabelSizes.highest;
            var tickPadding = tickOpts.padding * 2;
            var angleRadians = toRadians(this.labelRotation);
            var cos = Math.cos(angleRadians);
            var sin = Math.sin(angleRadians);
            if (isHorizontal) {
              var labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
              minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
            } else {
              var labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
              minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
            }
            this._calculatePadding(first, last, sin, cos);
          }
        }
        this._handleMargins();
        if (isHorizontal) {
          this.width = this._length = chart.width - this._margins.left - this._margins.right;
          this.height = minSize.height;
        } else {
          this.width = minSize.width;
          this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
        }
      }
    }, {
      key: "_calculatePadding",
      value: function _calculatePadding(first, last, sin, cos) {
        var _this$options6 = this.options,
          _this$options6$ticks = _this$options6.ticks,
          align = _this$options6$ticks.align,
          padding = _this$options6$ticks.padding,
          position = _this$options6.position;
        var isRotated = this.labelRotation !== 0;
        var labelsBelowTicks = position !== 'top' && this.axis === 'x';
        if (this.isHorizontal()) {
          var offsetLeft = this.getPixelForTick(0) - this.left;
          var offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
          var paddingLeft = 0;
          var paddingRight = 0;
          if (isRotated) {
            if (labelsBelowTicks) {
              paddingLeft = cos * first.width;
              paddingRight = sin * last.height;
            } else {
              paddingLeft = sin * first.height;
              paddingRight = cos * last.width;
            }
          } else if (align === 'start') {
            paddingRight = last.width;
          } else if (align === 'end') {
            paddingLeft = first.width;
          } else if (align !== 'inner') {
            paddingLeft = first.width / 2;
            paddingRight = last.width / 2;
          }
          this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
          this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
        } else {
          var paddingTop = last.height / 2;
          var paddingBottom = first.height / 2;
          if (align === 'start') {
            paddingTop = 0;
            paddingBottom = first.height;
          } else if (align === 'end') {
            paddingTop = last.height;
            paddingBottom = 0;
          }
          this.paddingTop = paddingTop + padding;
          this.paddingBottom = paddingBottom + padding;
        }
      }
    }, {
      key: "_handleMargins",
      value: function _handleMargins() {
        if (this._margins) {
          this._margins.left = Math.max(this.paddingLeft, this._margins.left);
          this._margins.top = Math.max(this.paddingTop, this._margins.top);
          this._margins.right = Math.max(this.paddingRight, this._margins.right);
          this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
        }
      }
    }, {
      key: "afterFit",
      value: function afterFit() {
        callback(this.options.afterFit, [this]);
      }
    }, {
      key: "isHorizontal",
      value: function isHorizontal() {
        var _this$options7 = this.options,
          axis = _this$options7.axis,
          position = _this$options7.position;
        return position === 'top' || position === 'bottom' || axis === 'x';
      }
    }, {
      key: "isFullSize",
      value: function isFullSize() {
        return this.options.fullSize;
      }
    }, {
      key: "_convertTicksToLabels",
      value: function _convertTicksToLabels(ticks) {
        this.beforeTickToLabelConversion();
        this.generateTickLabels(ticks);
        var i$$1, ilen;
        for (i$$1 = 0, ilen = ticks.length; i$$1 < ilen; i$$1++) {
          if (isNullOrUndef(ticks[i$$1].label)) {
            ticks.splice(i$$1, 1);
            ilen--;
            i$$1--;
          }
        }
        this.afterTickToLabelConversion();
      }
    }, {
      key: "_getLabelSizes",
      value: function _getLabelSizes() {
        var labelSizes = this._labelSizes;
        if (!labelSizes) {
          var sampleSize = this.options.ticks.sampleSize;
          var ticks = this.ticks;
          if (sampleSize < ticks.length) {
            ticks = sample(ticks, sampleSize);
          }
          this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length, this.options.ticks.maxTicksLimit);
        }
        return labelSizes;
      }
    }, {
      key: "_computeLabelSizes",
      value: function _computeLabelSizes(ticks, length, maxTicksLimit) {
        var ctx = this.ctx,
          caches = this._longestTextCache;
        var widths = [];
        var heights = [];
        var increment = Math.floor(length / getTicksLimit(length, maxTicksLimit));
        var widestLabelSize = 0;
        var highestLabelSize = 0;
        var i$$1, j$$1, jlen, label, tickFont, fontString$$1, cache, lineHeight, width, height, nestedLabel;
        for (i$$1 = 0; i$$1 < length; i$$1 += increment) {
          label = ticks[i$$1].label;
          tickFont = this._resolveTickFontOptions(i$$1);
          ctx.font = fontString$$1 = tickFont.string;
          cache = caches[fontString$$1] = caches[fontString$$1] || {
            data: {},
            gc: []
          };
          lineHeight = tickFont.lineHeight;
          width = height = 0;
          if (!isNullOrUndef(label) && !isArray(label)) {
            width = _measureText(ctx, cache.data, cache.gc, width, label);
            height = lineHeight;
          } else if (isArray(label)) {
            for (j$$1 = 0, jlen = label.length; j$$1 < jlen; ++j$$1) {
              nestedLabel = label[j$$1];
              if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
                width = _measureText(ctx, cache.data, cache.gc, width, nestedLabel);
                height += lineHeight;
              }
            }
          }
          widths.push(width);
          heights.push(height);
          widestLabelSize = Math.max(width, widestLabelSize);
          highestLabelSize = Math.max(height, highestLabelSize);
        }
        garbageCollect(caches, length);
        var widest = widths.indexOf(widestLabelSize);
        var highest = heights.indexOf(highestLabelSize);
        var valueAt = function valueAt(idx) {
          return {
            width: widths[idx] || 0,
            height: heights[idx] || 0
          };
        };
        return {
          first: valueAt(0),
          last: valueAt(length - 1),
          widest: valueAt(widest),
          highest: valueAt(highest),
          widths: widths,
          heights: heights
        };
      }
    }, {
      key: "getLabelForValue",
      value: function getLabelForValue(value) {
        return value;
      }
    }, {
      key: "getPixelForValue",
      value: function getPixelForValue(value, index) {
        return NaN;
      }
    }, {
      key: "getValueForPixel",
      value: function getValueForPixel(pixel) {}
    }, {
      key: "getPixelForTick",
      value: function getPixelForTick(index) {
        var ticks = this.ticks;
        if (index < 0 || index > ticks.length - 1) {
          return null;
        }
        return this.getPixelForValue(ticks[index].value);
      }
    }, {
      key: "getPixelForDecimal",
      value: function getPixelForDecimal(decimal) {
        if (this._reversePixels) {
          decimal = 1 - decimal;
        }
        var pixel = this._startPixel + decimal * this._length;
        return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
      }
    }, {
      key: "getDecimalForPixel",
      value: function getDecimalForPixel(pixel) {
        var decimal = (pixel - this._startPixel) / this._length;
        return this._reversePixels ? 1 - decimal : decimal;
      }
    }, {
      key: "getBasePixel",
      value: function getBasePixel() {
        return this.getPixelForValue(this.getBaseValue());
      }
    }, {
      key: "getBaseValue",
      value: function getBaseValue() {
        var min = this.min,
          max = this.max;
        return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
      }
    }, {
      key: "getContext",
      value: function getContext(index) {
        var ticks = this.ticks || [];
        if (index >= 0 && index < ticks.length) {
          var tick = ticks[index];
          return tick.$context || (tick.$context = createTickContext(this.getContext(), index, tick));
        }
        return this.$context || (this.$context = createScaleContext(this.chart.getContext(), this));
      }
    }, {
      key: "_tickSize",
      value: function _tickSize() {
        var optionTicks = this.options.ticks;
        var rot = toRadians(this.labelRotation);
        var cos = Math.abs(Math.cos(rot));
        var sin = Math.abs(Math.sin(rot));
        var labelSizes = this._getLabelSizes();
        var padding = optionTicks.autoSkipPadding || 0;
        var w$$1 = labelSizes ? labelSizes.widest.width + padding : 0;
        var h$$1 = labelSizes ? labelSizes.highest.height + padding : 0;
        return this.isHorizontal() ? h$$1 * cos > w$$1 * sin ? w$$1 / cos : h$$1 / sin : h$$1 * sin < w$$1 * cos ? h$$1 / cos : w$$1 / sin;
      }
    }, {
      key: "_isVisible",
      value: function _isVisible() {
        var display = this.options.display;
        if (display !== 'auto') {
          return !!display;
        }
        return this.getMatchingVisibleMetas().length > 0;
      }
    }, {
      key: "_computeGridLineItems",
      value: function _computeGridLineItems(chartArea) {
        var axis = this.axis;
        var chart = this.chart;
        var options = this.options;
        var grid = options.grid,
          position = options.position,
          border = options.border;
        var offset = grid.offset;
        var isHorizontal = this.isHorizontal();
        var ticks = this.ticks;
        var ticksLength = ticks.length + (offset ? 1 : 0);
        var tl = getTickMarkLength(grid);
        var items = [];
        var borderOpts = border.setContext(this.getContext());
        var axisWidth = borderOpts.display ? borderOpts.width : 0;
        var axisHalfWidth = axisWidth / 2;
        var alignBorderValue = function alignBorderValue(pixel) {
          return _alignPixel(chart, pixel, axisWidth);
        };
        var borderValue, i$$1, lineValue, alignedLineValue;
        var tx1, ty1, tx2, ty2, x1, y1, x2, y2;
        if (position === 'top') {
          borderValue = alignBorderValue(this.bottom);
          ty1 = this.bottom - tl;
          ty2 = borderValue - axisHalfWidth;
          y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
          y2 = chartArea.bottom;
        } else if (position === 'bottom') {
          borderValue = alignBorderValue(this.top);
          y1 = chartArea.top;
          y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
          ty1 = borderValue + axisHalfWidth;
          ty2 = this.top + tl;
        } else if (position === 'left') {
          borderValue = alignBorderValue(this.right);
          tx1 = this.right - tl;
          tx2 = borderValue - axisHalfWidth;
          x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
          x2 = chartArea.right;
        } else if (position === 'right') {
          borderValue = alignBorderValue(this.left);
          x1 = chartArea.left;
          x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
          tx1 = borderValue + axisHalfWidth;
          tx2 = this.left + tl;
        } else if (axis === 'x') {
          if (position === 'center') {
            borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
          } else if (isObject(position)) {
            var positionAxisID = Object.keys(position)[0];
            var value = position[positionAxisID];
            borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
          }
          y1 = chartArea.top;
          y2 = chartArea.bottom;
          ty1 = borderValue + axisHalfWidth;
          ty2 = ty1 + tl;
        } else if (axis === 'y') {
          if (position === 'center') {
            borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
          } else if (isObject(position)) {
            var positionAxisID1 = Object.keys(position)[0];
            var value1 = position[positionAxisID1];
            borderValue = alignBorderValue(this.chart.scales[positionAxisID1].getPixelForValue(value1));
          }
          tx1 = borderValue - axisHalfWidth;
          tx2 = tx1 - tl;
          x1 = chartArea.left;
          x2 = chartArea.right;
        }
        var limit = valueOrDefault(options.ticks.maxTicksLimit, ticksLength);
        var step = Math.max(1, Math.ceil(ticksLength / limit));
        for (i$$1 = 0; i$$1 < ticksLength; i$$1 += step) {
          var context = this.getContext(i$$1);
          var optsAtIndex = grid.setContext(context);
          var optsAtIndexBorder = border.setContext(context);
          var lineWidth = optsAtIndex.lineWidth;
          var lineColor = optsAtIndex.color;
          var borderDash = optsAtIndexBorder.dash || [];
          var borderDashOffset = optsAtIndexBorder.dashOffset;
          var tickWidth = optsAtIndex.tickWidth;
          var tickColor = optsAtIndex.tickColor;
          var tickBorderDash = optsAtIndex.tickBorderDash || [];
          var tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
          lineValue = getPixelForGridLine(this, i$$1, offset);
          if (lineValue === undefined) {
            continue;
          }
          alignedLineValue = _alignPixel(chart, lineValue, lineWidth);
          if (isHorizontal) {
            tx1 = tx2 = x1 = x2 = alignedLineValue;
          } else {
            ty1 = ty2 = y1 = y2 = alignedLineValue;
          }
          items.push({
            tx1: tx1,
            ty1: ty1,
            tx2: tx2,
            ty2: ty2,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            width: lineWidth,
            color: lineColor,
            borderDash: borderDash,
            borderDashOffset: borderDashOffset,
            tickWidth: tickWidth,
            tickColor: tickColor,
            tickBorderDash: tickBorderDash,
            tickBorderDashOffset: tickBorderDashOffset
          });
        }
        this._ticksLength = ticksLength;
        this._borderValue = borderValue;
        return items;
      }
    }, {
      key: "_computeLabelItems",
      value: function _computeLabelItems(chartArea) {
        var axis = this.axis;
        var options = this.options;
        var position = options.position,
          optionTicks = options.ticks;
        var isHorizontal = this.isHorizontal();
        var ticks = this.ticks;
        var align = optionTicks.align,
          crossAlign = optionTicks.crossAlign,
          padding = optionTicks.padding,
          mirror = optionTicks.mirror;
        var tl = getTickMarkLength(options.grid);
        var tickAndPadding = tl + padding;
        var hTickAndPadding = mirror ? -padding : tickAndPadding;
        var rotation = -toRadians(this.labelRotation);
        var items = [];
        var i$$1, ilen, tick, label, x$$1, y$$1, textAlign, pixel, font, lineHeight, lineCount, textOffset;
        var textBaseline = 'middle';
        if (position === 'top') {
          y$$1 = this.bottom - hTickAndPadding;
          textAlign = this._getXAxisLabelAlignment();
        } else if (position === 'bottom') {
          y$$1 = this.top + hTickAndPadding;
          textAlign = this._getXAxisLabelAlignment();
        } else if (position === 'left') {
          var ret = this._getYAxisLabelAlignment(tl);
          textAlign = ret.textAlign;
          x$$1 = ret.x;
        } else if (position === 'right') {
          var ret1 = this._getYAxisLabelAlignment(tl);
          textAlign = ret1.textAlign;
          x$$1 = ret1.x;
        } else if (axis === 'x') {
          if (position === 'center') {
            y$$1 = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
          } else if (isObject(position)) {
            var positionAxisID = Object.keys(position)[0];
            var value = position[positionAxisID];
            y$$1 = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
          }
          textAlign = this._getXAxisLabelAlignment();
        } else if (axis === 'y') {
          if (position === 'center') {
            x$$1 = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
          } else if (isObject(position)) {
            var positionAxisID1 = Object.keys(position)[0];
            var value1 = position[positionAxisID1];
            x$$1 = this.chart.scales[positionAxisID1].getPixelForValue(value1);
          }
          textAlign = this._getYAxisLabelAlignment(tl).textAlign;
        }
        if (axis === 'y') {
          if (align === 'start') {
            textBaseline = 'top';
          } else if (align === 'end') {
            textBaseline = 'bottom';
          }
        }
        var labelSizes = this._getLabelSizes();
        for (i$$1 = 0, ilen = ticks.length; i$$1 < ilen; ++i$$1) {
          tick = ticks[i$$1];
          label = tick.label;
          var optsAtIndex = optionTicks.setContext(this.getContext(i$$1));
          pixel = this.getPixelForTick(i$$1) + optionTicks.labelOffset;
          font = this._resolveTickFontOptions(i$$1);
          lineHeight = font.lineHeight;
          lineCount = isArray(label) ? label.length : 1;
          var halfCount = lineCount / 2;
          var color$$1 = optsAtIndex.color;
          var strokeColor = optsAtIndex.textStrokeColor;
          var strokeWidth = optsAtIndex.textStrokeWidth;
          var tickTextAlign = textAlign;
          if (isHorizontal) {
            x$$1 = pixel;
            if (textAlign === 'inner') {
              if (i$$1 === ilen - 1) {
                tickTextAlign = !this.options.reverse ? 'right' : 'left';
              } else if (i$$1 === 0) {
                tickTextAlign = !this.options.reverse ? 'left' : 'right';
              } else {
                tickTextAlign = 'center';
              }
            }
            if (position === 'top') {
              if (crossAlign === 'near' || rotation !== 0) {
                textOffset = -lineCount * lineHeight + lineHeight / 2;
              } else if (crossAlign === 'center') {
                textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
              } else {
                textOffset = -labelSizes.highest.height + lineHeight / 2;
              }
            } else {
              if (crossAlign === 'near' || rotation !== 0) {
                textOffset = lineHeight / 2;
              } else if (crossAlign === 'center') {
                textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
              } else {
                textOffset = labelSizes.highest.height - lineCount * lineHeight;
              }
            }
            if (mirror) {
              textOffset *= -1;
            }
            if (rotation !== 0 && !optsAtIndex.showLabelBackdrop) {
              x$$1 += lineHeight / 2 * Math.sin(rotation);
            }
          } else {
            y$$1 = pixel;
            textOffset = (1 - lineCount) * lineHeight / 2;
          }
          var backdrop = void 0;
          if (optsAtIndex.showLabelBackdrop) {
            var labelPadding = toPadding(optsAtIndex.backdropPadding);
            var height = labelSizes.heights[i$$1];
            var width = labelSizes.widths[i$$1];
            var top = textOffset - labelPadding.top;
            var left = 0 - labelPadding.left;
            switch (textBaseline) {
              case 'middle':
                top -= height / 2;
                break;
              case 'bottom':
                top -= height;
                break;
            }
            switch (textAlign) {
              case 'center':
                left -= width / 2;
                break;
              case 'right':
                left -= width;
                break;
            }
            backdrop = {
              left: left,
              top: top,
              width: width + labelPadding.width,
              height: height + labelPadding.height,
              color: optsAtIndex.backdropColor
            };
          }
          items.push({
            label: label,
            font: font,
            textOffset: textOffset,
            options: {
              rotation: rotation,
              color: color$$1,
              strokeColor: strokeColor,
              strokeWidth: strokeWidth,
              textAlign: tickTextAlign,
              textBaseline: textBaseline,
              translation: [x$$1, y$$1],
              backdrop: backdrop
            }
          });
        }
        return items;
      }
    }, {
      key: "_getXAxisLabelAlignment",
      value: function _getXAxisLabelAlignment() {
        var _this$options8 = this.options,
          position = _this$options8.position,
          ticks = _this$options8.ticks;
        var rotation = -toRadians(this.labelRotation);
        if (rotation) {
          return position === 'top' ? 'left' : 'right';
        }
        var align = 'center';
        if (ticks.align === 'start') {
          align = 'left';
        } else if (ticks.align === 'end') {
          align = 'right';
        } else if (ticks.align === 'inner') {
          align = 'inner';
        }
        return align;
      }
    }, {
      key: "_getYAxisLabelAlignment",
      value: function _getYAxisLabelAlignment(tl) {
        var _this$options9 = this.options,
          position = _this$options9.position,
          _this$options9$ticks = _this$options9.ticks,
          crossAlign = _this$options9$ticks.crossAlign,
          mirror = _this$options9$ticks.mirror,
          padding = _this$options9$ticks.padding;
        var labelSizes = this._getLabelSizes();
        var tickAndPadding = tl + padding;
        var widest = labelSizes.widest.width;
        var textAlign;
        var x$$1;
        if (position === 'left') {
          if (mirror) {
            x$$1 = this.right + padding;
            if (crossAlign === 'near') {
              textAlign = 'left';
            } else if (crossAlign === 'center') {
              textAlign = 'center';
              x$$1 += widest / 2;
            } else {
              textAlign = 'right';
              x$$1 += widest;
            }
          } else {
            x$$1 = this.right - tickAndPadding;
            if (crossAlign === 'near') {
              textAlign = 'right';
            } else if (crossAlign === 'center') {
              textAlign = 'center';
              x$$1 -= widest / 2;
            } else {
              textAlign = 'left';
              x$$1 = this.left;
            }
          }
        } else if (position === 'right') {
          if (mirror) {
            x$$1 = this.left + padding;
            if (crossAlign === 'near') {
              textAlign = 'right';
            } else if (crossAlign === 'center') {
              textAlign = 'center';
              x$$1 -= widest / 2;
            } else {
              textAlign = 'left';
              x$$1 -= widest;
            }
          } else {
            x$$1 = this.left + tickAndPadding;
            if (crossAlign === 'near') {
              textAlign = 'left';
            } else if (crossAlign === 'center') {
              textAlign = 'center';
              x$$1 += widest / 2;
            } else {
              textAlign = 'right';
              x$$1 = this.right;
            }
          }
        } else {
          textAlign = 'right';
        }
        return {
          textAlign: textAlign,
          x: x$$1
        };
      }
    }, {
      key: "_computeLabelArea",
      value: function _computeLabelArea() {
        if (this.options.ticks.mirror) {
          return;
        }
        var chart = this.chart;
        var position = this.options.position;
        if (position === 'left' || position === 'right') {
          return {
            top: 0,
            left: this.left,
            bottom: chart.height,
            right: this.right
          };
        }
        if (position === 'top' || position === 'bottom') {
          return {
            top: this.top,
            left: 0,
            bottom: this.bottom,
            right: chart.width
          };
        }
      }
    }, {
      key: "drawBackground",
      value: function drawBackground() {
        var ctx = this.ctx,
          backgroundColor = this.options.backgroundColor,
          left = this.left,
          top = this.top,
          width = this.width,
          height = this.height;
        if (backgroundColor) {
          ctx.save();
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(left, top, width, height);
          ctx.restore();
        }
      }
    }, {
      key: "getLineWidthForValue",
      value: function getLineWidthForValue(value) {
        var grid = this.options.grid;
        if (!this._isVisible() || !grid.display) {
          return 0;
        }
        var ticks = this.ticks;
        var index = ticks.findIndex(function (t$$1) {
          return t$$1.value === value;
        });
        if (index >= 0) {
          var opts = grid.setContext(this.getContext(index));
          return opts.lineWidth;
        }
        return 0;
      }
    }, {
      key: "drawGrid",
      value: function drawGrid(chartArea) {
        var grid = this.options.grid;
        var ctx = this.ctx;
        var items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
        var i$$1, ilen;
        var drawLine = function drawLine(p1, p2, style) {
          if (!style.width || !style.color) {
            return;
          }
          ctx.save();
          ctx.lineWidth = style.width;
          ctx.strokeStyle = style.color;
          ctx.setLineDash(style.borderDash || []);
          ctx.lineDashOffset = style.borderDashOffset;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        };
        if (grid.display) {
          for (i$$1 = 0, ilen = items.length; i$$1 < ilen; ++i$$1) {
            var item = items[i$$1];
            if (grid.drawOnChartArea) {
              drawLine({
                x: item.x1,
                y: item.y1
              }, {
                x: item.x2,
                y: item.y2
              }, item);
            }
            if (grid.drawTicks) {
              drawLine({
                x: item.tx1,
                y: item.ty1
              }, {
                x: item.tx2,
                y: item.ty2
              }, {
                color: item.tickColor,
                width: item.tickWidth,
                borderDash: item.tickBorderDash,
                borderDashOffset: item.tickBorderDashOffset
              });
            }
          }
        }
      }
    }, {
      key: "drawBorder",
      value: function drawBorder() {
        var chart = this.chart,
          ctx = this.ctx,
          _this$options10 = this.options,
          border = _this$options10.border,
          grid = _this$options10.grid;
        var borderOpts = border.setContext(this.getContext());
        var axisWidth = border.display ? borderOpts.width : 0;
        if (!axisWidth) {
          return;
        }
        var lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
        var borderValue = this._borderValue;
        var x1, x2, y1, y2;
        if (this.isHorizontal()) {
          x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
          x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
          y1 = y2 = borderValue;
        } else {
          y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
          y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
          x1 = x2 = borderValue;
        }
        ctx.save();
        ctx.lineWidth = borderOpts.width;
        ctx.strokeStyle = borderOpts.color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
      }
    }, {
      key: "drawLabels",
      value: function drawLabels(chartArea) {
        var optionTicks = this.options.ticks;
        if (!optionTicks.display) {
          return;
        }
        var ctx = this.ctx;
        var area = this._computeLabelArea();
        if (area) {
          clipArea(ctx, area);
        }
        var items = this.getLabelItems(chartArea);
        var _iterator10 = _createForOfIteratorHelper$1(items),
          _step10;
        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var item = _step10.value;
            var renderTextOptions = item.options;
            var tickFont = item.font;
            var label = item.label;
            var y$$1 = item.textOffset;
            renderText(ctx, label, 0, y$$1, tickFont, renderTextOptions);
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
        if (area) {
          unclipArea(ctx);
        }
      }
    }, {
      key: "drawTitle",
      value: function drawTitle() {
        var ctx = this.ctx,
          _this$options11 = this.options,
          position = _this$options11.position,
          title = _this$options11.title,
          reverse = _this$options11.reverse;
        if (!title.display) {
          return;
        }
        var font = toFont(title.font);
        var padding = toPadding(title.padding);
        var align = title.align;
        var offset = font.lineHeight / 2;
        if (position === 'bottom' || position === 'center' || isObject(position)) {
          offset += padding.bottom;
          if (isArray(title.text)) {
            offset += font.lineHeight * (title.text.length - 1);
          }
        } else {
          offset += padding.top;
        }
        var _titleArgs = titleArgs(this, offset, position, align),
          titleX = _titleArgs.titleX,
          titleY = _titleArgs.titleY,
          maxWidth = _titleArgs.maxWidth,
          rotation = _titleArgs.rotation;
        renderText(ctx, title.text, 0, 0, font, {
          color: title.color,
          maxWidth: maxWidth,
          rotation: rotation,
          textAlign: titleAlign(align, position, reverse),
          textBaseline: 'middle',
          translation: [titleX, titleY]
        });
      }
    }, {
      key: "draw",
      value: function draw(chartArea) {
        if (!this._isVisible()) {
          return;
        }
        this.drawBackground();
        this.drawGrid(chartArea);
        this.drawBorder();
        this.drawTitle();
        this.drawLabels(chartArea);
      }
    }, {
      key: "_layers",
      value: function _layers() {
        var _this10 = this;
        var opts = this.options;
        var tz = opts.ticks && opts.ticks.z || 0;
        var gz = valueOrDefault(opts.grid && opts.grid.z, -1);
        var bz = valueOrDefault(opts.border && opts.border.z, 0);
        if (!this._isVisible() || this.draw !== Scale.prototype.draw) {
          return [{
            z: tz,
            draw: function draw(chartArea) {
              _this10.draw(chartArea);
            }
          }];
        }
        return [{
          z: gz,
          draw: function draw(chartArea) {
            _this10.drawBackground();
            _this10.drawGrid(chartArea);
            _this10.drawTitle();
          }
        }, {
          z: bz,
          draw: function draw() {
            _this10.drawBorder();
          }
        }, {
          z: tz,
          draw: function draw(chartArea) {
            _this10.drawLabels(chartArea);
          }
        }];
      }
    }, {
      key: "getMatchingVisibleMetas",
      value: function getMatchingVisibleMetas(type) {
        var metas = this.chart.getSortedVisibleDatasetMetas();
        var axisID = this.axis + 'AxisID';
        var result = [];
        var i$$1, ilen;
        for (i$$1 = 0, ilen = metas.length; i$$1 < ilen; ++i$$1) {
          var meta = metas[i$$1];
          if (meta[axisID] === this.id && (!type || meta.type === type)) {
            result.push(meta);
          }
        }
        return result;
      }
    }, {
      key: "_resolveTickFontOptions",
      value: function _resolveTickFontOptions(index) {
        var opts = this.options.ticks.setContext(this.getContext(index));
        return toFont(opts.font);
      }
    }, {
      key: "_maxDigits",
      value: function _maxDigits() {
        var fontSize = this._resolveTickFontOptions(0).lineHeight;
        return (this.isHorizontal() ? this.width : this.height) / fontSize;
      }
    }]);
    return Scale;
  }(Element);
  var TypedRegistry = /*#__PURE__*/function () {
    function TypedRegistry(type, scope, override) {
      babelHelpers.classCallCheck(this, TypedRegistry);
      this.type = type;
      this.scope = scope;
      this.override = override;
      this.items = Object.create(null);
    }
    babelHelpers.createClass(TypedRegistry, [{
      key: "isForType",
      value: function isForType(type) {
        return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
      }
    }, {
      key: "register",
      value: function register(item) {
        var proto = Object.getPrototypeOf(item);
        var parentScope;
        if (isIChartComponent(proto)) {
          parentScope = this.register(proto);
        }
        var items = this.items;
        var id = item.id;
        var scope = this.scope + '.' + id;
        if (!id) {
          throw new Error('class does not have id: ' + item);
        }
        if (id in items) {
          return scope;
        }
        items[id] = item;
        registerDefaults(item, scope, parentScope);
        if (this.override) {
          defaults.override(item.id, item.overrides);
        }
        return scope;
      }
    }, {
      key: "get",
      value: function get(id) {
        return this.items[id];
      }
    }, {
      key: "unregister",
      value: function unregister(item) {
        var items = this.items;
        var id = item.id;
        var scope = this.scope;
        if (id in items) {
          delete items[id];
        }
        if (scope && id in defaults[scope]) {
          delete defaults[scope][id];
          if (this.override) {
            delete overrides[id];
          }
        }
      }
    }]);
    return TypedRegistry;
  }();
  function registerDefaults(item, scope, parentScope) {
    var itemDefaults = merge(Object.create(null), [parentScope ? defaults.get(parentScope) : {}, defaults.get(scope), item.defaults]);
    defaults.set(scope, itemDefaults);
    if (item.defaultRoutes) {
      routeDefaults(scope, item.defaultRoutes);
    }
    if (item.descriptors) {
      defaults.describe(scope, item.descriptors);
    }
  }
  function routeDefaults(scope, routes) {
    Object.keys(routes).forEach(function (property) {
      var propertyParts = property.split('.');
      var sourceName = propertyParts.pop();
      var sourceScope = [scope].concat(propertyParts).join('.');
      var parts = routes[property].split('.');
      var targetName = parts.pop();
      var targetScope = parts.join('.');
      defaults.route(sourceScope, sourceName, targetScope, targetName);
    });
  }
  function isIChartComponent(proto) {
    return 'id' in proto && 'defaults' in proto;
  }
  var Registry = /*#__PURE__*/function () {
    function Registry() {
      babelHelpers.classCallCheck(this, Registry);
      this.controllers = new TypedRegistry(DatasetController, 'datasets', true);
      this.elements = new TypedRegistry(Element, 'elements');
      this.plugins = new TypedRegistry(Object, 'plugins');
      this.scales = new TypedRegistry(Scale, 'scales');
      this._typedRegistries = [this.controllers, this.scales, this.elements];
    }
    babelHelpers.createClass(Registry, [{
      key: "add",
      value: function add() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        this._each('register', args);
      }
    }, {
      key: "remove",
      value: function remove() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        this._each('unregister', args);
      }
    }, {
      key: "addControllers",
      value: function addControllers() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }
        this._each('register', args, this.controllers);
      }
    }, {
      key: "addElements",
      value: function addElements() {
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }
        this._each('register', args, this.elements);
      }
    }, {
      key: "addPlugins",
      value: function addPlugins() {
        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }
        this._each('register', args, this.plugins);
      }
    }, {
      key: "addScales",
      value: function addScales() {
        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }
        this._each('register', args, this.scales);
      }
    }, {
      key: "getController",
      value: function getController(id) {
        return this._get(id, this.controllers, 'controller');
      }
    }, {
      key: "getElement",
      value: function getElement(id) {
        return this._get(id, this.elements, 'element');
      }
    }, {
      key: "getPlugin",
      value: function getPlugin(id) {
        return this._get(id, this.plugins, 'plugin');
      }
    }, {
      key: "getScale",
      value: function getScale(id) {
        return this._get(id, this.scales, 'scale');
      }
    }, {
      key: "removeControllers",
      value: function removeControllers() {
        for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }
        this._each('unregister', args, this.controllers);
      }
    }, {
      key: "removeElements",
      value: function removeElements() {
        for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
          args[_key8] = arguments[_key8];
        }
        this._each('unregister', args, this.elements);
      }
    }, {
      key: "removePlugins",
      value: function removePlugins() {
        for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
          args[_key9] = arguments[_key9];
        }
        this._each('unregister', args, this.plugins);
      }
    }, {
      key: "removeScales",
      value: function removeScales() {
        for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
          args[_key10] = arguments[_key10];
        }
        this._each('unregister', args, this.scales);
      }
    }, {
      key: "_each",
      value: function _each(method, args, typedRegistry) {
        var _this11 = this;
        babelHelpers.toConsumableArray(args).forEach(function (arg) {
          var reg = typedRegistry || _this11._getRegistryForType(arg);
          if (typedRegistry || reg.isForType(arg) || reg === _this11.plugins && arg.id) {
            _this11._exec(method, reg, arg);
          } else {
            each(arg, function (item) {
              var itemReg = typedRegistry || _this11._getRegistryForType(item);
              _this11._exec(method, itemReg, item);
            });
          }
        });
      }
    }, {
      key: "_exec",
      value: function _exec(method, registry, component) {
        var camelMethod = _capitalize(method);
        callback(component['before' + camelMethod], [], component);
        registry[method](component);
        callback(component['after' + camelMethod], [], component);
      }
    }, {
      key: "_getRegistryForType",
      value: function _getRegistryForType(type) {
        for (var i$$1 = 0; i$$1 < this._typedRegistries.length; i$$1++) {
          var reg = this._typedRegistries[i$$1];
          if (reg.isForType(type)) {
            return reg;
          }
        }
        return this.plugins;
      }
    }, {
      key: "_get",
      value: function _get(id, typedRegistry, type) {
        var item = typedRegistry.get(id);
        if (item === undefined) {
          throw new Error('"' + id + '" is not a registered ' + type + '.');
        }
        return item;
      }
    }]);
    return Registry;
  }();
  var registry = /* #__PURE__ */new Registry();
  var PluginService = /*#__PURE__*/function () {
    function PluginService() {
      babelHelpers.classCallCheck(this, PluginService);
      this._init = [];
    }
    babelHelpers.createClass(PluginService, [{
      key: "notify",
      value: function notify(chart, hook, args, filter) {
        if (hook === 'beforeInit') {
          this._init = this._createDescriptors(chart, true);
          this._notify(this._init, chart, 'install');
        }
        var descriptors$$1 = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
        var result = this._notify(descriptors$$1, chart, hook, args);
        if (hook === 'afterDestroy') {
          this._notify(descriptors$$1, chart, 'stop');
          this._notify(this._init, chart, 'uninstall');
        }
        return result;
      }
    }, {
      key: "_notify",
      value: function _notify(descriptors$$1, chart, hook, args) {
        args = args || {};
        var _iterator11 = _createForOfIteratorHelper$1(descriptors$$1),
          _step11;
        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var descriptor = _step11.value;
            var plugin = descriptor.plugin;
            var method = plugin[hook];
            var params = [chart, args, descriptor.options];
            if (callback(method, params, plugin) === false && args.cancelable) {
              return false;
            }
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }
        return true;
      }
    }, {
      key: "invalidate",
      value: function invalidate() {
        if (!isNullOrUndef(this._cache)) {
          this._oldCache = this._cache;
          this._cache = undefined;
        }
      }
    }, {
      key: "_descriptors",
      value: function _descriptors$$1(chart) {
        if (this._cache) {
          return this._cache;
        }
        var descriptors$$1 = this._cache = this._createDescriptors(chart);
        this._notifyStateChanges(chart);
        return descriptors$$1;
      }
    }, {
      key: "_createDescriptors",
      value: function _createDescriptors(chart, all) {
        var config = chart && chart.config;
        var options = valueOrDefault(config.options && config.options.plugins, {});
        var plugins = allPlugins(config);
        return options === false && !all ? [] : createDescriptors(chart, plugins, options, all);
      }
    }, {
      key: "_notifyStateChanges",
      value: function _notifyStateChanges(chart) {
        var previousDescriptors = this._oldCache || [];
        var descriptors$$1 = this._cache;
        var diff = function diff(a$$1, b$$1) {
          return a$$1.filter(function (x$$1) {
            return !b$$1.some(function (y$$1) {
              return x$$1.plugin.id === y$$1.plugin.id;
            });
          });
        };
        this._notify(diff(previousDescriptors, descriptors$$1), chart, 'stop');
        this._notify(diff(descriptors$$1, previousDescriptors), chart, 'start');
      }
    }]);
    return PluginService;
  }();
  function allPlugins(config) {
    var localIds = {};
    var plugins = [];
    var keys = Object.keys(registry.plugins.items);
    for (var i$$1 = 0; i$$1 < keys.length; i$$1++) {
      plugins.push(registry.getPlugin(keys[i$$1]));
    }
    var local = config.plugins || [];
    for (var i1 = 0; i1 < local.length; i1++) {
      var plugin = local[i1];
      if (plugins.indexOf(plugin) === -1) {
        plugins.push(plugin);
        localIds[plugin.id] = true;
      }
    }
    return {
      plugins: plugins,
      localIds: localIds
    };
  }
  function getOpts(options, all) {
    if (!all && options === false) {
      return null;
    }
    if (options === true) {
      return {};
    }
    return options;
  }
  function createDescriptors(chart, _ref2, options, all) {
    var plugins = _ref2.plugins,
      localIds = _ref2.localIds;
    var result = [];
    var context = chart.getContext();
    var _iterator12 = _createForOfIteratorHelper$1(plugins),
      _step12;
    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        var plugin = _step12.value;
        var id = plugin.id;
        var opts = getOpts(options[id], all);
        if (opts === null) {
          continue;
        }
        result.push({
          plugin: plugin,
          options: pluginOpts(chart.config, {
            plugin: plugin,
            local: localIds[id]
          }, opts, context)
        });
      }
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }
    return result;
  }
  function pluginOpts(config, _ref3, opts, context) {
    var plugin = _ref3.plugin,
      local = _ref3.local;
    var keys = config.pluginScopeKeys(plugin);
    var scopes = config.getOptionScopes(opts, keys);
    if (local && plugin.defaults) {
      scopes.push(plugin.defaults);
    }
    return config.createResolver(scopes, context, [''], {
      scriptable: false,
      indexable: false,
      allKeys: true
    });
  }
  function getIndexAxis(type, options) {
    var datasetDefaults = defaults.datasets[type] || {};
    var datasetOptions = (options.datasets || {})[type] || {};
    return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || 'x';
  }
  function getAxisFromDefaultScaleID(id, indexAxis) {
    var axis = id;
    if (id === '_index_') {
      axis = indexAxis;
    } else if (id === '_value_') {
      axis = indexAxis === 'x' ? 'y' : 'x';
    }
    return axis;
  }
  function getDefaultScaleIDFromAxis(axis, indexAxis) {
    return axis === indexAxis ? '_index_' : '_value_';
  }
  function axisFromPosition(position) {
    if (position === 'top' || position === 'bottom') {
      return 'x';
    }
    if (position === 'left' || position === 'right') {
      return 'y';
    }
  }
  function determineAxis(id, scaleOptions) {
    if (id === 'x' || id === 'y' || id === 'r') {
      return id;
    }
    id = scaleOptions.axis || axisFromPosition(scaleOptions.position) || id.length > 1 && determineAxis(id[0].toLowerCase(), scaleOptions);
    if (id) {
      return id;
    }
    throw new Error("Cannot determine type of '".concat(name, "' axis. Please provide 'axis' or 'position' option."));
  }
  function mergeScaleConfig(config, options) {
    var chartDefaults = overrides[config.type] || {
      scales: {}
    };
    var configScales = options.scales || {};
    var chartIndexAxis = getIndexAxis(config.type, options);
    var scales = Object.create(null);
    Object.keys(configScales).forEach(function (id) {
      var scaleConf = configScales[id];
      if (!isObject(scaleConf)) {
        return console.error("Invalid scale configuration for scale: ".concat(id));
      }
      if (scaleConf._proxy) {
        return console.warn("Ignoring resolver passed as options for scale: ".concat(id));
      }
      var axis = determineAxis(id, scaleConf);
      var defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
      var defaultScaleOptions = chartDefaults.scales || {};
      scales[id] = mergeIf(Object.create(null), [{
        axis: axis
      }, scaleConf, defaultScaleOptions[axis], defaultScaleOptions[defaultId]]);
    });
    config.data.datasets.forEach(function (dataset) {
      var type = dataset.type || config.type;
      var indexAxis = dataset.indexAxis || getIndexAxis(type, options);
      var datasetDefaults = overrides[type] || {};
      var defaultScaleOptions = datasetDefaults.scales || {};
      Object.keys(defaultScaleOptions).forEach(function (defaultID) {
        var axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
        var id = dataset[axis + 'AxisID'] || axis;
        scales[id] = scales[id] || Object.create(null);
        mergeIf(scales[id], [{
          axis: axis
        }, configScales[id], defaultScaleOptions[defaultID]]);
      });
    });
    Object.keys(scales).forEach(function (key) {
      var scale = scales[key];
      mergeIf(scale, [defaults.scales[scale.type], defaults.scale]);
    });
    return scales;
  }
  function initOptions(config) {
    var options = config.options || (config.options = {});
    options.plugins = valueOrDefault(options.plugins, {});
    options.scales = mergeScaleConfig(config, options);
  }
  function initData(data) {
    data = data || {};
    data.datasets = data.datasets || [];
    data.labels = data.labels || [];
    return data;
  }
  function initConfig(config) {
    config = config || {};
    config.data = initData(config.data);
    initOptions(config);
    return config;
  }
  var keyCache = new Map();
  var keysCached = new Set();
  function cachedKeys(cacheKey, generate) {
    var keys = keyCache.get(cacheKey);
    if (!keys) {
      keys = generate();
      keyCache.set(cacheKey, keys);
      keysCached.add(keys);
    }
    return keys;
  }
  var addIfFound = function addIfFound(set, obj, key) {
    var opts = resolveObjectKey(obj, key);
    if (opts !== undefined) {
      set.add(opts);
    }
  };
  var Config = /*#__PURE__*/function () {
    function Config(config) {
      babelHelpers.classCallCheck(this, Config);
      this._config = initConfig(config);
      this._scopeCache = new Map();
      this._resolverCache = new Map();
    }
    babelHelpers.createClass(Config, [{
      key: "update",
      value: function update() {
        var config = this._config;
        this.clearCache();
        initOptions(config);
      }
    }, {
      key: "clearCache",
      value: function clearCache() {
        this._scopeCache.clear();
        this._resolverCache.clear();
      }
    }, {
      key: "datasetScopeKeys",
      value: function datasetScopeKeys(datasetType) {
        return cachedKeys(datasetType, function () {
          return [["datasets.".concat(datasetType), '']];
        });
      }
    }, {
      key: "datasetAnimationScopeKeys",
      value: function datasetAnimationScopeKeys(datasetType, transition) {
        return cachedKeys("".concat(datasetType, ".transition.").concat(transition), function () {
          return [["datasets.".concat(datasetType, ".transitions.").concat(transition), "transitions.".concat(transition)], ["datasets.".concat(datasetType), '']];
        });
      }
    }, {
      key: "datasetElementScopeKeys",
      value: function datasetElementScopeKeys(datasetType, elementType) {
        return cachedKeys("".concat(datasetType, "-").concat(elementType), function () {
          return [["datasets.".concat(datasetType, ".elements.").concat(elementType), "datasets.".concat(datasetType), "elements.".concat(elementType), '']];
        });
      }
    }, {
      key: "pluginScopeKeys",
      value: function pluginScopeKeys(plugin) {
        var id = plugin.id;
        var type = this.type;
        return cachedKeys("".concat(type, "-plugin-").concat(id), function () {
          return [["plugins.".concat(id)].concat(babelHelpers.toConsumableArray(plugin.additionalOptionScopes || []))];
        });
      }
    }, {
      key: "_cachedScopes",
      value: function _cachedScopes(mainScope, resetCache) {
        var _scopeCache = this._scopeCache;
        var cache = _scopeCache.get(mainScope);
        if (!cache || resetCache) {
          cache = new Map();
          _scopeCache.set(mainScope, cache);
        }
        return cache;
      }
    }, {
      key: "getOptionScopes",
      value: function getOptionScopes(mainScope, keyLists, resetCache) {
        var options = this.options,
          type = this.type;
        var cache = this._cachedScopes(mainScope, resetCache);
        var cached = cache.get(keyLists);
        if (cached) {
          return cached;
        }
        var scopes = new Set();
        keyLists.forEach(function (keys) {
          if (mainScope) {
            scopes.add(mainScope);
            keys.forEach(function (key) {
              return addIfFound(scopes, mainScope, key);
            });
          }
          keys.forEach(function (key) {
            return addIfFound(scopes, options, key);
          });
          keys.forEach(function (key) {
            return addIfFound(scopes, overrides[type] || {}, key);
          });
          keys.forEach(function (key) {
            return addIfFound(scopes, defaults, key);
          });
          keys.forEach(function (key) {
            return addIfFound(scopes, descriptors, key);
          });
        });
        var array = Array.from(scopes);
        if (array.length === 0) {
          array.push(Object.create(null));
        }
        if (keysCached.has(keyLists)) {
          cache.set(keyLists, array);
        }
        return array;
      }
    }, {
      key: "chartOptionScopes",
      value: function chartOptionScopes() {
        var options = this.options,
          type = this.type;
        return [options, overrides[type] || {}, defaults.datasets[type] || {}, {
          type: type
        }, defaults, descriptors];
      }
    }, {
      key: "resolveNamedOptions",
      value: function resolveNamedOptions(scopes, names, context) {
        var prefixes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [''];
        var result = {
          $shared: true
        };
        var _getResolver = getResolver(this._resolverCache, scopes, prefixes),
          resolver = _getResolver.resolver,
          subPrefixes = _getResolver.subPrefixes;
        var options = resolver;
        if (needContext(resolver, names)) {
          result.$shared = false;
          context = isFunction(context) ? context() : context;
          var subResolver = this.createResolver(scopes, context, subPrefixes);
          options = _attachContext(resolver, context, subResolver);
        }
        var _iterator13 = _createForOfIteratorHelper$1(names),
          _step13;
        try {
          for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
            var prop = _step13.value;
            result[prop] = options[prop];
          }
        } catch (err) {
          _iterator13.e(err);
        } finally {
          _iterator13.f();
        }
        return result;
      }
    }, {
      key: "createResolver",
      value: function createResolver(scopes, context) {
        var prefixes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [''];
        var descriptorDefaults = arguments.length > 3 ? arguments[3] : undefined;
        var _getResolver2 = getResolver(this._resolverCache, scopes, prefixes),
          resolver = _getResolver2.resolver;
        return isObject(context) ? _attachContext(resolver, context, undefined, descriptorDefaults) : resolver;
      }
    }, {
      key: "platform",
      get: function get() {
        return this._config.platform;
      }
    }, {
      key: "type",
      get: function get() {
        return this._config.type;
      },
      set: function set(type) {
        this._config.type = type;
      }
    }, {
      key: "data",
      get: function get() {
        return this._config.data;
      },
      set: function set(data) {
        this._config.data = initData(data);
      }
    }, {
      key: "options",
      get: function get() {
        return this._config.options;
      },
      set: function set(options) {
        this._config.options = options;
      }
    }, {
      key: "plugins",
      get: function get() {
        return this._config.plugins;
      }
    }]);
    return Config;
  }();
  function getResolver(resolverCache, scopes, prefixes) {
    var cache = resolverCache.get(scopes);
    if (!cache) {
      cache = new Map();
      resolverCache.set(scopes, cache);
    }
    var cacheKey = prefixes.join();
    var cached = cache.get(cacheKey);
    if (!cached) {
      var resolver = _createResolver(scopes, prefixes);
      cached = {
        resolver: resolver,
        subPrefixes: prefixes.filter(function (p$$1) {
          return !p$$1.toLowerCase().includes('hover');
        })
      };
      cache.set(cacheKey, cached);
    }
    return cached;
  }
  var hasFunction = function hasFunction(value) {
    return isObject(value) && Object.getOwnPropertyNames(value).reduce(function (acc, key) {
      return acc || isFunction(value[key]);
    }, false);
  };
  function needContext(proxy, names) {
    var _descriptors2 = _descriptors(proxy),
      isScriptable = _descriptors2.isScriptable,
      isIndexable = _descriptors2.isIndexable;
    var _iterator14 = _createForOfIteratorHelper$1(names),
      _step14;
    try {
      for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
        var prop = _step14.value;
        var scriptable = isScriptable(prop);
        var indexable = isIndexable(prop);
        var value = (indexable || scriptable) && proxy[prop];
        if (scriptable && (isFunction(value) || hasFunction(value)) || indexable && isArray(value)) {
          return true;
        }
      }
    } catch (err) {
      _iterator14.e(err);
    } finally {
      _iterator14.f();
    }
    return false;
  }
  var version = "4.2.1";
  var KNOWN_POSITIONS = ['top', 'bottom', 'left', 'right', 'chartArea'];
  function positionIsHorizontal(position, axis) {
    return position === 'top' || position === 'bottom' || KNOWN_POSITIONS.indexOf(position) === -1 && axis === 'x';
  }
  function compare2Level(l1, l2) {
    return function (a$$1, b$$1) {
      return a$$1[l1] === b$$1[l1] ? a$$1[l2] - b$$1[l2] : a$$1[l1] - b$$1[l1];
    };
  }
  function onAnimationsComplete(context) {
    var chart = context.chart;
    var animationOptions = chart.options.animation;
    chart.notifyPlugins('afterRender');
    callback(animationOptions && animationOptions.onComplete, [context], chart);
  }
  function onAnimationProgress(context) {
    var chart = context.chart;
    var animationOptions = chart.options.animation;
    callback(animationOptions && animationOptions.onProgress, [context], chart);
  }
  function getCanvas(item) {
    if (_isDomSupported() && typeof item === 'string') {
      item = document.getElementById(item);
    } else if (item && item.length) {
      item = item[0];
    }
    if (item && item.canvas) {
      item = item.canvas;
    }
    return item;
  }
  var instances = {};
  var getChart = function getChart(key) {
    var canvas = getCanvas(key);
    return Object.values(instances).filter(function (c$$1) {
      return c$$1.canvas === canvas;
    }).pop();
  };
  function moveNumericKeys(obj, start, move) {
    var keys = Object.keys(obj);
    for (var _i2 = 0, _keys = keys; _i2 < _keys.length; _i2++) {
      var key = _keys[_i2];
      var intKey = +key;
      if (intKey >= start) {
        var value = obj[key];
        delete obj[key];
        if (move > 0 || intKey > start) {
          obj[intKey + move] = value;
        }
      }
    }
  }
  function determineLastEvent(e$$1, lastEvent, inChartArea, isClick) {
    if (!inChartArea || e$$1.type === 'mouseout') {
      return null;
    }
    if (isClick) {
      return lastEvent;
    }
    return e$$1;
  }
  function getDatasetArea(meta) {
    var xScale = meta.xScale,
      yScale = meta.yScale;
    if (xScale && yScale) {
      return {
        left: xScale.left,
        right: xScale.right,
        top: yScale.top,
        bottom: yScale.bottom
      };
    }
  }
  var Chart = /*#__PURE__*/function () {
    babelHelpers.createClass(Chart, null, [{
      key: "register",
      value: function register() {
        registry.add.apply(registry, arguments);
        invalidatePlugins();
      }
    }, {
      key: "unregister",
      value: function unregister() {
        registry.remove.apply(registry, arguments);
        invalidatePlugins();
      }
    }]);
    function Chart(item, userConfig) {
      var _this12 = this;
      babelHelpers.classCallCheck(this, Chart);
      var config = this.config = new Config(userConfig);
      var initialCanvas = getCanvas(item);
      var existingChart = getChart(initialCanvas);
      if (existingChart) {
        throw new Error('Canvas is already in use. Chart with ID \'' + existingChart.id + '\'' + ' must be destroyed before the canvas with ID \'' + existingChart.canvas.id + '\' can be reused.');
      }
      var options = config.createResolver(config.chartOptionScopes(), this.getContext());
      this.platform = new (config.platform || _detectPlatform(initialCanvas))();
      this.platform.updateConfig(config);
      var context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
      var canvas = context && context.canvas;
      var height = canvas && canvas.height;
      var width = canvas && canvas.width;
      this.id = uid();
      this.ctx = context;
      this.canvas = canvas;
      this.width = width;
      this.height = height;
      this._options = options;
      this._aspectRatio = this.aspectRatio;
      this._layers = [];
      this._metasets = [];
      this._stacks = undefined;
      this.boxes = [];
      this.currentDevicePixelRatio = undefined;
      this.chartArea = undefined;
      this._active = [];
      this._lastEvent = undefined;
      this._listeners = {};
      this._responsiveListeners = undefined;
      this._sortedMetasets = [];
      this.scales = {};
      this._plugins = new PluginService();
      this.$proxies = {};
      this._hiddenIndices = {};
      this.attached = false;
      this._animationsDisabled = undefined;
      this.$context = undefined;
      this._doResize = debounce(function (mode) {
        return _this12.update(mode);
      }, options.resizeDelay || 0);
      this._dataChanges = [];
      instances[this.id] = this;
      if (!context || !canvas) {
        console.error("Failed to create chart: can't acquire context from the given item");
        return;
      }
      animator.listen(this, 'complete', onAnimationsComplete);
      animator.listen(this, 'progress', onAnimationProgress);
      this._initialize();
      if (this.attached) {
        this.update();
      }
    }
    babelHelpers.createClass(Chart, [{
      key: "_initialize",
      value: function _initialize() {
        this.notifyPlugins('beforeInit');
        if (this.options.responsive) {
          this.resize();
        } else {
          retinaScale(this, this.options.devicePixelRatio);
        }
        this.bindEvents();
        this.notifyPlugins('afterInit');
        return this;
      }
    }, {
      key: "clear",
      value: function clear() {
        clearCanvas(this.canvas, this.ctx);
        return this;
      }
    }, {
      key: "stop",
      value: function stop() {
        animator.stop(this);
        return this;
      }
    }, {
      key: "resize",
      value: function resize(width, height) {
        if (!animator.running(this)) {
          this._resize(width, height);
        } else {
          this._resizeBeforeDraw = {
            width: width,
            height: height
          };
        }
      }
    }, {
      key: "_resize",
      value: function _resize(width, height) {
        var options = this.options;
        var canvas = this.canvas;
        var aspectRatio = options.maintainAspectRatio && this.aspectRatio;
        var newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
        var newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
        var mode = this.width ? 'resize' : 'attach';
        this.width = newSize.width;
        this.height = newSize.height;
        this._aspectRatio = this.aspectRatio;
        if (!retinaScale(this, newRatio, true)) {
          return;
        }
        this.notifyPlugins('resize', {
          size: newSize
        });
        callback(options.onResize, [this, newSize], this);
        if (this.attached) {
          if (this._doResize(mode)) {
            this.render();
          }
        }
      }
    }, {
      key: "ensureScalesHaveIDs",
      value: function ensureScalesHaveIDs() {
        var options = this.options;
        var scalesOptions = options.scales || {};
        each(scalesOptions, function (axisOptions, axisID) {
          axisOptions.id = axisID;
        });
      }
    }, {
      key: "buildOrUpdateScales",
      value: function buildOrUpdateScales() {
        var _this13 = this;
        var options = this.options;
        var scaleOpts = options.scales;
        var scales = this.scales;
        var updated = Object.keys(scales).reduce(function (obj, id) {
          obj[id] = false;
          return obj;
        }, {});
        var items = [];
        if (scaleOpts) {
          items = items.concat(Object.keys(scaleOpts).map(function (id) {
            var scaleOptions = scaleOpts[id];
            var axis = determineAxis(id, scaleOptions);
            var isRadial = axis === 'r';
            var isHorizontal = axis === 'x';
            return {
              options: scaleOptions,
              dposition: isRadial ? 'chartArea' : isHorizontal ? 'bottom' : 'left',
              dtype: isRadial ? 'radialLinear' : isHorizontal ? 'category' : 'linear'
            };
          }));
        }
        each(items, function (item) {
          var scaleOptions = item.options;
          var id = scaleOptions.id;
          var axis = determineAxis(id, scaleOptions);
          var scaleType = valueOrDefault(scaleOptions.type, item.dtype);
          if (scaleOptions.position === undefined || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
            scaleOptions.position = item.dposition;
          }
          updated[id] = true;
          var scale = null;
          if (id in scales && scales[id].type === scaleType) {
            scale = scales[id];
          } else {
            var scaleClass = registry.getScale(scaleType);
            scale = new scaleClass({
              id: id,
              type: scaleType,
              ctx: _this13.ctx,
              chart: _this13
            });
            scales[scale.id] = scale;
          }
          scale.init(scaleOptions, options);
        });
        each(updated, function (hasUpdated, id) {
          if (!hasUpdated) {
            delete scales[id];
          }
        });
        each(scales, function (scale) {
          layouts.configure(_this13, scale, scale.options);
          layouts.addBox(_this13, scale);
        });
      }
    }, {
      key: "_updateMetasets",
      value: function _updateMetasets() {
        var metasets = this._metasets;
        var numData = this.data.datasets.length;
        var numMeta = metasets.length;
        metasets.sort(function (a$$1, b$$1) {
          return a$$1.index - b$$1.index;
        });
        if (numMeta > numData) {
          for (var i$$1 = numData; i$$1 < numMeta; ++i$$1) {
            this._destroyDatasetMeta(i$$1);
          }
          metasets.splice(numData, numMeta - numData);
        }
        this._sortedMetasets = metasets.slice(0).sort(compare2Level('order', 'index'));
      }
    }, {
      key: "_removeUnreferencedMetasets",
      value: function _removeUnreferencedMetasets() {
        var _this14 = this;
        var metasets = this._metasets,
          datasets = this.data.datasets;
        if (metasets.length > datasets.length) {
          delete this._stacks;
        }
        metasets.forEach(function (meta, index) {
          if (datasets.filter(function (x$$1) {
            return x$$1 === meta._dataset;
          }).length === 0) {
            _this14._destroyDatasetMeta(index);
          }
        });
      }
    }, {
      key: "buildOrUpdateControllers",
      value: function buildOrUpdateControllers() {
        var newControllers = [];
        var datasets = this.data.datasets;
        var i$$1, ilen;
        this._removeUnreferencedMetasets();
        for (i$$1 = 0, ilen = datasets.length; i$$1 < ilen; i$$1++) {
          var dataset = datasets[i$$1];
          var meta = this.getDatasetMeta(i$$1);
          var type = dataset.type || this.config.type;
          if (meta.type && meta.type !== type) {
            this._destroyDatasetMeta(i$$1);
            meta = this.getDatasetMeta(i$$1);
          }
          meta.type = type;
          meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
          meta.order = dataset.order || 0;
          meta.index = i$$1;
          meta.label = '' + dataset.label;
          meta.visible = this.isDatasetVisible(i$$1);
          if (meta.controller) {
            meta.controller.updateIndex(i$$1);
            meta.controller.linkScales();
          } else {
            var ControllerClass = registry.getController(type);
            var _defaults$datasets$ty = defaults.datasets[type],
              datasetElementType = _defaults$datasets$ty.datasetElementType,
              dataElementType = _defaults$datasets$ty.dataElementType;
            Object.assign(ControllerClass, {
              dataElementType: registry.getElement(dataElementType),
              datasetElementType: datasetElementType && registry.getElement(datasetElementType)
            });
            meta.controller = new ControllerClass(this, i$$1);
            newControllers.push(meta.controller);
          }
        }
        this._updateMetasets();
        return newControllers;
      }
    }, {
      key: "_resetElements",
      value: function _resetElements() {
        var _this15 = this;
        each(this.data.datasets, function (dataset, datasetIndex) {
          _this15.getDatasetMeta(datasetIndex).controller.reset();
        }, this);
      }
    }, {
      key: "reset",
      value: function reset() {
        this._resetElements();
        this.notifyPlugins('reset');
      }
    }, {
      key: "update",
      value: function update(mode) {
        var config = this.config;
        config.update();
        var options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
        var animsDisabled = this._animationsDisabled = !options.animation;
        this._updateScales();
        this._checkEventBindings();
        this._updateHiddenIndices();
        this._plugins.invalidate();
        if (this.notifyPlugins('beforeUpdate', {
          mode: mode,
          cancelable: true
        }) === false) {
          return;
        }
        var newControllers = this.buildOrUpdateControllers();
        this.notifyPlugins('beforeElementsUpdate');
        var minPadding = 0;
        for (var i$$1 = 0, ilen = this.data.datasets.length; i$$1 < ilen; i$$1++) {
          var _this$getDatasetMeta = this.getDatasetMeta(i$$1),
            controller = _this$getDatasetMeta.controller;
          var reset = !animsDisabled && newControllers.indexOf(controller) === -1;
          controller.buildOrUpdateElements(reset);
          minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
        }
        minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
        this._updateLayout(minPadding);
        if (!animsDisabled) {
          each(newControllers, function (controller) {
            controller.reset();
          });
        }
        this._updateDatasets(mode);
        this.notifyPlugins('afterUpdate', {
          mode: mode
        });
        this._layers.sort(compare2Level('z', '_idx'));
        var _active = this._active,
          _lastEvent = this._lastEvent;
        if (_lastEvent) {
          this._eventHandler(_lastEvent, true);
        } else if (_active.length) {
          this._updateHoverStyles(_active, _active, true);
        }
        this.render();
      }
    }, {
      key: "_updateScales",
      value: function _updateScales() {
        var _this16 = this;
        each(this.scales, function (scale) {
          layouts.removeBox(_this16, scale);
        });
        this.ensureScalesHaveIDs();
        this.buildOrUpdateScales();
      }
    }, {
      key: "_checkEventBindings",
      value: function _checkEventBindings() {
        var options = this.options;
        var existingEvents = new Set(Object.keys(this._listeners));
        var newEvents = new Set(options.events);
        if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
          this.unbindEvents();
          this.bindEvents();
        }
      }
    }, {
      key: "_updateHiddenIndices",
      value: function _updateHiddenIndices() {
        var _hiddenIndices = this._hiddenIndices;
        var changes = this._getUniformDataChanges() || [];
        var _iterator15 = _createForOfIteratorHelper$1(changes),
          _step15;
        try {
          for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
            var _step15$value = _step15.value,
              method = _step15$value.method,
              start = _step15$value.start,
              count = _step15$value.count;
            var move = method === '_removeElements' ? -count : count;
            moveNumericKeys(_hiddenIndices, start, move);
          }
        } catch (err) {
          _iterator15.e(err);
        } finally {
          _iterator15.f();
        }
      }
    }, {
      key: "_getUniformDataChanges",
      value: function _getUniformDataChanges() {
        var _dataChanges = this._dataChanges;
        if (!_dataChanges || !_dataChanges.length) {
          return;
        }
        this._dataChanges = [];
        var datasetCount = this.data.datasets.length;
        var makeSet = function makeSet(idx) {
          return new Set(_dataChanges.filter(function (c$$1) {
            return c$$1[0] === idx;
          }).map(function (c$$1, i$$1) {
            return i$$1 + ',' + c$$1.splice(1).join(',');
          }));
        };
        var changeSet = makeSet(0);
        for (var i$$1 = 1; i$$1 < datasetCount; i$$1++) {
          if (!setsEqual(changeSet, makeSet(i$$1))) {
            return;
          }
        }
        return Array.from(changeSet).map(function (c$$1) {
          return c$$1.split(',');
        }).map(function (a$$1) {
          return {
            method: a$$1[1],
            start: +a$$1[2],
            count: +a$$1[3]
          };
        });
      }
    }, {
      key: "_updateLayout",
      value: function _updateLayout(minPadding) {
        var _this17 = this;
        if (this.notifyPlugins('beforeLayout', {
          cancelable: true
        }) === false) {
          return;
        }
        layouts.update(this, this.width, this.height, minPadding);
        var area = this.chartArea;
        var noArea = area.width <= 0 || area.height <= 0;
        this._layers = [];
        each(this.boxes, function (box) {
          var _this17$_layers;
          if (noArea && box.position === 'chartArea') {
            return;
          }
          if (box.configure) {
            box.configure();
          }
          (_this17$_layers = _this17._layers).push.apply(_this17$_layers, babelHelpers.toConsumableArray(box._layers()));
        }, this);
        this._layers.forEach(function (item, index) {
          item._idx = index;
        });
        this.notifyPlugins('afterLayout');
      }
    }, {
      key: "_updateDatasets",
      value: function _updateDatasets(mode) {
        if (this.notifyPlugins('beforeDatasetsUpdate', {
          mode: mode,
          cancelable: true
        }) === false) {
          return;
        }
        for (var i$$1 = 0, ilen = this.data.datasets.length; i$$1 < ilen; ++i$$1) {
          this.getDatasetMeta(i$$1).controller.configure();
        }
        for (var i1 = 0, ilen1 = this.data.datasets.length; i1 < ilen1; ++i1) {
          this._updateDataset(i1, isFunction(mode) ? mode({
            datasetIndex: i1
          }) : mode);
        }
        this.notifyPlugins('afterDatasetsUpdate', {
          mode: mode
        });
      }
    }, {
      key: "_updateDataset",
      value: function _updateDataset(index, mode) {
        var meta = this.getDatasetMeta(index);
        var args = {
          meta: meta,
          index: index,
          mode: mode,
          cancelable: true
        };
        if (this.notifyPlugins('beforeDatasetUpdate', args) === false) {
          return;
        }
        meta.controller._update(mode);
        args.cancelable = false;
        this.notifyPlugins('afterDatasetUpdate', args);
      }
    }, {
      key: "render",
      value: function render() {
        if (this.notifyPlugins('beforeRender', {
          cancelable: true
        }) === false) {
          return;
        }
        if (animator.has(this)) {
          if (this.attached && !animator.running(this)) {
            animator.start(this);
          }
        } else {
          this.draw();
          onAnimationsComplete({
            chart: this
          });
        }
      }
    }, {
      key: "draw",
      value: function draw() {
        var i$$1;
        if (this._resizeBeforeDraw) {
          var _this$_resizeBeforeDr = this._resizeBeforeDraw,
            width = _this$_resizeBeforeDr.width,
            height = _this$_resizeBeforeDr.height;
          this._resize(width, height);
          this._resizeBeforeDraw = null;
        }
        this.clear();
        if (this.width <= 0 || this.height <= 0) {
          return;
        }
        if (this.notifyPlugins('beforeDraw', {
          cancelable: true
        }) === false) {
          return;
        }
        var layers = this._layers;
        for (i$$1 = 0; i$$1 < layers.length && layers[i$$1].z <= 0; ++i$$1) {
          layers[i$$1].draw(this.chartArea);
        }
        this._drawDatasets();
        for (; i$$1 < layers.length; ++i$$1) {
          layers[i$$1].draw(this.chartArea);
        }
        this.notifyPlugins('afterDraw');
      }
    }, {
      key: "_getSortedDatasetMetas",
      value: function _getSortedDatasetMetas(filterVisible) {
        var metasets = this._sortedMetasets;
        var result = [];
        var i$$1, ilen;
        for (i$$1 = 0, ilen = metasets.length; i$$1 < ilen; ++i$$1) {
          var meta = metasets[i$$1];
          if (!filterVisible || meta.visible) {
            result.push(meta);
          }
        }
        return result;
      }
    }, {
      key: "getSortedVisibleDatasetMetas",
      value: function getSortedVisibleDatasetMetas() {
        return this._getSortedDatasetMetas(true);
      }
    }, {
      key: "_drawDatasets",
      value: function _drawDatasets() {
        if (this.notifyPlugins('beforeDatasetsDraw', {
          cancelable: true
        }) === false) {
          return;
        }
        var metasets = this.getSortedVisibleDatasetMetas();
        for (var i$$1 = metasets.length - 1; i$$1 >= 0; --i$$1) {
          this._drawDataset(metasets[i$$1]);
        }
        this.notifyPlugins('afterDatasetsDraw');
      }
    }, {
      key: "_drawDataset",
      value: function _drawDataset(meta) {
        var ctx = this.ctx;
        var clip = meta._clip;
        var useClip = !clip.disabled;
        var area = getDatasetArea(meta) || this.chartArea;
        var args = {
          meta: meta,
          index: meta.index,
          cancelable: true
        };
        if (this.notifyPlugins('beforeDatasetDraw', args) === false) {
          return;
        }
        if (useClip) {
          clipArea(ctx, {
            left: clip.left === false ? 0 : area.left - clip.left,
            right: clip.right === false ? this.width : area.right + clip.right,
            top: clip.top === false ? 0 : area.top - clip.top,
            bottom: clip.bottom === false ? this.height : area.bottom + clip.bottom
          });
        }
        meta.controller.draw();
        if (useClip) {
          unclipArea(ctx);
        }
        args.cancelable = false;
        this.notifyPlugins('afterDatasetDraw', args);
      }
    }, {
      key: "isPointInArea",
      value: function isPointInArea(point) {
        return _isPointInArea(point, this.chartArea, this._minPadding);
      }
    }, {
      key: "getElementsAtEventForMode",
      value: function getElementsAtEventForMode(e$$1, mode, options, useFinalPosition) {
        var method = Interaction.modes[mode];
        if (typeof method === 'function') {
          return method(this, e$$1, options, useFinalPosition);
        }
        return [];
      }
    }, {
      key: "getDatasetMeta",
      value: function getDatasetMeta(datasetIndex) {
        var dataset = this.data.datasets[datasetIndex];
        var metasets = this._metasets;
        var meta = metasets.filter(function (x$$1) {
          return x$$1 && x$$1._dataset === dataset;
        }).pop();
        if (!meta) {
          meta = {
            type: null,
            data: [],
            dataset: null,
            controller: null,
            hidden: null,
            xAxisID: null,
            yAxisID: null,
            order: dataset && dataset.order || 0,
            index: datasetIndex,
            _dataset: dataset,
            _parsed: [],
            _sorted: false
          };
          metasets.push(meta);
        }
        return meta;
      }
    }, {
      key: "getContext",
      value: function getContext() {
        return this.$context || (this.$context = createContext(null, {
          chart: this,
          type: 'chart'
        }));
      }
    }, {
      key: "getVisibleDatasetCount",
      value: function getVisibleDatasetCount() {
        return this.getSortedVisibleDatasetMetas().length;
      }
    }, {
      key: "isDatasetVisible",
      value: function isDatasetVisible(datasetIndex) {
        var dataset = this.data.datasets[datasetIndex];
        if (!dataset) {
          return false;
        }
        var meta = this.getDatasetMeta(datasetIndex);
        return typeof meta.hidden === 'boolean' ? !meta.hidden : !dataset.hidden;
      }
    }, {
      key: "setDatasetVisibility",
      value: function setDatasetVisibility(datasetIndex, visible) {
        var meta = this.getDatasetMeta(datasetIndex);
        meta.hidden = !visible;
      }
    }, {
      key: "toggleDataVisibility",
      value: function toggleDataVisibility(index) {
        this._hiddenIndices[index] = !this._hiddenIndices[index];
      }
    }, {
      key: "getDataVisibility",
      value: function getDataVisibility(index) {
        return !this._hiddenIndices[index];
      }
    }, {
      key: "_updateVisibility",
      value: function _updateVisibility(datasetIndex, dataIndex, visible) {
        var mode = visible ? 'show' : 'hide';
        var meta = this.getDatasetMeta(datasetIndex);
        var anims = meta.controller._resolveAnimations(undefined, mode);
        if (defined(dataIndex)) {
          meta.data[dataIndex].hidden = !visible;
          this.update();
        } else {
          this.setDatasetVisibility(datasetIndex, visible);
          anims.update(meta, {
            visible: visible
          });
          this.update(function (ctx) {
            return ctx.datasetIndex === datasetIndex ? mode : undefined;
          });
        }
      }
    }, {
      key: "hide",
      value: function hide(datasetIndex, dataIndex) {
        this._updateVisibility(datasetIndex, dataIndex, false);
      }
    }, {
      key: "show",
      value: function show(datasetIndex, dataIndex) {
        this._updateVisibility(datasetIndex, dataIndex, true);
      }
    }, {
      key: "_destroyDatasetMeta",
      value: function _destroyDatasetMeta(datasetIndex) {
        var meta = this._metasets[datasetIndex];
        if (meta && meta.controller) {
          meta.controller._destroy();
        }
        delete this._metasets[datasetIndex];
      }
    }, {
      key: "_stop",
      value: function _stop() {
        var i$$1, ilen;
        this.stop();
        animator.remove(this);
        for (i$$1 = 0, ilen = this.data.datasets.length; i$$1 < ilen; ++i$$1) {
          this._destroyDatasetMeta(i$$1);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.notifyPlugins('beforeDestroy');
        var canvas = this.canvas,
          ctx = this.ctx;
        this._stop();
        this.config.clearCache();
        if (canvas) {
          this.unbindEvents();
          clearCanvas(canvas, ctx);
          this.platform.releaseContext(ctx);
          this.canvas = null;
          this.ctx = null;
        }
        delete instances[this.id];
        this.notifyPlugins('afterDestroy');
      }
    }, {
      key: "toBase64Image",
      value: function toBase64Image() {
        var _this$canvas;
        return (_this$canvas = this.canvas).toDataURL.apply(_this$canvas, arguments);
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        this.bindUserEvents();
        if (this.options.responsive) {
          this.bindResponsiveEvents();
        } else {
          this.attached = true;
        }
      }
    }, {
      key: "bindUserEvents",
      value: function bindUserEvents() {
        var _this18 = this;
        var listeners = this._listeners;
        var platform = this.platform;
        var _add = function _add(type, listener) {
          platform.addEventListener(_this18, type, listener);
          listeners[type] = listener;
        };
        var listener = function listener(e$$1, x$$1, y$$1) {
          e$$1.offsetX = x$$1;
          e$$1.offsetY = y$$1;
          _this18._eventHandler(e$$1);
        };
        each(this.options.events, function (type) {
          return _add(type, listener);
        });
      }
    }, {
      key: "bindResponsiveEvents",
      value: function bindResponsiveEvents() {
        var _this19 = this;
        if (!this._responsiveListeners) {
          this._responsiveListeners = {};
        }
        var listeners = this._responsiveListeners;
        var platform = this.platform;
        var _add = function _add(type, listener) {
          platform.addEventListener(_this19, type, listener);
          listeners[type] = listener;
        };
        var _remove = function _remove(type, listener) {
          if (listeners[type]) {
            platform.removeEventListener(_this19, type, listener);
            delete listeners[type];
          }
        };
        var listener = function listener(width, height) {
          if (_this19.canvas) {
            _this19.resize(width, height);
          }
        };
        var detached;
        var attached = function attached() {
          _remove('attach', attached);
          _this19.attached = true;
          _this19.resize();
          _add('resize', listener);
          _add('detach', detached);
        };
        detached = function detached() {
          _this19.attached = false;
          _remove('resize', listener);
          _this19._stop();
          _this19._resize(0, 0);
          _add('attach', attached);
        };
        if (platform.isAttached(this.canvas)) {
          attached();
        } else {
          detached();
        }
      }
    }, {
      key: "unbindEvents",
      value: function unbindEvents() {
        var _this20 = this;
        each(this._listeners, function (listener, type) {
          _this20.platform.removeEventListener(_this20, type, listener);
        });
        this._listeners = {};
        each(this._responsiveListeners, function (listener, type) {
          _this20.platform.removeEventListener(_this20, type, listener);
        });
        this._responsiveListeners = undefined;
      }
    }, {
      key: "updateHoverStyle",
      value: function updateHoverStyle(items, mode, enabled) {
        var prefix = enabled ? 'set' : 'remove';
        var meta, item, i$$1, ilen;
        if (mode === 'dataset') {
          meta = this.getDatasetMeta(items[0].datasetIndex);
          meta.controller['_' + prefix + 'DatasetHoverStyle']();
        }
        for (i$$1 = 0, ilen = items.length; i$$1 < ilen; ++i$$1) {
          item = items[i$$1];
          var controller = item && this.getDatasetMeta(item.datasetIndex).controller;
          if (controller) {
            controller[prefix + 'HoverStyle'](item.element, item.datasetIndex, item.index);
          }
        }
      }
    }, {
      key: "getActiveElements",
      value: function getActiveElements() {
        return this._active || [];
      }
    }, {
      key: "setActiveElements",
      value: function setActiveElements(activeElements) {
        var _this21 = this;
        var lastActive = this._active || [];
        var active = activeElements.map(function (_ref4) {
          var datasetIndex = _ref4.datasetIndex,
            index = _ref4.index;
          var meta = _this21.getDatasetMeta(datasetIndex);
          if (!meta) {
            throw new Error('No dataset found at index ' + datasetIndex);
          }
          return {
            datasetIndex: datasetIndex,
            element: meta.data[index],
            index: index
          };
        });
        var changed = !_elementsEqual(active, lastActive);
        if (changed) {
          this._active = active;
          this._lastEvent = null;
          this._updateHoverStyles(active, lastActive);
        }
      }
    }, {
      key: "notifyPlugins",
      value: function notifyPlugins(hook, args, filter) {
        return this._plugins.notify(this, hook, args, filter);
      }
    }, {
      key: "isPluginEnabled",
      value: function isPluginEnabled(pluginId) {
        return this._plugins._cache.filter(function (p$$1) {
          return p$$1.plugin.id === pluginId;
        }).length === 1;
      }
    }, {
      key: "_updateHoverStyles",
      value: function _updateHoverStyles(active, lastActive, replay) {
        var hoverOptions = this.options.hover;
        var diff = function diff(a$$1, b$$1) {
          return a$$1.filter(function (x$$1) {
            return !b$$1.some(function (y$$1) {
              return x$$1.datasetIndex === y$$1.datasetIndex && x$$1.index === y$$1.index;
            });
          });
        };
        var deactivated = diff(lastActive, active);
        var activated = replay ? active : diff(active, lastActive);
        if (deactivated.length) {
          this.updateHoverStyle(deactivated, hoverOptions.mode, false);
        }
        if (activated.length && hoverOptions.mode) {
          this.updateHoverStyle(activated, hoverOptions.mode, true);
        }
      }
    }, {
      key: "_eventHandler",
      value: function _eventHandler(e$$1, replay) {
        var _this22 = this;
        var args = {
          event: e$$1,
          replay: replay,
          cancelable: true,
          inChartArea: this.isPointInArea(e$$1)
        };
        var eventFilter = function eventFilter(plugin) {
          return (plugin.options.events || _this22.options.events).includes(e$$1["native"].type);
        };
        if (this.notifyPlugins('beforeEvent', args, eventFilter) === false) {
          return;
        }
        var changed = this._handleEvent(e$$1, replay, args.inChartArea);
        args.cancelable = false;
        this.notifyPlugins('afterEvent', args, eventFilter);
        if (changed || args.changed) {
          this.render();
        }
        return this;
      }
    }, {
      key: "_handleEvent",
      value: function _handleEvent(e$$1, replay, inChartArea) {
        var _this$_active = this._active,
          lastActive = _this$_active === void 0 ? [] : _this$_active,
          options = this.options;
        var useFinalPosition = replay;
        var active = this._getActiveElements(e$$1, lastActive, inChartArea, useFinalPosition);
        var isClick = _isClickEvent(e$$1);
        var lastEvent = determineLastEvent(e$$1, this._lastEvent, inChartArea, isClick);
        if (inChartArea) {
          this._lastEvent = null;
          callback(options.onHover, [e$$1, active, this], this);
          if (isClick) {
            callback(options.onClick, [e$$1, active, this], this);
          }
        }
        var changed = !_elementsEqual(active, lastActive);
        if (changed || replay) {
          this._active = active;
          this._updateHoverStyles(active, lastActive, replay);
        }
        this._lastEvent = lastEvent;
        return changed;
      }
    }, {
      key: "_getActiveElements",
      value: function _getActiveElements(e$$1, lastActive, inChartArea, useFinalPosition) {
        if (e$$1.type === 'mouseout') {
          return [];
        }
        if (!inChartArea) {
          return lastActive;
        }
        var hoverOptions = this.options.hover;
        return this.getElementsAtEventForMode(e$$1, hoverOptions.mode, hoverOptions, useFinalPosition);
      }
    }, {
      key: "aspectRatio",
      get: function get() {
        var _this$options12 = this.options,
          aspectRatio = _this$options12.aspectRatio,
          maintainAspectRatio = _this$options12.maintainAspectRatio,
          width = this.width,
          height = this.height,
          _aspectRatio = this._aspectRatio;
        if (!isNullOrUndef(aspectRatio)) {
          return aspectRatio;
        }
        if (maintainAspectRatio && _aspectRatio) {
          return _aspectRatio;
        }
        return height ? width / height : null;
      }
    }, {
      key: "data",
      get: function get() {
        return this.config.data;
      },
      set: function set(data) {
        this.config.data = data;
      }
    }, {
      key: "options",
      get: function get() {
        return this._options;
      },
      set: function set(options) {
        this.config.options = options;
      }
    }, {
      key: "registry",
      get: function get() {
        return registry;
      }
    }]);
    return Chart;
  }();
  babelHelpers.defineProperty(Chart, "defaults", defaults);
  babelHelpers.defineProperty(Chart, "instances", instances);
  babelHelpers.defineProperty(Chart, "overrides", overrides);
  babelHelpers.defineProperty(Chart, "registry", registry);
  babelHelpers.defineProperty(Chart, "version", version);
  babelHelpers.defineProperty(Chart, "getChart", getChart);
  function invalidatePlugins() {
    return each(Chart.instances, function (chart) {
      return chart._plugins.invalidate();
    });
  }
  function clipArc(ctx, element, endAngle) {
    var startAngle = element.startAngle,
      pixelMargin = element.pixelMargin,
      x$$1 = element.x,
      y$$1 = element.y,
      outerRadius = element.outerRadius,
      innerRadius = element.innerRadius;
    var angleMargin = pixelMargin / outerRadius;
    // Draw an inner border by clipping the arc and drawing a double-width border
    // Enlarge the clipping arc by 0.33 pixels to eliminate glitches between borders
    ctx.beginPath();
    ctx.arc(x$$1, y$$1, outerRadius, startAngle - angleMargin, endAngle + angleMargin);
    if (innerRadius > pixelMargin) {
      angleMargin = pixelMargin / innerRadius;
      ctx.arc(x$$1, y$$1, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
    } else {
      ctx.arc(x$$1, y$$1, pixelMargin, endAngle + HALF_PI, startAngle - HALF_PI);
    }
    ctx.closePath();
    ctx.clip();
  }
  function toRadiusCorners(value) {
    return _readValueToProps(value, ['outerStart', 'outerEnd', 'innerStart', 'innerEnd']);
  }
  /**
   * Parse border radius from the provided options
   */
  function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
    var o$$1 = toRadiusCorners(arc.options.borderRadius);
    var halfThickness = (outerRadius - innerRadius) / 2;
    var innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);
    // Outer limits are complicated. We want to compute the available angular distance at
    // a radius of outerRadius - borderRadius because for small angular distances, this term limits.
    // We compute at r = outerRadius - borderRadius because this circle defines the center of the border corners.
    //
    // If the borderRadius is large, that value can become negative.
    // This causes the outer borders to lose their radius entirely, which is rather unexpected. To solve that, if borderRadius > outerRadius
    // we know that the thickness term will dominate and compute the limits at that point
    var computeOuterLimit = function computeOuterLimit(val) {
      var outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
      return _limitValue(val, 0, Math.min(halfThickness, outerArcLimit));
    };
    return {
      outerStart: computeOuterLimit(o$$1.outerStart),
      outerEnd: computeOuterLimit(o$$1.outerEnd),
      innerStart: _limitValue(o$$1.innerStart, 0, innerLimit),
      innerEnd: _limitValue(o$$1.innerEnd, 0, innerLimit)
    };
  }
  /**
   * Convert (r, рќњѓ) to (x, y)
   */
  function rThetaToXY(r$$1, theta, x$$1, y$$1) {
    return {
      x: x$$1 + r$$1 * Math.cos(theta),
      y: y$$1 + r$$1 * Math.sin(theta)
    };
  }
  /**
   * Path the arc, respecting border radius by separating into left and right halves.
   *
   *   Start      End
   *
   *    1--->a--->2    Outer
   *   /           \
   *   8           3
   *   |           |
   *   |           |
   *   7           4
   *   \           /
   *    6<---b<---5    Inner
   */
  function pathArc(ctx, element, offset, spacing, end, circular) {
    var x$$1 = element.x,
      y$$1 = element.y,
      start = element.startAngle,
      pixelMargin = element.pixelMargin,
      innerR = element.innerRadius;
    var outerRadius = Math.max(element.outerRadius + spacing + offset - pixelMargin, 0);
    var innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0;
    var spacingOffset = 0;
    var alpha = end - start;
    if (spacing) {
      // When spacing is present, it is the same for all items
      // So we adjust the start and end angle of the arc such that
      // the distance is the same as it would be without the spacing
      var noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0;
      var noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0;
      var avNogSpacingRadius = (noSpacingInnerRadius + noSpacingOuterRadius) / 2;
      var adjustedAngle = avNogSpacingRadius !== 0 ? alpha * avNogSpacingRadius / (avNogSpacingRadius + spacing) : alpha;
      spacingOffset = (alpha - adjustedAngle) / 2;
    }
    var beta = Math.max(0.001, alpha * outerRadius - offset / PI) / outerRadius;
    var angleOffset = (alpha - beta) / 2;
    var startAngle = start + angleOffset + spacingOffset;
    var endAngle = end - angleOffset - spacingOffset;
    var _parseBorderRadius$ = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle),
      outerStart = _parseBorderRadius$.outerStart,
      outerEnd = _parseBorderRadius$.outerEnd,
      innerStart = _parseBorderRadius$.innerStart,
      innerEnd = _parseBorderRadius$.innerEnd;
    var outerStartAdjustedRadius = outerRadius - outerStart;
    var outerEndAdjustedRadius = outerRadius - outerEnd;
    var outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
    var outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
    var innerStartAdjustedRadius = innerRadius + innerStart;
    var innerEndAdjustedRadius = innerRadius + innerEnd;
    var innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
    var innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
    ctx.beginPath();
    if (circular) {
      // The first arc segments from point 1 to point a to point 2
      var outerMidAdjustedAngle = (outerStartAdjustedAngle + outerEndAdjustedAngle) / 2;
      ctx.arc(x$$1, y$$1, outerRadius, outerStartAdjustedAngle, outerMidAdjustedAngle);
      ctx.arc(x$$1, y$$1, outerRadius, outerMidAdjustedAngle, outerEndAdjustedAngle);
      // The corner segment from point 2 to point 3
      if (outerEnd > 0) {
        var pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x$$1, y$$1);
        ctx.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + HALF_PI);
      }
      // The line from point 3 to point 4
      var p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x$$1, y$$1);
      ctx.lineTo(p4.x, p4.y);
      // The corner segment from point 4 to point 5
      if (innerEnd > 0) {
        var pCenter1 = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x$$1, y$$1);
        ctx.arc(pCenter1.x, pCenter1.y, innerEnd, endAngle + HALF_PI, innerEndAdjustedAngle + Math.PI);
      }
      // The inner arc from point 5 to point b to point 6
      var innerMidAdjustedAngle = (endAngle - innerEnd / innerRadius + (startAngle + innerStart / innerRadius)) / 2;
      ctx.arc(x$$1, y$$1, innerRadius, endAngle - innerEnd / innerRadius, innerMidAdjustedAngle, true);
      ctx.arc(x$$1, y$$1, innerRadius, innerMidAdjustedAngle, startAngle + innerStart / innerRadius, true);
      // The corner segment from point 6 to point 7
      if (innerStart > 0) {
        var pCenter2 = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x$$1, y$$1);
        ctx.arc(pCenter2.x, pCenter2.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - HALF_PI);
      }
      // The line from point 7 to point 8
      var p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x$$1, y$$1);
      ctx.lineTo(p8.x, p8.y);
      // The corner segment from point 8 to point 1
      if (outerStart > 0) {
        var pCenter3 = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x$$1, y$$1);
        ctx.arc(pCenter3.x, pCenter3.y, outerStart, startAngle - HALF_PI, outerStartAdjustedAngle);
      }
    } else {
      ctx.moveTo(x$$1, y$$1);
      var outerStartX = Math.cos(outerStartAdjustedAngle) * outerRadius + x$$1;
      var outerStartY = Math.sin(outerStartAdjustedAngle) * outerRadius + y$$1;
      ctx.lineTo(outerStartX, outerStartY);
      var outerEndX = Math.cos(outerEndAdjustedAngle) * outerRadius + x$$1;
      var outerEndY = Math.sin(outerEndAdjustedAngle) * outerRadius + y$$1;
      ctx.lineTo(outerEndX, outerEndY);
    }
    ctx.closePath();
  }
  function drawArc(ctx, element, offset, spacing, circular) {
    var fullCircles = element.fullCircles,
      startAngle = element.startAngle,
      circumference = element.circumference;
    var endAngle = element.endAngle;
    if (fullCircles) {
      pathArc(ctx, element, offset, spacing, endAngle, circular);
      for (var i$$1 = 0; i$$1 < fullCircles; ++i$$1) {
        ctx.fill();
      }
      if (!isNaN(circumference)) {
        endAngle = startAngle + (circumference % TAU || TAU);
      }
    }
    pathArc(ctx, element, offset, spacing, endAngle, circular);
    ctx.fill();
    return endAngle;
  }
  function drawBorder(ctx, element, offset, spacing, circular) {
    var fullCircles = element.fullCircles,
      startAngle = element.startAngle,
      circumference = element.circumference,
      options = element.options;
    var borderWidth = options.borderWidth,
      borderJoinStyle = options.borderJoinStyle;
    var inner = options.borderAlign === 'inner';
    if (!borderWidth) {
      return;
    }
    if (inner) {
      ctx.lineWidth = borderWidth * 2;
      ctx.lineJoin = borderJoinStyle || 'round';
    } else {
      ctx.lineWidth = borderWidth;
      ctx.lineJoin = borderJoinStyle || 'bevel';
    }
    var endAngle = element.endAngle;
    if (fullCircles) {
      pathArc(ctx, element, offset, spacing, endAngle, circular);
      for (var i$$1 = 0; i$$1 < fullCircles; ++i$$1) {
        ctx.stroke();
      }
      if (!isNaN(circumference)) {
        endAngle = startAngle + (circumference % TAU || TAU);
      }
    }
    if (inner) {
      clipArc(ctx, element, endAngle);
    }
    if (!fullCircles) {
      pathArc(ctx, element, offset, spacing, endAngle, circular);
      ctx.stroke();
    }
  }
  var ArcElement = /*#__PURE__*/function (_Element2) {
    babelHelpers.inherits(ArcElement, _Element2);
    function ArcElement(cfg) {
      var _this23;
      babelHelpers.classCallCheck(this, ArcElement);
      _this23 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(ArcElement).call(this));
      _this23.options = undefined;
      _this23.circumference = undefined;
      _this23.startAngle = undefined;
      _this23.endAngle = undefined;
      _this23.innerRadius = undefined;
      _this23.outerRadius = undefined;
      _this23.pixelMargin = 0;
      _this23.fullCircles = 0;
      if (cfg) {
        Object.assign(babelHelpers.assertThisInitialized(_this23), cfg);
      }
      return _this23;
    }
    babelHelpers.createClass(ArcElement, [{
      key: "inRange",
      value: function inRange(chartX, chartY, useFinalPosition) {
        var point = this.getProps(['x', 'y'], useFinalPosition);
        var _getAngleFromPoint2 = getAngleFromPoint(point, {
            x: chartX,
            y: chartY
          }),
          angle = _getAngleFromPoint2.angle,
          distance = _getAngleFromPoint2.distance;
        var _this$getProps2 = this.getProps(['startAngle', 'endAngle', 'innerRadius', 'outerRadius', 'circumference'], useFinalPosition),
          startAngle = _this$getProps2.startAngle,
          endAngle = _this$getProps2.endAngle,
          innerRadius = _this$getProps2.innerRadius,
          outerRadius = _this$getProps2.outerRadius,
          circumference = _this$getProps2.circumference;
        var rAdjust = this.options.spacing / 2;
        var _circumference = valueOrDefault(circumference, endAngle - startAngle);
        var betweenAngles = _circumference >= TAU || _angleBetween(angle, startAngle, endAngle);
        var withinRadius = _isBetween(distance, innerRadius + rAdjust, outerRadius + rAdjust);
        return betweenAngles && withinRadius;
      }
    }, {
      key: "getCenterPoint",
      value: function getCenterPoint(useFinalPosition) {
        var _this$getProps3 = this.getProps(['x', 'y', 'startAngle', 'endAngle', 'innerRadius', 'outerRadius'], useFinalPosition),
          x$$1 = _this$getProps3.x,
          y$$1 = _this$getProps3.y,
          startAngle = _this$getProps3.startAngle,
          endAngle = _this$getProps3.endAngle,
          innerRadius = _this$getProps3.innerRadius,
          outerRadius = _this$getProps3.outerRadius;
        var _this$options13 = this.options,
          offset = _this$options13.offset,
          spacing = _this$options13.spacing;
        var halfAngle = (startAngle + endAngle) / 2;
        var halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
        return {
          x: x$$1 + Math.cos(halfAngle) * halfRadius,
          y: y$$1 + Math.sin(halfAngle) * halfRadius
        };
      }
    }, {
      key: "tooltipPosition",
      value: function tooltipPosition(useFinalPosition) {
        return this.getCenterPoint(useFinalPosition);
      }
    }, {
      key: "draw",
      value: function draw(ctx) {
        var options = this.options,
          circumference = this.circumference;
        var offset = (options.offset || 0) / 4;
        var spacing = (options.spacing || 0) / 2;
        var circular = options.circular;
        this.pixelMargin = options.borderAlign === 'inner' ? 0.33 : 0;
        this.fullCircles = circumference > TAU ? Math.floor(circumference / TAU) : 0;
        if (circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
          return;
        }
        ctx.save();
        var halfAngle = (this.startAngle + this.endAngle) / 2;
        ctx.translate(Math.cos(halfAngle) * offset, Math.sin(halfAngle) * offset);
        var fix = 1 - Math.sin(Math.min(PI, circumference || 0));
        var radiusOffset = offset * fix;
        ctx.fillStyle = options.backgroundColor;
        ctx.strokeStyle = options.borderColor;
        drawArc(ctx, this, radiusOffset, spacing, circular);
        drawBorder(ctx, this, radiusOffset, spacing, circular);
        ctx.restore();
      }
    }]);
    return ArcElement;
  }(Element);
  babelHelpers.defineProperty(ArcElement, "id", 'arc');
  babelHelpers.defineProperty(ArcElement, "defaults", {
    borderAlign: 'center',
    borderColor: '#fff',
    borderJoinStyle: undefined,
    borderRadius: 0,
    borderWidth: 2,
    offset: 0,
    spacing: 0,
    angle: undefined,
    circular: true
  });
  babelHelpers.defineProperty(ArcElement, "defaultRoutes", {
    backgroundColor: 'backgroundColor'
  });
  function setStyle(ctx, options) {
    var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : options;
    ctx.lineCap = valueOrDefault(style.borderCapStyle, options.borderCapStyle);
    ctx.setLineDash(valueOrDefault(style.borderDash, options.borderDash));
    ctx.lineDashOffset = valueOrDefault(style.borderDashOffset, options.borderDashOffset);
    ctx.lineJoin = valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
    ctx.lineWidth = valueOrDefault(style.borderWidth, options.borderWidth);
    ctx.strokeStyle = valueOrDefault(style.borderColor, options.borderColor);
  }
  function lineTo(ctx, previous, target) {
    ctx.lineTo(target.x, target.y);
  }
  function getLineMethod(options) {
    if (options.stepped) {
      return _steppedLineTo;
    }
    if (options.tension || options.cubicInterpolationMode === 'monotone') {
      return _bezierCurveTo;
    }
    return lineTo;
  }
  function pathVars(points, segment) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var count = points.length;
    var _params$start = params.start,
      paramsStart = _params$start === void 0 ? 0 : _params$start,
      _params$end = params.end,
      paramsEnd = _params$end === void 0 ? count - 1 : _params$end;
    var segmentStart = segment.start,
      segmentEnd = segment.end;
    var start = Math.max(paramsStart, segmentStart);
    var end = Math.min(paramsEnd, segmentEnd);
    var outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
    return {
      count: count,
      start: start,
      loop: segment.loop,
      ilen: end < start && !outside ? count + end - start : end - start
    };
  }
  function pathSegment(ctx, line, segment, params) {
    var points = line.points,
      options = line.options;
    var _pathVars = pathVars(points, segment, params),
      count = _pathVars.count,
      start = _pathVars.start,
      loop = _pathVars.loop,
      ilen = _pathVars.ilen;
    var lineMethod = getLineMethod(options);
    var _ref5 = params || {},
      _ref5$move = _ref5.move,
      move = _ref5$move === void 0 ? true : _ref5$move,
      reverse = _ref5.reverse;
    var i$$1, point, prev;
    for (i$$1 = 0; i$$1 <= ilen; ++i$$1) {
      point = points[(start + (reverse ? ilen - i$$1 : i$$1)) % count];
      if (point.skip) {
        continue;
      } else if (move) {
        ctx.moveTo(point.x, point.y);
        move = false;
      } else {
        lineMethod(ctx, prev, point, reverse, options.stepped);
      }
      prev = point;
    }
    if (loop) {
      point = points[(start + (reverse ? ilen : 0)) % count];
      lineMethod(ctx, prev, point, reverse, options.stepped);
    }
    return !!loop;
  }
  function fastPathSegment(ctx, line, segment, params) {
    var points = line.points;
    var _pathVars2 = pathVars(points, segment, params),
      count = _pathVars2.count,
      start = _pathVars2.start,
      ilen = _pathVars2.ilen;
    var _ref6 = params || {},
      _ref6$move = _ref6.move,
      move = _ref6$move === void 0 ? true : _ref6$move,
      reverse = _ref6.reverse;
    var avgX = 0;
    var countX = 0;
    var i$$1, point, prevX, minY, maxY, lastY;
    var pointIndex = function pointIndex(index) {
      return (start + (reverse ? ilen - index : index)) % count;
    };
    var drawX = function drawX() {
      if (minY !== maxY) {
        ctx.lineTo(avgX, maxY);
        ctx.lineTo(avgX, minY);
        ctx.lineTo(avgX, lastY);
      }
    };
    if (move) {
      point = points[pointIndex(0)];
      ctx.moveTo(point.x, point.y);
    }
    for (i$$1 = 0; i$$1 <= ilen; ++i$$1) {
      point = points[pointIndex(i$$1)];
      if (point.skip) {
        continue;
      }
      var x$$1 = point.x;
      var y$$1 = point.y;
      var truncX = x$$1 | 0;
      if (truncX === prevX) {
        if (y$$1 < minY) {
          minY = y$$1;
        } else if (y$$1 > maxY) {
          maxY = y$$1;
        }
        avgX = (countX * avgX + x$$1) / ++countX;
      } else {
        drawX();
        ctx.lineTo(x$$1, y$$1);
        prevX = truncX;
        countX = 0;
        minY = maxY = y$$1;
      }
      lastY = y$$1;
    }
    drawX();
  }
  function _getSegmentMethod(line) {
    var opts = line.options;
    var borderDash = opts.borderDash && opts.borderDash.length;
    var useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== 'monotone' && !opts.stepped && !borderDash;
    return useFastPath ? fastPathSegment : pathSegment;
  }
  function _getInterpolationMethod(options) {
    if (options.stepped) {
      return _steppedInterpolation;
    }
    if (options.tension || options.cubicInterpolationMode === 'monotone') {
      return _bezierInterpolation;
    }
    return _pointInLine;
  }
  function strokePathWithCache(ctx, line, start, count) {
    var path = line._path;
    if (!path) {
      path = line._path = new Path2D();
      if (line.path(path, start, count)) {
        path.closePath();
      }
    }
    setStyle(ctx, line.options);
    ctx.stroke(path);
  }
  function strokePathDirect(ctx, line, start, count) {
    var segments = line.segments,
      options = line.options;
    var segmentMethod = _getSegmentMethod(line);
    var _iterator16 = _createForOfIteratorHelper$1(segments),
      _step16;
    try {
      for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
        var segment = _step16.value;
        setStyle(ctx, options, segment.style);
        ctx.beginPath();
        if (segmentMethod(ctx, line, segment, {
          start: start,
          end: start + count - 1
        })) {
          ctx.closePath();
        }
        ctx.stroke();
      }
    } catch (err) {
      _iterator16.e(err);
    } finally {
      _iterator16.f();
    }
  }
  var usePath2D = typeof Path2D === 'function';
  function _draw(ctx, line, start, count) {
    if (usePath2D && !line.options.segment) {
      strokePathWithCache(ctx, line, start, count);
    } else {
      strokePathDirect(ctx, line, start, count);
    }
  }
  var LineElement = /*#__PURE__*/function (_Element3) {
    babelHelpers.inherits(LineElement, _Element3);
    function LineElement(cfg) {
      var _this24;
      babelHelpers.classCallCheck(this, LineElement);
      _this24 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(LineElement).call(this));
      _this24.animated = true;
      _this24.options = undefined;
      _this24._chart = undefined;
      _this24._loop = undefined;
      _this24._fullLoop = undefined;
      _this24._path = undefined;
      _this24._points = undefined;
      _this24._segments = undefined;
      _this24._decimated = false;
      _this24._pointsUpdated = false;
      _this24._datasetIndex = undefined;
      if (cfg) {
        Object.assign(babelHelpers.assertThisInitialized(_this24), cfg);
      }
      return _this24;
    }
    babelHelpers.createClass(LineElement, [{
      key: "updateControlPoints",
      value: function updateControlPoints(chartArea, indexAxis) {
        var options = this.options;
        if ((options.tension || options.cubicInterpolationMode === 'monotone') && !options.stepped && !this._pointsUpdated) {
          var loop = options.spanGaps ? this._loop : this._fullLoop;
          _updateBezierControlPoints(this._points, options, chartArea, loop, indexAxis);
          this._pointsUpdated = true;
        }
      }
    }, {
      key: "first",
      value: function first() {
        var segments = this.segments;
        var points = this.points;
        return segments.length && points[segments[0].start];
      }
    }, {
      key: "last",
      value: function last() {
        var segments = this.segments;
        var points = this.points;
        var count = segments.length;
        return count && points[segments[count - 1].end];
      }
    }, {
      key: "interpolate",
      value: function interpolate(point, property) {
        var options = this.options;
        var value = point[property];
        var points = this.points;
        var segments = _boundSegments(this, {
          property: property,
          start: value,
          end: value
        });
        if (!segments.length) {
          return;
        }
        var result = [];
        var _interpolate = _getInterpolationMethod(options);
        var i$$1, ilen;
        for (i$$1 = 0, ilen = segments.length; i$$1 < ilen; ++i$$1) {
          var _segments$i = segments[i$$1],
            start = _segments$i.start,
            end = _segments$i.end;
          var p1 = points[start];
          var p2 = points[end];
          if (p1 === p2) {
            result.push(p1);
            continue;
          }
          var t$$1 = Math.abs((value - p1[property]) / (p2[property] - p1[property]));
          var interpolated = _interpolate(p1, p2, t$$1, options.stepped);
          interpolated[property] = point[property];
          result.push(interpolated);
        }
        return result.length === 1 ? result[0] : result;
      }
    }, {
      key: "pathSegment",
      value: function pathSegment(ctx, segment, params) {
        var segmentMethod = _getSegmentMethod(this);
        return segmentMethod(ctx, this, segment, params);
      }
    }, {
      key: "path",
      value: function path(ctx, start, count) {
        var segments = this.segments;
        var segmentMethod = _getSegmentMethod(this);
        var loop = this._loop;
        start = start || 0;
        count = count || this.points.length - start;
        var _iterator17 = _createForOfIteratorHelper$1(segments),
          _step17;
        try {
          for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
            var segment = _step17.value;
            loop &= segmentMethod(ctx, this, segment, {
              start: start,
              end: start + count - 1
            });
          }
        } catch (err) {
          _iterator17.e(err);
        } finally {
          _iterator17.f();
        }
        return !!loop;
      }
    }, {
      key: "draw",
      value: function draw(ctx, chartArea, start, count) {
        var options = this.options || {};
        var points = this.points || [];
        if (points.length && options.borderWidth) {
          ctx.save();
          _draw(ctx, this, start, count);
          ctx.restore();
        }
        if (this.animated) {
          this._pointsUpdated = false;
          this._path = undefined;
        }
      }
    }, {
      key: "points",
      set: function set(points) {
        this._points = points;
        delete this._segments;
        delete this._path;
        this._pointsUpdated = false;
      },
      get: function get() {
        return this._points;
      }
    }, {
      key: "segments",
      get: function get() {
        return this._segments || (this._segments = _computeSegments(this, this.options.segment));
      }
    }]);
    return LineElement;
  }(Element);
  babelHelpers.defineProperty(LineElement, "id", 'line');
  babelHelpers.defineProperty(LineElement, "defaults", {
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: 'miter',
    borderWidth: 3,
    capBezierPoints: true,
    cubicInterpolationMode: 'default',
    fill: false,
    spanGaps: false,
    stepped: false,
    tension: 0
  });
  babelHelpers.defineProperty(LineElement, "defaultRoutes", {
    backgroundColor: 'backgroundColor',
    borderColor: 'borderColor'
  });
  babelHelpers.defineProperty(LineElement, "descriptors", {
    _scriptable: true,
    _indexable: function _indexable(name) {
      return name !== 'borderDash' && name !== 'fill';
    }
  });
  function inRange$1(el, pos, axis, useFinalPosition) {
    var options = el.options;
    var _el$getProps = el.getProps([axis], useFinalPosition),
      value = _el$getProps[axis];
    return Math.abs(pos - value) < options.radius + options.hitRadius;
  }
  var PointElement = /*#__PURE__*/function (_Element4) {
    babelHelpers.inherits(PointElement, _Element4);
    /**
    * @type {any}
    */

    /**
    * @type {any}
    */

    function PointElement(cfg) {
      var _this25;
      babelHelpers.classCallCheck(this, PointElement);
      _this25 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PointElement).call(this));
      _this25.options = undefined;
      _this25.parsed = undefined;
      _this25.skip = undefined;
      _this25.stop = undefined;
      if (cfg) {
        Object.assign(babelHelpers.assertThisInitialized(_this25), cfg);
      }
      return _this25;
    }
    babelHelpers.createClass(PointElement, [{
      key: "inRange",
      value: function inRange(mouseX, mouseY, useFinalPosition) {
        var options = this.options;
        var _this$getProps4 = this.getProps(['x', 'y'], useFinalPosition),
          x$$1 = _this$getProps4.x,
          y$$1 = _this$getProps4.y;
        return Math.pow(mouseX - x$$1, 2) + Math.pow(mouseY - y$$1, 2) < Math.pow(options.hitRadius + options.radius, 2);
      }
    }, {
      key: "inXRange",
      value: function inXRange(mouseX, useFinalPosition) {
        return inRange$1(this, mouseX, 'x', useFinalPosition);
      }
    }, {
      key: "inYRange",
      value: function inYRange(mouseY, useFinalPosition) {
        return inRange$1(this, mouseY, 'y', useFinalPosition);
      }
    }, {
      key: "getCenterPoint",
      value: function getCenterPoint(useFinalPosition) {
        var _this$getProps5 = this.getProps(['x', 'y'], useFinalPosition),
          x$$1 = _this$getProps5.x,
          y$$1 = _this$getProps5.y;
        return {
          x: x$$1,
          y: y$$1
        };
      }
    }, {
      key: "size",
      value: function size(options) {
        options = options || this.options || {};
        var radius = options.radius || 0;
        radius = Math.max(radius, radius && options.hoverRadius || 0);
        var borderWidth = radius && options.borderWidth || 0;
        return (radius + borderWidth) * 2;
      }
    }, {
      key: "draw",
      value: function draw(ctx, area) {
        var options = this.options;
        if (this.skip || options.radius < 0.1 || !_isPointInArea(this, area, this.size(options) / 2)) {
          return;
        }
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.fillStyle = options.backgroundColor;
        drawPoint(ctx, options, this.x, this.y);
      }
    }, {
      key: "getRange",
      value: function getRange() {
        var options = this.options || {};
        // @ts-expect-error Fallbacks should never be hit in practice
        return options.radius + options.hitRadius;
      }
    }]);
    return PointElement;
  }(Element);
  babelHelpers.defineProperty(PointElement, "id", 'point');
  babelHelpers.defineProperty(PointElement, "defaults", {
    borderWidth: 1,
    hitRadius: 1,
    hoverBorderWidth: 1,
    hoverRadius: 4,
    pointStyle: 'circle',
    radius: 3,
    rotation: 0
  });
  babelHelpers.defineProperty(PointElement, "defaultRoutes", {
    backgroundColor: 'backgroundColor',
    borderColor: 'borderColor'
  });
  function getBarBounds(bar, useFinalPosition) {
    var _bar$getProps = bar.getProps(['x', 'y', 'base', 'width', 'height'], useFinalPosition),
      x$$1 = _bar$getProps.x,
      y$$1 = _bar$getProps.y,
      base = _bar$getProps.base,
      width = _bar$getProps.width,
      height = _bar$getProps.height;
    var left, right, top, bottom, half;
    if (bar.horizontal) {
      half = height / 2;
      left = Math.min(x$$1, base);
      right = Math.max(x$$1, base);
      top = y$$1 - half;
      bottom = y$$1 + half;
    } else {
      half = width / 2;
      left = x$$1 - half;
      right = x$$1 + half;
      top = Math.min(y$$1, base);
      bottom = Math.max(y$$1, base);
    }
    return {
      left: left,
      top: top,
      right: right,
      bottom: bottom
    };
  }
  function skipOrLimit(skip, value, min, max) {
    return skip ? 0 : _limitValue(value, min, max);
  }
  function parseBorderWidth(bar, maxW, maxH) {
    var value = bar.options.borderWidth;
    var skip = bar.borderSkipped;
    var o$$1 = toTRBL(value);
    return {
      t: skipOrLimit(skip.top, o$$1.top, 0, maxH),
      r: skipOrLimit(skip.right, o$$1.right, 0, maxW),
      b: skipOrLimit(skip.bottom, o$$1.bottom, 0, maxH),
      l: skipOrLimit(skip.left, o$$1.left, 0, maxW)
    };
  }
  function parseBorderRadius(bar, maxW, maxH) {
    var _bar$getProps2 = bar.getProps(['enableBorderRadius']),
      enableBorderRadius = _bar$getProps2.enableBorderRadius;
    var value = bar.options.borderRadius;
    var o$$1 = toTRBLCorners(value);
    var maxR = Math.min(maxW, maxH);
    var skip = bar.borderSkipped;
    var enableBorder = enableBorderRadius || isObject(value);
    return {
      topLeft: skipOrLimit(!enableBorder || skip.top || skip.left, o$$1.topLeft, 0, maxR),
      topRight: skipOrLimit(!enableBorder || skip.top || skip.right, o$$1.topRight, 0, maxR),
      bottomLeft: skipOrLimit(!enableBorder || skip.bottom || skip.left, o$$1.bottomLeft, 0, maxR),
      bottomRight: skipOrLimit(!enableBorder || skip.bottom || skip.right, o$$1.bottomRight, 0, maxR)
    };
  }
  function boundingRects(bar) {
    var bounds = getBarBounds(bar);
    var width = bounds.right - bounds.left;
    var height = bounds.bottom - bounds.top;
    var border = parseBorderWidth(bar, width / 2, height / 2);
    var radius = parseBorderRadius(bar, width / 2, height / 2);
    return {
      outer: {
        x: bounds.left,
        y: bounds.top,
        w: width,
        h: height,
        radius: radius
      },
      inner: {
        x: bounds.left + border.l,
        y: bounds.top + border.t,
        w: width - border.l - border.r,
        h: height - border.t - border.b,
        radius: {
          topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
          topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
          bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
          bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r))
        }
      }
    };
  }
  function _inRange(bar, x$$1, y$$1, useFinalPosition) {
    var skipX = x$$1 === null;
    var skipY = y$$1 === null;
    var skipBoth = skipX && skipY;
    var bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);
    return bounds && (skipX || _isBetween(x$$1, bounds.left, bounds.right)) && (skipY || _isBetween(y$$1, bounds.top, bounds.bottom));
  }
  function hasRadius(radius) {
    return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
  }
  function addNormalRectPath(ctx, rect) {
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
  }
  function inflateRect(rect, amount) {
    var refRect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var x$$1 = rect.x !== refRect.x ? -amount : 0;
    var y$$1 = rect.y !== refRect.y ? -amount : 0;
    var w$$1 = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x$$1;
    var h$$1 = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y$$1;
    return {
      x: rect.x + x$$1,
      y: rect.y + y$$1,
      w: rect.w + w$$1,
      h: rect.h + h$$1,
      radius: rect.radius
    };
  }
  var BarElement = /*#__PURE__*/function (_Element5) {
    babelHelpers.inherits(BarElement, _Element5);
    function BarElement(cfg) {
      var _this26;
      babelHelpers.classCallCheck(this, BarElement);
      _this26 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(BarElement).call(this));
      _this26.options = undefined;
      _this26.horizontal = undefined;
      _this26.base = undefined;
      _this26.width = undefined;
      _this26.height = undefined;
      _this26.inflateAmount = undefined;
      if (cfg) {
        Object.assign(babelHelpers.assertThisInitialized(_this26), cfg);
      }
      return _this26;
    }
    babelHelpers.createClass(BarElement, [{
      key: "draw",
      value: function draw(ctx) {
        var inflateAmount = this.inflateAmount,
          _this$options14 = this.options,
          borderColor = _this$options14.borderColor,
          backgroundColor = _this$options14.backgroundColor;
        var _boundingRects = boundingRects(this),
          inner = _boundingRects.inner,
          outer = _boundingRects.outer;
        var addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;
        ctx.save();
        if (outer.w !== inner.w || outer.h !== inner.h) {
          ctx.beginPath();
          addRectPath(ctx, inflateRect(outer, inflateAmount, inner));
          ctx.clip();
          addRectPath(ctx, inflateRect(inner, -inflateAmount, outer));
          ctx.fillStyle = borderColor;
          ctx.fill('evenodd');
        }
        ctx.beginPath();
        addRectPath(ctx, inflateRect(inner, inflateAmount));
        ctx.fillStyle = backgroundColor;
        ctx.fill();
        ctx.restore();
      }
    }, {
      key: "inRange",
      value: function inRange(mouseX, mouseY, useFinalPosition) {
        return _inRange(this, mouseX, mouseY, useFinalPosition);
      }
    }, {
      key: "inXRange",
      value: function inXRange(mouseX, useFinalPosition) {
        return _inRange(this, mouseX, null, useFinalPosition);
      }
    }, {
      key: "inYRange",
      value: function inYRange(mouseY, useFinalPosition) {
        return _inRange(this, null, mouseY, useFinalPosition);
      }
    }, {
      key: "getCenterPoint",
      value: function getCenterPoint(useFinalPosition) {
        var _this$getProps6 = this.getProps(['x', 'y', 'base', 'horizontal'], useFinalPosition),
          x$$1 = _this$getProps6.x,
          y$$1 = _this$getProps6.y,
          base = _this$getProps6.base,
          horizontal = _this$getProps6.horizontal;
        return {
          x: horizontal ? (x$$1 + base) / 2 : x$$1,
          y: horizontal ? y$$1 : (y$$1 + base) / 2
        };
      }
    }, {
      key: "getRange",
      value: function getRange(axis) {
        return axis === 'x' ? this.width / 2 : this.height / 2;
      }
    }]);
    return BarElement;
  }(Element);
  babelHelpers.defineProperty(BarElement, "id", 'bar');
  babelHelpers.defineProperty(BarElement, "defaults", {
    borderSkipped: 'start',
    borderWidth: 0,
    borderRadius: 0,
    inflateAmount: 'auto',
    pointStyle: undefined
  });
  babelHelpers.defineProperty(BarElement, "defaultRoutes", {
    backgroundColor: 'backgroundColor',
    borderColor: 'borderColor'
  });
  var elements = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ArcElement: ArcElement,
    LineElement: LineElement,
    PointElement: PointElement,
    BarElement: BarElement
  });
  var BORDER_COLORS = ['rgb(54, 162, 235)', 'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)' // grey
  ];
  // Border colors with 50% transparency
  var BACKGROUND_COLORS = /* #__PURE__ */BORDER_COLORS.map(function (color$$1) {
    return color$$1.replace('rgb(', 'rgba(').replace(')', ', 0.5)');
  });
  function getBorderColor(i$$1) {
    return BORDER_COLORS[i$$1 % BORDER_COLORS.length];
  }
  function getBackgroundColor(i$$1) {
    return BACKGROUND_COLORS[i$$1 % BACKGROUND_COLORS.length];
  }
  function colorizeDefaultDataset(dataset, i$$1) {
    dataset.borderColor = getBorderColor(i$$1);
    dataset.backgroundColor = getBackgroundColor(i$$1);
    return ++i$$1;
  }
  function colorizeDoughnutDataset(dataset, i$$1) {
    dataset.backgroundColor = dataset.data.map(function () {
      return getBorderColor(i$$1++);
    });
    return i$$1;
  }
  function colorizePolarAreaDataset(dataset, i$$1) {
    dataset.backgroundColor = dataset.data.map(function () {
      return getBackgroundColor(i$$1++);
    });
    return i$$1;
  }
  function getColorizer(chart) {
    var i$$1 = 0;
    return function (dataset, datasetIndex) {
      var controller = chart.getDatasetMeta(datasetIndex).controller;
      if (controller instanceof DoughnutController) {
        i$$1 = colorizeDoughnutDataset(dataset, i$$1);
      } else if (controller instanceof PolarAreaController) {
        i$$1 = colorizePolarAreaDataset(dataset, i$$1);
      } else if (controller) {
        i$$1 = colorizeDefaultDataset(dataset, i$$1);
      }
    };
  }
  function containsColorsDefinitions(descriptors$$1) {
    var k$$1;
    for (k$$1 in descriptors$$1) {
      if (descriptors$$1[k$$1].borderColor || descriptors$$1[k$$1].backgroundColor) {
        return true;
      }
    }
    return false;
  }
  function containsColorsDefinition(descriptor) {
    return descriptor && (descriptor.borderColor || descriptor.backgroundColor);
  }
  var plugin_colors = {
    id: 'colors',
    defaults: {
      enabled: true,
      forceOverride: false
    },
    beforeLayout: function beforeLayout(chart, _args, options) {
      if (!options.enabled) {
        return;
      }
      var _chart$config = chart.config,
        datasets = _chart$config.data.datasets,
        chartOptions = _chart$config.options;
      var elements = chartOptions.elements;
      if (!options.forceOverride && (containsColorsDefinitions(datasets) || containsColorsDefinition(chartOptions) || elements && containsColorsDefinitions(elements))) {
        return;
      }
      var colorizer = getColorizer(chart);
      datasets.forEach(colorizer);
    }
  };
  function lttbDecimation(data, start, count, availableWidth, options) {
    var samples = options.samples || availableWidth;
    if (samples >= count) {
      return data.slice(start, start + count);
    }
    var decimated = [];
    var bucketWidth = (count - 2) / (samples - 2);
    var sampledIndex = 0;
    var endIndex = start + count - 1;
    var a$$1 = start;
    var i$$1, maxAreaPoint, maxArea, area, nextA;
    decimated[sampledIndex++] = data[a$$1];
    for (i$$1 = 0; i$$1 < samples - 2; i$$1++) {
      var avgX = 0;
      var avgY = 0;
      var j$$1 = void 0;
      var avgRangeStart = Math.floor((i$$1 + 1) * bucketWidth) + 1 + start;
      var avgRangeEnd = Math.min(Math.floor((i$$1 + 2) * bucketWidth) + 1, count) + start;
      var avgRangeLength = avgRangeEnd - avgRangeStart;
      for (j$$1 = avgRangeStart; j$$1 < avgRangeEnd; j$$1++) {
        avgX += data[j$$1].x;
        avgY += data[j$$1].y;
      }
      avgX /= avgRangeLength;
      avgY /= avgRangeLength;
      var rangeOffs = Math.floor(i$$1 * bucketWidth) + 1 + start;
      var rangeTo = Math.min(Math.floor((i$$1 + 1) * bucketWidth) + 1, count) + start;
      var _data$a = data[a$$1],
        pointAx = _data$a.x,
        pointAy = _data$a.y;
      maxArea = area = -1;
      for (j$$1 = rangeOffs; j$$1 < rangeTo; j$$1++) {
        area = 0.5 * Math.abs((pointAx - avgX) * (data[j$$1].y - pointAy) - (pointAx - data[j$$1].x) * (avgY - pointAy));
        if (area > maxArea) {
          maxArea = area;
          maxAreaPoint = data[j$$1];
          nextA = j$$1;
        }
      }
      decimated[sampledIndex++] = maxAreaPoint;
      a$$1 = nextA;
    }
    decimated[sampledIndex++] = data[endIndex];
    return decimated;
  }
  function minMaxDecimation(data, start, count, availableWidth) {
    var avgX = 0;
    var countX = 0;
    var i$$1, point, x$$1, y$$1, prevX, minIndex, maxIndex, startIndex, minY, maxY;
    var decimated = [];
    var endIndex = start + count - 1;
    var xMin = data[start].x;
    var xMax = data[endIndex].x;
    var dx = xMax - xMin;
    for (i$$1 = start; i$$1 < start + count; ++i$$1) {
      point = data[i$$1];
      x$$1 = (point.x - xMin) / dx * availableWidth;
      y$$1 = point.y;
      var truncX = x$$1 | 0;
      if (truncX === prevX) {
        if (y$$1 < minY) {
          minY = y$$1;
          minIndex = i$$1;
        } else if (y$$1 > maxY) {
          maxY = y$$1;
          maxIndex = i$$1;
        }
        avgX = (countX * avgX + point.x) / ++countX;
      } else {
        var lastIndex = i$$1 - 1;
        if (!isNullOrUndef(minIndex) && !isNullOrUndef(maxIndex)) {
          var intermediateIndex1 = Math.min(minIndex, maxIndex);
          var intermediateIndex2 = Math.max(minIndex, maxIndex);
          if (intermediateIndex1 !== startIndex && intermediateIndex1 !== lastIndex) {
            decimated.push(_objectSpread(_objectSpread({}, data[intermediateIndex1]), {}, {
              x: avgX
            }));
          }
          if (intermediateIndex2 !== startIndex && intermediateIndex2 !== lastIndex) {
            decimated.push(_objectSpread(_objectSpread({}, data[intermediateIndex2]), {}, {
              x: avgX
            }));
          }
        }
        if (i$$1 > 0 && lastIndex !== startIndex) {
          decimated.push(data[lastIndex]);
        }
        decimated.push(point);
        prevX = truncX;
        countX = 0;
        minY = maxY = y$$1;
        minIndex = maxIndex = startIndex = i$$1;
      }
    }
    return decimated;
  }
  function cleanDecimatedDataset(dataset) {
    if (dataset._decimated) {
      var data = dataset._data;
      delete dataset._decimated;
      delete dataset._data;
      Object.defineProperty(dataset, 'data', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: data
      });
    }
  }
  function cleanDecimatedData(chart) {
    chart.data.datasets.forEach(function (dataset) {
      cleanDecimatedDataset(dataset);
    });
  }
  function getStartAndCountOfVisiblePointsSimplified(meta, points) {
    var pointCount = points.length;
    var start = 0;
    var count;
    var iScale = meta.iScale;
    var _iScale$getUserBounds = iScale.getUserBounds(),
      min = _iScale$getUserBounds.min,
      max = _iScale$getUserBounds.max,
      minDefined = _iScale$getUserBounds.minDefined,
      maxDefined = _iScale$getUserBounds.maxDefined;
    if (minDefined) {
      start = _limitValue(_lookupByKey(points, iScale.axis, min).lo, 0, pointCount - 1);
    }
    if (maxDefined) {
      count = _limitValue(_lookupByKey(points, iScale.axis, max).hi + 1, start, pointCount) - start;
    } else {
      count = pointCount - start;
    }
    return {
      start: start,
      count: count
    };
  }
  var plugin_decimation = {
    id: 'decimation',
    defaults: {
      algorithm: 'min-max',
      enabled: false
    },
    beforeElementsUpdate: function beforeElementsUpdate(chart, args, options) {
      if (!options.enabled) {
        cleanDecimatedData(chart);
        return;
      }
      var availableWidth = chart.width;
      chart.data.datasets.forEach(function (dataset, datasetIndex) {
        var _data = dataset._data,
          indexAxis = dataset.indexAxis;
        var meta = chart.getDatasetMeta(datasetIndex);
        var data = _data || dataset.data;
        if (resolve([indexAxis, chart.options.indexAxis]) === 'y') {
          return;
        }
        if (!meta.controller.supportsDecimation) {
          return;
        }
        var xAxis = chart.scales[meta.xAxisID];
        if (xAxis.type !== 'linear' && xAxis.type !== 'time') {
          return;
        }
        if (chart.options.parsing) {
          return;
        }
        var _getStartAndCountOfVi3 = getStartAndCountOfVisiblePointsSimplified(meta, data),
          start = _getStartAndCountOfVi3.start,
          count = _getStartAndCountOfVi3.count;
        var threshold = options.threshold || 4 * availableWidth;
        if (count <= threshold) {
          cleanDecimatedDataset(dataset);
          return;
        }
        if (isNullOrUndef(_data)) {
          dataset._data = data;
          delete dataset.data;
          Object.defineProperty(dataset, 'data', {
            configurable: true,
            enumerable: true,
            get: function get() {
              return this._decimated;
            },
            set: function set(d$$1) {
              this._data = d$$1;
            }
          });
        }
        var decimated;
        switch (options.algorithm) {
          case 'lttb':
            decimated = lttbDecimation(data, start, count, availableWidth, options);
            break;
          case 'min-max':
            decimated = minMaxDecimation(data, start, count, availableWidth);
            break;
          default:
            throw new Error("Unsupported decimation algorithm '".concat(options.algorithm, "'"));
        }
        dataset._decimated = decimated;
      });
    },
    destroy: function destroy(chart) {
      cleanDecimatedData(chart);
    }
  };
  function _segments(line, target, property) {
    var segments = line.segments;
    var points = line.points;
    var tpoints = target.points;
    var parts = [];
    var _iterator18 = _createForOfIteratorHelper$1(segments),
      _step18;
    try {
      for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
        var segment = _step18.value;
        var start = segment.start,
          end = segment.end;
        end = _findSegmentEnd(start, end, points);
        var bounds = _getBounds(property, points[start], points[end], segment.loop);
        if (!target.segments) {
          parts.push({
            source: segment,
            target: bounds,
            start: points[start],
            end: points[end]
          });
          continue;
        }
        var targetSegments = _boundSegments(target, bounds);
        var _iterator19 = _createForOfIteratorHelper$1(targetSegments),
          _step19;
        try {
          for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
            var tgt = _step19.value;
            var subBounds = _getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
            var fillSources = _boundSegment(segment, points, subBounds);
            var _iterator20 = _createForOfIteratorHelper$1(fillSources),
              _step20;
            try {
              for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
                var fillSource = _step20.value;
                parts.push({
                  source: fillSource,
                  target: tgt,
                  start: babelHelpers.defineProperty({}, property, _getEdge(bounds, subBounds, 'start', Math.max)),
                  end: babelHelpers.defineProperty({}, property, _getEdge(bounds, subBounds, 'end', Math.min))
                });
              }
            } catch (err) {
              _iterator20.e(err);
            } finally {
              _iterator20.f();
            }
          }
        } catch (err) {
          _iterator19.e(err);
        } finally {
          _iterator19.f();
        }
      }
    } catch (err) {
      _iterator18.e(err);
    } finally {
      _iterator18.f();
    }
    return parts;
  }
  function _getBounds(property, first, last, loop) {
    if (loop) {
      return;
    }
    var start = first[property];
    var end = last[property];
    if (property === 'angle') {
      start = _normalizeAngle(start);
      end = _normalizeAngle(end);
    }
    return {
      property: property,
      start: start,
      end: end
    };
  }
  function _pointsFromSegments(boundary, line) {
    var _ref7 = boundary || {},
      _ref7$x = _ref7.x,
      x$$1 = _ref7$x === void 0 ? null : _ref7$x,
      _ref7$y = _ref7.y,
      y$$1 = _ref7$y === void 0 ? null : _ref7$y;
    var linePoints = line.points;
    var points = [];
    line.segments.forEach(function (_ref8) {
      var start = _ref8.start,
        end = _ref8.end;
      end = _findSegmentEnd(start, end, linePoints);
      var first = linePoints[start];
      var last = linePoints[end];
      if (y$$1 !== null) {
        points.push({
          x: first.x,
          y: y$$1
        });
        points.push({
          x: last.x,
          y: y$$1
        });
      } else if (x$$1 !== null) {
        points.push({
          x: x$$1,
          y: first.y
        });
        points.push({
          x: x$$1,
          y: last.y
        });
      }
    });
    return points;
  }
  function _findSegmentEnd(start, end, points) {
    for (; end > start; end--) {
      var point = points[end];
      if (!isNaN(point.x) && !isNaN(point.y)) {
        break;
      }
    }
    return end;
  }
  function _getEdge(a$$1, b$$1, prop, fn) {
    if (a$$1 && b$$1) {
      return fn(a$$1[prop], b$$1[prop]);
    }
    return a$$1 ? a$$1[prop] : b$$1 ? b$$1[prop] : 0;
  }
  function _createBoundaryLine(boundary, line) {
    var points = [];
    var _loop = false;
    if (isArray(boundary)) {
      _loop = true;
      points = boundary;
    } else {
      points = _pointsFromSegments(boundary, line);
    }
    return points.length ? new LineElement({
      points: points,
      options: {
        tension: 0
      },
      _loop: _loop,
      _fullLoop: _loop
    }) : null;
  }
  function _shouldApplyFill(source) {
    return source && source.fill !== false;
  }
  function _resolveTarget(sources, index, propagate) {
    var source = sources[index];
    var fill = source.fill;
    var visited = [index];
    var target;
    if (!propagate) {
      return fill;
    }
    while (fill !== false && visited.indexOf(fill) === -1) {
      if (!isNumberFinite(fill)) {
        return fill;
      }
      target = sources[fill];
      if (!target) {
        return false;
      }
      if (target.visible) {
        return fill;
      }
      visited.push(fill);
      fill = target.fill;
    }
    return false;
  }
  function _decodeFill(line, index, count) {
    var fill = parseFillOption(line);
    if (isObject(fill)) {
      return isNaN(fill.value) ? false : fill;
    }
    var target = parseFloat(fill);
    if (isNumberFinite(target) && Math.floor(target) === target) {
      return decodeTargetIndex(fill[0], index, target, count);
    }
    return ['origin', 'start', 'end', 'stack', 'shape'].indexOf(fill) >= 0 && fill;
  }
  function decodeTargetIndex(firstCh, index, target, count) {
    if (firstCh === '-' || firstCh === '+') {
      target = index + target;
    }
    if (target === index || target < 0 || target >= count) {
      return false;
    }
    return target;
  }
  function _getTargetPixel(fill, scale) {
    var pixel = null;
    if (fill === 'start') {
      pixel = scale.bottom;
    } else if (fill === 'end') {
      pixel = scale.top;
    } else if (isObject(fill)) {
      pixel = scale.getPixelForValue(fill.value);
    } else if (scale.getBasePixel) {
      pixel = scale.getBasePixel();
    }
    return pixel;
  }
  function _getTargetValue(fill, scale, startValue) {
    var value;
    if (fill === 'start') {
      value = startValue;
    } else if (fill === 'end') {
      value = scale.options.reverse ? scale.min : scale.max;
    } else if (isObject(fill)) {
      value = fill.value;
    } else {
      value = scale.getBaseValue();
    }
    return value;
  }
  function parseFillOption(line) {
    var options = line.options;
    var fillOption = options.fill;
    var fill = valueOrDefault(fillOption && fillOption.target, fillOption);
    if (fill === undefined) {
      fill = !!options.backgroundColor;
    }
    if (fill === false || fill === null) {
      return false;
    }
    if (fill === true) {
      return 'origin';
    }
    return fill;
  }
  function _buildStackLine(source) {
    var scale = source.scale,
      index = source.index,
      line = source.line;
    var points = [];
    var segments = line.segments;
    var sourcePoints = line.points;
    var linesBelow = getLinesBelow(scale, index);
    linesBelow.push(_createBoundaryLine({
      x: null,
      y: scale.bottom
    }, line));
    for (var i$$1 = 0; i$$1 < segments.length; i$$1++) {
      var segment = segments[i$$1];
      for (var j$$1 = segment.start; j$$1 <= segment.end; j$$1++) {
        addPointsBelow(points, sourcePoints[j$$1], linesBelow);
      }
    }
    return new LineElement({
      points: points,
      options: {}
    });
  }
  function getLinesBelow(scale, index) {
    var below = [];
    var metas = scale.getMatchingVisibleMetas('line');
    for (var i$$1 = 0; i$$1 < metas.length; i$$1++) {
      var meta = metas[i$$1];
      if (meta.index === index) {
        break;
      }
      if (!meta.hidden) {
        below.unshift(meta.dataset);
      }
    }
    return below;
  }
  function addPointsBelow(points, sourcePoint, linesBelow) {
    var postponed = [];
    for (var j$$1 = 0; j$$1 < linesBelow.length; j$$1++) {
      var line = linesBelow[j$$1];
      var _findPoint = findPoint(line, sourcePoint, 'x'),
        first = _findPoint.first,
        last = _findPoint.last,
        point = _findPoint.point;
      if (!point || first && last) {
        continue;
      }
      if (first) {
        postponed.unshift(point);
      } else {
        points.push(point);
        if (!last) {
          break;
        }
      }
    }
    points.push.apply(points, postponed);
  }
  function findPoint(line, sourcePoint, property) {
    var point = line.interpolate(sourcePoint, property);
    if (!point) {
      return {};
    }
    var pointValue = point[property];
    var segments = line.segments;
    var linePoints = line.points;
    var first = false;
    var last = false;
    for (var i$$1 = 0; i$$1 < segments.length; i$$1++) {
      var segment = segments[i$$1];
      var firstValue = linePoints[segment.start][property];
      var lastValue = linePoints[segment.end][property];
      if (_isBetween(pointValue, firstValue, lastValue)) {
        first = pointValue === firstValue;
        last = pointValue === lastValue;
        break;
      }
    }
    return {
      first: first,
      last: last,
      point: point
    };
  }
  var simpleArc = /*#__PURE__*/function () {
    function simpleArc(opts) {
      babelHelpers.classCallCheck(this, simpleArc);
      this.x = opts.x;
      this.y = opts.y;
      this.radius = opts.radius;
    }
    babelHelpers.createClass(simpleArc, [{
      key: "pathSegment",
      value: function pathSegment(ctx, bounds, opts) {
        var x$$1 = this.x,
          y$$1 = this.y,
          radius = this.radius;
        bounds = bounds || {
          start: 0,
          end: TAU
        };
        ctx.arc(x$$1, y$$1, radius, bounds.end, bounds.start, true);
        return !opts.bounds;
      }
    }, {
      key: "interpolate",
      value: function interpolate(point) {
        var x$$1 = this.x,
          y$$1 = this.y,
          radius = this.radius;
        var angle = point.angle;
        return {
          x: x$$1 + Math.cos(angle) * radius,
          y: y$$1 + Math.sin(angle) * radius,
          angle: angle
        };
      }
    }]);
    return simpleArc;
  }();
  function _getTarget(source) {
    var chart = source.chart,
      fill = source.fill,
      line = source.line;
    if (isNumberFinite(fill)) {
      return getLineByIndex(chart, fill);
    }
    if (fill === 'stack') {
      return _buildStackLine(source);
    }
    if (fill === 'shape') {
      return true;
    }
    var boundary = computeBoundary(source);
    if (boundary instanceof simpleArc) {
      return boundary;
    }
    return _createBoundaryLine(boundary, line);
  }
  function getLineByIndex(chart, index) {
    var meta = chart.getDatasetMeta(index);
    var visible = meta && chart.isDatasetVisible(index);
    return visible ? meta.dataset : null;
  }
  function computeBoundary(source) {
    var scale = source.scale || {};
    if (scale.getPointPositionForValue) {
      return computeCircularBoundary(source);
    }
    return computeLinearBoundary(source);
  }
  function computeLinearBoundary(source) {
    var _source$scale = source.scale,
      scale = _source$scale === void 0 ? {} : _source$scale,
      fill = source.fill;
    var pixel = _getTargetPixel(fill, scale);
    if (isNumberFinite(pixel)) {
      var horizontal = scale.isHorizontal();
      return {
        x: horizontal ? pixel : null,
        y: horizontal ? null : pixel
      };
    }
    return null;
  }
  function computeCircularBoundary(source) {
    var scale = source.scale,
      fill = source.fill;
    var options = scale.options;
    var length = scale.getLabels().length;
    var start = options.reverse ? scale.max : scale.min;
    var value = _getTargetValue(fill, scale, start);
    var target = [];
    if (options.grid.circular) {
      var center = scale.getPointPositionForValue(0, start);
      return new simpleArc({
        x: center.x,
        y: center.y,
        radius: scale.getDistanceFromCenterForValue(value)
      });
    }
    for (var i$$1 = 0; i$$1 < length; ++i$$1) {
      target.push(scale.getPointPositionForValue(i$$1, value));
    }
    return target;
  }
  function _drawfill(ctx, source, area) {
    var target = _getTarget(source);
    var line = source.line,
      scale = source.scale,
      axis = source.axis;
    var lineOpts = line.options;
    var fillOption = lineOpts.fill;
    var color$$1 = lineOpts.backgroundColor;
    var _ref9 = fillOption || {},
      _ref9$above = _ref9.above,
      above = _ref9$above === void 0 ? color$$1 : _ref9$above,
      _ref9$below = _ref9.below,
      below = _ref9$below === void 0 ? color$$1 : _ref9$below;
    if (target && line.points.length) {
      clipArea(ctx, area);
      doFill(ctx, {
        line: line,
        target: target,
        above: above,
        below: below,
        area: area,
        scale: scale,
        axis: axis
      });
      unclipArea(ctx);
    }
  }
  function doFill(ctx, cfg) {
    var line = cfg.line,
      target = cfg.target,
      above = cfg.above,
      below = cfg.below,
      area = cfg.area,
      scale = cfg.scale;
    var property = line._loop ? 'angle' : cfg.axis;
    ctx.save();
    if (property === 'x' && below !== above) {
      clipVertical(ctx, target, area.top);
      fill(ctx, {
        line: line,
        target: target,
        color: above,
        scale: scale,
        property: property
      });
      ctx.restore();
      ctx.save();
      clipVertical(ctx, target, area.bottom);
    }
    fill(ctx, {
      line: line,
      target: target,
      color: below,
      scale: scale,
      property: property
    });
    ctx.restore();
  }
  function clipVertical(ctx, target, clipY) {
    var segments = target.segments,
      points = target.points;
    var first = true;
    var lineLoop = false;
    ctx.beginPath();
    var _iterator21 = _createForOfIteratorHelper$1(segments),
      _step21;
    try {
      for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
        var segment = _step21.value;
        var start = segment.start,
          end = segment.end;
        var firstPoint = points[start];
        var lastPoint = points[_findSegmentEnd(start, end, points)];
        if (first) {
          ctx.moveTo(firstPoint.x, firstPoint.y);
          first = false;
        } else {
          ctx.lineTo(firstPoint.x, clipY);
          ctx.lineTo(firstPoint.x, firstPoint.y);
        }
        lineLoop = !!target.pathSegment(ctx, segment, {
          move: lineLoop
        });
        if (lineLoop) {
          ctx.closePath();
        } else {
          ctx.lineTo(lastPoint.x, clipY);
        }
      }
    } catch (err) {
      _iterator21.e(err);
    } finally {
      _iterator21.f();
    }
    ctx.lineTo(target.first().x, clipY);
    ctx.closePath();
    ctx.clip();
  }
  function fill(ctx, cfg) {
    var line = cfg.line,
      target = cfg.target,
      property = cfg.property,
      color$$1 = cfg.color,
      scale = cfg.scale;
    var segments = _segments(line, target, property);
    var _iterator22 = _createForOfIteratorHelper$1(segments),
      _step22;
    try {
      for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
        var _step22$value = _step22.value,
          src = _step22$value.source,
          tgt = _step22$value.target,
          start = _step22$value.start,
          end = _step22$value.end;
        var _src$style = src.style,
          _src$style2 = _src$style === void 0 ? {} : _src$style,
          _src$style2$backgroun = _src$style2.backgroundColor,
          backgroundColor = _src$style2$backgroun === void 0 ? color$$1 : _src$style2$backgroun;
        var notShape = target !== true;
        ctx.save();
        ctx.fillStyle = backgroundColor;
        clipBounds(ctx, scale, notShape && _getBounds(property, start, end));
        ctx.beginPath();
        var lineLoop = !!line.pathSegment(ctx, src);
        var loop = void 0;
        if (notShape) {
          if (lineLoop) {
            ctx.closePath();
          } else {
            interpolatedLineTo(ctx, target, end, property);
          }
          var targetLoop = !!target.pathSegment(ctx, tgt, {
            move: lineLoop,
            reverse: true
          });
          loop = lineLoop && targetLoop;
          if (!loop) {
            interpolatedLineTo(ctx, target, start, property);
          }
        }
        ctx.closePath();
        ctx.fill(loop ? 'evenodd' : 'nonzero');
        ctx.restore();
      }
    } catch (err) {
      _iterator22.e(err);
    } finally {
      _iterator22.f();
    }
  }
  function clipBounds(ctx, scale, bounds) {
    var _scale$chart$chartAre = scale.chart.chartArea,
      top = _scale$chart$chartAre.top,
      bottom = _scale$chart$chartAre.bottom;
    var _ref10 = bounds || {},
      property = _ref10.property,
      start = _ref10.start,
      end = _ref10.end;
    if (property === 'x') {
      ctx.beginPath();
      ctx.rect(start, top, end - start, bottom - top);
      ctx.clip();
    }
  }
  function interpolatedLineTo(ctx, target, point, property) {
    var interpolatedPoint = target.interpolate(point, property);
    if (interpolatedPoint) {
      ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y);
    }
  }
  var index = {
    id: 'filler',
    afterDatasetsUpdate: function afterDatasetsUpdate(chart, _args, options) {
      var count = (chart.data.datasets || []).length;
      var sources = [];
      var meta, i$$1, line, source;
      for (i$$1 = 0; i$$1 < count; ++i$$1) {
        meta = chart.getDatasetMeta(i$$1);
        line = meta.dataset;
        source = null;
        if (line && line.options && line instanceof LineElement) {
          source = {
            visible: chart.isDatasetVisible(i$$1),
            index: i$$1,
            fill: _decodeFill(line, i$$1, count),
            chart: chart,
            axis: meta.controller.options.indexAxis,
            scale: meta.vScale,
            line: line
          };
        }
        meta.$filler = source;
        sources.push(source);
      }
      for (i$$1 = 0; i$$1 < count; ++i$$1) {
        source = sources[i$$1];
        if (!source || source.fill === false) {
          continue;
        }
        source.fill = _resolveTarget(sources, i$$1, options.propagate);
      }
    },
    beforeDraw: function beforeDraw(chart, _args, options) {
      var draw = options.drawTime === 'beforeDraw';
      var metasets = chart.getSortedVisibleDatasetMetas();
      var area = chart.chartArea;
      for (var i$$1 = metasets.length - 1; i$$1 >= 0; --i$$1) {
        var source = metasets[i$$1].$filler;
        if (!source) {
          continue;
        }
        source.line.updateControlPoints(area, source.axis);
        if (draw && source.fill) {
          _drawfill(chart.ctx, source, area);
        }
      }
    },
    beforeDatasetsDraw: function beforeDatasetsDraw(chart, _args, options) {
      if (options.drawTime !== 'beforeDatasetsDraw') {
        return;
      }
      var metasets = chart.getSortedVisibleDatasetMetas();
      for (var i$$1 = metasets.length - 1; i$$1 >= 0; --i$$1) {
        var source = metasets[i$$1].$filler;
        if (_shouldApplyFill(source)) {
          _drawfill(chart.ctx, source, chart.chartArea);
        }
      }
    },
    beforeDatasetDraw: function beforeDatasetDraw(chart, args, options) {
      var source = args.meta.$filler;
      if (!_shouldApplyFill(source) || options.drawTime !== 'beforeDatasetDraw') {
        return;
      }
      _drawfill(chart.ctx, source, chart.chartArea);
    },
    defaults: {
      propagate: true,
      drawTime: 'beforeDatasetDraw'
    }
  };
  var getBoxSize = function getBoxSize(labelOpts, fontSize) {
    var _labelOpts$boxHeight = labelOpts.boxHeight,
      boxHeight = _labelOpts$boxHeight === void 0 ? fontSize : _labelOpts$boxHeight,
      _labelOpts$boxWidth = labelOpts.boxWidth,
      boxWidth = _labelOpts$boxWidth === void 0 ? fontSize : _labelOpts$boxWidth;
    if (labelOpts.usePointStyle) {
      boxHeight = Math.min(boxHeight, fontSize);
      boxWidth = labelOpts.pointStyleWidth || Math.min(boxWidth, fontSize);
    }
    return {
      boxWidth: boxWidth,
      boxHeight: boxHeight,
      itemHeight: Math.max(fontSize, boxHeight)
    };
  };
  var itemsEqual = function itemsEqual(a$$1, b$$1) {
    return a$$1 !== null && b$$1 !== null && a$$1.datasetIndex === b$$1.datasetIndex && a$$1.index === b$$1.index;
  };
  var Legend = /*#__PURE__*/function (_Element6) {
    babelHelpers.inherits(Legend, _Element6);
    function Legend(config) {
      var _this27;
      babelHelpers.classCallCheck(this, Legend);
      _this27 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Legend).call(this));
      _this27._added = false;
      _this27.legendHitBoxes = [];
      _this27._hoveredItem = null;
      _this27.doughnutMode = false;
      _this27.chart = config.chart;
      _this27.options = config.options;
      _this27.ctx = config.ctx;
      _this27.legendItems = undefined;
      _this27.columnSizes = undefined;
      _this27.lineWidths = undefined;
      _this27.maxHeight = undefined;
      _this27.maxWidth = undefined;
      _this27.top = undefined;
      _this27.bottom = undefined;
      _this27.left = undefined;
      _this27.right = undefined;
      _this27.height = undefined;
      _this27.width = undefined;
      _this27._margins = undefined;
      _this27.position = undefined;
      _this27.weight = undefined;
      _this27.fullSize = undefined;
      return _this27;
    }
    babelHelpers.createClass(Legend, [{
      key: "update",
      value: function update(maxWidth, maxHeight, margins) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this._margins = margins;
        this.setDimensions();
        this.buildLabels();
        this.fit();
      }
    }, {
      key: "setDimensions",
      value: function setDimensions() {
        if (this.isHorizontal()) {
          this.width = this.maxWidth;
          this.left = this._margins.left;
          this.right = this.width;
        } else {
          this.height = this.maxHeight;
          this.top = this._margins.top;
          this.bottom = this.height;
        }
      }
    }, {
      key: "buildLabels",
      value: function buildLabels() {
        var _this28 = this;
        var labelOpts = this.options.labels || {};
        var legendItems = callback(labelOpts.generateLabels, [this.chart], this) || [];
        if (labelOpts.filter) {
          legendItems = legendItems.filter(function (item) {
            return labelOpts.filter(item, _this28.chart.data);
          });
        }
        if (labelOpts.sort) {
          legendItems = legendItems.sort(function (a$$1, b$$1) {
            return labelOpts.sort(a$$1, b$$1, _this28.chart.data);
          });
        }
        if (this.options.reverse) {
          legendItems.reverse();
        }
        this.legendItems = legendItems;
      }
    }, {
      key: "fit",
      value: function fit() {
        var options = this.options,
          ctx = this.ctx;
        if (!options.display) {
          this.width = this.height = 0;
          return;
        }
        var labelOpts = options.labels;
        var labelFont = toFont(labelOpts.font);
        var fontSize = labelFont.size;
        var titleHeight = this._computeTitleHeight();
        var _getBoxSize = getBoxSize(labelOpts, fontSize),
          boxWidth = _getBoxSize.boxWidth,
          itemHeight = _getBoxSize.itemHeight;
        var width, height;
        ctx.font = labelFont.string;
        if (this.isHorizontal()) {
          width = this.maxWidth;
          height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
        } else {
          height = this.maxHeight;
          width = this._fitCols(titleHeight, labelFont, boxWidth, itemHeight) + 10;
        }
        this.width = Math.min(width, options.maxWidth || this.maxWidth);
        this.height = Math.min(height, options.maxHeight || this.maxHeight);
      }
    }, {
      key: "_fitRows",
      value: function _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
        var ctx = this.ctx,
          maxWidth = this.maxWidth,
          padding = this.options.labels.padding;
        var hitboxes = this.legendHitBoxes = [];
        var lineWidths = this.lineWidths = [0];
        var lineHeight = itemHeight + padding;
        var totalHeight = titleHeight;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        var row = -1;
        var top = -lineHeight;
        this.legendItems.forEach(function (legendItem, i$$1) {
          var itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
          if (i$$1 === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
            totalHeight += lineHeight;
            lineWidths[lineWidths.length - (i$$1 > 0 ? 0 : 1)] = 0;
            top += lineHeight;
            row++;
          }
          hitboxes[i$$1] = {
            left: 0,
            top: top,
            row: row,
            width: itemWidth,
            height: itemHeight
          };
          lineWidths[lineWidths.length - 1] += itemWidth + padding;
        });
        return totalHeight;
      }
    }, {
      key: "_fitCols",
      value: function _fitCols(titleHeight, labelFont, boxWidth, _itemHeight) {
        var ctx = this.ctx,
          maxHeight = this.maxHeight,
          padding = this.options.labels.padding;
        var hitboxes = this.legendHitBoxes = [];
        var columnSizes = this.columnSizes = [];
        var heightLimit = maxHeight - titleHeight;
        var totalWidth = padding;
        var currentColWidth = 0;
        var currentColHeight = 0;
        var left = 0;
        var col = 0;
        this.legendItems.forEach(function (legendItem, i$$1) {
          var _calculateItemSize = calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight),
            itemWidth = _calculateItemSize.itemWidth,
            itemHeight = _calculateItemSize.itemHeight;
          if (i$$1 > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
            totalWidth += currentColWidth + padding;
            columnSizes.push({
              width: currentColWidth,
              height: currentColHeight
            });
            left += currentColWidth + padding;
            col++;
            currentColWidth = currentColHeight = 0;
          }
          hitboxes[i$$1] = {
            left: left,
            top: currentColHeight,
            col: col,
            width: itemWidth,
            height: itemHeight
          };
          currentColWidth = Math.max(currentColWidth, itemWidth);
          currentColHeight += itemHeight + padding;
        });
        totalWidth += currentColWidth;
        columnSizes.push({
          width: currentColWidth,
          height: currentColHeight
        });
        return totalWidth;
      }
    }, {
      key: "adjustHitBoxes",
      value: function adjustHitBoxes() {
        if (!this.options.display) {
          return;
        }
        var titleHeight = this._computeTitleHeight();
        var hitboxes = this.legendHitBoxes,
          _this$options15 = this.options,
          align = _this$options15.align,
          padding = _this$options15.labels.padding,
          rtl = _this$options15.rtl;
        var rtlHelper = getRtlAdapter(rtl, this.left, this.width);
        if (this.isHorizontal()) {
          var row = 0;
          var left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
          var _iterator23 = _createForOfIteratorHelper$1(hitboxes),
            _step23;
          try {
            for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
              var hitbox = _step23.value;
              if (row !== hitbox.row) {
                row = hitbox.row;
                left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
              }
              hitbox.top += this.top + titleHeight + padding;
              hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
              left += hitbox.width + padding;
            }
          } catch (err) {
            _iterator23.e(err);
          } finally {
            _iterator23.f();
          }
        } else {
          var col = 0;
          var top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
          var _iterator24 = _createForOfIteratorHelper$1(hitboxes),
            _step24;
          try {
            for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
              var hitbox1 = _step24.value;
              if (hitbox1.col !== col) {
                col = hitbox1.col;
                top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
              }
              hitbox1.top = top;
              hitbox1.left += this.left + padding;
              hitbox1.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox1.left), hitbox1.width);
              top += hitbox1.height + padding;
            }
          } catch (err) {
            _iterator24.e(err);
          } finally {
            _iterator24.f();
          }
        }
      }
    }, {
      key: "isHorizontal",
      value: function isHorizontal() {
        return this.options.position === 'top' || this.options.position === 'bottom';
      }
    }, {
      key: "draw",
      value: function draw() {
        if (this.options.display) {
          var ctx = this.ctx;
          clipArea(ctx, this);
          this._draw();
          unclipArea(ctx);
        }
      }
    }, {
      key: "_draw",
      value: function _draw() {
        var _this29 = this;
        var opts = this.options,
          columnSizes = this.columnSizes,
          lineWidths = this.lineWidths,
          ctx = this.ctx;
        var align = opts.align,
          labelOpts = opts.labels;
        var defaultColor = defaults.color;
        var rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
        var labelFont = toFont(labelOpts.font);
        var padding = labelOpts.padding;
        var fontSize = labelFont.size;
        var halfFontSize = fontSize / 2;
        var cursor;
        this.drawTitle();
        ctx.textAlign = rtlHelper.textAlign('left');
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 0.5;
        ctx.font = labelFont.string;
        var _getBoxSize2 = getBoxSize(labelOpts, fontSize),
          boxWidth = _getBoxSize2.boxWidth,
          boxHeight = _getBoxSize2.boxHeight,
          itemHeight = _getBoxSize2.itemHeight;
        var drawLegendBox = function drawLegendBox(x$$1, y$$1, legendItem) {
          if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
            return;
          }
          ctx.save();
          var lineWidth = valueOrDefault(legendItem.lineWidth, 1);
          ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
          ctx.lineCap = valueOrDefault(legendItem.lineCap, 'butt');
          ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
          ctx.lineJoin = valueOrDefault(legendItem.lineJoin, 'miter');
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
          ctx.setLineDash(valueOrDefault(legendItem.lineDash, []));
          if (labelOpts.usePointStyle) {
            var drawOptions = {
              radius: boxHeight * Math.SQRT2 / 2,
              pointStyle: legendItem.pointStyle,
              rotation: legendItem.rotation,
              borderWidth: lineWidth
            };
            var centerX = rtlHelper.xPlus(x$$1, boxWidth / 2);
            var centerY = y$$1 + halfFontSize;
            drawPointLegend(ctx, drawOptions, centerX, centerY, labelOpts.pointStyleWidth && boxWidth);
          } else {
            var yBoxTop = y$$1 + Math.max((fontSize - boxHeight) / 2, 0);
            var xBoxLeft = rtlHelper.leftForLtr(x$$1, boxWidth);
            var borderRadius = toTRBLCorners(legendItem.borderRadius);
            ctx.beginPath();
            if (Object.values(borderRadius).some(function (v$$1) {
              return v$$1 !== 0;
            })) {
              addRoundedRectPath(ctx, {
                x: xBoxLeft,
                y: yBoxTop,
                w: boxWidth,
                h: boxHeight,
                radius: borderRadius
              });
            } else {
              ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
            }
            ctx.fill();
            if (lineWidth !== 0) {
              ctx.stroke();
            }
          }
          ctx.restore();
        };
        var fillText = function fillText(x$$1, y$$1, legendItem) {
          renderText(ctx, legendItem.text, x$$1, y$$1 + itemHeight / 2, labelFont, {
            strikethrough: legendItem.hidden,
            textAlign: rtlHelper.textAlign(legendItem.textAlign)
          });
        };
        var isHorizontal = this.isHorizontal();
        var titleHeight = this._computeTitleHeight();
        if (isHorizontal) {
          cursor = {
            x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
            y: this.top + padding + titleHeight,
            line: 0
          };
        } else {
          cursor = {
            x: this.left + padding,
            y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
            line: 0
          };
        }
        overrideTextDirection(this.ctx, opts.textDirection);
        var lineHeight = itemHeight + padding;
        this.legendItems.forEach(function (legendItem, i$$1) {
          ctx.strokeStyle = legendItem.fontColor;
          ctx.fillStyle = legendItem.fontColor;
          var textWidth = ctx.measureText(legendItem.text).width;
          var textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
          var width = boxWidth + halfFontSize + textWidth;
          var x$$1 = cursor.x;
          var y$$1 = cursor.y;
          rtlHelper.setWidth(_this29.width);
          if (isHorizontal) {
            if (i$$1 > 0 && x$$1 + width + padding > _this29.right) {
              y$$1 = cursor.y += lineHeight;
              cursor.line++;
              x$$1 = cursor.x = _alignStartEnd(align, _this29.left + padding, _this29.right - lineWidths[cursor.line]);
            }
          } else if (i$$1 > 0 && y$$1 + lineHeight > _this29.bottom) {
            x$$1 = cursor.x = x$$1 + columnSizes[cursor.line].width + padding;
            cursor.line++;
            y$$1 = cursor.y = _alignStartEnd(align, _this29.top + titleHeight + padding, _this29.bottom - columnSizes[cursor.line].height);
          }
          var realX = rtlHelper.x(x$$1);
          drawLegendBox(realX, y$$1, legendItem);
          x$$1 = _textX(textAlign, x$$1 + boxWidth + halfFontSize, isHorizontal ? x$$1 + width : _this29.right, opts.rtl);
          fillText(rtlHelper.x(x$$1), y$$1, legendItem);
          if (isHorizontal) {
            cursor.x += width + padding;
          } else if (typeof legendItem.text !== 'string') {
            var fontLineHeight = labelFont.lineHeight;
            cursor.y += calculateLegendItemHeight(legendItem, fontLineHeight);
          } else {
            cursor.y += lineHeight;
          }
        });
        restoreTextDirection(this.ctx, opts.textDirection);
      }
    }, {
      key: "drawTitle",
      value: function drawTitle() {
        var opts = this.options;
        var titleOpts = opts.title;
        var titleFont = toFont(titleOpts.font);
        var titlePadding = toPadding(titleOpts.padding);
        if (!titleOpts.display) {
          return;
        }
        var rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
        var ctx = this.ctx;
        var position = titleOpts.position;
        var halfFontSize = titleFont.size / 2;
        var topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
        var y$$1;
        var left = this.left;
        var maxWidth = this.width;
        if (this.isHorizontal()) {
          maxWidth = Math.max.apply(Math, babelHelpers.toConsumableArray(this.lineWidths));
          y$$1 = this.top + topPaddingPlusHalfFontSize;
          left = _alignStartEnd(opts.align, left, this.right - maxWidth);
        } else {
          var maxHeight = this.columnSizes.reduce(function (acc, size) {
            return Math.max(acc, size.height);
          }, 0);
          y$$1 = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
        }
        var x$$1 = _alignStartEnd(position, left, left + maxWidth);
        ctx.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = titleOpts.color;
        ctx.fillStyle = titleOpts.color;
        ctx.font = titleFont.string;
        renderText(ctx, titleOpts.text, x$$1, y$$1, titleFont);
      }
    }, {
      key: "_computeTitleHeight",
      value: function _computeTitleHeight() {
        var titleOpts = this.options.title;
        var titleFont = toFont(titleOpts.font);
        var titlePadding = toPadding(titleOpts.padding);
        return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
      }
    }, {
      key: "_getLegendItemAt",
      value: function _getLegendItemAt(x$$1, y$$1) {
        var i$$1, hitBox, lh;
        if (_isBetween(x$$1, this.left, this.right) && _isBetween(y$$1, this.top, this.bottom)) {
          lh = this.legendHitBoxes;
          for (i$$1 = 0; i$$1 < lh.length; ++i$$1) {
            hitBox = lh[i$$1];
            if (_isBetween(x$$1, hitBox.left, hitBox.left + hitBox.width) && _isBetween(y$$1, hitBox.top, hitBox.top + hitBox.height)) {
              return this.legendItems[i$$1];
            }
          }
        }
        return null;
      }
    }, {
      key: "handleEvent",
      value: function handleEvent(e$$1) {
        var opts = this.options;
        if (!isListened(e$$1.type, opts)) {
          return;
        }
        var hoveredItem = this._getLegendItemAt(e$$1.x, e$$1.y);
        if (e$$1.type === 'mousemove' || e$$1.type === 'mouseout') {
          var previous = this._hoveredItem;
          var sameItem = itemsEqual(previous, hoveredItem);
          if (previous && !sameItem) {
            callback(opts.onLeave, [e$$1, previous, this], this);
          }
          this._hoveredItem = hoveredItem;
          if (hoveredItem && !sameItem) {
            callback(opts.onHover, [e$$1, hoveredItem, this], this);
          }
        } else if (hoveredItem) {
          callback(opts.onClick, [e$$1, hoveredItem, this], this);
        }
      }
    }]);
    return Legend;
  }(Element);
  function calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight) {
    var itemWidth = calculateItemWidth(legendItem, boxWidth, labelFont, ctx);
    var itemHeight = calculateItemHeight(_itemHeight, legendItem, labelFont.lineHeight);
    return {
      itemWidth: itemWidth,
      itemHeight: itemHeight
    };
  }
  function calculateItemWidth(legendItem, boxWidth, labelFont, ctx) {
    var legendItemText = legendItem.text;
    if (legendItemText && typeof legendItemText !== 'string') {
      legendItemText = legendItemText.reduce(function (a$$1, b$$1) {
        return a$$1.length > b$$1.length ? a$$1 : b$$1;
      });
    }
    return boxWidth + labelFont.size / 2 + ctx.measureText(legendItemText).width;
  }
  function calculateItemHeight(_itemHeight, legendItem, fontLineHeight) {
    var itemHeight = _itemHeight;
    if (typeof legendItem.text !== 'string') {
      itemHeight = calculateLegendItemHeight(legendItem, fontLineHeight);
    }
    return itemHeight;
  }
  function calculateLegendItemHeight(legendItem, fontLineHeight) {
    var labelHeight = legendItem.text ? legendItem.text.length + 0.5 : 0;
    return fontLineHeight * labelHeight;
  }
  function isListened(type, opts) {
    if ((type === 'mousemove' || type === 'mouseout') && (opts.onHover || opts.onLeave)) {
      return true;
    }
    if (opts.onClick && (type === 'click' || type === 'mouseup')) {
      return true;
    }
    return false;
  }
  var plugin_legend = {
    id: 'legend',
    _element: Legend,
    start: function start(chart, _args, options) {
      var legend = chart.legend = new Legend({
        ctx: chart.ctx,
        options: options,
        chart: chart
      });
      layouts.configure(chart, legend, options);
      layouts.addBox(chart, legend);
    },
    stop: function stop(chart) {
      layouts.removeBox(chart, chart.legend);
      delete chart.legend;
    },
    beforeUpdate: function beforeUpdate(chart, _args, options) {
      var legend = chart.legend;
      layouts.configure(chart, legend, options);
      legend.options = options;
    },
    afterUpdate: function afterUpdate(chart) {
      var legend = chart.legend;
      legend.buildLabels();
      legend.adjustHitBoxes();
    },
    afterEvent: function afterEvent(chart, args) {
      if (!args.replay) {
        chart.legend.handleEvent(args.event);
      }
    },
    defaults: {
      display: true,
      position: 'top',
      align: 'center',
      fullSize: true,
      reverse: false,
      weight: 1000,
      onClick: function onClick(e$$1, legendItem, legend) {
        var index = legendItem.datasetIndex;
        var ci = legend.chart;
        if (ci.isDatasetVisible(index)) {
          ci.hide(index);
          legendItem.hidden = true;
        } else {
          ci.show(index);
          legendItem.hidden = false;
        }
      },
      onHover: null,
      onLeave: null,
      labels: {
        color: function color$$1(ctx) {
          return ctx.chart.options.color;
        },
        boxWidth: 40,
        padding: 10,
        generateLabels: function generateLabels(chart) {
          var datasets = chart.data.datasets;
          var _chart$legend$options = chart.legend.options.labels,
            usePointStyle = _chart$legend$options.usePointStyle,
            pointStyle = _chart$legend$options.pointStyle,
            textAlign = _chart$legend$options.textAlign,
            color$$1 = _chart$legend$options.color,
            useBorderRadius = _chart$legend$options.useBorderRadius,
            borderRadius = _chart$legend$options.borderRadius;
          return chart._getSortedDatasetMetas().map(function (meta) {
            var style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
            var borderWidth = toPadding(style.borderWidth);
            return {
              text: datasets[meta.index].label,
              fillStyle: style.backgroundColor,
              fontColor: color$$1,
              hidden: !meta.visible,
              lineCap: style.borderCapStyle,
              lineDash: style.borderDash,
              lineDashOffset: style.borderDashOffset,
              lineJoin: style.borderJoinStyle,
              lineWidth: (borderWidth.width + borderWidth.height) / 4,
              strokeStyle: style.borderColor,
              pointStyle: pointStyle || style.pointStyle,
              rotation: style.rotation,
              textAlign: textAlign || style.textAlign,
              borderRadius: useBorderRadius && (borderRadius || style.borderRadius),
              datasetIndex: meta.index
            };
          }, this);
        }
      },
      title: {
        color: function color$$1(ctx) {
          return ctx.chart.options.color;
        },
        display: false,
        position: 'center',
        text: ''
      }
    },
    descriptors: {
      _scriptable: function _scriptable(name) {
        return !name.startsWith('on');
      },
      labels: {
        _scriptable: function _scriptable(name) {
          return !['generateLabels', 'filter', 'sort'].includes(name);
        }
      }
    }
  };
  var Title = /*#__PURE__*/function (_Element7) {
    babelHelpers.inherits(Title, _Element7);
    function Title(config) {
      var _this30;
      babelHelpers.classCallCheck(this, Title);
      _this30 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Title).call(this));
      _this30.chart = config.chart;
      _this30.options = config.options;
      _this30.ctx = config.ctx;
      _this30._padding = undefined;
      _this30.top = undefined;
      _this30.bottom = undefined;
      _this30.left = undefined;
      _this30.right = undefined;
      _this30.width = undefined;
      _this30.height = undefined;
      _this30.position = undefined;
      _this30.weight = undefined;
      _this30.fullSize = undefined;
      return _this30;
    }
    babelHelpers.createClass(Title, [{
      key: "update",
      value: function update(maxWidth, maxHeight) {
        var opts = this.options;
        this.left = 0;
        this.top = 0;
        if (!opts.display) {
          this.width = this.height = this.right = this.bottom = 0;
          return;
        }
        this.width = this.right = maxWidth;
        this.height = this.bottom = maxHeight;
        var lineCount = isArray(opts.text) ? opts.text.length : 1;
        this._padding = toPadding(opts.padding);
        var textSize = lineCount * toFont(opts.font).lineHeight + this._padding.height;
        if (this.isHorizontal()) {
          this.height = textSize;
        } else {
          this.width = textSize;
        }
      }
    }, {
      key: "isHorizontal",
      value: function isHorizontal() {
        var pos = this.options.position;
        return pos === 'top' || pos === 'bottom';
      }
    }, {
      key: "_drawArgs",
      value: function _drawArgs(offset) {
        var top = this.top,
          left = this.left,
          bottom = this.bottom,
          right = this.right,
          options = this.options;
        var align = options.align;
        var rotation = 0;
        var maxWidth, titleX, titleY;
        if (this.isHorizontal()) {
          titleX = _alignStartEnd(align, left, right);
          titleY = top + offset;
          maxWidth = right - left;
        } else {
          if (options.position === 'left') {
            titleX = left + offset;
            titleY = _alignStartEnd(align, bottom, top);
            rotation = PI * -0.5;
          } else {
            titleX = right - offset;
            titleY = _alignStartEnd(align, top, bottom);
            rotation = PI * 0.5;
          }
          maxWidth = bottom - top;
        }
        return {
          titleX: titleX,
          titleY: titleY,
          maxWidth: maxWidth,
          rotation: rotation
        };
      }
    }, {
      key: "draw",
      value: function draw() {
        var ctx = this.ctx;
        var opts = this.options;
        if (!opts.display) {
          return;
        }
        var fontOpts = toFont(opts.font);
        var lineHeight = fontOpts.lineHeight;
        var offset = lineHeight / 2 + this._padding.top;
        var _this$_drawArgs = this._drawArgs(offset),
          titleX = _this$_drawArgs.titleX,
          titleY = _this$_drawArgs.titleY,
          maxWidth = _this$_drawArgs.maxWidth,
          rotation = _this$_drawArgs.rotation;
        renderText(ctx, opts.text, 0, 0, fontOpts, {
          color: opts.color,
          maxWidth: maxWidth,
          rotation: rotation,
          textAlign: _toLeftRightCenter(opts.align),
          textBaseline: 'middle',
          translation: [titleX, titleY]
        });
      }
    }]);
    return Title;
  }(Element);
  function createTitle(chart, titleOpts) {
    var title = new Title({
      ctx: chart.ctx,
      options: titleOpts,
      chart: chart
    });
    layouts.configure(chart, title, titleOpts);
    layouts.addBox(chart, title);
    chart.titleBlock = title;
  }
  var plugin_title = {
    id: 'title',
    _element: Title,
    start: function start(chart, _args, options) {
      createTitle(chart, options);
    },
    stop: function stop(chart) {
      var titleBlock = chart.titleBlock;
      layouts.removeBox(chart, titleBlock);
      delete chart.titleBlock;
    },
    beforeUpdate: function beforeUpdate(chart, _args, options) {
      var title = chart.titleBlock;
      layouts.configure(chart, title, options);
      title.options = options;
    },
    defaults: {
      align: 'center',
      display: false,
      font: {
        weight: 'bold'
      },
      fullSize: true,
      padding: 10,
      position: 'top',
      text: '',
      weight: 2000
    },
    defaultRoutes: {
      color: 'color'
    },
    descriptors: {
      _scriptable: true,
      _indexable: false
    }
  };
  var map$2 = new WeakMap();
  var plugin_subtitle = {
    id: 'subtitle',
    start: function start(chart, _args, options) {
      var title = new Title({
        ctx: chart.ctx,
        options: options,
        chart: chart
      });
      layouts.configure(chart, title, options);
      layouts.addBox(chart, title);
      map$2.set(chart, title);
    },
    stop: function stop(chart) {
      layouts.removeBox(chart, map$2.get(chart));
      map$2["delete"](chart);
    },
    beforeUpdate: function beforeUpdate(chart, _args, options) {
      var title = map$2.get(chart);
      layouts.configure(chart, title, options);
      title.options = options;
    },
    defaults: {
      align: 'center',
      display: false,
      font: {
        weight: 'normal'
      },
      fullSize: true,
      padding: 0,
      position: 'top',
      text: '',
      weight: 1500
    },
    defaultRoutes: {
      color: 'color'
    },
    descriptors: {
      _scriptable: true,
      _indexable: false
    }
  };
  var positioners = {
    average: function average(items) {
      if (!items.length) {
        return false;
      }
      var i$$1, len;
      var x$$1 = 0;
      var y$$1 = 0;
      var count = 0;
      for (i$$1 = 0, len = items.length; i$$1 < len; ++i$$1) {
        var el = items[i$$1].element;
        if (el && el.hasValue()) {
          var pos = el.tooltipPosition();
          x$$1 += pos.x;
          y$$1 += pos.y;
          ++count;
        }
      }
      return {
        x: x$$1 / count,
        y: y$$1 / count
      };
    },
    nearest: function nearest(items, eventPosition) {
      if (!items.length) {
        return false;
      }
      var x$$1 = eventPosition.x;
      var y$$1 = eventPosition.y;
      var minDistance = Number.POSITIVE_INFINITY;
      var i$$1, len, nearestElement;
      for (i$$1 = 0, len = items.length; i$$1 < len; ++i$$1) {
        var el = items[i$$1].element;
        if (el && el.hasValue()) {
          var center = el.getCenterPoint();
          var d$$1 = distanceBetweenPoints(eventPosition, center);
          if (d$$1 < minDistance) {
            minDistance = d$$1;
            nearestElement = el;
          }
        }
      }
      if (nearestElement) {
        var tp = nearestElement.tooltipPosition();
        x$$1 = tp.x;
        y$$1 = tp.y;
      }
      return {
        x: x$$1,
        y: y$$1
      };
    }
  };
  function pushOrConcat(base, toPush) {
    if (toPush) {
      if (isArray(toPush)) {
        Array.prototype.push.apply(base, toPush);
      } else {
        base.push(toPush);
      }
    }
    return base;
  }
  function splitNewlines(str) {
    if ((typeof str === 'string' || str instanceof String) && str.indexOf('\n') > -1) {
      return str.split('\n');
    }
    return str;
  }
  function createTooltipItem(chart, item) {
    var element = item.element,
      datasetIndex = item.datasetIndex,
      index = item.index;
    var controller = chart.getDatasetMeta(datasetIndex).controller;
    var _controller$getLabelA = controller.getLabelAndValue(index),
      label = _controller$getLabelA.label,
      value = _controller$getLabelA.value;
    return {
      chart: chart,
      label: label,
      parsed: controller.getParsed(index),
      raw: chart.data.datasets[datasetIndex].data[index],
      formattedValue: value,
      dataset: controller.getDataset(),
      dataIndex: index,
      datasetIndex: datasetIndex,
      element: element
    };
  }
  function getTooltipSize(tooltip, options) {
    var ctx = tooltip.chart.ctx;
    var body = tooltip.body,
      footer = tooltip.footer,
      title = tooltip.title;
    var boxWidth = options.boxWidth,
      boxHeight = options.boxHeight;
    var bodyFont = toFont(options.bodyFont);
    var titleFont = toFont(options.titleFont);
    var footerFont = toFont(options.footerFont);
    var titleLineCount = title.length;
    var footerLineCount = footer.length;
    var bodyLineItemCount = body.length;
    var padding = toPadding(options.padding);
    var height = padding.height;
    var width = 0;
    var combinedBodyLength = body.reduce(function (count, bodyItem) {
      return count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length;
    }, 0);
    combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
    if (titleLineCount) {
      height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom;
    }
    if (combinedBodyLength) {
      var bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
      height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
    }
    if (footerLineCount) {
      height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing;
    }
    var widthPadding = 0;
    var maxLineWidth = function maxLineWidth(line) {
      width = Math.max(width, ctx.measureText(line).width + widthPadding);
    };
    ctx.save();
    ctx.font = titleFont.string;
    each(tooltip.title, maxLineWidth);
    ctx.font = bodyFont.string;
    each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
    widthPadding = options.displayColors ? boxWidth + 2 + options.boxPadding : 0;
    each(body, function (bodyItem) {
      each(bodyItem.before, maxLineWidth);
      each(bodyItem.lines, maxLineWidth);
      each(bodyItem.after, maxLineWidth);
    });
    widthPadding = 0;
    ctx.font = footerFont.string;
    each(tooltip.footer, maxLineWidth);
    ctx.restore();
    width += padding.width;
    return {
      width: width,
      height: height
    };
  }
  function determineYAlign(chart, size) {
    var y$$1 = size.y,
      height = size.height;
    if (y$$1 < height / 2) {
      return 'top';
    } else if (y$$1 > chart.height - height / 2) {
      return 'bottom';
    }
    return 'center';
  }
  function doesNotFitWithAlign(xAlign, chart, options, size) {
    var x$$1 = size.x,
      width = size.width;
    var caret = options.caretSize + options.caretPadding;
    if (xAlign === 'left' && x$$1 + width + caret > chart.width) {
      return true;
    }
    if (xAlign === 'right' && x$$1 - width - caret < 0) {
      return true;
    }
  }
  function determineXAlign(chart, options, size, yAlign) {
    var x$$1 = size.x,
      width = size.width;
    var chartWidth = chart.width,
      _chart$chartArea = chart.chartArea,
      left = _chart$chartArea.left,
      right = _chart$chartArea.right;
    var xAlign = 'center';
    if (yAlign === 'center') {
      xAlign = x$$1 <= (left + right) / 2 ? 'left' : 'right';
    } else if (x$$1 <= width / 2) {
      xAlign = 'left';
    } else if (x$$1 >= chartWidth - width / 2) {
      xAlign = 'right';
    }
    if (doesNotFitWithAlign(xAlign, chart, options, size)) {
      xAlign = 'center';
    }
    return xAlign;
  }
  function determineAlignment(chart, options, size) {
    var yAlign = size.yAlign || options.yAlign || determineYAlign(chart, size);
    return {
      xAlign: size.xAlign || options.xAlign || determineXAlign(chart, options, size, yAlign),
      yAlign: yAlign
    };
  }
  function alignX(size, xAlign) {
    var x$$1 = size.x,
      width = size.width;
    if (xAlign === 'right') {
      x$$1 -= width;
    } else if (xAlign === 'center') {
      x$$1 -= width / 2;
    }
    return x$$1;
  }
  function alignY(size, yAlign, paddingAndSize) {
    var y$$1 = size.y,
      height = size.height;
    if (yAlign === 'top') {
      y$$1 += paddingAndSize;
    } else if (yAlign === 'bottom') {
      y$$1 -= height + paddingAndSize;
    } else {
      y$$1 -= height / 2;
    }
    return y$$1;
  }
  function getBackgroundPoint(options, size, alignment, chart) {
    var caretSize = options.caretSize,
      caretPadding = options.caretPadding,
      cornerRadius = options.cornerRadius;
    var xAlign = alignment.xAlign,
      yAlign = alignment.yAlign;
    var paddingAndSize = caretSize + caretPadding;
    var _toTRBLCorners = toTRBLCorners(cornerRadius),
      topLeft = _toTRBLCorners.topLeft,
      topRight = _toTRBLCorners.topRight,
      bottomLeft = _toTRBLCorners.bottomLeft,
      bottomRight = _toTRBLCorners.bottomRight;
    var x$$1 = alignX(size, xAlign);
    var y$$1 = alignY(size, yAlign, paddingAndSize);
    if (yAlign === 'center') {
      if (xAlign === 'left') {
        x$$1 += paddingAndSize;
      } else if (xAlign === 'right') {
        x$$1 -= paddingAndSize;
      }
    } else if (xAlign === 'left') {
      x$$1 -= Math.max(topLeft, bottomLeft) + caretSize;
    } else if (xAlign === 'right') {
      x$$1 += Math.max(topRight, bottomRight) + caretSize;
    }
    return {
      x: _limitValue(x$$1, 0, chart.width - size.width),
      y: _limitValue(y$$1, 0, chart.height - size.height)
    };
  }
  function getAlignedX(tooltip, align, options) {
    var padding = toPadding(options.padding);
    return align === 'center' ? tooltip.x + tooltip.width / 2 : align === 'right' ? tooltip.x + tooltip.width - padding.right : tooltip.x + padding.left;
  }
  function getBeforeAfterBodyLines(callback$$1) {
    return pushOrConcat([], splitNewlines(callback$$1));
  }
  function createTooltipContext(parent, tooltip, tooltipItems) {
    return createContext(parent, {
      tooltip: tooltip,
      tooltipItems: tooltipItems,
      type: 'tooltip'
    });
  }
  function overrideCallbacks(callbacks, context) {
    var override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
    return override ? callbacks.override(override) : callbacks;
  }
  var defaultCallbacks = {
    beforeTitle: noop,
    title: function title(tooltipItems) {
      if (tooltipItems.length > 0) {
        var item = tooltipItems[0];
        var labels = item.chart.data.labels;
        var labelCount = labels ? labels.length : 0;
        if (this && this.options && this.options.mode === 'dataset') {
          return item.dataset.label || '';
        } else if (item.label) {
          return item.label;
        } else if (labelCount > 0 && item.dataIndex < labelCount) {
          return labels[item.dataIndex];
        }
      }
      return '';
    },
    afterTitle: noop,
    beforeBody: noop,
    beforeLabel: noop,
    label: function label(tooltipItem) {
      if (this && this.options && this.options.mode === 'dataset') {
        return tooltipItem.label + ': ' + tooltipItem.formattedValue || tooltipItem.formattedValue;
      }
      var label = tooltipItem.dataset.label || '';
      if (label) {
        label += ': ';
      }
      var value = tooltipItem.formattedValue;
      if (!isNullOrUndef(value)) {
        label += value;
      }
      return label;
    },
    labelColor: function labelColor(tooltipItem) {
      var meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
      var options = meta.controller.getStyle(tooltipItem.dataIndex);
      return {
        borderColor: options.borderColor,
        backgroundColor: options.backgroundColor,
        borderWidth: options.borderWidth,
        borderDash: options.borderDash,
        borderDashOffset: options.borderDashOffset,
        borderRadius: 0
      };
    },
    labelTextColor: function labelTextColor() {
      return this.options.bodyColor;
    },
    labelPointStyle: function labelPointStyle(tooltipItem) {
      var meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
      var options = meta.controller.getStyle(tooltipItem.dataIndex);
      return {
        pointStyle: options.pointStyle,
        rotation: options.rotation
      };
    },
    afterLabel: noop,
    afterBody: noop,
    beforeFooter: noop,
    footer: noop,
    afterFooter: noop
  };
  function invokeCallbackWithFallback(callbacks, name, ctx, arg) {
    var result = callbacks[name].call(ctx, arg);
    if (typeof result === 'undefined') {
      return defaultCallbacks[name].call(ctx, arg);
    }
    return result;
  }
  var Tooltip = /*#__PURE__*/function (_Element8) {
    babelHelpers.inherits(Tooltip, _Element8);
    function Tooltip(config) {
      var _this31;
      babelHelpers.classCallCheck(this, Tooltip);
      _this31 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Tooltip).call(this));
      _this31.opacity = 0;
      _this31._active = [];
      _this31._eventPosition = undefined;
      _this31._size = undefined;
      _this31._cachedAnimations = undefined;
      _this31._tooltipItems = [];
      _this31.$animations = undefined;
      _this31.$context = undefined;
      _this31.chart = config.chart;
      _this31.options = config.options;
      _this31.dataPoints = undefined;
      _this31.title = undefined;
      _this31.beforeBody = undefined;
      _this31.body = undefined;
      _this31.afterBody = undefined;
      _this31.footer = undefined;
      _this31.xAlign = undefined;
      _this31.yAlign = undefined;
      _this31.x = undefined;
      _this31.y = undefined;
      _this31.height = undefined;
      _this31.width = undefined;
      _this31.caretX = undefined;
      _this31.caretY = undefined;
      _this31.labelColors = undefined;
      _this31.labelPointStyles = undefined;
      _this31.labelTextColors = undefined;
      return _this31;
    }
    babelHelpers.createClass(Tooltip, [{
      key: "initialize",
      value: function initialize(options) {
        this.options = options;
        this._cachedAnimations = undefined;
        this.$context = undefined;
      }
    }, {
      key: "_resolveAnimations",
      value: function _resolveAnimations() {
        var cached = this._cachedAnimations;
        if (cached) {
          return cached;
        }
        var chart = this.chart;
        var options = this.options.setContext(this.getContext());
        var opts = options.enabled && chart.options.animation && options.animations;
        var animations = new Animations(this.chart, opts);
        if (opts._cacheable) {
          this._cachedAnimations = Object.freeze(animations);
        }
        return animations;
      }
    }, {
      key: "getContext",
      value: function getContext() {
        return this.$context || (this.$context = createTooltipContext(this.chart.getContext(), this, this._tooltipItems));
      }
    }, {
      key: "getTitle",
      value: function getTitle(context, options) {
        var callbacks = options.callbacks;
        var beforeTitle = invokeCallbackWithFallback(callbacks, 'beforeTitle', this, context);
        var title = invokeCallbackWithFallback(callbacks, 'title', this, context);
        var afterTitle = invokeCallbackWithFallback(callbacks, 'afterTitle', this, context);
        var lines = [];
        lines = pushOrConcat(lines, splitNewlines(beforeTitle));
        lines = pushOrConcat(lines, splitNewlines(title));
        lines = pushOrConcat(lines, splitNewlines(afterTitle));
        return lines;
      }
    }, {
      key: "getBeforeBody",
      value: function getBeforeBody(tooltipItems, options) {
        return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, 'beforeBody', this, tooltipItems));
      }
    }, {
      key: "getBody",
      value: function getBody(tooltipItems, options) {
        var _this32 = this;
        var callbacks = options.callbacks;
        var bodyItems = [];
        each(tooltipItems, function (context) {
          var bodyItem = {
            before: [],
            lines: [],
            after: []
          };
          var scoped = overrideCallbacks(callbacks, context);
          pushOrConcat(bodyItem.before, splitNewlines(invokeCallbackWithFallback(scoped, 'beforeLabel', _this32, context)));
          pushOrConcat(bodyItem.lines, invokeCallbackWithFallback(scoped, 'label', _this32, context));
          pushOrConcat(bodyItem.after, splitNewlines(invokeCallbackWithFallback(scoped, 'afterLabel', _this32, context)));
          bodyItems.push(bodyItem);
        });
        return bodyItems;
      }
    }, {
      key: "getAfterBody",
      value: function getAfterBody(tooltipItems, options) {
        return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, 'afterBody', this, tooltipItems));
      }
    }, {
      key: "getFooter",
      value: function getFooter(tooltipItems, options) {
        var callbacks = options.callbacks;
        var beforeFooter = invokeCallbackWithFallback(callbacks, 'beforeFooter', this, tooltipItems);
        var footer = invokeCallbackWithFallback(callbacks, 'footer', this, tooltipItems);
        var afterFooter = invokeCallbackWithFallback(callbacks, 'afterFooter', this, tooltipItems);
        var lines = [];
        lines = pushOrConcat(lines, splitNewlines(beforeFooter));
        lines = pushOrConcat(lines, splitNewlines(footer));
        lines = pushOrConcat(lines, splitNewlines(afterFooter));
        return lines;
      }
    }, {
      key: "_createItems",
      value: function _createItems(options) {
        var _this33 = this;
        var active = this._active;
        var data = this.chart.data;
        var labelColors = [];
        var labelPointStyles = [];
        var labelTextColors = [];
        var tooltipItems = [];
        var i$$1, len;
        for (i$$1 = 0, len = active.length; i$$1 < len; ++i$$1) {
          tooltipItems.push(createTooltipItem(this.chart, active[i$$1]));
        }
        if (options.filter) {
          tooltipItems = tooltipItems.filter(function (element, index, array) {
            return options.filter(element, index, array, data);
          });
        }
        if (options.itemSort) {
          tooltipItems = tooltipItems.sort(function (a$$1, b$$1) {
            return options.itemSort(a$$1, b$$1, data);
          });
        }
        each(tooltipItems, function (context) {
          var scoped = overrideCallbacks(options.callbacks, context);
          labelColors.push(invokeCallbackWithFallback(scoped, 'labelColor', _this33, context));
          labelPointStyles.push(invokeCallbackWithFallback(scoped, 'labelPointStyle', _this33, context));
          labelTextColors.push(invokeCallbackWithFallback(scoped, 'labelTextColor', _this33, context));
        });
        this.labelColors = labelColors;
        this.labelPointStyles = labelPointStyles;
        this.labelTextColors = labelTextColors;
        this.dataPoints = tooltipItems;
        return tooltipItems;
      }
    }, {
      key: "update",
      value: function update(changed, replay) {
        var options = this.options.setContext(this.getContext());
        var active = this._active;
        var properties;
        var tooltipItems = [];
        if (!active.length) {
          if (this.opacity !== 0) {
            properties = {
              opacity: 0
            };
          }
        } else {
          var position = positioners[options.position].call(this, active, this._eventPosition);
          tooltipItems = this._createItems(options);
          this.title = this.getTitle(tooltipItems, options);
          this.beforeBody = this.getBeforeBody(tooltipItems, options);
          this.body = this.getBody(tooltipItems, options);
          this.afterBody = this.getAfterBody(tooltipItems, options);
          this.footer = this.getFooter(tooltipItems, options);
          var size = this._size = getTooltipSize(this, options);
          var positionAndSize = Object.assign({}, position, size);
          var alignment = determineAlignment(this.chart, options, positionAndSize);
          var backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
          this.xAlign = alignment.xAlign;
          this.yAlign = alignment.yAlign;
          properties = {
            opacity: 1,
            x: backgroundPoint.x,
            y: backgroundPoint.y,
            width: size.width,
            height: size.height,
            caretX: position.x,
            caretY: position.y
          };
        }
        this._tooltipItems = tooltipItems;
        this.$context = undefined;
        if (properties) {
          this._resolveAnimations().update(this, properties);
        }
        if (changed && options.external) {
          options.external.call(this, {
            chart: this.chart,
            tooltip: this,
            replay: replay
          });
        }
      }
    }, {
      key: "drawCaret",
      value: function drawCaret(tooltipPoint, ctx, size, options) {
        var caretPosition = this.getCaretPosition(tooltipPoint, size, options);
        ctx.lineTo(caretPosition.x1, caretPosition.y1);
        ctx.lineTo(caretPosition.x2, caretPosition.y2);
        ctx.lineTo(caretPosition.x3, caretPosition.y3);
      }
    }, {
      key: "getCaretPosition",
      value: function getCaretPosition(tooltipPoint, size, options) {
        var xAlign = this.xAlign,
          yAlign = this.yAlign;
        var caretSize = options.caretSize,
          cornerRadius = options.cornerRadius;
        var _toTRBLCorners2 = toTRBLCorners(cornerRadius),
          topLeft = _toTRBLCorners2.topLeft,
          topRight = _toTRBLCorners2.topRight,
          bottomLeft = _toTRBLCorners2.bottomLeft,
          bottomRight = _toTRBLCorners2.bottomRight;
        var ptX = tooltipPoint.x,
          ptY = tooltipPoint.y;
        var width = size.width,
          height = size.height;
        var x1, x2, x3, y1, y2, y3;
        if (yAlign === 'center') {
          y2 = ptY + height / 2;
          if (xAlign === 'left') {
            x1 = ptX;
            x2 = x1 - caretSize;
            y1 = y2 + caretSize;
            y3 = y2 - caretSize;
          } else {
            x1 = ptX + width;
            x2 = x1 + caretSize;
            y1 = y2 - caretSize;
            y3 = y2 + caretSize;
          }
          x3 = x1;
        } else {
          if (xAlign === 'left') {
            x2 = ptX + Math.max(topLeft, bottomLeft) + caretSize;
          } else if (xAlign === 'right') {
            x2 = ptX + width - Math.max(topRight, bottomRight) - caretSize;
          } else {
            x2 = this.caretX;
          }
          if (yAlign === 'top') {
            y1 = ptY;
            y2 = y1 - caretSize;
            x1 = x2 - caretSize;
            x3 = x2 + caretSize;
          } else {
            y1 = ptY + height;
            y2 = y1 + caretSize;
            x1 = x2 + caretSize;
            x3 = x2 - caretSize;
          }
          y3 = y1;
        }
        return {
          x1: x1,
          x2: x2,
          x3: x3,
          y1: y1,
          y2: y2,
          y3: y3
        };
      }
    }, {
      key: "drawTitle",
      value: function drawTitle(pt, ctx, options) {
        var title = this.title;
        var length = title.length;
        var titleFont, titleSpacing, i$$1;
        if (length) {
          var rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
          pt.x = getAlignedX(this, options.titleAlign, options);
          ctx.textAlign = rtlHelper.textAlign(options.titleAlign);
          ctx.textBaseline = 'middle';
          titleFont = toFont(options.titleFont);
          titleSpacing = options.titleSpacing;
          ctx.fillStyle = options.titleColor;
          ctx.font = titleFont.string;
          for (i$$1 = 0; i$$1 < length; ++i$$1) {
            ctx.fillText(title[i$$1], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2);
            pt.y += titleFont.lineHeight + titleSpacing;
            if (i$$1 + 1 === length) {
              pt.y += options.titleMarginBottom - titleSpacing;
            }
          }
        }
      }
    }, {
      key: "_drawColorBox",
      value: function _drawColorBox(ctx, pt, i$$1, rtlHelper, options) {
        var labelColors = this.labelColors[i$$1];
        var labelPointStyle = this.labelPointStyles[i$$1];
        var boxHeight = options.boxHeight,
          boxWidth = options.boxWidth,
          boxPadding = options.boxPadding;
        var bodyFont = toFont(options.bodyFont);
        var colorX = getAlignedX(this, 'left', options);
        var rtlColorX = rtlHelper.x(colorX);
        var yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
        var colorY = pt.y + yOffSet;
        if (options.usePointStyle) {
          var drawOptions = {
            radius: Math.min(boxWidth, boxHeight) / 2,
            pointStyle: labelPointStyle.pointStyle,
            rotation: labelPointStyle.rotation,
            borderWidth: 1
          };
          var centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
          var centerY = colorY + boxHeight / 2;
          ctx.strokeStyle = options.multiKeyBackground;
          ctx.fillStyle = options.multiKeyBackground;
          drawPoint(ctx, drawOptions, centerX, centerY);
          ctx.strokeStyle = labelColors.borderColor;
          ctx.fillStyle = labelColors.backgroundColor;
          drawPoint(ctx, drawOptions, centerX, centerY);
        } else {
          ctx.lineWidth = isObject(labelColors.borderWidth) ? Math.max.apply(Math, babelHelpers.toConsumableArray(Object.values(labelColors.borderWidth))) : labelColors.borderWidth || 1;
          ctx.strokeStyle = labelColors.borderColor;
          ctx.setLineDash(labelColors.borderDash || []);
          ctx.lineDashOffset = labelColors.borderDashOffset || 0;
          var outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth - boxPadding);
          var innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - boxPadding - 2);
          var borderRadius = toTRBLCorners(labelColors.borderRadius);
          if (Object.values(borderRadius).some(function (v$$1) {
            return v$$1 !== 0;
          })) {
            ctx.beginPath();
            ctx.fillStyle = options.multiKeyBackground;
            addRoundedRectPath(ctx, {
              x: outerX,
              y: colorY,
              w: boxWidth,
              h: boxHeight,
              radius: borderRadius
            });
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = labelColors.backgroundColor;
            ctx.beginPath();
            addRoundedRectPath(ctx, {
              x: innerX,
              y: colorY + 1,
              w: boxWidth - 2,
              h: boxHeight - 2,
              radius: borderRadius
            });
            ctx.fill();
          } else {
            ctx.fillStyle = options.multiKeyBackground;
            ctx.fillRect(outerX, colorY, boxWidth, boxHeight);
            ctx.strokeRect(outerX, colorY, boxWidth, boxHeight);
            ctx.fillStyle = labelColors.backgroundColor;
            ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
          }
        }
        ctx.fillStyle = this.labelTextColors[i$$1];
      }
    }, {
      key: "drawBody",
      value: function drawBody(pt, ctx, options) {
        var body = this.body;
        var bodySpacing = options.bodySpacing,
          bodyAlign = options.bodyAlign,
          displayColors = options.displayColors,
          boxHeight = options.boxHeight,
          boxWidth = options.boxWidth,
          boxPadding = options.boxPadding;
        var bodyFont = toFont(options.bodyFont);
        var bodyLineHeight = bodyFont.lineHeight;
        var xLinePadding = 0;
        var rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
        var fillLineOfText = function fillLineOfText(line) {
          ctx.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2);
          pt.y += bodyLineHeight + bodySpacing;
        };
        var bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
        var bodyItem, textColor, lines, i$$1, j$$1, ilen, jlen;
        ctx.textAlign = bodyAlign;
        ctx.textBaseline = 'middle';
        ctx.font = bodyFont.string;
        pt.x = getAlignedX(this, bodyAlignForCalculation, options);
        ctx.fillStyle = options.bodyColor;
        each(this.beforeBody, fillLineOfText);
        xLinePadding = displayColors && bodyAlignForCalculation !== 'right' ? bodyAlign === 'center' ? boxWidth / 2 + boxPadding : boxWidth + 2 + boxPadding : 0;
        for (i$$1 = 0, ilen = body.length; i$$1 < ilen; ++i$$1) {
          bodyItem = body[i$$1];
          textColor = this.labelTextColors[i$$1];
          ctx.fillStyle = textColor;
          each(bodyItem.before, fillLineOfText);
          lines = bodyItem.lines;
          if (displayColors && lines.length) {
            this._drawColorBox(ctx, pt, i$$1, rtlHelper, options);
            bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
          }
          for (j$$1 = 0, jlen = lines.length; j$$1 < jlen; ++j$$1) {
            fillLineOfText(lines[j$$1]);
            bodyLineHeight = bodyFont.lineHeight;
          }
          each(bodyItem.after, fillLineOfText);
        }
        xLinePadding = 0;
        bodyLineHeight = bodyFont.lineHeight;
        each(this.afterBody, fillLineOfText);
        pt.y -= bodySpacing;
      }
    }, {
      key: "drawFooter",
      value: function drawFooter(pt, ctx, options) {
        var footer = this.footer;
        var length = footer.length;
        var footerFont, i$$1;
        if (length) {
          var rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
          pt.x = getAlignedX(this, options.footerAlign, options);
          pt.y += options.footerMarginTop;
          ctx.textAlign = rtlHelper.textAlign(options.footerAlign);
          ctx.textBaseline = 'middle';
          footerFont = toFont(options.footerFont);
          ctx.fillStyle = options.footerColor;
          ctx.font = footerFont.string;
          for (i$$1 = 0; i$$1 < length; ++i$$1) {
            ctx.fillText(footer[i$$1], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2);
            pt.y += footerFont.lineHeight + options.footerSpacing;
          }
        }
      }
    }, {
      key: "drawBackground",
      value: function drawBackground(pt, ctx, tooltipSize, options) {
        var xAlign = this.xAlign,
          yAlign = this.yAlign;
        var x$$1 = pt.x,
          y$$1 = pt.y;
        var width = tooltipSize.width,
          height = tooltipSize.height;
        var _toTRBLCorners3 = toTRBLCorners(options.cornerRadius),
          topLeft = _toTRBLCorners3.topLeft,
          topRight = _toTRBLCorners3.topRight,
          bottomLeft = _toTRBLCorners3.bottomLeft,
          bottomRight = _toTRBLCorners3.bottomRight;
        ctx.fillStyle = options.backgroundColor;
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.beginPath();
        ctx.moveTo(x$$1 + topLeft, y$$1);
        if (yAlign === 'top') {
          this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x$$1 + width - topRight, y$$1);
        ctx.quadraticCurveTo(x$$1 + width, y$$1, x$$1 + width, y$$1 + topRight);
        if (yAlign === 'center' && xAlign === 'right') {
          this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x$$1 + width, y$$1 + height - bottomRight);
        ctx.quadraticCurveTo(x$$1 + width, y$$1 + height, x$$1 + width - bottomRight, y$$1 + height);
        if (yAlign === 'bottom') {
          this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x$$1 + bottomLeft, y$$1 + height);
        ctx.quadraticCurveTo(x$$1, y$$1 + height, x$$1, y$$1 + height - bottomLeft);
        if (yAlign === 'center' && xAlign === 'left') {
          this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x$$1, y$$1 + topLeft);
        ctx.quadraticCurveTo(x$$1, y$$1, x$$1 + topLeft, y$$1);
        ctx.closePath();
        ctx.fill();
        if (options.borderWidth > 0) {
          ctx.stroke();
        }
      }
    }, {
      key: "_updateAnimationTarget",
      value: function _updateAnimationTarget(options) {
        var chart = this.chart;
        var anims = this.$animations;
        var animX = anims && anims.x;
        var animY = anims && anims.y;
        if (animX || animY) {
          var position = positioners[options.position].call(this, this._active, this._eventPosition);
          if (!position) {
            return;
          }
          var size = this._size = getTooltipSize(this, options);
          var positionAndSize = Object.assign({}, position, this._size);
          var alignment = determineAlignment(chart, options, positionAndSize);
          var point = getBackgroundPoint(options, positionAndSize, alignment, chart);
          if (animX._to !== point.x || animY._to !== point.y) {
            this.xAlign = alignment.xAlign;
            this.yAlign = alignment.yAlign;
            this.width = size.width;
            this.height = size.height;
            this.caretX = position.x;
            this.caretY = position.y;
            this._resolveAnimations().update(this, point);
          }
        }
      }
    }, {
      key: "_willRender",
      value: function _willRender() {
        return !!this.opacity;
      }
    }, {
      key: "draw",
      value: function draw(ctx) {
        var options = this.options.setContext(this.getContext());
        var opacity = this.opacity;
        if (!opacity) {
          return;
        }
        this._updateAnimationTarget(options);
        var tooltipSize = {
          width: this.width,
          height: this.height
        };
        var pt = {
          x: this.x,
          y: this.y
        };
        opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
        var padding = toPadding(options.padding);
        var hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
        if (options.enabled && hasTooltipContent) {
          ctx.save();
          ctx.globalAlpha = opacity;
          this.drawBackground(pt, ctx, tooltipSize, options);
          overrideTextDirection(ctx, options.textDirection);
          pt.y += padding.top;
          this.drawTitle(pt, ctx, options);
          this.drawBody(pt, ctx, options);
          this.drawFooter(pt, ctx, options);
          restoreTextDirection(ctx, options.textDirection);
          ctx.restore();
        }
      }
    }, {
      key: "getActiveElements",
      value: function getActiveElements() {
        return this._active || [];
      }
    }, {
      key: "setActiveElements",
      value: function setActiveElements(activeElements, eventPosition) {
        var _this34 = this;
        var lastActive = this._active;
        var active = activeElements.map(function (_ref11) {
          var datasetIndex = _ref11.datasetIndex,
            index = _ref11.index;
          var meta = _this34.chart.getDatasetMeta(datasetIndex);
          if (!meta) {
            throw new Error('Cannot find a dataset at index ' + datasetIndex);
          }
          return {
            datasetIndex: datasetIndex,
            element: meta.data[index],
            index: index
          };
        });
        var changed = !_elementsEqual(lastActive, active);
        var positionChanged = this._positionChanged(active, eventPosition);
        if (changed || positionChanged) {
          this._active = active;
          this._eventPosition = eventPosition;
          this._ignoreReplayEvents = true;
          this.update(true);
        }
      }
    }, {
      key: "handleEvent",
      value: function handleEvent(e$$1, replay) {
        var inChartArea = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        if (replay && this._ignoreReplayEvents) {
          return false;
        }
        this._ignoreReplayEvents = false;
        var options = this.options;
        var lastActive = this._active || [];
        var active = this._getActiveElements(e$$1, lastActive, replay, inChartArea);
        var positionChanged = this._positionChanged(active, e$$1);
        var changed = replay || !_elementsEqual(active, lastActive) || positionChanged;
        if (changed) {
          this._active = active;
          if (options.enabled || options.external) {
            this._eventPosition = {
              x: e$$1.x,
              y: e$$1.y
            };
            this.update(true, replay);
          }
        }
        return changed;
      }
    }, {
      key: "_getActiveElements",
      value: function _getActiveElements(e$$1, lastActive, replay, inChartArea) {
        var options = this.options;
        if (e$$1.type === 'mouseout') {
          return [];
        }
        if (!inChartArea) {
          return lastActive;
        }
        var active = this.chart.getElementsAtEventForMode(e$$1, options.mode, options, replay);
        if (options.reverse) {
          active.reverse();
        }
        return active;
      }
    }, {
      key: "_positionChanged",
      value: function _positionChanged(active, e$$1) {
        var caretX = this.caretX,
          caretY = this.caretY,
          options = this.options;
        var position = positioners[options.position].call(this, active, e$$1);
        return position !== false && (caretX !== position.x || caretY !== position.y);
      }
    }]);
    return Tooltip;
  }(Element);
  babelHelpers.defineProperty(Tooltip, "positioners", positioners);
  var plugin_tooltip = {
    id: 'tooltip',
    _element: Tooltip,
    positioners: positioners,
    afterInit: function afterInit(chart, _args, options) {
      if (options) {
        chart.tooltip = new Tooltip({
          chart: chart,
          options: options
        });
      }
    },
    beforeUpdate: function beforeUpdate(chart, _args, options) {
      if (chart.tooltip) {
        chart.tooltip.initialize(options);
      }
    },
    reset: function reset(chart, _args, options) {
      if (chart.tooltip) {
        chart.tooltip.initialize(options);
      }
    },
    afterDraw: function afterDraw(chart) {
      var tooltip = chart.tooltip;
      if (tooltip && tooltip._willRender()) {
        var args = {
          tooltip: tooltip
        };
        if (chart.notifyPlugins('beforeTooltipDraw', _objectSpread(_objectSpread({}, args), {}, {
          cancelable: true
        })) === false) {
          return;
        }
        tooltip.draw(chart.ctx);
        chart.notifyPlugins('afterTooltipDraw', args);
      }
    },
    afterEvent: function afterEvent(chart, args) {
      if (chart.tooltip) {
        var useFinalPosition = args.replay;
        if (chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea)) {
          args.changed = true;
        }
      }
    },
    defaults: {
      enabled: true,
      external: null,
      position: 'average',
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleColor: '#fff',
      titleFont: {
        weight: 'bold'
      },
      titleSpacing: 2,
      titleMarginBottom: 6,
      titleAlign: 'left',
      bodyColor: '#fff',
      bodySpacing: 2,
      bodyFont: {},
      bodyAlign: 'left',
      footerColor: '#fff',
      footerSpacing: 2,
      footerMarginTop: 6,
      footerFont: {
        weight: 'bold'
      },
      footerAlign: 'left',
      padding: 6,
      caretPadding: 2,
      caretSize: 5,
      cornerRadius: 6,
      boxHeight: function boxHeight(ctx, opts) {
        return opts.bodyFont.size;
      },
      boxWidth: function boxWidth(ctx, opts) {
        return opts.bodyFont.size;
      },
      multiKeyBackground: '#fff',
      displayColors: true,
      boxPadding: 0,
      borderColor: 'rgba(0,0,0,0)',
      borderWidth: 0,
      animation: {
        duration: 400,
        easing: 'easeOutQuart'
      },
      animations: {
        numbers: {
          type: 'number',
          properties: ['x', 'y', 'width', 'height', 'caretX', 'caretY']
        },
        opacity: {
          easing: 'linear',
          duration: 200
        }
      },
      callbacks: defaultCallbacks
    },
    defaultRoutes: {
      bodyFont: 'font',
      footerFont: 'font',
      titleFont: 'font'
    },
    descriptors: {
      _scriptable: function _scriptable(name) {
        return name !== 'filter' && name !== 'itemSort' && name !== 'external';
      },
      _indexable: false,
      callbacks: {
        _scriptable: false,
        _indexable: false
      },
      animation: {
        _fallback: false
      },
      animations: {
        _fallback: 'animation'
      }
    },
    additionalOptionScopes: ['interaction']
  };
  var plugins = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Colors: plugin_colors,
    Decimation: plugin_decimation,
    Filler: index,
    Legend: plugin_legend,
    SubTitle: plugin_subtitle,
    Title: plugin_title,
    Tooltip: plugin_tooltip
  });
  var addIfString = function addIfString(labels, raw, index, addedLabels) {
    if (typeof raw === 'string') {
      index = labels.push(raw) - 1;
      addedLabels.unshift({
        index: index,
        label: raw
      });
    } else if (isNaN(raw)) {
      index = null;
    }
    return index;
  };
  function findOrAddLabel(labels, raw, index, addedLabels) {
    var first = labels.indexOf(raw);
    if (first === -1) {
      return addIfString(labels, raw, index, addedLabels);
    }
    var last = labels.lastIndexOf(raw);
    return first !== last ? index : first;
  }
  var validIndex = function validIndex(index, max) {
    return index === null ? null : _limitValue(Math.round(index), 0, max);
  };
  function _getLabelForValue(value) {
    var labels = this.getLabels();
    if (value >= 0 && value < labels.length) {
      return labels[value];
    }
    return value;
  }
  var CategoryScale = /*#__PURE__*/function (_Scale) {
    babelHelpers.inherits(CategoryScale, _Scale);
    function CategoryScale(cfg) {
      var _this35;
      babelHelpers.classCallCheck(this, CategoryScale);
      _this35 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(CategoryScale).call(this, cfg));
      _this35._startValue = undefined;
      _this35._valueRange = 0;
      _this35._addedLabels = [];
      return _this35;
    }
    babelHelpers.createClass(CategoryScale, [{
      key: "init",
      value: function init(scaleOptions) {
        var added = this._addedLabels;
        if (added.length) {
          var labels = this.getLabels();
          var _iterator25 = _createForOfIteratorHelper$1(added),
            _step25;
          try {
            for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
              var _step25$value = _step25.value,
                _index3 = _step25$value.index,
                label = _step25$value.label;
              if (labels[_index3] === label) {
                labels.splice(_index3, 1);
              }
            }
          } catch (err) {
            _iterator25.e(err);
          } finally {
            _iterator25.f();
          }
          this._addedLabels = [];
        }
        babelHelpers.get(babelHelpers.getPrototypeOf(CategoryScale.prototype), "init", this).call(this, scaleOptions);
      }
    }, {
      key: "parse",
      value: function parse(raw, index) {
        if (isNullOrUndef(raw)) {
          return null;
        }
        var labels = this.getLabels();
        index = isFinite(index) && labels[index] === raw ? index : findOrAddLabel(labels, raw, valueOrDefault(index, raw), this._addedLabels);
        return validIndex(index, labels.length - 1);
      }
    }, {
      key: "determineDataLimits",
      value: function determineDataLimits() {
        var _this$getUserBounds2 = this.getUserBounds(),
          minDefined = _this$getUserBounds2.minDefined,
          maxDefined = _this$getUserBounds2.maxDefined;
        var _this$getMinMax = this.getMinMax(true),
          min = _this$getMinMax.min,
          max = _this$getMinMax.max;
        if (this.options.bounds === 'ticks') {
          if (!minDefined) {
            min = 0;
          }
          if (!maxDefined) {
            max = this.getLabels().length - 1;
          }
        }
        this.min = min;
        this.max = max;
      }
    }, {
      key: "buildTicks",
      value: function buildTicks() {
        var min = this.min;
        var max = this.max;
        var offset = this.options.offset;
        var ticks = [];
        var labels = this.getLabels();
        labels = min === 0 && max === labels.length - 1 ? labels : labels.slice(min, max + 1);
        this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
        this._startValue = this.min - (offset ? 0.5 : 0);
        for (var value = min; value <= max; value++) {
          ticks.push({
            value: value
          });
        }
        return ticks;
      }
    }, {
      key: "getLabelForValue",
      value: function getLabelForValue(value) {
        return _getLabelForValue.call(this, value);
      }
    }, {
      key: "configure",
      value: function configure() {
        babelHelpers.get(babelHelpers.getPrototypeOf(CategoryScale.prototype), "configure", this).call(this);
        if (!this.isHorizontal()) {
          this._reversePixels = !this._reversePixels;
        }
      }
    }, {
      key: "getPixelForValue",
      value: function getPixelForValue(value) {
        if (typeof value !== 'number') {
          value = this.parse(value);
        }
        return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
      }
    }, {
      key: "getPixelForTick",
      value: function getPixelForTick(index) {
        var ticks = this.ticks;
        if (index < 0 || index > ticks.length - 1) {
          return null;
        }
        return this.getPixelForValue(ticks[index].value);
      }
    }, {
      key: "getValueForPixel",
      value: function getValueForPixel(pixel) {
        return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
      }
    }, {
      key: "getBasePixel",
      value: function getBasePixel() {
        return this.bottom;
      }
    }]);
    return CategoryScale;
  }(Scale);
  babelHelpers.defineProperty(CategoryScale, "id", 'category');
  babelHelpers.defineProperty(CategoryScale, "defaults", {
    ticks: {
      callback: _getLabelForValue
    }
  });
  function generateTicks$1(generationOptions, dataRange) {
    var ticks = [];
    var MIN_SPACING = 1e-14;
    var bounds = generationOptions.bounds,
      step = generationOptions.step,
      min = generationOptions.min,
      max = generationOptions.max,
      precision = generationOptions.precision,
      count = generationOptions.count,
      maxTicks = generationOptions.maxTicks,
      maxDigits = generationOptions.maxDigits,
      includeBounds = generationOptions.includeBounds;
    var unit = step || 1;
    var maxSpaces = maxTicks - 1;
    var rmin = dataRange.min,
      rmax = dataRange.max;
    var minDefined = !isNullOrUndef(min);
    var maxDefined = !isNullOrUndef(max);
    var countDefined = !isNullOrUndef(count);
    var minSpacing = (rmax - rmin) / (maxDigits + 1);
    var spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit;
    var factor, niceMin, niceMax, numSpaces;
    if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
      return [{
        value: rmin
      }, {
        value: rmax
      }];
    }
    numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
    if (numSpaces > maxSpaces) {
      spacing = niceNum(numSpaces * spacing / maxSpaces / unit) * unit;
    }
    if (!isNullOrUndef(precision)) {
      factor = Math.pow(10, precision);
      spacing = Math.ceil(spacing * factor) / factor;
    }
    if (bounds === 'ticks') {
      niceMin = Math.floor(rmin / spacing) * spacing;
      niceMax = Math.ceil(rmax / spacing) * spacing;
    } else {
      niceMin = rmin;
      niceMax = rmax;
    }
    if (minDefined && maxDefined && step && almostWhole((max - min) / step, spacing / 1000)) {
      numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
      spacing = (max - min) / numSpaces;
      niceMin = min;
      niceMax = max;
    } else if (countDefined) {
      niceMin = minDefined ? min : niceMin;
      niceMax = maxDefined ? max : niceMax;
      numSpaces = count - 1;
      spacing = (niceMax - niceMin) / numSpaces;
    } else {
      numSpaces = (niceMax - niceMin) / spacing;
      if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
        numSpaces = Math.round(numSpaces);
      } else {
        numSpaces = Math.ceil(numSpaces);
      }
    }
    var decimalPlaces = Math.max(_decimalPlaces(spacing), _decimalPlaces(niceMin));
    factor = Math.pow(10, isNullOrUndef(precision) ? decimalPlaces : precision);
    niceMin = Math.round(niceMin * factor) / factor;
    niceMax = Math.round(niceMax * factor) / factor;
    var j$$1 = 0;
    if (minDefined) {
      if (includeBounds && niceMin !== min) {
        ticks.push({
          value: min
        });
        if (niceMin < min) {
          j$$1++;
        }
        if (almostEquals(Math.round((niceMin + j$$1 * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
          j$$1++;
        }
      } else if (niceMin < min) {
        j$$1++;
      }
    }
    for (; j$$1 < numSpaces; ++j$$1) {
      ticks.push({
        value: Math.round((niceMin + j$$1 * spacing) * factor) / factor
      });
    }
    if (maxDefined && includeBounds && niceMax !== max) {
      if (ticks.length && almostEquals(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) {
        ticks[ticks.length - 1].value = max;
      } else {
        ticks.push({
          value: max
        });
      }
    } else if (!maxDefined || niceMax === max) {
      ticks.push({
        value: niceMax
      });
    }
    return ticks;
  }
  function relativeLabelSize(value, minSpacing, _ref12) {
    var horizontal = _ref12.horizontal,
      minRotation = _ref12.minRotation;
    var rad = toRadians(minRotation);
    var ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 0.001;
    var length = 0.75 * minSpacing * ('' + value).length;
    return Math.min(minSpacing / ratio, length);
  }
  var LinearScaleBase = /*#__PURE__*/function (_Scale2) {
    babelHelpers.inherits(LinearScaleBase, _Scale2);
    function LinearScaleBase(cfg) {
      var _this36;
      babelHelpers.classCallCheck(this, LinearScaleBase);
      _this36 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(LinearScaleBase).call(this, cfg));
      _this36.start = undefined;
      _this36.end = undefined;
      _this36._startValue = undefined;
      _this36._endValue = undefined;
      _this36._valueRange = 0;
      return _this36;
    }
    babelHelpers.createClass(LinearScaleBase, [{
      key: "parse",
      value: function parse(raw, index) {
        if (isNullOrUndef(raw)) {
          return null;
        }
        if ((typeof raw === 'number' || raw instanceof Number) && !isFinite(+raw)) {
          return null;
        }
        return +raw;
      }
    }, {
      key: "handleTickRangeOptions",
      value: function handleTickRangeOptions() {
        var beginAtZero = this.options.beginAtZero;
        var _this$getUserBounds3 = this.getUserBounds(),
          minDefined = _this$getUserBounds3.minDefined,
          maxDefined = _this$getUserBounds3.maxDefined;
        var min = this.min,
          max = this.max;
        var setMin = function setMin(v$$1) {
          return min = minDefined ? min : v$$1;
        };
        var setMax = function setMax(v$$1) {
          return max = maxDefined ? max : v$$1;
        };
        if (beginAtZero) {
          var minSign = sign(min);
          var maxSign = sign(max);
          if (minSign < 0 && maxSign < 0) {
            setMax(0);
          } else if (minSign > 0 && maxSign > 0) {
            setMin(0);
          }
        }
        if (min === max) {
          var offset = max === 0 ? 1 : Math.abs(max * 0.05);
          setMax(max + offset);
          if (!beginAtZero) {
            setMin(min - offset);
          }
        }
        this.min = min;
        this.max = max;
      }
    }, {
      key: "getTickLimit",
      value: function getTickLimit() {
        var tickOpts = this.options.ticks;
        var maxTicksLimit = tickOpts.maxTicksLimit,
          stepSize = tickOpts.stepSize;
        var maxTicks;
        if (stepSize) {
          maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1;
          if (maxTicks > 1000) {
            console.warn("scales.".concat(this.id, ".ticks.stepSize: ").concat(stepSize, " would result generating up to ").concat(maxTicks, " ticks. Limiting to 1000."));
            maxTicks = 1000;
          }
        } else {
          maxTicks = this.computeTickLimit();
          maxTicksLimit = maxTicksLimit || 11;
        }
        if (maxTicksLimit) {
          maxTicks = Math.min(maxTicksLimit, maxTicks);
        }
        return maxTicks;
      }
    }, {
      key: "computeTickLimit",
      value: function computeTickLimit() {
        return Number.POSITIVE_INFINITY;
      }
    }, {
      key: "buildTicks",
      value: function buildTicks() {
        var opts = this.options;
        var tickOpts = opts.ticks;
        var maxTicks = this.getTickLimit();
        maxTicks = Math.max(2, maxTicks);
        var numericGeneratorOptions = {
          maxTicks: maxTicks,
          bounds: opts.bounds,
          min: opts.min,
          max: opts.max,
          precision: tickOpts.precision,
          step: tickOpts.stepSize,
          count: tickOpts.count,
          maxDigits: this._maxDigits(),
          horizontal: this.isHorizontal(),
          minRotation: tickOpts.minRotation || 0,
          includeBounds: tickOpts.includeBounds !== false
        };
        var dataRange = this._range || this;
        var ticks = generateTicks$1(numericGeneratorOptions, dataRange);
        if (opts.bounds === 'ticks') {
          _setMinAndMaxByKey(ticks, this, 'value');
        }
        if (opts.reverse) {
          ticks.reverse();
          this.start = this.max;
          this.end = this.min;
        } else {
          this.start = this.min;
          this.end = this.max;
        }
        return ticks;
      }
    }, {
      key: "configure",
      value: function configure() {
        var ticks = this.ticks;
        var start = this.min;
        var end = this.max;
        babelHelpers.get(babelHelpers.getPrototypeOf(LinearScaleBase.prototype), "configure", this).call(this);
        if (this.options.offset && ticks.length) {
          var offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
          start -= offset;
          end += offset;
        }
        this._startValue = start;
        this._endValue = end;
        this._valueRange = end - start;
      }
    }, {
      key: "getLabelForValue",
      value: function getLabelForValue(value) {
        return formatNumber(value, this.chart.options.locale, this.options.ticks.format);
      }
    }]);
    return LinearScaleBase;
  }(Scale);
  var LinearScale = /*#__PURE__*/function (_LinearScaleBase) {
    babelHelpers.inherits(LinearScale, _LinearScaleBase);
    function LinearScale() {
      babelHelpers.classCallCheck(this, LinearScale);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(LinearScale).apply(this, arguments));
    }
    babelHelpers.createClass(LinearScale, [{
      key: "determineDataLimits",
      value: function determineDataLimits() {
        var _this$getMinMax2 = this.getMinMax(true),
          min = _this$getMinMax2.min,
          max = _this$getMinMax2.max;
        this.min = isNumberFinite(min) ? min : 0;
        this.max = isNumberFinite(max) ? max : 1;
        this.handleTickRangeOptions();
      }
    }, {
      key: "computeTickLimit",
      value: function computeTickLimit() {
        var horizontal = this.isHorizontal();
        var length = horizontal ? this.width : this.height;
        var minRotation = toRadians(this.options.ticks.minRotation);
        var ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 0.001;
        var tickFont = this._resolveTickFontOptions(0);
        return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
      }
    }, {
      key: "getPixelForValue",
      value: function getPixelForValue(value) {
        return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
      }
    }, {
      key: "getValueForPixel",
      value: function getValueForPixel(pixel) {
        return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
      }
    }]);
    return LinearScale;
  }(LinearScaleBase);
  babelHelpers.defineProperty(LinearScale, "id", 'linear');
  babelHelpers.defineProperty(LinearScale, "defaults", {
    ticks: {
      callback: Ticks.formatters.numeric
    }
  });
  var log10Floor = function log10Floor(v$$1) {
    return Math.floor(log10(v$$1));
  };
  var changeExponent = function changeExponent(v$$1, m$$1) {
    return Math.pow(10, log10Floor(v$$1) + m$$1);
  };
  function isMajor(tickVal) {
    var remain = tickVal / Math.pow(10, log10Floor(tickVal));
    return remain === 1;
  }
  function steps(min, max, rangeExp) {
    var rangeStep = Math.pow(10, rangeExp);
    var start = Math.floor(min / rangeStep);
    var end = Math.ceil(max / rangeStep);
    return end - start;
  }
  function startExp(min, max) {
    var range = max - min;
    var rangeExp = log10Floor(range);
    while (steps(min, max, rangeExp) > 10) {
      rangeExp++;
    }
    while (steps(min, max, rangeExp) < 10) {
      rangeExp--;
    }
    return Math.min(rangeExp, log10Floor(min));
  }
  function generateTicks(generationOptions, _ref13) {
    var min = _ref13.min,
      max = _ref13.max;
    min = finiteOrDefault(generationOptions.min, min);
    var ticks = [];
    var minExp = log10Floor(min);
    var exp = startExp(min, max);
    var precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
    var stepSize = Math.pow(10, exp);
    var base = minExp > exp ? Math.pow(10, minExp) : 0;
    var start = Math.round((min - base) * precision) / precision;
    var offset = Math.floor((min - base) / stepSize / 10) * stepSize * 10;
    var significand = Math.floor((start - offset) / Math.pow(10, exp));
    var value = finiteOrDefault(generationOptions.min, Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision);
    while (value < max) {
      ticks.push({
        value: value,
        major: isMajor(value),
        significand: significand
      });
      if (significand >= 10) {
        significand = significand < 15 ? 15 : 20;
      } else {
        significand++;
      }
      if (significand >= 20) {
        exp++;
        significand = 2;
        precision = exp >= 0 ? 1 : precision;
      }
      value = Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision;
    }
    var lastTick = finiteOrDefault(generationOptions.max, value);
    ticks.push({
      value: lastTick,
      major: isMajor(lastTick),
      significand: significand
    });
    return ticks;
  }
  var LogarithmicScale = /*#__PURE__*/function (_Scale3) {
    babelHelpers.inherits(LogarithmicScale, _Scale3);
    function LogarithmicScale(cfg) {
      var _this37;
      babelHelpers.classCallCheck(this, LogarithmicScale);
      _this37 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(LogarithmicScale).call(this, cfg));
      _this37.start = undefined;
      _this37.end = undefined;
      _this37._startValue = undefined;
      _this37._valueRange = 0;
      return _this37;
    }
    babelHelpers.createClass(LogarithmicScale, [{
      key: "parse",
      value: function parse(raw, index) {
        var value = LinearScaleBase.prototype.parse.apply(this, [raw, index]);
        if (value === 0) {
          this._zero = true;
          return undefined;
        }
        return isNumberFinite(value) && value > 0 ? value : null;
      }
    }, {
      key: "determineDataLimits",
      value: function determineDataLimits() {
        var _this$getMinMax3 = this.getMinMax(true),
          min = _this$getMinMax3.min,
          max = _this$getMinMax3.max;
        this.min = isNumberFinite(min) ? Math.max(0, min) : null;
        this.max = isNumberFinite(max) ? Math.max(0, max) : null;
        if (this.options.beginAtZero) {
          this._zero = true;
        }
        if (this._zero && this.min !== this._suggestedMin && !isNumberFinite(this._userMin)) {
          this.min = min === changeExponent(this.min, 0) ? changeExponent(this.min, -1) : changeExponent(this.min, 0);
        }
        this.handleTickRangeOptions();
      }
    }, {
      key: "handleTickRangeOptions",
      value: function handleTickRangeOptions() {
        var _this$getUserBounds4 = this.getUserBounds(),
          minDefined = _this$getUserBounds4.minDefined,
          maxDefined = _this$getUserBounds4.maxDefined;
        var min = this.min;
        var max = this.max;
        var setMin = function setMin(v$$1) {
          return min = minDefined ? min : v$$1;
        };
        var setMax = function setMax(v$$1) {
          return max = maxDefined ? max : v$$1;
        };
        if (min === max) {
          if (min <= 0) {
            setMin(1);
            setMax(10);
          } else {
            setMin(changeExponent(min, -1));
            setMax(changeExponent(max, +1));
          }
        }
        if (min <= 0) {
          setMin(changeExponent(max, -1));
        }
        if (max <= 0) {
          setMax(changeExponent(min, +1));
        }
        this.min = min;
        this.max = max;
      }
    }, {
      key: "buildTicks",
      value: function buildTicks() {
        var opts = this.options;
        var generationOptions = {
          min: this._userMin,
          max: this._userMax
        };
        var ticks = generateTicks(generationOptions, this);
        if (opts.bounds === 'ticks') {
          _setMinAndMaxByKey(ticks, this, 'value');
        }
        if (opts.reverse) {
          ticks.reverse();
          this.start = this.max;
          this.end = this.min;
        } else {
          this.start = this.min;
          this.end = this.max;
        }
        return ticks;
      }
    }, {
      key: "getLabelForValue",
      value: function getLabelForValue(value) {
        return value === undefined ? '0' : formatNumber(value, this.chart.options.locale, this.options.ticks.format);
      }
    }, {
      key: "configure",
      value: function configure() {
        var start = this.min;
        babelHelpers.get(babelHelpers.getPrototypeOf(LogarithmicScale.prototype), "configure", this).call(this);
        this._startValue = log10(start);
        this._valueRange = log10(this.max) - log10(start);
      }
    }, {
      key: "getPixelForValue",
      value: function getPixelForValue(value) {
        if (value === undefined || value === 0) {
          value = this.min;
        }
        if (value === null || isNaN(value)) {
          return NaN;
        }
        return this.getPixelForDecimal(value === this.min ? 0 : (log10(value) - this._startValue) / this._valueRange);
      }
    }, {
      key: "getValueForPixel",
      value: function getValueForPixel(pixel) {
        var decimal = this.getDecimalForPixel(pixel);
        return Math.pow(10, this._startValue + decimal * this._valueRange);
      }
    }]);
    return LogarithmicScale;
  }(Scale);
  babelHelpers.defineProperty(LogarithmicScale, "id", 'logarithmic');
  babelHelpers.defineProperty(LogarithmicScale, "defaults", {
    ticks: {
      callback: Ticks.formatters.logarithmic,
      major: {
        enabled: true
      }
    }
  });
  function getTickBackdropHeight(opts) {
    var tickOpts = opts.ticks;
    if (tickOpts.display && opts.display) {
      var padding = toPadding(tickOpts.backdropPadding);
      return valueOrDefault(tickOpts.font && tickOpts.font.size, defaults.font.size) + padding.height;
    }
    return 0;
  }
  function measureLabelSize(ctx, font, label) {
    label = isArray(label) ? label : [label];
    return {
      w: _longestText(ctx, font.string, label),
      h: label.length * font.lineHeight
    };
  }
  function determineLimits(angle, pos, size, min, max) {
    if (angle === min || angle === max) {
      return {
        start: pos - size / 2,
        end: pos + size / 2
      };
    } else if (angle < min || angle > max) {
      return {
        start: pos - size,
        end: pos
      };
    }
    return {
      start: pos,
      end: pos + size
    };
  }
  function fitWithPointLabels(scale) {
    var orig = {
      l: scale.left + scale._padding.left,
      r: scale.right - scale._padding.right,
      t: scale.top + scale._padding.top,
      b: scale.bottom - scale._padding.bottom
    };
    var limits = Object.assign({}, orig);
    var labelSizes = [];
    var padding = [];
    var valueCount = scale._pointLabels.length;
    var pointLabelOpts = scale.options.pointLabels;
    var additionalAngle = pointLabelOpts.centerPointLabels ? PI / valueCount : 0;
    for (var i$$1 = 0; i$$1 < valueCount; i$$1++) {
      var opts = pointLabelOpts.setContext(scale.getPointLabelContext(i$$1));
      padding[i$$1] = opts.padding;
      var pointPosition = scale.getPointPosition(i$$1, scale.drawingArea + padding[i$$1], additionalAngle);
      var plFont = toFont(opts.font);
      var textSize = measureLabelSize(scale.ctx, plFont, scale._pointLabels[i$$1]);
      labelSizes[i$$1] = textSize;
      var angleRadians = _normalizeAngle(scale.getIndexAngle(i$$1) + additionalAngle);
      var angle = Math.round(toDegrees(angleRadians));
      var hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
      var vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
      updateLimits(limits, orig, angleRadians, hLimits, vLimits);
    }
    scale.setCenterPoint(orig.l - limits.l, limits.r - orig.r, orig.t - limits.t, limits.b - orig.b);
    scale._pointLabelItems = buildPointLabelItems(scale, labelSizes, padding);
  }
  function updateLimits(limits, orig, angle, hLimits, vLimits) {
    var sin = Math.abs(Math.sin(angle));
    var cos = Math.abs(Math.cos(angle));
    var x$$1 = 0;
    var y$$1 = 0;
    if (hLimits.start < orig.l) {
      x$$1 = (orig.l - hLimits.start) / sin;
      limits.l = Math.min(limits.l, orig.l - x$$1);
    } else if (hLimits.end > orig.r) {
      x$$1 = (hLimits.end - orig.r) / sin;
      limits.r = Math.max(limits.r, orig.r + x$$1);
    }
    if (vLimits.start < orig.t) {
      y$$1 = (orig.t - vLimits.start) / cos;
      limits.t = Math.min(limits.t, orig.t - y$$1);
    } else if (vLimits.end > orig.b) {
      y$$1 = (vLimits.end - orig.b) / cos;
      limits.b = Math.max(limits.b, orig.b + y$$1);
    }
  }
  function buildPointLabelItems(scale, labelSizes, padding) {
    var items = [];
    var valueCount = scale._pointLabels.length;
    var opts = scale.options;
    var extra = getTickBackdropHeight(opts) / 2;
    var outerDistance = scale.drawingArea;
    var additionalAngle = opts.pointLabels.centerPointLabels ? PI / valueCount : 0;
    for (var i$$1 = 0; i$$1 < valueCount; i$$1++) {
      var pointLabelPosition = scale.getPointPosition(i$$1, outerDistance + extra + padding[i$$1], additionalAngle);
      var angle = Math.round(toDegrees(_normalizeAngle(pointLabelPosition.angle + HALF_PI)));
      var size = labelSizes[i$$1];
      var y$$1 = yForAngle(pointLabelPosition.y, size.h, angle);
      var textAlign = getTextAlignForAngle(angle);
      var left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign);
      items.push({
        x: pointLabelPosition.x,
        y: y$$1,
        textAlign: textAlign,
        left: left,
        top: y$$1,
        right: left + size.w,
        bottom: y$$1 + size.h
      });
    }
    return items;
  }
  function getTextAlignForAngle(angle) {
    if (angle === 0 || angle === 180) {
      return 'center';
    } else if (angle < 180) {
      return 'left';
    }
    return 'right';
  }
  function leftForTextAlign(x$$1, w$$1, align) {
    if (align === 'right') {
      x$$1 -= w$$1;
    } else if (align === 'center') {
      x$$1 -= w$$1 / 2;
    }
    return x$$1;
  }
  function yForAngle(y$$1, h$$1, angle) {
    if (angle === 90 || angle === 270) {
      y$$1 -= h$$1 / 2;
    } else if (angle > 270 || angle < 90) {
      y$$1 -= h$$1;
    }
    return y$$1;
  }
  function drawPointLabels(scale, labelCount) {
    var ctx = scale.ctx,
      pointLabels = scale.options.pointLabels;
    for (var i$$1 = labelCount - 1; i$$1 >= 0; i$$1--) {
      var optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i$$1));
      var plFont = toFont(optsAtIndex.font);
      var _scale$_pointLabelIte = scale._pointLabelItems[i$$1],
        x$$1 = _scale$_pointLabelIte.x,
        y$$1 = _scale$_pointLabelIte.y,
        textAlign = _scale$_pointLabelIte.textAlign,
        left = _scale$_pointLabelIte.left,
        top = _scale$_pointLabelIte.top,
        right = _scale$_pointLabelIte.right,
        bottom = _scale$_pointLabelIte.bottom;
      var backdropColor = optsAtIndex.backdropColor;
      if (!isNullOrUndef(backdropColor)) {
        var borderRadius = toTRBLCorners(optsAtIndex.borderRadius);
        var padding = toPadding(optsAtIndex.backdropPadding);
        ctx.fillStyle = backdropColor;
        var backdropLeft = left - padding.left;
        var backdropTop = top - padding.top;
        var backdropWidth = right - left + padding.width;
        var backdropHeight = bottom - top + padding.height;
        if (Object.values(borderRadius).some(function (v$$1) {
          return v$$1 !== 0;
        })) {
          ctx.beginPath();
          addRoundedRectPath(ctx, {
            x: backdropLeft,
            y: backdropTop,
            w: backdropWidth,
            h: backdropHeight,
            radius: borderRadius
          });
          ctx.fill();
        } else {
          ctx.fillRect(backdropLeft, backdropTop, backdropWidth, backdropHeight);
        }
      }
      renderText(ctx, scale._pointLabels[i$$1], x$$1, y$$1 + plFont.lineHeight / 2, plFont, {
        color: optsAtIndex.color,
        textAlign: textAlign,
        textBaseline: 'middle'
      });
    }
  }
  function pathRadiusLine(scale, radius, circular, labelCount) {
    var ctx = scale.ctx;
    if (circular) {
      ctx.arc(scale.xCenter, scale.yCenter, radius, 0, TAU);
    } else {
      var pointPosition = scale.getPointPosition(0, radius);
      ctx.moveTo(pointPosition.x, pointPosition.y);
      for (var i$$1 = 1; i$$1 < labelCount; i$$1++) {
        pointPosition = scale.getPointPosition(i$$1, radius);
        ctx.lineTo(pointPosition.x, pointPosition.y);
      }
    }
  }
  function drawRadiusLine(scale, gridLineOpts, radius, labelCount, borderOpts) {
    var ctx = scale.ctx;
    var circular = gridLineOpts.circular;
    var color$$1 = gridLineOpts.color,
      lineWidth = gridLineOpts.lineWidth;
    if (!circular && !labelCount || !color$$1 || !lineWidth || radius < 0) {
      return;
    }
    ctx.save();
    ctx.strokeStyle = color$$1;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(borderOpts.dash);
    ctx.lineDashOffset = borderOpts.dashOffset;
    ctx.beginPath();
    pathRadiusLine(scale, radius, circular, labelCount);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
  function createPointLabelContext(parent, index, label) {
    return createContext(parent, {
      label: label,
      index: index,
      type: 'pointLabel'
    });
  }
  var RadialLinearScale = /*#__PURE__*/function (_LinearScaleBase2) {
    babelHelpers.inherits(RadialLinearScale, _LinearScaleBase2);
    function RadialLinearScale(cfg) {
      var _this38;
      babelHelpers.classCallCheck(this, RadialLinearScale);
      _this38 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(RadialLinearScale).call(this, cfg));
      _this38.xCenter = undefined;
      _this38.yCenter = undefined;
      _this38.drawingArea = undefined;
      _this38._pointLabels = [];
      _this38._pointLabelItems = [];
      return _this38;
    }
    babelHelpers.createClass(RadialLinearScale, [{
      key: "setDimensions",
      value: function setDimensions() {
        var padding = this._padding = toPadding(getTickBackdropHeight(this.options) / 2);
        var w$$1 = this.width = this.maxWidth - padding.width;
        var h$$1 = this.height = this.maxHeight - padding.height;
        this.xCenter = Math.floor(this.left + w$$1 / 2 + padding.left);
        this.yCenter = Math.floor(this.top + h$$1 / 2 + padding.top);
        this.drawingArea = Math.floor(Math.min(w$$1, h$$1) / 2);
      }
    }, {
      key: "determineDataLimits",
      value: function determineDataLimits() {
        var _this$getMinMax4 = this.getMinMax(false),
          min = _this$getMinMax4.min,
          max = _this$getMinMax4.max;
        this.min = isNumberFinite(min) && !isNaN(min) ? min : 0;
        this.max = isNumberFinite(max) && !isNaN(max) ? max : 0;
        this.handleTickRangeOptions();
      }
    }, {
      key: "computeTickLimit",
      value: function computeTickLimit() {
        return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
      }
    }, {
      key: "generateTickLabels",
      value: function generateTickLabels(ticks) {
        var _this39 = this;
        LinearScaleBase.prototype.generateTickLabels.call(this, ticks);
        this._pointLabels = this.getLabels().map(function (value, index) {
          var label = callback(_this39.options.pointLabels.callback, [value, index], _this39);
          return label || label === 0 ? label : '';
        }).filter(function (v$$1, i$$1) {
          return _this39.chart.getDataVisibility(i$$1);
        });
      }
    }, {
      key: "fit",
      value: function fit() {
        var opts = this.options;
        if (opts.display && opts.pointLabels.display) {
          fitWithPointLabels(this);
        } else {
          this.setCenterPoint(0, 0, 0, 0);
        }
      }
    }, {
      key: "setCenterPoint",
      value: function setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
        this.xCenter += Math.floor((leftMovement - rightMovement) / 2);
        this.yCenter += Math.floor((topMovement - bottomMovement) / 2);
        this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(leftMovement, rightMovement, topMovement, bottomMovement));
      }
    }, {
      key: "getIndexAngle",
      value: function getIndexAngle(index) {
        var angleMultiplier = TAU / (this._pointLabels.length || 1);
        var startAngle = this.options.startAngle || 0;
        return _normalizeAngle(index * angleMultiplier + toRadians(startAngle));
      }
    }, {
      key: "getDistanceFromCenterForValue",
      value: function getDistanceFromCenterForValue(value) {
        if (isNullOrUndef(value)) {
          return NaN;
        }
        var scalingFactor = this.drawingArea / (this.max - this.min);
        if (this.options.reverse) {
          return (this.max - value) * scalingFactor;
        }
        return (value - this.min) * scalingFactor;
      }
    }, {
      key: "getValueForDistanceFromCenter",
      value: function getValueForDistanceFromCenter(distance) {
        if (isNullOrUndef(distance)) {
          return NaN;
        }
        var scaledDistance = distance / (this.drawingArea / (this.max - this.min));
        return this.options.reverse ? this.max - scaledDistance : this.min + scaledDistance;
      }
    }, {
      key: "getPointLabelContext",
      value: function getPointLabelContext(index) {
        var pointLabels = this._pointLabels || [];
        if (index >= 0 && index < pointLabels.length) {
          var pointLabel = pointLabels[index];
          return createPointLabelContext(this.getContext(), index, pointLabel);
        }
      }
    }, {
      key: "getPointPosition",
      value: function getPointPosition(index, distanceFromCenter) {
        var additionalAngle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var angle = this.getIndexAngle(index) - HALF_PI + additionalAngle;
        return {
          x: Math.cos(angle) * distanceFromCenter + this.xCenter,
          y: Math.sin(angle) * distanceFromCenter + this.yCenter,
          angle: angle
        };
      }
    }, {
      key: "getPointPositionForValue",
      value: function getPointPositionForValue(index, value) {
        return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
      }
    }, {
      key: "getBasePosition",
      value: function getBasePosition(index) {
        return this.getPointPositionForValue(index || 0, this.getBaseValue());
      }
    }, {
      key: "getPointLabelPosition",
      value: function getPointLabelPosition(index) {
        var _this$_pointLabelItem = this._pointLabelItems[index],
          left = _this$_pointLabelItem.left,
          top = _this$_pointLabelItem.top,
          right = _this$_pointLabelItem.right,
          bottom = _this$_pointLabelItem.bottom;
        return {
          left: left,
          top: top,
          right: right,
          bottom: bottom
        };
      }
    }, {
      key: "drawBackground",
      value: function drawBackground() {
        var _this$options16 = this.options,
          backgroundColor = _this$options16.backgroundColor,
          circular = _this$options16.grid.circular;
        if (backgroundColor) {
          var ctx = this.ctx;
          ctx.save();
          ctx.beginPath();
          pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this._pointLabels.length);
          ctx.closePath();
          ctx.fillStyle = backgroundColor;
          ctx.fill();
          ctx.restore();
        }
      }
    }, {
      key: "drawGrid",
      value: function drawGrid() {
        var _this40 = this;
        var ctx = this.ctx;
        var opts = this.options;
        var angleLines = opts.angleLines,
          grid = opts.grid,
          border = opts.border;
        var labelCount = this._pointLabels.length;
        var i$$1, offset, position;
        if (opts.pointLabels.display) {
          drawPointLabels(this, labelCount);
        }
        if (grid.display) {
          this.ticks.forEach(function (tick, index) {
            if (index !== 0) {
              offset = _this40.getDistanceFromCenterForValue(tick.value);
              var context = _this40.getContext(index);
              var optsAtIndex = grid.setContext(context);
              var optsAtIndexBorder = border.setContext(context);
              drawRadiusLine(_this40, optsAtIndex, offset, labelCount, optsAtIndexBorder);
            }
          });
        }
        if (angleLines.display) {
          ctx.save();
          for (i$$1 = labelCount - 1; i$$1 >= 0; i$$1--) {
            var optsAtIndex = angleLines.setContext(this.getPointLabelContext(i$$1));
            var color$$1 = optsAtIndex.color,
              lineWidth = optsAtIndex.lineWidth;
            if (!lineWidth || !color$$1) {
              continue;
            }
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color$$1;
            ctx.setLineDash(optsAtIndex.borderDash);
            ctx.lineDashOffset = optsAtIndex.borderDashOffset;
            offset = this.getDistanceFromCenterForValue(opts.ticks.reverse ? this.min : this.max);
            position = this.getPointPosition(i$$1, offset);
            ctx.beginPath();
            ctx.moveTo(this.xCenter, this.yCenter);
            ctx.lineTo(position.x, position.y);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
    }, {
      key: "drawBorder",
      value: function drawBorder() {}
    }, {
      key: "drawLabels",
      value: function drawLabels() {
        var _this41 = this;
        var ctx = this.ctx;
        var opts = this.options;
        var tickOpts = opts.ticks;
        if (!tickOpts.display) {
          return;
        }
        var startAngle = this.getIndexAngle(0);
        var offset, width;
        ctx.save();
        ctx.translate(this.xCenter, this.yCenter);
        ctx.rotate(startAngle);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        this.ticks.forEach(function (tick, index) {
          if (index === 0 && !opts.reverse) {
            return;
          }
          var optsAtIndex = tickOpts.setContext(_this41.getContext(index));
          var tickFont = toFont(optsAtIndex.font);
          offset = _this41.getDistanceFromCenterForValue(_this41.ticks[index].value);
          if (optsAtIndex.showLabelBackdrop) {
            ctx.font = tickFont.string;
            width = ctx.measureText(tick.label).width;
            ctx.fillStyle = optsAtIndex.backdropColor;
            var padding = toPadding(optsAtIndex.backdropPadding);
            ctx.fillRect(-width / 2 - padding.left, -offset - tickFont.size / 2 - padding.top, width + padding.width, tickFont.size + padding.height);
          }
          renderText(ctx, tick.label, 0, -offset, tickFont, {
            color: optsAtIndex.color
          });
        });
        ctx.restore();
      }
    }, {
      key: "drawTitle",
      value: function drawTitle() {}
    }]);
    return RadialLinearScale;
  }(LinearScaleBase);
  babelHelpers.defineProperty(RadialLinearScale, "id", 'radialLinear');
  babelHelpers.defineProperty(RadialLinearScale, "defaults", {
    display: true,
    animate: true,
    position: 'chartArea',
    angleLines: {
      display: true,
      lineWidth: 1,
      borderDash: [],
      borderDashOffset: 0.0
    },
    grid: {
      circular: false
    },
    startAngle: 0,
    ticks: {
      showLabelBackdrop: true,
      callback: Ticks.formatters.numeric
    },
    pointLabels: {
      backdropColor: undefined,
      backdropPadding: 2,
      display: true,
      font: {
        size: 10
      },
      callback: function callback$$1(label) {
        return label;
      },
      padding: 5,
      centerPointLabels: false
    }
  });
  babelHelpers.defineProperty(RadialLinearScale, "defaultRoutes", {
    'angleLines.color': 'borderColor',
    'pointLabels.color': 'color',
    'ticks.color': 'color'
  });
  babelHelpers.defineProperty(RadialLinearScale, "descriptors", {
    angleLines: {
      _fallback: 'grid'
    }
  });
  var INTERVALS = {
    millisecond: {
      common: true,
      size: 1,
      steps: 1000
    },
    second: {
      common: true,
      size: 1000,
      steps: 60
    },
    minute: {
      common: true,
      size: 60000,
      steps: 60
    },
    hour: {
      common: true,
      size: 3600000,
      steps: 24
    },
    day: {
      common: true,
      size: 86400000,
      steps: 30
    },
    week: {
      common: false,
      size: 604800000,
      steps: 4
    },
    month: {
      common: true,
      size: 2.628e9,
      steps: 12
    },
    quarter: {
      common: false,
      size: 7.884e9,
      steps: 4
    },
    year: {
      common: true,
      size: 3.154e10
    }
  };
  var UNITS = /* #__PURE__ */Object.keys(INTERVALS);
  function sorter(a$$1, b$$1) {
    return a$$1 - b$$1;
  }
  function _parse(scale, input) {
    if (isNullOrUndef(input)) {
      return null;
    }
    var adapter = scale._adapter;
    var _scale$_parseOpts = scale._parseOpts,
      parser = _scale$_parseOpts.parser,
      round = _scale$_parseOpts.round,
      isoWeekday = _scale$_parseOpts.isoWeekday;
    var value = input;
    if (typeof parser === 'function') {
      value = parser(value);
    }
    if (!isNumberFinite(value)) {
      value = typeof parser === 'string' ? adapter.parse(value, parser) : adapter.parse(value);
    }
    if (value === null) {
      return null;
    }
    if (round) {
      value = round === 'week' && (isNumber(isoWeekday) || isoWeekday === true) ? adapter.startOf(value, 'isoWeek', isoWeekday) : adapter.startOf(value, round);
    }
    return +value;
  }
  function determineUnitForAutoTicks(minUnit, min, max, capacity) {
    var ilen = UNITS.length;
    for (var i$$1 = UNITS.indexOf(minUnit); i$$1 < ilen - 1; ++i$$1) {
      var interval = INTERVALS[UNITS[i$$1]];
      var factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
      if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
        return UNITS[i$$1];
      }
    }
    return UNITS[ilen - 1];
  }
  function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
    for (var i$$1 = UNITS.length - 1; i$$1 >= UNITS.indexOf(minUnit); i$$1--) {
      var unit = UNITS[i$$1];
      if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
        return unit;
      }
    }
    return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
  }
  function determineMajorUnit(unit) {
    for (var i$$1 = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i$$1 < ilen; ++i$$1) {
      if (INTERVALS[UNITS[i$$1]].common) {
        return UNITS[i$$1];
      }
    }
  }
  function addTick(ticks, time, timestamps) {
    if (!timestamps) {
      ticks[time] = true;
    } else if (timestamps.length) {
      var _lookup2 = _lookup(timestamps, time),
        lo = _lookup2.lo,
        hi = _lookup2.hi;
      var timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
      ticks[timestamp] = true;
    }
  }
  function setMajorTicks(scale, ticks, map, majorUnit) {
    var adapter = scale._adapter;
    var first = +adapter.startOf(ticks[0].value, majorUnit);
    var last = ticks[ticks.length - 1].value;
    var major, index;
    for (major = first; major <= last; major = +adapter.add(major, 1, majorUnit)) {
      index = map[major];
      if (index >= 0) {
        ticks[index].major = true;
      }
    }
    return ticks;
  }
  function ticksFromTimestamps(scale, values, majorUnit) {
    var ticks = [];
    var map = {};
    var ilen = values.length;
    var i$$1, value;
    for (i$$1 = 0; i$$1 < ilen; ++i$$1) {
      value = values[i$$1];
      map[value] = i$$1;
      ticks.push({
        value: value,
        major: false
      });
    }
    return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map, majorUnit);
  }
  var TimeScale = /*#__PURE__*/function (_Scale4) {
    babelHelpers.inherits(TimeScale, _Scale4);
    function TimeScale(props) {
      var _this42;
      babelHelpers.classCallCheck(this, TimeScale);
      _this42 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(TimeScale).call(this, props));
      _this42._cache = {
        data: [],
        labels: [],
        all: []
      };
      _this42._unit = 'day';
      _this42._majorUnit = undefined;
      _this42._offsets = {};
      _this42._normalized = false;
      _this42._parseOpts = undefined;
      return _this42;
    }
    babelHelpers.createClass(TimeScale, [{
      key: "init",
      value: function init(scaleOpts) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var time = scaleOpts.time || (scaleOpts.time = {});
        var adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
        adapter.init(opts);
        mergeIf(time.displayFormats, adapter.formats());
        this._parseOpts = {
          parser: time.parser,
          round: time.round,
          isoWeekday: time.isoWeekday
        };
        babelHelpers.get(babelHelpers.getPrototypeOf(TimeScale.prototype), "init", this).call(this, scaleOpts);
        this._normalized = opts.normalized;
      }
    }, {
      key: "parse",
      value: function parse(raw, index) {
        if (raw === undefined) {
          return null;
        }
        return _parse(this, raw);
      }
    }, {
      key: "beforeLayout",
      value: function beforeLayout() {
        babelHelpers.get(babelHelpers.getPrototypeOf(TimeScale.prototype), "beforeLayout", this).call(this);
        this._cache = {
          data: [],
          labels: [],
          all: []
        };
      }
    }, {
      key: "determineDataLimits",
      value: function determineDataLimits() {
        var options = this.options;
        var adapter = this._adapter;
        var unit = options.time.unit || 'day';
        var _this$getUserBounds5 = this.getUserBounds(),
          min = _this$getUserBounds5.min,
          max = _this$getUserBounds5.max,
          minDefined = _this$getUserBounds5.minDefined,
          maxDefined = _this$getUserBounds5.maxDefined;
        function _applyBounds(bounds) {
          if (!minDefined && !isNaN(bounds.min)) {
            min = Math.min(min, bounds.min);
          }
          if (!maxDefined && !isNaN(bounds.max)) {
            max = Math.max(max, bounds.max);
          }
        }
        if (!minDefined || !maxDefined) {
          _applyBounds(this._getLabelBounds());
          if (options.bounds !== 'ticks' || options.ticks.source !== 'labels') {
            _applyBounds(this.getMinMax(false));
          }
        }
        min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
        max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
        this.min = Math.min(min, max - 1);
        this.max = Math.max(min + 1, max);
      }
    }, {
      key: "_getLabelBounds",
      value: function _getLabelBounds() {
        var arr = this.getLabelTimestamps();
        var min = Number.POSITIVE_INFINITY;
        var max = Number.NEGATIVE_INFINITY;
        if (arr.length) {
          min = arr[0];
          max = arr[arr.length - 1];
        }
        return {
          min: min,
          max: max
        };
      }
    }, {
      key: "buildTicks",
      value: function buildTicks() {
        var options = this.options;
        var timeOpts = options.time;
        var tickOpts = options.ticks;
        var timestamps = tickOpts.source === 'labels' ? this.getLabelTimestamps() : this._generate();
        if (options.bounds === 'ticks' && timestamps.length) {
          this.min = this._userMin || timestamps[0];
          this.max = this._userMax || timestamps[timestamps.length - 1];
        }
        var min = this.min;
        var max = this.max;
        var ticks = _filterBetween(timestamps, min, max);
        this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min)) : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
        this._majorUnit = !tickOpts.major.enabled || this._unit === 'year' ? undefined : determineMajorUnit(this._unit);
        this.initOffsets(timestamps);
        if (options.reverse) {
          ticks.reverse();
        }
        return ticksFromTimestamps(this, ticks, this._majorUnit);
      }
    }, {
      key: "afterAutoSkip",
      value: function afterAutoSkip() {
        if (this.options.offsetAfterAutoskip) {
          this.initOffsets(this.ticks.map(function (tick) {
            return +tick.value;
          }));
        }
      }
    }, {
      key: "initOffsets",
      value: function initOffsets() {
        var timestamps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var start = 0;
        var end = 0;
        var first, last;
        if (this.options.offset && timestamps.length) {
          first = this.getDecimalForValue(timestamps[0]);
          if (timestamps.length === 1) {
            start = 1 - first;
          } else {
            start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
          }
          last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
          if (timestamps.length === 1) {
            end = last;
          } else {
            end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
          }
        }
        var limit = timestamps.length < 3 ? 0.5 : 0.25;
        start = _limitValue(start, 0, limit);
        end = _limitValue(end, 0, limit);
        this._offsets = {
          start: start,
          end: end,
          factor: 1 / (start + 1 + end)
        };
      }
    }, {
      key: "_generate",
      value: function _generate() {
        var adapter = this._adapter;
        var min = this.min;
        var max = this.max;
        var options = this.options;
        var timeOpts = options.time;
        var minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
        var stepSize = valueOrDefault(options.ticks.stepSize, 1);
        var weekday = minor === 'week' ? timeOpts.isoWeekday : false;
        var hasWeekday = isNumber(weekday) || weekday === true;
        var ticks = {};
        var first = min;
        var time, count;
        if (hasWeekday) {
          first = +adapter.startOf(first, 'isoWeek', weekday);
        }
        first = +adapter.startOf(first, hasWeekday ? 'day' : minor);
        if (adapter.diff(max, min, minor) > 100000 * stepSize) {
          throw new Error(min + ' and ' + max + ' are too far apart with stepSize of ' + stepSize + ' ' + minor);
        }
        var timestamps = options.ticks.source === 'data' && this.getDataTimestamps();
        for (time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++) {
          addTick(ticks, time, timestamps);
        }
        if (time === max || options.bounds === 'ticks' || count === 1) {
          addTick(ticks, time, timestamps);
        }
        return Object.keys(ticks).sort(function (a$$1, b$$1) {
          return a$$1 - b$$1;
        }).map(function (x$$1) {
          return +x$$1;
        });
      }
    }, {
      key: "getLabelForValue",
      value: function getLabelForValue(value) {
        var adapter = this._adapter;
        var timeOpts = this.options.time;
        if (timeOpts.tooltipFormat) {
          return adapter.format(value, timeOpts.tooltipFormat);
        }
        return adapter.format(value, timeOpts.displayFormats.datetime);
      }
    }, {
      key: "format",
      value: function format(value, _format) {
        var options = this.options;
        var formats = options.time.displayFormats;
        var unit = this._unit;
        var fmt = _format || formats[unit];
        return this._adapter.format(value, fmt);
      }
    }, {
      key: "_tickFormatFunction",
      value: function _tickFormatFunction(time, index, ticks, format) {
        var options = this.options;
        var formatter = options.ticks.callback;
        if (formatter) {
          return callback(formatter, [time, index, ticks], this);
        }
        var formats = options.time.displayFormats;
        var unit = this._unit;
        var majorUnit = this._majorUnit;
        var minorFormat = unit && formats[unit];
        var majorFormat = majorUnit && formats[majorUnit];
        var tick = ticks[index];
        var major = majorUnit && majorFormat && tick && tick.major;
        return this._adapter.format(time, format || (major ? majorFormat : minorFormat));
      }
    }, {
      key: "generateTickLabels",
      value: function generateTickLabels(ticks) {
        var i$$1, ilen, tick;
        for (i$$1 = 0, ilen = ticks.length; i$$1 < ilen; ++i$$1) {
          tick = ticks[i$$1];
          tick.label = this._tickFormatFunction(tick.value, i$$1, ticks);
        }
      }
    }, {
      key: "getDecimalForValue",
      value: function getDecimalForValue(value) {
        return value === null ? NaN : (value - this.min) / (this.max - this.min);
      }
    }, {
      key: "getPixelForValue",
      value: function getPixelForValue(value) {
        var offsets = this._offsets;
        var pos = this.getDecimalForValue(value);
        return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
      }
    }, {
      key: "getValueForPixel",
      value: function getValueForPixel(pixel) {
        var offsets = this._offsets;
        var pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
        return this.min + pos * (this.max - this.min);
      }
    }, {
      key: "_getLabelSize",
      value: function _getLabelSize(label) {
        var ticksOpts = this.options.ticks;
        var tickLabelWidth = this.ctx.measureText(label).width;
        var angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
        var cosRotation = Math.cos(angle);
        var sinRotation = Math.sin(angle);
        var tickFontSize = this._resolveTickFontOptions(0).size;
        return {
          w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
          h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
        };
      }
    }, {
      key: "_getLabelCapacity",
      value: function _getLabelCapacity(exampleTime) {
        var timeOpts = this.options.time;
        var displayFormats = timeOpts.displayFormats;
        var format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
        var exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [exampleTime], this._majorUnit), format);
        var size = this._getLabelSize(exampleLabel);
        var capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
        return capacity > 0 ? capacity : 1;
      }
    }, {
      key: "getDataTimestamps",
      value: function getDataTimestamps() {
        var timestamps = this._cache.data || [];
        var i$$1, ilen;
        if (timestamps.length) {
          return timestamps;
        }
        var metas = this.getMatchingVisibleMetas();
        if (this._normalized && metas.length) {
          return this._cache.data = metas[0].controller.getAllParsedValues(this);
        }
        for (i$$1 = 0, ilen = metas.length; i$$1 < ilen; ++i$$1) {
          timestamps = timestamps.concat(metas[i$$1].controller.getAllParsedValues(this));
        }
        return this._cache.data = this.normalize(timestamps);
      }
    }, {
      key: "getLabelTimestamps",
      value: function getLabelTimestamps() {
        var timestamps = this._cache.labels || [];
        var i$$1, ilen;
        if (timestamps.length) {
          return timestamps;
        }
        var labels = this.getLabels();
        for (i$$1 = 0, ilen = labels.length; i$$1 < ilen; ++i$$1) {
          timestamps.push(_parse(this, labels[i$$1]));
        }
        return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
      }
    }, {
      key: "normalize",
      value: function normalize(values) {
        return _arrayUnique(values.sort(sorter));
      }
    }]);
    return TimeScale;
  }(Scale);
  babelHelpers.defineProperty(TimeScale, "id", 'time');
  babelHelpers.defineProperty(TimeScale, "defaults", {
    bounds: 'data',
    adapters: {},
    time: {
      parser: false,
      unit: false,
      round: false,
      isoWeekday: false,
      minUnit: 'millisecond',
      displayFormats: {}
    },
    ticks: {
      source: 'auto',
      callback: false,
      major: {
        enabled: false
      }
    }
  });
  function interpolate(table, val, reverse) {
    var lo = 0;
    var hi = table.length - 1;
    var prevSource, nextSource, prevTarget, nextTarget;
    if (reverse) {
      if (val >= table[lo].pos && val <= table[hi].pos) {
        var _lookupByKey2 = _lookupByKey(table, 'pos', val);
        lo = _lookupByKey2.lo;
        hi = _lookupByKey2.hi;
      }
      var _table$lo = table[lo];
      prevSource = _table$lo.pos;
      prevTarget = _table$lo.time;
      var _table$hi = table[hi];
      nextSource = _table$hi.pos;
      nextTarget = _table$hi.time;
    } else {
      if (val >= table[lo].time && val <= table[hi].time) {
        var _lookupByKey3 = _lookupByKey(table, 'time', val);
        lo = _lookupByKey3.lo;
        hi = _lookupByKey3.hi;
      }
      var _table$lo2 = table[lo];
      prevSource = _table$lo2.time;
      prevTarget = _table$lo2.pos;
      var _table$hi2 = table[hi];
      nextSource = _table$hi2.time;
      nextTarget = _table$hi2.pos;
    }
    var span = nextSource - prevSource;
    return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
  }
  var TimeSeriesScale = /*#__PURE__*/function (_TimeScale) {
    babelHelpers.inherits(TimeSeriesScale, _TimeScale);
    function TimeSeriesScale(props) {
      var _this43;
      babelHelpers.classCallCheck(this, TimeSeriesScale);
      _this43 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(TimeSeriesScale).call(this, props));
      _this43._table = [];
      _this43._minPos = undefined;
      _this43._tableRange = undefined;
      return _this43;
    }
    babelHelpers.createClass(TimeSeriesScale, [{
      key: "initOffsets",
      value: function initOffsets() {
        var timestamps = this._getTimestampsForTable();
        var table = this._table = this.buildLookupTable(timestamps);
        this._minPos = interpolate(table, this.min);
        this._tableRange = interpolate(table, this.max) - this._minPos;
        babelHelpers.get(babelHelpers.getPrototypeOf(TimeSeriesScale.prototype), "initOffsets", this).call(this, timestamps);
      }
    }, {
      key: "buildLookupTable",
      value: function buildLookupTable(timestamps) {
        var min = this.min,
          max = this.max;
        var items = [];
        var table = [];
        var i$$1, ilen, prev, curr, next;
        for (i$$1 = 0, ilen = timestamps.length; i$$1 < ilen; ++i$$1) {
          curr = timestamps[i$$1];
          if (curr >= min && curr <= max) {
            items.push(curr);
          }
        }
        if (items.length < 2) {
          return [{
            time: min,
            pos: 0
          }, {
            time: max,
            pos: 1
          }];
        }
        for (i$$1 = 0, ilen = items.length; i$$1 < ilen; ++i$$1) {
          next = items[i$$1 + 1];
          prev = items[i$$1 - 1];
          curr = items[i$$1];
          if (Math.round((next + prev) / 2) !== curr) {
            table.push({
              time: curr,
              pos: i$$1 / (ilen - 1)
            });
          }
        }
        return table;
      }
    }, {
      key: "_getTimestampsForTable",
      value: function _getTimestampsForTable() {
        var timestamps = this._cache.all || [];
        if (timestamps.length) {
          return timestamps;
        }
        var data = this.getDataTimestamps();
        var label = this.getLabelTimestamps();
        if (data.length && label.length) {
          timestamps = this.normalize(data.concat(label));
        } else {
          timestamps = data.length ? data : label;
        }
        timestamps = this._cache.all = timestamps;
        return timestamps;
      }
    }, {
      key: "getDecimalForValue",
      value: function getDecimalForValue(value) {
        return (interpolate(this._table, value) - this._minPos) / this._tableRange;
      }
    }, {
      key: "getValueForPixel",
      value: function getValueForPixel(pixel) {
        var offsets = this._offsets;
        var decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
        return interpolate(this._table, decimal * this._tableRange + this._minPos, true);
      }
    }]);
    return TimeSeriesScale;
  }(TimeScale);
  babelHelpers.defineProperty(TimeSeriesScale, "id", 'timeseries');
  babelHelpers.defineProperty(TimeSeriesScale, "defaults", TimeScale.defaults);
  var scales = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CategoryScale: CategoryScale,
    LinearScale: LinearScale,
    LogarithmicScale: LogarithmicScale,
    RadialLinearScale: RadialLinearScale,
    TimeScale: TimeScale,
    TimeSeriesScale: TimeSeriesScale
  });
  var registerables = [controllers, elements, plugins, scales];

  Chart.register.apply(Chart, babelHelpers.toConsumableArray(registerables));

  var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;
  var QuizShow = /*#__PURE__*/function () {
    // Текущий quiz
    // Текущий question
    // Диаграмма

    function QuizShow() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      babelHelpers.classCallCheck(this, QuizShow);
      this.quizId = options.quizId;
      if (main_core.Type.isStringFilled(options.rootNodeId)) {
        this.rootNodeId = options.rootNodeId;
      } else {
        throw new Error('QuizShow: options.rootNodeId required');
      }
      this.rootNode = document.getElementById(this.rootNodeId);
      if (!this.rootNode) {
        throw new Error("QuizShow: element with id \"".concat(this.rootNodeId, "\" not found"));
      }
      this.questions = []; // Все вопросы : title, id
      this.currentQuestionId = 1; // Текущий id вопроса
      this.reload();
    }
    babelHelpers.createClass(QuizShow, [{
      key: "loadQuiz",
      value: function loadQuiz() {
        var _this = this;
        return new Promise(function (resolve, reject) {
          BX.ajax.runAction('up:quiz.quiz.getQuiz', {
            data: {
              id: _this.quizId
            }
          }).then(function (response) {
            var quiz = response.data.quiz;
            resolve(quiz);
          })["catch"](function (error) {
            console.error(error);
            reject(error);
          });
        });
      }
    }, {
      key: "loadQuestion",
      value: function loadQuestion(id) {
        return new Promise(function (resolve, reject) {
          BX.ajax.runAction('up:quiz.question.getQuestion', {
            data: {
              id: id
            }
          }).then(function (response) {
            var question = response.data.question;
            resolve(question);
          })["catch"](function (error) {
            console.error(error);
            reject(error);
          });
        });
      }
    }, {
      key: "loadQuestions",
      value: function loadQuestions() {
        var _this2 = this;
        return new Promise(function (resolve, reject) {
          BX.ajax.runAction('up:quiz.question.getQuestions', {
            data: {
              quizId: _this2.quizId
            }
          }).then(function (response) {
            var questions = response.data.questions;
            resolve(questions);
          })["catch"](function (error) {
            console.error(error);
            reject(error);
          });
        });
      }
    }, {
      key: "reload",
      value: function reload() {
        var _this3 = this;
        this.loadQuiz().then(function (quiz) {
          _this3.quiz = quiz;
          _this3.loadQuestions().then(function (questions) {
            _this3.questions = questions;
            if (_this3.questions.length === 0) {
              alert("todo вопросов нет");
              //this.reload();
            } else {
              _this3.currentQuestionId = _this3.questions[0].ID;
              _this3.loadQuestion(_this3.currentQuestionId).then(function (question) {
                _this3.question = question;
                _this3.render();
              });
            }
          });
        });
      }
    }, {
      key: "render",
      value: function render() {
        this.rootNode.innerHTML = "";
        var QuizHeroSection = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<section class=\"hero is-small is-primary\">\n\t\t\t\t<div class=\"hero-body\">\n\t\t\t\t\t<p class=\"title mb-0\">\n\t\t\t\t\t\t", "#", "\n\t\t\t\t\t</p>\n\t\t\t\t\t<button class=\"button\">\n\t\t\t\t\t\t<i class=\"fa-solid fa-qrcode\"></i>\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t"])), this.quiz.TITLE, this.quiz.CODE);
        this.rootNode.appendChild(QuizHeroSection);
        var QuizResultContent = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"box\">\n\t\t\t\t<div class=\"columns\">\n\t\t\t\t\t<div class=\"column is-one-quarter question-list\">\n\t\t\t\t\t\t<div class=\"question-list__title has-text-weight-semibold has-text-centered is-uppercase\">\u0412\u043E\u043F\u0440\u043E\u0441</div>\n\t\t\t\t\t\t", "\n\t\t\t\t\t</div>\n\t\t\t\t\t\t", "\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), this.getQuestionsListNode(), this.getQuestionResultNode());
        this.rootNode.appendChild(QuizResultContent);
        this.connectChart();
      }
    }, {
      key: "getQuestionsListNode",
      value: function getQuestionsListNode() {
        var _this4 = this;
        var QuestionListNode = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["<div class=\"question-list__questions\"></div>"])));
        this.questions.forEach(function (question) {
          var QuestionNode = main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["<a class=\"question-list__question button\">", "</a>"])), question.QUESTION_TEXT);
          QuestionNode.onclick = function () {
            _this4.renderQuestionResult(+question.ID);
          };
          QuestionListNode.appendChild(QuestionNode);
        });
        var testButton = main_core.Tag.render(_templateObject5 || (_templateObject5 = babelHelpers.taggedTemplateLiteral(["<button id=\"testButton\">\u0422\u0415\u0421\u0422\u041E\u0412\u0410\u042F \u041A\u041D\u041E\u041F\u041A\u0410 \u041F\u041E\u041A\u0410 \u0427\u0422\u041E!</button>>"])));
        QuestionListNode.appendChild(testButton);
        return QuestionListNode;
      }
    }, {
      key: "getQuestionResultNode",
      value: function getQuestionResultNode() {
        return main_core.Tag.render(_templateObject6 || (_templateObject6 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\" column is-three-quarters statistics\" id=\"questionResult\">\n\t\t\t\t<div class=\"statistics__title has-text-weight-semibold has-text-centered is-uppercase\">\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430</div>\n\t\t\t\t<div class=\"statistics__question-title\">\n\t\t\t\t\t<strong>\u0412\u043E\u043F\u0440\u043E\u0441 : </strong>\n\t\t\t\t\t", "\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<canvas id=\"chart\"></canvas>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), this.question.QUESTION_TEXT);
      }
    }, {
      key: "connectChart",
      value: function connectChart() {
        var _this5 = this;
        var chartNode = document.getElementById('chart');
        this.chart = new Chart(chartNode, {
          type: 'bar',
          data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
              label: this.question.QUESTION_TEXT,
              data: [12, 19, 3, 5, 2, 3],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
        document.getElementById('testButton').onclick = function () {
          _this5.loadAnswers(_this5.chart);
        };
      } //update ResultNode
    }, {
      key: "renderQuestionResult",
      value: function renderQuestionResult(questionId) {
        var _this6 = this;
        this.loadQuestion(questionId).then(function (question) {
          _this6.question = question;
          document.getElementById('questionResult').replaceWith(_this6.getQuestionResultNode());
          _this6.connectChart();
        });
      }
    }, {
      key: "loadAnswers",
      value: function loadAnswers() {
        var _this7 = this;
        BX.ajax.runAction('up:quiz.answer.getAnswers', {
          data: {
            questionId: this.currentQuestionId
          }
        }).then(function (response) {
          _this7.answers = response.data;
          _this7.updateChart(_this7.chart);
        })["catch"](function (error) {
          console.error(error);
        });
      }
    }, {
      key: "updateChart",
      value: function updateChart(chart) {
        var labels = [];
        var counts = [];
        for (var i = 0; i < this.answers.length; i++) {
          labels[i] = this.answers[i].ANSWER;
          counts[i] = this.answers[i].COUNT;
        }
        console.log(labels);
        console.log(counts);
        chart.data.labels = labels;
        chart.data.datasets[0].data = counts;
        chart.update();
      }
    }]);
    return QuizShow;
  }();

  exports.QuizShow = QuizShow;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
