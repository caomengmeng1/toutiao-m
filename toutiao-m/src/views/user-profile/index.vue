<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
    class="page-nav-bar"
    title="个人信息"
    left-arrow
    @click-left="$router.back()"
    />
    <!-- 导航栏 -->

    <input type="file" hidden ref="file" @change="onFileChange">
    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
        <van-image
        class="avatar"
        fit="cover"
        round
        :src="user.photo"
        />
    </van-cell>
    <van-cell 
    title="昵称" 
    is-link 
    :value="user.name" 
    @click="isUpdateNameShow = true"/>
    <van-cell 
    title="性别" 
    is-link 
    :value="user.gender === 0 ? '男' : '女'" 
    @click="isUpdateGenderShow = true"
    />
    <van-cell 
    title="生日" 
    is-link 
    :value="user.birthday" 
    @click="isUpdateBirthdayShow = true"
    />
    <!-- 个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup 
    v-model="isUpdateNameShow" 
    position="bottom" 
    :style="{ height: '100%' }">
        <UpdateName 
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
        ></UpdateName>
    </van-popup>
    <!-- 编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup 
    v-model="isUpdateGenderShow" 
    position="bottom" >
        <UpdateGender
        v-if="isUpdateGenderShow"
        v-model="user.gender"
        @close="isUpdateGenderShow = false"
        ></UpdateGender>
    </van-popup>
    <!-- 编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup 
    v-model="isUpdateBirthdayShow" 
    position="bottom" >
        <UpdateBirthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
        ></UpdateBirthday>
    </van-popup>
    <!-- 编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup 
    v-model="isUpdatePhotoShow" 
    position="bottom" 
    style="height:100%;"
    >
        <UpdatePhoto 
        v-if="isUpdatePhotoShow"
        :img="img" 
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
        ></UpdatePhoto>
    </van-popup>
    <!-- 编辑头像 -->
  </div>
</template>

<script>
import {getUserProfile} from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
    name:'UserProfile',
    components:{
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
},
    prop:{},
    data(){
        return {
            user:{},//个人信息
            isUpdateNameShow:false,
            isUpdateGenderShow:false,
            isUpdateBirthdayShow:false,
            isUpdatePhotoShow:false,
            img:null, //预览的图片
        }
    },
    created (){
        this.loadUserProfile()
    },
    methods:{
        async loadUserProfile (){
            try{
                const {data} = await getUserProfile()
                console.log(data);
                this.user = data.data
            }catch(err){
                this.$toast('获取数据失败')
            }
        },
        onFileChange () {
            // 获取文件对象
            const file = this.$refs.file.files[0]
            // 基于文章对象获取blob数据
            // const data = window.URL.createObjectURL(file)
            this.img = window.URL.createObjectURL(file)
            // console.log(data);

            // 展示预览图片弹出层
            this.isUpdatePhotoShow = true 

            // file-input 如果选了同一个文件不会触发 change事件
            // 解决办法但就是每次使用完毕，把它的value清空
            this.$refs.file.value = ''
        }
    },


}
</script>

<style scoped lang="less">
    .user-profile{
        .avatar{
            width: 60px;
            height: 60px;
        }
        .van-popup{
            background-color: #f5f7f9;
        }
    }
</style>