import Coord from './coord.js'
import _ from './util.js'

/**
 * 绑定的handler
 * @type {{}}
 */
var handler = {}
/**
 * 当前指向的是哪一个hotzone, 默认为0
 * @type {number}
 */
var currIndex = 0
/**
 * 全部的热区个数
 * @type {number}
 */
var allHotzone = 0

var bindEvent = (el) => {
    var containerPos = {}
    var moveTargetPos = {}
    var getIsAddZone = (function () {
        var isAdd = false
        return (val) => {
            if (typeof val !== 'undefined') isAdd = val
            return isAdd
        }
    })()
    var getIsDrag = () => {
        return false
    }
    var getIsMove = () => {
        return false
    }

    handler = {
        mousedown (e) {
            var dragPos = {}, event, detail
            var target = e.target
            containerPos = Coord.getPos(el)
            /**
             * 添加新的热区或者移动已有热区
             */
            if (_.checkIsAddHotzone(target, 'hotzone-area|hotzone-area-anchor')) {
                moveTargetPos.initialX = e.clientX - containerPos.x
                moveTargetPos.initialY = e.clientY - containerPos.y
                getIsAddZone(true)
                Coord.setDragCorner()
                /**
                 *注意：custom event 只能用detail
                 *ctx.$emit('selectstart', {event: e, outVal: 1}) 这样写参数带不过去，不知道为啥
                 *参考：https://github.com/vuejs/vue/issues/7147
                 */
                dragPos = {
                    detail: {
                        initialLeft: moveTargetPos.initialX,
                        initialTop: moveTargetPos.initialY,
                        anchorWidth: 20,
                        anchorHeight: 20
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
                    initialX: detail.initialLeft,
                    initialY: detail.initialTop,
                    width: detail.anchorWidth,
                    height: detail.anchorHeight,
                    x: detail.initialLeft + containerPos.x,
                    y: detail.initialTop + containerPos.y
                }
            } else {
                currIndex = Number(_.closest(target, 'hotzone-area').dataset.index) || 0;
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
            if (typeof el.children === 'undefined' || el.children.length === 0) return
            var index = (getIsAddZone()) ? allHotzone - 1 : currIndex
            var nowPos = {}, pos = {}
            var elStyle = el.children[index].style
            var mouseX = e.clientX - containerPos.x, mouseY = e.clientY - containerPos.y
            var point = Coord.getDragCoord(moveTargetPos, mouseX, mouseY, containerPos)
            var oldX = (point && point.x) || 0, oldY = (point && point.y) || 0
            if (getIsDrag() || getIsAddZone()) {
                nowPos = Coord.calculateByPoint(point)
                point.x = _.restrictXInCon(point.x, nowPos.width, containerPos, 'width')
                point.y = _.restrictXInCon(point.y, nowPos.height, containerPos, 'height');
                (point.x !== oldX || point.y !== oldY) && (nowPos = Coord.calculateByPoint(point))
                elStyle.width = `${nowPos.width}px`
                elStyle.height = `${nowPos.height}px`
                if (point.isChange) elStyle.webkitTransform = elStyle.transform = `translate(${point.x}px, ${point.y}px)`
            } else if (getIsMove()) {
                pos = _.restrictMove(mouseX, mouseY, moveTargetPos.width, moveTargetPos.height, containerPos)
                elStyle.webkitTransform = elStyle.transform = `translate(${pos.x}px, ${pos.y}px)`
            }
        },
        mouseup () {
            if (typeof el.children === 'undefined' || el.children.length === 0) return
            var index = (getIsAddZone()) ? allHotzone - 1 : currIndex
            var elStyle = el.children[index].style
            var posArr = []
            var res = {}
            getIsAddZone(false)
            getIsMove(false)
            getIsDrag(false)
            posArr = elStyle.transform.match(/(\d)+/g)
            res = {
                width: `${_.numberArrInString(elStyle.width)[0]}`,
                height: `${_.numberArrInString(elStyle.height)[0]}`,
                x: `${posArr[0]}`,
                y: `${posArr[1]}`,
                index: index
            }
            var event = new CustomEvent('selectup', {detail: res})
            el.dispatchEvent(event)
        }
    }

    el.addEventListener('mousedown', handler.mousedown)
    el.addEventListener('mousemove', handler.mousemove)
    document.body.addEventListener('mouseup', handler.mouseup)
}

var offEvent = (el) => {
    el.removeEventListener('mousedown', handler.mousedown)
    el.removeEventListener('mousemove', handler.mousemove)
    document.body.removeEventListener('mouseup', handler.mouseup)
}

export default {
    bind (el, binding, vnode) {
        bindEvent(el, vnode.context, vnode)
    },
    unbind (el) {
        offEvent(el)
    }
}
