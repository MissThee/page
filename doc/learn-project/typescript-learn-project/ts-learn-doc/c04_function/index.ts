export {}

//函数声明参数类型、返回值类型
//其中修改参数名称仅仅是提高可读性，没有实际作用
let myAdd: (baseValue: number, increment: number) => number =
    function (x: number, y: number): number {
        return x + y;
    };

//可选参数
function buildName(firstName: string, lastName?: string) {//加?，可选参数，必须放在所有参数最后
}

function buildName1(firstName: string, lastName = "Smith") {//默认值，可选参数
}

function buildName2(lastName = "Smith", firstName: string) {//默认值，可放前面，但调用时需要使用undefined占位
}

//剩余参数
//将过多的参数收集到变量里
function buildNames(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}

let employeeName = buildNames("Joseph", "Samuel", "Lucas", "MacKinzie");

// this参数
interface Card {
    suit: string;
    card: number;
}

interface Deck {
    suits: string[];
    cards: number[];

    createCardPicker(this: Deck): () => Card;
}

let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function (this: Deck) {//this参数是个假的参数，它出现在参数列表的最前面。只有使用function声明的时候会捕获假参数，箭头函数不会
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

//this参数在回调函数里
interface UIElement {
    addClickListener(onclick: (this: void, e: Event) => void): void;
}
class Button implements UIElement{
    addClickListener(onclick: (this: void, e: Event) => void): void {
    }
}
class Handler {
    onClickBad(this: void, e: Event) {
    }
}
let h = new Handler();
let button=new Button()
button.addClickListener(h.onClickBad); // error!
