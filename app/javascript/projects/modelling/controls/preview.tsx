import * as React from "react"
import { Control } from "rete"
import { BooleanTileGrid, NumericTileGrid } from "../tile_grid"

interface PreviewProps {
  getTileGrid: () => BooleanTileGrid | NumericTileGrid
}
const Preview = ({ getTileGrid }: PreviewProps) => {
  const tileGrid = getTileGrid()
  const canvasRef = React.useRef<HTMLCanvasElement>()
  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx === null || ctx === undefined) { return }
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, tileGrid.width, tileGrid.height)

    if (tileGrid instanceof BooleanTileGrid) {
      ctx.fillStyle = '#FFFFFF'
      for (let x = 0; x < tileGrid.width; ++x) {
        for (let y = 0; y < tileGrid.height; ++y) {
          if (tileGrid.get(tileGrid.x + x, tileGrid.y + y)) {
            ctx.fillRect(x, y, 1, 1)
          }
        }
      }
    }
    else if (tileGrid instanceof NumericTileGrid) {
      let [min, max] = tileGrid.getMinMax()

      for (let x = 0; x < tileGrid.width; ++x) {
        for (let y = 0; y < tileGrid.height; ++y) {
          let val = tileGrid.get(tileGrid.x + x, tileGrid.y + y)
          ctx.fillStyle = isFinite(val) ? `rgba(255, 255, 255, ${(val - min) / (max - min)})` : 'rgba(255, 255, 255, 0)'
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
  })

  return <div style={{width: "200px", height: "200px", margin: "0px auto", backgroundColor: "rgba(0, 0, 0, 0.2)", textAlign: "center", lineHeight: "200px"}}>
    <canvas
      style={tileGrid.width > tileGrid.height ?
      {
        verticalAlign: 'middle',
        width: '200px',
        height: `${200 * tileGrid.height / tileGrid.width}px`,
        imageRendering: 'pixelated',
      } : {
        verticalAlign: 'middle',
        width: `${200 * tileGrid.width / tileGrid.height}px`,
        height: '200px',
        imageRendering: 'pixelated',
      }}
      width={tileGrid.width}
      height={tileGrid.height}
      ref={canvasRef as any}
    ></canvas>
  </div>
}

export class PreviewControl extends Control {
  props: PreviewProps
  component: (props: PreviewProps) => JSX.Element
  
  constructor(getTileGrid: () => BooleanTileGrid | NumericTileGrid) {
    super("Preview")
    this.props = { getTileGrid }
    this.component = Preview
  }
}
