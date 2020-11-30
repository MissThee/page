export {}

//泛型
function identity<T>(arg: T): T {
    return arg;
}

identity<string>("myString");  //显示声明参数类型
identity("myString")   //类型推断

//泛型数组
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}

function loggingIdentity1<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}

//使用带有调用签名的对象字面量来定义泛型函数：
function identityFunc<T>(arg: T): T {
    return arg;
}

let myIdentity: { <T>(arg: T): T } = identityFunc;

//泛型接口
interface GenericIdentityFn123 {
    <T>(arg: T): T;
}

function identity123<T>(arg: T): T {
    return arg;
}

let myIdentity123: GenericIdentityFn123 = identity123;

//泛型接口，泛型类型该改为接口参数
interface GenericIdentityFn456<T> {
    (arg: T): T;
}

function identity456<T>(arg: T): T {
    return arg;
}

let myIdentity456: GenericIdentityFn456<number> = identity456;

//泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;

    constructor(zeroValue: T, add: ((x: T, y: T) => T)) {
        this.zeroValue = zeroValue
        this.add = add;
    }
}

let myGenericNumber = new GenericNumber<number>(
    0,
    function (x, y) {
        return 0
    }
);

//泛型约束
interface Lengthwise {
    length: number;
}

function logging<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  //传入的参数由.length属性
    return arg;
}

logging({length: 10, value: 3});//传入的参数必须符合参数约束

// 在泛型里使用类类型
function create<T>(c: { new(): T }): T {
    return new c();
}

// 使用原型属性推断并约束构造函数与类实例的关系
class BeeKeeper {
    beetag: boolean = false;
}

class ZooKeeper {
    zootag: string = 'zoo';
}

class Animal {
    numLegs: number = 4;
}

class Bee extends Animal {
    keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
    keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.zootag;
createInstance(Bee).keeper.beetag;
