"use strict";
//接口
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
function printText(labelledObj) {
    console.log('输出labelledObj', labelledObj);
    // labelledObj.name="改名字";//错误，readonly只能在创建时赋值，不能再修改
}
//传入的对象中，有string类型的label属性即可。
var myObj = { size: 10, label: "theLabel!!!", name: '321' };
printText(myObj);
//传入的参数若为对象字面量，则不能出现接口中没有的属性，否则typescript编译报错
printText({ label: "theLabel!!!", name: '321' }); //size不能出现在这里
printText({ size: 10, label: "theLabel!!!", name: '321' }); //使用断言可传入多余的属性
// printText({size:10,label: "theLabel!!!",name:'321'});//可以在接口中增加[propName: string]: any;来接收额外的属性
console.log("-----------------------------------------");
var mySearch;
mySearch = function (src, sub) {
    return "1";
};
console.log("-----------------------------------------");
var myArray;
myArray = ["Bob", "Fred"];
console.log(myArray);
console.log(myArray[0]);
console.log(myArray[1]);
console.log(myArray[100]);
console.log(myArray[101]);
console.log("-----------------------------------------");
var myObject;
myObject = { 100: "Bob", 101: "Fred" };
console.log(myObject);
console.log(myObject[0]);
console.log(myObject[1]);
console.log(myObject[100]);
console.log(myObject[101]);
console.log("-----------------------------------------");
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
var animalObjOkay = { 100: new Dog("D1"), 101: new Dog("D2") };
console.log('输出animalObjOkay', animalObjOkay);
console.log(animalObjOkay[0]);
console.log(animalObjOkay[100]);
console.log("-----------------------------------------");
// interface NumberDictionary {
//     [index: string]: number;
//
//     length: number;    // 正确，length是number类型，与[index: string]: number的类型一致
//     name: string    // 错误，name是string乐行，与[index: string]: number的类型不一致
// }
//
// let numberDictionary: NumberDictionary;
// numberDictionary = {'myKey': 1, length: 2, name: "3"};
// console.log(numberDictionary);
console.log("-----------------------------------------");
var Clock = /** @class */ (function () {
    function Clock(h, m) {
        this.currentTime = new Date();
    }
    Clock.prototype.setTime = function (d) {
        this.currentTime = d;
    };
    return Clock;
}());
console.log("-----------------------------------------");
//将类赋值给变量时使用的接口
var FakeNum = /** @class */ (function () {
    function FakeNum(_val) {
    }
    FakeNum.aa = 'xx';
    FakeNum.bb = 11;
    return FakeNum;
}());
var kk = FakeNum;
console.log("-----------------------------------------");
//当使用implements继承接口时，仅检查实例部分，constructor存在于类的静态部分，所以不在检查的范围内，此处会报错，提示没有实现new (hour: number, minute: number);
// interface ClockConstructor {
//     new (hour: number, minute: number);
// }
// class Clock implements ClockConstructor {
//     constructor(h: number, m: number) { }
// }
console.log("-----------------------------------------");
var DigitalClock = /** @class */ (function () {
    function DigitalClock(h, m) {
    }
    DigitalClock.prototype.tick = function () {
        console.log("tock tick");
    };
    return DigitalClock;
}());
var AnalogClock = /** @class */ (function () {
    function AnalogClock(h, m) {
    }
    AnalogClock.prototype.tick = function () {
        console.log("tick tock");
    };
    return AnalogClock;
}());
function createClock(ctor, hour, minute) {
    return new ctor(hour, minute);
}
var digital = createClock(DigitalClock, 12, 17);
var analog = createClock(AnalogClock, 7, 32);
console.log("-----------------------------------------");
var Func = /** @class */ (function () {
    function Func() {
    }
    Func.prototype.func1 = function () {
    };
    Func.prototype.func2 = function () {
    };
    return Func;
}());
console.log("-----------------------------------------");
var square = {}; //<Square>强制类型转换，断言类型
console.log('输出square', square); //{}
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
