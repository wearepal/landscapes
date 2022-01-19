<template>
  <figure class="bg-white text-dark text-nowrap p-4">
    <svg :viewBox="`0 -40 ${width} ${height + 40}`" :style="{ width, height }">
      <text
        v-for="(labelling, i) in labellings"
        :x="width * i / (labellings.length - 1)"
        :text-anchor="i >= labellings.length / 2 ? 'end' : 'start'"
        :y="-20"
      >{{ labelling.name }}</text>
      <g>
        <rect
          v-for="node in graph.nodes"
          :x="node.x0"
          :y="node.y0"
          :width="node.x1 - node.x0"
          :height="node.y1 - node.y0"
          :fill="node.colour"
        />
      </g>
      <g fill="none">
        <template v-for="(link, i) in graph.links">
          <linearGradient
            v-if="linkColourMode == 0"
            :id="`link-${i}-gradient`"
            gradientUnits="userSpaceOnUse"
            :x1="link.source.x1"
            :x2="link.target.x0"
          >
            <stop offset="0%" :stop-color="link.source.colour"/>
            <stop offset="100%" :stop-color="link.target.colour"/>
          </linearGradient>
          <path
            :d="d3.sankeyLinkHorizontal()(link)"
            :stroke="[`url(#link-${i}-gradient)`, link.source.colour, link.target.colour][linkColourMode]"
            :stroke-width="link.width"
            style="mix-blend-mode: multiply"
          >
            <title>{{ link.source.labelName + ' → ' + link.target.labelName + '\n' + (link.value / 1000000).toLocaleString(undefined, { maximumSignificantDigits: 3 }) + 'km²' }}</title>
          </path>
        </template>
      </g>
      <g
        v-for="node in graph.nodes"
        :transform="`translate(${node.x0 < width / 2 ? node.x1 + 6 : node.x0 - 6}, ${(node.y0 + node.y1) / 2})`"
      >
        <text font-size="12px" y="-0.1em" :text-anchor="node.x0 < width / 2 ? 'start' : 'end'">{{ node.labelName }}</text>
        <text font-size="10px" y="1.1em" font-weight="400" :text-anchor="node.x0 < width / 2 ? 'start' : 'end'">{{ (node.value / 1000000).toLocaleString(undefined, { maximumSignificantDigits: 3 }) }}km²</text>
      </g>
    </svg>
    <figcaption class="text-center mt-3" style="font-weight: 500">{{ title }}</figcaption>
  </figure>
</template>

<style scoped>
figure {
  cursor: default;
}
path {
  stroke-opacity: 50%;
}
path:hover {
  stroke-opacity: 25%;
}
</style>

<script>
import * as d3_base from 'd3'
import * as d3_sankey from 'd3-sankey'
const d3 = { ...d3_base, ...d3_sankey }
import { getExtent, mergeExtents } from '../TileGrid'
import { getArea } from 'ol/sphere'
import { fromExtent } from 'ol/geom/Polygon'
import { createXYZ } from 'ol/tilegrid'
export default {
  props: [
    'title',
    'labellings',
    'includeUnlabelledTiles',
    'linkColourMode',
  ],
  data() {
    return {
      d3,
      height: 500,
    }
  },
  computed: {
    width() {
      return 250 * this.labellings.length
    },
    graph() {
      if (this.labellings.length < 2) return {}

      const zoom = Math.max(...this.labellings.map(l => l.zoom))
      const [x0, y0, x1, y1] = this.labellings.map(l => getExtent(l, zoom)).reduce(mergeExtents)
      
      let nodes = this.labellings.flatMap(labelling =>
        labelling.labelSchema.labels.map(label => (
          { labellingName: labelling.name, labelName: label.label, labelIndex: label.index, colour: '#' + label.colour }
        )).concat([
          { labellingName: labelling.name, labelName: "Other", labelIndex: undefined, colour: "#dddddd" }
        ])
      )
      let links = d3.pairs(this.labellings).flatMap(([a, b]) =>
        d3.cross(
          a.labelSchema.labels.map(l => l.index).concat([undefined]),
          b.labelSchema.labels.map(l => l.index).concat([undefined])
        ).map(([c, d]) => (
          {
            source: nodes.find(n => n.labellingName === a.name && n.labelIndex === c),
            target: nodes.find(n => n.labellingName === b.name && n.labelIndex === d),
            value: 0,
          }
        ))
      )

      const tileGrid = createXYZ()
      for (let x = x0; x <= x1; ++x) {
        for (let y = y0; y <= y1; ++y) {
          d3.pairs(this.labellings).forEach(([a, b]) => {
            const tiles = this.labellings.map(l => l.get(x, y, zoom))
            const isLabelled = v => v !== undefined && v !== 255
            if (this.includeUnlabelledTiles ? tiles.some(isLabelled) : tiles.every(isLabelled)) {
              let before = a.get(x, y, zoom)
              let after = b.get(x, y, zoom)
              if (before === 255) { before = undefined }
              if (after === 255) { after = undefined }
              const sourceNode = nodes.find(n => n.labellingName === a.name && n.labelIndex === before)
              const targetNode = nodes.find(n => n.labellingName === b.name && n.labelIndex === after)
              const link = links.find(l => l.source === sourceNode && l.target === targetNode)
              link.value += getArea(fromExtent(tileGrid.getTileCoordExtent([zoom, x, y])))
            }
          })
        }
      }

      links = links.filter(link => link.value > 0)
      nodes = nodes.filter(node => links.some(l => l.source === node || l.target === node))
      links.forEach(link => {
        link.source = nodes.findIndex(n => n === link.source)
        link.target = nodes.findIndex(n => n === link.target)
      })

      return this.sankey({ nodes, links })
    },
    sankey() {
      return d3.sankey()
        .nodeWidth(4)
        .nodePadding(30)
        .extent([[0, 5], [this.width, this.height - 5]])
    }
  },
}
</script>
