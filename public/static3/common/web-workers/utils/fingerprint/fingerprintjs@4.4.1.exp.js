// NOTE: See also https://github.com/fingerprintjs/fingerprintjs

const fpjs = (() => {
  const document = self
  const window = self

  // const __msgs = []
  // for (const key in window.navigator) {
  //   __msgs.push('--')
  //   __msgs.push(key)
  //   __msgs.push(window.navigator[key])
  //   __msgs.push('-')
  // }
  // log({ label: 'window.navigator', msgs: [__msgs] })

  var n = function () {
    return (
        (n =
            Object.assign ||
            function (n) {
                for (var e, t = 1, r = arguments.length; t < r; t++) for (var o in (e = arguments[t])) Object.prototype.hasOwnProperty.call(e, o) && (n[o] = e[o]);
                return n;
            }),
        n.apply(this, arguments)
    );
  };
  function e(n, e, t, r) {
    return new (t || (t = Promise))(function (o, i) {
        function a(n) {
            try {
                u(r.next(n));
            } catch (e) {
                i(e);
            }
        }
        function c(n) {
            try {
                u(r.throw(n));
            } catch (e) {
                i(e);
            }
        }
        function u(n) {
            var e;
            n.done
                ? o(n.value)
                : ((e = n.value),
                  e instanceof t
                      ? e
                      : new t(function (n) {
                            n(e);
                        })).then(a, c);
        }
        u((r = r.apply(n, e || [])).next());
    });
  }
  function t(n, e) {
    var t,
        r,
        o,
        i,
        a = {
            label: 0,
            sent: function () {
                if (1 & o[0]) throw o[1];
                return o[1];
            },
            trys: [],
            ops: [],
        };
    return (
        (i = { next: c(0), throw: c(1), return: c(2) }),
        "function" == typeof Symbol &&
            (i[Symbol.iterator] = function () {
                return this;
            }),
        i
    );
    function c(c) {
        return function (u) {
            return (function (c) {
                if (t) throw new TypeError("Generator is already executing.");
                for (; i && ((i = 0), c[0] && (a = 0)), a; )
                    try {
                        if (((t = 1), r && (o = 2 & c[0] ? r.return : c[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, c[1])).done)) return o;
                        switch (((r = 0), o && (c = [2 & c[0], o.value]), c[0])) {
                            case 0:
                            case 1:
                                o = c;
                                break;
                            case 4:
                                return a.label++, { value: c[1], done: !1 };
                            case 5:
                                a.label++, (r = c[1]), (c = [0]);
                                continue;
                            case 7:
                                (c = a.ops.pop()), a.trys.pop();
                                continue;
                            default:
                                if (!((o = a.trys), (o = o.length > 0 && o[o.length - 1]) || (6 !== c[0] && 2 !== c[0]))) {
                                    a = 0;
                                    continue;
                                }
                                if (3 === c[0] && (!o || (c[1] > o[0] && c[1] < o[3]))) {
                                    a.label = c[1];
                                    break;
                                }
                                if (6 === c[0] && a.label < o[1]) {
                                    (a.label = o[1]), (o = c);
                                    break;
                                }
                                if (o && a.label < o[2]) {
                                    (a.label = o[2]), a.ops.push(c);
                                    break;
                                }
                                o[2] && a.ops.pop(), a.trys.pop();
                                continue;
                        }
                        c = e.call(n, a);
                    } catch (u) {
                        (c = [6, u]), (r = 0);
                    } finally {
                        t = o = 0;
                    }
                if (5 & c[0]) throw c[1];
                return { value: c[0] ? c[1] : void 0, done: !0 };
            })([c, u]);
        };
    }
  }
  function r(n, e, t) {
    if (t || 2 === arguments.length) for (var r, o = 0, i = e.length; o < i; o++) (!r && o in e) || (r || (r = Array.prototype.slice.call(e, 0, o)), (r[o] = e[o]));
    return n.concat(r || Array.prototype.slice.call(e));
  }
  function o(n, e) {
    return new Promise(function (t) {
        return setTimeout(t, n, e);
    });
  }
  function i() {
    return o(0);
  }
  function a(n) {
    return !!n && "function" == typeof n.then;
  }
  function c(n, e) {
    try {
        var t = n();
        a(t)
            ? t.then(
                  function (n) {
                      return e(!0, n);
                  },
                  function (n) {
                      return e(!1, n);
                  }
              )
            : e(!0, t);
    } catch (r) {
        e(!1, r);
    }
  }
  function u(n, r, i) {
    return (
        void 0 === i && (i = 16),
        e(this, void 0, void 0, function () {
            var e, a, c, u;
            return t(this, function (t) {
                switch (t.label) {
                    case 0:
                        (e = Array(n.length)), (a = Date.now()), (c = 0), (t.label = 1);
                    case 1:
                        return c < n.length ? ((e[c] = r(n[c], c)), (u = Date.now()) >= a + i ? ((a = u), [4, o(0)]) : [3, 3]) : [3, 4];
                    case 2:
                        t.sent(), (t.label = 3);
                    case 3:
                        return ++c, [3, 1];
                    case 4:
                        return [2, e];
                }
            });
        })
    );
  }
  function l(n) {
    n.then(void 0, function () {});
  }
  function s(n) {
    return parseInt(n);
  }
  function d(n) {
    return parseFloat(n);
  }
  function f(n, e) {
    return "number" == typeof n && isNaN(n) ? e : n;
  }
  function m(n) {
    return n.reduce(function (n, e) {
        return n + (e ? 1 : 0);
    }, 0);
  }
  function v(n, e) {
    if ((void 0 === e && (e = 1), Math.abs(e) >= 1)) return Math.round(n / e) * e;
    var t = 1 / e;
    return Math.round(n * t) / t;
  }
  function h(n, e) {
    var t = n[0] >>> 16,
        r = 65535 & n[0],
        o = n[1] >>> 16,
        i = 65535 & n[1],
        a = e[0] >>> 16,
        c = 65535 & e[0],
        u = e[1] >>> 16,
        l = 0,
        s = 0,
        d = 0,
        f = 0;
    (d += (f += i + (65535 & e[1])) >>> 16), (f &= 65535), (s += (d += o + u) >>> 16), (d &= 65535), (l += (s += r + c) >>> 16), (s &= 65535), (l += t + a), (l &= 65535), (n[0] = (l << 16) | s), (n[1] = (d << 16) | f);
  }
  function p(n, e) {
    var t = n[0] >>> 16,
        r = 65535 & n[0],
        o = n[1] >>> 16,
        i = 65535 & n[1],
        a = e[0] >>> 16,
        c = 65535 & e[0],
        u = e[1] >>> 16,
        l = 65535 & e[1],
        s = 0,
        d = 0,
        f = 0,
        m = 0;
    (f += (m += i * l) >>> 16),
        (m &= 65535),
        (d += (f += o * l) >>> 16),
        (f &= 65535),
        (d += (f += i * u) >>> 16),
        (f &= 65535),
        (s += (d += r * l) >>> 16),
        (d &= 65535),
        (s += (d += o * u) >>> 16),
        (d &= 65535),
        (s += (d += i * c) >>> 16),
        (d &= 65535),
        (s += t * l + r * u + o * c + i * a),
        (s &= 65535),
        (n[0] = (s << 16) | d),
        (n[1] = (f << 16) | m);
  }
  function b(n, e) {
    var t = n[0];
    32 === (e %= 64)
        ? ((n[0] = n[1]), (n[1] = t))
        : e < 32
        ? ((n[0] = (t << e) | (n[1] >>> (32 - e))), (n[1] = (n[1] << e) | (t >>> (32 - e))))
        : ((e -= 32), (n[0] = (n[1] << e) | (t >>> (32 - e))), (n[1] = (t << e) | (n[1] >>> (32 - e))));
  }
  function y(n, e) {
    0 !== (e %= 64) && (e < 32 ? ((n[0] = n[1] >>> (32 - e)), (n[1] = n[1] << e)) : ((n[0] = n[1] << (e - 32)), (n[1] = 0)));
  }
  function g(n, e) {
    (n[0] ^= e[0]), (n[1] ^= e[1]);
  }
  var w = [4283543511, 3981806797],
    L = [3301882366, 444984403];
  function k(n) {
    var e = [0, n[0] >>> 1];
    g(n, e), p(n, w), (e[1] = n[0] >>> 1), g(n, e), p(n, L), (e[1] = n[0] >>> 1), g(n, e);
  }
  var V = [2277735313, 289559509],
    S = [1291169091, 658871167],
    W = [0, 5],
    Z = [0, 1390208809],
    x = [0, 944331445];
  function M(n, e) {
    var t = (function (n) {
        for (var e = new Uint8Array(n.length), t = 0; t < n.length; t++) {
            var r = n.charCodeAt(t);
            if (r > 127) return new TextEncoder().encode(n);
            e[t] = r;
        }
        return e;
    })(n);
    e = e || 0;
    var r,
        o = [0, t.length],
        i = o[1] % 16,
        a = o[1] - i,
        c = [0, e],
        u = [0, e],
        l = [0, 0],
        s = [0, 0];
    for (r = 0; r < a; r += 16)
        (l[0] = t[r + 4] | (t[r + 5] << 8) | (t[r + 6] << 16) | (t[r + 7] << 24)),
            (l[1] = t[r] | (t[r + 1] << 8) | (t[r + 2] << 16) | (t[r + 3] << 24)),
            (s[0] = t[r + 12] | (t[r + 13] << 8) | (t[r + 14] << 16) | (t[r + 15] << 24)),
            (s[1] = t[r + 8] | (t[r + 9] << 8) | (t[r + 10] << 16) | (t[r + 11] << 24)),
            p(l, V),
            b(l, 31),
            p(l, S),
            g(c, l),
            b(c, 27),
            h(c, u),
            p(c, W),
            h(c, Z),
            p(s, S),
            b(s, 33),
            p(s, V),
            g(u, s),
            b(u, 31),
            h(u, c),
            p(u, W),
            h(u, x);
    (l[0] = 0), (l[1] = 0), (s[0] = 0), (s[1] = 0);
    var d = [0, 0];
    switch (i) {
        case 15:
            (d[1] = t[r + 14]), y(d, 48), g(s, d);
        case 14:
            (d[1] = t[r + 13]), y(d, 40), g(s, d);
        case 13:
            (d[1] = t[r + 12]), y(d, 32), g(s, d);
        case 12:
            (d[1] = t[r + 11]), y(d, 24), g(s, d);
        case 11:
            (d[1] = t[r + 10]), y(d, 16), g(s, d);
        case 10:
            (d[1] = t[r + 9]), y(d, 8), g(s, d);
        case 9:
            (d[1] = t[r + 8]), g(s, d), p(s, S), b(s, 33), p(s, V), g(u, s);
        case 8:
            (d[1] = t[r + 7]), y(d, 56), g(l, d);
        case 7:
            (d[1] = t[r + 6]), y(d, 48), g(l, d);
        case 6:
            (d[1] = t[r + 5]), y(d, 40), g(l, d);
        case 5:
            (d[1] = t[r + 4]), y(d, 32), g(l, d);
        case 4:
            (d[1] = t[r + 3]), y(d, 24), g(l, d);
        case 3:
            (d[1] = t[r + 2]), y(d, 16), g(l, d);
        case 2:
            (d[1] = t[r + 1]), y(d, 8), g(l, d);
        case 1:
            (d[1] = t[r]), g(l, d), p(l, V), b(l, 31), p(l, S), g(c, l);
    }
    return (
        g(c, o),
        g(u, o),
        h(c, u),
        h(u, c),
        k(c),
        k(u),
        h(c, u),
        h(u, c),
        ("00000000" + (c[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (c[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (u[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (u[1] >>> 0).toString(16)).slice(-8)
    );
  }
  function R(n) {
    return "function" != typeof n;
  }
  function G(n, r, o) {
    var i = Object.keys(n).filter(function (n) {
            return !(function (n, e) {
                for (var t = 0, r = n.length; t < r; ++t) if (n[t] === e) return !0;
                return !1;
            })(o, n);
        }),
        a = u(i, function (e) {
            return (function (n, e) {
                var t = new Promise(function (t) {
                    var r = Date.now();
                    c(n.bind(null, e), function () {
                        for (var n = [], e = 0; e < arguments.length; e++) n[e] = arguments[e];
                        var o = Date.now() - r;
                        if (!n[0])
                            return t(function () {
                                return { error: n[1], duration: o };
                            });
                        var i = n[1];
                        if (R(i))
                            return t(function () {
                                return { value: i, duration: o };
                            });
                        t(function () {
                            return new Promise(function (n) {
                                var e = Date.now();
                                c(i, function () {
                                    for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
                                    var i = o + Date.now() - e;
                                    if (!t[0]) return n({ error: t[1], duration: i });
                                    n({ value: t[1], duration: i });
                                });
                            });
                        });
                    });
                });
                return (
                    l(t),
                    function () {
                        return t.then(function (n) {
                            return n();
                        });
                    }
                );
            })(n[e], r);
        });
    return (
        l(a),
        function () {
            return e(this, void 0, void 0, function () {
                var n, e, r, o;
                return t(this, function (t) {
                    switch (t.label) {
                        case 0:
                            return [4, a];
                        case 1:
                            return [
                                4,
                                u(t.sent(), function (n) {
                                    var e = n();
                                    return l(e), e;
                                }),
                            ];
                        case 2:
                            return (n = t.sent()), [4, Promise.all(n)];
                        case 3:
                            for (e = t.sent(), r = {}, o = 0; o < i.length; ++o) r[i[o]] = e[o];
                            return [2, r];
                    }
                });
            });
        }
    );
  }
  function F(n, e) {
    var t = function (n) {
        return R(n)
            ? e(n)
            : function () {
                  var t = n();
                  return a(t) ? t.then(e) : e(t);
              };
    };
    return function (e) {
        var r = n(e);
        return a(r) ? r.then(t) : t(r);
    };
  }
  function I() {
    var n = window,
        e = navigator;
    return m(["MSCSSMatrix" in n, "msSetImmediate" in n, "msIndexedDB" in n, "msMaxTouchPoints" in e, "msPointerEnabled" in e]) >= 4;
  }
  function Y() {
    var n = window,
        e = navigator;
    return m(["msWriteProfilerMark" in n, "MSStream" in n, "msLaunchUri" in e, "msSaveBlob" in e]) >= 3 && !I();
  }
  function isChromium() {
    var n = window,
        e = navigator;
    return m([
      "webkitPersistentStorage" in e,
      "webkitTemporaryStorage" in e,
      // 0 === e.vendor.indexOf("Google"),
      0 === e.product.indexOf("Google"),
      "webkitResolveLocalFileSystemURL" in n,
      "BatteryManager" in n,
      "webkitMediaStream" in n,
      "webkitSpeechGrammar" in n
    ]) >= 5; // NOTE: 5 for Browsers; 5 for Workers
  }
  function X() {
    var n = window,
        e = navigator;
    return m([
      "ApplePayError" in n,
      "CSSPrimitiveValue" in n,
      "Counter" in n,
      // 0 === e.vendor.indexOf("Apple"),
      0 === e.product.indexOf("Apple"),
      "getStorageUpdates" in e,
      "WebKitMediaKeys" in n
    ]) >= 4;
  }
  function isDesktopWebKit() {
    var n = window,
        e = n.HTMLElement,
        t = n.Document;
    return m(["safari" in n, !("ongestureend" in n), !("TouchEvent" in n), !("orientation" in n), e && !("autocapitalize" in e.prototype), t && "pointerLockElement" in t.prototype]) >= 4;
  }
  function C() {
    var n,
        e = window;
    return (n = e.print), !!/^function\s.*?\{\s*\[native code]\s*}$/.test(String(n)) && m(["[object WebPageNamespace]" === String(e.browser), "MicrodataExtractor" in e]) >= 1;
  }
  function isGecko() {
    var n,
        e,
        t = window;
    return (
        m([
            "buildID" in navigator,
            "MozAppearance" in (null !== (e = null === (n = document.documentElement) || void 0 === n ? void 0 : n.style) && void 0 !== e ? e : {}),
            "onmozfullscreenchange" in t,
            "mozInnerScreenX" in t,
            "CSSMozDocumentRule" in t,
            "CanvasCaptureMediaStream" in t,
            navigator.product === "Gecko",
        ]) >= 1 // NOTE: 4 for Browsers; 1 for Workers
    );
  }
  function H() {
    var n = window,
        e = navigator,
        t = n.CSS,
        r = n.HTMLButtonElement;
    return m([!("getStorageUpdates" in e), r && "popover" in r.prototype, "CSSCounterStyleRule" in n, t.supports("font-size-adjust: ex-height 0.5"), t.supports("text-transform: full-width")]) >= 4;
  }
  function A() {
    var n = document;
    return n.fullscreenElement || n.msFullscreenElement || n.mozFullScreenElement || n.webkitFullscreenElement || null;
  }
  function isAndroid() {
    var n = isChromium(),
        e = isGecko(),
        t = window,
        r = navigator,
        o = "connection";
    return n ? m([!("SharedWorker" in t), r[o] && "ontypechange" in r[o], !("sinkId" in new window.Audio())]) >= 2 : !!e && m(["onorientationchange" in t, "orientation" in t, /android/i.test(navigator.appVersion)]) >= 2;
  }
  function J() {
    var n = window,
        e = n.OfflineAudioContext || n.webkitOfflineAudioContext;
    if (!e) return -2;
    if (
        X() &&
        !isDesktopWebKit() &&
        !(function () {
            var n = window;
            return m(["DOMRectList" in n, "RTCPeerConnectionIceEvent" in n, "SVGGeometryElement" in n, "ontransitioncancel" in n]) >= 3;
        })()
    )
        return -1;
    var t = new e(1, 5e3, 44100),
        r = t.createOscillator();
    (r.type = "triangle"), (r.frequency.value = 1e4);
    var o = t.createDynamicsCompressor();
    (o.threshold.value = -50), (o.knee.value = 40), (o.ratio.value = 12), (o.attack.value = 0), (o.release.value = 0.25), r.connect(o), o.connect(t.destination), r.start(0);
    var i = (function (n) {
            var e = 3,
                t = 500,
                r = 500,
                o = 5e3,
                i = function () {};
            return [
                new Promise(function (c, u) {
                    var s = !1,
                        d = 0,
                        f = 0;
                    n.oncomplete = function (n) {
                        return c(n.renderedBuffer);
                    };
                    var m = function () {
                            setTimeout(function () {
                                return u(T("timeout"));
                            }, Math.min(r, f + o - Date.now()));
                        },
                        v = function () {
                            try {
                                var r = n.startRendering();
                                switch ((a(r) && l(r), n.state)) {
                                    case "running":
                                        (f = Date.now()), s && m();
                                        break;
                                    case "suspended":
                                        document.hidden || d++, s && d >= e ? u(T("suspended")) : setTimeout(v, t);
                                }
                            } catch (o) {
                                u(o);
                            }
                        };
                    v(),
                        (i = function () {
                            s || ((s = !0), f > 0 && m());
                        });
                }),
                i,
            ];
        })(t),
        c = i[0],
        u = i[1],
        s = c.then(
            function (n) {
                return (function (n) {
                    for (var e = 0, t = 0; t < n.length; ++t) e += Math.abs(n[t]);
                    return e;
                })(n.getChannelData(0).subarray(4500));
            },
            function (n) {
                if ("timeout" === n.name || "suspended" === n.name) return -3;
                throw n;
            }
        );
    return (
        l(s),
        function () {
            return u(), s;
        }
    );
  }
  function T(n) {
    var e = new Error(n);
    return (e.name = n), e;
  }
  function D(n, r, i) {
    var a, c, u;
    return (
        void 0 === i && (i = 50),
        e(this, void 0, void 0, function () {
            var e, l;
            return t(this, function (t) {
                switch (t.label) {
                    case 0:
                        (e = document), (t.label = 1);
                    case 1:
                        return e.body ? [3, 3] : [4, o(i)];
                    case 2:
                        return t.sent(), [3, 1];
                    case 3:
                        (l = e.createElement("iframe")), (t.label = 4);
                    case 4:
                        return (
                            t.trys.push([4, , 10, 11]),
                            [
                                4,
                                new Promise(function (n, t) {
                                    var o = !1,
                                        i = function () {
                                            (o = !0), n();
                                        };
                                    (l.onload = i),
                                        (l.onerror = function (n) {
                                            (o = !0), t(n);
                                        });
                                    var a = l.style;
                                    a.setProperty("display", "block", "important"),
                                        (a.position = "absolute"),
                                        (a.top = "0"),
                                        (a.left = "0"),
                                        (a.visibility = "hidden"),
                                        r && "srcdoc" in l ? (l.srcdoc = r) : (l.src = "about:blank"),
                                        e.body.appendChild(l);
                                    var c = function () {
                                        var n, e;
                                        o || ("complete" === (null === (e = null === (n = l.contentWindow) || void 0 === n ? void 0 : n.document) || void 0 === e ? void 0 : e.readyState) ? i() : setTimeout(c, 10));
                                    };
                                    c();
                                }),
                            ]
                        );
                    case 5:
                        t.sent(), (t.label = 6);
                    case 6:
                        return (null === (c = null === (a = l.contentWindow) || void 0 === a ? void 0 : a.document) || void 0 === c ? void 0 : c.body) ? [3, 8] : [4, o(i)];
                    case 7:
                        return t.sent(), [3, 6];
                    case 8:
                        return [4, n(l, l.contentWindow)];
                    case 9:
                        return [2, t.sent()];
                    case 10:
                        return null === (u = l.parentNode) || void 0 === u || u.removeChild(l), [7];
                    case 11:
                        return [2];
                }
            });
        })
    );
  }
  function _(n) {
    for (
        var e = (function (n) {
                for (
                    var e,
                        t,
                        r = "Unexpected syntax '".concat(n, "'"),
                        o = /^\s*([a-z-]*)(.*)$/i.exec(n),
                        i = o[1] || void 0,
                        a = {},
                        c = /([.:#][\w-]+|\[.+?\])/gi,
                        u = function (n, e) {
                            (a[n] = a[n] || []), a[n].push(e);
                        };
                    ;

                ) {
                    var l = c.exec(o[2]);
                    if (!l) break;
                    var s = l[0];
                    switch (s[0]) {
                        case ".":
                            u("class", s.slice(1));
                            break;
                        case "#":
                            u("id", s.slice(1));
                            break;
                        case "[":
                            var d = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(s);
                            if (!d) throw new Error(r);
                            u(d[1], null !== (t = null !== (e = d[4]) && void 0 !== e ? e : d[5]) && void 0 !== t ? t : "");
                            break;
                        default:
                            throw new Error(r);
                    }
                }
                return [i, a];
            })(n),
            t = e[0],
            r = e[1],
            o = document.createElement(null != t ? t : "div"),
            i = 0,
            a = Object.keys(r);
        i < a.length;
        i++
    ) {
        var c = a[i],
            u = r[c].join(" ");
        "style" === c ? z(o.style, u) : o.setAttribute(c, u);
    }
    return o;
  }
  function z(n, e) {
    for (var t = 0, r = e.split(";"); t < r.length; t++) {
        var o = r[t],
            i = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(o);
        if (i) {
            var a = i[1],
                c = i[2],
                u = i[4];
            n.setProperty(a, c, u || "");
        }
    }
  }
  var B = ["monospace", "sans-serif", "serif"],
    O = [
        "sans-serif-thin",
        "ARNO PRO",
        "Agency FB",
        "Arabic Typesetting",
        "Arial Unicode MS",
        "AvantGarde Bk BT",
        "BankGothic Md BT",
        "Batang",
        "Bitstream Vera Sans Mono",
        "Calibri",
        "Century",
        "Century Gothic",
        "Clarendon",
        "EUROSTILE",
        "Franklin Gothic",
        "Futura Bk BT",
        "Futura Md BT",
        "GOTHAM",
        "Gill Sans",
        "HELV",
        "Haettenschweiler",
        "Helvetica Neue",
        "Humanst521 BT",
        "Leelawadee",
        "Letter Gothic",
        "Levenim MT",
        "Lucida Bright",
        "Lucida Sans",
        "Menlo",
        "MS Mincho",
        "MS Outlook",
        "MS Reference Specialty",
        "MS UI Gothic",
        "MT Extra",
        "MYRIAD PRO",
        "Marlett",
        "Meiryo UI",
        "Microsoft Uighur",
        "Minion Pro",
        "Monotype Corsiva",
        "PMingLiU",
        "Pristina",
        "SCRIPTINA",
        "Segoe UI Light",
        "Serifa",
        "SimHei",
        "Small Fonts",
        "Staccato222 BT",
        "TRAJAN PRO",
        "Univers CE 55 Medium",
        "Vrinda",
        "ZWAdobeF",
    ];
  function U(n) {
    return e(this, void 0, void 0, function () {
        var e, r, o, i, a, c, u;
        return t(this, function (t) {
            switch (t.label) {
                case 0:
                    return (
                        (e = !1),
                        (i = (function () {
                            var n = document.createElement("canvas");
                            return (n.width = 1), (n.height = 1), [n, n.getContext("2d")];
                        })()),
                        (a = i[0]),
                        (c = i[1]),
                        (function (n, e) {
                            return !(!e || !n.toDataURL);
                        })(a, c)
                            ? [3, 1]
                            : ((r = o = "unsupported"), [3, 4])
                    );
                case 1:
                    return (
                        (e = (function (n) {
                            return n.rect(0, 0, 10, 10), n.rect(2, 2, 6, 6), !n.isPointInPath(5, 5, "evenodd");
                        })(c)),
                        n ? ((r = o = "skipped"), [3, 4]) : [3, 2]
                    );
                case 2:
                    return [4, Q(a, c)];
                case 3:
                    (u = t.sent()), (r = u[0]), (o = u[1]), (t.label = 4);
                case 4:
                    return [2, { winding: e, geometry: r, text: o }];
            }
        });
    });
  }
  function Q(n, r) {
    return e(this, void 0, void 0, function () {
        var e, o;
        return t(this, function (t) {
            switch (t.label) {
                case 0:
                    return (
                        (function (n, e) {
                            (n.width = 240), (n.height = 60), (e.textBaseline = "alphabetic"), (e.fillStyle = "#f60"), e.fillRect(100, 1, 62, 20), (e.fillStyle = "#069"), (e.font = '11pt "Times New Roman"');
                            var t = "Cwm fjordbank gly ".concat(String.fromCharCode(55357, 56835));
                            e.fillText(t, 2, 15), (e.fillStyle = "rgba(102, 204, 0, 0.2)"), (e.font = "18pt Arial"), e.fillText(t, 4, 45);
                        })(n, r),
                        [4, i()]
                    );
                case 1:
                    return (
                        t.sent(),
                        (e = K(n)),
                        (o = K(n)),
                        e !== o
                            ? [2, ["unstable", "unstable"]]
                            : ((function (n, e) {
                                  (n.width = 122), (n.height = 110), (e.globalCompositeOperation = "multiply");
                                  for (
                                      var t = 0,
                                          r = [
                                              ["#f2f", 40, 40],
                                              ["#2ff", 80, 40],
                                              ["#ff2", 60, 80],
                                          ];
                                      t < r.length;
                                      t++
                                  ) {
                                      var o = r[t],
                                          i = o[0],
                                          a = o[1],
                                          c = o[2];
                                      (e.fillStyle = i), e.beginPath(), e.arc(a, c, 40, 0, 2 * Math.PI, !0), e.closePath(), e.fill();
                                  }
                                  (e.fillStyle = "#f9c"), e.arc(60, 60, 60, 0, 2 * Math.PI, !0), e.arc(60, 60, 20, 0, 2 * Math.PI, !0), e.fill("evenodd");
                              })(n, r),
                              [4, i()])
                    );
                case 2:
                    return t.sent(), [2, [K(n), e]];
            }
        });
    });
  }
  function K(n) {
    return n.toDataURL();
  }
  function q() {
    var n = screen,
        e = function (n) {
            return f(s(n), null);
        },
        t = [e(n.width), e(n.height)];
    return t.sort().reverse(), t;
  }
  var $, nn;
  function en() {
    var n = this;
    return (
        (function () {
            if (void 0 === nn) {
                var n = function () {
                    var e = tn();
                    rn(e) ? (nn = setTimeout(n, 2500)) : (($ = e), (nn = void 0));
                };
                n();
            }
        })(),
        function () {
            return e(n, void 0, void 0, function () {
                var n;
                return t(this, function (e) {
                    switch (e.label) {
                        case 0:
                            return rn((n = tn())) ? ($ ? [2, r([], $, !0)] : A() ? [4, ((t = document), (t.exitFullscreen || t.msExitFullscreen || t.mozCancelFullScreen || t.webkitExitFullscreen).call(t))] : [3, 2]) : [3, 2];
                        case 1:
                            e.sent(), (n = tn()), (e.label = 2);
                        case 2:
                            return rn(n) || ($ = n), [2, n];
                    }
                    var t;
                });
            });
        }
    );
  }
  function tn() {
    var n = screen;
    return [f(d(n.availTop), null), f(d(n.width) - d(n.availWidth) - f(d(n.availLeft), 0), null), f(d(n.height) - d(n.availHeight) - f(d(n.availTop), 0), null), f(d(n.availLeft), null)];
  }
  function rn(n) {
    for (var e = 0; e < 4; ++e) if (n[e]) return !1;
    return !0;
  }
  function on(n) {
    var r;
    return e(this, void 0, void 0, function () {
        var e, a, c, u, l, s, d;
        return t(this, function (t) {
            switch (t.label) {
                case 0:
                    for (e = document, a = e.createElement("div"), c = new Array(n.length), u = {}, an(a), d = 0; d < n.length; ++d)
                        "DIALOG" === (l = _(n[d])).tagName && l.show(), an((s = e.createElement("div"))), s.appendChild(l), a.appendChild(s), (c[d] = l);
                    t.label = 1;
                case 1:
                    return e.body ? [3, 3] : [4, o(50)];
                case 2:
                    return t.sent(), [3, 1];
                case 3:
                    return e.body.appendChild(a), [4, i()];
                case 4:
                    t.sent();
                    try {
                        for (d = 0; d < n.length; ++d) c[d].offsetParent || (u[n[d]] = !0);
                    } finally {
                        null === (r = a.parentNode) || void 0 === r || r.removeChild(a);
                    }
                    return [2, u];
            }
        });
    });
  }
  function an(n) {
    n.style.setProperty("visibility", "hidden", "important"), n.style.setProperty("display", "block", "important");
  }
  function cn(n) {
    return matchMedia("(inverted-colors: ".concat(n, ")")).matches;
  }
  function un(n) {
    return matchMedia("(forced-colors: ".concat(n, ")")).matches;
  }
  function ln(n) {
    return matchMedia("(prefers-contrast: ".concat(n, ")")).matches;
  }
  function sn(n) {
    return matchMedia("(prefers-reduced-motion: ".concat(n, ")")).matches;
  }
  function dn(n) {
    return matchMedia("(prefers-reduced-transparency: ".concat(n, ")")).matches;
  }
  function fn(n) {
    return matchMedia("(dynamic-range: ".concat(n, ")")).matches;
  }
  var mn = Math,
    vn = function () {
        return 0;
    };
  var hn = {
    default: [],
    apple: [{ font: "-apple-system-body" }],
    serif: [{ fontFamily: "serif" }],
    sans: [{ fontFamily: "sans-serif" }],
    mono: [{ fontFamily: "monospace" }],
    min: [{ fontSize: "1px" }],
    system: [{ fontFamily: "system-ui" }],
  };
  var pn = new Set([
        10752,
        2849,
        2884,
        2885,
        2886,
        2928,
        2929,
        2930,
        2931,
        2932,
        2960,
        2961,
        2962,
        2963,
        2964,
        2965,
        2966,
        2967,
        2968,
        2978,
        3024,
        3042,
        3088,
        3089,
        3106,
        3107,
        32773,
        32777,
        32777,
        32823,
        32824,
        32936,
        32937,
        32938,
        32939,
        32968,
        32969,
        32970,
        32971,
        3317,
        33170,
        3333,
        3379,
        3386,
        33901,
        33902,
        34016,
        34024,
        34076,
        3408,
        3410,
        3411,
        3412,
        3413,
        3414,
        3415,
        34467,
        34816,
        34817,
        34818,
        34819,
        34877,
        34921,
        34930,
        35660,
        35661,
        35724,
        35738,
        35739,
        36003,
        36004,
        36005,
        36347,
        36348,
        36349,
        37440,
        37441,
        37443,
        7936,
        7937,
        7938,
    ]),
    bn = new Set([34047, 35723, 36063, 34852, 34853, 34854, 34229, 36392, 36795, 38449]),
    yn = ["FRAGMENT_SHADER", "VERTEX_SHADER"],
    gn = ["LOW_FLOAT", "MEDIUM_FLOAT", "HIGH_FLOAT", "LOW_INT", "MEDIUM_INT", "HIGH_INT"];
  function wn(n) {
    if (n.webgl) return n.webgl.context;
    var e,
        t = document.createElement("canvas");
    t.addEventListener("webglCreateContextError", function () {
        return (e = void 0);
    });
    for (var r = 0, o = ["webgl", "experimental-webgl"]; r < o.length; r++) {
        var i = o[r];
        try {
            e = t.getContext(i);
        } catch (a) {}
        if (e) break;
    }
    return (n.webgl = { context: e }), e;
  }
  function Ln(n, e, t) {
    var r = n.getShaderPrecisionFormat(n[e], n[t]);
    return r ? [r.rangeMin, r.rangeMax, r.precision] : [];
  }
  function kn(n) {
    return Object.keys(n.__proto__).filter(Vn);
  }
  function Vn(n) {
    return "string" == typeof n && !n.match(/[^A-Z0-9_x]/);
  }
  function Sn() {
    return isGecko();
  }
  function Wn(n) {
    return "function" == typeof n.getParameter;
  }
  var sources = {
    fonts: function () {
        var n = this;
        return D(function (r, o) {
            var a = o.document;
            return e(n, void 0, void 0, function () {
                var n, e, r, o, c, u, l, s, d, f, m;
                return t(this, function (t) {
                    switch (t.label) {
                        case 0:
                            return (
                                ((n = a.body).style.fontSize = "48px"),
                                (e = a.createElement("div")).style.setProperty("visibility", "hidden", "important"),
                                (r = {}),
                                (o = {}),
                                (c = function (n) {
                                    var t = a.createElement("span"),
                                        r = t.style;
                                    return (r.position = "absolute"), (r.top = "0"), (r.left = "0"), (r.fontFamily = n), (t.textContent = "mmMwWLliI0O&1"), e.appendChild(t), t;
                                }),
                                (u = function (n, e) {
                                    return c("'".concat(n, "',").concat(e));
                                }),
                                (l = function () {
                                    for (
                                        var n = {},
                                            e = function (e) {
                                                n[e] = B.map(function (n) {
                                                    return u(e, n);
                                                });
                                            },
                                            t = 0,
                                            r = O;
                                        t < r.length;
                                        t++
                                    ) {
                                        e(r[t]);
                                    }
                                    return n;
                                }),
                                (s = function (n) {
                                    return B.some(function (e, t) {
                                        return n[t].offsetWidth !== r[e] || n[t].offsetHeight !== o[e];
                                    });
                                }),
                                (d = (function () {
                                    return B.map(c);
                                })()),
                                (f = l()),
                                n.appendChild(e),
                                [4, i()]
                            );
                        case 1:
                            for (t.sent(), m = 0; m < B.length; m++) (r[B[m]] = d[m].offsetWidth), (o[B[m]] = d[m].offsetHeight);
                            return [
                                2,
                                O.filter(function (n) {
                                    return s(f[n]);
                                }),
                            ];
                    }
                });
            });
        });
    },
    domBlockers: function (n) {
        var r = (void 0 === n ? {} : n).debug;
        return e(this, void 0, void 0, function () {
            var n, e, o, i, a;
            return t(this, function (t) {
                switch (t.label) {
                    case 0:
                        return X() || isAndroid()
                            ? ((c = atob),
                              (n = {
                                  abpIndo: ["#Iklan-Melayang", "#Kolom-Iklan-728", "#SidebarIklan-wrapper", '[title="ALIENBOLA" i]', c("I0JveC1CYW5uZXItYWRz")],
                                  abpvn: [".quangcao", "#mobileCatfish", c("LmNsb3NlLWFkcw=="), '[id^="bn_bottom_fixed_"]', "#pmadv"],
                                  adBlockFinland: [".mainostila", c("LnNwb25zb3JpdA=="), ".ylamainos", c("YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd"), c("YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd")],
                                  adBlockPersian: ["#navbar_notice_50", ".kadr", 'TABLE[width="140px"]', "#divAgahi", c("YVtocmVmXj0iaHR0cDovL2cxLnYuZndtcm0ubmV0L2FkLyJd")],
                                  adBlockWarningRemoval: ["#adblock-honeypot", ".adblocker-root", ".wp_adblock_detect", c("LmhlYWRlci1ibG9ja2VkLWFk"), c("I2FkX2Jsb2NrZXI=")],
                                  adGuardAnnoyances: [".hs-sosyal", "#cookieconsentdiv", 'div[class^="app_gdpr"]', ".as-oil", '[data-cypress="soft-push-notification-modal"]'],
                                  adGuardBase: [".BetterJsPopOverlay", c("I2FkXzMwMFgyNTA="), c("I2Jhbm5lcmZsb2F0MjI="), c("I2NhbXBhaWduLWJhbm5lcg=="), c("I0FkLUNvbnRlbnQ=")],
                                  adGuardChinese: [c("LlppX2FkX2FfSA=="), c("YVtocmVmKj0iLmh0aGJldDM0LmNvbSJd"), "#widget-quan", c("YVtocmVmKj0iLzg0OTkyMDIwLnh5eiJd"), c("YVtocmVmKj0iLjE5NTZobC5jb20vIl0=")],
                                  adGuardFrench: ["#pavePub", c("LmFkLWRlc2t0b3AtcmVjdGFuZ2xl"), ".mobile_adhesion", ".widgetadv", c("LmFkc19iYW4=")],
                                  adGuardGerman: ['aside[data-portal-id="leaderboard"]'],
                                  adGuardJapanese: ["#kauli_yad_1", c("YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0="), c("Ll9wb3BJbl9pbmZpbml0ZV9hZA=="), c("LmFkZ29vZ2xl"), c("Ll9faXNib29zdFJldHVybkFk")],
                                  adGuardMobile: [c("YW1wLWF1dG8tYWRz"), c("LmFtcF9hZA=="), 'amp-embed[type="24smi"]', "#mgid_iframe1", c("I2FkX2ludmlld19hcmVh")],
                                  adGuardRussian: [c("YVtocmVmXj0iaHR0cHM6Ly9hZC5sZXRtZWFkcy5jb20vIl0="), c("LnJlY2xhbWE="), 'div[id^="smi2adblock"]', c("ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd"), "#psyduckpockeball"],
                                  adGuardSocial: [c("YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0="), c("YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0="), ".etsy-tweet", "#inlineShare", ".popup-social"],
                                  adGuardSpanishPortuguese: ["#barraPublicidade", "#Publicidade", "#publiEspecial", "#queTooltip", ".cnt-publi"],
                                  adGuardTrackingProtection: [
                                      "#qoo-counter",
                                      c("YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=="),
                                      c("YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0="),
                                      c("YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=="),
                                      "#top100counter",
                                  ],
                                  adGuardTurkish: [
                                      "#backkapat",
                                      c("I3Jla2xhbWk="),
                                      c("YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0="),
                                      c("YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd"),
                                      c("YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ=="),
                                  ],
                                  bulgarian: [c("dGQjZnJlZW5ldF90YWJsZV9hZHM="), "#ea_intext_div", ".lapni-pop-over", "#xenium_hot_offers"],
                                  easyList: [".yb-floorad", c("LndpZGdldF9wb19hZHNfd2lkZ2V0"), c("LnRyYWZmaWNqdW5reS1hZA=="), ".textad_headline", c("LnNwb25zb3JlZC10ZXh0LWxpbmtz")],
                                  easyListChina: [c("LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=="), c("LmZyb250cGFnZUFkdk0="), "#taotaole", "#aafoot.top_box", ".cfa_popup"],
                                  easyListCookie: [".ezmob-footer", ".cc-CookieWarning", "[data-cookie-number]", c("LmF3LWNvb2tpZS1iYW5uZXI="), ".sygnal24-gdpr-modal-wrap"],
                                  easyListCzechSlovak: ["#onlajny-stickers", c("I3Jla2xhbW5pLWJveA=="), c("LnJla2xhbWEtbWVnYWJvYXJk"), ".sklik", c("W2lkXj0ic2tsaWtSZWtsYW1hIl0=")],
                                  easyListDutch: [c("I2FkdmVydGVudGll"), c("I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=="), ".adstekst", c("YVtocmVmXj0iaHR0cHM6Ly94bHR1YmUubmwvY2xpY2svIl0="), "#semilo-lrectangle"],
                                  easyListGermany: ["#SSpotIMPopSlider", c("LnNwb25zb3JsaW5rZ3J1ZW4="), c("I3dlcmJ1bmdza3k="), c("I3Jla2xhbWUtcmVjaHRzLW1pdHRl"), c("YVtocmVmXj0iaHR0cHM6Ly9iZDc0Mi5jb20vIl0=")],
                                  easyListItaly: [
                                      c("LmJveF9hZHZfYW5udW5jaQ=="),
                                      ".sb-box-pubbliredazionale",
                                      c("YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd"),
                                      c("YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd"),
                                      c("YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ=="),
                                  ],
                                  easyListLithuania: [
                                      c("LnJla2xhbW9zX3RhcnBhcw=="),
                                      c("LnJla2xhbW9zX251b3JvZG9z"),
                                      c("aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd"),
                                      c("aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd"),
                                      c("aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd"),
                                  ],
                                  estonian: [c("QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==")],
                                  fanboyAnnoyances: ["#ac-lre-player", ".navigate-to-top", "#subscribe_popup", ".newsletter_holder", "#back-top"],
                                  fanboyAntiFacebook: [".util-bar-module-firefly-visible"],
                                  fanboyEnhancedTrackers: [".open.pushModal", "#issuem-leaky-paywall-articles-zero-remaining-nag", "#sovrn_container", 'div[class$="-hide"][zoompage-fontsize][style="display: block;"]', ".BlockNag__Card"],
                                  fanboySocial: ["#FollowUs", "#meteored_share", "#social_follow", ".article-sharer", ".community__social-desc"],
                                  frellwitSwedish: [c("YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=="), c("YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=="), "article.category-samarbete", c("ZGl2LmhvbGlkQWRz"), "ul.adsmodern"],
                                  greekAdBlock: [
                                      c("QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd"),
                                      c("QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=="),
                                      c("QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd"),
                                      "DIV.agores300",
                                      "TABLE.advright",
                                  ],
                                  hungarian: ["#cemp_doboz", ".optimonk-iframe-container", c("LmFkX19tYWlu"), c("W2NsYXNzKj0iR29vZ2xlQWRzIl0="), "#hirdetesek_box"],
                                  iDontCareAboutCookies: ['.alert-info[data-block-track*="CookieNotice"]', ".ModuleTemplateCookieIndicator", ".o--cookies--container", "#cookies-policy-sticky", "#stickyCookieBar"],
                                  icelandicAbp: [c("QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==")],
                                  latvian: [
                                      c("YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0OiA0MHB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0="),
                                      c("YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6IDMxcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ=="),
                                  ],
                                  listKr: [c("YVtocmVmKj0iLy9hZC5wbGFuYnBsdXMuY28ua3IvIl0="), c("I2xpdmVyZUFkV3JhcHBlcg=="), c("YVtocmVmKj0iLy9hZHYuaW1hZHJlcC5jby5rci8iXQ=="), c("aW5zLmZhc3R2aWV3LWFk"), ".revenue_unit_item.dable"],
                                  listeAr: [c("LmdlbWluaUxCMUFk"), ".right-and-left-sponsers", c("YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=="), c("YVtocmVmKj0iYm9vcmFxLm9yZyJd"), c("YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd")],
                                  listeFr: [
                                      c("YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=="),
                                      c("I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=="),
                                      c("YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0="),
                                      ".site-pub-interstitiel",
                                      'div[id^="crt-"][data-criteo-id]',
                                  ],
                                  officialPolish: [
                                      "#ceneo-placeholder-ceneo-12",
                                      c("W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd"),
                                      c("YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ=="),
                                      c("YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=="),
                                      c("ZGl2I3NrYXBpZWNfYWQ="),
                                  ],
                                  ro: [
                                      c("YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd"),
                                      c("YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd"),
                                      c("YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0="),
                                      c("YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd"),
                                      'a[href^="/url/"]',
                                  ],
                                  ruAd: [c("YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd"), c("YVtocmVmKj0iLy91dGltZy5ydS8iXQ=="), c("YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0="), "#pgeldiz", ".yandex-rtb-block"],
                                  thaiAds: ["a[href*=macau-uta-popup]", c("I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=="), c("LmFkczMwMHM="), ".bumq", ".img-kosana"],
                                  webAnnoyancesUltralist: ["#mod-social-share-2", "#social-tools", c("LmN0cGwtZnVsbGJhbm5lcg=="), ".zergnet-recommend", ".yt.btn-link.btn-md.btn"],
                              }),
                              (e = Object.keys(n)),
                              [
                                  4,
                                  on(
                                      (a = []).concat.apply(
                                          a,
                                          e.map(function (e) {
                                              return n[e];
                                          })
                                      )
                                  ),
                              ])
                            : [2, void 0];
                    case 1:
                        return (
                            (o = t.sent()),
                            r &&
                                (function (n, e) {
                                    for (var t = "DOM blockers debug:\n```", r = 0, o = Object.keys(n); r < o.length; r++) {
                                        var i = o[r];
                                        t += "\n".concat(i, ":");
                                        for (var a = 0, c = n[i]; a < c.length; a++) {
                                            var u = c[a];
                                            t += "\n  ".concat(e[u] ? "🚫" : "➡️", " ").concat(u);
                                        }
                                    }
                                    console.log("".concat(t, "\n```"));
                                })(n, o),
                            (i = e.filter(function (e) {
                                var t = n[e];
                                return (
                                    m(
                                        t.map(function (n) {
                                            return o[n];
                                        })
                                    ) >
                                    0.6 * t.length
                                );
                            })).sort(),
                            [2, i]
                        );
                }
                var c;
            });
        });
    },
    fontPreferences: function () {
        return (function (n, e) {
            void 0 === e && (e = 4e3);
            return D(function (t, o) {
                var i = o.document,
                    a = i.body,
                    c = a.style;
                (c.width = "".concat(e, "px")), (c.webkitTextSizeAdjust = c.textSizeAdjust = "none"), isChromium() ? (a.style.zoom = "".concat(1 / o.devicePixelRatio)) : X() && (a.style.zoom = "reset");
                var u = i.createElement("div");
                return (
                    (u.textContent = r([], Array((e / 20) << 0), !0)
                        .map(function () {
                            return "word";
                        })
                        .join(" ")),
                    a.appendChild(u),
                    n(i, a)
                );
            }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
        })(function (n, e) {
            for (var t = {}, r = {}, o = 0, i = Object.keys(hn); o < i.length; o++) {
                var a = i[o],
                    c = hn[a],
                    u = c[0],
                    l = void 0 === u ? {} : u,
                    s = c[1],
                    d = void 0 === s ? "mmMwWLliI0fiflO&1" : s,
                    f = n.createElement("span");
                (f.textContent = d), (f.style.whiteSpace = "nowrap");
                for (var m = 0, v = Object.keys(l); m < v.length; m++) {
                    var h = v[m],
                        p = l[h];
                    void 0 !== p && (f.style[h] = p);
                }
                (t[a] = f), e.append(n.createElement("br"), f);
            }
            for (var b = 0, y = Object.keys(hn); b < y.length; b++) {
                r[(a = y[b])] = t[a].getBoundingClientRect().width;
            }
            return r;
        });
    },
    audio: function () {
        return X() && H() && C() ? -4 : J();
    },
    screenFrame: function () {
        var n = this;
        if (X() && H() && C())
            return function () {
                return Promise.resolve(void 0);
            };
        var r = en();
        return function () {
            return e(n, void 0, void 0, function () {
                var n, e;
                return t(this, function (t) {
                    switch (t.label) {
                        case 0:
                            return [4, r()];
                        case 1:
                            return (
                                (n = t.sent()),
                                [
                                    2,
                                    [
                                        (e = function (n) {
                                            return null === n ? null : v(n, 10);
                                        })(n[0]),
                                        e(n[1]),
                                        e(n[2]),
                                        e(n[3]),
                                    ],
                                ]
                            );
                    }
                });
            });
        };
    },
    canvas: function () {
        return U(X() && H() && C());
    },
    osCpu: function () {
        return navigator.oscpu;
    },
    languages: function () {
        var n,
            e = navigator,
            t = [],
            r = e.language || e.userLanguage || e.browserLanguage || e.systemLanguage;
        if ((void 0 !== r && t.push([r]), Array.isArray(e.languages)))
            (isChromium() && m([!("MediaSettingsRange" in (n = window)), "RTCEncodedAudioFrame" in n, "" + n.Intl == "[object Intl]", "" + n.Reflect == "[object Reflect]"]) >= 3) || t.push(e.languages);
        else if ("string" == typeof e.languages) {
            var o = e.languages;
            o && t.push(o.split(","));
        }
        return t;
    },
    colorDepth: function () {
        return window.screen.colorDepth;
    },
    deviceMemory: function () {
        return f(d(navigator.deviceMemory), void 0);
    },
    screenResolution: function () {
        if (!(X() && H() && C())) return q();
    },
    hardwareConcurrency: function () {
        return f(s(navigator.hardwareConcurrency), void 0);
    },
    timezone: function () {
        var n,
            e = null === (n = window.Intl) || void 0 === n ? void 0 : n.DateTimeFormat;
        if (e) {
            var t = new e().resolvedOptions().timeZone;
            if (t) return t;
        }
        var r,
            o = ((r = new Date().getFullYear()), -Math.max(d(new Date(r, 0, 1).getTimezoneOffset()), d(new Date(r, 6, 1).getTimezoneOffset())));
        return "UTC".concat(o >= 0 ? "+" : "").concat(o);
    },
    sessionStorage: function () {
        try {
            return !!window.sessionStorage;
        } catch (n) {
            return !0;
        }
    },
    localStorage: function () {
        try {
            return !!window.localStorage;
        } catch (n) {
            return !0;
        }
    },
    indexedDB: function () {
        if (!I() && !Y())
            try {
                return !!window.indexedDB;
            } catch (n) {
                return !0;
            }
    },
    openDatabase: function () {
        return !!window.openDatabase;
    },
    cpuClass: function () {
        return navigator.cpuClass;
    },
    platform: function () {
        var n = navigator.platform;
        return "MacIntel" === n && X() && !isDesktopWebKit()
            ? (function () {
                  if ("iPad" === navigator.platform) return !0;
                  var n = screen,
                      e = n.width / n.height;
                  return m(["MediaSource" in window, !!Element.prototype.webkitRequestFullscreen, e > 0.65 && e < 1.53]) >= 2;
              })()
                ? "iPad"
                : "iPhone"
            : n;
    },
    plugins: function () {
        var n = navigator.plugins;
        if (n) {
            for (var e = [], t = 0; t < n.length; ++t) {
                var r = n[t];
                if (r) {
                    for (var o = [], i = 0; i < r.length; ++i) {
                        var a = r[i];
                        o.push({ type: a.type, suffixes: a.suffixes });
                    }
                    e.push({ name: r.name, description: r.description, mimeTypes: o });
                }
            }
            return e;
        }
    },
    touchSupport: function () {
        var n,
            e = navigator,
            t = 0;
        void 0 !== e.maxTouchPoints ? (t = s(e.maxTouchPoints)) : void 0 !== e.msMaxTouchPoints && (t = e.msMaxTouchPoints);
        try {
            document.createEvent("TouchEvent"), (n = !0);
        } catch (r) {
            n = !1;
        }
        return { maxTouchPoints: t, touchEvent: n, touchStart: "ontouchstart" in window };
    },
    vendor: function () {
        return navigator.vendor || "";
    },
    vendorFlavors: function () {
        for (
            var n = [], e = 0, t = ["chrome", "safari", "__crWeb", "__gCrWeb", "yandex", "__yb", "__ybro", "__firefox__", "__edgeTrackingPreventionStatistics", "webkit", "oprt", "samsungAr", "ucweb", "UCShellJava", "puffinDevice"];
            e < t.length;
            e++
        ) {
            var r = t[e],
                o = window[r];
            o && "object" == typeof o && n.push(r);
        }
        return n.sort();
    },
    cookiesEnabled: function () {
        var n = document;
        try {
            n.cookie = "cookietest=1; SameSite=Strict;";
            var e = -1 !== n.cookie.indexOf("cookietest=");
            return (n.cookie = "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT"), e;
        } catch (t) {
            return !1;
        }
    },
    colorGamut: function () {
        for (var n = 0, e = ["rec2020", "p3", "srgb"]; n < e.length; n++) {
            var t = e[n];
            if (matchMedia("(color-gamut: ".concat(t, ")")).matches) return t;
        }
    },
    invertedColors: function () {
        return !!cn("inverted") || (!cn("none") && void 0);
    },
    forcedColors: function () {
        return !!un("active") || (!un("none") && void 0);
    },
    monochrome: function () {
        if (matchMedia("(min-monochrome: 0)").matches) {
            for (var n = 0; n <= 100; ++n) if (matchMedia("(max-monochrome: ".concat(n, ")")).matches) return n;
            throw new Error("Too high value");
        }
    },
    contrast: function () {
        return ln("no-preference") ? 0 : ln("high") || ln("more") ? 1 : ln("low") || ln("less") ? -1 : ln("forced") ? 10 : void 0;
    },
    reducedMotion: function () {
        return !!sn("reduce") || (!sn("no-preference") && void 0);
    },
    reducedTransparency: function () {
        return !!dn("reduce") || (!dn("no-preference") && void 0);
    },
    hdr: function () {
        return !!fn("high") || (!fn("standard") && void 0);
    },
    math: function () {
        var n,
            e = mn.acos || vn,
            t = mn.acosh || vn,
            r = mn.asin || vn,
            o = mn.asinh || vn,
            i = mn.atanh || vn,
            a = mn.atan || vn,
            c = mn.sin || vn,
            u = mn.sinh || vn,
            l = mn.cos || vn,
            s = mn.cosh || vn,
            d = mn.tan || vn,
            f = mn.tanh || vn,
            m = mn.exp || vn,
            v = mn.expm1 || vn,
            h = mn.log1p || vn;
        return {
            acos: e(0.12312423423423424),
            acosh: t(1e308),
            acoshPf: ((n = 1e154), mn.log(n + mn.sqrt(n * n - 1))),
            asin: r(0.12312423423423424),
            asinh: o(1),
            asinhPf: (function (n) {
                return mn.log(n + mn.sqrt(n * n + 1));
            })(1),
            atanh: i(0.5),
            atanhPf: (function (n) {
                return mn.log((1 + n) / (1 - n)) / 2;
            })(0.5),
            atan: a(0.5),
            sin: c(-1e300),
            sinh: u(1),
            sinhPf: (function (n) {
                return mn.exp(n) - 1 / mn.exp(n) / 2;
            })(1),
            cos: l(10.000000000123),
            cosh: s(1),
            coshPf: (function (n) {
                return (mn.exp(n) + 1 / mn.exp(n)) / 2;
            })(1),
            tan: d(-1e300),
            tanh: f(1),
            tanhPf: (function (n) {
                return (mn.exp(2 * n) - 1) / (mn.exp(2 * n) + 1);
            })(1),
            exp: m(1),
            expm1: v(1),
            expm1Pf: (function (n) {
                return mn.exp(n) - 1;
            })(1),
            log1p: h(10),
            log1pPf: (function (n) {
                return mn.log(1 + n);
            })(10),
            powPI: (function (n) {
                return mn.pow(mn.PI, n);
            })(-100),
        };
    },
    pdfViewerEnabled: function () {
        return navigator.pdfViewerEnabled;
    },
    architecture: function () {
        var n = new Float32Array(1),
            e = new Uint8Array(n.buffer);
        return (n[0] = 1 / 0), (n[0] = n[0] - n[0]), e[3];
    },
    applePay: function () {
        var n = window.ApplePaySession;
        if ("function" != typeof (null == n ? void 0 : n.canMakePayments)) return -1;
        try {
            return n.canMakePayments() ? 1 : 0;
        } catch (e) {
            return (function (n) {
                if (n instanceof Error) {
                    if ("InvalidAccessError" === n.name) {
                        if (/\bfrom\b.*\binsecure\b/i.test(n.message)) return -2;
                        if (/\bdifferent\b.*\borigin\b.*top.level\b.*\bframe\b/i.test(n.message)) return -3;
                    }
                    if ("SecurityError" === n.name && /\bthird.party iframes?.*\bnot.allowed\b/i.test(n.message)) return -3;
                }
                throw n;
            })(e);
        }
    },
    privateClickMeasurement: function () {
        var n,
            e = document.createElement("a"),
            t = null !== (n = e.attributionSourceId) && void 0 !== n ? n : e.attributionsourceid;
        return void 0 === t ? void 0 : String(t);
    },
    audioBaseLatency: function () {
        var n;
        return isAndroid() || X() ? (window.AudioContext && null !== (n = new AudioContext().baseLatency) && void 0 !== n ? n : -1) : -2;
    },
    webGlBasics: function (n) {
        var e,
            t,
            r,
            o,
            i,
            a,
            c = wn(n.cache);
        if (!c) return -1;
        if (!Wn(c)) return -2;
        var u = Sn() ? null : c.getExtension("WEBGL_debug_renderer_info");
        return {
            version: (null === (e = c.getParameter(c.VERSION)) || void 0 === e ? void 0 : e.toString()) || "",
            vendor: (null === (t = c.getParameter(c.VENDOR)) || void 0 === t ? void 0 : t.toString()) || "",
            vendorUnmasked: u ? (null === (r = c.getParameter(u.UNMASKED_VENDOR_WEBGL)) || void 0 === r ? void 0 : r.toString()) : "",
            renderer: (null === (o = c.getParameter(c.RENDERER)) || void 0 === o ? void 0 : o.toString()) || "",
            rendererUnmasked: u ? (null === (i = c.getParameter(u.UNMASKED_RENDERER_WEBGL)) || void 0 === i ? void 0 : i.toString()) : "",
            shadingLanguageVersion: (null === (a = c.getParameter(c.SHADING_LANGUAGE_VERSION)) || void 0 === a ? void 0 : a.toString()) || "",
        };
    },
    webGlExtensions: function (n) {
        var e = wn(n.cache);
        if (!e) return -1;
        if (!Wn(e)) return -2;
        var t = e.getSupportedExtensions(),
            r = e.getContextAttributes(),
            o = [],
            i = [],
            a = [],
            c = [];
        if (r)
            for (var u = 0, l = Object.keys(r); u < l.length; u++) {
                var s = l[u];
                o.push("".concat(s, "=").concat(r[s]));
            }
        for (var d = 0, f = kn(e); d < f.length; d++) {
            var m = e[(w = f[d])];
            i.push(
                ""
                    .concat(w, "=")
                    .concat(m)
                    .concat(pn.has(m) ? "=".concat(e.getParameter(m)) : "")
            );
        }
        if (t)
            for (var v = 0, h = t; v < h.length; v++) {
                var p = h[v];
                if (!(("WEBGL_debug_renderer_info" === p && Sn()) || ("WEBGL_polygon_mode" === p && (isChromium() || X())))) {
                    var b = e.getExtension(p);
                    if (b)
                        for (var y = 0, g = kn(b); y < g.length; y++) {
                            var w;
                            m = b[(w = g[y])];
                            a.push(
                                ""
                                    .concat(w, "=")
                                    .concat(m)
                                    .concat(bn.has(m) ? "=".concat(e.getParameter(m)) : "")
                            );
                        }
                }
            }
        for (var L = 0, k = yn; L < k.length; L++)
            for (var V = k[L], S = 0, W = gn; S < W.length; S++) {
                var Z = W[S],
                    x = Ln(e, V, Z);
                c.push("".concat(V, ".").concat(Z, "=").concat(x.join(",")));
            }
        return a.sort(), i.sort(), { contextAttributes: o, parameters: i, shaderPrecisions: c, extensions: t, extensionParameters: a };
    },
    appName: function () {
      return navigator.appName;
    },
    appCodeName: function () {
      return navigator.appCodeName;
    },
    appVersion: function () {
      return navigator.appVersion;
    },
    userAgent: function () {
      return navigator.userAgent;
    },
    product: function () {
      return navigator.product;
    },
    language: function () {
      return navigator.language;
    },
  };
  function xn(n) {
    var e = (function (n) {
            if (isAndroid()) return 0.4;
            if (X()) return !isDesktopWebKit() || (H() && C()) ? 0.3 : 0.5;
            var e = "value" in n.platform ? n.platform.value : "";
            if (/^Win/.test(e)) return 0.6;
            if (/^Mac/.test(e)) return 0.5;
            return 0.7;
        })(n),
        t = (function (n) {
            return v(0.99 + 0.01 * n, 1e-4);
        })(e);
    return { score: e, comment: "$ if upgrade to Pro: https://fpjs.dev/pro".replace(/\$/g, "".concat(t)) };
  }
  function Mn(e) {
    return JSON.stringify(
        e,
        function (e, t) {
            return t instanceof Error ? n({ name: (r = t).name, message: r.message, stack: null === (o = r.stack) || void 0 === o ? void 0 : o.split("\n") }, r) : t;
        },
        2
    );
  }
  function Rn(n) {
    return M(
        (function (n) {
            for (var e = "", t = 0, r = Object.keys(n).sort(); t < r.length; t++) {
                var o = r[t],
                    i = n[o],
                    a = "error" in i ? "error" : JSON.stringify(i.value);
                e += ""
                    .concat(e ? "|" : "")
                    .concat(o.replace(/([:|\\])/g, "\\$1"), ":")
                    .concat(a);
            }
            return e;
        })(n)
    );
  }
  function Gn(n) {
    return (
        void 0 === n && (n = 50),
        (function (n, e) {
            void 0 === e && (e = 1 / 0);
            var t = window.requestIdleCallback;
            return t
                ? new Promise(function (n) {
                      return t.call(
                          window,
                          function () {
                              return n();
                          },
                          { timeout: e }
                      );
                  })
                : o(Math.min(n, e));
        })(n, 2 * n)
    );
  }
  function Fn(n, r) {
    var o = Date.now();
    return {
        get: function (i) {
            return e(this, void 0, void 0, function () {
                var e, a, c;
                return t(this, function (t) {
                    switch (t.label) {
                        case 0:
                            return (e = Date.now()), [4, n()];
                        case 1:
                            return (
                                (a = t.sent()),
                                (c = (function (n) {
                                    var e;
                                    return {
                                        get visitorId() {
                                            return void 0 === e && (e = Rn(this.components)), e;
                                        },
                                        set visitorId(n) {
                                            e = n;
                                        },
                                        confidence: xn(n),
                                        components: n,
                                        version: "4.4.1",
                                    };
                                })(a)),
                                (r || (null == i ? void 0 : i.debug)) &&
                                    console.log(
                                        "Copy the text below to get the debug data:\n\n```\nversion: "
                                            .concat(c.version, "\nuserAgent: ")
                                            .concat(navigator.userAgent, "\ntimeBetweenLoadAndGet: ")
                                            .concat(e - o, "\nvisitorId: ")
                                            .concat(c.visitorId, "\ncomponents: ")
                                            .concat(Mn(a), "\n```")
                                    ),
                                [2, c]
                            );
                    }
                });
            });
        },
    };
  }
  function In(n) {
    return (
        void 0 === n && (n = {}),
        e(this, void 0, void 0, function () {
            var e, r, o;
            return t(this, function (t) {
                switch (t.label) {
                    case 0:
                        return n.monitoring, (e = n.delayFallback), (r = n.debug), [4, Gn(e)];
                    case 1:
                        return (
                            t.sent(),
                            (o = (function (n) {
                                return G(sources, n, []);
                            })({ cache: {}, debug: r })),
                            [2, Fn(o, r)]
                        );
                }
            });
        })
    );
  }
  var Yn = { load: In, hashComponents: Rn, componentsToDebugString: Mn },
    jn = M;
  return {
    componentsToDebugString: Mn,
    // Yn as default,
    getFullscreenElement: A,
    getUnstableAudioFingerprint: J,
    getUnstableCanvasFingerprint: U,
    getUnstableScreenFrame: en,
    getUnstableScreenResolution: q,
    getWebGLContext: wn,
    hashComponents: Rn,
    isAndroid,
    isChromium,
    isDesktopWebKit,
    isEdgeHTML: Y,
    isGecko,
    isTrident: I,
    isWebKit: X,
    load: In,
    loadSources: G,
    murmurX64Hash128: jn,
    prepareForSources: Gn,
    sources,
    transformSource: F,
    withIframe: D,
  }
})()