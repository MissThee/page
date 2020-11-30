import 'reflect-metadata';

namespace decoratorTest {
//装饰器
//装饰器是一个可被附加到 类声明、方法、访问符、属性、参数
//表示方法为@expression。其中expression部分若为执行的方法，结果必须为一个函数。expression会在ts编译时执行，由上至下；求取的函数会在js执行前执行，有由下至上，执行结果传递作为参数使用
//被装饰的声明信息作为参数传入
    function sealed(target: any) {
        // do something with "target" ...
    }

//装饰器工厂。返回一个装饰器，使用时需加括号，@color()
    function color(value: string) { // 这是一个装饰器工厂
        return function (target: any) { //  这是装饰器
            // do something with "target" and "value"...
        }
    }
// 装饰器不能用在声明文件中（.d.ts），或者任何外部上下文（比如 declare的类）里。

//装饰器求值
//类中不同声明上的装饰器将按以下规定的顺序应用：
// 1.参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
// 2.参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。
// 3.参数装饰器应用到构造函数。
// 4.类装饰器应用到类。
    let logPre = '表达式执行顺序：\n';
    let logAfer = '装饰器函数执行顺序：\n';
    //类装饰器（紧靠着类声明）
    function logClass(log: string) {
        logPre += log + "\n";
        return function (target: any) {
            logAfer += log + "\n";
            console.log(log, target);
            //target 类的构造函数: function demo1(p1) {this._param1 = 1;this._param1 = p1;}
            //如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明(注意  如果你要返回一个新的构造函数，你必须注意处理好原来的原型链。 在运行时的装饰器调用逻辑中 不会为你做这些。)
        }
    }
    //属性装饰器（紧靠着属性声明）
    function logProperty(log: string) {
        logPre += log + "\n";
        return function (target: any, attr: any) {
            //属性描述符不会做为参数传入属性装饰器，这与TypeScript是如何初始化属性装饰器的有关。 因为目前没有办法在定义一个原型对象的成员时描述一个实例属性，并且没办法监视或修改一个属性的初始化方法。
            logAfer += log + "\n";
            console.log(log, target, attr);
            //target 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象 : demo1 { hello: [Function], bye: [Function] }
            //attr 成员的名字              : _param1
            //返回值：会被忽略。因此，属性描述符只能用来监视类中是否声明了某个名字的属性。
        }
    }
    //方法装饰器（紧靠着方法声明）
    function logMethod(log: string) {
        logPre += log + "\n";
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {//
            logAfer += log + "\n";
            console.log(log, target, propertyKey, descriptor);
            //target 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象 : demo1 { hello: [Function], bye: [Function] }
            //propertyKey 成员的名字      : param1
            //descriptor 成员的属性描述符(注意  如果代码输出目标版本小于ES5，属性描述符将会是undefined) : { get: [Function: get], set: undefined, enumerable: false, configurable: true }
            //返回值：被用作方法的属性描述符(注意  如果代码输出目标版本小于ES5返回值会被忽略。)
        }
    }
    //访问器装饰器（紧靠着访问器声明）
    function logAccessor(log: string) {
        // TypeScript不允许同时装饰一个成员的get和set访问器，且一个成员的所有装饰的必须应用在文档顺序的第一个访问器上。因为在装饰器应用于一个属性描述符时，它联合了get和set访问器，而不是分开声明的。
        logPre += log + "\n";
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {//
            logAfer += log + "\n";
            console.log(log, target, propertyKey, descriptor);
            //target 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象 : demo1 { hello: [Function], bye: [Function] }
            //propertyKey 成员的名字      : param1
            //descriptor 成员的属性描述符(注意  如果代码输出目标版本小于ES5，属性描述符将会是undefined) : { get: [Function: get], set: undefined, enumerable: false, configurable: true }
            //返回值：被用作方法的属性描述符(注意  如果代码输出目标版本小于ES5返回值会被忽略。)
        }
    }
    //参数装饰器（紧靠着参数声明）
    function logParam(log: string) {
        logPre += log + "\n";
        return function (target: any, method: string, paramIndex: number) {
            logAfer += log + "\n";
            console.log(log, target, method, paramIndex);
            //target 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象 : demo1 { hello: [Function], bye: [Function] }
            //method 成员的名字   : hello
            //paramIndex 参数在函数参数列表中的索引 : 0
            //返回值：会被忽略。因此，参数装饰器只能用来监视一个方法的参数是否被传入
        }
    }


    @logClass('6、类')
    class demo1 {
        @logProperty('5、静态成员 属性')
        static _param0: number = 1;
        @logProperty('1、实例成员 属性')
        private _param1: number;

        constructor(@logParam("7、构造函数 参数") p1: number) {
            this._param1 = p1;
        }

        @logAccessor('2、实例成员 访问符')
        get param1(): number {
            return ++this._param1;
        }

        @logMethod("3、实例成员 方法")
        hello(@logParam("4、实例成员 方法参数") saySomething: string) {
            console.log("hello!" + saySomething)
        }
        @logMethod("5.1、静态成员 方法")
        static bye(saySomethingBye: string) {
            console.log("bye!" + saySomethingBye)
        }
    }

    console.log("");
    console.log(logPre);
    console.log(logAfer);
}
