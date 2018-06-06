<template>
    <div class="hotzone-container">
        <section class="hotzone"
                 :style="{backgroundImage: `url( ${imgUrl})`, width: `${containerWidth}px`, height: `${containerHeight}px`, backgroundSize: 'cover'}"
                 v-touchdir="hotzoneList"
                 @addhotzone="addZone"
                 @selectstart="selectStart"
                 @selectup="changeZone"
        >
            <div class="hotzone-area"
                 v-if="!isMulti"
                 :style="{width: `${width}px`, height: `${height}px`, transform: `translate(${initialLeft}px, ${initialTop}px)`}">
                <div v-for="item in anchorKlassList" :class="['hotzone-area-anchor', item.klass]"
                     :data-drag="item.drag" :style="{cursor: `${item.drag}-resize`}"
                ></div>
            </div>
            <div class="hotzone-area"
                 v-else
                 :style="{width: `${hotzone.width}px`, height: `${hotzone.height}px`, transform: `translate(${hotzone.initialLeft}px, ${hotzone.initialTop}px)`}"
                 :index="index"
                 :data-index="index"
                 v-for="(hotzone, index) in hotzoneList"
            >
                <span v-if="!isHideFlag" class="hotzone-area-flag">{{index}}</span>
                <span class="hotzone-area-link" v-if="hotzone.link">{{hotzone.link}}</span>
                <div v-for="item in anchorKlassList" :class="['hotzone-area-anchor', item.klass]"
                     :data-drag="item.drag" :style="{cursor: `${item.drag}-resize`}"
                ></div>
                <div class="hotzone-area-button">
                    <div class="hotzone-area-btntxt" v-if="hotzone.link" @click="editLink(index)">编辑</div>
                    <div class="hotzone-area-btntxt" @click="deleteZone(index)">删除</div>
                </div>
            </div>
        </section>
        <el-dialog :visible.sync="isShowDialog"
                   :before-close="beforeClose"
                   title="热区链接设置">
            <el-form :rules="rules" :model="form" :visible.sync="isShowDialog" ref="form">
                <el-form-item label="热区链接" prop="link">
                    <el-row :gutter="10">
                        <el-col :span="15">
                            <el-input v-model="form.link" placeholder="请填写热区链接"></el-input>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="primary" @click="confirmLink" class="u-dialog-btn">确定</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
/**
     * 使用例子：
     * 必填属性：
     * imgUrl: 图片url
     * ratio: 图片相对于 容器的缩放比例，默认为1
     * ifNeedDialog: 是否在画完热区时需要弹出弹窗， 默认为false
     * 选填属性：
     * initialLeft: 初始热区组件相对容器的left，默认为100px
     * initialTop: 初始热区组件相对容器的Top，默认为100px
     * isMulti: 是否支持画多个热区 默认false
     * isHideFlag: 是否要隐藏序号标签，默认false不隐藏
     * isShowDialog: 默认false不显示弹窗
     * 例子：
     * <hotzone imgUrl="//haitao.nos.netea，默认为100pxse.com/8587a660-7f81-4ab7-a25c-3372f0230440.png":ratio="0.5"></hotzone>
     * 只要传入imgUrl和 ratio(容器与真实图片的比例)
     * 钩子：
     * selectup
     * todo: 双击操作处理
     */
import touchdir from './directive/touchMoveDir.js'
const STATUS = {
    NORMAL: 0,
    ADD: 1,
    EDIT: 2,
    DELETE: 3
}

