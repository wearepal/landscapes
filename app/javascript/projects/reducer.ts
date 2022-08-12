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
      return { ...state, layers, allLayers: state.allLayers.filter(e => e !== action.id) }
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

export const reduce = (state: State, action: Action): State => ({
  project: reduceProject(state.project, action),
  selectedLayer: reduceSelectedLayer(state.selectedLayer, action),
})
