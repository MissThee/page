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
var p03class;
(function (p03class) {
    //类
    var Greeter = /** @class */ (function () {
        function Greeter(message) {
            this.greeting = message;
        }
        Greeter.prototype.greet = function () {
            return "Hello, " + this.greeting;
        };
        return Greeter;
    }());
    var greeter = new Greeter("world");
    console.log(greeter.greet());
    console.log("--------------------------------------");
    {
        //类继承
        var Animal = /** @class */ (function () {
            function Animal() {
            }
            Animal.prototype.move = function (distanceInMeters) {
                if (distanceInMeters === void 0) { distanceInMeters = 0; }
                console.log("Animal moved " + distanceInMeters + "m.");
            };
            return Animal;
        }());
        var Dog = /** @class */ (function (_super) {
            __extends(Dog, _super);
            function Dog() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Dog.prototype.bark = function () {
                console.log('Woof! Woof!');
            };
            return Dog;
        }(Animal));
        var dog = new Dog();
        dog.bark();
        dog.move(10);
        dog.bark();
    }
    console.log("--------------------------------------");
    {
        var Animal = /** @class */ (function () {
            function Animal(theName) {
                this.name = theName;
            }
            Animal.prototype.move = function (distanceInMeters) {
                if (distanceInMeters === void 0) { distanceInMeters = 0; }
                console.log("Animal moved " + distanceInMeters + "m.");
            };
            return Animal;
        }());
        var Dog = /** @class */ (function (_super) {
            __extends(Dog, _super);
            function Dog(name) {
                var _this = 
                // this.weight=100;//不正确，子类构造函数里访问this前，必须调用super()
                _super.call(this, name) || this;
                _this.weight = 100;
                return _this;
            }
            Dog.prototype.bark = function () {
                console.log('Woof! Woof!');
            };
            Dog.prototype.move = function (distanceInMeters) {
                if (distanceInMeters === void 0) { distanceInMeters = 0; }
                console.log("Dog ran " + distanceInMeters + "m.");
            };
            return Dog;
        }(Animal));
        var dog = new Dog("D1");
        console.log(dog.name);
    }
    console.log("--------------------------------------");
    {
        //类含义private/protected属性，赋值兼容性
        var Animal = /** @class */ (function () {
            function Animal(theName) {
                this.name = theName;
            }
            return Animal;
        }());
        var Rhino = /** @class */ (function (_super) {
            __extends(Rhino, _super);
            function Rhino() {
                return _super.call(this, "Rhino") || this;
            }
            return Rhino;
        }(Animal));
        var Employee = /** @class */ (function () {
            function Employee(theName) {
                this.name = theName;
            }
            return Employee;
        }());
        var animal = void 0;
        var rhino = new Rhino();
        var employee = new Employee("Bob");
        animal = rhino;
        // animal = employee; // 错误: Animal 与 Employee 不兼容。
        // 因 employee中private的name 与 Animal中private的name 不是同一来源；protected规则相同
        // 若两个name属性均为public，则兼容，不关心来源
    }
    console.log("--------------------------------------");
    {
        //修饰符
        var Person = /** @class */ (function () {
            function Person(theName) {
                this.age = 16;
                this.name = theName;
            }
            return Person;
        }());
        // Employee 能够继承 Person
        var Employee = /** @class */ (function (_super) {
            __extends(Employee, _super);
            function Employee(name) {
                var _this = _super.call(this, name) || this;
                console.log(_this.name); //可访问基类中protected修饰的属性
                return _this;
                // console.log(this.age);//不能访问基类中protected修饰的属性
            }
            Employee.prototype.getInfo = function () {
                return "My name is " + this.name + ".";
            };
            return Employee;
        }(Person));
        var howard = new Employee("Howard");
        // let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的.
    }
    console.log("--------------------------------------");
    {
        //readonly 修饰符
        var Octopus = /** @class */ (function () {
            function Octopus(theName) {
                this.numberOfLegs = 8;
                this.name = theName;
            }
            return Octopus;
        }());
        var dad = new Octopus("Man with the 8 strong legs");
        //dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
        //简化以上类中属性的声明与赋值
        var OctopusNeo = /** @class */ (function () {
            function OctopusNeo(name) {
                this.name = name;
                this.numberOfLegs = 8;
            }
            return OctopusNeo;
        }());
        var octopusNeo = new OctopusNeo("O1");
        console.log(octopusNeo.name);
    }
    console.log("--------------------------------------");
    {
        //存取器，使用getters/setters
        { //未使用存取器的类
            var Employee = /** @class */ (function () {
                function Employee() {
                    this.fullName = "";
                }
                return Employee;
            }());
            var employee = new Employee();
            employee.fullName = "BobSmith";
            if (employee.fullName) {
                console.log(employee.fullName);
            }
        }
        {
            var Employee = /** @class */ (function () {
                function Employee() {
                    this._fullName = "";
                    this._sex = "unknown";
                }
                Object.defineProperty(Employee.prototype, "fullName", {
                    get: function () {
                        console.log("LOG:get fullName");
                        return this._fullName;
                    },
                    set: function (newName) {
                        console.log("LOG:change fullName");
                        this._fullName = newName;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Employee.prototype, "sex", {
                    get: function () {
                        return this._sex;
                    },
                    enumerable: false,
                    configurable: true
                });
                return Employee;
            }());
            var employee = new Employee();
            employee.fullName = "Dark Smith";
            // employee.sex="123";//只有get的存取器会被认定为readonly
            console.log(employee.fullName);
        }
    }
    {
        //静态属性
        var Grid_1 = /** @class */ (function () {
            function Grid(scale) {
                this.scale = scale;
                //使用Grid.访问静态属性
                console.log(Grid.origin.x / scale, Grid.origin.y / scale);
            }
            Grid.origin = { x: 0, y: 0 };
            return Grid;
        }());
        //使用Grid.访问静态属性
        console.log(Grid_1.origin.x);
    }
    {
        //抽象类
        var Animal = /** @class */ (function () {
            function Animal() {
            }
            Animal.prototype.move = function () {
                console.log('roaming the earch...');
            };
            return Animal;
        }());
        var Dog = /** @class */ (function (_super) {
            __extends(Dog, _super);
            function Dog() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Dog.prototype.makeSound = function () {
            };
            Dog.prototype.goHome = function () {
            };
            return Dog;
        }(Animal));
        var dog = new Dog();
        dog.makeSound();
        // dog.goHome();//声明了dog为Animal类型，则实例无法访问Animal类中未出现的方法
        var dog1 = new Dog();
        dog1.makeSound();
        dog1.goHome();
    }
    {
        //类当做接口使用
        var Point = /** @class */ (function () {
            function Point() {
                this.x = 0;
                this.y = 0;
            }
            return Point;
        }());
        var point3d = { x: 1, y: 2, z: 3 };
    }
})(p03class || (p03class = {}));
