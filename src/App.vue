<template>
    <div id="app">
        <hotzone-drag
            :container-width="960"
            :container-height="480"
            :is-multi="true"
            imgUrl="//haitao.nosdn2.127.net/4PyHd5XCMRC5e0fWWFfLvA6a513T1805121745_960_480.jpg"
            @selectup="getZone"
            @addzone="addZone"
        ></hotzone-drag>
    </div>
</template>

<script>
import HotzoneDrag from './components/hotzone/index'

export default {
    name: 'App',
    components: {
        HotzoneDrag
    },
    methods: {
        getZone(data) {
            console.log('获取最终热区信息：', data);
        },
        addZone(data) {
            console.log('添加了新热区：', data);
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
