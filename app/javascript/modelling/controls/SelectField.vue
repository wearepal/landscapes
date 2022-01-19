<template>
  <label style="display: block">
    {{ label }}
    <select
      class="custom-select d-block"
      style="max-width: 400px"
      :value="getId()"
      @change="setId(parseInt($event.target.value)); change()"
      @pointerdown.stop
      @dblclick.stop
    >
      <option
        v-for="option in getOptions()"
        :key="option.id"
        :value="option.id"
      >
        {{ option.name }}
      </option>
    </select>
  </label>
</template>

<script>
export default {
  props: [
    'getOptions',
    'getId',
    'setId',
    'change',
    'label',
  ],
}
</script>
