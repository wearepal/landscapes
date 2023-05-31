import { cloneDeep, isEqual } from "lodash"
import { Action } from "./actions"
import { Project, State } from "./state"

const reduceProject = (state: Project, action: Action): Project => {
  switch (action.type) {
    case "SetProjectName": {
      return { ...state, name: action.name }
    }

    case "AddLayer": {
      const layers = cloneDeep(state.layers)
      const nextId = Math.max(0, ...Object.keys(layers).map(k => parseInt(k))) + 1
      layers[nextId] = action.layer
      return { ...state, layers, allLayers: state.allLayers.concat(nextId) }
    }

    case "DeleteLayer": {
      const layers = cloneDeep(state.layers)
      delete layers[action.id]
      return { ...state, layers, allLayers: state.allLayers.filter(layerId => layerId !== action.id) }
    }

    case "DeleteModelOutputLayer": {
      const id = state.allLayers.find(idx => {
        const layer = state.layers[idx]
        return layer.type === "ModelOutputLayer" && layer.nodeId === action.nodeId
      })

      const layers = cloneDeep(state.layers)
      if (id !== undefined) {
        delete layers[id]
      }
      return { ...state, layers, allLayers: state.allLayers.filter(layerId => layerId !== id) }
    }

    case "MutateLayer": {
      const { id, data } = action
      const layers = cloneDeep(state.layers)
      Object.assign(layers[id], data)
      return { ...state, layers }
    }

    case "SetLayerOrder": {
      if (!isEqual([...state.allLayers].sort(), [...action.order].sort())) {
        throw new Error("Cannot add or remove layers via SET_LAYER_ORDER action")
      }
      return { ...state, allLayers: action.order }
    }

    case "SetModel": {
      return { ...state, model: action.model }
    }

    default: return state
  }
}

export const reduceSelectedLayer = (state: number | undefined, action: Action): number | undefined => {
  switch (action.type) {
    case "DeleteLayer": return action.id === state ? undefined : state
    case "SelectLayer": return action.id
    default: return state
  }
}

export const reduce = (state: State, action: Action): State => {
  const newProjectState = reduceProject(state.project, action)
  return {
    project: newProjectState,
    selectedLayer: reduceSelectedLayer(state.selectedLayer, action),
    hasUnsavedChanges: action.type !== "FinishSave" && (state.hasUnsavedChanges || !isEqual(state.project, newProjectState)),
    autoProcessing: action.type !== "SetAutoprocessing" ? state.autoProcessing : !state.autoProcessing
  }
}
