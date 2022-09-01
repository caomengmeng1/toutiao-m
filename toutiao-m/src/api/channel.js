// 频道请求模块

// 引入基础路径请求
import request from "@/utils/request";

// 获取所有频道列表
export const getAllChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/channels'
    })
}

// 添加用户频道
export const addUserChannels = channel => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/channels',
        data: {
            channels: [channel]
        }
    })
}

// 删除用户指定频道
export const deleteUserChannels = channelId => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/channels/${channelId}`,
    })
}