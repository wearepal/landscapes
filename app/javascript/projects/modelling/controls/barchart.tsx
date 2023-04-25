import * as React from 'react'
import { Control } from 'rete'
import * as d3 from 'd3'

export interface BarChartVariable {
    label: string
    value: number
}

interface BarChartProps {
    title?: string
    variables: BarChartVariable[]
}

const BarChart = ({ variables, title }: BarChartProps) => {

    // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [, forceUpdate] = React.useReducer(x => x + 1, 0)

    if (!title) title = ""

    return (
        <figure>

            <figcaption className="text-center mt-3" style={{ fontWeight: 500 }} >{title}</figcaption>
        </figure >
    )

}

export class BarChartControl extends Control {
    props: BarChartProps
    component: (props: BarChartProps) => JSX.Element

    constructor(key: string) {
        super(key)
        this.props = {
            variables: []
        }
        this.component = BarChart
    }

    setTitle(title: string): void {
        this.props.title = title
    }

    setVariables(variables: BarChartVariable[]): void {
        this.props.variables = variables
    }

}