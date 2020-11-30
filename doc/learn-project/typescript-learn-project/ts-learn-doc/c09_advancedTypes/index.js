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
// 交叉类型（Intersection Types） T & U
function myExtend(first, second) {
    var result = {};
    for (var id in second) {
        if (!Object.prototype.hasOwnProperty.call(result, id)) {
            result[id] = second[id];
        }
    }
    for (var id in first) {
        result[id] = first[id];
    }
    return result;
}
var Man = /** @class */ (function () {
    function Man(name) {
        this.name = name;
        console.log('Man');
    }
    return Man;
}());
var Woman = /** @class */ (function () {
    function Woman(name) {
        this.name = name;
        console.log('Woman');
    }
    Woman.prototype.dress = function () {
    };
    return Woman;
}());
var person = myExtend(new Man("Jim"), new Woman("Jan"));
person.name;
person.dress();
// 联合类型（Union Types） T | U
function padLeft(value, padding) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
}
padLeft("Hello world", 4);
padLeft("Hello world", "!!!");
// 类型保护与区分类型（Type Guards and Differentiating Types）
//  类型保护可以在代码上下文中细化参数类型。即在指定的代码块中，确定参数的详细类型
var Bird = /** @class */ (function () {
    function Bird() {
    }
    Bird.prototype.fly = function () {
    };
    ;
    Bird.prototype.layEggs = function () {
    };
    ;
    return Bird;
}());
var Fish = /** @class */ (function () {
    function Fish() {
    }
    Fish.prototype.swim = function () {
    };
    ;
    Fish.prototype.layEggs = function () {
    };
    ;
    return Fish;
}());
function getSmallPet() {
    return Math.random() > 0.5 ? new Fish() : new Bird();
}
var pet = getSmallPet();
pet.layEggs(); // okay。两个类型中均有此方法
pet.swim(); // errors。可能没有此方法
pet.fly(); // errors。可能没有此方法
if (pet.swim !== undefined) { //使用类型断言，指定类型
    pet.swim();
}
else {
    pet.fly();
}
// 用户自定义的类型保护
function isFish(pet) {
    return pet.swim !== undefined;
}
if (isFish(pet)) { //使用类型谓词返回值方法，变量会缩减为那个具体的类型，只要这个类型与变量的原始类型是兼容的
    pet.swim();
}
else {
    pet.fly();
}
// typeof类型保护
function padLeftNeo(value, padding) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
}
var SpaceRepeatingPadder = /** @class */ (function () {
    function SpaceRepeatingPadder() {
    }
    SpaceRepeatingPadder.prototype.sp = function () {
    };
    return SpaceRepeatingPadder;
}());
var StringPadder = /** @class */ (function () {
    function StringPadder() {
    }
    StringPadder.prototype.s = function () {
    };
    return StringPadder;
}());
function getRandomPadder() {
    return Math.random() < 0.5 ?
        new SpaceRepeatingPadder() :
        new StringPadder();
}
var padder = getRandomPadder();
if (padder instanceof SpaceRepeatingPadder) {
    padder.sp(); // 类型细化为'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
    padder.s(); // 类型细化为'StringPadder'
}
// 可以为null的类型
// TypeScript会把 null和 undefined区别对待。以下三个是不同的类型：
// string | null，
// string | undefined
// string | undefined | null。
//可选参数和可选属性
//使用了 --strictNullChecks，可选参数会被自动地加上 | undefined:
//可以使用!后缀，从 identifier的类型里去除了 null和 undefined
function broken(name) {
    function postfix(epithet) {
        return name.charAt(0) + '.  the ' + epithet; // error, name可能是null
    }
    name = name || "Bob";
    return postfix("great");
}
function fixed(name) {
    function postfix(epithet) {
        return name.charAt(0) + '.  the ' + epithet; // ok
    }
    name = name || "Bob";
    return postfix("great");
}
function getName(n) {
    return n;
}
getName('zxc');
var Person = /** @class */ (function () {
    function Person(next) {
        this.name = '';
        if (next) {
            this.next = next;
        }
        else {
            this.next = this;
        }
    }
    return Person;
}());
var person1 = new Person();
var person2 = new Person(person1);
person2.name;
person2.next.name;
person2.next.next.name;
person2.next.next.next.name;
var UIElement = /** @class */ (function () {
    function UIElement() {
    }
    UIElement.prototype.animate = function (dx, dy, easing) {
        switch (easing) {
            case "ease-in":
                break;
            case "ease-out":
                break;
            case "ease-in-out":
                break;
            default:
                break;
        }
    };
    return UIElement;
}());
var button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy"); // error。只能从三种允许的字符中选择其一来做为参数传递，传入其它值则会产生错误
function createElement(tagName) {
    return new Element();
}
// 数字字面量类型
function rollDie() {
    return 1;
}
function area(s) {
    switch (s.kind) {
        case "square":
            return s.size * s.size;
        case "rectangle":
            return s.height * s.width;
        case "circle":
            return Math.PI * Math.pow(s.radius, 2);
        default:
            return assertNever(s);
    }
}
function assertNever(x) {
    throw new Error("Unexpected object: " + x);
}
//多态的 this类型
var BasicCalculator = /** @class */ (function () {
    function BasicCalculator(value) {
        if (value === void 0) { value = 0; }
        this.value = value;
    }
    BasicCalculator.prototype.currentValue = function () {
        return this.value;
    };
    BasicCalculator.prototype.add = function (operand) {
        this.value += operand;
        return this;
    };
    return BasicCalculator;
}());
var ScientificCalculator = /** @class */ (function (_super) {
    __extends(ScientificCalculator, _super);
    function ScientificCalculator(value) {
        if (value === void 0) { value = 0; }
        return _super.call(this, value) || this;
    }
    ScientificCalculator.prototype.sin = function () {
        this.value = Math.sin(this.value);
        return this;
    };
    return ScientificCalculator;
}(BasicCalculator));
new ScientificCalculator(2)
    .add(1) //父类方法中返回this，此时this为当前的子类对象
    .sin()
    .currentValue();
// 索引类型（Index types）
// 索引类型查询操作符keyof T; 索引访问操作符T[K]
function getValueFromObj(t, k) {
    return t[k];
}
var student = {
    name: 'Jarid',
    age: 14
};
var personProps; // 此时完全等同于 'name' | 'age'
var value = getValueFromObj(student, 'name'); // ok, string
var keys1; // keyof T<V> 是 string
var value1; // T[V]  number
function f1(s) {
    return { a: 1, b: s };
}
var C = /** @class */ (function () {
    function C() {
        this.x = 0;
        this.y = 0;
    }
    return C;
}());
