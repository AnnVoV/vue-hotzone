<template>
    <section class="hotzone" :style="{backgroundImage: `url( ${imgUrl})`}" v-touchdir @mouseup="upTest">
        <div class="hotzone-area" :style="{width: `${anchorWidth}px`, height: `${anchorHeight}px`, transform: `translate(${initialLeft}px, ${initialTop}px)`}">
            <div v-for="item in anchorKlassList" :class="['hotzone-area-anchor', item.klass]"
                 :data-drag="item.drag" :style="{cursor: `${item.drag}-resize`}"
            ></div>
        </div>
    </section>
</template>

<script>
import touchdir from './directive/touchMoveDir.js';

export default {
    name: 'HotzoneArea',
    computed: {},
    directives: {
        touchdir
    },
    data () {
        return {
            anchorWidth: 50,
            anchorHeight: 50,
            anchorNormalKlass: 'hotzone-area-anchor',
            anchorKlassList: [
                {klass: 'hotzone-area-leftTop', drag: 'nw'},
                {klass: 'hotzone-area-top', drag: 'n'},
                {klass: 'hotzone-area-rightTop', drag: 'ne'},
                {klass: 'hotzone-area-right', drag: 'e'},
                {klass: 'hotzone-area-rightBottom', drag: 'se'},
                {klass: 'hotzone-area-bottom', drag: 's'},
                {klass: 'hotzone-area-leftBottom', drag: 'sw'},
                {klass: 'hotzone-area-left', drag: 'w'}
            ]
        }
    },
    props: {
        imgUrl: String,
        initialLeft: {
            type: Number,
            default: 100
        },
        initialTop: {
            type: Number,
            default: 100
        }
    },
    methods: {
        test () {
            console.log('test');
        },
        upTest(e) {
            console.log(e);
        }
    }
}
</script>

<style scoped>
    .hotzone {
        position: relative;
        width: 500px;
        height: 400px;
        border: 1px dashed #ddd;
        background-position: 50%;
    }

    .hotzone-img {
        width: 100%;
        height: 100%;
    }

    .hotzone-area {
        position: absolute;
        background: rgba(0, 0, 0, .6);
        z-index: 100;
    }

    .hotzone-area-anchor {
        position: absolute;
        width: 8px;
        height: 8px;
        background: rgb(255, 255, 255);
        border: 1px solid #000;
    }

    .hotzone-area-leftTop {
        left: -4px;
        top: -4px;
    }

    .hotzone-area-leftBottom {
        left: -4px;
        bottom: -4px;
    }

    .hotzone-area-left {
        left: -4px;
        top: 50%;
        transform: translate(0, -4px);
    }

    .hotzone-area-right {
        right: -4px;
        top: 50%;
        transform: translate(0, -4px);
    }

    .hotzone-area-bottom {
        bottom: -4px;
        left: 50%;
        transform: translate(-4px, 0);
    }

    .hotzone-area-top {
        top: -4px;
        left: 50%;
        transform: translate(-4px, 0);
    }

    .hotzone-area-rightTop {
        right: -4px;
        top: -4px;
    }

    .hotzone-area-rightBottom {
        right: -4px;
        bottom: -4px;
    }
</style>
