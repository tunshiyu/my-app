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

function render(vdom, container) {
  // container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`;
  // 处理dom
  const dom =
    vdom.type == "TEXT"
      ? document.createTextNode("")
      : document.createElement(vdom.type);

  // 对非嵌套
  Object.keys(vdom.props)
    .filter((key) => key != "children")
    .forEach((name) => (dom[name] = vdom.props[name]));

  vdom.props.children.forEach((child) => {
    render(child, dom);
  });
  container.appendChild(dom);
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
function performUnitOfWork(fiber) {}

requestIdleCallback(workLoop);

export default {
  createElement,
  render,
};
