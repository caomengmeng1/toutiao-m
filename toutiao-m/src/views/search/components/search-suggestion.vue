<template>
  <div class="search-suggestion">
    <van-cell 
    v-for="(text,index) in suggestions" 
    :key="index" 
    icon="search"
    @click="$emit('search',text)">
      <div slot="title" v-html="hightlight(text)"></div>
    </van-cell>
    <!-- 双花括号绑定会直接输出纯文本内容 -->
    <!-- <div>{{htmlStr}}</div> -->
    <!-- 使用 v-html指令可以绑定渲染带有html标签的字符串 -->
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>

<script>
import {getSearchSuggestions} from '@/api/search'
// 按需加载有好处：只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText:{
      type:String,
      required:true,
    }
  },
  data () {
    return {
      suggestions:[], //联想建议数据列表
      // htmlStr:'Hello <span style="color:red">World</span>',
    }
  },
  computed: {},
  watch: {
    searchText:{
      // 当searchText 发生改变的时候就会调用handler函数
      // 注意：handler 函数名称是固定的
      // handler(value){
      //   console.log(value);
      // },
      // handler:function(value){
      //   console.log(value);
      // },
      
      // debounce函数
      // 参数1：一个函数
      // 参数2：延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function(value){
        // console.log(value);
        this.loadSearchSuggestions(value)
      },500),
      // handler(value){
      //   // console.log(value);
      //   this.loadSearchSuggestions(value)
      // },
      // immediate：指定在侦听器创建时是否立即触发回调
      immediate:true
    }
  },
  created () {},
  mounted () {},
  methods: {
    async loadSearchSuggestions(q){
      try{
        const{data} = await getSearchSuggestions(q)
        // console.log(data);
        this.suggestions = data.data.options
      }catch(err){[
        this.$toast('数据获取失败，请稍后重试')
      ]}
    },
    hightlight(text){
      const hightlightStr = `<span style="color: #3296fa;">${this.searchText}</span>`
      // 正则表达式 /中间的内容都会当作匹配字符来使用，而不是数据变量/
      // 如果需要根据数据变量动态的创建正则表达式，则手动new RegExp
      // RegExp正则表达式构造函数
      // 参数1：匹配模式字符串，他会根据这个字符串创建正则对象
      // 参数2：匹配模式，要写到字符串中
      // g ------全局
      // i-------不区分大小写
      const reg = new RegExp(this.searchText,'gi')
      return text.replace(reg,hightlightStr)
      
    }
  }
}
</script>

<style scoped lang="less"></style>