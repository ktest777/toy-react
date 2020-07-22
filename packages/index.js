let childrenSymbol = Symbol('children')
class ElementWrapper {
  constructor(type) {
    // this.root = document.createElement(type)
    this.type = type
    this.props = Object.create(null)
    this[childrenSymbol] = []
  }

  get children() {
    return this[childrenSymbol].map(child => child.vdom)
  }

  get vdom() {
    return this
  }
 
  setAttribute(name, value) {
    // if (name.match(/^on([\s\S]+)$/)) {
    //   const eventName = RegExp.$1.replace(/^[\s\S]/, (x) => x.toLowerCase())
    //   this.root.addEventListener(eventName, value)
    // }
    // if(name === 'className') {
    //   this.root.setAttribute('class', value)
    // }
    // this.root.setAttribute(name, value)
    if (name === 'className') {
      this.props['class'] = value
    }
    this.props[name] = value
  }

  appendChild(vchild) {
    this[childrenSymbol].push(vchild)
    // const range = document.createRange()
    // if(this.root.children.length) {
    //   range.setStartAfter(this.root.lastChild)
    //   range.setEndAfter(this.root.lastChild)
    // } else {
    //   range.setStart(this.root, 0)
    //   range.setEnd(this.root, 0)
    // }
    // vchild.mountTo(range)
  }

  mountTo(range) {
    this.range = range
    const element = document.createElement(this.type)

    for (let name in this.props) {
      const value = this.props[name]
      if (name.match(/^on([\s\S]+)$/)) {
        const eventName = RegExp.$1.replace(/^[\s\S]/, (x) => x.toLowerCase())
        element.addEventListener(eventName, value)
      }
      if (name === 'className') {
        element.setAttribute('class', value)
      }
      element.setAttribute(name, value)
    }

    for (let child of this.children) {
      const range = document.createRange()
      if (element.children.length) {
        range.setStartAfter(element.lastChild)
        range.setEndAfter(element.lastChild)
      } else {
        range.setStart(element, 0)
        range.setEnd(element, 0)
      }
      child.mountTo(range)
    }
    range.deleteContents()
    range.insertNode(element)
    // parent.appendChild(this.root)
  }
}

class TextWrapper {
  constructor(type) {
    this.root = document.createTextNode(type)
    this.type = '$text'
    this.children = []
    this.props = Object.create(null)
  }

  get vdom() {
    return this
  }

  mountTo(range) {
    this.range = range
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export class Component {
  constructor() {
    this[childrenSymbol] = []
    this.props = Object.create(null)
    this.state = Object.create(null)
  }

  get type() {
    return this.constructor.name
  }

  get vdom() {
    return this.render().vdom
  }

  get children() {
    return this[childrenSymbol].map(child => child.vdom)
  }

  setState(state) {
    let merge = (oldState, newState) => {
      for (let x in newState) {
        if (typeof newState[x] === 'object' && newState[x] !== null) {
          if (typeof oldState[x] !== 'object') {
            if (newState[x] instanceof Array) {
              oldState[x] = []
            } else {
              oldState[x] = Object.create(null)
            }
          }
          merge(oldState[x], newState[x])
        } else {
          oldState[x] = newState[x]
        }
      }
    }
    if (!this.state && state) {
      this.state = Object.create(null)
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
    // let placeholder = document.createComment('placeholder')
    // let range = document.createRange()
    // range.setStart(this.range.endContainer, this.range.endOffset)
    // range.setEnd(this.range.endContainer, this.range.endOffset)
    // range.insertNode(placeholder)
    // const endOffset = this.range.endOffset
    // console.log(this.props, this.range.startOffset, this.range.endOffset)
    // this.range.deleteContents()
    const vdom = this.render()
    vdom.mountTo(this.range)

    // if(this.oldvdom) {
    //   const isSameNode = (node1, node2) => {
    //     // if(!node1 || !node2) {
    //     //   return false
    //     // }
    //     if(node1.type !== node2.type) {
    //       // console.log('type', node1.type === node2.type)
    //       return false
    //     }
    //     if(Object.keys(node1.props).length !== Object.keys(node2.props).length) {
    //       // console.log('length', Object.keys(node1.props).length !== Object.keys(node2.props).length)
    //       return false
    //     }
    //     for(let name in node1.props) {
    //       if(typeof node1.props[name] === 'function' &&
    //          typeof node2.props[name] === 'function' &&
    //          node1.props[name].toString() === node2.props[name].toString()
    //       ) {
    //         continue
    //       }
    //       if(typeof node1.props[name] === 'object' &&
    //          typeof node2.props[name] === 'object' &&
    //          JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name])
    //       ) {
    //         continue
    //       }
    //       if(node1.props[name] !== node2.props[name]) {
    //         // console.log('prop', node1.props[name] !== node2.props[name])
    //         return false
    //       }
    //     }
    //     return true
    //   }
    //   const isSameTree = (node1, node2) => {
    //     if(!isSameNode(node1, node2)) {
    //       return false
    //     }
    //     if(node1.children.length !== node2.children.length) {
    //       return false
    //     }
    //     for(let i = 0; i < node1.children.length; i+= 1) {
    //       if(!isSameTree(node1.children[i], node2.children[i])) {
    //         return false
    //       }
    //     }
    //     return true
    //   }
    //   // if(isSameTree(vdom, this.vdom)) {
    //   //   return;
    //   // }
      
    //   let replace = (newTree, oldTree) => {
    //     // if(isSameTree(newTree, oldTree)) {
    //     //   return;
    //     // }
    //     if(isSameNode(newTree, oldTree)) {
    //       // if(newTree.children.length !== oldTree.children.length) {
    //       //   return newTree.mountTo(this.range)
    //       // }
    //       for(let i = 0; i < newTree.children.length; i+= 1) {
    //         replace(newTree.children[i], oldTree.children[i])
    //       }
    //     } else {
    //       newTree.mountTo(this.range)
    //     }
    //   }
    //   replace(vdom, this.oldvdom)
    // } else {
    //   vdom.mountTo(this.range)
    // }
    // // vdom.mountTo(this.range)
    // this.oldvdom = vdom
  }
  appendChild(child) {
    this[childrenSymbol].push(child)
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
    if (element.children.length) {
      range.setStartAfter(element.lastChild)
      range.setEndAfter(element.lastChild)
    } else {
      range.setStart(element, 0)
      range.setEnd(element, 0)
    }
    vdom.mountTo(range)
  },
}
