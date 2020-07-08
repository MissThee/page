namespace p08TypeCompatibility {
    //类型兼容
    {
        //ts中，不使用继承也可使相关类型
        interface Named {
            name: string;
        }

        class Person {
            name: string = "";
        }

        let p: Named;
        p = new Person();// 不会报错，因为Person类中有Named接口中的所有属性
    }
    {
        interface Named {
            name: string;
        }

        let x: Named;
        //只要y包含name属性，则可以进行赋值
        let y = {name: 'Alice', location: 'Seattle'};
        x = y;
    }
    {
        let x = (a: number) => 0;
        let y = (b: number, s: string) => 0;
        y = x;
        // x = y; //错误，x中没有第二参数，无法赋值
    }
    {
        let x = () => ({name: 'Alice'});
        let y = () => ({name: 'Alice', location: 'Seattle'});
        x = y;
        // y = x; //错误，x的返回值中没有第二个属性
    }

    //参数用父类声明、子类传入--------------------------------------
    namespace a {
        interface Event {
            timestamp: number;
        }

        interface MouseEvent extends Event {
            x: number;
            y: number
        }

        interface KeyEvent extends Event {
            keyCode: number
        }

        function listenEvent(handler: (n: Event) => void) {
            /* ... */
        }

        //使用父类类型声明，传入子类类型。严格模式下不能使用
        // listenEvent((e: MouseEvent) => console.log(e.x + "," + e.y));
        //修改后的写法可靠
        listenEvent((e: Event) => console.log((e as MouseEvent).x + "," + (e as MouseEvent).y));
        listenEvent(((e: MouseEvent) => console.log(e.x + "," + e.y)) as (e: Event) => void);

    }
    namespace b {
        function invokeLater(args: any[], callback: (...args: any[]) => void) {
            /* ... Invoke callback with 'args' ... */
        }
        invokeLater([1, 2], (x, y) => console.log(x + ', ' + y));
        invokeLater([1, 2], (x?, y?) => console.log(x + ', ' + y));
    }
    // 枚举类型兼容--------------------------------------
    // 枚举类型与数字兼容，与其他枚举类型不兼容
    enum Status { Ready, Waiting };

    enum Color { Red, Blue, Green };

    let status = Status.Ready;
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
    let identity = function <T>(x: T): T {
        return x;
    }

    let reverse = function <U>(y: U): U {
        return y;
    }

    identity = reverse;  // OK, because (x: any) => any matches (y: any) => any
}
