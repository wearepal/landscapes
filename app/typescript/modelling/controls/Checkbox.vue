<template>
  <div class="custom-control custom-checkbox">
    <input
      type="checkbox"
      class="custom-control-input"
      :id="id"
      :checked="checked()"
      @input="setChecked($event.target.checked)"
      @pointerdown.stop
      @dblclick.stop
    >
    <label class="custom-control-label" :for="id">{{ label }}</label>
  </div>
</template>

<script>
import { uniqueId } from 'lodash'
export default {
  props: [
    'label',
    'checked',
    'setChecked',
  ],
  data() {
    return { id: uniqueId() }
  }
}
</script>
