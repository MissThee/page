"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
function printLabel(labelledObj) {
    console.log(labelledObj.label);
}
var myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
var p1 = { x: 10, y: 20 };
p1.x = 5; // error!
// ReadonlyArray 只读数组
var a = [1, 2, 3, 4];
var ro = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error! 不可普通赋值
a = ro; // OK! 可以将使用类型断言后赋值
function createSquare(config) {
    return { color: 'none' || config.color, area: 0 };
}
createSquare({ colour: "red", width: 100 }); //使用字面量会经过额外的属性检查
createSquare({ colour: "red", width: 100 }); //使用断言能绕开字面量额外属性检查
var param = { colour: "red", width: 100 };
createSquare(param); //将字面量赋值给变量再传入能绕开字面量额外属性检查
var mySearch;
mySearch = function (source, subString) {
    var result = source.search(subString);
    return result > -1;
};
mySearch = function (src, sub) {
    var result = src.search(sub);
    return result > -1;
};
var myArray;
myArray = ["Bob", "Fred"];
var myStr = myArray[0];
// 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。
var Animal = /** @class */ (function () {
    function Animal(name) {
        this.name = "";
        this.name = name;
    }
    return Animal;
}());
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dog.prototype.bark = function () {
        console.log("wang wang wang");
    };
    ;
    return Dog;
}(Animal));
//当混合使用可索引类型，且子类有额外属性时，只能传入子类对象
var animalObjOkay = {
    // "99": new Animal("D1"),//此处无法传入animal，缺少bark()属性
    "100": new Dog("D1"),
    101: new Dog("D2")
};
var TestClock = /** @class */ (function () {
    function TestClock(h, m) {
    }
    TestClock.prototype.setTime = function (d) {
        this.currentTime = d;
    };
    return TestClock;
}());
function createClock(ctor, hour, minute) {
    return new ctor(hour, minute);
}
var TickTickClock = /** @class */ (function () {
    function TickTickClock(h, m) {
    }
    TickTickClock.prototype.tick = function () {
        console.log("tick tick");
    };
    return TickTickClock;
}());
createClock(TickTickClock, 12, 17);
var square = {};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
function getCounter() {
    var counter = function (start) {
        return 'test';
    };
    counter.interval = 123;
    counter.reset = function () {
    };
    return counter;
}
var c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
// -----------------接口继承类-----------------
var Control = /** @class */ (function () {
    function Control() {
    }
    return Control;
}());
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Button.prototype.select = function () { };
    return Button;
}(Control));
// 错误：“Image”类型缺少“state”属性。
var Image = /** @class */ (function () {
    function Image() {
    }
    Image.prototype.select = function () { };
    return Image;
}());
var Location = /** @class */ (function () {
    function Location() {
    }
    return Location;
}());
