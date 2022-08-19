import { Engine, NodeEditor } from 'rete'
import ConnectionPlugin from 'rete-connection-plugin'
import ContextMenuPlugin from 'rete-context-menu-plugin'
import HistoryPlugin from 'rete-history-plugin'
import MinimapPlugin from 'rete-minimap-plugin'
import VueRenderPlugin from 'rete-vue-render-plugin'
import { Controller } from 'stimulus'
import * as _ from 'lodash'

import { createDefaultComponents } from '../modelling/components'
// @ts-ignore
import * as NodeComponent from '../modelling/Node'
import { BooleanTileGrid, NumericTileGrid } from '../modelling/TileGrid'
import Inspector from '../modelling/Inspector'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

export default class extends Controller {
  static targets = [
    'editor',
    'modelNameField',
    'saveButton',
    'saveStatus',
    'stopButton',
    'inspectButton',
    'inspectedNodeName',
  ]
  private editor?: NodeEditor;
  private editorTarget: HTMLElement;
  private engine?: Engine;
  private saveButtonTarget: any;
  private saveStatusTarget: any;
  private modelNameFieldTarget: any;
  private stopButtonTarget: any;
  private inspectButtonTarget: any;
  private inspectorElement?: HTMLDivElement;

  async connect() {
    this.editor = new NodeEditor('ssrp-web-application@1.0.0', this.editorTarget)
    this.engine = new Engine('ssrp-web-application@1.0.0')

    this.editor.use(ConnectionPlugin)
    this.editor.use(ContextMenuPlugin, {
      searchBar: false, // Too buggy
      delay: 100,
      rename: component => component.contextMenuName || component.name,
      allocate: component => {
        if (component.deprecated) {
          return null
        }
        else {
          return component.category ? [component.category] : []
        }
      },
    })
    this.editor.use(MinimapPlugin)
    this.editor.use(VueRenderPlugin, {
      component: NodeComponent
    })

    createDefaultComponents(
      JSON.parse(this.data.get('defs')!)
    ).forEach(component => {
      this.editor!.register(component)
      this.engine!.register(component)
    })

    if (this.data.has('model')) {
      await this.editor.fromJSON(JSON.parse(this.data.get('model')!))
    }

    this.editor.use(HistoryPlugin)

    this.editor.on(
      // @ts-ignore
      'nodecreated noderemoved connectioncreated connectionremoved nodetranslated nodedragged',
      _.debounce(
        () => {
          // TODO: respond to changes to node controls
          const newModel = JSON.stringify(this.editor!.toJSON())
          if (this.data.get('model') !== newModel) {
            this.data.set('model', newModel)
            this.setDirtyFlag()
          }
        },
        500
      )
    )

    this.editor.on('click', () => {
      const previousSelection = Array.from(this.editor!.selected.list)
      this.editor!.selected.clear()
      previousSelection.forEach(node => node.update())
      this.updateInspectability()
    })

    this.editor.on('nodeselected', this.updateInspectability.bind(this))
    this.editor.on('noderemoved', (node) => { this.editor!.selected.remove(node); this.updateInspectability() })
  }

  disconnect() {
    this.editor!.destroy()
    delete this.editor

    this.engine!.destroy()
    delete this.engine

    this.editorTarget.innerHTML = ''
  }

  setDirtyFlag() {
    if (!this.data.has('dirty')) {
      this.data.set('dirty', 'true')
      this.saveButtonTarget.disabled = false
      this.saveStatusTarget.innerText = ''
    }
  }

  undo() {
    // @ts-ignore
    this.editor!.trigger('undo')
  }

  redo() {
    // @ts-ignore
    this.editor!.trigger('redo')
  }

  async save() {
    this.saveButtonTarget.disabled = true

    if (this.modelNameFieldTarget.value === '') {
      this.modelNameFieldTarget.value = 'Untitled model'
    }

    try {
      const method = 'PATCH'

      const headers = new Headers()
      // @ts-ignore
      headers.set('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').content)

      const body = new FormData()
      body.set('model[name]', this.modelNameFieldTarget.value)
      body.set('model[source]', JSON.stringify(this.editor!.toJSON()))
      body.set('model[lock_version]', this.data.get('lock-version')!)

      const response = await fetch(this.data.get('url')!, { method, headers, body })

      if (response.status === 409) {
        alert("Another user has edited this model since you opened it.\n* To overwrite their changes with your own, click the Save button again.\n* To discard your own changes, refresh your browser.")
        const model = await response.json()
        this.data.set('lock-version', model.lock_version)
        this.saveButtonTarget.disabled = false
        return
      }

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const model = await response.json()
      this.data.set('lock-version', model.lock_version)

      this.data.delete('dirty')
      this.saveStatusTarget.innerText = 'All changes saved'
    }
    catch (ex) {
      alert('An unexpected error occurred while trying to save your changes')
      this.saveButtonTarget.disabled = false
      throw ex
    }
  }

  warnIfUnsaved(event) {
    if (this.data.has('dirty') && !confirm('You have unsaved changes. Are you sure you want to leave this page without saving?')) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  async run(event) {
    this.stopButtonTarget.disabled = false
    event.target.disabled = true
    await this.engine!.process(this.editor!.toJSON())
    event.target.disabled = false
    this.stopButtonTarget.disabled = true
    this.updateInspectability()
  }

  async stop(event) {
    event.target.disabled = true
    await this.engine!.abort()
  }

  updateInspectability() {
    const selectedNodes = this.editor!.selected.list
    this.inspectButtonTarget.disabled = !(
      selectedNodes.length == 1 &&
      selectedNodes[0].meta.hasOwnProperty('output')
    )
  }

  inspect() {
    const selectedNode = this.editor!.selected.list[0]
    const nodeName = selectedNode.name
    const nodeLabel = selectedNode.data.name
    this.inspectorElement = this.element.appendChild(document.createElement("div"))
    ReactDOM.render(
      <Inspector
        teamId={this.data.get('team-id')}
        nodeLabel={nodeLabel ? `${nodeLabel} (${nodeName})` : nodeName}
        nodeOutput={selectedNode.meta.output}
        close={this.closeInspector.bind(this)}
      />,
      this.inspectorElement
    )
  }

  closeInspector() {
    ReactDOM.unmountComponentAtNode(this.inspectorElement!)
    this.inspectorElement!.remove()
    delete this.inspectorElement
  }
}
