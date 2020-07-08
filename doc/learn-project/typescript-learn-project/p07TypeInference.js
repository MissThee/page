"use strict";
var p07TypeInference;
(function (p07TypeInference) {
    //类型推论
    //当没有单个类型可以作为合适类型时，类型推断的结果为联合数组类型(number | null)[]
    var x = [0, 1, null];
    function a(p) {
        console.log(p);
    }
    a(x);
})(p07TypeInference || (p07TypeInference = {}));
