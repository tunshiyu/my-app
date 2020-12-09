// import React from "react";
import React from "./myreact";

let ReactDOM = React;

const dom = (
  <div>
    <h1>学习react源码ss</h1>
    <p>哈哈</p>
    <a href="www.baidu.com">a标签</a>
  </div>
);

ReactDOM.render(dom, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
