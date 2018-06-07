export default {
    moveZone (target) {
        var isMove = target.matches('.hotzone-area') || target.matches('.hotzone-area-link')
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
    },
    numberArrInString (str) {
        var arr = str.match(/(\d)+/g)
        return arr
    },
    // 'hotzone-area|hotzone-area-anchor|hotzone-area-flag|hotzone-area-link|hotzone-area-button|hotzone-area-btntxt'
    checkIsAddHotzone (target, selector) {
        // 我本质是要获取hotzone-area这一层
        /*let node = this.farthestParent(target, document.querySelector('.hotzone'))
        if(node && node.classList) {
            return !node.classList.contains('hotzone-area') && (node !== document.body);
        }
        return true;*/
        var resultList = [];
        var selectArr = selector.split('|');
        selectArr.forEach((val) => {
            if (target.classList.contains(val)) {
                resultList.push(1);
            }
        })
        return (resultList.length === 0);
    },
    closest (target, selector) {
        while (!target.classList.contains(selector)) {
            target = target.parentNode
        }
        return target;
    },
    farthestParent(target, parentNode) {
        parentNode = parentNode || document.body;
        if(!target) return parentNode;
        while(target.parentNode && target.parentNode !== parentNode) {
            target = target.parentNode;
        }
        return target;
    }
}
