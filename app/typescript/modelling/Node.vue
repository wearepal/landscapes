<template>
  <div
    class="node"
    :class="{ 'node--selected': selected() }"
  >
    <div style="padding: calc(.5rem - 3px)" class="d-flex align-items-center">
      <input
        type="text"
        class="form-control bg-dark text-light border-0"
        style="box-shadow: none; width: 0px; flex-grow: 1"
        :placeholder="node.name"
        :value="node.data.name"
        @input="node.data.name = $event.target.value"
        @pointerdown.stop
        @dblclick.stop
      >
      <i v-if="node.meta.errorMessage" class="fas fa-exclamation-triangle ml-2 mb-1 text-danger" :title="node.meta.errorMessage"></i>
    </div>

    <div class="node__io">
      <div>
        <div class="node__input" v-for="input in inputs()" :key="input.key">
          <Socket v-socket:input="input" type="input" :socket="input.socket"/>
          <div class="node__input-title" v-show="!input.showControl()">{{ input.name }}</div>
          <div class="node__input-control" v-show="input.showControl()" v-control="input.control"></div>
        </div>
      </div>

      <div>
        <div class="node__output" v-for="output in outputs()" :key="output.key">
          <div class="node__output-title">{{ output.name }}</div>
          <Socket v-socket:output="output" type="output" :socket="output.socket"/>
        </div>
      </div>
    </div>

    <div class="node__control" v-for="control in controls()" v-control="control" :key="control.key"></div>
  </div>
</template>

<script>
import $ from 'jquery'
import mixin from 'rete-vue-render-plugin/src/mixin'
import Socket from './Socket'

export default {
  mixins: [mixin],
  components: {
    Socket
  },
  updated: function () {
    this.$nextTick(function () {
      $('[title]').tooltip('dispose').tooltip()
    })
  }
}
</script>

<style lang="scss" scoped>
$node-color: rgba(0, 0, 0, 0.5);

.node {
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  background: $node-color;
  color: white;
  border-radius: 4px;
  border: solid 3px transparent;
  cursor: pointer;
  min-width: 180px;
  height: auto;
  box-sizing: content-box;
  position: relative;
  user-select: none;

  &:hover {
    background: lighten($node-color,4%);
  }

  &--selected {
    border-color: white;
  }

  &__io {
    display: flex;
    justify-content: space-between;
  }

  &__input, &__output {
    margin: .25rem 0rem;
  }

  &__input {
    text-align: left;
  }

  &__output {
    text-align: right;
  }

  &__input-title, &__output-title {
    vertical-align: middle;
    color: white;
    display: inline-block;
    line-height: 1rem;
  }

  &__input-control {
    z-index: 1;
    width: calc(100% - 1rem);
    vertical-align: middle;
    display: inline-block;
  }

  &__control {
    margin: .5rem;
  }
}
</style>
