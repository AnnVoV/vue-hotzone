export default {
    moveZone (target) {
        let node = this.farthestParent(target, document.querySelector('.hotzone'))
        let isMove = node && node.classList.contains('hotzone-area') || false;
        return (setValue) => {
            if (typeof setValue !== 'undefined') isMove = setValue
            return isMove
        }
    },
    dragAnchor (target) {
        let isDragAnchor = target.classList.contains('hotzone-area-anchor')
        return (setValue) => {
            if (typeof setValue !== 'undefined') isDragAnchor = setValue
            return isDragAnchor
        }
    },
    restrictMove (endX, endY, width, height, startPos) {
        endX = endX - width / 2
        endY = endY - height / 2
        const X_MAX = startPos.width - width
        const Y_MAX = startPos.height - height
        return {
            x: (endX < 0) ? 0 : (endX > X_MAX) ? X_MAX : endX,
            y: (endY < 0) ? 0 : (endY > Y_MAX) ? Y_MAX : endY
        }
    },
    restrictXInCon (x, sth, containerPos, type) {
        return (x < 0) ? 0 : (x + sth > containerPos[type]) ? containerPos[type] - sth : x
    },
    numberArrInString (str) {
        let arr = str.match(/(\d)+/g)
        return arr
    },
    /**
     * target 是否在container 元素内
     * @param target
     * @param selector
     * @returns {boolean}
     */
    targetIsInContainer (target, container) {
        const isContainer = target === container
        const isSonNode = container.contains(target)
        return !isContainer && isSonNode
        // 我原来是这么判断的
        // let node = this.farthestParent(target, document.querySelector('.hotzone'))
        // return node === document
    },
    closest (target, selector) {
        while (target.classList && !target.classList.contains(selector)) {
            if (!target.classList) return document.body;
            target = target.parentNode
        }
        return target || document.body
    },
    farthestParent (target, parentNode) {
        parentNode = parentNode || document.body
        if (!target) return parentNode
        while (target.parentNode && target.parentNode !== parentNode) {
            target = target.parentNode
        }
        return target
    },
    isClickOutside (target, el) {
        // 这个非常有用
        if (el.contains(target)) return false
        return true
    }
}
