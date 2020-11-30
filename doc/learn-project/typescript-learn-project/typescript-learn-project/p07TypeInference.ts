namespace p07TypeInference {
    //类型推论
    //当没有单个类型可以作为合适类型时，类型推断的结果为联合数组类型(number | null)[]
    let x = [0, 1, null];

    function a(p: (number | null)[]) {
        console.log(p);
    }

    a(x)
}
