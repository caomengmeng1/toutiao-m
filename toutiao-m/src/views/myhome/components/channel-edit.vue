<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
        <div slot="title" class="title-text">我的频道</div>
        <!-- van-button 没有写slot是因为默认插槽就会插到右侧 -->
        <van-button
            class="edit-btn"
            size="mini"
            round
            type="danger"
            plain 
            @click="isEdit = !isEdit"
        >{{isEdit? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
        <van-grid-item 
        class="grid-item" 
        v-for="(channel,index) in mychannels" 
        :key="index" 
        @click="onMyChannelClick(channel,index)"
        >
            <van-icon 
            v-show="isEdit && !fixedChannels.includes(channel.id)" 
            slot="icon" 
            name="clear"></van-icon>
            <!-- 自定义一个文字插槽，以便写激活样式 -->
            <!-- v-bind:class 语法
            一个对象，对象中的key表示要作用的css类名对象中的value要计算出布尔值
            true--则作用该类名，false--不作用类名 -->
            <span 
            class="text"
            :class="{active: index===active}"
            slot="text"
            >{{channel.name}}</span>
        </van-grid-item>

    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
        <div slot="title" class="title-text">频道推荐</div>
        <!-- van-button 没有写slot是因为默认插槽就会插到右侧 -->
        <van-button
            class="edit-btn"
            size="mini"
            round
            type="danger"
            plain
        >编辑</van-button>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
        <van-grid-item 
        class="grid-item" 
        v-for="(channel,index) in recommendChannels" 
        :key="index" 
        icon="plus"
        :text="channel.name" 
        @click="onAddChannel(channel)"/>
    </van-grid>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
// 引入所有频道列表的请求方法
import {getAllChannels , addUserChannels,deleteUserChannels} from '@/api/channel'
export default {
    name: 'ChannelEdit',
    components: {},
    props: {
        // 将父组件的channels传入子组件这里
        mychannels:{
            type:Array,
            required:true
        },
        active:{
            type:Number,
            required:true
        },
    },
    data () {
        return {
            allChannels:[], // 所有频道
            isEdit:false, //控制编辑状态的显示
            fixedChannels:[0],  //固定频道，不允许删除,数组里存的是id
        }
    },
    computed: {
        // 获取频道推荐数据的方法  频道推荐数据 = 所有频道数据-我的频道数据
        // recommendChannels(){
        //     // 定义一个空数组
        //     const channels = []
        //     // 遍历所有频道数据
        //     this.allChannels.forEach(channel => {
        //         // find遍历数组，找到满足条件的元素项
        //         const ret = this.mychannels.find(mychannel =>{
        //             return mychannel.id === channel.id
        //         })
        //         // 如果我的频道中不包括该频道项，则收集到推荐频道中
        //         if(!ret){
        //             channels.push(channel)
        //         }
        //     })
        //     // 把计算结果返回
        //     return channels
            
        // }

        // 简写
        // 计算属性会观测内部依赖数据的变化
        // 如果依赖的数据发生变化，则计算属性会重新执行
        recommendChannels(){
            // 数组的filter方法：遍历数组，把符合条件的元素存储到新数组并返回
            return this.allChannels.filter(channel => {
                // 数组的find方法：遍历数组，把符合条件的第一个元素返回
                return !this.mychannels.find(myChannel => {
                    return myChannel.id ===  channel.id
                })
            })
        },
        ...mapState(['user']),
    },
    watch: {},
    created () {
        this.loadAllChannels()
    },
    mounted () {},
    methods: {
        async loadAllChannels(){
            try {
                const {data} = await getAllChannels()
                console.log(data);
                this.allChannels = data.data.channels
            }catch(err){
                this.$toast('数据获取失败')
            }
        },
        // 点击 从频道推荐添加到我的频道中
        async onAddChannel (channel){
            this.mychannels.push(channel)

            // 数据持久化处理
            if(this.user){
               try{
                 // 已登录，把数据请求接口放到线上
                await addUserChannels({
                    id:channel.id, // 频道ID
                    seq:this.mychannels.length // 序号
                })
               } catch (err){
                this.$toast('保存失败，请稍后重试')
               }
            }else{
                // 未登录，把数据存储到本地
                setItem('TOUTIAO_CHANNELS',this.mychannels)
            }
        },
        onMyChannelClick(channel,index){
            // console.log(channel);
            // console.log(index);
            if(this.isEdit){
                // isEdit等于true，是处于编辑状态，，执行删除列表

                // 1.如果是固定频道，则不删除
                if(this.fixedChannels.includes(channel.id)){
                    return 
                }
                // 2.删除频道项
                // 参数1：要删除元素的开始索引(包括)
                // 参数2：要删除的个数，如果不指定，则从参数1开始一直删到最后
                this.mychannels.splice(index,1)

                // 3.如果删除的激活频道之前的频道，则更新激活的频道项
                if(index <= this.active){
                    // 让激活频道的索引减1,并且在删除状态下不关闭弹出层
                    this.$emit('update-active',this.active-1,true)
                }
                // 4.处理持久化
                this.deleteChannel(channel)
            }else{
                // isEdit等于false，是处于非编辑状态，，执行切换频道
                this.$emit('update-active',index,false) //通知父组件更改索引
            }
        },
        async deleteChannel(channel){
            try{
                if(this.user){
                    // 已登录，则将数据更新到线上
                    await deleteUserChannels(channel.id)
                }else{
                    setItem('TOUTIAO_CHANNELS',this.mychannels)
                }
            }catch(err){
                this.$toast('操作失败，请稍后重试')
            }
        }
    }
    }
</script>

<style scoped lang="less">
    .channel-edit{
        padding: 85px 0;
        .title-text{
            font-size: 32px;
            color: #333;
        }
        // 编辑按钮
        .edit-btn{
            width: 104px;
            height: 48px;
            font-size: 26px;
            color: #f85959 ;
            border: 1px solid #f85959;
        }
        /deep/ .grid-item{
            width: 160px;
            height: 86px;
            .van-grid-item__content{
                white-space: nowrap; //统一设置，文字不折行
                background-color: #f4f5f6;
                .van-grid-item__text,.text{
                    font-size: 28px;
                    color: #222;
                    margin-top: 0;
                    
                }
                .active{
                    color:red;
                }
            }
        }
        /deep/ .recommend-grid{
            .grid-item{
                .van-grid-item__content{
                    flex-direction: row;
                    .van-icon-plus{
                        font-size: 28px;
                        margin-right: 6px;
                    }
                    
                }
            }
        }

        /deep/ .my-grid{
            .grid-item{
                .van-icon-clear{
                    position: absolute;
                    right: -10px;
                    top: -10px;
                    font-size: 30px;
                    color: #cacaca;
                    z-index: 2;
                }
                .van-grid-item__icon-wrapper{
                    position: unset;
                }
            }
        }
    }
</style>