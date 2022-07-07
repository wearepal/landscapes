"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionSelect = void 0;
const react_1 = __importDefault(require("react"));
const CollectionSelect = ({ items, id, setId, placeholder }) => (<select className="custom-select" value={id === null ? '' : id} onChange={e => setId(e.target.value === "" ? null : parseInt(e.target.value))}>
    {placeholder && <option value="">{placeholder}</option>}
    {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
  </select>);
exports.CollectionSelect = CollectionSelect;
