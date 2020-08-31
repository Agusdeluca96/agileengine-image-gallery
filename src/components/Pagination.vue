<template>
  <nav class="pagination">
    <ul>
      <li><a @click="changePage(1)">&laquo;</a></li>
      <li>
        <a
          v-for="page in pages"
          :key="page"
          :class="page === currentPage && 'active'"
          @click="changePage(page)"
        >
          {{ page }}
        </a>
      </li>
      <li><a @click="changePage(pages)">&raquo;</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    pages: {
      type: Number,
      required: true
    }
  },

  methods: {
    changePage(page) {
      this.$emit("changePage", page);
    }
  }
};
</script>
<style lang="scss" scoped>
.pagination {
  line-height: 1;
  font-weight: 400;
  margin-top: 2rem;
  text-align: center;
  transition: font-size 0.2s ease-in-out;

  ul {
    list-style-type: none;
    font-size: 100%;
    margin: 0;
    padding: 0.5em;

    li {
      display: inline-block;
      font-size: 100%;
      width: auto;
      border-radius: 3px;

      a {
        cursor: pointer;
        color: black;
        float: left;
        padding: 8px 12px;
        text-decoration: none;
        transition: background-color 0.3s;

        &.active {
          background-color: dodgerblue;
          color: white;
        }

        &:hover:not(.active) {
          background-color: #ddd;
        }
      }
    }
  }
}
</style>
