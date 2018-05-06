var restrictXInCon = (x, containerPos) => {
    return (x < 0) ? 0 : (x > containerPos.width) ? containerPos.width : x
}

var restrictYInCon = (y, containerPos) => {
    return (y < 0) ? 0 : (y > containerPos.height) ? containerPos.height : y
}

export default {
    dragDir: null,
    opDragDir: null,
    getPos (el) {
        var react = el.getBoundingClientRect()
        return {
            x: react.left,
            y: react.top,
            width: react.width,
            height: react.height
        }
    },
    getDragCorner (target) {
        this.dragDir = target.dataset.drag || 'move'
        switch (this.dragDir) {
            case 'se': {
                this.opDragDir = 'nw'
                break
            }
            case 'ne': {
                this.opDragDir = 'sw'
                break
            }
            case 'nw': {
                this.opDragDir = 'se'
                break
            }
            case 'sw': {
                this.opDragDir = 'ne'
                break
            }
            case 'move': {
                this.opDragDir = 'move'
            }
        }
    },
    calculateByPoint (point) {
        return {
            width: Math.abs(point.x2 - point.x),
            height: Math.abs(point.y2 - point.y)
        }
    },
    getDragCoord (moveTargetPos, mouseX, mouseY, containerPos) {
        switch (this.opDragDir) {
            case 'nw': {
                return {
                    x: restrictXInCon(moveTargetPos.initialX, containerPos),
                    y: restrictYInCon(moveTargetPos.initialY, containerPos),
                    x2: restrictXInCon(mouseX, containerPos),
                    y2: restrictYInCon(mouseY, containerPos),
                    isChange: false
                }
            }
            case 'ne': {
                return {
                    x: restrictXInCon(mouseX, containerPos),
                    y: restrictYInCon(moveTargetPos.initialY, containerPos),
                    x2: restrictXInCon(moveTargetPos.initialX + moveTargetPos.width, containerPos),
                    y2: restrictYInCon(mouseY, containerPos),
                    isChange: true
                }
            }
            case 'sw': {
                return {
                    x: restrictXInCon(moveTargetPos.initialX, containerPos),
                    y: restrictYInCon(mouseY, containerPos),
                    x2: restrictXInCon(mouseX, containerPos),
                    y2: restrictYInCon(moveTargetPos.initialY + moveTargetPos.height, containerPos),
                    isChange: true
                }
            }
            case 'se': {
                return {
                    x: restrictXInCon(mouseX, containerPos),
                    y: restrictYInCon(mouseY, containerPos),
                    x2: restrictXInCon(moveTargetPos.initialX + moveTargetPos.width, containerPos),
                    y2: restrictYInCon(moveTargetPos.initialY + moveTargetPos.height, containerPos),
                    isChange: true
                }
            }
        }
    }
}
