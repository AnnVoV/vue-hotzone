var restrictXInCon = (containerPos) => {
    return (x) => {
        return (x < 0) ? 0 : (x > containerPos.width) ? containerPos.width : x
    }
}

var restrictYInCon = (containerPos) => {
    return (y) => {
        return (y < 0) ? 0 : (y > containerPos.height) ? containerPos.height : y
    }
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
            case 'n': {
                this.opDragDir = 's'
                break
            }
            case 'w': {
                this.opDragDir = 'e'
                break
            }
            case 's': {
                this.opDragDir = 'n'
                break
            }
            case 'e': {
                this.opDragDir = 'w'
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
        const restrictX = restrictXInCon(containerPos)
        const restrictY = restrictYInCon(containerPos)
        switch (this.opDragDir) {
            case 'n': {
                return {
                    x: restrictX(moveTargetPos.initialX),
                    y: restrictY(moveTargetPos.initialY),
                    x2: restrictX(mouseX + moveTargetPos.width / 2),
                    y2: restrictY(mouseY)
                }
            }
            case 's': {
                return {
                    x: restrictX(mouseX - moveTargetPos.width / 2),
                    y: restrictY(mouseY),
                    x2: restrictX(moveTargetPos.initialX + moveTargetPos.width),
                    y2: restrictY(moveTargetPos.initialY + moveTargetPos.height),
                    isChange: true
                }
            }
            case 'e': {
                return {
                    x: restrictX(mouseX),
                    y: restrictY(mouseY - moveTargetPos.height / 2),
                    x2: restrictX(moveTargetPos.initialX + moveTargetPos.width),
                    y2: restrictY(moveTargetPos.initialY + moveTargetPos.height),
                    isChange: true
                }
            }
            case 'w': {
                return {
                    x: restrictX(moveTargetPos.initialX),
                    y: restrictY(moveTargetPos.initialY),
                    x2: restrictX(mouseX),
                    y2: restrictY(mouseY + moveTargetPos.height)
                }
            }
            case 'nw': {
                return {
                    x: restrictX(moveTargetPos.initialX),
                    y: restrictY(moveTargetPos.initialY),
                    x2: restrictX(mouseX),
                    y2: restrictY(mouseY),
                    isChange: false
                }
            }
            case 'ne': {
                return {
                    x: restrictX(mouseX),
                    y: restrictY(moveTargetPos.initialY),
                    x2: restrictX(moveTargetPos.initialX + moveTargetPos.width),
                    y2: restrictY(mouseY),
                    isChange: true
                }
            }
            case 'sw': {
                return {
                    x: restrictX(moveTargetPos.initialX),
                    y: restrictY(mouseY),
                    x2: restrictX(mouseX),
                    y2: restrictY(moveTargetPos.initialY + moveTargetPos.height),
                    isChange: true
                }
            }
            case 'se': {
                return {
                    x: restrictX(mouseX),
                    y: restrictY(mouseY),
                    x2: restrictX(moveTargetPos.initialX + moveTargetPos.width),
                    y2: restrictY(moveTargetPos.initialY + moveTargetPos.height),
                    isChange: true
                }
            }
        }
    }
}
