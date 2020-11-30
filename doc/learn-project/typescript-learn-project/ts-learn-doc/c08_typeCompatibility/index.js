"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Person = /** @class */ (function () {
    function Person() {
        this.name = '';
    }
    return Person;
}());
var p = new Person(); //接口与类中，属性与类型相同，可以赋值
//类之间的兼容性
var Animal = /** @class */ (function () {
    function Animal(name, numFeet) {
        this.feet = numFeet;
    }
    return Animal;
}());
var Size = /** @class */ (function () {
    function Size(numFeet) {
        this.feet = numFeet;
    }
    return Size;
}());
var a = new Animal('', 2);
var s = new Size(4);
a = s; // OK。只有实例属性(公有私有)会被比较；构造函数是静态成员，不被比较
s = a; // OK
//对象间的兼容性
var x;
var y = { name: 'Alice', location: 'Seattle' };
x = y; //如果x要兼容y，那么y至少具有与x相同的属性
function greet(n) {
    console.log('Hello, ' + n.name);
}
greet(y); // OK
// 函数间的兼容性
var xx = function (a) { return 0; };
var yy = function (b, s) { return 0; };
yy = xx; // OK
xx = yy; // Error。如果xx要兼容yy，那么yy参数只能是xx的左匹配子集
//返回值间的兼容
var xxx = function () { return ({ name: 'Alice' }); };
var yyy = function () { return ({ name: 'Alice', location: 'Seattle' }); };
yyy = xxx; // Error。xxx返回值必须是yyy返回值的子类型；即至少包含yyy返回值的所有属性，只能多不能少
xxx = yyy; // OK
var x1 = {};
var y1 = {};
x1 = y1; // OK。因为他们的类型Empty中的实例属性相同
var x2 = { data: 1 };
var y2 = { data: '1' };
x2 = y2; // Error。因为他们的类型NotEmpty中的实例属性不同
var identity = function (x) {
    // ...
};
var reverse = function (y) {
    // ...
};
identity = reverse; // OK, 没有明确指定泛型类型时，视作any，所以(x: any) => any 等同于 (y: any) => any
