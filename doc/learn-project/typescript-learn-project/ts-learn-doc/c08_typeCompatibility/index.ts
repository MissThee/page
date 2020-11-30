export  {}
//接口与类间的兼容性
interface Named {
    name: string;
}

class Person {
    name: string = '';
}

let p: Named = new Person();//接口与类中，属性与类型相同，可以赋值

//类之间的兼容性
class Animal {
    feet: number;

    constructor(name: string, numFeet: number) {
        this.feet = numFeet
    }
}

class Size {
    feet: number;

    constructor(numFeet: number) {
        this.feet = numFeet
    }
}

let a: Animal = new Animal('', 2);
let s: Size = new Size(4);

a = s;  // OK。只有实例属性(公有私有)会被比较；构造函数是静态成员，不被比较
s = a;  // OK

//对象间的兼容性
let x: { name: string };
let y: { name: string; location: string; } = {name: 'Alice', location: 'Seattle'};
x = y;//如果x要兼容y，那么y至少具有与x相同的属性

function greet(n: { name: string }) {// 检查函数参数时使用相同的规则
    console.log('Hello, ' + n.name);
}

greet(y); // OK

// 函数间的兼容性
let xx = (a: number) => 0;
let yy = (b: number, s: string) => 0;
yy = xx; // OK
xx = yy; // Error。如果xx要兼容yy，那么yy参数只能是xx的左匹配子集

//返回值间的兼容
let xxx = () => ({name: 'Alice'});
let yyy = () => ({name: 'Alice', location: 'Seattle'});

yyy = xxx; // Error。xxx返回值必须是yyy返回值的子类型；即至少包含yyy返回值的所有属性，只能多不能少
xxx = yyy; // OK


//泛型间的兼容性
interface Empty<T> {
}

let x1: Empty<number> = {};
let y1: Empty<string> = {};

x1 = y1;  // OK。因为他们的类型Empty中的实例属性相同

interface NotEmpty<T> {
    data: T;
}

let x2: NotEmpty<number> = {data: 1};
let y2: NotEmpty<string> = {data: '1'};

x2 = y2;  // Error。因为他们的类型NotEmpty中的实例属性不同


let identity = function<T>(x: T): T {
    // ...
}

let reverse = function<U>(y: U): U {
    // ...
}

identity = reverse;  // OK, 没有明确指定泛型类型时，视作any，所以(x: any) => any 等同于 (y: any) => any
