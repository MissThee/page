namespace p10Symbol{
    // Symbol
    // 通过Symbol构造函数创建的
    let sym1 = Symbol();
    let sym2 = Symbol("key"); // 可选的字符串key
    // Symbols是不可改变且唯一的。
    let sym3 = Symbol("key");
    let sym4 = Symbol("key");
    sym3 === sym4; // false, symbols是唯一的
    // 像字符串一样，symbols也可以被用做对象属性的键。
    const sym = Symbol();

    let obj = {
        [sym]: "value"
    };

    console.log(obj[sym]); // "value"  //注意必须使用const声明的Symbol才能作为索引使用
    // 与计算出的属性名声明相结合来声明对象的属性和类成员
    const getClassNameSymbol = Symbol();

    class C {
        [getClassNameSymbol](){
            return "C";
        }
    }

    let c = new C();
    let className = c[getClassNameSymbol](); // "C"

}
