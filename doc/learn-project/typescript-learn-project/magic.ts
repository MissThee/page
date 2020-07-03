namespace magic {
    interface Shape {
        color: string;
    }

    interface Square extends Shape {
        sideLength: number;
    }

    let square = <Square>{};//<Square>强制类型转换
    square.color = "blue";
    square.sideLength = 10;

// ------------------------------------------------
    interface ClockConstructor {
        new(hour: number, minute: number): any;//class的构造函数声明
    }

    class Clock {
        hour: number;
        minutes: number;

        constructor(h: number, m: number) {
            this.hour = h;
            this.minutes = m;
        }
    }

    let clock: ClockConstructor = Clock;
    let clockObj = new clock(1, 2);

// ------------------------------------------------
    interface StringArray {
        [x: number]: string;//数组类型的索引类型:值类型。其中变量名x可为任意名称
    }

// ------------------------------------------------
    interface User {
        name: string;
        age: number;
    }

    type ParamType<T> = T extends (param: infer P) => any ? P : T;
    type Param = ParamType<Func>;   // Param = User
    type AA = ParamType<string>;    // string
    type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
    type Func = () => User;
    type Test = ReturnType<Func>;   // Test = User
    /*
    ParamType：
        T extends (param: infer P) => any ? P : T;
                  (user : User   ) => void
        与传入的函数对象对应，infer P是声明P为User类型
    ReturnType：
        T extends (...args: any[]) => infer P ? P : any;
                  (              ) => User
        与传入的函数对象对应，infer P是声明P为User类型
     */
// ------------------------------------------------

    const obj = {
        foo: 1,
        bar: 'baz'
    };

    console.log(typeof obj)
    type Keys = {
        [key in keyof typeof obj]: boolean;
    }

    const obj2: Keys = {
        foo: false,
        bar: false
    };
// ------------------------------------------------
    const a = {
        a: 1,
        b: 2,
    };

    // keyof typeof a; // 'a' | 'b'

    class A {
        c: number = 1;
        d: number = 1;
    }

    // keyof A; // 'c' | 'd'
    // ------------------------------------------------
    //一个错误用法，在类的构造函数中，修改类中的对象属性。因为此时还没有生成对象，其中的对象属性myArray还未初始化，为undefined
    class Base {
        constructor() {
            this.onCreate();
        }

        onCreate() {
        }
    }

    class Sub extends Base {

        private myArray: number[] = [];

        onCreate() {
            this.myArray.push(2);
        }
    }

    var s = new Sub();

}
