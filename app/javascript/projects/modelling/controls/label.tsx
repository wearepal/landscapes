import * as React from 'react'
import { Control } from 'rete'

interface LabelFieldProps {
    getValue: () => string
}

const LabelField = ({ getValue }: LabelFieldProps) => {
    // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [, forceUpdate] = React.useReducer(x => x + 1, 0)

    return (
        <div className="text-center" >{getValue().replace('\n', '<br>')}</div>
    )

}

export class LabelControl extends Control {
    props: LabelFieldProps
    component: (props: LabelFieldProps) => JSX.Element

    constructor(key: string) {
        super(key)

        this.props = {
            getValue: this.getData.bind(this, key),
        }

        this.component = LabelField
    }

}