/* @ds-bundle: {"namespace":"SimUI","components":[{"name":"ChipsCard","sourcePath":"components/media-status/ChipsCard/ChipsCard.jsx"},{"name":"ClimateCard","sourcePath":"components/entity-tiles/ClimateCard/ClimateCard.jsx"},{"name":"CoverCard","sourcePath":"components/entity-tiles/CoverCard/CoverCard.jsx"},{"name":"EnergyFlowCard","sourcePath":"components/data-viz/EnergyFlowCard/EnergyFlowCard.jsx"},{"name":"GraphCard","sourcePath":"components/data-viz/GraphCard/GraphCard.jsx"},{"name":"LightCard","sourcePath":"components/entity-tiles/LightCard/LightCard.jsx"},{"name":"LockCard","sourcePath":"components/entity-tiles/LockCard/LockCard.jsx"},{"name":"MediaCard","sourcePath":"components/media-status/MediaCard/MediaCard.jsx"},{"name":"SensorCard","sourcePath":"components/entity-tiles/SensorCard/SensorCard.jsx"}],"sourceHashes":{"components/media-status/ChipsCard/ChipsCard.jsx":"f667328ba1fa","components/media-status/ChipsCard/ChipsCard.d.ts":"4c660468940f","components/media-status/ChipsCard/ChipsCard.prompt.md":"91bef4849013","components/entity-tiles/ClimateCard/ClimateCard.jsx":"a2cbfebb4124","components/entity-tiles/ClimateCard/ClimateCard.d.ts":"5a5bf54e745f","components/entity-tiles/ClimateCard/ClimateCard.prompt.md":"4e639afe8629","components/entity-tiles/CoverCard/CoverCard.jsx":"31bfd52e91a3","components/entity-tiles/CoverCard/CoverCard.d.ts":"3e9dfd0ef241","components/entity-tiles/CoverCard/CoverCard.prompt.md":"feb2b3706f0a","components/data-viz/EnergyFlowCard/EnergyFlowCard.jsx":"b48202ac3626","components/data-viz/EnergyFlowCard/EnergyFlowCard.d.ts":"56cc28390962","components/data-viz/EnergyFlowCard/EnergyFlowCard.prompt.md":"26e81a2c5b8b","components/data-viz/GraphCard/GraphCard.jsx":"45860951cdb1","components/data-viz/GraphCard/GraphCard.d.ts":"1da0f2a23a2d","components/data-viz/GraphCard/GraphCard.prompt.md":"73f162944dc1","components/entity-tiles/LightCard/LightCard.jsx":"3c5bcf0a3afa","components/entity-tiles/LightCard/LightCard.d.ts":"5fc4cdb22496","components/entity-tiles/LightCard/LightCard.prompt.md":"6c61fa7ce4ba","components/entity-tiles/LockCard/LockCard.jsx":"830c080d1e02","components/entity-tiles/LockCard/LockCard.d.ts":"6b247501813e","components/entity-tiles/LockCard/LockCard.prompt.md":"238718a48cb5","components/media-status/MediaCard/MediaCard.jsx":"dec2b90c3b70","components/media-status/MediaCard/MediaCard.d.ts":"35cf4107f881","components/media-status/MediaCard/MediaCard.prompt.md":"b2210f991e79","components/entity-tiles/SensorCard/SensorCard.jsx":"f144f40a5c01","components/entity-tiles/SensorCard/SensorCard.d.ts":"5f460db58f03","components/entity-tiles/SensorCard/SensorCard.prompt.md":"f037a542eb73"},"inlinedExternals":["lucide-react"],"builtBy":"cc-design-sync"} */
"use strict";
var SimUI = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <define:import.meta.env>
  var init_define_import_meta_env = __esm({
    "<define:import.meta.env>"() {
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function jsx13(t, p, k) {
        return R.createElement(t, k === void 0 ? p : Object.assign({ key: k }, p));
      }
      module.exports = R;
      module.exports.jsx = jsx13;
      module.exports.jsxs = jsx13;
      module.exports.jsxDEV = jsx13;
      module.exports.Fragment = R.Fragment;
    }
  });

  // .design-sync/entry.tsx
  var entry_exports = {};
  __export(entry_exports, {
    ChipsCard: () => ChipsCard,
    ClimateCard: () => ClimateCard,
    CoverCard: () => CoverCard,
    DEMO_STATES: () => DEMO_STATES,
    EnergyFlowCard: () => EnergyFlowCard,
    GraphCard: () => GraphCard,
    HassProvider: () => HassProvider,
    LightCard: () => LightCard,
    LockCard: () => LockCard,
    MediaCard: () => MediaCard,
    SensorCard: () => SensorCard,
    SimuiProvider: () => SimuiProvider,
    createMockHass: () => createMockHass
  });
  init_define_import_meta_env();

  // src/cards/LightCard.tsx
  init_define_import_meta_env();

  // node_modules/lucide-react/dist/esm/lucide-react.mjs
  init_define_import_meta_env();

  // node_modules/lucide-react/dist/esm/createLucideIcon.mjs
  init_define_import_meta_env();
  var import_react3 = __toESM(require_react_shim(), 1);

  // node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
  init_define_import_meta_env();
  var mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
  }).join(" ").trim();

  // node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
  init_define_import_meta_env();
  var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

  // node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
  init_define_import_meta_env();

  // node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
  init_define_import_meta_env();
  var toCamelCase = (string) => string.replace(
    /^([A-Z])|[\s-_]+(\w)/g,
    (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
  );

  // node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
  var toPascalCase = (string) => {
    const camelCase = toCamelCase(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  };

  // node_modules/lucide-react/dist/esm/Icon.mjs
  init_define_import_meta_env();
  var import_react2 = __toESM(require_react_shim(), 1);

  // node_modules/lucide-react/dist/esm/defaultAttributes.mjs
  init_define_import_meta_env();
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  // node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
  init_define_import_meta_env();
  var hasA11yProp = (props) => {
    for (const prop in props) {
      if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
        return true;
      }
    }
    return false;
  };

  // node_modules/lucide-react/dist/esm/context.mjs
  init_define_import_meta_env();
  var import_react = __toESM(require_react_shim(), 1);
  var LucideContext = (0, import_react.createContext)({});
  var useLucideContext = () => (0, import_react.useContext)(LucideContext);

  // node_modules/lucide-react/dist/esm/Icon.mjs
  var Icon = (0, import_react2.forwardRef)(
    ({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
      const {
        size: contextSize = 24,
        strokeWidth: contextStrokeWidth = 2,
        absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
        color: contextColor = "currentColor",
        className: contextClass = ""
      } = useLucideContext() ?? {};
      const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
      return (0, import_react2.createElement)(
        "svg",
        {
          ref,
          ...defaultAttributes,
          width: size ?? contextSize ?? defaultAttributes.width,
          height: size ?? contextSize ?? defaultAttributes.height,
          stroke: color ?? contextColor,
          strokeWidth: calculatedStrokeWidth,
          className: mergeClasses("lucide", contextClass, className),
          ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
          ...rest
        },
        [
          ...iconNode.map(([tag, attrs]) => (0, import_react2.createElement)(tag, attrs)),
          ...Array.isArray(children) ? children : [children]
        ]
      );
    }
  );

  // node_modules/lucide-react/dist/esm/createLucideIcon.mjs
  var createLucideIcon = (iconName, iconNode) => {
    const Component = (0, import_react3.forwardRef)(
      ({ className, ...props }, ref) => (0, import_react3.createElement)(Icon, {
        ref,
        iconNode,
        className: mergeClasses(
          `lucide-${toKebabCase(toPascalCase(iconName))}`,
          `lucide-${iconName}`,
          className
        ),
        ...props
      })
    );
    Component.displayName = toPascalCase(iconName);
    return Component;
  };

  // node_modules/lucide-react/dist/esm/icons/activity.mjs
  init_define_import_meta_env();
  var __iconNode = [
    [
      "path",
      {
        d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
        key: "169zse"
      }
    ]
  ];
  var Activity = createLucideIcon("activity", __iconNode);

  // node_modules/lucide-react/dist/esm/icons/battery-medium.mjs
  init_define_import_meta_env();
  var __iconNode2 = [
    ["path", { d: "M10 14v-4", key: "suye4c" }],
    ["path", { d: "M22 14v-4", key: "14q9d5" }],
    ["path", { d: "M6 14v-4", key: "14a6bd" }],
    ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2", key: "13zb55" }]
  ];
  var BatteryMedium = createLucideIcon("battery-medium", __iconNode2);

  // node_modules/lucide-react/dist/esm/icons/blinds.mjs
  init_define_import_meta_env();
  var __iconNode3 = [
    ["path", { d: "M3 3h18", key: "o7r712" }],
    ["path", { d: "M20 7H8", key: "gd2fo2" }],
    ["path", { d: "M20 11H8", key: "1ynp89" }],
    ["path", { d: "M10 19h10", key: "19hjk5" }],
    ["path", { d: "M8 15h12", key: "1yqzne" }],
    ["path", { d: "M4 3v14", key: "fggqzn" }],
    ["circle", { cx: "4", cy: "19", r: "2", key: "p3m9r0" }]
  ];
  var Blinds = createLucideIcon("blinds", __iconNode3);

  // node_modules/lucide-react/dist/esm/icons/circle-question-mark.mjs
  init_define_import_meta_env();
  var __iconNode4 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }]
  ];
  var CircleQuestionMark = createLucideIcon("circle-question-mark", __iconNode4);

  // node_modules/lucide-react/dist/esm/icons/cloud-rain.mjs
  init_define_import_meta_env();
  var __iconNode5 = [
    ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
    ["path", { d: "M16 14v6", key: "1j4efv" }],
    ["path", { d: "M8 14v6", key: "17c4r9" }],
    ["path", { d: "M12 16v6", key: "c8a4gj" }]
  ];
  var CloudRain = createLucideIcon("cloud-rain", __iconNode5);

  // node_modules/lucide-react/dist/esm/icons/dollar-sign.mjs
  init_define_import_meta_env();
  var __iconNode6 = [
    ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
    ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
  ];
  var DollarSign = createLucideIcon("dollar-sign", __iconNode6);

  // node_modules/lucide-react/dist/esm/icons/door-closed.mjs
  init_define_import_meta_env();
  var __iconNode7 = [
    ["path", { d: "M10 12h.01", key: "1kxr2c" }],
    ["path", { d: "M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14", key: "36qu9e" }],
    ["path", { d: "M2 20h20", key: "owomy5" }]
  ];
  var DoorClosed = createLucideIcon("door-closed", __iconNode7);

  // node_modules/lucide-react/dist/esm/icons/door-open.mjs
  init_define_import_meta_env();
  var __iconNode8 = [
    ["path", { d: "M11 20H2", key: "nlcfvz" }],
    [
      "path",
      {
        d: "M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z",
        key: "au4z13"
      }
    ],
    ["path", { d: "M11 4H8a2 2 0 0 0-2 2v14", key: "74r1mk" }],
    ["path", { d: "M14 12h.01", key: "1jfl7z" }],
    ["path", { d: "M22 20h-3", key: "vhrsz" }]
  ];
  var DoorOpen = createLucideIcon("door-open", __iconNode8);

  // node_modules/lucide-react/dist/esm/icons/droplets.mjs
  init_define_import_meta_env();
  var __iconNode9 = [
    [
      "path",
      {
        d: "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
        key: "1ptgy4"
      }
    ],
    [
      "path",
      {
        d: "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
        key: "1sl1rz"
      }
    ]
  ];
  var Droplets = createLucideIcon("droplets", __iconNode9);

  // node_modules/lucide-react/dist/esm/icons/fan.mjs
  init_define_import_meta_env();
  var __iconNode10 = [
    [
      "path",
      {
        d: "M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z",
        key: "484a7f"
      }
    ],
    ["path", { d: "M12 12v.01", key: "u5ubse" }]
  ];
  var Fan = createLucideIcon("fan", __iconNode10);

  // node_modules/lucide-react/dist/esm/icons/flame.mjs
  init_define_import_meta_env();
  var __iconNode11 = [
    [
      "path",
      {
        d: "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
        key: "1slcih"
      }
    ]
  ];
  var Flame = createLucideIcon("flame", __iconNode11);

  // node_modules/lucide-react/dist/esm/icons/flask-conical.mjs
  init_define_import_meta_env();
  var __iconNode12 = [
    [
      "path",
      {
        d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
        key: "18mbvz"
      }
    ],
    ["path", { d: "M6.453 15h11.094", key: "3shlmq" }],
    ["path", { d: "M8.5 2h7", key: "csnxdl" }]
  ];
  var FlaskConical = createLucideIcon("flask-conical", __iconNode12);

  // node_modules/lucide-react/dist/esm/icons/gauge.mjs
  init_define_import_meta_env();
  var __iconNode13 = [
    ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
    ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }]
  ];
  var Gauge = createLucideIcon("gauge", __iconNode13);

  // node_modules/lucide-react/dist/esm/icons/house.mjs
  init_define_import_meta_env();
  var __iconNode14 = [
    ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        key: "r6nss1"
      }
    ]
  ];
  var House = createLucideIcon("house", __iconNode14);

  // node_modules/lucide-react/dist/esm/icons/lightbulb.mjs
  init_define_import_meta_env();
  var __iconNode15 = [
    [
      "path",
      {
        d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
        key: "1gvzjb"
      }
    ],
    ["path", { d: "M9 18h6", key: "x1upvd" }],
    ["path", { d: "M10 22h4", key: "ceow96" }]
  ];
  var Lightbulb = createLucideIcon("lightbulb", __iconNode15);

  // node_modules/lucide-react/dist/esm/icons/lock-open.mjs
  init_define_import_meta_env();
  var __iconNode16 = [
    ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
    ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1", key: "1mm8w8" }]
  ];
  var LockOpen = createLucideIcon("lock-open", __iconNode16);

  // node_modules/lucide-react/dist/esm/icons/lock.mjs
  init_define_import_meta_env();
  var __iconNode17 = [
    ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
    ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
  ];
  var Lock = createLucideIcon("lock", __iconNode17);

  // node_modules/lucide-react/dist/esm/icons/map-pin.mjs
  init_define_import_meta_env();
  var __iconNode18 = [
    [
      "path",
      {
        d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
        key: "1r0f0z"
      }
    ],
    ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
  ];
  var MapPin = createLucideIcon("map-pin", __iconNode18);

  // node_modules/lucide-react/dist/esm/icons/music.mjs
  init_define_import_meta_env();
  var __iconNode19 = [
    ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
    ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
    ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
  ];
  var Music = createLucideIcon("music", __iconNode19);

  // node_modules/lucide-react/dist/esm/icons/pause.mjs
  init_define_import_meta_env();
  var __iconNode20 = [
    ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
    ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
  ];
  var Pause = createLucideIcon("pause", __iconNode20);

  // node_modules/lucide-react/dist/esm/icons/play.mjs
  init_define_import_meta_env();
  var __iconNode21 = [
    [
      "path",
      {
        d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
        key: "10ikf1"
      }
    ]
  ];
  var Play = createLucideIcon("play", __iconNode21);

  // node_modules/lucide-react/dist/esm/icons/power.mjs
  init_define_import_meta_env();
  var __iconNode22 = [
    ["path", { d: "M12 2v10", key: "mnfbl" }],
    ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
  ];
  var Power = createLucideIcon("power", __iconNode22);

  // node_modules/lucide-react/dist/esm/icons/shield-alert.mjs
  init_define_import_meta_env();
  var __iconNode23 = [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y"
      }
    ],
    ["path", { d: "M12 8v4", key: "1got3b" }],
    ["path", { d: "M12 16h.01", key: "1drbdi" }]
  ];
  var ShieldAlert = createLucideIcon("shield-alert", __iconNode23);

  // node_modules/lucide-react/dist/esm/icons/shield-check.mjs
  init_define_import_meta_env();
  var __iconNode24 = [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y"
      }
    ],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
  ];
  var ShieldCheck = createLucideIcon("shield-check", __iconNode24);

  // node_modules/lucide-react/dist/esm/icons/signal.mjs
  init_define_import_meta_env();
  var __iconNode25 = [
    ["path", { d: "M2 20h.01", key: "4haj6o" }],
    ["path", { d: "M7 20v-4", key: "j294jx" }],
    ["path", { d: "M12 20v-8", key: "i3yub9" }],
    ["path", { d: "M17 20V8", key: "1tkaf5" }],
    ["path", { d: "M22 4v16", key: "sih9yq" }]
  ];
  var Signal = createLucideIcon("signal", __iconNode25);

  // node_modules/lucide-react/dist/esm/icons/skip-back.mjs
  init_define_import_meta_env();
  var __iconNode26 = [
    [
      "path",
      {
        d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
        key: "15892j"
      }
    ],
    ["path", { d: "M3 20V4", key: "1ptbpl" }]
  ];
  var SkipBack = createLucideIcon("skip-back", __iconNode26);

  // node_modules/lucide-react/dist/esm/icons/skip-forward.mjs
  init_define_import_meta_env();
  var __iconNode27 = [
    ["path", { d: "M21 4v16", key: "7j8fe9" }],
    [
      "path",
      {
        d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
        key: "zs4d6"
      }
    ]
  ];
  var SkipForward = createLucideIcon("skip-forward", __iconNode27);

  // node_modules/lucide-react/dist/esm/icons/snowflake.mjs
  init_define_import_meta_env();
  var __iconNode28 = [
    ["path", { d: "m10 20-1.25-2.5L6 18", key: "18frcb" }],
    ["path", { d: "M10 4 8.75 6.5 6 6", key: "7mghy3" }],
    ["path", { d: "m14 20 1.25-2.5L18 18", key: "1chtki" }],
    ["path", { d: "m14 4 1.25 2.5L18 6", key: "1b4wsy" }],
    ["path", { d: "m17 21-3-6h-4", key: "15hhxa" }],
    ["path", { d: "m17 3-3 6 1.5 3", key: "11697g" }],
    ["path", { d: "M2 12h6.5L10 9", key: "kv9z4n" }],
    ["path", { d: "m20 10-1.5 2 1.5 2", key: "1swlpi" }],
    ["path", { d: "M22 12h-6.5L14 15", key: "1mxi28" }],
    ["path", { d: "m4 10 1.5 2L4 14", key: "k9enpj" }],
    ["path", { d: "m7 21 3-6-1.5-3", key: "j8hb9u" }],
    ["path", { d: "m7 3 3 6h4", key: "1otusx" }]
  ];
  var Snowflake = createLucideIcon("snowflake", __iconNode28);

  // node_modules/lucide-react/dist/esm/icons/sun.mjs
  init_define_import_meta_env();
  var __iconNode29 = [
    ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
    ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
    ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
  ];
  var Sun = createLucideIcon("sun", __iconNode29);

  // node_modules/lucide-react/dist/esm/icons/thermometer.mjs
  init_define_import_meta_env();
  var __iconNode30 = [
    ["path", { d: "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z", key: "17jzev" }]
  ];
  var Thermometer = createLucideIcon("thermometer", __iconNode30);

  // node_modules/lucide-react/dist/esm/icons/timer.mjs
  init_define_import_meta_env();
  var __iconNode31 = [
    ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
    ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
    ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
  ];
  var Timer = createLucideIcon("timer", __iconNode31);

  // node_modules/lucide-react/dist/esm/icons/toggle-right.mjs
  init_define_import_meta_env();
  var __iconNode32 = [
    ["circle", { cx: "15", cy: "12", r: "3", key: "1afu0r" }],
    ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7", key: "g7kal2" }]
  ];
  var ToggleRight = createLucideIcon("toggle-right", __iconNode32);

  // node_modules/lucide-react/dist/esm/icons/volume-2.mjs
  init_define_import_meta_env();
  var __iconNode33 = [
    [
      "path",
      {
        d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
        key: "uqj9uw"
      }
    ],
    ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
    ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
  ];
  var Volume2 = createLucideIcon("volume-2", __iconNode33);

  // node_modules/lucide-react/dist/esm/icons/warehouse.mjs
  init_define_import_meta_env();
  var __iconNode34 = [
    ["path", { d: "M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11", key: "pb2vm6" }],
    [
      "path",
      {
        d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z",
        key: "doq5xv"
      }
    ],
    ["path", { d: "M6 13h12", key: "yf64js" }],
    ["path", { d: "M6 17h12", key: "1jwigz" }]
  ];
  var Warehouse = createLucideIcon("warehouse", __iconNode34);

  // node_modules/lucide-react/dist/esm/icons/waves-horizontal.mjs
  init_define_import_meta_env();
  var __iconNode35 = [
    ["path", { d: "M2 12q2.5 2 5 0t5 0 5 0 5 0", key: "8ddzzs" }],
    ["path", { d: "M2 19q2.5 2 5 0t5 0 5 0 5 0", key: "1wj4st" }],
    ["path", { d: "M2 5q2.5 2 5 0t5 0 5 0 5 0", key: "69x50u" }]
  ];
  var WavesHorizontal = createLucideIcon("waves-horizontal", __iconNode35);

  // node_modules/lucide-react/dist/esm/icons/wind.mjs
  init_define_import_meta_env();
  var __iconNode36 = [
    ["path", { d: "M12.8 19.6A2 2 0 1 0 14 16H2", key: "148xed" }],
    ["path", { d: "M17.5 8a2.5 2.5 0 1 1 2 4H2", key: "1u4tom" }],
    ["path", { d: "M9.8 4.4A2 2 0 1 1 11 8H2", key: "75valh" }]
  ];
  var Wind = createLucideIcon("wind", __iconNode36);

  // node_modules/lucide-react/dist/esm/icons/zap.mjs
  init_define_import_meta_env();
  var __iconNode37 = [
    [
      "path",
      {
        d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
        key: "1xq2db"
      }
    ]
  ];
  var Zap = createLucideIcon("zap", __iconNode37);

  // src/core/hass.tsx
  init_define_import_meta_env();
  var import_react4 = __toESM(require_react_shim(), 1);

  // src/core/actions.ts
  init_define_import_meta_env();
  function fire(node, type, detail) {
    node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true, cancelable: false }));
  }
  function runAction(host, hass, action, defaultEntity) {
    const a = action ?? { action: "more-info" };
    const entity = a.entity ?? defaultEntity;
    switch (a.action) {
      case "none":
        return;
      case "more-info":
        if (entity) fire(host, "hass-more-info", { entityId: entity });
        return;
      case "toggle":
        if (entity) hass.callService("homeassistant", "toggle", {}, { entity_id: entity });
        return;
      case "navigate":
        if (a.navigation_path) {
          history.pushState(null, "", a.navigation_path);
          fire(host, "location-changed", { replace: false });
        }
        return;
      case "url":
        if (a.url_path && /^(https?:\/\/|\/)/.test(a.url_path)) {
          window.open(a.url_path, a.url_path.startsWith("/") ? "_self" : "_blank");
        }
        return;
      case "perform-action":
      case "call-service": {
        const svc = a.perform_action ?? a.service;
        if (svc && svc.includes(".")) {
          const [domain, service] = svc.split(".", 2);
          hass.callService(domain, service, a.data ?? a.service_data ?? {}, a.target);
        }
        return;
      }
    }
  }

  // src/core/hass.tsx
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var HassCtx = (0, import_react4.createContext)(null);
  function HassProvider({ hass, host, children }) {
    const value = (0, import_react4.useMemo)(() => ({ hass, host }), [hass, host]);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HassCtx.Provider, { value, children });
  }
  function useCtx() {
    const v = (0, import_react4.useContext)(HassCtx);
    if (!v) throw new Error("SimUI card rendered without a HassProvider");
    return v;
  }
  function useEntity(entityId) {
    const { hass } = useCtx();
    return entityId ? hass.states[entityId] : void 0;
  }
  function useHass() {
    return useCtx().hass;
  }
  function useCallService() {
    const { hass } = useCtx();
    return (domain, service, data, target) => hass.callService(domain, service, data, target);
  }
  function useLanguage() {
    return useCtx().hass.language;
  }
  function useMoreInfo() {
    const { host } = useCtx();
    return (entityId) => fireEvent(host, "hass-more-info", { entityId });
  }
  function useActions() {
    const { hass, host } = useCtx();
    return (action, defaultEntity) => runAction(host, hass, action, defaultEntity);
  }
  function fireEvent(node, type, detail) {
    node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true, cancelable: false }));
  }
  function parseHistory(raw) {
    if (!Array.isArray(raw)) return [];
    const out = [];
    for (const e of raw) {
      const s = e.s ?? e.state;
      const lu = e.lu ?? e.last_updated ?? e.last_changed;
      const v = Number(s);
      if (lu == null || Number.isNaN(v)) continue;
      const t = typeof lu === "number" ? lu * 1e3 : Date.parse(lu);
      if (!Number.isNaN(t)) out.push({ t, v });
    }
    out.sort((a, b) => a.t - b.t);
    return out;
  }
  function useHistory(entityId, hours) {
    const { hass } = useCtx();
    const hassRef = (0, import_react4.useRef)(hass);
    hassRef.current = hass;
    const [state, setState] = (0, import_react4.useState)({ points: [], loading: true, error: null });
    (0, import_react4.useEffect)(() => {
      if (!entityId) {
        setState({ points: [], loading: false, error: null });
        return;
      }
      let cancelled = false;
      const load = () => {
        const callWS = hassRef.current.callWS;
        if (!callWS) {
          setState({ points: [], loading: false, error: "History unavailable" });
          return;
        }
        const end = /* @__PURE__ */ new Date();
        const start = new Date(end.getTime() - hours * 36e5);
        setState((s) => ({ ...s, loading: s.points.length === 0 }));
        callWS({
          type: "history/history_during_period",
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          entity_ids: [entityId],
          minimal_response: true,
          no_attributes: true
        }).then((res) => {
          if (cancelled) return;
          setState({ points: parseHistory(res?.[entityId]), loading: false, error: null });
        }).catch((err) => {
          if (cancelled) return;
          setState({ points: [], loading: false, error: err instanceof Error ? err.message : String(err) });
        });
      };
      load();
      const id = setInterval(load, 12e4);
      return () => {
        cancelled = true;
        clearInterval(id);
      };
    }, [entityId, hours]);
    return state;
  }

  // src/hooks/useDragValue.ts
  init_define_import_meta_env();
  var import_react5 = __toESM(require_react_shim(), 1);

  // src/util.ts
  init_define_import_meta_env();
  function domainOf(entityId) {
    return entityId.split(".")[0];
  }
  function friendly(entity) {
    return entity.attributes.friendly_name || entity.entity_id;
  }
  function prettyState(state) {
    return state.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  }
  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }
  function supportsFeature(entity, bit) {
    const sf = entity.attributes.supported_features;
    return sf != null && (sf & bit) === bit;
  }
  function isUnavailable(entity) {
    return !entity || entity.state === "unavailable" || entity.state === "unknown";
  }
  function stepKey(key, value, step, min, max) {
    switch (key) {
      case "ArrowUp":
      case "ArrowRight":
        return clamp(value + step, min, max);
      case "ArrowDown":
      case "ArrowLeft":
        return clamp(value - step, min, max);
      case "PageUp":
        return clamp(value + step * 10, min, max);
      case "PageDown":
        return clamp(value - step * 10, min, max);
      case "Home":
        return min;
      case "End":
        return max;
      default:
        return null;
    }
  }
  function isActivateKey(key) {
    return key === "Enter" || key === " " || key === "Spacebar";
  }

  // src/hooks/useDragValue.ts
  function snap(v, step, min, max) {
    if (step <= 0) return clamp(Math.round(v), min, max);
    return clamp(Math.round((v - min) / step) * step + min, min, max);
  }
  function useDragValue(opts) {
    const { value: external, onCommit, axis = "auto", commitMs = 120, step = 1, min = 0, max = 100, disabled, threshold = 4 } = opts;
    const [value, setValue] = (0, import_react5.useState)(() => snap(external, step, min, max));
    const [dragging, setDragging] = (0, import_react5.useState)(false);
    const [lockedAxis, setLockedAxis] = (0, import_react5.useState)(axis === "auto" ? "vertical" : axis);
    const draggingRef = (0, import_react5.useRef)(false);
    const valueRef = (0, import_react5.useRef)(value);
    const rectRef = (0, import_react5.useRef)(null);
    const lockAxisRef = (0, import_react5.useRef)(axis === "auto" ? null : axis);
    const startRef = (0, import_react5.useRef)(null);
    const pointRef = (0, import_react5.useRef)(null);
    const movedRef = (0, import_react5.useRef)(false);
    const rafRef = (0, import_react5.useRef)(null);
    const pendingRef = (0, import_react5.useRef)(null);
    const lastCommitRef = (0, import_react5.useRef)(0);
    const committedRef = (0, import_react5.useRef)(null);
    const commitTimer = (0, import_react5.useRef)(null);
    const onCommitRef = (0, import_react5.useRef)(onCommit);
    onCommitRef.current = onCommit;
    const flushCommit = (0, import_react5.useCallback)(() => {
      if (commitTimer.current != null) {
        clearTimeout(commitTimer.current);
        commitTimer.current = null;
      }
      if (pendingRef.current != null) {
        const v = pendingRef.current;
        pendingRef.current = null;
        lastCommitRef.current = Date.now();
        committedRef.current = v;
        onCommitRef.current(v);
      }
    }, []);
    const scheduleCommit = (0, import_react5.useCallback)(
      (v) => {
        pendingRef.current = v;
        const now = Date.now();
        const wait = Math.max(0, commitMs - (now - lastCommitRef.current));
        if (commitTimer.current != null) clearTimeout(commitTimer.current);
        commitTimer.current = setTimeout(flushCommit, wait);
      },
      [commitMs, flushCommit]
    );
    (0, import_react5.useEffect)(() => {
      if (draggingRef.current || pendingRef.current != null) return;
      const next = snap(external, step, min, max);
      valueRef.current = next;
      setValue(next);
    }, [external, step, min, max]);
    const apply = (0, import_react5.useCallback)(() => {
      rafRef.current = null;
      const rect = rectRef.current;
      const pt = pointRef.current;
      if (!rect || !pt) return;
      if (lockAxisRef.current == null && startRef.current) {
        const dx = Math.abs(pt.x - startRef.current.x);
        const dy = Math.abs(pt.y - startRef.current.y);
        if (dx > threshold || dy > threshold) {
          const a = dy >= dx ? "vertical" : "horizontal";
          lockAxisRef.current = a;
          setLockedAxis(a);
        }
      }
      const active = lockAxisRef.current ?? "vertical";
      let raw;
      if (active === "vertical") {
        raw = rect.height > 0 ? min + (rect.bottom - pt.y) / rect.height * (max - min) : min;
      } else {
        raw = rect.width > 0 ? min + (pt.x - rect.left) / rect.width * (max - min) : min;
      }
      const next = snap(raw, step, min, max);
      if (next !== valueRef.current) {
        valueRef.current = next;
        setValue(next);
        scheduleCommit(next);
      }
    }, [step, min, max, threshold, scheduleCommit]);
    (0, import_react5.useEffect)(() => {
      if (!dragging) return;
      const onMove = (e) => {
        if (!draggingRef.current) return;
        e.preventDefault();
        pointRef.current = { x: e.clientX, y: e.clientY };
        if (startRef.current && !movedRef.current) {
          const dx = Math.abs(e.clientX - startRef.current.x);
          const dy = Math.abs(e.clientY - startRef.current.y);
          if (dx > threshold || dy > threshold) movedRef.current = true;
        }
        if (rafRef.current == null) rafRef.current = requestAnimationFrame(apply);
      };
      const onUp = () => {
        draggingRef.current = false;
        setDragging(false);
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        if (movedRef.current) {
          apply();
          if (pendingRef.current == null && valueRef.current !== committedRef.current) {
            pendingRef.current = valueRef.current;
          }
          flushCommit();
        }
      };
      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };
    }, [dragging, threshold, apply, flushCommit]);
    (0, import_react5.useEffect)(
      () => () => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        if (commitTimer.current != null) clearTimeout(commitTimer.current);
      },
      []
    );
    const onPointerDown = (0, import_react5.useCallback)(
      (e) => {
        if (disabled) return;
        if (e.button != null && e.button !== 0) return;
        const el = e.currentTarget;
        rectRef.current = el.getBoundingClientRect();
        startRef.current = { x: e.clientX, y: e.clientY };
        pointRef.current = { x: e.clientX, y: e.clientY };
        movedRef.current = false;
        lockAxisRef.current = axis === "auto" ? null : axis;
        draggingRef.current = true;
        setDragging(true);
      },
      [disabled, axis]
    );
    const pct = max > min ? (value - min) / (max - min) * 100 : 0;
    const fillStyle = lockedAxis === "horizontal" ? { width: `${pct}%` } : { height: `${pct}%` };
    const moved = (0, import_react5.useCallback)(() => movedRef.current, []);
    return { value, dragging, moved, handlers: { onPointerDown }, fillStyle };
  }

  // src/core/icon.tsx
  init_define_import_meta_env();
  var import_react6 = __toESM(require_react_shim(), 1);
  function haIconReady() {
    return typeof customElements !== "undefined" && !!customElements.get("ha-icon");
  }
  function EntityIcon({ override, size, fallback }) {
    const [ready, setReady] = (0, import_react6.useState)(haIconReady);
    (0, import_react6.useEffect)(() => {
      if (ready || !override || typeof customElements === "undefined") return;
      let live = true;
      customElements.whenDefined("ha-icon").then(() => {
        if (live) setReady(true);
      });
      return () => {
        live = false;
      };
    }, [ready, override]);
    if (override && ready) {
      return (0, import_react6.createElement)("ha-icon", {
        icon: override,
        style: { ["--mdc-icon-size"]: `${size}px`, color: "currentColor", display: "inline-flex" }
      });
    }
    return fallback;
  }
  function renderIcon(override, size, fallback) {
    return (0, import_react6.createElement)(EntityIcon, { override, size, fallback });
  }

  // src/cards/light-color.ts
  init_define_import_meta_env();
  function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = (g - b) / d % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return [h, max === 0 ? 0 : d / max, max];
  }
  function hsvToRgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(h / 60 % 2 - 1));
    const m = v - c;
    let r, g, b;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }
  function tempTint(kelvin) {
    const t = Math.max(0, Math.min(1, (kelvin - 2e3) / (6500 - 2e3)));
    const warm = [255, 197, 110];
    const cool = [201, 221, 255];
    const mix = warm.map((w, i) => Math.round(w + (cool[i] - w) * t));
    return `${mix[0]}, ${mix[1]}, ${mix[2]}`;
  }
  function lightTint(attrs) {
    const rgb = attrs.rgb_color;
    if (Array.isArray(rgb) && rgb.length === 3) {
      const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
      const [r, g, b] = hsvToRgb(h, Math.max(s, 0.55), Math.max(v, 0.92));
      return `${r}, ${g}, ${b}`;
    }
    const kelvin = attrs.color_temp_kelvin ?? (attrs.color_temp ? Math.round(1e6 / attrs.color_temp) : void 0);
    if (kelvin) return tempTint(kelvin);
    return "var(--warm)";
  }
  function lightHasBrightness(attrs) {
    const modes = attrs.supported_color_modes;
    if (modes && modes.length) return modes.some((m) => m !== "onoff");
    return attrs.brightness != null;
  }

  // src/cards/LightCard.tsx
  var import_jsx_runtime2 = __toESM(require_react_shim(), 1);
  function LightCard({ config }) {
    const e = useEntity(config.entity);
    const call = useCallService();
    const moreInfo = useMoreInfo();
    const runTap = useActions();
    const dead = isUnavailable(e);
    const on = !!e && e.state === "on";
    const name = config.name ?? (e ? friendly(e) : config.entity);
    const hasBrightness = !!e && lightHasBrightness(e.attributes);
    const settable = !dead && hasBrightness;
    const tint = e && config.use_light_color !== false ? lightTint(e.attributes) : "var(--warm)";
    const brightness = e?.attributes.brightness ?? 0;
    const livePct = on ? Math.max(1, Math.round(brightness / 255 * 100)) : 0;
    const drag = useDragValue({
      value: livePct,
      axis: "vertical",
      step: 1,
      disabled: !settable,
      onCommit: (v) => call("light", "turn_on", { brightness_pct: v }, { entity_id: config.entity })
    });
    if (!config.entity) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "simui-tile is-unavailable", role: "button", "aria-label": "Select a light", tabIndex: 0, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "simui-tile-ic", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Lightbulb, { size: 20, strokeWidth: 2 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "simui-tile-name", children: "Select a light" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "simui-tile-state", children: "Set up" })
      ] });
    }
    const value = dead ? 0 : drag.value;
    const readout = dead ? "Unavailable" : !hasBrightness ? on ? "On" : "Off" : on ? `${value}%` : "Off";
    const onBody = () => {
      if (drag.moved()) return;
      runTap(config.tap_action, config.entity);
    };
    const onIcon = (ev) => {
      ev.stopPropagation();
      if (dead) return;
      call("light", on ? "turn_off" : "turn_on", {}, { entity_id: config.entity });
    };
    const onKeyDown = (ev) => {
      if (settable) {
        const next = stepKey(ev.key, value, 5, 0, 100);
        if (next != null) {
          ev.preventDefault();
          if (next === 0) call("light", "turn_off", {}, { entity_id: config.entity });
          else call("light", "turn_on", { brightness_pct: next }, { entity_id: config.entity });
          return;
        }
      }
      if (isActivateKey(ev.key)) {
        ev.preventDefault();
        runTap(config.tap_action, config.entity);
      }
    };
    const cls = `simui-tile${on ? " is-on" : ""}${drag.dragging ? " is-dragging" : ""}${dead ? " is-unavailable" : ""}`;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "div",
      {
        className: cls,
        style: { ["--tile-tint"]: tint },
        role: settable ? "slider" : "button",
        "aria-label": settable ? `${name} brightness` : name,
        "aria-valuemin": settable ? 0 : void 0,
        "aria-valuemax": settable ? 100 : void 0,
        "aria-valuenow": settable ? value : void 0,
        "aria-valuetext": settable ? `${value}%` : void 0,
        tabIndex: 0,
        onClick: onBody,
        onKeyDown,
        onContextMenu: (ev) => {
          ev.preventDefault();
          moreInfo(config.entity);
        },
        ...settable ? drag.handlers : {},
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              type: "button",
              className: "simui-tile-ic",
              "aria-label": on ? "Turn off" : "Turn on",
              onClick: onIcon,
              onPointerDown: (ev) => ev.stopPropagation(),
              onKeyDown: (ev) => ev.stopPropagation(),
              children: renderIcon(config.icon, 20, /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Lightbulb, { size: 20, strokeWidth: 2, ...on ? { fill: "currentColor", fillOpacity: 0.18 } : {} }))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "simui-tile-name", title: name, children: name }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "simui-tile-state", children: readout })
        ]
      }
    );
  }

  // src/cards/ClimateCard.tsx
  init_define_import_meta_env();

  // src/cards/climate-util.ts
  init_define_import_meta_env();
  function num(v) {
    return typeof v === "number" && !Number.isNaN(v) ? v : null;
  }
  var TINTS = {
    heating: "var(--heat)",
    heat: "var(--heat)",
    cooling: "var(--cool)",
    cool: "var(--cool)",
    fan: "var(--cool)",
    fan_only: "var(--cool)",
    drying: "var(--warm)",
    dry: "var(--warm)",
    idle: "var(--up)",
    auto: "var(--up)",
    heat_cool: "var(--up)"
  };
  var ICONS = {
    heating: Flame,
    heat: Flame,
    cooling: Snowflake,
    cool: Snowflake,
    drying: Droplets,
    dry: Droplets,
    fan: Fan,
    fan_only: Fan
  };
  function readClimate(e, dead) {
    const a = e?.attributes ?? {};
    const mode = e?.state ?? "off";
    const on = !!e && mode !== "off" && !dead;
    const action = a.hvac_action ?? (on ? mode : "off");
    const low = num(a.target_temp_low);
    const high = num(a.target_temp_high);
    const dual = low != null && high != null;
    const target = num(a.temperature);
    return {
      on,
      action,
      tint: on ? TINTS[action] ?? "var(--warm)" : "var(--warm)",
      Icon: ICONS[action] ?? Thermometer,
      current: num(a.current_temperature),
      target,
      low,
      high,
      dual,
      step: num(a.target_temp_step) ?? 0.5,
      min: num(a.min_temp) ?? 7,
      max: num(a.max_temp) ?? 35,
      settable: on && !dual && target != null
    };
  }
  function degrees(n) {
    return `${Number.isInteger(n) ? n : n.toFixed(1)}\xB0`;
  }

  // src/cards/ClimateCard.tsx
  var import_jsx_runtime3 = __toESM(require_react_shim(), 1);
  var PREFERRED_MODES = ["heat_cool", "auto", "heat", "cool", "dry", "fan_only"];
  function ClimateCard({ config }) {
    const e = useEntity(config.entity);
    const call = useCallService();
    const moreInfo = useMoreInfo();
    const runTap = useActions();
    const dead = isUnavailable(e);
    const v = readClimate(e, dead);
    const name = config.name ?? (e ? friendly(e) : config.entity);
    const drag = useDragValue({
      value: v.target ?? v.min,
      axis: "vertical",
      step: v.step,
      min: v.min,
      max: v.max,
      disabled: !v.settable,
      onCommit: (t) => call("climate", "set_temperature", { temperature: t }, { entity_id: config.entity })
    });
    if (!config.entity) {
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "simui-tile is-unavailable", role: "button", "aria-label": "Select a thermostat", tabIndex: 0, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "simui-tile-ic", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Thermometer, { size: 20, strokeWidth: 2 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "simui-tile-name", children: "Select a thermostat" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "simui-tile-state", children: "Set up" })
      ] });
    }
    const target = v.settable ? drag.value : v.target;
    const stateLine = dead ? "Unavailable" : !v.on ? "Off" : v.dual && v.low != null && v.high != null ? `${degrees(v.low)}\u2013${degrees(v.high)}` : target != null ? v.current != null ? `${degrees(v.current)} \u2192 ${degrees(target)}` : degrees(target) : v.current != null ? degrees(v.current) : prettyState(e?.state ?? "off");
    const onBody = () => {
      if (drag.moved()) return;
      runTap(config.tap_action, config.entity);
    };
    const onIcon = (ev) => {
      ev.stopPropagation();
      if (dead) return;
      if (v.on) {
        call("climate", "set_hvac_mode", { hvac_mode: "off" }, { entity_id: config.entity });
        return;
      }
      const modes = e?.attributes.hvac_modes ?? [];
      const primary = PREFERRED_MODES.find((m) => modes.includes(m)) ?? modes.find((m) => m !== "off");
      if (!primary) return;
      call("climate", "set_hvac_mode", { hvac_mode: primary }, { entity_id: config.entity });
    };
    const onKeyDown = (ev) => {
      if (v.settable && target != null) {
        const next = stepKey(ev.key, target, v.step, v.min, v.max);
        if (next != null) {
          ev.preventDefault();
          call("climate", "set_temperature", { temperature: next }, { entity_id: config.entity });
          return;
        }
      }
      if (isActivateKey(ev.key)) {
        ev.preventDefault();
        runTap(config.tap_action, config.entity);
      }
    };
    const Icon2 = v.Icon;
    const settable = v.settable;
    const cls = `simui-tile${v.on ? " is-on" : ""}${drag.dragging ? " is-dragging" : ""}${dead ? " is-unavailable" : ""}`;
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        className: cls,
        style: { ["--tile-tint"]: v.tint },
        role: settable ? "slider" : "button",
        "aria-label": settable ? `${name} target temperature` : name,
        "aria-valuemin": settable ? v.min : void 0,
        "aria-valuemax": settable ? v.max : void 0,
        "aria-valuenow": settable && target != null ? target : void 0,
        "aria-valuetext": settable && target != null ? degrees(target) : void 0,
        tabIndex: 0,
        onClick: onBody,
        onKeyDown,
        onContextMenu: (ev) => {
          ev.preventDefault();
          moreInfo(config.entity);
        },
        ...settable ? drag.handlers : {},
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              type: "button",
              className: "simui-tile-ic",
              "aria-label": v.on ? "Turn off" : "Turn on",
              onClick: onIcon,
              onPointerDown: (ev) => ev.stopPropagation(),
              onKeyDown: (ev) => ev.stopPropagation(),
              children: renderIcon(config.icon, 20, /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon2, { size: 20, strokeWidth: 2 }))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "simui-tile-name", title: name, children: name }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "simui-tile-state", children: stateLine })
        ]
      }
    );
  }

  // src/cards/SensorCard.tsx
  init_define_import_meta_env();

  // src/cards/sensor-util.ts
  init_define_import_meta_env();
  var ICONS2 = {
    temperature: Thermometer,
    humidity: Droplets,
    moisture: Droplets,
    precipitation: CloudRain,
    precipitation_intensity: CloudRain,
    power: Zap,
    energy: Zap,
    current: Zap,
    voltage: Zap,
    power_factor: Zap,
    pressure: Gauge,
    atmospheric_pressure: Gauge,
    illuminance: Sun,
    irradiance: Sun,
    battery: BatteryMedium,
    carbon_dioxide: Wind,
    carbon_monoxide: Wind,
    pm25: Wind,
    pm10: Wind,
    pm1: Wind,
    volatile_organic_compounds: FlaskConical,
    aqi: Wind,
    sound_pressure: Volume2,
    signal_strength: Signal,
    speed: WavesHorizontal,
    wind_speed: Wind,
    duration: Timer,
    monetary: DollarSign
  };
  var TINTS2 = {
    temperature: "var(--warm)",
    humidity: "var(--cool)",
    moisture: "var(--cool)",
    precipitation: "var(--cool)",
    power: "var(--warm)",
    energy: "var(--warm)",
    current: "var(--warm)",
    voltage: "var(--warm)",
    pressure: "var(--up)",
    atmospheric_pressure: "var(--up)",
    illuminance: "var(--warm)",
    battery: "var(--up)",
    carbon_dioxide: "var(--up)",
    carbon_monoxide: "var(--down)",
    pm25: "var(--up)",
    pm10: "var(--up)",
    aqi: "var(--up)",
    monetary: "var(--up)"
  };
  var VALID_COLORS = /* @__PURE__ */ new Set(["warm", "cool", "up", "down", "grey"]);
  function sensorIcon(deviceClass) {
    return deviceClass && ICONS2[deviceClass] || Activity;
  }
  function sensorTint(deviceClass) {
    return deviceClass && TINTS2[deviceClass] || "var(--grey)";
  }
  function formatSensor(e) {
    const unit = e.attributes.unit_of_measurement;
    const numeric = e.state.trim() !== "" && !Number.isNaN(Number(e.state));
    if (unit && numeric) {
      const sep = unit === "%" || unit.startsWith("\xB0") ? "" : " ";
      return `${e.state}${sep}${unit}`;
    }
    return prettyState(e.state);
  }

  // src/cards/SensorCard.tsx
  var import_jsx_runtime4 = __toESM(require_react_shim(), 1);
  function SensorCard({ config }) {
    const e = useEntity(config.entity);
    const moreInfo = useMoreInfo();
    const runTap = useActions();
    const dead = isUnavailable(e);
    const dc = e?.attributes.device_class;
    const Icon2 = sensorIcon(dc);
    const tint = config.color && VALID_COLORS.has(config.color) ? `var(--${config.color})` : sensorTint(dc);
    const name = config.name ?? (e ? friendly(e) : config.entity);
    const value = !config.entity ? "\u2014" : dead ? "Unavailable" : e ? formatSensor(e) : "Unknown";
    const binary = !!e && domainOf(e.entity_id) === "binary_sensor";
    const active = !dead && !!e && (!binary || e.state === "on");
    const open = () => config.entity && runTap(config.tap_action, config.entity);
    const cls = `simui-tile${active ? " is-on" : ""}${dead ? " is-unavailable" : ""}`;
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "div",
      {
        className: cls,
        style: { ["--tile-tint"]: tint },
        role: "button",
        "aria-label": `${name}: ${value}`,
        tabIndex: 0,
        onClick: open,
        onKeyDown: (ev) => {
          if (isActivateKey(ev.key)) {
            ev.preventDefault();
            open();
          }
        },
        onContextMenu: (ev) => {
          ev.preventDefault();
          if (config.entity) moreInfo(config.entity);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "simui-tile-ic", "aria-hidden": "true", children: renderIcon(config.icon, 20, /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon2, { size: 20, strokeWidth: 2 })) }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "simui-tile-name simui-tile-value", title: value, children: value }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "simui-tile-state", title: name, children: config.entity ? name : "Select a sensor" })
        ]
      }
    );
  }

  // src/cards/GraphCard.tsx
  init_define_import_meta_env();
  var import_react9 = __toESM(require_react_shim(), 1);

  // src/hooks/useSize.ts
  init_define_import_meta_env();
  var import_react7 = __toESM(require_react_shim(), 1);
  function useSize() {
    const ref = (0, import_react7.useRef)(null);
    const [size, setSize] = (0, import_react7.useState)({ width: 0, height: 0 });
    (0, import_react7.useEffect)(() => {
      const el = ref.current;
      if (!el) return;
      const measure = () => {
        const r = el.getBoundingClientRect();
        setSize({ width: Math.round(r.width), height: Math.round(r.height) });
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);
    return [ref, size];
  }

  // src/cards/HistoryChart.tsx
  init_define_import_meta_env();
  var import_react8 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime5 = __toESM(require_react_shim(), 1);
  var PAD_TOP = 10;
  var PAD_BOTTOM = 18;
  var PAD_X = 1;
  var fmtVal = (v, locale) => Math.abs(v) >= 100 ? Math.round(v).toLocaleString(locale) : (Math.round(v * 10) / 10).toLocaleString(locale, { maximumFractionDigits: 1 });
  function fmtTime(t, hours, locale) {
    const d = new Date(t);
    if (hours <= 48) return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString(locale, { month: "short", day: "numeric" });
  }
  function fmtStamp(t, hours, locale) {
    const d = new Date(t);
    const time = d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    return hours <= 48 ? time : `${d.toLocaleDateString(locale, { month: "short", day: "numeric" })} ${time}`;
  }
  function downsample(points, targetN) {
    if (points.length <= targetN || targetN < 2) return points;
    const out = [];
    const bucket = points.length / targetN;
    for (let i = 0; i < targetN; i++) {
      const lo = Math.floor(i * bucket);
      const hi = Math.min(points.length, Math.floor((i + 1) * bucket));
      let st = 0;
      let sv = 0;
      for (let j = lo; j < hi; j++) {
        st += points[j].t;
        sv += points[j].v;
      }
      const n = hi - lo || 1;
      out.push({ t: st / n, v: sv / n });
    }
    return out;
  }
  function HistoryChart({ points, width, height, hours, unit, fill, lineWidth, ariaLabel, locale }) {
    const gradId = (0, import_react8.useId)();
    const [hoverT, setHoverT] = (0, import_react8.useState)(null);
    const view = (0, import_react8.useMemo)(() => {
      if (width < 8 || height < 8 || points.length < 2) return null;
      const plotW = width - 2 * PAD_X;
      const plotH = height - PAD_TOP - PAD_BOTTOM;
      const data2 = downsample(points, Math.max(40, Math.round(plotW)));
      const tMin2 = data2[0].t;
      const tMax2 = data2[data2.length - 1].t;
      const tSpan = tMax2 - tMin2 || 1;
      let vMin2 = Infinity;
      let vMax2 = -Infinity;
      let vSum = 0;
      for (const p of data2) {
        if (p.v < vMin2) vMin2 = p.v;
        if (p.v > vMax2) vMax2 = p.v;
        vSum += p.v;
      }
      const vAvg2 = vSum / data2.length;
      const raw = vMax2 - vMin2;
      const pad = raw === 0 ? Math.max(1, Math.abs(vMax2) * 0.1) : raw * 0.14;
      const lo = vMin2 - pad;
      const hi = vMax2 + pad;
      const vSpan = hi - lo || 1;
      const x = (t) => PAD_X + (t - tMin2) / tSpan * plotW;
      const y2 = (v) => PAD_TOP + (1 - (v - lo) / vSpan) * plotH;
      const xy2 = data2.map((p) => [x(p.t), y2(p.v)]);
      const line2 = xy2.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
      const baseY2 = PAD_TOP + plotH;
      const area2 = `${line2} L${xy2[xy2.length - 1][0].toFixed(1)} ${baseY2} L${xy2[0][0].toFixed(1)} ${baseY2} Z`;
      return { data: data2, xy: xy2, line: line2, area: area2, baseY: baseY2, tMin: tMin2, tMax: tMax2, vMin: vMin2, vMax: vMax2, vAvg: vAvg2, y: y2 };
    }, [points, width, height]);
    if (!view) return null;
    const { data, xy, line, area, baseY, tMin, tMax, vMin, vMax, vAvg, y } = view;
    const last = xy[xy.length - 1];
    const nearestByX = (px) => {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < xy.length; i++) {
        const d = Math.abs(xy[i][0] - px);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best;
    };
    const onMove = (ev) => {
      const rect = ev.currentTarget.getBoundingClientRect();
      setHoverT(data[nearestByX(ev.clientX - rect.left)].t);
    };
    const clear = () => setHoverT(null);
    let hoverIdx = null;
    if (hoverT != null) {
      let bestD = Infinity;
      for (let i = 0; i < data.length; i++) {
        const d = Math.abs(data[i].t - hoverT);
        if (d < bestD) {
          bestD = d;
          hoverIdx = i;
        }
      }
    }
    const hp = hoverIdx != null ? data[hoverIdx] : null;
    const hxy = hoverIdx != null ? xy[hoverIdx] : null;
    const tipLeft = hxy ? Math.min(Math.max(hxy[0], 4), width - 4) : 0;
    const tipFlip = hxy ? hxy[0] > width * 0.6 : false;
    const tickCount = tMax === tMin ? 1 : width < 220 ? 2 : width < 360 ? 3 : 4;
    const ticks = Array.from({ length: tickCount }, (_, i) => {
      const f = tickCount === 1 ? 0.5 : i / (tickCount - 1);
      return { x: PAD_X + f * (width - 2 * PAD_X), t: tMin + f * (tMax - tMin), i };
    });
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { className: "simui-graph-svg", width, height, viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": ariaLabel, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("title", { children: ariaLabel }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("linearGradient", { id: gradId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("stop", { offset: "0%", style: { stopColor: "rgb(var(--tile-tint))", stopOpacity: 0.24 } }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("stop", { offset: "55%", style: { stopColor: "rgb(var(--tile-tint))", stopOpacity: 0.06 } }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("stop", { offset: "100%", style: { stopColor: "rgb(var(--tile-tint))", stopOpacity: 0 } })
        ] }) }),
        [vMax, vAvg, vMin].map((v, i) => {
          const gy = y(v);
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { className: "simui-graph-grid", x1: PAD_X, y1: gy, x2: width - PAD_X, y2: gy }, i);
        }),
        fill && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { className: "simui-graph-area", d: area, fill: `url(#${gradId})` }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { className: "simui-graph-line", d: line, style: { strokeWidth: lineWidth } }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("circle", { className: "simui-graph-end", cx: last[0], cy: last[1], r: 3 }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("text", { className: "simui-graph-axis", x: width - PAD_X - 2, y: y(vMax) - 3, textAnchor: "end", children: fmtVal(vMax, locale) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("text", { className: "simui-graph-axis", x: width - PAD_X - 2, y: y(vMin) + 10, textAnchor: "end", children: fmtVal(vMin, locale) }),
        ticks.map((tk) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "text",
          {
            className: "simui-graph-axis",
            x: tk.x,
            y: height - 5,
            textAnchor: tickCount === 1 ? "middle" : tk.i === 0 ? "start" : tk.i === tickCount - 1 ? "end" : "middle",
            children: fmtTime(tk.t, hours, locale)
          },
          tk.i
        )),
        hxy && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("g", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { className: "simui-graph-cross", x1: hxy[0], y1: PAD_TOP, x2: hxy[0], y2: baseY }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("circle", { className: "simui-graph-dot", cx: hxy[0], cy: hxy[1], r: 3.5 })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "rect",
          {
            x: 0,
            y: 0,
            width,
            height,
            fill: "transparent",
            onPointerMove: onMove,
            onPointerDown: onMove,
            onPointerLeave: clear,
            onPointerUp: clear,
            onPointerCancel: clear
          }
        )
      ] }),
      hp && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "simui-graph-tip", style: { left: tipLeft, transform: `translateX(${tipFlip ? "-100%" : "0"})` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "simui-graph-tip-v", children: [
          fmtVal(hp.v, locale),
          unit && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "simui-graph-tip-u", children: unit })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "simui-graph-tip-t", children: fmtStamp(hp.t, hours, locale) })
      ] })
    ] });
  }

  // src/cards/GraphCard.tsx
  var import_jsx_runtime6 = __toESM(require_react_shim(), 1);
  var rangeLabel = (h) => h < 48 ? `${h}h` : h % 24 === 0 ? `${h / 24}d` : `${h}h`;
  function GraphCard({ config }) {
    const e = useEntity(config.entity);
    const moreInfo = useMoreInfo();
    const runTap = useActions();
    const locale = useLanguage();
    const dead = isUnavailable(e);
    const ranges = config.ranges ?? [1, 12, 24, 168];
    const [hours, setHours] = (0, import_react9.useState)(config.hours ?? 24);
    (0, import_react9.useEffect)(() => setHours(config.hours ?? 24), [config.hours]);
    const { points: hist, loading, error } = useHistory(config.entity, hours);
    const [ref, size] = useSize();
    const dc = e?.attributes.device_class;
    const Icon2 = sensorIcon(dc);
    const tint = config.color && VALID_COLORS.has(config.color) ? `var(--${config.color})` : sensorTint(dc);
    const unit = e?.attributes.unit_of_measurement ?? "";
    const name = config.name ?? (e ? friendly(e) : config.entity);
    const live = e && !dead ? Number(e.state) : NaN;
    const points = (0, import_react9.useMemo)(() => {
      const pts = hist.slice();
      if (!Number.isNaN(live)) {
        const now = Date.now();
        if (pts.length && now - pts[pts.length - 1].t < 1e3) pts[pts.length - 1] = { t: now, v: live };
        else pts.push({ t: now, v: live });
      }
      return pts;
    }, [hist, live]);
    const stats = (0, import_react9.useMemo)(() => {
      if (!points.length) return null;
      let min = Infinity;
      let max = -Infinity;
      let sum = 0;
      for (const p of points) {
        if (p.v < min) min = p.v;
        if (p.v > max) max = p.v;
        sum += p.v;
      }
      return { min, max, avg: sum / points.length };
    }, [points]);
    const fmt2 = (v) => Math.abs(v) >= 100 ? Math.round(v).toLocaleString(locale) : (Math.round(v * 10) / 10).toLocaleString(locale, { maximumFractionDigits: 1 });
    const valueText = !config.entity ? "\u2014" : dead ? "Unavailable" : e ? formatSensor(e) : "Unknown";
    const chartLabel = stats ? `${name} history, last ${rangeLabel(hours)}, ${fmt2(stats.min)} to ${fmt2(stats.max)}${unit ? ` ${unit}` : ""}` : `${name} history`;
    const open = () => config.entity && runTap(config.tap_action, config.entity);
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "simui-graph", style: { ["--tile-tint"]: tint }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        "div",
        {
          className: "simui-graph-head",
          role: "button",
          "aria-label": `${name}: ${valueText}`,
          tabIndex: 0,
          onClick: open,
          onKeyDown: (ev) => {
            if (isActivateKey(ev.key)) {
              ev.preventDefault();
              open();
            }
          },
          onContextMenu: (ev) => {
            ev.preventDefault();
            if (config.entity) moreInfo(config.entity);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "simui-graph-ic", "aria-hidden": "true", children: renderIcon(config.icon, 18, /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon2, { size: 18, strokeWidth: 2 })) }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "simui-graph-title", title: name, children: config.entity ? name : "Select a sensor" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "simui-graph-value", children: valueText })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "simui-graph-chart", ref, children: points.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        HistoryChart,
        {
          points,
          width: size.width,
          height: size.height,
          hours,
          unit,
          fill: config.fill !== false,
          lineWidth: config.line_width ?? 2,
          ariaLabel: chartLabel,
          locale
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "simui-graph-empty", children: !config.entity ? "Pick a sensor to chart" : error ? error : loading ? "Loading history\u2026" : "Not enough history yet" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "simui-graph-foot", children: [
        config.entity && ranges.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "simui-graph-ranges", role: "group", "aria-label": "Range", children: ranges.map((h) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "button",
          {
            type: "button",
            className: `simui-graph-range${h === hours ? " on" : ""}`,
            "aria-pressed": h === hours,
            onClick: () => setHours(h),
            children: rangeLabel(h)
          },
          h
        )) }),
        stats && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "simui-graph-stats", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
            "min ",
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: fmt2(stats.min) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
            "avg ",
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: fmt2(stats.avg) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
            "max ",
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: fmt2(stats.max) })
          ] })
        ] })
      ] })
    ] });
  }

  // src/cards/CoverCard.tsx
  init_define_import_meta_env();

  // src/cards/cover-util.ts
  init_define_import_meta_env();
  var COVER_OPEN = 1;
  var COVER_CLOSE = 2;
  var COVER_SET_POSITION = 4;
  var COVER_STOP = 8;
  function coverIcon(dc, open) {
    if (dc === "garage") return Warehouse;
    if (dc === "door" || dc === "gate") return open ? DoorOpen : DoorClosed;
    return Blinds;
  }
  function readCover(e, dead) {
    const a = e?.attributes ?? {};
    const state = e?.state ?? "closed";
    const position = typeof a.current_position === "number" ? a.current_position : null;
    const moving = state === "opening" || state === "closing";
    const open = state === "open" || state === "opening" || position != null && position > 0;
    const label = moving ? prettyState(state) : position != null ? position === 0 ? "Closed" : position === 100 ? "Open" : `${position}% open` : prettyState(state);
    return {
      position,
      open,
      moving,
      settable: !dead && !!e && supportsFeature(e, COVER_SET_POSITION) && position != null,
      canOpen: !!e && supportsFeature(e, COVER_OPEN),
      canClose: !!e && supportsFeature(e, COVER_CLOSE),
      canStop: !!e && supportsFeature(e, COVER_STOP),
      Icon: coverIcon(a.device_class, open),
      tint: "var(--cool)",
      label
    };
  }

  // src/cards/CoverCard.tsx
  var import_jsx_runtime7 = __toESM(require_react_shim(), 1);
  function CoverCard({ config }) {
    const e = useEntity(config.entity);
    const call = useCallService();
    const moreInfo = useMoreInfo();
    const runTap = useActions();
    const dead = isUnavailable(e);
    const v = readCover(e, dead);
    const name = config.name ?? (e ? friendly(e) : config.entity);
    const drag = useDragValue({
      value: v.position ?? 0,
      axis: "vertical",
      step: 1,
      disabled: !v.settable,
      onCommit: (p) => call("cover", "set_cover_position", { position: p }, { entity_id: config.entity })
    });
    if (!config.entity) {
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "simui-tile is-unavailable", role: "button", "aria-label": "Select a cover", tabIndex: 0, children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "simui-tile-ic", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Blinds, { size: 20, strokeWidth: 2 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "simui-tile-name", children: "Select a cover" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "simui-tile-state", children: "Set up" })
      ] });
    }
    const position = v.settable ? drag.value : v.position;
    const label = v.settable && !v.moving && position != null ? position === 0 ? "Closed" : position === 100 ? "Open" : `${position}% open` : v.label;
    const onBody = () => {
      if (drag.moved()) return;
      runTap(config.tap_action, config.entity);
    };
    const closed = v.position != null ? v.position === 0 : e?.state === "closed";
    const onIcon = (ev) => {
      ev.stopPropagation();
      if (dead) return;
      if (v.moving) {
        if (v.canStop) call("cover", "stop_cover", {}, { entity_id: config.entity });
        return;
      }
      if (closed) {
        if (v.canOpen) call("cover", "open_cover", {}, { entity_id: config.entity });
        else if (v.settable) call("cover", "set_cover_position", { position: 100 }, { entity_id: config.entity });
      } else {
        if (v.canClose) call("cover", "close_cover", {}, { entity_id: config.entity });
        else if (v.settable) call("cover", "set_cover_position", { position: 0 }, { entity_id: config.entity });
      }
    };
    const onKeyDown = (ev) => {
      if (v.settable && position != null) {
        const next = stepKey(ev.key, position, 5, 0, 100);
        if (next != null) {
          ev.preventDefault();
          call("cover", "set_cover_position", { position: next }, { entity_id: config.entity });
          return;
        }
      }
      if (isActivateKey(ev.key)) {
        ev.preventDefault();
        onBody();
      }
    };
    const Icon2 = v.Icon;
    const settable = v.settable;
    const discActionable = v.moving ? v.canStop : closed ? v.canOpen || v.settable : v.canClose || v.settable;
    const discLabel = v.moving ? v.canStop ? "Stop" : "Moving" : closed ? "Open" : "Close";
    const cls = `simui-tile${v.open ? " is-on" : ""}${drag.dragging ? " is-dragging" : ""}${dead ? " is-unavailable" : ""}`;
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        className: cls,
        style: { ["--tile-tint"]: v.tint },
        role: settable ? "slider" : "button",
        "aria-label": settable ? `${name} position` : name,
        "aria-valuemin": settable ? 0 : void 0,
        "aria-valuemax": settable ? 100 : void 0,
        "aria-valuenow": settable && position != null ? position : void 0,
        "aria-valuetext": settable && position != null ? `${position}% open` : void 0,
        tabIndex: 0,
        onClick: onBody,
        onKeyDown,
        onContextMenu: (ev) => {
          ev.preventDefault();
          moreInfo(config.entity);
        },
        ...settable ? drag.handlers : {},
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "button",
            {
              type: "button",
              className: "simui-tile-ic",
              "aria-label": discLabel,
              disabled: !discActionable,
              onClick: onIcon,
              onPointerDown: (ev) => ev.stopPropagation(),
              onKeyDown: (ev) => ev.stopPropagation(),
              children: renderIcon(config.icon, 20, /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon2, { size: 20, strokeWidth: 2 }))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "simui-tile-name", title: name, children: name }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "simui-tile-state", children: dead ? "Unavailable" : label })
        ]
      }
    );
  }

  // src/cards/LockCard.tsx
  init_define_import_meta_env();
  var import_jsx_runtime8 = __toESM(require_react_shim(), 1);
  var TINT = {
    locked: "var(--up)",
    unlocked: "var(--warm)",
    open: "var(--warm)",
    jammed: "var(--down)",
    locking: "var(--cool)",
    unlocking: "var(--cool)"
  };
  function LockCard({ config }) {
    const e = useEntity(config.entity);
    const call = useCallService();
    const moreInfo = useMoreInfo();
    const runTap = useActions();
    const dead = isUnavailable(e);
    const state = e?.state ?? "unknown";
    const locked = state === "locked";
    const name = config.name ?? (e ? friendly(e) : config.entity);
    const tint = TINT[state] ?? "var(--cool)";
    const Icon2 = locked || state === "locking" || state === "jammed" ? Lock : LockOpen;
    const transitioning = state === "locking" || state === "unlocking";
    const open = () => config.entity && runTap(config.tap_action, config.entity);
    const onIcon = (ev) => {
      ev.stopPropagation();
      if (dead || !config.entity || transitioning) return;
      call("lock", locked ? "unlock" : "lock", {}, { entity_id: config.entity });
    };
    if (!config.entity) {
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "simui-tile is-unavailable", role: "button", "aria-label": "Select a lock", tabIndex: 0, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "simui-tile-ic", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Lock, { size: 20, strokeWidth: 2 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "simui-tile-name", children: "Select a lock" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "simui-tile-state", children: "Set up" })
      ] });
    }
    const cls = `simui-tile${!dead ? " is-on" : ""}${dead ? " is-unavailable" : ""}`;
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
      "div",
      {
        className: cls,
        style: { ["--tile-tint"]: tint },
        role: "button",
        "aria-label": `${name}: ${prettyState(state)}`,
        tabIndex: 0,
        onClick: open,
        onKeyDown: (ev) => {
          if (isActivateKey(ev.key)) {
            ev.preventDefault();
            open();
          }
        },
        onContextMenu: (ev) => {
          ev.preventDefault();
          if (config.entity) moreInfo(config.entity);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "button",
            {
              type: "button",
              className: "simui-tile-ic",
              "aria-label": state === "locking" ? "Locking" : state === "unlocking" ? "Unlocking" : locked ? "Unlock" : "Lock",
              disabled: transitioning,
              onClick: onIcon,
              onPointerDown: (ev) => ev.stopPropagation(),
              onKeyDown: (ev) => ev.stopPropagation(),
              children: renderIcon(config.icon, 20, /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon2, { size: 20, strokeWidth: 2 }))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "simui-tile-name", title: name, children: name }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "simui-tile-state", children: dead ? "Unavailable" : prettyState(state) })
        ]
      }
    );
  }

  // src/cards/MediaCard.tsx
  init_define_import_meta_env();

  // src/cards/media-util.ts
  init_define_import_meta_env();
  var MEDIA_PAUSE = 1;
  var MEDIA_PREVIOUS = 16;
  var MEDIA_NEXT = 32;
  var MEDIA_PLAY = 16384;
  var INACTIVE = /* @__PURE__ */ new Set(["off", "idle", "standby", "unavailable", "unknown"]);
  var SAFE_ART = /^(https?:\/\/|\/)[^"'()\s]+$/;
  function readMedia(e, dead) {
    const a = e?.attributes ?? {};
    const state = e?.state ?? "off";
    const rawArt = a.entity_picture;
    return {
      state,
      playing: state === "playing" || state === "buffering",
      active: !dead && !INACTIVE.has(state),
      mediaTitle: a.media_title || "",
      mediaSub: a.media_artist || a.media_series_title || a.media_album_name || a.app_name || "",
      art: rawArt && SAFE_ART.test(rawArt) ? rawArt : null,
      tint: "var(--cool)"
    };
  }

  // src/cards/MediaCard.tsx
  var import_jsx_runtime9 = __toESM(require_react_shim(), 1);
  function MediaCard({ config }) {
    const e = useEntity(config.entity);
    const call = useCallService();
    const moreInfo = useMoreInfo();
    const runTap = useActions();
    const dead = isUnavailable(e);
    const name = config.name ?? (e ? friendly(e) : config.entity);
    const v = readMedia(e, dead);
    const hasTrack = v.active && !!v.mediaTitle;
    const title = !config.entity ? "Select a media player" : hasTrack ? v.mediaTitle : name;
    const subtitle = !config.entity ? "Set up" : dead ? "Unavailable" : hasTrack ? v.mediaSub || name : prettyState(v.state);
    const supports = (bit) => !!e && supportsFeature(e, bit);
    const ctl = (service) => (ev) => {
      ev.stopPropagation();
      if (config.entity) call("media_player", service, {}, { entity_id: config.entity });
    };
    const stopKey = (ev) => ev.stopPropagation();
    const open = () => config.entity && runTap(config.tap_action, config.entity);
    const cls = `simui-media${v.active ? " is-on" : ""}${dead || !config.entity ? " is-unavailable" : ""}`;
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
      "div",
      {
        className: cls,
        style: { ["--tile-tint"]: v.tint },
        role: "button",
        "aria-label": `${name}: ${subtitle}`,
        tabIndex: 0,
        onClick: open,
        onKeyDown: (ev) => {
          if (isActivateKey(ev.key)) {
            ev.preventDefault();
            open();
          }
        },
        onContextMenu: (ev) => {
          ev.preventDefault();
          if (config.entity) moreInfo(config.entity);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            "span",
            {
              className: "simui-media-art",
              style: v.art ? { backgroundImage: `url("${v.art}")` } : void 0,
              "aria-hidden": "true",
              children: !v.art && renderIcon(config.icon, 20, /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Music, { size: 20, strokeWidth: 2 }))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "simui-media-body", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "simui-media-title", title, children: title }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "simui-media-sub", title: subtitle, children: subtitle })
          ] }),
          config.entity && !dead && v.active && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "simui-media-ctrl", children: [
            supports(MEDIA_PREVIOUS) && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "button", className: "simui-media-btn", "aria-label": "Previous", onClick: ctl("media_previous_track"), onKeyDown: stopKey, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SkipBack, { size: 17, fill: "currentColor" }) }),
            (supports(MEDIA_PLAY) || supports(MEDIA_PAUSE)) && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "button",
              {
                type: "button",
                className: "simui-media-btn primary",
                "aria-label": v.playing ? "Pause" : "Play",
                onClick: ctl("media_play_pause"),
                onKeyDown: stopKey,
                children: v.playing ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Pause, { size: 20, fill: "currentColor" }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Play, { size: 20, fill: "currentColor" })
              }
            ),
            supports(MEDIA_NEXT) && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "button", className: "simui-media-btn", "aria-label": "Next", onClick: ctl("media_next_track"), onKeyDown: stopKey, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SkipForward, { size: 17, fill: "currentColor" }) })
          ] })
        ]
      }
    );
  }

  // src/cards/ChipsCard.tsx
  init_define_import_meta_env();

  // src/cards/chip-util.ts
  init_define_import_meta_env();
  function chipView(entity, entityId) {
    const dead = isUnavailable(entity);
    if (!entity) return { Icon: CircleQuestionMark, tint: "var(--grey)", active: false, dead: true, label: "\u2014" };
    const state = entity.state;
    const a = entity.attributes;
    const dc = a.device_class;
    switch (domainOf(entityId)) {
      case "light": {
        const on = state === "on";
        const bri = a.brightness;
        const label = !on ? "Off" : lightHasBrightness(a) && bri != null ? `${Math.max(1, Math.round(bri / 2.55))}%` : "On";
        return { Icon: Lightbulb, tint: on ? lightTint(a) : "var(--warm)", active: on, dead, label };
      }
      case "switch":
      case "input_boolean": {
        const on = state === "on";
        return { Icon: on ? ToggleRight : Power, tint: "var(--warm)", active: on, dead, label: on ? "On" : "Off" };
      }
      case "fan": {
        const on = state === "on";
        return { Icon: Fan, tint: "var(--cool)", active: on, dead, label: on ? "On" : "Off" };
      }
      case "climate": {
        const v = readClimate(entity, dead);
        return { Icon: v.Icon, tint: v.tint, active: v.on, dead, label: v.current != null ? `${Math.round(v.current)}\xB0` : prettyState(state) };
      }
      case "cover": {
        const v = readCover(entity, dead);
        return { Icon: v.Icon, tint: v.tint, active: v.open, dead, label: v.label };
      }
      case "lock": {
        const locked = state === "locked";
        const tint = locked ? "var(--up)" : state === "jammed" ? "var(--down)" : "var(--warm)";
        const Icon2 = locked || state === "locking" || state === "jammed" ? Lock : LockOpen;
        return { Icon: Icon2, tint, active: !dead, dead, label: prettyState(state) };
      }
      case "media_player": {
        const v = readMedia(entity, dead);
        return { Icon: Music, tint: "var(--cool)", active: v.active, dead, label: v.active && v.mediaTitle ? v.mediaTitle : prettyState(state) };
      }
      case "binary_sensor": {
        const on = state === "on";
        return { Icon: sensorIcon(dc), tint: sensorTint(dc), active: on, dead, label: prettyState(state) };
      }
      case "sensor":
        return { Icon: sensorIcon(dc), tint: sensorTint(dc), active: !dead, dead, label: dead ? "\u2014" : formatSensor(entity) };
      case "person":
      case "device_tracker": {
        const home = state === "home";
        return { Icon: MapPin, tint: home ? "var(--up)" : "var(--grey)", active: home, dead, label: prettyState(state) };
      }
      case "alarm_control_panel": {
        const armed = state !== "disarmed";
        return { Icon: armed ? ShieldAlert : ShieldCheck, tint: armed ? "var(--down)" : "var(--up)", active: armed, dead, label: prettyState(state) };
      }
      default: {
        const unit = a.unit_of_measurement;
        const active = !dead && state !== "off" && state !== "closed";
        return { Icon: sensorIcon(dc), tint: sensorTint(dc), active, dead, label: dead ? "\u2014" : unit ? formatSensor(entity) : prettyState(state) };
      }
    }
  }

  // src/cards/ChipsCard.tsx
  var import_jsx_runtime10 = __toESM(require_react_shim(), 1);
  function ChipsCard({ config }) {
    const hass = useHass();
    const moreInfo = useMoreInfo();
    const ids2 = config.entities ?? [];
    if (ids2.length === 0) {
      return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "simui-chips simui-chips-empty", children: "Add entities to show as chips" });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "simui-chips", children: ids2.map((id) => {
      const e = hass.states[id];
      const v = chipView(e, id);
      const Icon2 = v.Icon;
      const name = e ? friendly(e) : id;
      return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
        "button",
        {
          type: "button",
          className: `simui-chip${v.active ? " is-on" : ""}${v.dead ? " is-unavailable" : ""}`,
          style: { ["--tile-tint"]: v.tint },
          "aria-label": `${name}: ${v.label}`,
          title: name,
          onClick: () => moreInfo(id),
          onContextMenu: (ev) => {
            ev.preventDefault();
            moreInfo(id);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "simui-chip-ic", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Icon2, { size: 16, strokeWidth: 2 }) }),
            v.label && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "simui-chip-label", children: v.label })
          ]
        },
        id
      );
    }) });
  }

  // src/cards/EnergyFlowCard.tsx
  init_define_import_meta_env();
  var import_jsx_runtime11 = __toESM(require_react_shim(), 1);
  var VB_W = 260;
  var VB_H = 180;
  var HUB = { x: VB_W / 2, y: 104 };
  var POS = {
    solar: { x: VB_W / 2, y: 36 },
    grid: { x: 40, y: HUB.y },
    battery: { x: VB_W - 40, y: HUB.y },
    load: HUB
  };
  var ACTIVE_KW = 0.05;
  var Sun2 = () => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Sun, { size: 20, strokeWidth: 2 });
  var House2 = () => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(House, { size: 20, strokeWidth: 2 });
  var Utility = () => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Zap, { size: 20, strokeWidth: 2 });
  var Battery = ({ soc }) => {
    const pct = soc == null ? 0 : Math.min(100, Math.max(0, soc));
    const w = pct / 100 * 11;
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("svg", { width: 22, height: 20, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("rect", { x: "2", y: "7", width: "16", height: "10", rx: "2.2", stroke: "currentColor", strokeWidth: "2" }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("rect", { x: "20", y: "10", width: "2.4", height: "4", rx: "1", fill: "currentColor" }),
      soc != null && w > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("rect", { x: "3.5", y: "8.5", width: w, height: "7", rx: "1", fill: "currentColor" })
    ] });
  };
  function numVal(e) {
    if (isUnavailable(e) || !e) return { kw: 0, dead: true };
    const n = Number(e.state);
    if (!Number.isFinite(n)) return { kw: 0, dead: true };
    const unit = e.attributes.unit_of_measurement;
    const kw = unit === "kW" ? n : unit === "MW" ? n * 1e3 : n / 1e3;
    return { kw, dead: false };
  }
  function fmt(kw) {
    const a = Math.abs(kw);
    if (a >= 10) return Math.round(a).toString();
    if (a >= 1) return a.toFixed(1).replace(/\.0$/, "");
    return Math.round(a * 1e3).toString();
  }
  var unitFor = (kw) => Math.abs(kw) >= 1 ? "kW" : "W";
  function EnergyFlowCard({ config }) {
    const moreInfo = useMoreInfo();
    const solarE = useEntity(config.solar ?? "");
    const loadE = useEntity(config.home ?? "");
    const gridE = useEntity(config.grid ?? "");
    const batteryE = useEntity(config.battery ?? "");
    const socE = useEntity(config.battery_soc ?? "");
    const gridSign = config.grid_invert ? -1 : 1;
    const batterySign = config.battery_invert ? -1 : 1;
    const solar = numVal(solarE);
    const load = numVal(loadE);
    const grid = numVal(gridE);
    const battery = numVal(batteryE);
    const socRaw = socE && !isUnavailable(socE) ? Number(socE.state) : NaN;
    const socPct = Number.isFinite(socRaw) ? Math.min(100, Math.max(0, socRaw)) : void 0;
    const nodes = [];
    if (config.solar) nodes.push({ role: "solar", icon: Sun2, label: "Solar", accent: "var(--warm)", value: Math.abs(solar.kw), dead: solar.dead, entityId: config.solar });
    nodes.push({ role: "load", icon: House2, label: "Home", accent: "var(--theme)", value: Math.abs(load.kw), dead: config.home ? load.dead : true, entityId: config.home });
    if (config.grid) nodes.push({ role: "grid", icon: Utility, label: "Grid", accent: "var(--cool)", value: Math.abs(grid.kw), dead: grid.dead, entityId: config.grid });
    if (config.battery || config.battery_soc)
      nodes.push({
        role: "battery",
        icon: Battery,
        label: "Battery",
        accent: "var(--up)",
        value: Math.abs(battery.kw),
        dead: config.battery ? battery.dead : true,
        entityId: config.battery ?? config.battery_soc,
        soc: socPct
      });
    const edges = [];
    if (config.solar) {
      const active = !solar.dead && Math.abs(solar.kw) >= ACTIVE_KW;
      edges.push({ role: "solar", dir: active ? "in" : "idle", active, accent: "var(--warm)", dead: solar.dead });
    }
    if (config.grid) {
      const importing = grid.kw * gridSign > 0;
      const active = !grid.dead && Math.abs(grid.kw) >= ACTIVE_KW;
      edges.push({ role: "grid", dir: active ? importing ? "in" : "out" : "idle", active, accent: importing ? "var(--cool)" : "var(--up)", dead: grid.dead });
    }
    if (config.battery) {
      const discharging = battery.kw * batterySign > 0;
      const active = !battery.dead && Math.abs(battery.kw) >= ACTIVE_KW;
      edges.push({ role: "battery", dir: active ? discharging ? "in" : "out" : "idle", active, accent: discharging ? "var(--up)" : "var(--cool)", dead: battery.dead });
    }
    const edgeByRole = new Map(edges.map((e) => [e.role, e]));
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "simui-eflow", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { className: "simui-eflow-svg", viewBox: `0 0 ${VB_W} ${VB_H}`, preserveAspectRatio: "xMidYMid meet", role: "img", "aria-label": config.name ?? "Energy flow", children: ["solar", "grid", "battery"].map((role) => {
        const edge = edgeByRole.get(role);
        return edge ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FlowEdge, { from: POS[role], to: POS.load, edge }, role) : null;
      }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "simui-eflow-nodes", children: nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FlowNode, { node: n, onTap: n.entityId ? () => moreInfo(n.entityId) : void 0 }, n.role)) })
    ] });
  }
  function FlowNode({ node, onTap }) {
    const Icon2 = node.icon;
    const left = POS[node.role].x / VB_W * 100;
    const top = POS[node.role].y / VB_H * 100;
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
      "button",
      {
        type: "button",
        className: `simui-eflow-node role-${node.role}${node.dead ? " is-dead" : ""}`,
        style: { left: `${left}%`, top: `${top}%`, ["--eflow-node"]: node.accent },
        "aria-label": `${node.label}: ${node.dead ? "unavailable" : `${fmt(node.value)} ${unitFor(node.value)}`}`,
        disabled: !onTap,
        onClick: onTap,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "simui-eflow-node-ic", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Icon2, { soc: node.soc }) }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "simui-eflow-node-label", children: node.label }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "simui-eflow-node-val", children: node.dead ? "\u2014" : /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
            fmt(node.value),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "simui-eflow-node-unit", children: unitFor(node.value) })
          ] }) }),
          node.role === "battery" && node.soc != null && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: "simui-eflow-node-soc", children: [
            Math.round(node.soc),
            "%"
          ] })
        ]
      }
    );
  }
  function FlowEdge({ from, to, edge }) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const PAD = 30;
    const x1 = from.x + ux * PAD;
    const y1 = from.y + uy * PAD;
    const x2 = to.x - ux * PAD;
    const y2 = to.y - uy * PAD;
    const cls = `simui-eflow-edge dir-${edge.dir}${edge.active ? " is-active" : ""}${edge.dead ? " is-dead" : ""}`;
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("g", { className: cls, style: { ["--eflow-edge"]: edge.accent }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("line", { className: "simui-eflow-wire", x1, y1, x2, y2 }),
      edge.active && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("line", { className: "simui-eflow-pulse", x1, y1, x2, y2, pathLength: 100 })
    ] });
  }

  // .design-sync/mock-hass.tsx
  init_define_import_meta_env();
  var import_react10 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime12 = __toESM(require_react_shim(), 1);
  var DEMO_STATES = {
    // lights
    "light.ceiling": { entity_id: "light.ceiling", state: "on", attributes: { friendly_name: "Living Room Ceiling", brightness: 204, supported_color_modes: ["brightness"] } },
    "light.kitchen": { entity_id: "light.kitchen", state: "on", attributes: { friendly_name: "Kitchen Lights", brightness: 181, color_temp_kelvin: 2700, supported_color_modes: ["color_temp"] } },
    "light.office": { entity_id: "light.office", state: "on", attributes: { friendly_name: "Office RGBW Lights", brightness: 150, rgb_color: [124, 96, 240], supported_color_modes: ["rgb"] } },
    "light.lamp": { entity_id: "light.lamp", state: "on", attributes: { friendly_name: "Desk Lamp", brightness: 120, rgb_color: [240, 138, 96], supported_color_modes: ["rgbw"] } },
    "light.bed": { entity_id: "light.bed", state: "off", attributes: { friendly_name: "Bed Light", supported_color_modes: ["brightness"] } },
    "light.porch": { entity_id: "light.porch", state: "on", attributes: { friendly_name: "Porch Light", supported_color_modes: ["onoff"] } },
    "light.garage": { entity_id: "light.garage", state: "unavailable", attributes: { friendly_name: "Garage Strip" } },
    // climate
    "climate.living": { entity_id: "climate.living", state: "heat", attributes: { friendly_name: "Living Room", hvac_action: "heating", hvac_modes: ["off", "heat", "cool", "auto"], current_temperature: 19.5, temperature: 21, min_temp: 7, max_temp: 30, target_temp_step: 0.5 } },
    "climate.bedroom": { entity_id: "climate.bedroom", state: "cool", attributes: { friendly_name: "Bedroom", hvac_action: "cooling", hvac_modes: ["off", "heat", "cool", "auto"], current_temperature: 24.5, temperature: 22, min_temp: 16, max_temp: 32, target_temp_step: 0.5 } },
    "climate.study": { entity_id: "climate.study", state: "auto", attributes: { friendly_name: "Study", hvac_action: "idle", hvac_modes: ["off", "heat", "cool", "auto"], current_temperature: 21, temperature: 21, min_temp: 7, max_temp: 30, target_temp_step: 0.5 } },
    "climate.guest": { entity_id: "climate.guest", state: "heat_cool", attributes: { friendly_name: "Guest Suite", hvac_action: "idle", hvac_modes: ["off", "heat_cool", "auto"], current_temperature: 21.5, target_temp_low: 19, target_temp_high: 24, min_temp: 7, max_temp: 30, target_temp_step: 0.5 } },
    "climate.hall": { entity_id: "climate.hall", state: "off", attributes: { friendly_name: "Hallway", hvac_action: "off", hvac_modes: ["off", "heat"], current_temperature: 20 } },
    // sensors
    "binary_sensor.motion": { entity_id: "binary_sensor.motion", state: "on", attributes: { friendly_name: "Hallway Motion", device_class: "motion" } },
    "sensor.temp": { entity_id: "sensor.temp", state: "21.5", attributes: { friendly_name: "Living Room Temperature", device_class: "temperature", unit_of_measurement: "\xB0C" } },
    "sensor.humidity": { entity_id: "sensor.humidity", state: "54", attributes: { friendly_name: "Living Room Humidity", device_class: "humidity", unit_of_measurement: "%" } },
    "sensor.power": { entity_id: "sensor.power", state: "342", attributes: { friendly_name: "Fridge Power", device_class: "power", unit_of_measurement: "W" } },
    "sensor.battery": { entity_id: "sensor.battery", state: "87", attributes: { friendly_name: "Front Door Battery", device_class: "battery", unit_of_measurement: "%" } },
    "sensor.co2": { entity_id: "sensor.co2", state: "612", attributes: { friendly_name: "CO\u2082", device_class: "carbon_dioxide", unit_of_measurement: "ppm" } },
    "sensor.outdoor": { entity_id: "sensor.outdoor", state: "unavailable", attributes: { friendly_name: "Outdoor Temperature", device_class: "temperature", unit_of_measurement: "\xB0C" } },
    // energy-flow power sensors (sunny surplus: solar exports + charges the battery)
    "sensor.solar_power": { entity_id: "sensor.solar_power", state: "3200", attributes: { friendly_name: "Solar Power", device_class: "power", unit_of_measurement: "W" } },
    "sensor.grid_power": { entity_id: "sensor.grid_power", state: "-850", attributes: { friendly_name: "Grid Power", device_class: "power", unit_of_measurement: "W" } },
    "sensor.battery_power": { entity_id: "sensor.battery_power", state: "-800", attributes: { friendly_name: "Battery Power", device_class: "power", unit_of_measurement: "W" } },
    "sensor.battery_soc": { entity_id: "sensor.battery_soc", state: "78", attributes: { friendly_name: "Battery Charge", device_class: "battery", unit_of_measurement: "%" } },
    "sensor.home_power": { entity_id: "sensor.home_power", state: "1550", attributes: { friendly_name: "Home Power", device_class: "power", unit_of_measurement: "W" } },
    // covers (supported_features: open|close|set_position|stop = 1|2|4|8 = 15; garage has no set_position = 11)
    "cover.living": { entity_id: "cover.living", state: "open", attributes: { friendly_name: "Living Room Blinds", device_class: "blind", current_position: 60, supported_features: 15 } },
    "cover.bedroom": { entity_id: "cover.bedroom", state: "opening", attributes: { friendly_name: "Bedroom Shade", device_class: "shade", current_position: 40, supported_features: 15 } },
    "cover.garage": { entity_id: "cover.garage", state: "closed", attributes: { friendly_name: "Garage Door", device_class: "garage", current_position: 0, supported_features: 11 } },
    "cover.awning": { entity_id: "cover.awning", state: "open", attributes: { friendly_name: "Patio Awning", device_class: "awning", current_position: 50, supported_features: 4 } },
    // locks
    "lock.front": { entity_id: "lock.front", state: "locked", attributes: { friendly_name: "Front Door" } },
    "lock.back": { entity_id: "lock.back", state: "unlocked", attributes: { friendly_name: "Back Door" } },
    "lock.side": { entity_id: "lock.side", state: "jammed", attributes: { friendly_name: "Side Gate" } },
    // media players (supported_features: pause|prev|next|play = 1|16|32|16384 = 16433)
    "media_player.living": { entity_id: "media_player.living", state: "playing", attributes: { friendly_name: "Living Room Speaker", media_title: "Redbone", media_artist: "Childish Gambino", supported_features: 16433 } },
    "media_player.kitchen": { entity_id: "media_player.kitchen", state: "paused", attributes: { friendly_name: "Kitchen Display", media_title: "The Daily", media_artist: "The New York Times", supported_features: 16433 } },
    "media_player.bedroom": { entity_id: "media_player.bedroom", state: "off", attributes: { friendly_name: "Bedroom TV", supported_features: 16433 } }
  };
  function ids(target) {
    const t = target?.entity_id;
    return t == null ? [] : Array.isArray(t) ? t : [t];
  }
  var ACTION_FOR_MODE = { off: "off", heat: "heating", cool: "cooling" };
  function synthHistory(states, id, start, end) {
    const base = Number(states[id]?.state) || 20;
    const seed = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
    const n = 160;
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = start + (end - start) * i / (n - 1);
      const h = t / 36e5;
      const amp = Math.max(1, Math.abs(base) * 0.12);
      const v = base + Math.sin(h * 0.5 + seed) * amp + Math.sin(h * 2.7 + seed * 1.3) * amp * 0.4;
      out.push({ s: (Math.round(v * 10) / 10).toString(), lu: t / 1e3 });
    }
    return out;
  }
  function applyService(prev, service, data, target) {
    const states = { ...prev };
    for (const id of ids(target)) {
      const e = states[id];
      if (!e) continue;
      if (service === "turn_off") {
        states[id] = { ...e, state: "off" };
      } else if (service === "turn_on") {
        const bp = data?.brightness_pct;
        states[id] = { ...e, state: "on", attributes: { ...e.attributes, brightness: bp != null ? Math.round(bp * 2.55) : e.attributes.brightness ?? 204 } };
      } else if (service === "toggle") {
        states[id] = { ...e, state: e.state === "on" ? "off" : "on" };
      } else if (service === "set_temperature") {
        states[id] = { ...e, attributes: { ...e.attributes, ...data ?? {} } };
      } else if (service === "set_hvac_mode") {
        const mode = data?.hvac_mode ?? "off";
        states[id] = { ...e, state: mode, attributes: { ...e.attributes, hvac_action: ACTION_FOR_MODE[mode] ?? "idle" } };
      } else if (service === "lock" || service === "unlock") {
        states[id] = { ...e, state: service === "lock" ? "locked" : "unlocked" };
      } else if (service === "open_cover" || service === "close_cover") {
        const opened = service === "open_cover";
        states[id] = { ...e, state: opened ? "open" : "closed", attributes: { ...e.attributes, current_position: opened ? 100 : 0 } };
      } else if (service === "stop_cover") {
        states[id] = { ...e, state: (e.attributes.current_position ?? 0) > 0 ? "open" : "closed" };
      } else if (service === "set_cover_position") {
        const p = data?.position ?? 0;
        states[id] = { ...e, state: p === 0 ? "closed" : "open", attributes: { ...e.attributes, current_position: p } };
      } else if (service === "media_play_pause") {
        states[id] = { ...e, state: e.state === "playing" ? "paused" : "playing" };
      }
    }
    return states;
  }
  function createMockHass(extraStates) {
    const states = { ...DEMO_STATES, ...extraStates ?? {} };
    return {
      states,
      language: "en",
      callWS: async (msg) => {
        if (msg.type === "history/history_during_period") {
          const start = Date.parse(msg.start_time);
          const end = Date.parse(msg.end_time);
          const out = {};
          for (const id of msg.entity_ids ?? []) out[id] = synthHistory(states, id, start, end);
          return out;
        }
        return {};
      },
      callService: () => {
      }
    };
  }
  function SimuiProvider({ states: extra, children }) {
    const host = (0, import_react10.useMemo)(() => typeof document !== "undefined" ? document.createElement("div") : {}, []);
    const [states, setStates] = (0, import_react10.useState)(() => ({ ...DEMO_STATES, ...extra ?? {} }));
    const hass = (0, import_react10.useMemo)(
      () => ({
        states,
        language: "en",
        callWS: createMockHass(states).callWS,
        callService: (_domain, service, data, target) => setStates((s) => applyService(s, service, data, target))
      }),
      [states]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(HassProvider, { hass, host, children });
  }
  return __toCommonJS(entry_exports);
})();
/*! Bundled license information:

lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs:
lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs:
lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs:
lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs:
lucide-react/dist/esm/defaultAttributes.mjs:
lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs:
lucide-react/dist/esm/context.mjs:
lucide-react/dist/esm/Icon.mjs:
lucide-react/dist/esm/createLucideIcon.mjs:
lucide-react/dist/esm/icons/activity.mjs:
lucide-react/dist/esm/icons/battery-medium.mjs:
lucide-react/dist/esm/icons/blinds.mjs:
lucide-react/dist/esm/icons/circle-question-mark.mjs:
lucide-react/dist/esm/icons/cloud-rain.mjs:
lucide-react/dist/esm/icons/dollar-sign.mjs:
lucide-react/dist/esm/icons/door-closed.mjs:
lucide-react/dist/esm/icons/door-open.mjs:
lucide-react/dist/esm/icons/droplets.mjs:
lucide-react/dist/esm/icons/fan.mjs:
lucide-react/dist/esm/icons/flame.mjs:
lucide-react/dist/esm/icons/flask-conical.mjs:
lucide-react/dist/esm/icons/gauge.mjs:
lucide-react/dist/esm/icons/house.mjs:
lucide-react/dist/esm/icons/lightbulb.mjs:
lucide-react/dist/esm/icons/lock-open.mjs:
lucide-react/dist/esm/icons/lock.mjs:
lucide-react/dist/esm/icons/map-pin.mjs:
lucide-react/dist/esm/icons/music.mjs:
lucide-react/dist/esm/icons/pause.mjs:
lucide-react/dist/esm/icons/play.mjs:
lucide-react/dist/esm/icons/power.mjs:
lucide-react/dist/esm/icons/shield-alert.mjs:
lucide-react/dist/esm/icons/shield-check.mjs:
lucide-react/dist/esm/icons/signal.mjs:
lucide-react/dist/esm/icons/skip-back.mjs:
lucide-react/dist/esm/icons/skip-forward.mjs:
lucide-react/dist/esm/icons/snowflake.mjs:
lucide-react/dist/esm/icons/sun.mjs:
lucide-react/dist/esm/icons/thermometer.mjs:
lucide-react/dist/esm/icons/timer.mjs:
lucide-react/dist/esm/icons/toggle-right.mjs:
lucide-react/dist/esm/icons/volume-2.mjs:
lucide-react/dist/esm/icons/warehouse.mjs:
lucide-react/dist/esm/icons/waves-horizontal.mjs:
lucide-react/dist/esm/icons/wind.mjs:
lucide-react/dist/esm/icons/zap.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.18.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
window.SimUI=SimUI.__dsMainNs?Object.assign({},SimUI,SimUI.__dsMainNs,{__dsMainNs:undefined}):SimUI;
