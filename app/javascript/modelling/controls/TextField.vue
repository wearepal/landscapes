<template>
  <label style="display: block">
    {{ label }}
    <input
      class="form-control"
      type="text"
      :value="getValue()"
      @input="setValue($event.target.value)"
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
