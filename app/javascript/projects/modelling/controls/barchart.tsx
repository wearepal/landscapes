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

interface YAxisProps {
    scale: d3.ScaleBand<string>
    transform: string
}

interface XAxisProps {
    scale: d3.ScaleLinear<number, number, never>
    transform: string
}

interface BarsProps {
    variables: BarChartVariable[]
    scaleX: XAxisProps["scale"]
    scaleY: YAxisProps["scale"]
}

interface BarChartLabelsProps {

}

function YAxis({ scale, transform }: YAxisProps) {
    const ref = React.useRef<SVGGElement>(null)

    React.useEffect(() => {
        if (ref.current) {
            d3.select(ref.current).call(d3.axisLeft(scale)).style("font-size", "14px").style("font-weight", "500")
        }
    }, [scale])

    return <g ref={ref} transform={transform} />
}

function XAxis({ scale, transform }: XAxisProps) {
    const ref = React.useRef<SVGGElement>(null)

    React.useEffect(() => {
        if (ref.current) {
            d3.select(ref.current).call(d3.axisBottom(scale)).style("font-size", "14px")
        }
    }, [scale])

    return <g ref={ref} transform={transform} />
}

function Bars({ variables, scaleX, scaleY }: BarsProps) {
    return (
        <>
            {variables.map(({ value, label }) => (
                <>
                    <rect
                        key={`bar-${label}`}
                        width={scaleX(value)}
                        height={scaleY.bandwidth() / 2}
                        x={0}
                        y={Number(scaleY(label)) + (scaleY.bandwidth() * .25)}
                        fill={d3.schemeSet3[value > 0 ? 0 : 3]}
                    />
                    <text
                        key={`text-${label}`}
                        x={scaleX(value) + Math.sign(value) * 4}
                        y={Number(scaleY(label)) + (scaleY.bandwidth() * .50)}
                        dy={"0.35em"}
                        fontSize="14"
                        fontWeight="500"
                    >
                        {value.toLocaleString(undefined, { maximumSignificantDigits: 3 })}
                    </text>
                </>
            ))}
        </>
    )

}

const BarChart = ({ variables, title }: BarChartProps) => {

    if (variables.length === 0) { return (<div></div>) }

    if (!title) title = ""

    const labelPadding = Math.max(...variables.map(v => v.label.length)) * 3.5
    const margin = { top: 10, right: 10, bottom: 20, left: 45 + labelPadding }
    const width = 500 - margin.left - margin.right + (labelPadding / 2)
    const height = (80 + (variables.length * 50)) - margin.top - margin.bottom //calc height based on n 

    const scaleY = d3.scaleBand()
        .domain(variables.map(({ label }) => label))
        .range([0, height])


    const scaleX = d3.scaleLinear()
        .domain([Math.max(...variables.map(({ value }) => value)) * 1.1, 0])
        .range([width, 0]);


    return (
        <figure
            className='bg-white text-dark p-4'>
            <svg
                width={width + margin.left + margin.right}
                height={height + margin.top + margin.bottom}
            >
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <Bars variables={variables} scaleX={scaleX} scaleY={scaleY} />
                    <YAxis scale={scaleY} transform={`translate(0, 0)`} />
                    <XAxis scale={scaleX} transform={`translate(0, ${height})`} />
                </g>

            </svg>
            <figcaption className="text-center mt-3" >{title}</figcaption>
        </figure >
    )
}

const BarChartLabels = ({ }: BarChartLabelsProps) => {

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