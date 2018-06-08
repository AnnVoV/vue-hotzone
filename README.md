# vue-hotzone

> A Vue.js project
> 热区组件 开发中

- [x] 目前只加了四个角的handle_anchor, 还要增加边上的四个
- [x] 左右翻转，上下翻转的情况还未处理
- [x] 事件回调钩子还未增加
- [ ] 参照https://github.com/pespantelis/vue-crop 优化我的指令
- [x] 支持添加多个热区
- [x] 支持热区链接添加
- [x] 支持热区链接编辑
- [x] 支持热区删除

## 示例图
![](https://haitao.nos.netease.com/37319ba8-75d3-46c8-8533-95114c6a1cf6.gif)

## Usage
```
<hotzone imgUrl="//haitao.nos.netease.com/8587a660-7f81-4ab7-a25c-3372f0230440.png"
         :ratio="0.8"
         :isMulti="true"
         :ifNeedDialog="true"
         @selectup="selectUp"
></hotzone>
```

## Attributes
组件属性:
* imgUrl 热区图片url
* ratio 真实图片与需要的热区的缩放比例（默认为1）
* isMulti 是否支持多个热区（默认false）
* ifNeedDialog 是否在画完热区时要弹出弹框编辑链接（默认为true）
* initialLeft: 初始热区组件相对容器的left，默认为100px
* initialTop: 初始热区组件相对容器的Top，默认为100px
* isMulti: 是否支持画多个热区 默认true
* isHideFlag: 是否要隐藏序号标签，默认false不隐藏
* isShowDialog: 默认false不显示弹窗

组件钩子
* addzone 画多个热区时，添加一个新的热区时触发
* selectstart 画单个热区时，拖拽开始时触发
* selectup 画热区完成时触发， 参数：当前热区数组信息



## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
