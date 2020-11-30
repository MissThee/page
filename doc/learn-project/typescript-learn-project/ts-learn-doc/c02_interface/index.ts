// interface 接口
interface LabelledValue {
    label: string;
}

function printLabel(labelledObj: LabelledValue): void {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);

// readonly 只读属性
interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = {x: 10, y: 20};
p1.x = 5; // error!

// ReadonlyArray 只读数组
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error! 不可普通赋值
a = ro as number[];// OK! 可以将使用类型断言后赋值

// -----------------额外的属性检查-----------------
interface SquareConfig {
    color?: string;
    width?: number;
    // [propName: string]: any;//添加一个字符串索引签名，能让方法传入符合类型的任意变量，能绕开字面量额外属性检查
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    return {color: 'none' || config.color, area: 0}
}

createSquare({colour: "red", width: 100});//使用字面量会经过额外的属性检查
createSquare({colour: "red", width: 100} as SquareConfig);//使用断言能绕开字面量额外属性检查
let param = {colour: "red", width: 100}
createSquare(param);//将字面量赋值给变量再传入能绕开字面量额外属性检查
// 不推荐强行绕开属性检查！！

// -----------------函数类型-----------------
interface SearchFunc {
    (param1: string, b: string): boolean; //声明函数类型，其中括号内的参数名称无实际意思，不需要与实际方法名称对应
}

let mySearch: SearchFunc;
mySearch = function (source: string, subString: string): boolean {
    let result = source.search(subString);
    return result > -1;
}
mySearch = function (src, sub) { //不写类型会根据参数位置推断
    let result = src.search(sub);
    return result > -1;
}

// -----------------可索引类型-----------------

interface StringArray {
    [index: number]: string;//TypeScript支持两种索引签名：字符串和数字
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];

// 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。
class Animal {
    name: string = "";

    constructor(name: string) {
        this.name = name;
    }
}

class Dog extends Animal {
    bark(): void {
        console.log("wang wang wang")
    };
}

// 数字索引的返回值，必须是字符串索引返回值类型的子类型
interface AnimalObjOkay {
    //number类型索引返回值Dog，需要是string类型返回值Animal的子类
    //使用 number来索引时，JS会将它转换成string然后再去索引对象。 也就是说用 100（一个number）去索引，等同于使用"100"（一个string）去索引，因此两者需要保持一致。
    [x: number]: Dog;

    [x: string]: Animal;
}

//当混合使用可索引类型，且子类有额外属性时，只能传入子类对象
let animalObjOkay: AnimalObjOkay = {
    // "99": new Animal("D1"),//此处无法传入animal，缺少bark()属性
    "100": new Dog("D1"),
    101: new Dog("D2")
};

// -----------------类类型-----------------
//接口只描述并检查 公共部分 和 实例部分
interface TestClockInterface {
    currentTime: Date;

    setTime(d: Date);
}

class TestClock implements TestClockInterface {
    currentTime: Date;

    setTime(d: Date) {
        this.currentTime = d;
    }

    private innerValue: number;//私有部分

    constructor(h: number, m: number) {//静态部分
    }
}

//声明构造函数接口，并使用
interface ClockConstructor {
    new(hour: number, minute: number): ClockInterface; //声明构造函数类型
}

interface ClockInterface {
    tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class TickTickClock implements ClockInterface {//此处不能直接继承ClockConstructor，因为构造函数是静态部分，直接继承，检查不到
    constructor(h: number, m: number) {
    }

    tick() {
        console.log("tick tick");
    }
}

createClock(TickTickClock, 12, 17);

// -----------------接口继承接口-----------------
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;

// -----------------混合类型-----------------
interface Counter {
    (start: number): string;

    interval: number;

    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) {
        return 'test'
    };
    counter.interval = 123;
    counter.reset = function () {
    };

    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
// -----------------接口继承类-----------------
class Control {
    private state: any;
}

interface SelectableControl extends Control {// 接口继承类时，仅继承属性，不继承实现
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

// 错误：“Image”类型缺少“state”属性。
class Image implements SelectableControl {
    select() { }
}

class Location {

}

export {}
