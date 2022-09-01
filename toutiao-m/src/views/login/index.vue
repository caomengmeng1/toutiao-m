<template>

<!-- 登录页面 -->

  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <!-- 点击关闭按钮，后退 -->
      <van-icon @click="$router.back()" slot="left" name="cross" />
    </van-nav-bar>

    <!-- 登录表单 -->
    <!--
      表单验证：
        1、给 van-field 组件配置 rules 验证规则
          参考文档：https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2、当表单提交的时候会自动触发表单验证
           如果验证通过，会触发 submit 事件
           如果验证失败，不会触发 submit
     -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <!-- 使用具名插槽的方式，添加自己的图标样式 -->
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- 倒计时 -->
          <!-- finish事件	倒计时结束时触发 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 10"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <!-- 绑定点击事件 -->
          <van-button
            v-else
            class="send-sms-btn"
            native-type="button"
            size="small"
            round
            type="default"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 按需引入login
import { login, sendSms } from "@/api/user";

export default {
  name: "LoginPage",
  data() {
    return {
      user: {
        mobile: "", // 手机号
        code: "", // 验证码
      },
      userFormRules: {
        mobile: [
          {
            required: true, //是否为必选字段，
            message: "手机号不能为空",
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: "手机号格式错误",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误",
          },
        ],
      },
      isCountDownShow: false,
    };
  },
  methods: {
    async onSubmit() {
      // 1.获取表单数据
      const user = this.user;
      // 2.表单验证

      // 01.登录中的轻提示
      this.$toast.loading({
        //在组件中可以直接通过this.$toast调用
        message: "登录中...", // 提示消息
        forbidClick: true, // 是否禁止背景点击
        //  Toast 的默认展示时长设置为 2000 毫秒，设置为0 一直展示
        duration: 0,
      });
      // 3.提交表单请求登录
      try {
        const res = await login(user);
        //  console.log("登录成功", res);
        this.$store.commit('setUser',res.data.data)
       
        // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
        this.$toast.success("登录成功"); // 成功提示

        // 登录成功，跳转到原来的页面
        // back方法不严谨，后面讲优化的时候再讲
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          // console.log('手机号或验证码错误');
          this.$toast.fail("手机号或验证码错误"); // 失败提示
        } else {
          // console.log('登录失败，请稍后重试',err);
          this.$toast.fail("登录失败，请稍后重试"); // 失败提示
        }
      }
      // 4.根据请求相应结果处理后续操作
    },
    // 验证码处理

    async onSendSms() {
      // 1.点击按钮-点击按钮-效验手机号
      console.log("onSendSms");
      try {
        await this.$refs.loginForm.validate("mobile"); //验证表单，支持传入一个或多个 name 来验证单个或部分表单项，不传入 name 时，会验证所有表单项
      } catch (err) {
        return console.log("验证失败", err);
      }
      // console.log(123);
      // 2.验证通过，显示倒计时
      this.isCountDownShow = true;
      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile);
        this.$toast("发送成功");
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false;
        if (err.response.status === 429) {
          this.$toast("发送太频繁了，请稍后重试");
        } else {
          this.$toast("发送失败，请稍后重试");
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
    color: #666;
  }
  .send-sms-btn {
    width: 160px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>