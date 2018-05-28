import Watcher from './watcher'

// 指令解析器
class Compile {
  constructor(el, vm){
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    if (this.$el) {
      this.$fragment = this.nodeToFragment(this.$el)
      this.compileElement(this.$fragment)
      this.$el.appendChild(this.$fragment)
    }
  }

  // 获得原生节点的虚拟拷贝
  nodeToFragment(el) {
    let fragment = document.createDocumentFragment()
    let child
    while (child = el.firstChild) fragment.appendChild(child) // 之后el中无child
    return fragment
  }

  // 元素节点类型编译节点
  compileElement(el) {
    Array.from(el.childNodes).forEach((node)=> {
      let text = node.textContent // 每个子元素的文本
      let reg = /\{\{(.*)\}\}/

      if (this.isElementNode(node)) { // 元素节点
        this.compile(node)
      } else if (this.isTextNode(node) && reg.test(text)) { // 文本节点且匹配'{{ }}'
        this.compileText(node, RegExp.$1)
      }

      //  遍历编译子节点
      if (node.childNodes && node.childNodes.length)
        this.compileElement(node)
    })
  }

  // 编译元素节点
  compile(node) {
    let nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach((attr)=> {
      let attrName = attr.name
      if (this.isDirective(attrName)) { // 'v-'前缀
        let exp = attr.value
        let dir = attrName.substring(2)

        if (this.isEventDirective(dir)) { // 事件指令
          compileUtil.eventHandler(node, this.$vm, exp, dir)
        } else { // 普通指令
          compileUtil[dir] && compileUtil[dir](node, this.$vm, exp)
        }
        node.removeAttribute(attrName)
      }
    })
  }

  // 编译文本节点
  compileText(node, exp) { compileUtil.text(node, this.$vm, exp) }

  // 是否'v-'前缀
  isDirective(attr) { return attr.startsWith('v-') }

  // 是否事件指令
  isEventDirective(dir) { return dir.startsWith('on') }

  // 判断节点类型
  isElementNode(node) { return node.nodeType == 1 }
  isTextNode(node) { return node.nodeType == 3 }
}


// 指令处理集合
const compileUtil = {
  // 事件处理
  eventHandler(node, vm, exp, dir) {
    let eventType = dir.split(':')[1]
    let fn = vm.$options.methods && vm.$options.methods[exp]
    if (eventType && fn) node.addEventListener(eventType, fn.bind(vm), false)
  },

    text(node, vm, exp) { this.bind(node, vm, exp, 'text') },
    html(node, vm, exp) { this.bind(node, vm, exp, 'html') },
  class(node, vm, exp) { this.bind(node, vm, exp, 'class') },
    model(node, vm, exp) {
        this.bind(node, vm, exp, 'model')

        let val = this._get(vm, exp)
        node.addEventListener('input', (e)=> { // 绑定input事件
            let newValue = e.target.value
            if (val === newValue)  return
          this._set(vm, exp, newValue)
            val = newValue
        })
    },
    bind(node, vm, exp, dir) {
        let updaterFn = updater[dir]
        updaterFn && updaterFn(node, this._get(vm, exp))

        new Watcher(vm, exp, (value, oldValue)=> {
            updaterFn && updaterFn(node, value, oldValue)
        })
    },

    _get(vm, exp) {
        let val = vm
        exp = exp.split('.')
        exp.forEach((k)=> { val = val[k] }) // 非最后一个key，更新val的值
        return val
    },

    _set(vm, exp, value) {
        let val = vm
        exp = exp.split('.')
        exp.forEach((k, i)=> {
            if (i < exp.length - 1) {
                val = val[k]
            } else {
                val[k] = value
            }
        })
    }
}

const updater = {
  text(node, value) { node.textContent = (typeof value == 'undefined') ? '' : value },
  html(node, value) { node.innerHTML = (typeof value == 'undefined') ? '' : value },
  model(node, value) { node.value = (typeof value == 'undefined') ? '' : value },
  class(node, value, oldValue) {
    let className = node.className
    className = className.replace(oldValue, '').replace(/\s$/, '')

    let space = className && String(value) ? ' ' : ''
    node.className = className + space + value
  }
}

export default Compile