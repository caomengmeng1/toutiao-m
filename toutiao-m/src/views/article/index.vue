<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 关注与已关注 -->
          <!-- 模版中的$event是事件参数
            当我们传递给子组件的数据既要使用还要修改
            传递：props
            :is-followed="article.is_followed"
            修改：自定义事件
            @update-is_followed="article.is_followed=$event" 
            简写方式：在组件上使用 v-model
            value="article.is_followed"
            @input="article.is_followed=$event"
            如果需要修改v-model的规则名称，可以通过子组件的model属性来配置修改

            一个组件上只能使用一次 v-model,
            如果有多个数据需要实现类似于 v-model的效果，
            可以使用属性的 .sync 修饰符
             -->
          <FollowUser
            :user-id="article.aut_id"
            class="follow-btn"
            v-model="article.is_followed"
          ></FollowUser>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <commentList
        :source="article.art_id" 
        :list="commentList"
        @onload-success="totalCommentCount=$event.total_count" 
        @reply-click="onReplyClick"
        ></commentList>
        <!-- 文章评论列表 -->


        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button 
          class="comment-btn" 
          type="default" 
          round 
          size="small" 
          @click="isPostShow = true"
          >写评论</van-button
          >
          <van-icon 
          name="comment-o" 
          :info="totalCommentCount" 
          color="#777" 
          />

          <!-- 文章收藏 -->
          <CollectArticle 
          class="btn-item"
          v-model="article.is_collected"
          :article-id="article.art_id"></CollectArticle>

          <!-- <van-icon color="#777" name="star-o" /> -->
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <!-- 文章点赞 -->
          <LikeArticle 
          class="btn-item"
          v-model="article.attitude"
          :article-id="article.art_id"></LikeArticle>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论 -->
        <van-popup 
        v-model="isPostShow" 
        position="bottom" 
        >
          <CommentPost 
          :target="article.art_id"
          @post-success="onPostSuccess"
          />
        </van-popup>
        <!-- 发布评论 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <!-- 弹出层是懒渲染的：只有在第一次展示的时候才会渲染里面的内容 ，
    之后它的关闭和显示都是在切换内容的显示隐藏，
    这也导致第一次点击回复时渲染的数据，与之后点击任何评论的回复弹出层的数据是一样的-->
    <van-popup 
      v-model="isReplayShow" 
      position="bottom" 
      style="height:100%;"
      >
      <!-- v-if 条件渲染
           true：渲染元素节点
           false：不渲染
           因此可以解决弹出层懒渲染导致的问题 -->
        <CommentReply 
        :comment="currentComment"
        v-if="isReplayShow"
        @close="isReplayShow = false"/>
    </van-popup>
    <!-- 评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from "@/api/article";
import { ImagePreview } from "vant";
import FollowUser from "@/components/follow-user";
import CollectArticle from "@/components/collect-article";
import LikeArticle from "@/components/like-article"
import commentList from "./components/comment-list"
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'

// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg',
//   ],
//   // 起始位置
//   startPosition: 1,
//   onClose() {
//     Toast('关闭');
//   },
// });

export default {
  name: "ArticleIndex",
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    commentList,
    CommentPost,
    CommentReply,
},
// 给所有的后代组件提供数据
// 注意：不要滥用
provide() {
    // 使用函数的形式，可以访问到 `this`
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {}, //文章详情
      loading: true, //加载中的loading状态
      errStatus: 0, //失败的状态码
      followLoading:false,
      totalCommentCount:0,
      isPostShow:false, //控制发布评论的显示状态
      commentList:[], //评论列表
      isReplayShow:false, // 控制评论弹出层
      currentComment:{} // 当前点击回复的评论项
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle();
  },
  mounted() {},
  methods: {
    async loadArticle() {
      // 展示loading加载中
      this.loading = true;
      try {
        const { data } = await getArticleById(this.articleId);

        // 模拟加载失败
        // if(Math.random() > 0.5){
        //   JSON.parse('dagdkgdkkkdkh')
        // }
        // console.log(data);
        this.article = data.data;

        // 初始化图片点击预览
        // console.log(this.$refs['article-content']);
        setTimeout(() => {
          // console.log(this.$refs['article-content']);
          this.previewImage();
        }, 0);

        // this.loading = false
      } catch (err) {
        // this.loading = false
        // console.log('获取数据失败，请稍后重试',err)
        if (err.response && err.response.status === 404) {
          this.errStatus = 404;
        }
      }
      // 无论成功与失败，都需要关闭loading
      this.loading = false;
    },
    previewImage() {
      // 得到所有的img节点
      const articleContent = this.$refs["article-content"];
      const imgs = articleContent.querySelectorAll("img");
      // 获取所有的img地址
      const images = [];
      imgs.forEach((img, index) => {
        images.push(img.src);
        // 给每个img注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置
            startPosition: index,
          });
        };
      });
      // console.log(images);
    },
    onPostSuccess (data){
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick (comment) {
      // console.log(comment)
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplayShow = true
    }
    // async onFollow() {
    //   this.followLoading = true; //展示关注按钮的loading状态
    //   try {
    //     if (this.article.is_followed) {
    //       // 已关注，取消关注
    //       // const {data} = await deleteFollow(this.article.aut_id)
    //       // console.log(data);
    //       await deleteFollow(this.article.aut_id);
    //       // this.article.is_followed = false
    //     } else {
    //       // 没有关注，添加关注
    //       // const {data} = await deleteFollow(this.article.aut_id)
    //       // console.log(data);
    //       await addFollow(this.article.aut_id);
    //       // this.article.is_followed = true
    //     }
    //     this.article.is_followed = !this.article.is_followed;
    //   } catch (err) {
    //     // this.$toast('操作失败，请稍后重试')
    //     let message = "操作失败，请重试";
    //     if (err.response && err.response.status === 400) {
    //       message = "你不能关注你自己！";
    //     }
    //     this.$toast(message);
    //   }
    //   this.followLoading = false; //关闭关注按钮的loading状态
    // },
  },
};
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
  .van-button--default {
    border: unset;}
}
</style>