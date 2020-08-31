<template>
  <div id="app" class="app">
    <h2 class="title">AgileEngine Image Gallery</h2>

    <image-modal
      v-if="currentImage"
      :index="currentIndex"
      :images="images"
      :current-image="currentImage"
      :fetching-image="isFetchingCurrentImage"
      :has-previous="hasPreviousImage"
      :has-next="hasNextImage"
      @close="resetCurrentImage()"
      @next="fetchNextImage()"
      @prev="fetchPrevImage()"
    ></image-modal>

    <loading-dots v-if="isFetchingGalleryImages" theme="dark"></loading-dots>
    <div v-else class="image-gallery">
      <div class="image-gallery__content">
        <img
          v-for="(image, imageIndex) in images"
          :key="imageIndex"
          @click="openImageModal(imageIndex)"
          :src="image.cropped_picture"
          :alt="`image-${image.id}`"
        />
      </div>
      <pagination
        :current-page="pagination.page"
        :pages="pagination.pageCount"
        @changePage="fetchGalleryImages"
      ></pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import ImageModal from "@/components/ImageModal.vue";
import Pagination from "@/components/Pagination.vue";
import LoadingDots from "@/components/LoadingDots.vue";

export default {
  name: "app",

  components: {
    ImageModal,
    Pagination,
    LoadingDots
  },
  data() {
    return {
      currentIndex: null,
      isFetchingCurrentImage: false,
      isFetchingGalleryImages: false
    };
  },

  created() {
    this.fetchGalleryImages();
  },

  computed: {
    ...mapState({
      images: state => state.images.images,
      pagination: state => state.images.pagination,
      currentImage: state => state.images.currentImage
    }),

    hasPreviousImage() {
      return this.pagination.page > 1 || this.currentIndex > 0;
    },

    hasNextImage() {
      return (
        this.pagination.hasMore || this.currentIndex < this.images.length - 1
      );
    }
  },

  methods: {
    ...mapActions("images", {
      fetchImages: "fetchImages",
      fetchImage: "fetchImage",
      resetCurrentImage: "resetImage"
    }),

    openImageModal(imageIndex) {
      this.currentIndex = imageIndex;
      this.fetchCurrentImage();
    },

    async fetchPrevImage() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
        this.fetchCurrentImage();
      } else if (this.pagination.page > 1) {
        await this.fetchGalleryImages(this.pagination.page - 1);
        this.currentIndex = this.images.length - 1;
        this.fetchCurrentImage();
      }
    },

    async fetchNextImage() {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex += 1;
        this.fetchCurrentImage();
      } else if (this.pagination.hasMore) {
        await this.fetchGalleryImages(this.pagination.page + 1);
        this.currentIndex = 0;
        this.fetchCurrentImage();
      }
    },

    async fetchCurrentImage() {
      this.isFetchingCurrentImage = true;
      await this.fetchImage(this.images[this.currentIndex].id);
      this.isFetchingCurrentImage = false;
    },

    async fetchGalleryImages(page) {
      this.isFetchingGalleryImages = true;
      await this.fetchImages(page);
      this.isFetchingGalleryImages = false;
    }
  }
};
</script>

<style lang="scss">
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 2rem;
}

.title {
  text-align: center;
}

.image-gallery__content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  grid-gap: 1em;
  margin: 2rem 0;

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }

  img {
    width: 100%;
    height: auto;
    cursor: pointer;
  }
}
</style>
