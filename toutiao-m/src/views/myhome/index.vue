<template>
  <!-- 首页布局 -->

  <div class="home-container">
    <!-- 头部 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search" 
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>

    <!-- 频道列表 -->
    <!-- 
      通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签
      通过 animated 属性可以开启切换标签内容时的转场动画。
      通过 swipeable 属性可以开启滑动切换标签页
     -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- {{channel.name}}的内容 -->
        <!-- 文章列表 -->
        <ArticleList :channel="channel"></ArticleList>
        <!-- 文章列表 -->
      </van-tab>

      <!-- 占位标签 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 右侧汉堡按钮 -->
      <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow=true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!-- (汉堡按钮)频道编辑的弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom" 
      close-icon-position="top-left"
      :style="{ height: '100%' }">
        <ChannelEdit 
        :mychannels="channels" 
        :active = "active"
        @update-active = "onUpdateActive"
        />
    </van-popup>

  </div>
</template>

<script>
import { mapState } from "vuex";
// 引用请求数据的方法
import { getUserChannels } from "@/api/user";
// 引入子组件，文章列表组件
import ArticleList from "./components/article-list";
// 引入频道编辑弹出层
import ChannelEdit from '@/views/myhome/components/channel-edit'
import { getItem } from '@/utils/storage';
export default {
  name: "HomeIndex",
  data() {
    return {
      active: 0,
      channels: [], //频道列表
      isChannelEditShow:false,// 这里我们先设置为 true 就能看到弹窗的页面了
    };
  },
  components: {
    // 注册
    ArticleList,
    ChannelEdit,
  },
  computed:{
    ...mapState(['user'])
  },
  created() {
    this.loadChannels();
  },
  methods: {
    async loadChannels() {
      try {
        // const { data } = await getUserChannels();
        // // console.log(data);
        // this.channels = data.data.channels;
        let channels = []
        if(this.user){
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels();
          channels = data.data.channels;
        }else{
          // 未登录，判断是否有本地的频道列表数据
          const loadChannels = getItem('TOUTIAO_CHANNELS')
          if(loadChannels){
            // 有，就拿来用
            channels = loadChannels
          }else{
            // 没有，请求获取默认频道列表
            const { data } = await getUserChannels();
            channels = data.data.channels;
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast("获取频道列表失败");
      }
    },
    onUpdateActive(index,isChannelEditShow=true){
      this.active = index //更新激活的频道项
      this.isChannelEditShow=isChannelEditShow//关闭弹出层
    }
  },
};
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    font-weight: 400;
    .van-icon {
      font-size: 32px;
    }
  }
  // 在scoped局域内，只能访问到元素的根标签，所以要加/deep/
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      height: 80px;

      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 28px;
      color: #777;
    }
    .van-tab--active {
      font-size: 30px;
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
      .van-tabs__line {
        width: 31px !important;
        height: 6px;
        background-color: #3296fa;
        border-radius: 3px;
        bottom: 8px;
      }
    }
    .placeholder {
      // 宽高设置为汉堡按钮标签的大小，以便将最后一个导航标签完全显示出来
      width: 66px;
      height: 82px;
      // 此时发现宽高并未生效，是因为flex布局将每个标签分为22%，此时不让这个占位标签参与到flex布局即可
      flex-shrink: 0; //默认是1
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #ffffff;
      opacity: 0.9;
      i.toutiao {
        font-size: 33px;
        color: #333333;
      }
      // 定义一个伪元素，将汉堡按钮的左渐变边框作为图片显示，并定位到这里
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>