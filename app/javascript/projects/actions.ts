import { Data } from "rete/types/core/data"
import { Layer } from "./state"

interface SetProjectName {
  type: "SetProjectName"
  name: string
}

interface SelectLayer {
  type: "SelectLayer"
  id: number | undefined
}

interface AddLayer {
  type: "AddLayer"
  layer: Layer
}

interface DeleteLayer {
  type: "DeleteLayer"
  id: number
}

interface DeleteModelOutputLayer {
  type: "DeleteModelOutputLayer"
  nodeId: number
}

interface MutateLayer {
  type: "MutateLayer"
  id: number
  data: Partial<Layer>
}

interface SetLayerOrder {
  type: "SetLayerOrder"
  order: number[]
}

interface FinishSave {
  type: "FinishSave"
}

interface SetModel {
  type: "SetModel"
  model: Data
}

export type Action = SetProjectName | SelectLayer | AddLayer | DeleteLayer | DeleteModelOutputLayer | MutateLayer | SetLayerOrder | FinishSave | SetModel
