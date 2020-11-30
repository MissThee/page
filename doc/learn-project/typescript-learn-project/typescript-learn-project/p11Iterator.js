"use strict";
var p11Iterator;
(function (p11Iterator) {
    var setObj = new Set(["Cat", "Dog", "Hamster"]);
    console.log('setObj', setObj, setObj.keys(), setObj.values());
    for (var item in setObj) {
        console.log('set', item);
    }
    var mapObj = new Map();
    mapObj.set("a", "AA");
    mapObj.set("b", "BB");
    console.log('mapObj', mapObj, mapObj.keys(), mapObj.values());
    for (var item in mapObj) {
        console.log('map', item);
    }
    var arrayObj = ['a', 'b', 'c'];
    for (var item in arrayObj) {
        console.log('array', item);
    }
    for (var _i = 0, arrayObj_1 = arrayObj; _i < arrayObj_1.length; _i++) { //只有array类型可使用for...of
        var item = arrayObj_1[_i];
        console.log('array', item);
    }
})(p11Iterator || (p11Iterator = {}));
