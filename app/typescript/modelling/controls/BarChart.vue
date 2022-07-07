<template>
  <figure class="bg-white text-dark text-nowrap p-4">
    <svg ref="svg">
      <rect
        v-for="variable in variables"
        :fill="d3.schemeSet3[variable.value > 0 ? 0 : 3]"
        :x="x(Math.min(variable.value, 0))"
        :y="y(variable.name)"
        :width="Math.abs(x(variable.value) - x(0))"
        :height="y.bandwidth()"
      />
      <text
        v-for="variable in variables"
        :text-anchor="variable.value < 0 ? 'end' : 'start'"
        :x="x(variable.value) + Math.sign(variable.value) * 4"
        :y="y(variable.name) + y.bandwidth() / 2"
        dy="0.35em"
        font-size="12"
        font-weight="300"
      >{{ variable.value.toLocaleString(undefined, { maximumSignificantDigits: 3 }) }}</text>
      <g v-call="drawXAxis" :transform="`translate(0,${height})`"/>
      <g v-call="drawYAxis" :transform="`translate(${clamp(x(0), 0, width)},0)`"/>
    </svg>
    <figcaption class="text-center mt-3" style="font-weight: 500">{{ title }}</figcaption>
  </figure>
</template>

<script>
import * as d3 from 'd3'
import clamp from 'lodash/clamp'

export default {
  props: [
    'title',
    'variables',
  ],
  data() {
    return {
      d3,
      width: 350,
    }
  },
  computed: {
    x() {
      return d3
        .scaleLinear()
        .domain(d3.extent([0].concat(this.variables.map(variable => variable.value))))
        .rangeRound([0, 350])
        .nice()
    },
    y() {
      return d3
        .scaleBand()
        .domain(this.variables.map(variable => variable.name))
        .rangeRound([0, this.height])
        .padding(0.2)
    },
    height() {
      return this.variables.length * 45
    },
  },
  mounted() {
    this.updateBoundingBox()
  },
  updated() {
    this.updateBoundingBox()
  },
  methods: {
    clamp,
    drawXAxis(g) {
      g.call(d3.axisBottom(this.x))
    },
    drawYAxis(g) {
      g.attr("font-size", null)
      g.attr("font-family", null)
      g.attr("font-weight", "500")
      g.call(
        d3.axisLeft(this.y)
          .tickSize(0)
          .tickPadding(6)
      ).call(g =>
        g.selectAll(".tick text")
          .attr("text-anchor", (d, i) => this.variables[i].value < 0 ? "start" : "end")
          .attr("x", (d, i) => this.variables[i].value < 0 ? 6 : -6)
      )
    },
    updateBoundingBox() {
      this.$nextTick(() => {
        const svg = this.$refs.svg
        const bbox = svg.getBBox()
        svg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
        svg.style.width = bbox.width + "px"
      })
    },
  },
  directives: {
    call(el, binding) {
      d3.select(el).call(binding.value)
    }
  }
}
</script>
