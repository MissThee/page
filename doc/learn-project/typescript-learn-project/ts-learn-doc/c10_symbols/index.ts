export {}

let sym = Symbol();

//Symbols是不可改变且唯一的
let sym2 = Symbol("key"); // 可选的字符串key
let sym3 = Symbol("key");
sym2 === sym3 //false

// symbols也可以被用做对象属性的键
const symKey = Symbol();

let obj = {
    [symKey]: "value"
};

obj[symKey]; // "value"。当symbol为key时，声明Symbol必须使用const

// Symbols用做类中的方法名
const symName = Symbol();

class C {
    [symName]() {
        return "C";
    }
}

let c = new C();
c[symName](); // "C"


// 还有一些已经众所周知的内置symbols。 内置symbols用来表示语言内部的行为。

// 以下为这些symbols的列表：

// Symbol.hasInstance
// 方法，会被instanceof运算符调用。构造器对象用来识别一个对象是否是其实例。
//对象的Symbol.hasInstance属性，指向一个内部方法。当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。比如，foo instanceof Foo在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)
class MyClass {
    [Symbol.hasInstance](foo) {
        return foo instanceof Array;
    }
}

let myClass = new MyClass();
[1, 2, 3] instanceof myClass// true。[1,2,3]即为传入参数foo

// Symbol.isConcatSpreadable
// 布尔值，表示当在一个对象上调用Array.prototype.concat时，这个对象的数组元素是否可展开。

// Symbol.iterator
// 方法，被for-of语句调用。返回对象的默认迭代器。

// Symbol.match
// 方法，被String.prototype.match调用。正则表达式用来匹配字符串。

// Symbol.replace
// 方法，被String.prototype.replace调用。正则表达式用来替换字符串中匹配的子串。

// Symbol.search
// 方法，被String.prototype.search调用。正则表达式返回被匹配部分在字符串中的索引。

// Symbol.species
// 函数值，为一个构造函数。用来创建派生对象。

// Symbol.split
// 方法，被String.prototype.split调用。正则表达式来用分割字符串。

// Symbol.toPrimitive
// 方法，被ToPrimitive抽象操作调用。把对象转换为相应的原始值。

// Symbol.toStringTag
// 方法，被内置方法Object.prototype.toString调用。返回创建对象时默认的字符串描述。

// Symbol.unscopables
// 对象，它自己拥有的属性会被with作用域排除在外。
