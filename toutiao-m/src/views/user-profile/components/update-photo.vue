<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img"/>
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'

export default {
    name:"UpdatePhoto",
    props:{
        img:{
            type:[String,Object],
            required:true
        }
    },
    data () {
        return {
            cropper:null
        }
    },
    mounted (){
        const image = this.$refs.img
        this.cropper = new Cropper(image, {
            viewMode: 1, 
            dragMode: 'move',
            aspectRatio: 1,
            autoCropArea: 1,
            cropBoxMovable: false,
            cropBoxResizable: false,
            background: false,
            // movable: true,
        })
        // console.log(cropper)
    },
    methods:{
        onConfirm (){
            // 基于服务端的裁切使用：getData 方法，该方法得到裁切的区域参数。
            // console.log(this.cropper.getData());

            // 纯客户端的图片裁切，则使用：getCroppedCanvas 方法，该方法得到裁切之后的图片对象
            this.cropper.getCroppedCanvas().toBlob(blob => {
                // console.log(blob);
                this.updateUserPhoto(blob)
            })

        },

        async updateUserPhoto (blob) {
            this.$toast.loading({
                message:'保存中...',
                forbidClick:true, //禁止背景点击
                duration:0, //持续展示
            })
            try{
                // 错误用法：

                // 注意：如果接口要求 Content-Type 是 application/json
                // 则传递普通  JavaScript 对象
                // updateUserPhoto({
                //     photo:blob
                // })

                // 如果接口要求 Content-Type 是 multipart/form-data
                // 则 必须传递 FormData 对象
                const formData = new FormData();
                formData.append('photo', blob);

                const {data} = await updateUserPhoto(formData)
                // console.log(data);

                // 更新视图
                this.$emit('update-photo',data.data.photo)
                // 关闭弹出层
                this.$emit('close')
                
                // 提示成功
                this.$toast.success('更新成功')
            }catch(err){
                this.$toast.fail('更新失败')
            }
        }

    },
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>