<template>
    <div id="app">
        <hotzone-drag
            imgUrl="//haitao.nos.netease.com/8587a660-7f81-4ab7-a25c-3372f0230440.png"
           :ratio="0.8"
           :isMulti="true"
           :ifNeedDialog="true"
            @selectup="getZone"
            @addzone="addZone"
            @selectstart="addZoneStart"
        ></hotzone-drag>
    </div>
</template>

<script>
import HotzoneDrag from './components/hotzone/index'
import 'element-ui/lib/theme-chalk/index.css'

export default {
    name: 'App',
    components: {
        HotzoneDrag
    },
    data () {
        return {
            hotzoneList: []
        }
    },
    methods: {
        getZone (data) {
            console.log('获取最终热区信息', data)
        },
        addZone (data) {
            console.log('添加了新热区', data)
        },
        addZoneStart () {
            console.log('初始化添加热区')
        }
    }
}
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
