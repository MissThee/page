/// <reference path="node1.d.ts"/>

//使用三斜杠方式引用外部模块声明
//在使用普通引用模块的方法引用模块进行使用
import url = require("urlUtil");
let myUrl1 = url.parse("http://www.typescriptlang.org");

import * as URL from "urlUtil";
let myUrl = URL.parse("http://www.typescriptlang.org");

import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";
console.log(data, fileContent);
