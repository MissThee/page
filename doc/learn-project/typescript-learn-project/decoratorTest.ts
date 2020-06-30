import 'reflect-metadata';
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

//装饰器求值
//类中不同声明上的装饰器将按以下规定的顺序应用：
// 1.参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
// 2.参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。
// 3.参数装饰器应用到构造函数。
// 4.类装饰器应用到类。
let logPre = '表达式执行顺序：\n';
let logAfer = '装饰器函数执行顺序：\n';

function logClass(log: string) {
    logPre += log + "\n";
    return function (target: any) {//target类的原型对象
        logAfer += log + "\n";
        console.log(log, target);
    }
}

function logProperty(log: string) {
    logPre += log + "\n";
    return function (target: any, attr: any) {//target类的原型对象；attr传入的参数
        logAfer += log + "\n";
        console.log(log, target, attr);
    }
}

function logMethod(log: string) {
    logPre += log + "\n";
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        logAfer += log + "\n";
        console.log(log, target, propertyKey, descriptor);
    }
}

function logParam(log: string) {
    logPre += log + "\n";
    return function (target: any, method: string, paramIndex: number) {
        logAfer += log + "\n";
        console.log(log, target, method, paramIndex);
    }
}


@logClass('6、类')
class demo1 {
    @logProperty('5、静态成员 属性')
    static _param0: number = 1;
    @logProperty('1、实例成员 属性')
    private _param1: number = 1;

    constructor(@logParam("7、构造函数 参数") p1: number) {
        this._param1 = p1;
    }

    @logMethod('2、实例成员 访问符')
    get param1(): number {
        return ++this._param1;
    }

    @logMethod("3、实例成员 方法")
    hello(@logParam("4、实例成员 方法参数") saySomething: string) {
        console.log("hello!" + saySomething)
    }
}

console.log("");
console.log(logPre);
console.log(logAfer);



