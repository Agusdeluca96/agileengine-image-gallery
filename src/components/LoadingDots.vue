<template>
  <div class="loading-dots">
    <div
      v-for="dotIndex in 3"
      :key="dotIndex"
      :class="`loading-dots__dot loading-dots__dot--${theme}`"
    />
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'light',
    },
  },
};
</script>

<style lang="scss" scoped>
.loading-dots {
  position: absolute;
  z-index: 1003;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  display: block;
  height: 15px;
  width: auto;
  box-sizing: border-box;
  text-align: center;

  &__dot {
    float: left;
    margin: 0 calc(15px / 2);
    width: 15px;
    height: 15px;
    border-radius: 50%;
    transform: scale(0);
    box-sizing: border-box;
    animation: dots-animation 1000ms ease infinite 0ms;

    &--light {
      border: calc(15px / 5) solid rgba(255, 255, 255, 0.8);
    }

    &--dark {
      border: calc(15px / 5) solid rgba(0, 0, 0, 0.8);
    }

    &:nth-child(1) {
      animation-delay: calc(300ms * 1);
    }

    &:nth-child(2) {
      animation-delay: calc(300ms * 2);
    }

    &:nth-child(3) {
      animation-delay: calc(300ms * 3);
    }
  }
}

@keyframes dots-animation {
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
