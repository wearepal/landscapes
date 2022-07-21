export enum ActionType {
  SET_NAME,
  SELECT_LAYER,
  ADD_LAYER,
  DELETE_LAYER,
  MUTATE_LAYER,
  SET_LAYER_ORDER,
}

export interface Action {
  type: ActionType
  payload?: any
}
