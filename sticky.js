/**
 * Created by yejiaming on 2017/9/28.
 */
/**
 * Created by yejiaming on 2017/2/23.
 */
/*获取滚动目标节点对象*/
var getScrollEventTarget = function (element) {
    let currentNode = element;
    while (currentNode && currentNode.tagName !== 'HTML' &&
    currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
        let overflowY = document.defaultView.getComputedStyle(currentNode).overflowY;
        if (overflowY === 'scroll' || overflowY === 'auto') {
            return currentNode;
        }
        currentNode = currentNode.parentNode;
    }
    return window;
};
/*判断浏览器是否支持某一个属性，和该属性的某一个值*/
var cssSupport = function (attr, value) {
    var element = document.createElement('div');
    if (attr in element.style) {
        element.style[attr] = value;
        return element.style[attr] === value;
    } else {
        return false;
    }
}
export var sticky = {
    // 当绑定元素插入到 DOM 中。
    bind: function (el, binding, vnode) {
        // console.log('首次加载挂载到DOM节点中——一次挂载之运行一次');
    },
    inserted: function (el, binding) {
        // console.log('DOM节点挂载到完毕——一次挂载之运行一次');
        var target = getScrollEventTarget(el);
        if(target !== el.parentNode) {
            console.error('当前含有stocky的节点，其父节点必须是滚动条的所在节点');
        }else if (cssSupport('position', 'sticky')) {
            return;
        }

        var top = binding.value ? binding.value : 0;
        target.addEventListener('scroll', ()=> {
            if (el.getBoundingClientRect().top < top) {
                el.style.position = 'fixed';
            }
            if (target.scrollTop == 0) {
                el.style.position = '';
            }
        })
    },
    update: function (el, binding) {

    },
    componentUpdated: function (el, binding) {
        // console.log('完成更新DOM节点或者绑定数据——一次挂载之运行多次');
    },
    unbind: function (el, binding) {
        // console.log('取消该节点的挂载——一次挂载之运行一次');
    }
};
