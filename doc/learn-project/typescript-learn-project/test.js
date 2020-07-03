"use strict";
var p05Generics;
(function (p05Generics) {
    //泛型
    //其中T为 类型变量，用于表示类型而不是值。这个方法可以保证参数类型与返回类型相同
    function identity(arg) {
        return arg;
    }
    //相对于以下方法，使用泛型不会丢失类型信息，以下方法则无法确定类型
    // function identity(arg: any): any {
    //     return arg;
    // }
    //调用带泛型的方法
    console.log(identity("myString")); //调用时可明确指定泛型类型(推荐，容易通过代码看出类型)
    console.log(identity("myString")); //也可省略泛型类型(不推荐)
    //泛型数组
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
    //泛型类
    var GenericNumber = /** @class */ (function () {
        function GenericNumber(zeroValue, add) {
            this.zeroValue = zeroValue;
            this.add = add;
        }
        return GenericNumber;
    }());
    var myGenericNumber = new GenericNumber("", function (x, y) {
        return x + y;
    });
})(p05Generics || (p05Generics = {}));
