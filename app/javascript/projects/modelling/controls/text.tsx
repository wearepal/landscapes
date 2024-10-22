import { debounce } from "lodash"
import * as React from "react"
import { Control, Emitter } from "rete"
import { EventsTypes } from "rete/types/events"

interface TextFieldProps {
  getValue: () => string
  setValue: (value: string) => void
  title: string
  width: string
}
const TextField = ({ getValue, setValue, title, width }: TextFieldProps) => {
  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  return <>
    <label>
      {title}
    </label>
    <input
      type="text"
      className="form-control"
      value={getValue()}
      onChange={e => {
        setValue(e.target.value)
        forceUpdate()
      }}
      onPointerDown={e => e.stopPropagation()}
      onDoubleClick={e => e.stopPropagation()}
      style={{ width }} 
    />
  </>
}

export class TextControl extends Control {
  props: TextFieldProps
  component: (props: TextFieldProps) => JSX.Element

  constructor(emitter: Emitter<EventsTypes> | null, key: string, title: string = "", width: string = "100%") {
    super(key)

    const process = debounce(() => emitter?.trigger("process"), 1000)
    this.props = {
      getValue: () => {
        const value = this.getData(key)
        return typeof value === "string" ? value : ""
      },
      setValue: value => {
        this.putData(key, value)
        process()
      },
      title: title,
      width: width
    }
    this.component = TextField
  }
}
