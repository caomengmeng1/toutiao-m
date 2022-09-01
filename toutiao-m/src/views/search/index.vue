<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/" class="search-from">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词" 
        background="#3296fa"
        @focus="isResultShow = false"
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result 
    v-if="isResultShow" 
    :search-text = "searchText"
    />
    <!-- 搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion 
    v-else-if="searchText" 
    :search-text = "searchText"
    @search="onSearch"/>
    <!-- 联想建议 -->

     <!-- 搜索历史记录 -->
    <search-history 
    v-else 
    :search-histories="searchHistories" 
    @clear-search-histories = "searchHistories =[]" 
    @search="onSearch"/>
    
    <!-- 搜索历史记录 -->


  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem,getItem } from '@/utils/storage'

export default {
  name: "SearchIndex",
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult,
  },
  props: {},
  data() {
    return {
        searchText: '', // 控制输入框的内容显示
        isResultShow:false, //控制搜索结果的展示
        searchHistories:getItem('TOUTIAO_SEARCH_HISTORIES') || [],//搜索的历史记录数据
    };
  },
  computed: {},
  watch: {
    // 监视历史记录数据，发生变化就会触发
    searchHistories(value){
        // console.log('zhende');
        setItem('TOUTIAO_SEARCH_HISTORIES',value)
    }
    // 原写法：
    // searchHistories(){
    //     handler(){}
    // }
  },
  created() {},
  methods: {
    onSearch(val) {
      console.log(val);
      this.searchText = val //更新文本框内容

        // 存储搜索历史记录
        // 要求：不要有重复的历史记录，最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if(index !== -1){
        this.searchHistories.splice(index,1)
      }
      this.searchHistories.unshift(val) //存储搜索历史记录
      
      this.isResultShow = true //点击搜索后展示搜索结果
    },
    onCancel() {
      this.$router.back()
    },
  },
};
</script>

<style scoped lang="less">
    .search-container{
        padding-top: 108px;
        .van-search__action{
            color: #fff;
        }
        .search-from{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1;
        }
    }
    
</style>