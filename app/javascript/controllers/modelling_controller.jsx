"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rete_1 = require("rete");
const rete_connection_plugin_1 = __importDefault(require("rete-connection-plugin"));
const rete_context_menu_plugin_1 = __importDefault(require("rete-context-menu-plugin"));
const rete_history_plugin_1 = __importDefault(require("rete-history-plugin"));
const rete_minimap_plugin_1 = __importDefault(require("rete-minimap-plugin"));
const rete_vue_render_plugin_1 = __importDefault(require("rete-vue-render-plugin"));
const stimulus_1 = require("stimulus");
const lodash_1 = __importDefault(require("lodash"));
const components_1 = require("../modelling/components");
const Node_1 = __importDefault(require("../modelling/Node"));
const Inspector_1 = __importDefault(require("../modelling/Inspector"));
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
class default_1 extends stimulus_1.Controller {
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.editor = new rete_1.NodeEditor('ssrp-web-application@1.0.0', this.editorTarget);
            this.engine = new rete_1.Engine('ssrp-web-application@1.0.0');
            this.editor.use(rete_connection_plugin_1.default);
            this.editor.use(rete_context_menu_plugin_1.default, {
                searchBar: false,
                delay: 100,
                rename: component => component.contextMenuName || component.name,
                allocate: component => {
                    if (component.deprecated) {
                        return null;
                    }
                    else {
                        return component.category ? [component.category] : [];
                    }
                },
            });
            this.editor.use(rete_minimap_plugin_1.default);
            this.editor.use(rete_vue_render_plugin_1.default, {
                component: Node_1.default
            });
            (0, components_1.createDefaultComponents)(JSON.parse(this.data.get('defs'))).forEach(component => {
                this.editor.register(component);
                this.engine.register(component);
            });
            if (this.data.has('model')) {
                yield this.editor.fromJSON(JSON.parse(this.data.get('model')));
            }
            this.editor.use(rete_history_plugin_1.default);
            this.editor.on('nodecreated noderemoved connectioncreated connectionremoved nodetranslated nodedragged', lodash_1.default.debounce(() => {
                // TODO: respond to changes to node controls
                const newModel = JSON.stringify(this.editor.toJSON());
                if (this.data.get('model') !== newModel) {
                    this.data.set('model', newModel);
                    this.setDirtyFlag();
                }
            }, 500));
            this.editor.on('click', () => {
                const previousSelection = Array.from(this.editor.selected.list);
                this.editor.selected.clear();
                previousSelection.forEach(node => node.update());
                this.updateInspectability();
            });
            this.editor.on('nodeselected', this.updateInspectability.bind(this));
            this.editor.on('noderemoved', (node) => { this.editor.selected.remove(node); this.updateInspectability(); });
        });
    }
    disconnect() {
        this.editor.destroy();
        delete this.editor;
        this.engine.destroy();
        delete this.engine;
        this.editorTarget.innerHTML = '';
    }
    setDirtyFlag() {
        if (!this.data.has('dirty')) {
            this.data.set('dirty', 'true');
            this.saveButtonTarget.disabled = false;
            this.saveStatusTarget.innerText = '';
        }
    }
    undo() {
        this.editor.trigger('undo');
    }
    redo() {
        this.editor.trigger('redo');
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            this.saveButtonTarget.disabled = true;
            if (this.modelNameFieldTarget.value === '') {
                this.modelNameFieldTarget.value = 'Untitled model';
            }
            try {
                const method = 'PATCH';
                const headers = new Headers();
                headers.set('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').content);
                const body = new FormData();
                body.set('model[name]', this.modelNameFieldTarget.value);
                body.set('model[source]', JSON.stringify(this.editor.toJSON()));
                body.set('model[lock_version]', this.data.get('lock-version'));
                const response = yield fetch(this.data.get('url'), { method, headers, body });
                if (response.status === 409) {
                    alert("Another user has edited this model since you opened it.\n* To overwrite their changes with your own, click the Save button again.\n* To discard your own changes, refresh your browser.");
                    const model = yield response.json();
                    this.data.set('lock-version', model.lock_version);
                    this.saveButtonTarget.disabled = false;
                    return;
                }
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const model = yield response.json();
                this.data.set('lock-version', model.lock_version);
                this.data.delete('dirty');
                this.saveStatusTarget.innerText = 'All changes saved';
            }
            catch (ex) {
                alert('An unexpected error occurred while trying to save your changes');
                this.saveButtonTarget.disabled = false;
                throw ex;
            }
        });
    }
    warnIfUnsaved(event) {
        if (this.data.has('dirty') && !confirm('You have unsaved changes. Are you sure you want to leave this page without saving?')) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    run(event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stopButtonTarget.disabled = false;
            event.target.disabled = true;
            yield this.engine.process(this.editor.toJSON());
            event.target.disabled = false;
            this.stopButtonTarget.disabled = true;
            this.updateInspectability();
        });
    }
    stop(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.target.disabled = true;
            yield this.engine.abort();
        });
    }
    updateInspectability() {
        const selectedNodes = this.editor.selected.list;
        this.inspectButtonTarget.disabled = !(selectedNodes.length == 1 &&
            selectedNodes[0].meta.hasOwnProperty('output'));
    }
    inspect() {
        const selectedNode = this.editor.selected.list[0];
        const nodeName = selectedNode.name;
        const nodeLabel = selectedNode.data.name;
        this.inspectorElement = this.element.appendChild(document.createElement("div"));
        react_dom_1.default.render(<Inspector_1.default teamId={this.data.get('team-id')} nodeLabel={nodeLabel ? `${nodeLabel} (${nodeName})` : nodeName} nodeOutput={selectedNode.meta.output} close={this.closeInspector.bind(this)}/>, this.inspectorElement);
    }
    closeInspector() {
        react_dom_1.default.unmountComponentAtNode(this.inspectorElement);
        this.inspectorElement.remove();
        delete this.inspectorElement;
    }
}
exports.default = default_1;
default_1.targets = [
    'editor',
    'modelNameField',
    'saveButton',
    'saveStatus',
    'stopButton',
    'inspectButton',
    'inspectedNodeName',
];
