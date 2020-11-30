"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// boolean 布尔
var isDone = false;
// number 数字
var decLiteral = 6;
var hexLiteral = 0xf00d;
var binaryLiteral = 10;
var octalLiteral = 484;
// string 字符串
var name = "bob";
name = "smith";
// array 数组
var list = [1, 2, 3];
var listType = [1, 2, 3]; // 加泛型
// tuple 元组
var x;
x = ['hello', 10]; // OK
// x = [10, 'hello']; // Error
// enum 枚举
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {})); //默认从0开始编号
var c = Color.Green;
var Color1;
(function (Color1) {
    Color1[Color1["Red"] = 0] = "Red";
    Color1[Color1["Green"] = 3] = "Green";
    Color1[Color1["Blue"] = 4] = "Blue";
})(Color1 || (Color1 = {}));
var colorName = Color1[3];
console.log(colorName); // 'Green'
// any 忽略类型检查
var notSure = 4;
notSure = "maybe a string instead";
notSure = false;
//void
function warnUser() {
    console.log("This is my warning message");
}
var unusableUndefined = undefined; //声明一个void类型的变量只能为它赋予undefined和null：
var unusableNull = null; //声明一个void类型的变量只能为它赋予undefined和null：
// Null 和 Undefined
var u = undefined;
var n = null;
