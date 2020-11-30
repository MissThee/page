namespace p04function {
    //函数
    //函数类型
    let myAdd: (value1: number, value2: number) => number =
        function (x: number, y: number): number {
            return x + y;
        };
    /*
        (value1: number, value2: number) => number
                 参数类型        参数类型     返回值类型
    */

    //可选参数
    //可选参数必须放在必填参数的后面
    function buildName(firstName: string, lastName?: string) {
        if (lastName)
            return firstName + " " + lastName;
        else
            return firstName;
    }

    let result1 = buildName("Bob");  // works correctly now
    let result2 = buildName("Bob", "Adams");  // ah, just right

    //默认参数
    //默认参数可以放在前面，但调用需要传入undefined站位
    function buildName1(firstName = "Will", lastName: string) {
        return firstName + " " + lastName;
    }

    let result3 = buildName1("Bob", "Adams");         // okay and returns "Bob Adams"
    let result4 = buildName1(undefined, "Adams");     // okay and returns "Will Adams"

    //剩余参数
    //可将多个参数收集到一个变量中
    function buildName2(firstName: string, ...restOfName: string[]) {
        console.log(restOfName);
        console.log(arguments);
        return firstName + " " + restOfName.join(" ");
    }

    let employeeName = buildName2("Joseph", "Samuel", "Lucas", "MacKinzie");
    let buildNameFun: (value1: string, ...value2: string[]) => string = buildName2;

    {
        //this的指向
        let deck = {
            suits: ["hearts", "spades", "clubs", "diamonds"],
            cards: Array(52),
            createCardPicker() {
                // return function() {//返回function()会使此函数中this指向window（严格模式下为undefined）
                return () => {
                    let pickedCard = Math.floor(Math.random() * 52);
                    let pickedSuit = Math.floor(pickedCard / 13);

                    return {suit: this.suits[pickedSuit], card: pickedCard % 13};
                }
            }
        };

        let cardPicker = deck.createCardPicker();
        let pickedCard = cardPicker();

        console.log("card: " + pickedCard.card + " of " + pickedCard.suit);
    }
    {
        interface Card {
            suit: string;
            card: number;
        }

        interface Deck {
            suits: string[];
            cards: number[];

            createCardPicker(this: Deck): () => Card;
        }

        //指定this的类型
        let deck: Deck = {
            suits: ["hearts", "spades", "clubs", "diamonds"],
            cards: Array(52),
            createCardPicker(this: Deck) {
                // return function() {//返回function()会使此函数中this指向window（严格模式下为undefined）
                return () => {
                    let pickedCard = Math.floor(Math.random() * 52);
                    let pickedSuit = Math.floor(pickedCard / 13);

                    return {suit: this.suits[pickedSuit], card: pickedCard % 13};
                }
            }
        };

        let cardPicker = deck.createCardPicker();
        let pickedCard = cardPicker();

        console.log("card: " + pickedCard.card + " of " + pickedCard.suit);
    }

    //重载
    function func1(x: { value1: number; value2: number; }): number;
    function func1(x: number): { re1: string; re2: number; };
    function func1(x: any): any {//注意这一条不算重载方法，不参与匹配
        if (typeof x == "object") {
            return x.value1 + x.value2;
        } else if (typeof x == "number") {
            return {str: x.toString(), num: x};
        }
    }

    console.log(func1(1));
    console.log(func1({value1: 1, value2: 2}));
    // console.log(func1("z"));//错误，无符合此函数的重载方法

}
