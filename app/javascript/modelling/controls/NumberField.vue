<template>
  <label style="display: block">
    {{ label }}
    <input
      class="form-control"
      type="number"
      step="any"
      :value="getValue()"
      @input="setValue(Number($event.target.value))"
      @pointerdown.stop
      @dblclick.stop
    >
  </label>
</template>

<script>
export default {
  props: [
    'label',
    'getValue',
    'setValue',
  ]
}
</script>
