// 类
class Animal {
    name: string;

    constructor(theName: string) {
        this.name = theName;
    }

    move(distanceInMeters: number = 0) {
        console.log('move');
    }
}

class Horse extends Animal {
    constructor(name: string) {
        super(name);
    }//如果不写构造函数，则默认使用父类构造函数。写构造函数必须在首行调用super()执行父类构造函数
    move(distanceInMeters = 45) {//重写父类方法
        console.log('Horse move')
        super.move(distanceInMeters);//调用父类方法
    }
}

let tom: Animal = new Horse("Tommy");
tom.move(34);

// public private protected修饰符
// public 默认修饰符
// protected 类的外部 不能访问
// private 类的外部、子类中 不能访问

// readonly修饰符
class Octopus {
    //只读属性只能在 声明时 或 构造函数里 被初始化。
    readonly name: string;
    readonly numberOfLegs: number = 8;

    constructor(theName: string) {
        this.name = theName;
    }
}

class Octopus1 {
    readonly numberOfLegs: number = 8;

    constructor(readonly name: string) {// 在参数中声明readonly
    }
}

// 存取器
class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        console.log("set fullName");
        this._fullName = newName;
    }

    //若只带有get不带有set的存取器，自动被推断为readonly
}

//静态属性
class Grid {
    static origin = {x: 0, y: 0};
    heads: []
}

let x = Grid.origin.x;//直接通过类访问静态属性

//抽象类
//不同于接口，抽象类可以包含成员的实现细节
abstract class SmallAnimal { //定义抽象类
    static weight = 100;

    abstract makeSound(): void; //在抽象类内部定义抽象方法
    move(): void {
        console.log('move...');
    }
}

class Dog extends SmallAnimal {
    makeSound() {
        console.log('bark bark bark')
    }
}

let dog: Dog = new Dog()
let dogMaker: typeof Dog = Dog;//typeof Dog是获取dog类的类型，而不是实例类型
let dog1 = new dogMaker();//与Dog使用相同



export {}
