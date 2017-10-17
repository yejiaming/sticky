# JS解决position:sticky的兼容性问题
在项目中有用到sticky的布局，可是由于兼容性问题，在安卓端没有很好的兼容，所以为了彻底解决这个问题只能写一个组件来解决这个麻烦的问题，这里为什么是组件而不是指令是因为，是有原因的，下面会讲到。
##position:sticky的兼容性以及作用
Caniuse上显示sticky的兼容性如下：
![](https://sfault-image.b0.upaiyun.com/209/641/2096419143-59e59f03578b1_articlex)
Sticky的作用相当于relative和fixed的结合体，当修饰的目标节点再屏幕中时表现为relative，当要超出的时候是fixed的形式展现，因为这个特性，我们就可以来实现一个sticky的模拟效果。
##sticky组件实现
####template部分
```html
<template>
    <div class="sticky" :style="getPosition">
        <div class="sticky-warp">
            <slot></slot>
        </div>
    </div>
</template>
```
**代码解读**：这里我使用了组件来实现，而不用指令来实现的原因是：指令虽然是无侵入性的，更方便使用，可是有一个弊端就是当修饰的节点fixed的时候会脱离文档流，会改变滚动的条的高度，如果仅仅是配合原生滚动条来实现是没问题的（当然这也会存在滚动过快的问题），可是由于是配合自定义滚动所以，采取这种折中的方式来实现。最外层是一个sticky层，判断浏览器是否支持sticky，不支持就使用relative来代替，这样也就不会改变浏览器高度的情况了，然后动态改变stick-warp层的postion来实现效果。

####css部分
```html
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
```
**代码解读**：这里的warp层的背景色设置和sticky一致，这样过渡不会太生硬，高度和top都根据用户对外层sticky的自定义来实现，这样这部分简单用css就可以完成了。

####JS部分

```js
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
                var el = this.$el, target = this.$el.parentNode,
                        elWarp = this.$el.querySelector('.sticky-warp'),
                        top = this.getNumberValue(document.defaultView.getComputedStyle(el).top);
                this.addScrollListen(target, (event)=> {
                    if (el.getBoundingClientRect().top <= top) {
                        elWarp.style.position = 'fixed';
                    }
                    if (el.getBoundingClientRect().top >= 0 && elWarp.style.position != 'absolute') {
                        elWarp.style.position = 'absolute';
                    }
                })
            },
            cssSupport: function (attr, value) {
                var element = document.createElement('div');
                if (attr in element.style) {
                    element.style[attr] = value;
                    return element.style[attr] === value;
                } else {
                    return false;
                }
            },
            getNumberValue(pxValue){
                var value = String(pxValue).match(/^\-?\+?[0-9]+/g);
                return value ? Number(value) : undefined;
            },
            addScrollListen(target, cb){
                target.addEventListener('y-scroll', (event)=> {
                    cb && cb(event);
                });
            }
        },
    }

</script>
```
**代码解读**：这里面主要先用cssSupport来判断一下浏览器的支持情况，然后通过多自定义滚动y-scroll事件的监听，监听top值的改变来实现sticky-warp层的fixed和absolute的转换。大概原理的思路及实现过程就是上面这样，对于自定义的滚动的github地址：[https://github.com/yejiaming/scroll](https://github.com/yejiaming/scroll)，sticky组件以及原生滚动下的指令参考的实现的github地址如下：[https://github.com/yejiaming/sticky](https://github.com/yejiaming/sticky)

