<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control class="tab-control" :titles="['流行', '新款', '精选']" @tabClick="tabClick"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import GoodsListItem from "components/content/goods/GoodsListItem";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import {getHomeMultidata, getHomeGoods, } from "network/home";

  import HomeSwiper from './childCompt/HomeSwiper';
  import RecommendView from "./childCompt/RecommendView";
  import FeatureView from "./childCompt/FeatureView";

  import data from "network/模拟json数据1"

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      GoodsListItem,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowBackTop: false
      }
    },
    created() {
      //请求多个数据
      this.getHomeMultidata()
      // 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
      //监听GoodsListItem中图片加载完成
      //为了解决scroll在加载页面滚动时候滚动不完全的问题
      this.$bus.$on('ItemImgload', () => {
        this.$refs.scroll.refresh()
      })
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {
        this.isShowBackTop = (-position.y) > 1000
      },
      loadMore() {
        //上拉加载数据
        console.log('上拉加载更多');
        //加载结束
        this.$refs.scroll.scroll.finishPullUp()
      },
      /**
       * 网络请求相关方法
       */
      //轮播图网络请求
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      //热点页面网络请求，因为视频教程api不能用所以以下方法可以用但是重新编辑一个方法实现模拟数据
      // getHomeGoods(type) {
      //   const page = this.goods[type].page + 1
      //   getHomeGoods(type).then(res => {
      //     this.goods[type].list.push(...res.subjects)
      //     this.goods[type].page += 1
      //   })
      // }
      getHomeGoods(type) {
        (type == 'pop') ? this.goods[type].list.push(...data.list.pop) :
          ((type == 'new') ? this.goods[type].list.push(...data.list.new) :
            this.goods[type].list.push(...data.list.sell))
        this.goods[type].list.push(...data.list.pop)
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    }
  }
</script>

<style scoped>
  #home {
   padding-top: 44px;
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: white;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }
  .content {
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    right: 0px;
    left: 0px;
  }
</style>
