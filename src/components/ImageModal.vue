<template>
  <div class="image-modal">
    <div class="image-modal__overlay">
      <loading-dots v-show="fetchingImage"></loading-dots>
      <div class="image-modal__container">
        <ul class="image-modal__content">
          <li
            v-for="(image, imageIndex) in images"
            :key="imageIndex"
            :style="`transform: translate3d(${index * -100}%, 0px, 0px);`"
            class="image-modal__image-container"
          >
            <div
              class="image-modal__image-content"
              :ref="`image-${image.id}-container`"
            >
              <img
                :ref="`image-${image.id}`"
                :src="
                  !fetchingImage && imageIndex === index
                    ? currentImage.full_picture
                    : false
                "
              />
            </div>
          </li>
        </ul>
      </div>
      <div class="image-modal__image-information">
        <h4 class="image-modal__image-information-title">
          {{ currentImage.author }} ~ {{ currentImage.camera }}
        </h4>
        <p class="image-modal__image-information-subtitle">
          {{ currentImage.tags }}
        </p>
      </div>
      <button
        v-if="hasPrevious"
        class="image-modal__button image-modal__button--prev"
        @click="goToPrevImage()"
      >
        <v-icon name="arrow-left" scale="1.5" />
      </button>
      <button
        v-if="hasNext"
        class="image-modal__button image-modal__button--next"
        @click="goToNextImage()"
      >
        <v-icon name="arrow-right" scale="1.5" />
      </button>
      <div class="image-modal__top-buttons">
        <button class="image-modal__button" @click="closeModal()">
          <v-icon name="times" scale="1.5" />
        </button>
        <button class="image-modal__button" @click="zoomIn()">
          <v-icon name="search-plus" scale="1.5" />
        </button>
        <button class="image-modal__button" @click="zoomOut()">
          <v-icon name="search-minus" scale="1.5" />
        </button>
        <button class="image-modal__button" @click="togglePanning()">
          <v-icon
            :name="panning.isActive ? 'hand-paper' : 'hand-rock'"
            scale="1.5"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingDots from "@/components/LoadingDots";

export default {
  components: {
    LoadingDots
  },

  props: {
    index: {
      type: Number,
      default: 1
    },
    images: {
      type: Array,
      default: () => [],
      required: true
    },
    currentImage: {
      type: Object,
      default: () => {},
      required: true
    },
    fetchingImage: {
      type: Boolean,
      default: false
    },
    hasPrevious: {
      type: Boolean,
      required: true
    },
    hasNext: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      bodyOverflowStyle: "",
      panning: {
        isActive: false,
        isDragging: null,
        offsetX: null,
        offsetY: null,
        coordX: null,
        coordY: null
      }
    };
  },

  mounted() {
    this.bodyOverflowStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this.keyDownHandler, false);
  },

  destroyed() {
    document.body.style.overflow = this.bodyOverflowStyle ?? "scroll";
    document.removeEventListener("keydown", this.keyDownHandler, false);
  },

  methods: {
    closeModal() {
      this.$emit("close");
    },

    goToPrevImage() {
      this.$emit("prev");
    },

    goToNextImage() {
      this.$emit("next");
    },

    zoomIn() {
      const image = this.$refs[`image-${this.currentImage.id}`][0];
      image.style.width = image.clientWidth + 150 + "px";
    },

    zoomOut() {
      const image = this.$refs[`image-${this.currentImage.id}`][0];
      image.style.width = image.clientWidth - 150 + "px";
    },

    togglePanning() {
      this.panning.isActive = !this.panning.isActive;
      const image = this.$refs[`image-${this.currentImage.id}-container`][0];
      if (this.panning.isActive) {
        image.classList.add("panning");
        image.onmousedown = this.startDrag;
        image.onmouseup = this.stopDrag;
      } else {
        image.onmousedown = null;
        image.onmouseup = null;
        image.onmousemove = null;
      }
    },

    keyDownHandler(event) {
      switch (event.keyCode) {
        case "37":
          this.goToPrevImage();
          break;
        case "39":
          this.goToNextImage();
          break;
        case "27":
          this.closeModal();
          break;
        default:
          break;
      }
    },

    startDrag(e) {
      let image = this.$refs[`image-${this.currentImage.id}-container`][0];

      // Defining event offsets
      this.panning.offsetX = e.clientX;
      this.panning.offsetY = e.clientY;

      // Assign default values for top and left properties
      if (!image.style.left) {
        image.style.left = "0px";
      }
      if (!image.style.top) {
        image.style.top = "0px";
      }

      // Calculate integer values for top and left properties
      this.panning.coordX = parseInt(image.style.left);
      this.panning.coordY = parseInt(image.style.top);
      this.panning.isDragging = true;

      // Drag image container
      image.onmousemove = this.dragDiv;
    },

    dragDiv(e) {
      let image = this.$refs[`image-${this.currentImage.id}-container`][0];

      // Prevent continue dragging after mouse up
      if (!this.panning.isDragging) {
        return;
      }
      // Move image container
      image.style.left =
        this.panning.coordX + e.clientX - this.panning.offsetX + "px";
      image.style.top =
        this.panning.coordY + e.clientY - this.panning.offsetY + "px";

      return false;
    },

    stopDrag() {
      this.panning.isDragging = false;
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
/* Colors */
$black-overlay: rgba(0, 0, 0, 0.98);
$black-overlay-light: rgba(0, 0, 0, 0.75);
$black-overlay-contrast: rgba(255, 255, 255, 0.6);

.image-modal {
  &__overlay {
    position: fixed;
    display: block;
    z-index: 1001;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $black-overlay;
  }

  &__content {
    height: 100%;
    width: 100%;
    white-space: nowrap;
    padding: 0;
    margin: 0;
  }

  &__container {
    position: absolute;
    z-index: 1002;
    display: block;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  &__image-container {
    display: inline-table;
    vertical-align: middle;
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: left 0.4s ease, transform 0.4s ease, -webkit-transform 0.4s ease;
  }

  &__image-content {
    display: inline-block;
    position: relative;
    margin: 0 auto;
    max-width: 100%;
    max-height: 100%;

    &.panning {
      cursor: grab;
    }

    & img {
      position: relative;
      max-width: 200%;
      max-height: 200%;
      transition: opacity 0.2s;
    }
  }

  &__image-information {
    position: absolute;
    z-index: 1002;
    width: 100%;
    padding: 0 1rem;
    display: block;
    background: $black-overlay-light;
    color: #fff;
    border: 0;
    bottom: 0;
    text-align: center;
  }

  &__top-buttons {
    position: absolute;
    z-index: 1002;
    width: 100%;
    padding: 0 1rem;
    display: block;
    background: $black-overlay-light;
    border: 0;
    right: 0;

    button {
      background: transparent;
    }
  }

  &__button {
    z-index: 1002;
    float: right;
    cursor: pointer;
    padding: 1rem;
    background: $black-overlay-light;
    color: $black-overlay-contrast;
    border: 0;
    line-height: 0;
    outline: none;

    &:hover {
      color: #fff;
    }

    &--next {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      right: 1.5%;
      vertical-align: middle;
    }

    &--prev {
      position: absolute;

      top: 50%;
      transform: translate(0, -50%);
      left: 1.5%;
    }
  }
}
</style>
