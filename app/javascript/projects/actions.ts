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

interface MutateLayer {
  type: "MutateLayer"
  id: number
  data: Partial<Layer>
}

interface SetLayerOrder {
  type: "SetLayerOrder"
  order: number[]
}

export type Action = SetProjectName | SelectLayer | AddLayer | DeleteLayer | MutateLayer | SetLayerOrder
