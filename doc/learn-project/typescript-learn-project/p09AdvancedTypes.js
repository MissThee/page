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
var p09AdvancedTypes;
(function (p09AdvancedTypes) {
    //高级类型
    //交叉类型--------------------------------------
    //使用&符号链接，其结果包含所有类型的特性
    function extend(first, second) {
        var result = {};
        for (var id in first) {
            result[id] = first[id];
        }
        for (var id in second) {
            if (!result.hasOwnProperty(id)) {
                result[id] = second[id];
            }
        }
        return result;
    }
    var Person = /** @class */ (function () {
        function Person(name) {
            this.name = name;
        }
        return Person;
    }());
    var ConsoleLogger = /** @class */ (function () {
        function ConsoleLogger() {
        }
        ConsoleLogger.prototype.log = function () {
            // ...
        };
        return ConsoleLogger;
    }());
    var jim = extend(new Person("Jim"), new ConsoleLogger());
    jim.name;
    jim.log();
    // 联合类型--------------------------------------
    //使用|符号链接，可传入其中一种类型
    function padLeft(value, padding) {
        // ...
    }
    padLeft("Hello world", 1);
    function getSmallPet() {
        return {};
    }
    var pet = getSmallPet();
    pet.layEggs;
    // pet.swim;    // 错误，不能访问非共有的成员
    //类保护机制--------------------------------------
    //声明一个返回值是 类型谓词 的函数，确定参数类型
    function isFish(pet) {
        return pet.swim !== undefined;
    }
    if (isFish(pet)) { //调用此函数后，可确定参数在此之后的类型
        pet.swim;
    }
    else {
        pet.fly;
    }
    //typeof类型保护--------------------------------------
    //使用typeof确定类型
    //只有两种形式能被识别：typeof v === "typename" 、typeof v !== "typename"，
    //"typename"必须是 "number"， "string"， "boolean"或 "symbol"，为其他值时不会被判定为“类型保护”
    function padLeft1(value, padding) {
        if (typeof padding === "number") {
            return Array(padding + 1).join(" ") + value;
        }
        else {
            return padding + value;
        }
    }
    var SpaceRepeatingPadder = /** @class */ (function () {
        function SpaceRepeatingPadder(numSpaces) {
            this.numSpaces = numSpaces;
        }
        SpaceRepeatingPadder.prototype.getPaddingString = function () {
            return Array(this.numSpaces + 1).join(" ");
        };
        return SpaceRepeatingPadder;
    }());
    var StringPadder = /** @class */ (function () {
        function StringPadder(value) {
            this.value = value;
        }
        StringPadder.prototype.getPaddingString = function () {
            return this.value;
        };
        return StringPadder;
    }());
    function getRandomPadder() {
        return Math.random() < 0.5 ?
            new SpaceRepeatingPadder(4) :
            new StringPadder("  ");
    }
    // 类型为SpaceRepeatingPadder | StringPadder
    var padder = getRandomPadder();
    if (padder instanceof SpaceRepeatingPadder) {
        padder; // 类型细化为'SpaceRepeatingPadder'
    }
    if (padder instanceof StringPadder) {
        padder; // 类型细化为'StringPadder'
    }
    //可以为null的类型--------------------------------------
    //非严格模式下，类型检查器认为 null与 undefined可以赋值给任何类型。
    //严格模式下，会把 null和 undefined区别对待。 如：string|null， string|undefined 和 string|undefined|null 是不同的类型
    // 可选参数和可选属性--------------------------------------
    // 可选参数会被自动地加上 | undefined
    function f(x, y) {
        return x + (y || 0);
    }
    f(1, 2);
    f(1);
    f(1, undefined);
    // f(1, null); //错误，可传入类型为 number|undefined
    var C = /** @class */ (function () {
        function C() {
            this.a = 0;
        }
        return C;
    }());
    var c = new C();
    c.a = 12;
    // c.a = undefined; //错误，不能为undefined
    c.b = 13;
    c.b = undefined;
    // c.b = null; // 错误，不能为null
    // 类型保护和类型断言--------------------------------------
    function f1(sn) {
        if (sn == null) {
            return "default";
        }
        else { //可判断出此处类型为string
            return sn;
        }
    }
    function f2(sn) {
        return sn || "default"; //使用短路运算符使其返回string
    }
    // function broken(name: string | null): string {
    //     function postfix(epithet: string) {
    //         return name.charAt(0) + '.  the ' + epithet; // 错误，name可能为null
    //     }
    //     name = name || "Bob";
    //     return postfix("great");
    // }
    function fixed(name) {
        function postfix(epithet) {
            // 使用!后缀，去除null\undefined类型，使编译通过，实际执行时如果为null或unde则或报错
            return name.charAt(0) + '.  the ' + epithet;
        }
        name = name || "Bob";
        return postfix("great");
    }
    console.log("AAA", fixed("AAA"));
    console.log("null", fixed(null));
    function getName(n) {
        if (typeof n === 'string') {
            return n;
        }
        else {
            return n();
        }
    }
    var people = { name: "Tom", next: { name: "Jam" } };
    var s = people.name;
    var s = people.next.name;
    var UIElement = /** @class */ (function () {
        function UIElement() {
        }
        UIElement.prototype.animate = function (dx, dy, easing) {
        };
        return UIElement;
    }());
    var button = new UIElement();
    button.animate(0, 0, "ease-in");
    function func1(param) {
    }
    func1(1);
    function assertNever(x) {
        throw new Error("Unexpected object: " + x);
    }
    function area(s) {
        //使用可辨识联合
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
    //多态的 this类型--------------------------------------
    //多态的 this类型表示的是某个包含类或接口的 子类型
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
        BasicCalculator.prototype.multiply = function (operand) {
            this.value *= operand;
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
    var v = new ScientificCalculator(2)
        .multiply(5)
        .sin()
        .add(1)
        .currentValue();
    console.log("Value", v);
    // 索引类型（Index types）--------------------------------------
    //使用索引类型，编译器就能够检查使用了动态属性名的代码
    function pluck(o, names) {
        //其中返回类型T[K][]，T[K]对应o[name]，之后的[]表名返回对象为集合
        return names.map(function (name) { return o[name]; });
    }
    var person = {
        name: 'Jarid',
        age: 35
    };
    var strings = pluck(person, ['name']); //编译器会检查 name是否是 Person的一个属性
    var testProps; // 'param1' | 'param2'
    function proxify(o) {
        var neoObj = {};
        var _loop_1 = function (key) {
            neoObj[key] = {
                get: function () { return o[key]; },
                set: function (value) {
                    o[key] = value;
                }
            };
        };
        for (var key in o) {
            _loop_1(key);
        }
        return neoObj;
    }
    var TestPerson = /** @class */ (function () {
        function TestPerson() {
            this.name = "aTestPerson";
        }
        return TestPerson;
    }());
    var tp = new TestPerson();
    var proxytp = proxify(tp);
    console.log(proxytp.name.get());
    console.log(proxytp.name.set("zxc"));
    console.log(proxytp);
    function unproxify(t) {
        var result = {};
        for (var k in t) {
            result[k] = t[k].get();
        }
        return result;
    }
    var originalProps = unproxify(proxytp);
    console.log(originalProps.name);
})(p09AdvancedTypes || (p09AdvancedTypes = {}));
