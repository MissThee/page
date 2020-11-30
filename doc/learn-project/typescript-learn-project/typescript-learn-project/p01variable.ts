//变量声明
namespace p01variable {
//对象解构
    let obj = {
        a: "foo",
        b: 12,
        c: "bar",
        d: "test"
    };
//解构赋值
    let {a, b} = obj;
    console.log('输出a', a);
    let {c, ...passthrough} = obj;
    console.log('输出passthrough', passthrough)//{ a: 'foo', b: 12, d: 'test' }
//属性重命名
// 以下语法相当于
// let newName1 = o.a;
// let newName2 = o.b;
    let {a: newName1, b: newName2} = obj;
    console.log('输出newName1', newName1);
//解构赋值加类型
//前面的newA为属性重命名，后面的为类型指示
    let {a: newA, b: newB}: { a: string, b: number } = obj;
    console.log('输出a', a);


//函数声明
    type C = { a: string, b?: number }

    function f1({a, b}: C): void {
        // ...
    }

//指定默认值
    (function f2({a = "defaultValueA", b = 100} = {}): void {
            console.log('f2', a, b)
        }
    )();

    function f({a, b = 0} = {a: ""}): void {
        // ...
    }

    f({a: "yes"});
    f();
// f({}); //错误，{}覆盖了默认参数，导致a没有被赋值

//展开
    let first = [[100, 101], 2];
    let second = [3, 4];
    let bothPlus: any = [0, ...first, ...second, 5];
    bothPlus[1][0] = 999;
    console.log('输出first', first);
    console.log('输出second', second);
    console.log('输出bothPlus', bothPlus);
//覆盖现有属性
    let oriObj = {food: "bread", drink: "juice"};
    let newObj = {...oriObj, food: "新的值"};
    console.log('输出newObj', newObj);
// let newObj1 = {food: "noodles", ...oriObj};//报错，提示food属性总是被覆盖
//解构丢失对象内部的方法
    class Clazz {
        p = 12;

        m() {
        }
    }

    let clazz = new Clazz();
    let clone = {...clazz};
    clone.p;
// clone.m(); //解构会丢失内部的方法
}
