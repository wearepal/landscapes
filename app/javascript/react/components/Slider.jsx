"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slider = void 0;
const react_1 = __importDefault(require("react"));
const Slider = ({ icon, min, max, step, value, setValue }) => (<div className="d-flex align-items-center mt-2">
    <i className={`fas ${icon}`}></i>
    <input type="range" className="custom-range ml-2" min={min} max={max} value={value} step={step} onChange={e => setValue(Number(e.target.value))}/>
  </div>);
exports.Slider = Slider;
