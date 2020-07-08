"use strict";
var p06Enums;
(function (p06Enums) {
    {
        //枚举。默认元素值从0开始
        var Direction = void 0;
        (function (Direction) {
            Direction[Direction["Up"] = 0] = "Up";
            Direction[Direction["Down"] = 1] = "Down";
            Direction[Direction["Left"] = 2] = "Left";
            Direction[Direction["Right"] = 3] = "Right";
        })(Direction || (Direction = {}));
        console.log('Direction', Direction);
    }
    {
        //使用
        var Direction1 = void 0;
        (function (Direction1) {
            Direction1[Direction1["Up"] = 1] = "Up";
            Direction1[Direction1["Down"] = 2] = "Down";
            Direction1[Direction1["Left"] = 6] = "Left";
            Direction1[Direction1["Right"] = 7] = "Right";
        })(Direction1 || (Direction1 = {}));
        console.log('Direction1', Direction1);
    }
    //枚举类型中所有成员都有字面量值时，可作为类型使用
    function getNum() {
        return 6;
    }
    {
        // Dog为动态值，此时枚举成员不能作为类型使用
        // enum MyEnum {
        //     Dog = getNum(),
        //     Cat=0,
        // }
        // interface testInter {
        //     param: MyEnum.Cat;//出错
        // }
        //枚举成员作为类型使用
        var MyEnum = void 0;
        (function (MyEnum) {
            MyEnum[MyEnum["Dog"] = 0] = "Dog";
            MyEnum[MyEnum["Cat"] = 1] = "Cat";
        })(MyEnum || (MyEnum = {}));
    }
    //运行时枚举
    var E;
    (function (E) {
        E[E["X"] = 0] = "X";
        E[E["Y"] = 1] = "Y";
        E[E["Z"] = 2] = "Z";
    })(E || (E = {}));
    function f(obj) {
        return obj.X;
    }
    f(E); //正确，E中含有X属性，可赋值给f中的参数
    {
        // 反向映射
        var Enum_1 = void 0;
        (function (Enum) {
            Enum[Enum["A"] = 0] = "A";
            Enum["B"] = "b";
        })(Enum_1 || (Enum_1 = {}));
        var a = Enum_1.A;
        var b = Enum_1.B;
        var nameOfA = Enum_1[a]; // "A"
        // let nameOfB = Enum[b];//错误，只有值为数字类型的枚举成员有反向映射
    }
    {
        //常量枚举使用的地方，编译后全部替换为其值
        var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
    }
})(p06Enums || (p06Enums = {}));
