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

// 调度我们的diff或者render任务
function workLoop(deadline) {}

requestIdleCallback(workLoop);

export default {
  createElement,
  render,
};
