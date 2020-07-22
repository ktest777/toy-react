class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }

  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      const eventName = RegExp.$1.replace(/^[\s\S]/, (x) => x.toLowerCase())
      this.root.addEventListener(eventName, value)
    }
    if(name === 'className') {
      this.root.setAttribute('class', value)
    }
    this.root.setAttribute(name, value)
  }

  appendChild(vchild) {
    // const range = document.createElement()
    const range = document.createRange()
    if(this.root.children.length) {
      range.setStartAfter(this.root.lastChild)
      range.setEndAfter(this.root.lastChild)
    } else {
      range.setStart(this.root, 0)
      range.setEnd(this.root, 0)      
    }
    vchild.mountTo(range)
  }

  mountTo(range) {
    range.deleteContents()
    range.insertNode(this.root)
    // parent.appendChild(this.root)
  }
}

class TextWrapper {
  constructor(type) {
    this.root = document.createTextNode(type)
  }

  mountTo(range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export class Component {
  constructor() {
    this.children = []
    this.props = {}
    this.state = {}
  }

  setState(state) {
    let merge = (oldState, newState) => {
      for(let x in newState) {
        if(typeof newState[x] === 'object' && newState[x] !== null) {
          if(typeof oldState[x] !== 'object') {
            if(newState[x] instanceof Array) {
              oldState[x] = []
            } else {
              oldState[x] = {}
            }
          }
          merge(oldState[x], newState[x])
        } else {
          oldState[x] = newState[x]
        }
      }
    }
    if(!this.state && state) {
      this.state = {}
    }
    merge(this.state, state)
    this.update()
  }

  setAttribute(name, value) {
    this.props[name] = value
    // this[name] = value
  }
  mountTo(range) {
    this.range = range
    this.update()
  }
  update() {
    let placeholder = document.createComment('placeholder')
    let range = document.createRange()
    range.setStart(this.range.endContainer, this.range.endOffset)
    range.setEnd(this.range.endContainer, this.range.endOffset)
    range.insertNode(placeholder)
    // const endOffset = this.range.endOffset
    // console.log(this.props, this.range.startOffset, this.range.endOffset)
    this.range.deleteContents()
    let vdom = this.render()
    // console.log(this.props, this.range.startOffset, this.range.endOffset)
    vdom.mountTo(this.range)
  }
  appendChild(child) {
    this.children.push(child)
  }
}

export const KReact = {
  createElement(type, attributes, ...children) {
    let element
    if (Object.prototype.toString.call(type) == '[object String]') {
      element = new ElementWrapper(type)
    } else {
      element = new type()
    }

    for (const name in attributes) {
      element.setAttribute(name, attributes[name])
    }

    const insertChildren = (children) => {
      for (const child of children) {
        if (typeof child === 'object' && child instanceof Array) {
          insertChildren(child)
        } else {
          if (child === null || child === void 0) {
            child = ''
          }
          if (
            !(child instanceof Component) &&
            !(child instanceof ElementWrapper) &&
            !(child instanceof TextWrapper)
          ) {
            child = String(child)
          }
          if (Object.prototype.toString.call(child) == '[object String]') {
            child = new TextWrapper(child)
          }
          
          element.appendChild(child)
        }
      }
    }
    insertChildren(children)

    return element
  },
  render(vdom, element) {
    // const range = document.createElement()
    const range = document.createRange()
    if(element.children.length) {
      range.setStartAfter(element.lastChild)
      range.setEndAfter(element.lastChild)
    } else {
      range.setStart(element, 0)
      range.setEnd(element, 0)      
    }
    vdom.mountTo(range)
  },
}
