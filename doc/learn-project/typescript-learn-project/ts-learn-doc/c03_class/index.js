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
// 类
var Animal = /** @class */ (function () {
    function Animal(theName) {
        this.name = theName;
    }
    Animal.prototype.move = function (distanceInMeters) {
        if (distanceInMeters === void 0) { distanceInMeters = 0; }
        console.log('move');
    };
    return Animal;
}());
var Horse = /** @class */ (function (_super) {
    __extends(Horse, _super);
    function Horse(name) {
        return _super.call(this, name) || this;
    } //如果不写构造函数，则默认使用父类构造函数。写构造函数必须在首行调用super()执行父类构造函数
    Horse.prototype.move = function (distanceInMeters) {
        if (distanceInMeters === void 0) { distanceInMeters = 45; }
        console.log('Horse move');
        _super.prototype.move.call(this, distanceInMeters); //调用父类方法
    };
    return Horse;
}(Animal));
var tom = new Horse("Tommy");
tom.move(34);
// public private protected修饰符
// public 默认修饰符
// protected 类的外部 不能访问
// private 类的外部、子类中 不能访问
// readonly修饰符
var Octopus = /** @class */ (function () {
    function Octopus(theName) {
        this.numberOfLegs = 8;
        this.name = theName;
    }
    return Octopus;
}());
var Octopus1 = /** @class */ (function () {
    function Octopus1(name) {
        this.name = name;
        this.numberOfLegs = 8;
    }
    return Octopus1;
}());
// 存取器
var Employee = /** @class */ (function () {
    function Employee() {
    }
    Object.defineProperty(Employee.prototype, "fullName", {
        get: function () {
            return this._fullName;
        },
        set: function (newName) {
            console.log("set fullName");
            this._fullName = newName;
        },
        enumerable: false,
        configurable: true
    });
    return Employee;
}());
//静态属性
var Grid = /** @class */ (function () {
    function Grid() {
    }
    Grid.origin = { x: 0, y: 0 };
    return Grid;
}());
var x = Grid.origin.x; //直接通过类访问静态属性
//抽象类
//不同于接口，抽象类可以包含成员的实现细节
var SmallAnimal = /** @class */ (function () {
    function SmallAnimal() {
    }
    SmallAnimal.prototype.move = function () {
        console.log('move...');
    };
    SmallAnimal.weight = 100;
    return SmallAnimal;
}());
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dog.prototype.makeSound = function () {
        console.log('bark bark bark');
    };
    return Dog;
}(SmallAnimal));
var dog = new Dog();
var dogMaker = Dog; //typeof Dog是获取dog类的类型，而不是实例类型
var dog1 = new dogMaker(); //与Dog使用相同
