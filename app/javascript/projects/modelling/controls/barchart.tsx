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

            const axis = d3.axisBottom(scale.nice())
            const tickCount = 6
            axis.ticks(tickCount)

            d3.select(ref.current)
                .call(axis).style("font-size", "14px")
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
                        fontSize="12"
                        fontWeight="300"
                    >
                        {value.toLocaleString(undefined, { maximumSignificantDigits: 3 })}
                    </text>
                </>
            ))}
        </>
    )

}

function downloadAsCsv(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
}

const BarChart = ({ variables, title }: BarChartProps) => {

    if (variables.length === 0) { return (<div></div>) }

    if (!title) title = ""

    const labelPadding = Math.max(...variables.map(v => v.label.length)) * 7
    const margin = { top: 10, right: 50, bottom: 20, left: 45 + labelPadding }
    const width = 600 - margin.left - margin.right + (labelPadding / 2)
    const height = (80 + (variables.length * 50)) - margin.top - margin.bottom //calc height based on n 

    const scaleY = d3.scaleBand()
        .domain(variables.map(({ label }) => label))
        .range([0, height])


    const scaleX = d3.scaleLinear()
        .domain([Math.max(...variables.map(({ value }) => value)) * 1.1, 0])
        .range([width, 0]);


    const svgRef = React.useRef<SVGSVGElement>(null);

    const downloadPng = () => {
        if (svgRef.current) {
            const svgElement = svgRef.current
            const svgContent = new XMLSerializer().serializeToString(svgElement)

            const canvas = document.createElement("canvas")
            const context = canvas.getContext("2d")

            const svgImage = new Image()
            svgImage.src = "data:image/svg+xml;base64," + btoa(svgContent)

            svgImage.onload = () => {
                canvas.width = svgImage.width
                canvas.height = svgImage.height
                context?.drawImage(svgImage, 0, 0)

                const url = canvas.toDataURL("image/png")

                const link = document.createElement("a")
                link.href = url
                link.download = "bar_chart.png"
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        }
    }

    const downloadCsv = () => {
        const csvData = variables.map(variable => `${variable.label},${variable.value}`).join("\n")
        const filename = "bar_chart_data.csv"
        downloadAsCsv("label,value\n" + csvData, filename)
    }

    return (
        <>
            <figure
                className='bg-white text-dark p-4'>

                <svg
                    ref={svgRef}
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

            <div className="text-right">
                <button onClick={downloadPng} className="mr-3 btn btn-primary"><i className="fa fa-download" aria-hidden="true" /> PNG </button>
                <button onClick={downloadCsv} className="btn btn-success"><i className="fa fa-download" aria-hidden="true" /> CSV </button>
            </div>
        </>
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