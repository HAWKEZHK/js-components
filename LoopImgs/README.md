# LoopImgs
轮播图组件，可定义轮播模式，即淡入淡出(fade)和无缝滑动(slide)

使用了 **工厂模式** 、 **原型模式** 以及 **寄生组合继承** 的方式构造该组件

### 示例用法

```javascript
const obj_1 = { $container, $pre, $next, $tabs, hoverClass, time_gap };

LoopImgsFactory('fade', obj_1);
```
- 参数说明：

| 参数       | 类型    | 含义       |
| :-------:  | :-----: | :--------: |
| type       | String  | 轮播模式   |
| params     | Object  | dom对象集  |

- type：

| 选项    | 含义     |
| :-----: | :-----:  |
| slide   | 无缝滑动 |
| fade    | 淡入淡出 |

- params：

| 键          | 含义           |
| :---------: | :------------: |
| \$container | 图片容器       |
| \$pre       | 上一页         |
| \$next      | 下一页         |
| \$tabs      | 选项按钮       |
| hoverClass  | 选项按钮选中类 |
| time_gap    | 轮播时间       |