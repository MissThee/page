let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]

let [, second, , fourth] = [1, 2, 3, 4];
console.log(second); // outputs 1
console.log(fourth); // outputs 4

let o = {
    a: "foo",
    b: 12,
    c: "bar",
    d: 13,
};
let {a, b} = o;
let {a: newName1, b: newName2} = o;//解构赋值时重命名
let {c, d}: { c: string, d: number } = o;//解构赋值时指定类型

// 默认值
function keepWholeObject(wholeObject: { a: string, b?: number }) {
    //当b为undefined时，使用缺省值
    let {a, b = 1001} = wholeObject;
}

// 函数声明
type C = { a: string, b?: number }

function f({a, b}: C): void {
}

// 函数声明，参数有默认值。注意多层默认值嵌套会让代码难以理解，尽量少使用
function fd({a, b = 0} = {a: ""}): void {
}

fd({a: "yes"}); // ok, default b = 0
fd(); // ok, default to {a: ""}, which then defaults b = 0
// fd({}); // error, 'a' is required if you supply an argument

// 对象展开
let defaults = {
    food: "apple",
    price: 123,
    ambiance: "noisy",
    sell() {
        alert('买苹果咯')
    }
};
let newObj = {
    food: "banana",
    ...defaults
};
console.log(newObj); // newObj中 food会被覆盖为apple，其中不可枚举的元素sell()方法会丢失

export {}
