<template>
  <div class="update-birthday">
    
    <van-datetime-picker
    v-model="currentDate"
    type="date"
    title="选择年月日"
    :min-date="minDate"
    :max-date="maxDate"
    @cancel="$emit('close')"
    @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
    name:"UpdateBirthday",
    props:{
        value:{
            type:String,
            required:true
        }
    },
    data() {
        return {
        minDate: new Date(1964, 0, 1), // 可选的最小日期
        maxDate: new Date(), // 可选的最大日期
        currentDate: new Date(this.value), // 双向绑定了日期选择器：设置日期选择器的默认值，同步日期选择器选择的日期
        }
    },
    methods:{
        async onConfirm (){
            this.$toast.loading({
                message:'保存中...',
                forbidClick:true, //禁止背景点击
                duration:0, //持续展示
            })
            try{
                const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
                await updateUserProfile({
                    birthday:currentDate
                })
                // 请求成功后，更新视图
                this.$emit('input',currentDate)
                // 关闭弹窗
                this.$emit('close')
                // 提示成功
                this.$toast.success('更新成功')
            }catch(err){
                this.$toast.fail('更新失败')
            }
        },
    },
}
</script>

<style>

</style>