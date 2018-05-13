# vue-hotzone

> A Vue.js project
> 热区组件 开发中

- [x] 目前只加了四个角的handle_anchor, 还要增加边上的四个
- [x] 左右翻转，上下翻转的情况还未处理
- [x] 事件回调钩子还未增加
- [ ] 参照https://github.com/pespantelis/vue-crop 优化我的指令
- [x] 支持添加多个热区

## 示例图
![](https://haitao.nos.netease.com/0b570426-8d52-4380-94ff-26866f99b735.gif)

## Usage
```
<hotzone-drag
            :container-width="960"
            :container-height="480"
            :is-multi="true"
            imgUrl="//haitao.nosdn2.127.net/4PyHd5XCMRC5e0fWWFfLvA6a513T1805121745_960_480.jpg"
            @selectup="getZone"
            @addzone="addZone"
></hotzone-drag>
```

## Attributes
组件属性:
* container-width 容器宽度
* container-height 容器高度
* is-multi 是否要画多热区间

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
