export default {
    moveZone (target) {
        var isMove = target.matches('.hotzone-area')
        return (setValue) => {
            if (typeof setValue !== 'undefined') isMove = setValue
            return isMove
        }
    },
    dragAnchor (target) {
        var isDragAnchor = target.classList.contains('hotzone-area-anchor')
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
    }
}
