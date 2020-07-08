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
var p05Generics;
(function (p05Generics) {
    //泛型--------------------------------------
    //其中T为 类型变量，用于表示类型而不是值。这个方法可以保证参数类型与返回类型相同
    function identity(arg) {
        // console.log(arg.length); //此处不能访问T类型的参数的length属性，因为T类型未确定
        return arg;
    }
    //相对于以下方法，使用泛型不会丢失类型信息，以下方法则无法确定类型
    // function identity(arg: any): any {
    //     return arg;
    // }
    //调用带泛型的方法
    console.log(identity("myString")); //调用时可明确指定泛型类型(推荐，容易通过代码看出类型)
    console.log(identity("myString")); //也可省略泛型类型(不推荐)
    //泛型数组--------------------------------------
    function loggingIdentity(arg) {
        console.log(arg.length);
        return arg;
    }
    console.log(loggingIdentity([1, 2, 3]));
    //定义泛型函数。只是在不带泛型的基础上增加一个泛型声明
    var myIdentity1 = identity;
    //使用带有调用签名的对象字面量来定义泛型函数
    var myIdentity2 = identity;
    var myIdentity3 = identity;
    var myIdentity4 = identity;
    console.log(myIdentity4(1));
    //泛型类--------------------------------------
    //即在类的后面声明泛型T
    var GenericNumber = /** @class */ (function () {
        function GenericNumber(zeroValue, add) {
            this.zeroValue = zeroValue;
            this.add = add;
        }
        return GenericNumber;
    }());
    var myGenericNumber = new GenericNumber(0, function (x, y) {
        return x + y;
    });
    //在泛型约束中使用类型参数
    function getProperty(obj, key) {
        return obj[key];
    }
    var x = { a: 1, b: 2, c: 3, d: 4 };
    getProperty(x, "a");
    // getProperty(x, "m"); //编译时错误，第二参数只能为x中的键值
    //构造函数泛型约束--------------------------------------
    var Animal = /** @class */ (function () {
        function Animal(name) {
            this.name = name;
        }
        return Animal;
    }());
    var Lion = /** @class */ (function (_super) {
        __extends(Lion, _super);
        function Lion() {
            return _super.call(this, "tiger") || this;
        }
        return Lion;
    }(Animal));
    function createInstance(c) {
        return new c();
    }
    var lion = createInstance(Lion);
    console.log(lion.name);
})(p05Generics || (p05Generics = {}));
