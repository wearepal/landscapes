import * as React from "react"
import { Control } from "rete"

interface TextFieldProps {
  getValue: () => string
  setValue: (value: string) => void
}
const TextField = ({ getValue, setValue }: TextFieldProps) => {
  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  return <input
    type="text"
    value={getValue()}
    onChange={e => {
      setValue(e.target.value)
      forceUpdate()
    }}
    onPointerDown={e => e.stopPropagation()}
    onDoubleClick={e => e.stopPropagation()}
  />
}

export class TextControl extends Control {
  props: TextFieldProps
  component: (props: TextFieldProps) => JSX.Element
  
  constructor(key: string) {
    super(key)
    this.props = {
      getValue: () => {
        const value = this.getData(key)
        return typeof value === "string" ? value : ""
      },
      setValue: value => this.putData(key, value),
    }
    this.component = TextField
  }
}
