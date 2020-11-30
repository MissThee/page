export {}

// 交叉类型（Intersection Types） T & U
function myExtend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in second) {
        if (!Object.prototype.hasOwnProperty.call(result, id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    return result;
}

class Man {
    constructor(public name: string) {
        console.log('Man')
    }

}

class Woman {
    constructor(public name: string) {
        console.log('Woman')
    }

    dress() {

    }
}

let person = myExtend(new Man("Jim"), new Woman("Jan"));
person.name;
person.dress();

// 联合类型（Union Types） T | U
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
}

padLeft("Hello world", 4);
padLeft("Hello world", "!!!");

// 类型保护与区分类型（Type Guards and Differentiating Types）
//  类型保护可以在代码上下文中细化参数类型。即在指定的代码块中，确定参数的详细类型
class Bird {
    fly() {
    };

    layEggs() {
    };
}

class Fish {
    swim() {
    };

    layEggs() {
    };
}

function getSmallPet(): Fish | Bird {
    return Math.random() > 0.5 ? new Fish() : new Bird()
}

let pet = getSmallPet();
pet.layEggs(); // okay。两个类型中均有此方法
pet.swim();     // errors。可能没有此方法
pet.fly();      // errors。可能没有此方法
if ((<Fish>pet).swim !== undefined) {//使用类型断言，指定类型
    (<Fish>pet).swim();
} else {
    (<Bird>pet).fly();
}

// 用户自定义的类型保护
function isFish(pet: Fish | Bird): pet is Fish {//类型谓词，谓词为 parameterName is Type这种形式，parameterName必须是当前函数的一个参数名
    return (<Fish>pet).swim !== undefined;
}

if (isFish(pet)) {//使用类型谓词返回值方法，变量会缩减为那个具体的类型，只要这个类型与变量的原始类型是兼容的
    pet.swim();
} else {
    pet.fly();
}

// typeof类型保护
function padLeftNeo(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
}

// instanceof类型保护
interface Padder {
}

class SpaceRepeatingPadder implements Padder {
    sp() {
    }
}

class StringPadder implements Padder {
    s() {
    }

}

function getRandomPadder() {// 类型为SpaceRepeatingPadder | StringPadder
    return Math.random() < 0.5 ?
        new SpaceRepeatingPadder() :
        new StringPadder();
}

let padder: Padder = getRandomPadder();
if (padder instanceof SpaceRepeatingPadder) {
    padder.sp(); // 类型细化为'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
    padder.s(); // 类型细化为'StringPadder'
}

// 可以为null的类型
// TypeScript会把 null和 undefined区别对待。以下三个是不同的类型：
// string | null，
// string | undefined
// string | undefined | null。


//可选参数和可选属性
//使用了 --strictNullChecks，可选参数会被自动地加上 | undefined:

//可以使用!后缀，从 identifier的类型里去除了 null和 undefined
function broken(name: string | null): string {
    function postfix(epithet: string) {
        return name.charAt(0) + '.  the ' + epithet; // error, name可能是null
    }

    name = name || "Bob";
    return postfix("great");
}

function fixed(name: string | null): string {
    function postfix(epithet: string) {
        return name!.charAt(0) + '.  the ' + epithet; // ok
    }

    name = name || "Bob";
    return postfix("great");
}

// 类型别名
// 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型
// 起别名不会新建一个类型，它创建了一个新名字来引用那个类型
type MyString = string;

function getName(n: MyString): MyString {
    return n;
}

getName('zxc')

type Container<T> = { value: T };//类型别名也可以是泛型
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}
type LinkedList<T> = T & { next: LinkedList<T> };// 与交叉类型一起使用
class Person {
    name: string = '';
    next: LinkedList<Person>

    constructor(next?: LinkedList<Person>) {
        if (next) {
            this.next = next
        } else {
            this.next = this
        }

    }
}

let person1: LinkedList<Person> = new Person()
let person2: LinkedList<Person> = new Person(person1)

person2.name;
person2.next.name;
person2.next.next.name;
person2.next.next.next.name;
type Yikes = Array<Yikes>; // error。类型别名不能出现在声明右侧的任何地方。

// 接口 vs. 类型别名
// 别名不能和 extends、implements 搭配使用。因为 软件中的对象应该对于扩展是开放的，但是对于修改是封闭的，你应该尽量去使用接口代替类型别名。
// 如果你无法通过接口来描述一个类型并且需要使用联合类型或元组类型，这时通常会使用类型别名


// 字符串字面量类型
type Easing = "ease-in" | "ease-out" | "ease-in-out";

