"use strict";
var p08TypeCompatibility;
(function (p08TypeCompatibility) {
    //类型兼容
    {
        var Person = /** @class */ (function () {
            function Person() {
                this.name = "";
            }
            return Person;
        }());
        var p = void 0;
        p = new Person(); // 不会报错，因为Person类中有Named接口中的所有属性
    }
    {
        var x = void 0;
        //只要y包含name属性，则可以进行赋值
        var y = { name: 'Alice', location: 'Seattle' };
        x = y;
    }
    {
        var x = function (a) { return 0; };
        var y = function (b, s) { return 0; };
        y = x;
        // x = y; //错误，x中没有第二参数，无法赋值
    }
    {
        var x = function () { return ({ name: 'Alice' }); };
        var y = function () { return ({ name: 'Alice', location: 'Seattle' }); };
        x = y;
        // y = x; //错误，x的返回值中没有第二个属性
    }
    //参数用父类声明、子类传入--------------------------------------
    var a;
    (function (a) {
        function listenEvent(handler) {
            /* ... */
        }
        //使用父类类型声明，传入子类类型。严格模式下不能使用
        // listenEvent((e: MouseEvent) => console.log(e.x + "," + e.y));
        //修改后的写法可靠
        listenEvent(function (e) { return console.log(e.x + "," + e.y); });
        listenEvent((function (e) { return console.log(e.x + "," + e.y); }));
    })(a || (a = {}));
    var b;
    (function (b) {
        function invokeLater(args, callback) {
            /* ... Invoke callback with 'args' ... */
        }
        invokeLater([1, 2], function (x, y) { return console.log(x + ', ' + y); });
        invokeLater([1, 2], function (x, y) { return console.log(x + ', ' + y); });
    })(b || (b = {}));
    // 枚举类型兼容--------------------------------------
    // 枚举类型与数字兼容，与其他枚举类型不兼容
    var Status;
    (function (Status) {
        Status[Status["Ready"] = 0] = "Ready";
        Status[Status["Waiting"] = 1] = "Waiting";
    })(Status || (Status = {}));
    ;
    var Color;
    (function (Color) {
        Color[Color["Red"] = 0] = "Red";
        Color[Color["Blue"] = 1] = "Blue";
        Color[Color["Green"] = 2] = "Green";
    })(Color || (Color = {}));
    ;
    var status = Status.Ready;
    status = 2;
    // status = Color.Green;  // 错误
    //类兼容--------------------------------------
    //类中分为静态成员、实例成员，实例成员与构造函数不会比较，仅比较静态成员
    //（严格模式下必须初始化，非严格模式通过）
    // class Animal {
    //     feet: number;
    //     constructor(name: string, numFeet: number) { }
    // }
    //
    // class Size {
    //     feet: number;
    //     constructor(numFeet: number) { }
    // }
    //
    // let a: Animal;
    // let s: Size;
    // a = s;
    // s = a;
    //泛型兼容--------------------------------------
    // 仅仅声明的泛型类型不同可兼容
    // interface Empty<T> {
    // }
    // let x: Empty<number>;
    // let y: Empty<string>;
    // x = y;  // 可以兼容
    //
    // 所含属性类型不同时，不可兼容
    // interface NotEmpty<T> {
    //     data: T;
    // }
    // let x: NotEmpty<number>;
    // let y: NotEmpty<string>;
    // x = y;  //不能兼容，所含属性不匹配
    //没有指定泛型类型参数时，会把泛型当成any进行比较
    var identity = function (x) {
        return x;
    };
    var reverse = function (y) {
        return y;
    };
    identity = reverse; // OK, because (x: any) => any matches (y: any) => any
})(p08TypeCompatibility || (p08TypeCompatibility = {}));
