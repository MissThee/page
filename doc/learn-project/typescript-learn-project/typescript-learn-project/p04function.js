"use strict";
var p04function;
(function (p04function) {
    //函数
    //函数类型
    var myAdd = function (x, y) {
        return x + y;
    };
    /*
        (value1: number, value2: number) => number
                 参数类型        参数类型     返回值类型
    */
    //可选参数
    //可选参数必须放在必填参数的后面
    function buildName(firstName, lastName) {
        if (lastName)
            return firstName + " " + lastName;
        else
            return firstName;
    }
    var result1 = buildName("Bob"); // works correctly now
    var result2 = buildName("Bob", "Adams"); // ah, just right
    //默认参数
    //默认参数可以放在前面，但调用需要传入undefined站位
    function buildName1(firstName, lastName) {
        if (firstName === void 0) { firstName = "Will"; }
        return firstName + " " + lastName;
    }
    var result3 = buildName1("Bob", "Adams"); // okay and returns "Bob Adams"
    var result4 = buildName1(undefined, "Adams"); // okay and returns "Will Adams"
    //剩余参数
    //可将多个参数收集到一个变量中
    function buildName2(firstName) {
        var restOfName = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            restOfName[_i - 1] = arguments[_i];
        }
        console.log(restOfName);
        console.log(arguments);
        return firstName + " " + restOfName.join(" ");
    }
    var employeeName = buildName2("Joseph", "Samuel", "Lucas", "MacKinzie");
    var buildNameFun = buildName2;
    {
        //this的指向
        var deck = {
            suits: ["hearts", "spades", "clubs", "diamonds"],
            cards: Array(52),
            createCardPicker: function () {
                var _this = this;
                // return function() {//返回function()会使此函数中this指向window（严格模式下为undefined）
                return function () {
                    var pickedCard = Math.floor(Math.random() * 52);
                    var pickedSuit = Math.floor(pickedCard / 13);
                    return { suit: _this.suits[pickedSuit], card: pickedCard % 13 };
                };
            }
        };
        var cardPicker = deck.createCardPicker();
        var pickedCard = cardPicker();
        console.log("card: " + pickedCard.card + " of " + pickedCard.suit);
    }
    {
        //指定this的类型
        var deck = {
            suits: ["hearts", "spades", "clubs", "diamonds"],
            cards: Array(52),
            createCardPicker: function () {
                var _this = this;
                // return function() {//返回function()会使此函数中this指向window（严格模式下为undefined）
                return function () {
                    var pickedCard = Math.floor(Math.random() * 52);
                    var pickedSuit = Math.floor(pickedCard / 13);
                    return { suit: _this.suits[pickedSuit], card: pickedCard % 13 };
                };
            }
        };
        var cardPicker = deck.createCardPicker();
        var pickedCard = cardPicker();
        console.log("card: " + pickedCard.card + " of " + pickedCard.suit);
    }
    function func1(x) {
        if (typeof x == "object") {
            return x.value1 + x.value2;
        }
        else if (typeof x == "number") {
            return { str: x.toString(), num: x };
        }
    }
    console.log(func1(1));
    console.log(func1({ value1: 1, value2: 2 }));
    // console.log(func1("z"));//错误，无符合此函数的重载方法
})(p04function || (p04function = {}));
