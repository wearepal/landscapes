import { lab } from "d3"
import { debounce } from "lodash"
import * as React from "react"
import { Control, Emitter } from "rete"
import { EventsTypes } from "rete/types/events"

interface DateFieldProps {
    getValue: () => string
    setValue: (value: string) => void
    label: string
}
const DateField = ({ getValue, setValue, label }: DateFieldProps) => {
  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [, forceUpdate] = React.useReducer(x => x + 1, 0)

    return (
        <label style={{ display: "block" }}>
            {label}
            <input
                type="date"
                className="form-control"
                value={getValue()}
                onChange={e => {
                setValue(e.target.value)
                forceUpdate()
                }}
                onPointerDown={e => e.stopPropagation()}
                onDoubleClick={e => e.stopPropagation()}
            />    
        </label>

    )
}

export class DateControl extends Control {
    props: DateFieldProps
    component: (props: DateFieldProps) => JSX.Element
    type: string

    constructor(emitter: Emitter<EventsTypes> | null, key: string) {
        super(key)
        this.type = "DateControl"

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
            label: (key.match(/[A-Z][a-z]+|[0-9]+/g)?.join(" ") || key).replace(/^(.)(.*)$/, (_, first, rest) => first.toUpperCase() + rest.toLowerCase())
        }
        this.component = DateField
    }
}
