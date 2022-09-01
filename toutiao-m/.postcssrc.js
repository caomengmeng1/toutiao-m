// PostCss配置文件

module.exports = {
    // 配置要使用的PostCss插件

    plugins: {
        // 配置使用autoprefixer 插件
        // 作用：生成浏览器CSS样式规则前缀
        // VueCLI 内部已经配置了 autoprefixer 插件
        // 这里又配置了一次，产生冲突，启动服务器会显示红色代码警告

        // 'autoprefixer': {
        //     //  配置要兼容的环境信息
        //     browsers: ['Android >= 4.0', 'iOS >= 8']
        // },

        // 配置要使用的postcss-pxtorem插件
        // 作用：把px转为rem
        'postcss-pxtorem': {
            // lib-flexible的rem适配方案 把一行分为10份，每份就是十分之一
            // 所以rootValue 应该设置为你的设计稿宽度的十分之一
            // 大多数设计稿的原型都是以 iphone6 为原型，iphone6 设备的宽是 750，我们的设计稿也是这样，所以应给设置为750/10=75
            // 但是Vant 是基于 375 写的，所以如果你设置为 75 的话，Vant 的样式就小了一半。
            // 所以如果设置为 `37.5` 的话，Vant 的样式是没有问题的，唯一的缺点就是我们在测量设计稿的时候都必须除2才能使用，否则就会变得很大。

            // 有没有更好的办法呢？
            // 如果是 Vant 的样式，就把 `rootValue` 设置为 37.5 来转换
            // 如果是我们的样式，就按照 75 的 `rootValue` 来转换
            // 通过[查阅文档](https://github.com/cuth/postcss-pxtorem#options)我们可以看到 `rootValue` 支持两种参数类型：
            // 数字：固定值
            // 函数：动态计算返回
            // postcss-pxtorem 处理每个 CSS 文件的时候都会来调用这个函数
            // 它会把被处理的 CSS 文件相关的信息通过参数传递给该函数
            // rootValue: 37.5,
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },
            // 配置要转换的css属性
            // *表示所有，或者写成height
            propList: ['*'],

            // 配置不要转换的样式资源
            exclude: 'github-markdown'
        },
    },
};