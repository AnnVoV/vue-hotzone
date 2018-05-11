import Coord from './coord.js'
import _ from './util.js'

var handler = {}
var bindEvent = (el, ctx) => {
    var containerPos = {}
    var moveTargetPos = {}
    var getIsDrag = () => {
        return false
    }
    var getIsMove = () => {
        return false
    }
    handler = {
        mousedown (e) {
            var target = e.target
            getIsDrag = _.dragAnchor(target)
            getIsMove = _.moveZone(target)
            Coord.getDragCorner(target)
            containerPos = Coord.getPos(el)
            moveTargetPos = Coord.getPos(el.children[0])
            moveTargetPos.initialX = moveTargetPos.x - containerPos.x
            moveTargetPos.initialY = moveTargetPos.y - containerPos.y
        },
        mousemove (e) {
            var nowPos = {}, pos = {}
            var elStyle = el.children[0].style
            var mouseX = e.clientX - containerPos.x, mouseY = e.clientY - containerPos.y
            var point = Coord.getDragCoord(moveTargetPos, mouseX, mouseY, containerPos)
            var oldX = (point && point.x) || 0, oldY = (point && point.y) || 0
            if (getIsDrag()) {
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
            var elStyle = el.children[0].style
            var posArr = []
            var res = {}

            getIsMove(false)
            getIsDrag(false)
            posArr = elStyle.transform.match(/(\d)+/g)
            res = {
                width: `${_.numberArrInString(elStyle.width)[0]}px`,
                height: `${_.numberArrInString(elStyle.height)[0]}px`,
                x: `${posArr[0]}px`,
                y: `${posArr[1]}px`
            }
            ctx.$emit('mouseup', res)
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
        bindEvent(el, vnode.context)
    },
    unbind (el) {
        offEvent(el)
    }
}
