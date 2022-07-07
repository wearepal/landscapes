<template>
<div class="mt-3 btn-group d-flex">
    <button
      class="btn btn-outline-light"
      type="button"
      :disabled="!enabled()"
      @click="saveClicked()"
      @pointerdown.stop
      @dblclick.stop
    >
      Save
    </button>
    <a
      class="btn btn-outline-light"
      :class="{ disabled: !getLabellingGroupId() }"
      :href="getLabellingGroupId() ? `/labelling_groups/${getLabellingGroupId()}` : undefined"
      target="_blank"
      @pointerdown.stop
      @dblclick.stop
    >
      View
    </a>
    <button
      class="btn btn-outline-light"
      type="button"
      :disabled="!getLabellingGroupId()"
      @click="deleteClicked()"
      @pointerdown.stop
      @dblclick.stop
    >
      Delete
    </button>
  </div>
</template>

<script>
export default {
  props: [
    'enabled',
    'getLabellingGroupId',
    'saveClicked',
    'deleteClicked',
  ]
}
</script>
