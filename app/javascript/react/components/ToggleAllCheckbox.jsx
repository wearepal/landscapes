"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleAllCheckbox = void 0;
const react_1 = __importDefault(require("react"));
const _1 = require(".");
const ToggleAllCheckbox = ({ collection, toggledIds, toggleAll, label }) => {
    const isToggled = i => toggledIds.includes(i.id);
    const allToggled = collection.every(isToggled);
    const someToggled = collection.some(isToggled);
    return (<_1.Checkbox checked={allToggled} indeterminate={someToggled && !allToggled} change={toggleAll}>
      <strong>
        {label}
      </strong>
    </_1.Checkbox>);
};
exports.ToggleAllCheckbox = ToggleAllCheckbox;
