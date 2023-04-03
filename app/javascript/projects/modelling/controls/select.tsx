import * as React from "react"
import { Control, Emitter } from 'rete'
import { EventsTypes } from "rete/types/events"

interface SelectControlProps {
    emitter: Emitter<EventsTypes> | null
    getId: () => string | undefined
    setId: (x: string) => {}
    getOptions: () => Array<SelectControlOptions>
    change: () => {}
    label: string | undefined
}

interface SelectControlOptions {
    id: number
    name: string
}

const SelectInput = ({ emitter, getId, setId, getOptions, change, label }: SelectControlProps) => {

    // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [, forceUpdate] = React.useReducer(x => x + 1, 0)

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptionId = event.target.value
        setId(selectedOptionId)
        change()
        forceUpdate()

        emitter?.trigger("process")
    }

    return (
        <label style={{ display: "block" }}>
            {label}
            <select
                className="custom-select d-block"
                style={{ maxWidth: "400px" }}
                onChange={onChange}
                value={getId()}
            >
                {
                    getOptions().map(opt =>
                        <option value={opt.id} key={opt.id}>{opt.name}</option>
                    )
                }
            </select>
        </label>
    )

}


export class SelectControl extends Control {
    props: SelectControlProps
    component: (props: SelectControlProps) => JSX.Element

    constructor(emitter: Emitter<EventsTypes> | null, key: string, getOptions: () => Array<SelectControlOptions>, change: () => {}, label: string | undefined = undefined) {
        super(key)

        this.props = {
            emitter,
            getId: this.getData.bind(this, key),
            setId: this.putData.bind(this, key),
            getOptions,
            change,
            label
        }

        this.component = SelectInput
    }
}
