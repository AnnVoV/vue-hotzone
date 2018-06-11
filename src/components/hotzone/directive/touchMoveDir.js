/**
 * @file touchMoveDir.js ~ 2018/06/08 17:13:52
 * @author AnnVoV
 **/
import Coord from './coord.js'
import _ from './util.js'

let handler = {}
let currIndex = 0
let allHotzone = 0
let mouseStartTime

let bindEvent = (el, ctx) => {
    /* eslint-disable */
    const MOVE = 1, DRAG = 2, ADD = 3, UP = 4
    let containerPos = {}, moveTargetPos = {}, status// status 分为3种状态一个是移动，一个是拖拽, 一个是增加热区
    /* eslint-enable */
    let getIsAddZone = (function () {
        let isAdd = false
        return (val) => {
            if (typeof val !== 'undefined') isAdd = val
            return isAdd
        }
    })()
    let getIsDrag = () => {
        return false
    }
    let getIsMove = () => {
        return false
    }
    handler = {
        mousedown: function (e) {
            /* eslint-disable */
            let dragPos = {}, event, detail
            /* eslint-enable */
            let target = e.target
            containerPos = Coord.getPos(el)
            mouseStartTime = new Date().getTime()
            /**
             * 添加新的热区或者移动已有热区
             */
            if (_.checkIsAddHotzone(target)) {
                moveTargetPos.initialX = e.clientX - containerPos.x
                moveTargetPos.initialY = e.clientY - containerPos.y
                getIsAddZone(true)
                status = ADD
                Coord.setDragCorner()
                /**
                 *注意：custom event 只能用detail
                 *ctx.$emit('selectstart', {event: e, outVal: 1}) 这样写参数带不过去，不知道为啥
                 *参考：https://github.com/vuejs/vue/issues/7147
                 */
                dragPos = {
                    detail: {
                        x: moveTargetPos.initialX,
                        y: moveTargetPos.initialY,
                        width: 20,
                        height: 20
                    }
                }
                /**
                 * emit selectstart 事件用于添加新热区
                 * @type {CustomEvent<any>}
                 */
                allHotzone++
                event = new CustomEvent('addhotzone', dragPos)
                target.dispatchEvent(event)
                detail = dragPos.detail
                moveTargetPos = {
                    initialX: detail.x,
                    initialY: detail.y,
                    width: detail.width,
                    height: detail.height,
                    x: detail.x + containerPos.x,
                    y: detail.y + containerPos.y
                }
            } else {
                status = MOVE
                currIndex = Number(_.closest(target, 'hotzone-area').dataset.index) || 0
                getIsDrag = _.dragAnchor(target)
                getIsMove = _.moveZone(target)
                Coord.getDragCorner(target)
                moveTargetPos = Coord.getPos(el.children[currIndex])
                moveTargetPos.initialX = moveTargetPos.x - containerPos.x
                moveTargetPos.initialY = moveTargetPos.y - containerPos.y
                event = new CustomEvent('selectstart', {detail: moveTargetPos})
                target.dispatchEvent(event)
            }
        },
        mousemove (e) {
            e.stopPropagation()
            /* eslint-disable */
            if (status === UP || typeof el.children === 'undefined' || el.children.length === 0) return
            let index = (getIsAddZone()) ? allHotzone - 1 : currIndex
            let nowPos = {}, pos = {}
            let elStyle = el.children[index] && el.children[index].style
            let mouseX = e.clientX - containerPos.x, mouseY = e.clientY - containerPos.y
            let point = Coord.getDragCoord(moveTargetPos, mouseX, mouseY, containerPos)
            let oldX = (point && point.x) || 0, oldY = (point && point.y) || 0
            /* eslint-enable */

            if (typeof elStyle === 'undefined' || status === UP) return
            if (getIsDrag() || getIsAddZone()) {
                status = (getIsDrag()) ? DRAG : ADD
                nowPos = Coord.calculateByPoint(point)
                point.x = _.restrictXInCon(point.x, nowPos.width, containerPos, 'width')
                point.y = _.restrictXInCon(point.y, nowPos.height, containerPos, 'height');
                (point.x !== oldX || point.y !== oldY) && (nowPos = Coord.calculateByPoint(point))
                elStyle.width = `${nowPos.width}px`
                elStyle.height = `${nowPos.height}px`
                if (point.isChange) elStyle.webkitTransform = elStyle.transform = `translate(${point.x}px, ${point.y}px)`
            } else if (getIsMove()) {
                status = MOVE
                pos = _.restrictMove(mouseX, mouseY, moveTargetPos.width, moveTargetPos.height, containerPos)
                elStyle.webkitTransform = elStyle.transform = `translate(${pos.x}px, ${pos.y}px)`
            }
        },
        mouseup (e) {
            const DELTA = new Date().getTime() - mouseStartTime
            const TAP = (status === ADD) && (DELTA < 300);

            // todo 如果是弹窗或者编辑按钮的mouseup 直接return，如何优化
            if (status === UP || TAP) return
            let index = (getIsAddZone()) ? allHotzone - 1 : currIndex
            let elStyle = (el.children && el.children[index] && el.children[index].style) || {}
            /* eslint-disable */
            let posArr = [], res = {}, width, height
            /* eslint-enable */

            if (Object.keys(elStyle).length === 0) return
            width = (_.numberArrInString(elStyle.width)[0])
            height = (_.numberArrInString(elStyle.height)[0])
            getIsAddZone(false)
            getIsMove(false)
            getIsDrag(false)

            posArr = elStyle.transform.match(/\d+\.?(\d)*/g)
            res = {
                width,
                height,
                x: `${posArr[0]}`,
                y: `${posArr[1]}`,
                index: index
            }
            let event = new CustomEvent('selectup', {detail: res})
            el.dispatchEvent(event)
            status = UP
        },
        bodyMouseMove () {
            if (status === ADD) {
                handler.mouseup({target: document.body})
            }
        }
    }

    el.addEventListener('mousedown', handler.mousedown)
    el.addEventListener('mousemove', handler.mousemove)
    // 为了能监听到hotzone 区域外的up, 所以我们需要监听整个document
    document.body.addEventListener('mouseup', handler.mouseup)
    document.body.addEventListener('mousemove', handler.bodyMouseMove)
}

let offEvent = (el) => {
    el.removeEventListener('mousedown', handler.mousedown)
    el.removeEventListener('mousemove', handler.mousemove)
    document.body.removeEventListener('mouseup', handler.mouseup)
    document.body.removeEventListener('mousemove', handler.bodyMouseMove)
}

export default {
    bind (el, binding, vnode) {
        bindEvent(el, vnode.context, vnode)
    },
    update (el, binding, vnode) {
        allHotzone = (binding.value && binding.value.length) || 0
    },
    unbind (el) {
        offEvent(el)
    }
}
