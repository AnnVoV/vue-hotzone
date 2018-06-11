export default {
    moveZone (target) {
        // let isMove = target.matches('.hotzone-area') || target.matches('.hotzone-area-link')
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
    // 'hotzone-area|hotzone-area-anchor|hotzone-area-flag|hotzone-area-link|hotzone-area-button|hotzone-area-btntxt'
    checkIsAddHotzone (target, selector) {
        // 我本质是要获取看移动的元素是否为 hotzone-area这一层
        // 在document.querySelector('.hotzone')下target的最远父元素
        selector = selector || '.hotzone'
        let node = this.farthestParent(target, document.querySelector('.hotzone'))
        return node === document
        /* let resultList = []
        let selectArr = selector.split('|')
        console.log('node:');
        console.log(node);
        selectArr.forEach((val) => {
            if (target.classList.contains(val)) {
                resultList.push(1)
            }
        })
        return (resultList.length === 0) */
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
    }
}
