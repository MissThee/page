"use strict";
/// <reference path="node1.d.ts"/>
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//使用三斜杠方式引用外部模块声明
//在使用普通引用模块的方法引用模块进行使用
var url = require("urlUtil");
var myUrl1 = url.parse("http://www.typescriptlang.org");
var URL = __importStar(require("urlUtil"));
var myUrl = URL.parse("http://www.typescriptlang.org");
var xyz_txt_text_1 = __importDefault(require("./xyz.txt!text"));
var data_json_1 = __importDefault(require("json!http://example.com/data.json"));
console.log(data_json_1.default, xyz_txt_text_1.default);
