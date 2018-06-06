import Coord from './coord.js'
import _ from './util.js'

/**
 * 绑定的handler
 * @type {{}}
 */
let handler = {}
/**
 * 当前指向的是哪一个hotzone, 默认为0
 * @type {number}
 */
let currIndex = 0
/**
 * 全部的热区个数
 * @type {number}
 */
let allHotzone = 0

let bindEvent = (el, ctx) => {
    const MOVE = 1, DRAG = 2, ADD = 3;
    let mouseStartTime;
    let containerPos = {}, moveTargetPos = {}, status;// status 分为3种状态一个是移动，一个是拖拽, 一个是增加热区
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
        mousedown (e) {
            let dragPos = {}, event, detail
            let target = e.target
            containerPos = Coord.getPos(el)
            /**
             * 添加新的热区或者移动已有热区
             */
            if (_.checkIsAddHotzone(target, 'hotzone-area|hotzone-area-anchor|hotzone-area-flag|hotzone-area-link|hotzone-area-button|hotzone-area-btntxt')) {
                mouseStartTime = +new Date(); // 手开始点击的时间
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
                    initialX: detail.initialLeft,
                    initialY: detail.initialTop,
                    width: detail.width,
                    height: detail.height,
                    x: detail.initialLeft + containerPos.x,
                    y: detail.initialTop + containerPos.y
                }
            } else {
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
            if (typeof el.children === 'undefined' || el.children.length === 0) return
            let index = (getIsAddZone()) ? allHotzone - 1 : currIndex
            let nowPos = {}, pos = {}
            let elStyle = el.children[index] && el.children[index].style
            let mouseX = e.clientX - containerPos.x, mouseY = e.clientY - containerPos.y
            let point = Coord.getDragCoord(moveTargetPos, mouseX, mouseY, containerPos)
            let oldX = (point && point.x) || 0, oldY = (point && point.y) || 0

            if(typeof elStyle === 'undefined') return;
            if (getIsDrag() || getIsAddZone()) {
                status = (getIsDrag()) ? DRAG : ADD;
                nowPos = Coord.calculateByPoint(point)
                point.x = _.restrictXInCon(point.x, nowPos.width, containerPos, 'width')
                point.y = _.restrictXInCon(point.y, nowPos.height, containerPos, 'height');
                (point.x !== oldX || point.y !== oldY) && (nowPos = Coord.calculateByPoint(point))
                elStyle.width = `${nowPos.width}px`
                elStyle.height = `${nowPos.height}px`
                if (point.isChange) elStyle.webkitTransform = elStyle.transform = `translate(${point.x}px, ${point.y}px)`
            } else if (getIsMove()) {
                status = MOVE;
                pos = _.restrictMove(mouseX, mouseY, moveTargetPos.width, moveTargetPos.height, containerPos)
                elStyle.webkitTransform = elStyle.transform = `translate(${pos.x}px, ${pos.y}px)`
            }
        },
        mouseup (e) {
            let container = el.parentNode;
            let target = e.target;
            let node = _.farthestParent(e.target, container);
            // todo 如果是弹窗或者编辑按钮的mouseup 直接return，如何优化
            if(e.target.matches('.hotzone-area-btntxt') || !node.matches('.hotzone') && node !== document.body) return
            if (typeof el.children === 'undefined' || el.children.length === 0) return
            let index = (getIsAddZone()) ? allHotzone - 1 : currIndex
            let elStyle = el.children[index] && el.children[index].style
            let posArr = [], res = {}, width, height
            // 手松开的时间
            let deltaTime = +new Date() - mouseStartTime;
            // todo 如果elStyle 未定义或者手指开始与结束之间区间<800 则忽略
            if(typeof elStyle === 'undefined') return;
            width = (_.numberArrInString(elStyle.width)[0]);
            height = (_.numberArrInString(elStyle.height)[0]);
            getIsAddZone(false)
            getIsMove(false)
            getIsDrag(false)
            posArr = elStyle.transform.match(/(\d)+.?(\d)+/g)
            res = {
                width,
                height,
                x: `${posArr[0]}`,
                y: `${posArr[1]}`,
                index: index
            }
            /**
             * 只有drag 的mouseup 才会emit
             */
            if(status !== MOVE) {
                let event = new CustomEvent('selectup', {detail: res})
                el.dispatchEvent(event)
            }
            status = '';
        }
    }

    el.addEventListener('mousedown', handler.mousedown)
    el.addEventListener('mousemove', handler.mousemove)
    document.body.addEventListener('mouseup', handler.mouseup)
}

let offEvent = (el) => {
    el.removeEventListener('mousedown', handler.mousedown)
    el.removeEventListener('mousemove', handler.mousemove)
    document.body.removeEventListener('mouseup', handler.mouseup)
}

export default {
    bind (el, binding, vnode) {
        bindEvent(el, vnode.context, vnode)
    },
    update(el, binding, vnode) {
        allHotzone = binding.value && binding.value.length || 0;
    },
    unbind (el) {
        offEvent(el)
    }
}
