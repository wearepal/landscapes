<template>
  <div style="width: 200px">
    <div v-if="this.getTileGrid().zoom > 0" style="width: 200px; height: 200px; margin: 0px auto; background-color: rgba(0, 0, 0, 0.2); text-align: center; line-height: 200px">
      <canvas
        :style="getTileGrid().width > getTileGrid().height ?
        {
          verticalAlign: 'middle',
          width: '200px',
          height: `${200 * getTileGrid().height / getTileGrid().width}px`,
          imageRendering: 'pixelated',
        } : {
          verticalAlign: 'middle',
          width: `${200 * getTileGrid().width / getTileGrid().height}px`,
          height: '200px',
          imageRendering: 'pixelated',
        }"
        :width="getTileGrid().width"
        :height="getTileGrid().height"
        ref="canvas"
      ></canvas>
    </div>
  </div>
</template>

<script>
import { BooleanTileGrid, NumericTileGrid } from "../../projects/modelling/tile_grid"
import { LabelledTileGrid } from '../TileGrid'
export default {
  props: ['getTileGrid'],
  methods: {
    draw() {
      const grid = this.getTileGrid()
      const ctx = this.$refs['canvas'].getContext('2d')
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, grid.width, grid.height)

      if (grid instanceof BooleanTileGrid) {
        ctx.fillStyle = '#FFFFFF'
        for (let x = 0; x < grid.width; ++x) {
          for (let y = 0; y < grid.height; ++y) {
            if (grid.get(grid.x + x, grid.y + y)) {
              ctx.fillRect(x, y, 1, 1)
            }
          }
        }
      }
      else if (grid instanceof LabelledTileGrid) {
        for (let x = 0; x < grid.width; ++x) {
          for (let y = 0; y < grid.height; ++y) {
            const val = grid.get(grid.x + x, grid.y + y)
            if (val !== 255) {
              ctx.fillStyle = `#${grid.labelSchema.labels.find(l => l.index === val).colour}`
              ctx.fillRect(x, y, 1, 1)
            }
          }
        }
      }
      else if (grid instanceof NumericTileGrid) {
        var min = Infinity, max = -Infinity
        for (let x = grid.x; x < grid.x + grid.width; ++x) {
          for (let y = grid.y; y < grid.y + grid.height; ++y) {
            const val = grid.get(x, y)
            if (isFinite(val)) {
              min = Math.min(val, min)
              max = Math.max(val, max)
            }
          }
        }

        for (let x = 0; x < grid.width; ++x) {
          for (let y = 0; y < grid.height; ++y) {
            const val = grid.get(grid.x + x, grid.y + y)
            ctx.fillStyle = isFinite(val) ? `rgba(255, 255, 255, ${(val - min) / (max - min)})` : '#FF0000'
            ctx.fillRect(x, y, 1, 1)
          }
        }
      }
    }
  },
  mounted() {
    if (this.getTileGrid().zoom > 0) {
      this.draw()
    }
  },
  updated() {
    if (this.getTileGrid().zoom > 0) {
      this.draw()
    }
  },
}
</script>
