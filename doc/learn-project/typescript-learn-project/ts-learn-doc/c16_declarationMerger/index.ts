export {}
// 目前合并仅支持：
// 命名空间 与 命名空间
// 命名空间 与 类
// 命名空间 与 函数
// 命名空间 与 枚举类型
// 接口    与 接口
// 注：类不能与其他类合并

// 合并接口
interface Box {
    height: number;
    width: number;
}

interface Box {
    scale: number;
}

let box: Box = {height: 5, width: 6, scale: 10};


// 注意每组接口里的声明顺序保持不变，但各组接口之间的顺序是后来的接口重载出现在靠前位置。
interface Cloner {
    clone(animal: Animal): Animal;
}

interface Cloner {
    clone(animal: Sheep): Sheep;
}

interface Cloner {
    clone(animal: Dog): Dog;

    clone(animal: Cat): Cat;
}

interface Cloner {//以上等同于
    clone(animal: Dog): Dog;

    clone(animal: Cat): Cat;

    clone(animal: Sheep): Sheep;

    clone(animal: Animal): Animal;
}

// 如果签名里有一个参数的类型是 单一的字符串字面量（比如，不是字符串字面量的联合类型）那么它将会被提升到重载列表的最顶端。
interface Document {
    createElement(tagName: any): Element;
}

interface Document {
    createElement(tagName: "div"): HTMLDivElement;

    createElement(tagName: "span"): HTMLSpanElement;
}

interface Document {
    createElement(tagName: string): HTMLElement;

    createElement(tagName: "canvas"): HTMLCanvasElement;
}

interface Document {//以上等同于
    createElement(tagName: "canvas"): HTMLCanvasElement;

    createElement(tagName: "div"): HTMLDivElement;

    createElement(tagName: "span"): HTMLSpanElement;

    createElement(tagName: string): HTMLElement;

    createElement(tagName: any): Element;
}

// 合并命名空间
namespace Animals {
    export class Zebra {
    }
}

namespace Animals {
    export interface Legged {
        numberOfLegs: number;
    }

    export class Dog {
    }
}

namespace Animals {//以上等同于
    export interface Legged {
        numberOfLegs: number;
    }

    export class Zebra {
    }

    export class Dog {
    }
}

// 非导出成员仅在其原有的（合并前的）命名空间内可见。这就是说合并之后，从其它命名空间合并进来的成员无法访问非导出成员
namespace TestInnerProp {
    let haveMuscles = true;

    export function ok() {
        return haveMuscles;
    }
}

namespace TestInnerProp {
    export function notOk() {
        return haveMuscles;  // Error。无法访问，因为haveMuscles没有导出
    }
}

//目前，类不能与其它类或变量合并
