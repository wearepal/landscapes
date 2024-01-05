import * as React from "react"
import { Control, Emitter } from "rete"
import { EventsTypes } from "rete/types/events"

interface CheckboxProps {
    label: string
    options: Array<CheckboxControlOptions>
    updateData: (id: number) => void
    getData: () => number[]
}

export interface CheckboxControlOptions {
    id: number
    name: string
}

const CheckboxField = ({ label, options, updateData, getData }: CheckboxProps) => {
    // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [, forceUpdate] = React.useReducer(x => x + 1, 0)

    const change = (id: number) => { 
        updateData(id)
        forceUpdate()
    }

    const active = getData()

    return (
        <>
            {options.length > 0 && label}
            {
                options.map(opt =>
                    <div className="form-check">
                        <input checked={active.includes(opt.id)} onChange={() => change(opt.id)} className="form-check-input" type="checkbox" value="" id={opt.id.toString()}></input>
                        <label className="form-check-label" htmlFor={opt.id.toString()}>
                            {opt.name}
                        </label>
                    </div>
                )
            }
        </>
    )
}

export class CheckboxControl extends Control {
    props: CheckboxProps
    component: (props: CheckboxProps) => JSX.Element

    constructor(emitter: Emitter<EventsTypes> | null, key: string, options: Array<CheckboxControlOptions>) {
        super(key)

        this.props = {
            label: (key.match(/[A-Z][a-z]+|[0-9]+/g)?.join(" ") || key).replace(/^(.)(.*)$/, (_, first, rest) => first.toUpperCase() + rest.toLowerCase()),
            options,
            updateData: (id: number) => {
                let arr = this.getData(key) as number[] || []
                if(arr.includes(id)) {
                    arr = arr.filter((item: number) => item !== id)
                } else {
                    arr.push(id)
                }
                this.putData(key, arr)
            },
            getData: () => this.getData(key) as number[] || []
            
        }
        this.component = CheckboxField
    }
}