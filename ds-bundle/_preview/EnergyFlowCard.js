"use strict";
var __dsPreview = (() => {
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
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
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

  // ds-raw:__ds_raw__
  var require_ds_raw = __commonJS({
    "ds-raw:__ds_raw__"(exports, module) {
      init_define_import_meta_env();
      module.exports = window.SimUI;
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function jsx2(t, p, k) {
        return R.createElement(t, k === void 0 ? p : Object.assign({ key: k }, p));
      }
      module.exports = R;
      module.exports.jsx = jsx2;
      module.exports.jsxs = jsx2;
      module.exports.jsxDEV = jsx2;
      module.exports.Fragment = R.Fragment;
    }
  });

  // .design-sync/previews/EnergyFlowCard.tsx
  var EnergyFlowCard_exports = {};
  __export(EnergyFlowCard_exports, {
    NightDraw: () => NightDraw,
    SunnySurplus: () => SunnySurplus
  });
  init_define_import_meta_env();

  // ds-shim:ds
  var ds_exports = {};
  __export(ds_exports, {
    default: () => ds_default
  });
  init_define_import_meta_env();
  __reExport(ds_exports, __toESM(require_ds_raw()));
  var g = window.SimUI;
  var ds_default = "default" in g ? g.default : g;

  // .design-sync/previews/EnergyFlowCard.tsx
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var FLOW_CONFIG = {
    type: "simui-energy-flow-card",
    solar: "sensor.solar_power",
    grid: "sensor.grid_power",
    battery: "sensor.battery_power",
    battery_soc: "sensor.battery_soc",
    home: "sensor.home_power"
  };
  var SunnySurplus = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.EnergyFlowCard, { config: { ...FLOW_CONFIG } });
  var NightDraw = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    ds_exports.SimuiProvider,
    {
      states: {
        "sensor.solar_power": { entity_id: "sensor.solar_power", state: "0", attributes: { friendly_name: "Solar Power", device_class: "power", unit_of_measurement: "W" } },
        "sensor.grid_power": { entity_id: "sensor.grid_power", state: "1200", attributes: { friendly_name: "Grid Power", device_class: "power", unit_of_measurement: "W" } },
        "sensor.battery_power": { entity_id: "sensor.battery_power", state: "900", attributes: { friendly_name: "Battery Power", device_class: "power", unit_of_measurement: "W" } },
        "sensor.battery_soc": { entity_id: "sensor.battery_soc", state: "46", attributes: { friendly_name: "Battery Charge", device_class: "battery", unit_of_measurement: "%" } },
        "sensor.home_power": { entity_id: "sensor.home_power", state: "2100", attributes: { friendly_name: "Home Power", device_class: "power", unit_of_measurement: "W" } }
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.EnergyFlowCard, { config: { ...FLOW_CONFIG } })
    }
  );
  return __toCommonJS(EnergyFlowCard_exports);
})();
