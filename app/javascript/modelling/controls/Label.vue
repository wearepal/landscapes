<template>
  <div v-html="getLabel()" class="text-center"></div>
</template>

<script>
export default {
  props: [
    'getValue',
  ],
  methods: {
    getLabel() {
      return this.getValue().replace('\n', '<br>')
    }
  }
}
</script>
