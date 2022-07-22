import { cloneDeep, isEqual } from "lodash"
import { Action } from "./actions"
import { Project } from "./project"

export const reduce = (state: Project, action: Action): Project => {
  const actionType = action.type
  switch (actionType) {
    case "SetProjectName": {
      return { ...state, name: action.name }
    }

    case "SelectLayer": {
      return { ...state, selectedLayer: action.id }
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
      return { ...state, selectedLayer: undefined, layers, allLayers: state.allLayers.filter(e => e !== action.id) }
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

    default: {
      // Ensure we've handled every action type
      const unreachable: never = actionType
      return { ...state }
    }
  }
}
