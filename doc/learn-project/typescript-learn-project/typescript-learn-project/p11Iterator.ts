namespace p11Iterator {
    let setObj = new Set(["Cat", "Dog", "Hamster"]);
    console.log('setObj', setObj, setObj.keys(), setObj.values());
    for (let item in setObj) {
        console.log('set', item);
    }

    let mapObj = new Map<any, any>();
    mapObj.set("a", "AA");
    mapObj.set("b", "BB");
    console.log('mapObj', mapObj, mapObj.keys(), mapObj.values());
    for (let item in mapObj) {
        console.log('map', item);
    }

    let arrayObj = ['a', 'b', 'c'];
    for (let item in arrayObj) {
        console.log('array', item);
    }
    for (let item of arrayObj) {//只有array类型可使用for...of
        console.log('array', item);
    }
}
