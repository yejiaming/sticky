<template>
    <div class="sticky" :style="getPosition">
        <div class="sticky-warp">
            <slot></slot>
        </div>
    </div>
</template>
<script type="text/babel">
    export default {
        data () {
            return {}
        },
        computed: {
            getPosition(){
                var position = this.cssSupport('position', 'sticky') ? 'sticky' : 'relative';
                return 'position:' + position;
            }
        },
        props: {},
        beforeMount () {
        },
        mounted(){
            this.init();
        },
        deactivated(){
            if(this.cssSupport('position', 'sticky')) {
                return;
            }
            /*复位*/
            var elWarp = this.$el.querySelector('.sticky-warp');
            elWarp.position = 'absolute';
        },
        methods: {
            init(){
                if (this.cssSupport('position', 'sticky')) {
                    return;
                }
                var el = this.$el,
                        elWarp = this.$el.querySelector('.sticky-warp'),
                        target = this.getScrollEventTarget(el),
                        top = this.getNumberValue(document.defaultView.getComputedStyle(el).top),
                        height = this.getNumberValue(document.defaultView.getComputedStyle(el).height);

                this.addScrollListen(target, ()=> {
                    if (el.getBoundingClientRect().top <= top) {
                        elWarp.style.position = 'fixed';
                    }
                    if (target.scrollTop <= height && elWarp.style.position != 'absolute') {
                        elWarp.style.position = 'absolute';
                    }
                })
            },
            getNumberValue(pxValue){
                var value =  String(pxValue).match(/^[0-9]+/g);
                return value ? Number(value) : undefined;
            },
            addScrollListen(target, cb){
                target.addEventListener('scroll', ()=> {
                    cb && cb();
                });
            },
            getScrollEventTarget: function (element) {
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
            },
            cssSupport: function (attr, value) {
                var element = document.createElement('div');
                if (attr in element.style) {
                    element.style[attr] = value;
                    return element.style[attr] === value;
                } else {
                    return false;
                }
            }
        },
    }

</script>

<style scoped lang="less" rel="stylesheet/less">
    .sticky {
        width: 100%;
        .sticky-warp {
            width: 100%;
            background: inherit;
            will-change: change;
            height: inherit;
            top: inherit;
        }
    }
</style>