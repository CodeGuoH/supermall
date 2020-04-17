<template>
  <div id="detail">
    <detail-nav-bar></detail-nav-bar>
  </div>
</template>

<script>
  import DetailNavBar from "./detailComps/DetailNavBar";
  export default {
    name: "Detail",
    components: {
      DetailNavBar
    },
    data() {
      return {
        iid: null
      }
    },
    created() {
      this.iid = this.$route.params.discribe
      console.log(this.iid);
    }
  }
</script>

<style scoped>

</style>
