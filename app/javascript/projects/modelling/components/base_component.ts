import { Component } from "rete"

export abstract class BaseComponent extends Component {
  category?: string
  contextMenuName?: string // TODO
}
