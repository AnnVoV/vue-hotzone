<template>
    <section class="hotzone" :style="{backgroundImage: `url( ${imgUrl})`, width: `${containerWidth}px`, height: `${containerHeight}px`}" v-touchdir
             @addhotzone="addZone"
             @selectstart="selectStart"
             @selectup="changeZone"
    >
        <div class="hotzone-area"
             v-if="!isMulti"
             :style="{width: `${anchorWidth}px`, height: `${anchorHeight}px`, transform: `translate(${initialLeft}px, ${initialTop}px)`}">
            <div v-for="item in anchorKlassList" :class="['hotzone-area-anchor', item.klass]"
                 :data-drag="item.drag" :style="{cursor: `${item.drag}-resize`}"
            ></div>
        </div>
        <div class="hotzone-area"
             v-else
             :style="{width: `${hotzone.anchorWidth}px`, height: `${hotzone.anchorHeight}px`, transform: `translate(${hotzone.initialLeft}px, ${hotzone.initialTop}px)`}"
             :index="index"
             :data-index="index"
             v-for="(hotzone, index) in hotzoneList"
        >
            <span v-if="!isHideFlag" class="hotzone-area-flag">{{index}}</span>
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
            anchorWidth: 40,
            anchorHeight: 40,
            anchorNormalKlass: 'hotzone-area-anchor',
            hotzoneList: [
            ],
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
        },
        containerWidth: {
            type: Number,
            default: 500
        },
        containerHeight: {
            type: Number,
            default: 400
        },
        isMulti: {
            type: Boolean,
            default: false
        },
        isHideFlag: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        addZone(e) {
            var data = e.detail || null;
            if(!data) return;
            this.hotzoneList.push(data)
            this.$emit('addzone', data);
        },
        changeZone(e) {
            var hotzoneList = this.hotzoneList;
            var index = e.detail.index;
            hotzoneList[index] = e.detail;
            this.$emit('selectup', hotzoneList);
        },
        selectStart(e) {
            this.$emit('selectstart', e.detail);
        }
    }
}
</script>

<style scoped>
    .hotzone {
        position: relative;
        border: 1px dashed #ddd;
    }

    .hotzone-img {
        width: 100%;
        height: 100%;
    }

    .hotzone-area {
        border: 1px dashed #333;
        position: absolute;
        background: rgba(0, 0, 0, .2);
        z-index: 100;
    }

    .hotzone-area-anchor {
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: #fff;
        border: 1px solid #000;
        opacity: .5;
    }
    .hotzone-area-flag {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 15px;
        height: 15px;
        line-height: 15px;
        background: #000;
        font-size: 10px;
        text-align: center;
        color: #fff;
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
