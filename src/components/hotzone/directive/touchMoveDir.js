import Coord from './coord.js'
import _ from './util.js'

var handler = {}
var bindEvent = (el) => {
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
            var nowPos = {}
            var pos = {}
            var elStyle = el.children[0].style
            var mouseX = e.clientX - containerPos.x
            var mouseY = e.clientY - containerPos.y
            var point = Coord.getDragCoord(moveTargetPos, mouseX, mouseY, containerPos)
            if (getIsDrag()) {
                nowPos = Coord.calculateByPoint(point)
                elStyle.width = `${nowPos.width}px`
                elStyle.height = `${nowPos.height}px`
                if (point.isChange) elStyle.webkitTransform = elStyle.transform = `translate(${point.x}px, ${point.y}px)`
            } else if (getIsMove()) {
                pos = _.restrictMove(mouseX, mouseY, moveTargetPos.width, moveTargetPos.height, containerPos)
                elStyle.webkitTransform = elStyle.transform = `translate(${pos.x}px, ${pos.y}px)`
            }
        },
        mouseup () {
            debugger;
            getIsMove(false)
            getIsDrag(false)
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
        // el 是整个热区容器
        bindEvent(el)
    },
    unbind (el) {
        offEvent(el)
    }
}
