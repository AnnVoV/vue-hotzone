<template>
    <div id="app">
        <hotzone-drag imgUrl="//haitao.nos.netease.com/5ba23995-d600-4959-8dd3-2d6da4f84f53.png"></hotzone-drag>
    </div>
</template>

<script>
import HotzoneDrag from './components/hotzone/index'

export default {
    name: 'App',
    components: {
        HotzoneDrag
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
