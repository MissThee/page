namespace magic {
    interface Shape {
        color: string;
    }

    interface Square extends Shape {
        sideLength: number;
    }

    let square = <Square>{};//断言，确定变量类型为指定类型
    square.color = "blue";
    square.sideLength = 10;

// ------------------------------------------------
    interface ClockConstructor {
        new(hour: number, minute: number): ClockInterface;//class的构造函数声明
    }
    interface ClockInterface {
        tick();
    }
    class Clock implements ClockInterface{ //此处不能直接继承ClockConstructor。因为Clock的构造函数在class的静态部分，继承ClockConstructor检查不到对象中有此属性，报错
        hour: number;
        minutes: number;
        tick() {
            console.log("tick tock");
        }
        constructor(h: number, m: number) {
            this.hour = h;
            this.minutes = m;
        }
    }
    function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
        return new ctor(hour, minute);
    }
    let clockObj = createClock(Clock,1, 2);

// ------------------------------------------------
    interface StringArray {
        [x: number]: string;//[数组类型的索引类型:值类型]。其中变量名x可为任意名称
    }

// ------------------------------------------------
    class User {
        name: string='';
        age: number=0;
    }
    function test(user :User):User{ return new User()}

    type ParamType<T> = T extends (param: infer P) => any ? P : T;//获取类型的参数类型
    type t1 = ParamType<typeof test>;   // Param = User
    type t2 = ParamType<string>;        // string

    type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;//获取类型的返回类型
    type r1 = ReturnType<typeof test>;   // Test = User
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
