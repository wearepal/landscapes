import * as React from "react"
import { Control } from "rete"

interface TextFieldProps {
  getValue: () => string
  setValue: (value: string) => void
}
const TextField = ({ getValue, setValue }: TextFieldProps) => (
  <input
    type="text"
    value={getValue()}
    onChange={e => setValue(e.target.value)}
    onPointerDown={e => e.stopPropagation()}
    onDoubleClick={e => e.stopPropagation()}
  />
)

export class TextControl extends Control {
  props: TextFieldProps
  component: (props: TextFieldProps) => JSX.Element
  
  constructor(key: string) {
    super(key)
    this.props = {
      getValue: () => this.getData(key) as string,
      setValue: (value: string) => this.putData(key, value),
    }
    this.component = TextField
  }
}