class UIElement {
    animate(dx: number, dy: number, easing: Easing) {
        switch (easing) {
            case "ease-in":
                break;
            case "ease-out":
                break;
            case "ease-in-out":
                break;
            default:
                break;
        }
    }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy"); // error。只能从三种允许的字符中选择其一来做为参数传递，传入其它值则会产生错误

function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
function createElement(tagName: string): Element {// 字符串字面量类型还可以用于区分函数重载
    return new Element()
}

// 数字字面量类型
function rollDie(): 1 | 2 | 3 | 4 | 5 | 6 {
    return 1;
}

// 可辨识联合（Discriminated Unions）
interface Square {
    kind: "square";
    size: number;
}

interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}

interface Circle {
    kind: "circle";
    radius: number;
}

interface Triangle {
    kind: "triangle";
    side: number;
}

type Shape = Square | Rectangle | Circle | Triangle;

function area(s: Shape) {
    switch (s.kind) {
        case "square":
            return s.size * s.size;
        case "rectangle":
            return s.height * s.width;
        case "circle":
            return Math.PI * s.radius ** 2;
        default:
            return assertNever(s);
    }
}

function assertNever(x: any): never {
    throw new Error("Unexpected object: " + x);
}

//多态的 this类型
class BasicCalculator {
    public constructor(protected value: number = 0) {
    }

    public currentValue(): number {
        return this.value;
    }

    public add(operand: number): this {
        this.value += operand;
        return this;
    }
}

class ScientificCalculator extends BasicCalculator {
    public constructor(value = 0) {
        super(value);
    }

    public sin() {
        this.value = Math.sin(this.value);
        return this;
    }
}

new ScientificCalculator(2)
    .add(1)//父类方法中返回this，此时this为当前的子类对象
    .sin()
    .currentValue();


// 索引类型（Index types）
// 索引类型查询操作符keyof T; 索引访问操作符T[K]
function getValueFromObj<T, K extends keyof T>(t: T, k: K): T[K] {
    return t[k];
}

let student = {
    name: 'Jarid',
    age: 14
};
let personProps: keyof Person; // 此时完全等同于 'name' | 'age'
let value: string = getValueFromObj(student, 'name'); // ok, string

// 索引类型和索引签名
interface Map<V> {
    [key: string]: V; //索引签名
}

let keys1: keyof Map<boolean>; // keyof T<V> 是 string
let value1: Map<number>['foo']; // T[V]  number

// 映射类型
interface PersonNormal {
    name: string;
    age: number;
}

interface PersonReadonly {//创建一个只读版本
    readonly name: string;
    readonly age: number;
}

//以下几个方法为ts库标准方法
type PartialPerson = Partial<PersonNormal>;//创建可选参数版本
type ReadonlyPerson = Readonly<PersonNormal>;//创建只读版本
type PickPerson = Pick<PersonNormal, "name">//创建提取部分属性的版本
type RecordPerson = Record<"student,teacher", PersonNormal>//创建一个新类型，{student:PersonNormal,teacher:PersonNormal}

//预定义的有条件类型
// TypeScript 2.8在lib.d.ts里增加了一些预定义的有条件类型：
// Exclude<T, U> -- 从T中剔除可以赋值给U的类型。
// Extract<T, U> -- 提取T中可以赋值给U的类型。
// NonNullable<T> -- 从T中剔除null和undefined。
// ReturnType<T> -- 获取函数返回值类型。
// InstanceType<T> -- 获取构造函数类型的实例类型。
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"

type T02 = Exclude<string | number | (() => void), Function>;  // string | number
type T03 = Extract<string | number | (() => void), Function>;  // () => void

type T04 = NonNullable<string | number | undefined>;  // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined>;  // (() => string) | string[]

function f1(s: string) {
    return {a: 1, b: s};
}

class C {
    x = 0;
    y = 0;
}

type T10 = ReturnType<() => string>;  // string
type T11 = ReturnType<(s: string) => void>;  // void
type T12 = ReturnType<(<T>() => T)>;  // {}
type T13 = ReturnType<(<T extends U, U extends number[]>() => T)>;  // number[]
type T14 = ReturnType<typeof f1>;  // { a: number, b: string }
type T15 = ReturnType<any>;  // any
type T16 = ReturnType<never>;  // any
type T17 = ReturnType<string>;  // Error
type T18 = ReturnType<Function>;  // Error

type T20 = InstanceType<typeof C>;  // C
type T21 = InstanceType<any>;  // any
type T22 = InstanceType<never>;  // any
type T23 = InstanceType<string>;  // Error
type T24 = InstanceType<Function>;  // Error

