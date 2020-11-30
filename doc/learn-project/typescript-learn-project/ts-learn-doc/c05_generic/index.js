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
//泛型
function identity(arg) {
    return arg;
}
identity("myString"); //显示声明参数类型
identity("myString"); //类型推断
//泛型数组
function loggingIdentity(arg) {
    console.log(arg.length); // Array has a .length, so no more error
    return arg;
}
function loggingIdentity1(arg) {
    console.log(arg.length); // Array has a .length, so no more error
    return arg;
}
//使用带有调用签名的对象字面量来定义泛型函数：
function identityFunc(arg) {
    return arg;
}
var myIdentity = identityFunc;
function identity123(arg) {
    return arg;
}
var myIdentity123 = identity123;
function identity456(arg) {
    return arg;
}
var myIdentity456 = identity456;
//泛型类
var GenericNumber = /** @class */ (function () {
    function GenericNumber(zeroValue, add) {
        this.zeroValue = zeroValue;
        this.add = add;
    }
    return GenericNumber;
}());
var myGenericNumber = new GenericNumber(0, function (x, y) {
    return 0;
});
function logging(arg) {
    console.log(arg.length); //传入的参数由.length属性
    return arg;
}
logging({ length: 10, value: 3 }); //传入的参数必须符合参数约束
// 在泛型里使用类类型
function create(c) {
    return new c();
}
// 使用原型属性推断并约束构造函数与类实例的关系
var BeeKeeper = /** @class */ (function () {
    function BeeKeeper() {
        this.beetag = false;
    }
    return BeeKeeper;
}());
var ZooKeeper = /** @class */ (function () {
    function ZooKeeper() {
        this.zootag = 'zoo';
    }
    return ZooKeeper;
}());
var Animal = /** @class */ (function () {
    function Animal() {
        this.numLegs = 4;
    }
    return Animal;
}());
var Bee = /** @class */ (function (_super) {
    __extends(Bee, _super);
    function Bee() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keeper = new BeeKeeper();
        return _this;
    }
    return Bee;
}(Animal));
var Lion = /** @class */ (function (_super) {
    __extends(Lion, _super);
    function Lion() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keeper = new ZooKeeper();
        return _this;
    }
    return Lion;
}(Animal));
function createInstance(c) {
    return new c();
}
createInstance(Lion).keeper.zootag;
createInstance(Bee).keeper.beetag;
