<template>

<!-- 我的页面布局 -->

  <div class="my-container">
    <!-- 登录 -->
    <div v-if="user" class="header user-info">
      <!-- 基本信息-头像 -->
      <div class="base-info">
        <div class="left">
          <van-image
            round
            fit="cover"
            class="avator"
            :src="userInfo.photo"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button 
          size="mini" 
          round
          to="/user/profile"
          >编辑资料</van-button>
        </div>
      </div>
      <!-- 数据信息 -->
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div v-else class="header not-login">
      <!-- 点击跳转页面 -->
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 宫格导航 -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>

      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <!-- 消息通知，小艾同学，退出登录 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小艾同学" is-link class="xiaoai" />
    <van-cell
      v-if="user"
      title="退出登录"
      class="signout"
      clickable
      @click="onSignout"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import {getUserInfo} from '@/api/user'
export default {
  name: "MyIndex",
  data(){
    return{
      userInfo:{} // 用户信息

    }
  },
  computed: {
    ...mapState(["user"]),
  },
  created(){
    // 如果用户登录了，则请求加载用户信息数据
    if(this.user){
      this.loadUserInfo()
    }
  },
  methods: {
    onSignout() {
      // 退出提示，
      // 在组件中需要使用 this.$dialog来调用弹框组件
      this.$dialog.confirm({
        title: "确认退出吗？",
      })
        .then(() => {
          // on confirm
          // 确认退出：清除登录状态（容器中的user+本地存储中的user）
          // console.log('确认执行这里');
          this.$store.commit('setUser',null)

        })
        .catch(() => {
          // on cancel
          console.log('取消执行这里');
        })
    },
    async loadUserInfo(){
      try{
        const {data} = await getUserInfo()
        this.userInfo = data.data
      }catch(err){
        this.$toast('获取数据失败，请稍后重试')
      }
    }
  },
};
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url(@/assets/banner.png);
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      // background-color: pink;
      padding: 76px 32px 23px;
      box-sizing: border-box;

      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;

        .avator {
          width: 132px;
          height: 132px;
          margin-right: 23px;

          border: 4px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      // height: 130px;
      // background-color: blue;

      display: flex;
      // justify-content: space-between;
      .data-item {
        height: 130px;
        flex: 1;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;

        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
        color: #333333;
      }
    }
  }
  .signout {
    text-align: center;
    color: #d86262;
    font-size: 30px;
  }
  .xiaoai {
    margin-bottom: 9px;
  }
}
</style>