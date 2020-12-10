function createElement(type, props, ...children) {
  delete props._source;

  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child !== "string" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
/**
 *
 * @param {虚拟dom} vdom
 */

function createDom(vdom) {
  // 处理dom
  const dom =
    vdom.type == "TEXT"
      ? document.createTextNode("")
      : document.createElement(vdom.type);

  // 对非嵌套
  Object.keys(vdom.props)
    .filter((key) => key != "children")
    .forEach((name) => (dom[name] = vdom.props[name]));

  return dom;
}

function render(vdom, container) {
  // container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`;
  // TODO : 这就是fiber结构
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [vdom],
    },
  };

  // 原来的递归逻辑，由于遍历的无法中断的缺点，引入fiber
  // vdom.props.children.forEach((child) => {
  //   render(child, dom);
  // });
  // container.appendChild(dom);
}

// 下一个单元任务
let nextUnitOfWork = null;

// 调度我们的diff或者render任务
function workLoop(deadline) {
  // 判断是否有下一个任务或者当前帧是否结束
  if (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 获取下一个单元任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  requestIdleCallback(workLoop);
}

// 获取下一个任务
function performUnitOfWork(fiber) {
  // 不是入口
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }
  const elements = fiber.props.children;
  // 构建fiber结构
  let index = 0;
  let prevSlibing = null;
  while (index < elements.length) {
    let element = element[index];
    let newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if ((index = 0)) {
      // 第一个元素时父元素的child属性
      fiber.child = newFiber;
    } else {
      // 其他的是以
      prevSlibing.slibing = newFiber;
    }
    prevSlibing = fiber;
    index++;
  }

  // 循环结束后，fiber基本结构构建完毕
  if (fiber.child) {
    return fiber.child;
  }
  // 没有子元素找兄弟元素
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.slibing) {
      return nextFiber.slibing;
    }
    // 没有兄弟元素找父元素
    nextFiber = nextFiber.parent;
  }
}

requestIdleCallback(workLoop);

export default {
  createElement,
  render,
};
