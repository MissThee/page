"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//函数声明参数类型、返回值类型
//其中修改参数名称仅仅是提高可读性，没有实际作用
var myAdd = function (x, y) {
    return x + y;
};
//可选参数
function buildName(firstName, lastName) {
}
function buildName1(firstName, lastName) {
    if (lastName === void 0) { lastName = "Smith"; }
}
function buildName2(lastName, firstName) {
    if (lastName === void 0) { lastName = "Smith"; }
}
//剩余参数
//将过多的参数收集到变量里
function buildNames(firstName) {
    var restOfName = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        restOfName[_i - 1] = arguments[_i];
    }
    return firstName + " " + restOfName.join(" ");
}
var employeeName = buildNames("Joseph", "Samuel", "Lucas", "MacKinzie");
var deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function () {
        var _this = this;
        return function () {
            var pickedCard = Math.floor(Math.random() * 52);
            var pickedSuit = Math.floor(pickedCard / 13);
            return { suit: _this.suits[pickedSuit], card: pickedCard % 13 };
        };
    }
};
var cardPicker = deck.createCardPicker();
var pickedCard = cardPicker();
var Button = /** @class */ (function () {
    function Button() {
    }
    Button.prototype.addClickListener = function (onclick) {
    };
    return Button;
}());
var Handler = /** @class */ (function () {
    function Handler() {
    }
    Handler.prototype.onClickBad = function (e) {
    };
    return Handler;
}());
var h = new Handler();
var button = new Button();
button.addClickListener(h.onClickBad); // error!
