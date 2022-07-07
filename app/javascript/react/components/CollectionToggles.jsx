"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionToggles = void 0;
const react_1 = __importDefault(require("react"));
const _1 = require(".");
const CollectionToggles = ({ items, toggledIds, toggleId }) => (items.map(i => <_1.Checkbox key={i.id} checked={toggledIds.includes(i.id)} change={() => toggleId(i.id)}>
      {i.colour && <_1.Swatch colour={i.colour}/>} {i.label || i.name}
    </_1.Checkbox>));
exports.CollectionToggles = CollectionToggles;
