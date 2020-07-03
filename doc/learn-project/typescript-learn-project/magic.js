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
var magic;
(function (magic) {
    var square = {}; //<Square>强制类型转换
    square.color = "blue";
    square.sideLength = 10;
    var Clock = /** @class */ (function () {
        function Clock(h, m) {
            this.hour = h;
            this.minutes = m;
        }
        return Clock;
    }());
    var clock = Clock;
    var clockObj = new clock(1, 2);
    /*
    ParamType：
        T extends (param: infer P) => any ? P : T;
                  (user : User   ) => void
        与传入的函数对象对应，infer P是声明P为User类型
    ReturnType：
        T extends (...args: any[]) => infer P ? P : any;
                  (              ) => User
        与传入的函数对象对应，infer P是声明P为User类型
     */
    // ------------------------------------------------
    var obj = {
        foo: 1,
        bar: 'baz'
    };
    console.log(typeof obj);
    var obj2 = {
        foo: false,
        bar: false
    };
    // ------------------------------------------------
    var a = {
        a: 1,
        b: 2,
    };
    // keyof typeof a; // 'a' | 'b'
    var A = /** @class */ (function () {
        function A() {
            this.c = 1;
            this.d = 1;
        }
        return A;
    }());
    // keyof A; // 'c' | 'd'
    // ------------------------------------------------
    //一个错误用法，在类的构造函数中，修改类中的对象属性。因为此时还没有生成对象，其中的对象属性myArray还未初始化，为undefined
    var Base = /** @class */ (function () {
        function Base() {
            this.onCreate();
        }
        Base.prototype.onCreate = function () {
        };
        return Base;
    }());
    var Sub = /** @class */ (function (_super) {
        __extends(Sub, _super);
        function Sub() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.myArray = [];
            return _this;
        }
        Sub.prototype.onCreate = function () {
            this.myArray.push(2);
        };
        return Sub;
    }(Base));
    var s = new Sub();
})(magic || (magic = {}));
