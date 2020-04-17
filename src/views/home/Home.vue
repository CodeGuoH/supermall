<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl1" class="tab-control" v-show="isTabFixed"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperimageload="swiperimageload"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl2" />
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
  import {debounce} from 'common/utils'

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
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    created() {
      //请求多个数据
      this.getHomeMultidata()
      // 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted() {
      //监听GoodsListItem中图片加载完成
      //为了解决scroll在加载页面滚动时候滚动不完全的问题
      const refresh = debounce(this.$refs.scroll.refresh, 500)
      this.$bus.$on('ItemImgload', () => {
        refresh()
      })
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      swiperimageload() {
        //获取tabcontrol的offsettop
        //所有的组件都有一个属性叫$el:用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
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
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {
        //判断backtop是否显示
        this.isShowBackTop = (-position.y) > 1000
        //决定tabcontrol是否吸顶（position=fixd）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
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
    },
    destroyed() {

    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
    }
  }
</script>

<style scoped>
  #home {
   padding-top: 0;
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: white;
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  .tab-control {
    position: relative;
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
