// 评论请求模块
import request from "@/utils/request";

// 获取文章评论列表
export const getComments = params => {
    return request({
        method: 'GET',
        url: '/v1_0/comments',
        // GET 参数使用params进行传递
        // 我们写得时候是对象，但是最终发给后端的数据是？
        // axios 会把 params 对象转为 key=value？key=value的格式放到url上
        params
    })
}

// 评论点赞
export const addCommentLike = target => {
    return request({
        method: 'POST',
        url: "/v1_0/comment/likings",
        data: {
            target
        }
    })
}

// 评论点赞
export const deleteCommentLike = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/comment/likings/${target}`,
    })
}

//对文章或者评论进行评论
export const addComment = data => {
    return request({
        method: 'POST',
        url: '/v1_0/comments',
        data
    })
}