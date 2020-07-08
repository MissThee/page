namespace p09AdvancedTypes {
    //高级类型
    //交叉类型--------------------------------------
    //使用&符号链接，其结果包含所有类型的特性
    function extend<T, U>(first: T, second: U): T & U & Object {
        let result = <T & U & Object>{};
        for (let id in first) {
            (<any>result)[id] = (<any>first)[id];
        }
        for (let id in second) {
            if (!result.hasOwnProperty(id)) {
                (<any>result)[id] = (<any>second)[id];
            }
        }
        return result;
    }

    class Person {
        constructor(public name: string) {
        }
    }

    interface Loggable {
        log(): void;
    }

    class ConsoleLogger implements Loggable {
        log() {
            // ...
        }
    }

    let jim = extend(new Person("Jim"), new ConsoleLogger());
    jim.name;
    jim.log();

    // 联合类型--------------------------------------
    //使用|符号链接，可传入其中一种类型
    function padLeft(value: string, padding: string | number) {
        // ...
    }

    padLeft("Hello world", 1);

    //联合类型如果是类，则只能访问此联合类型中共有成员。（类与基础类型的成员不能访问任何类的属性）
    interface Bird {
        fly(): void;

        layEggs(): void;
    }

    interface Fish {
        swim(): void;

        layEggs(): void;
    }

    function getSmallPet(): Fish | Bird {
        return <Fish | Bird>{};
    }

    let pet = getSmallPet();
    pet.layEggs;
    // pet.swim;    // 错误，不能访问非共有的成员

    //类保护机制--------------------------------------
    //声明一个返回值是 类型谓词 的函数，确定参数类型
    function isFish(pet: Fish | Bird): pet is Fish {
        return (<Fish>pet).swim !== undefined;
    }

    if (isFish(pet)) {//调用此函数后，可确定参数在此之后的类型
        pet.swim;
    } else {
        pet.fly;
    }

    //typeof类型保护--------------------------------------
    //使用typeof确定类型
    //只有两种形式能被识别：typeof v === "typename" 、typeof v !== "typename"，
    //"typename"必须是 "number"， "string"， "boolean"或 "symbol"，为其他值时不会被判定为“类型保护”
    function padLeft1(value: string, padding: string | number) {
        if (typeof padding === "number") {
            return Array(padding + 1).join(" ") + value;
        } else {
            return padding + value;
        }
    }

    // instanceof 类型保护--------------------------------------
    //使用instanceof确定类型
    interface Padder {
        getPaddingString(): string
    }

    class SpaceRepeatingPadder implements Padder {
        constructor(private numSpaces: number) {
        }

        getPaddingString() {
            return Array(this.numSpaces + 1).join(" ");
        }
    }

    class StringPadder implements Padder {
        constructor(private value: string) {
        }

        getPaddingString() {
            return this.value;
        }
    }

    function getRandomPadder(): SpaceRepeatingPadder | StringPadder {
        return Math.random() < 0.5 ?
            new SpaceRepeatingPadder(4) :
            new StringPadder("  ");
    }

    // 类型为SpaceRepeatingPadder | StringPadder
    let padder: Padder = getRandomPadder();

    if (padder instanceof SpaceRepeatingPadder) {
        padder; // 类型细化为'SpaceRepeatingPadder'
    }
    if (padder instanceof StringPadder) {
        padder; // 类型细化为'StringPadder'
    }

    //可以为null的类型--------------------------------------
    //非严格模式下，类型检查器认为 null与 undefined可以赋值给任何类型。
    //严格模式下，会把 null和 undefined区别对待。 如：string|null， string|undefined 和 string|undefined|null 是不同的类型

    // 可选参数和可选属性--------------------------------------
    // 可选参数会被自动地加上 | undefined
    function f(x: number, y?: number) {
        return x + (y || 0);
    }

    f(1, 2);
    f(1);
    f(1, undefined);

    // f(1, null); //错误，可传入类型为 number|undefined

    class C {
        a: number = 0;
        b?: number;
    }

    let c = new C();
    c.a = 12;
    // c.a = undefined; //错误，不能为undefined
    c.b = 13;
    c.b = undefined;
    // c.b = null; // 错误，不能为null

    // 类型保护和类型断言--------------------------------------
    function f1(sn: string | null): string {
        if (sn == null) {
            return "default";
        } else {//可判断出此处类型为string
            return sn;
        }
    }

    function f2(sn: string | null): string {
        return sn || "default";//使用短路运算符使其返回string
    }

    // function broken(name: string | null): string {
    //     function postfix(epithet: string) {
    //         return name.charAt(0) + '.  the ' + epithet; // 错误，name可能为null
    //     }
    //     name = name || "Bob";
    //     return postfix("great");
    // }

    function fixed(name: string | null | undefined): string {
        function postfix(epithet: string) {
            // 使用!后缀，去除null\undefined类型，使编译通过，实际执行时如果为null或unde则或报错
            return name!.charAt(0) + '.  the ' + epithet;
        }

        name = name || "Bob";
        return postfix("great");
    }

    console.log("AAA", fixed("AAA"));
    console.log("null", fixed(null));

    //类型别名--------------------------------------
    //起别名不会新建一个类型 - 它创建了一个新 名字来引用那个类型
    type Name = string;
    type NameResolver = () => string;
    type NameOrResolver = Name | NameResolver;

    function getName(n: NameOrResolver): Name {
        if (typeof n === 'string') {
            return n;
        } else {
            return n();
        }
    }

    //类型别名也可以是泛型
    type Container<T> = { value: T };
    //可以使用类型别名来在属性里引用自己
    type Tree<T> = {
        value: T;
        left: Tree<T>;
        right: Tree<T>;
    }
    //与交叉类型一起使用
    type LinkedList<T> = T & { next: LinkedList<T> };

    interface Person1 {
        name: string;
    }

    var people: LinkedList<Person1> = {name: "Tom", next: <LinkedList<Person1>>{name: "Jam"}};
    var s = people.name;
    var s = people.next.name;

    // 类型别名不能出现在声明右侧的任何地方
    // type Yikes = Array<Yikes>; // 错误

    type Alias = { num: number }

    interface Interface {
        num: number;
    }

    declare function aliased(arg: Alias): Alias;//返回类型字面量类型
    declare function interfaced(arg: Interface): Interface;//返回类型Interface

    //字符串字面量类型--------------------------------------
    //字符串字面量类型允许你指定字符串必须的固定值
    type Easing = "ease-in" | "ease-out" | "ease-in-out";

    class UIElement {
        animate(dx: number, dy: number, easing: Easing) {
        }
    }

    let button = new UIElement();
    button.animate(0, 0, "ease-in");

    // button.animate(0, 0, "uneasy"); //错误，只能为"ease-in" | "ease-out" | "ease-in-out"
    //字面量类型可用于函数重载
    function func1(param: "a"): void ;
    function func1(param: 1): void ;
    function func1(param: any) {

    }

    func1(1);
    // func1(0);//错误

    // 可辨识联合--------------------------------------
    // 使用某字段区分各个类型
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

    //每个接口都有 kind属性但有不同的字符串字面量类型。 kind属性称做 可辨识的特征或 标签。
    type Shape = Square | Rectangle | Circle;

    function assertNever(x: never): never {
        throw new Error("Unexpected object: " + x);
    }

    function area(s: Shape) {
        //使用可辨识联合
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

    //多态的 this类型--------------------------------------
    //多态的 this类型表示的是某个包含类或接口的 子类型
    class BasicCalculator {
        public constructor(protected value: number = 0) {
        }

        public currentValue(): number {
            return this.value;
        }

        public add(operand: number): this {//此处的this类型返回，让此方法返回子类型。但实测不加也会返回子类型
            this.value += operand;
            return this;
        }

        public multiply(operand: number): this {
            this.value *= operand;
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

    let v = new ScientificCalculator(2)
        .multiply(5)
        .sin()
        .add(1)
        .currentValue();
    console.log("Value", v);

    // 索引类型（Index types）--------------------------------------
    //使用索引类型，编译器就能够检查使用了动态属性名的代码
    function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
        //其中返回类型T[K][]，T[K]对应o[name]，之后的[]表名返回对象为集合
        return names.map(name => o[name]);
    }

    interface Person {
        name: string;
        age: number;
    }

    let person: Person = {
        name: 'Jarid',
        age: 35
    };
    let strings: string[] = pluck(person, ['name']); //编译器会检查 name是否是 Person的一个属性

    //keyof T 索引类型查询操作符-----------------------------------
    // 对于任何类型 T， keyof T的结果为 T上已知的公共属性名的联合
    interface TestInterface {
        param1: string;
        param2: string;
    }

    let testProps: keyof TestInterface; // 'param1' | 'param2'
    // testProps 完全可与'param1' | 'param2'互换

    //映射类型-----------------------------------
    //从旧类型中创建新类型的一种方式
    type Readonly<T> = {
        readonly [P in keyof T]: T[P];
    }
    type Partial<T> = {
        [P in keyof T]?: T[P];
    }

    interface BaseInterface {//原始类型
        key: string;
        value: string;
    }

    type ReadonlyInterface = Readonly<BaseInterface>;//创建一个属性全为readonly的新类型
    type PartialInterface = Partial<BaseInterface>;//创建一个属性全为可选的新类型

    //类型映射举例
    type Keys = 'option1' | 'option2';
    type Flags = { [K in Keys]: boolean };//等同于以下类型
    type Flags1 = {
        option1: boolean;
        option2: boolean;
    }
    //包装类型
    //原属性tp.name，在代理对象中访问方式为tp.name.get()、tp.name.set(xxx)
    type Proxy<T> = {
        get(): T;
        set(value: T): void;
    }
    type Proxify<T> = {
        [P in keyof T]: Proxy<T[P]>;
    }

    function proxify<T>(o: T): Proxify<T> {
        let neoObj = <Proxify<T>>{};
        for (let key in o) {
            neoObj[key] = {
                get: () => o[key],
                set: (value) => {
                    o[key] = value
                }
            };
        }
        return neoObj;
    }

    class TestPerson {
        name: string = "aTestPerson";
    }

    let tp = new TestPerson();
    let proxytp = proxify(tp);
    console.log(proxytp.name.get());
    console.log(proxytp.name.set("zxc"));
    console.log(proxytp);

    function unproxify<T>(t: Proxify<T>): T {
        let result = {} as T;
        for (const k in t) {
            result[k] = t[k].get();
        }
        return result;
    }

    let originalProps = unproxify(proxytp);
    console.log(originalProps.name);
}
