export enum ActionType {
  SET_NAME,
  SELECT_LAYER,
  ADD_LAYER,
  DELETE_LAYER,
  MUTATE_LAYER,
}

export interface Action {
  type: ActionType
  payload?: any
}
