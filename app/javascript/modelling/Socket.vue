<template>
  <div
    class="socket"
    :class="['socket--' + socket.name.toLowerCase(), 'socket--' + type]"
  >
  </div>
</template>

<script>
export default {
  props: ['type', 'socket']
}
</script>

<style lang="scss" scoped>
.socket {
  display: inline-block;
  cursor: pointer;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  vertical-align: middle;
  z-index: 2;
  box-sizing: border-box;

  &:hover {
    transform: scale(1.1);
  }

  &--output {
    margin-right: calc(-3px - .5rem);
  }

  &--input {
    margin-left: calc(-3px - .5rem);
  }
}
</style>
