# progress-indicator
滚动进度条组件，可定义到达底部事件

使用了 **发布者-订阅者模式** 的方式构造该组件

### 示例用法

```javascript
let a = new progressIndicator();
a.on('end', () => alert('end'));
a.once('change', () => console.log('change'));
```