export default {
    name: 'HotzoneArea',
    directives: {
        touchdir
    },
    data () {
        return {
            status: STATUS.NORMAL,
            rules: {
                link: {required: true, message: '热区链接不能为空', trigger: 'blur'}
            },
            currIndex: 0,
            isShowDialog: false,
            form: {},
            imgWidth: 0,
            imgHeight: 0,
            containerWidth: 0,
            containerHeight: 0,
            width: 40,
            height: 40,
            anchorNormalKlass: 'hotzone-area-anchor',
            hotzoneList: [],
            resultList: [],
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
        ifNeedDialog: {
            type: Boolean,
            default: false
        },
        initialLeft: {
            type: Number,
            default: 100
        },
        initialTop: {
            type: Number,
            default: 100
        },
        isMulti: {
            type: Boolean,
            default: false
        },
        isHideFlag: {
            type: Boolean,
            default: false
        },
        ratio: {
            type: Number,
            default: 1
        },
        showDialog: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        hotzoneList: function () {
            let length = this.hotzoneList.length
            this.currIndex = (length > 0) ? (length - 1) : length
        }
    },
    mounted () {
        this.getImgWidthAndHeight(this.setContainerWidthAndHeight)
    },
    methods: {
        getImgWidthAndHeight (cb) {
            let img = new Image()
            let url = this.imgUrl
            img.src = url
            img.onload = () => {
                this.imgWidth = img.width
                this.imgHeight = img.height
                cb()
            }
        },
        setContainerWidthAndHeight () {
            this.containerWidth = this.imgWidth * this.ratio
            this.containerHeight = this.imgHeight * this.ratio
        },
        addZone (e) {
            let data = e.detail || null
            if (!data) return
            this.hotzoneList.push(data)
            this.$emit('addzone', data)
        },
        changeZone (e) {
            debugger
            let hotzoneList = this.hotzoneList
            let index = e.detail.index
            let oldData = hotzoneList[index] || {}

            hotzoneList[index] = Object.assign({}, oldData, e.detail)
            this.toShowDialog(index)
            this.formatData(hotzoneList[index], index)
            this.$emit('selectup', this.resultList)
        },
        selectStart (e) {
            this.$emit('selectstart', e.detail)
        },
        formatData (data, index) {
            let orgData = this.resultList[index] || {}
            let cloneData = Object.assign({}, orgData, data)
            for (let key in data) {
                if (['index', 'link'].indexOf(key) === -1) {
                    cloneData[key] = data[key] / this.ratio
                }
            }
            this.resultList[index] = cloneData
        },
        toShowDialog (index) {
            var data = this.resultList[index] || {}
            if (!data.link) {
                this.isShowDialog = true
            }
        },
        confirmLink (e) {
            e.stopPropagation()
            this.validateDiaForm()
        },
        validateDiaForm () {
            // 验证弹窗上的表格
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.isShowDialog = false
                    this.setLinkData()
                }
            })
        },
        setLinkData () {
            // 弹窗内设置热区链接
            let currIndex = this.currIndex
            this.hotzoneList[currIndex].link = this.form.link
            this.resultList[currIndex].link = this.form.link
            this.form.link = ''
        },
        beforeClose () {
            // 关闭弹窗前钩子
            this.validateDiaForm()
        },
        editLink (index) {
            // 编辑热区链接
            let orgLink = this.hotzoneList[index].link
            this.form.link = orgLink
            this.isShowDialog = true
            this.currIndex = index
        },
        deleteZone (index) {
            // 删除热区
            console.log('old:')
            let temp = Object.assign({}, this.hotzoneList)
            console.log(temp)
            this.hotzoneList.splice(index, 1)
            console.log('new')
            console.log(this.hotzoneList)
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

    .hotzone-area-link {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        user-select: none;
        -webkit-user-select: none;
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

    .hotzone-area-button {
        position: absolute;
        bottom: 0;
        width: 80px;
        height: 35px;
        left: 50%;
        transform: translate(-50%, 0);
        text-align: center;
    }

    .hotzone-area-btntxt {
        display: inline-block;
        padding: 2px 5px;
        line-height: 20px;
        background: #e41436;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
        cursor:pointer;
    }
    .hotzone-area-btntxt:last-child {
         background: #67739b;
     }

    .u-dialog-btn {
        text-align: center;
    }
</style>
