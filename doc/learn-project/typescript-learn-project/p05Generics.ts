namespace p05Generics {
    //泛型--------------------------------------
    //其中T为 类型变量，用于表示类型而不是值。这个方法可以保证参数类型与返回类型相同
    function identity<T>(arg: T): T {
        // console.log(arg.length); //此处不能访问T类型的参数的length属性，因为T类型未确定
        return arg;
    }

    //相对于以下方法，使用泛型不会丢失类型信息，以下方法则无法确定类型
    // function identity(arg: any): any {
    //     return arg;
    // }
    //调用带泛型的方法
    console.log(identity<string>("myString"));//调用时可明确指定泛型类型(推荐，容易通过代码看出类型)
    console.log(identity("myString"));//也可省略泛型类型(不推荐)

    //泛型数组--------------------------------------
    function loggingIdentity<T>(arg: T[]): T[] {
        console.log(arg.length);
        return arg;
    }

    console.log(loggingIdentity<number>([1, 2, 3]))

    //定义泛型函数。只是在不带泛型的基础上增加一个泛型声明
    let myIdentity1: <T>(arg: T) => T = identity;
    //使用带有调用签名的对象字面量来定义泛型函数
    let myIdentity2: { <T>(arg: T): T } = identity;

    //类似以上，将类型写成接口，定义泛型函数
    interface GenericIdentityFn {
        <T>(arg: T): T;
    }

    let myIdentity3: GenericIdentityFn = identity;
    //泛型接口--------------------------------------
    //修改以上接口，将泛型类型的声明放在接口，以可显式指定泛型类型
    interface GenericIdentityFn1<T> {
        (arg: T): T; //注意不能在此处起始位置写<T>，否则会重新声明泛型T，之后的T不再是接口后面的T
    }

    let myIdentity4: GenericIdentityFn1<number> = identity;
    console.log(myIdentity4(1));

    //泛型类--------------------------------------
    //即在类的后面声明泛型T
    class GenericNumber<T> {
        zeroValue: T;
        add: (x: T, y: T) => T;

        constructor(zeroValue: T, add: (x: T, y: T) => T) {
            this.zeroValue = zeroValue;
            this.add = add;
        }
    }

    let myGenericNumber = new GenericNumber<number>(
        0,
        function (x, y) {
            return x + y;
        }
    );

    //在泛型约束中使用类型参数
    function getProperty<T, K extends keyof T>(obj: T, key: K) {
        return obj[key];
    }

    let x = {a: 1, b: 2, c: 3, d: 4};

    getProperty(x, "a");

    // getProperty(x, "m"); //编译时错误，第二参数只能为x中的键值

    //构造函数泛型约束--------------------------------------
    class Animal {
        name: string | undefined;

        constructor(name: string) {
            this.name = name;
        }
    }

    class Lion extends Animal {
        constructor() {
            super("tiger");
        }

        legNum: number | undefined;
    }

    function createInstance<A extends Animal>(c: new () => A): A {
        return new c();
    }

    let lion = createInstance(Lion);
    console.log(lion.name)
}
