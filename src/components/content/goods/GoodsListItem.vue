<template>
  <div class="goods-item" @click="itemClick">
<!--    <img src="../../../assets/GHimg/1/1.jpg" alt="">-->
<!--    <a :href="goodsItem.alt">-->
      <img :src="goodsItem.img" alt="" @load="imgLaod">
<!--    </a>-->
    <div class="goods-info">
      <p>
        {{goodsItem.title}}
        <br>
        <span class="price">{{goodsItem.title}}</span>
        <span class="collect">{{goodsItem.discribe}}</span>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GoodsListItem",
    props: {
      goodsItem: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      imgLaod() {
        this.$bus.$emit('ItemImgload')
      },
      itemClick() {
        this.$router.push('/detail/' + this.goodsItem.discribe)
      }
    }
  }
</script>

<style scoped>
  .goods-item {
    padding-bottom: 40px;
    position: relative;

    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>
