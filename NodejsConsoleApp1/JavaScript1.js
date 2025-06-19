// 定义扑克牌
const POKER_MAP = new Map();
// 牌的数字
const CARD_NUMBERS = [];
// 牌的花色
const CARD_SUITS = ["红桃", "方片", "梅花", "黑桃"];

// 初始化牌组
function initializeDeck() {
    // 填充数字列表 (3-10, J, Q, K, A, 2)
    for (let i = 3; i <= 15; i++) {
        CARD_NUMBERS.push(i);
    }

    // 填充扑克牌到Map中
    let cardId = 0;
    for (const number of CARD_NUMBERS) {
        for (const suit of CARD_SUITS) {
            const cardName = getCardName(number) + suit;
            POKER_MAP.set(cardId++, cardName);
        }
    }

    // 添加大小王
    POKER_MAP.set(52, "小王");
    POKER_MAP.set(53, "大王");
}

// 将数字转换为扑克牌面值
function getCardName(number) {
    if (number >= 3 && number <= 10) {
        return number.toString();
    }
    switch (number) {
        case 11: return "J";
        case 12: return "Q";
        case 13: return "K";
        case 14: return "A";
        case 15: return "2";
        default: return "";
    }
}

// 根据牌ID获取牌名列表
function getCardNames(cardIds) {
    const cardNames = [];
    for (const id of cardIds) {
        cardNames.push(POKER_MAP.get(id));
    }
    return cardNames;
}

// 对牌进行排序 (按牌的数字从小到大)
function sortCards(cards) {
    cards.sort((id1, id2) => {
        // 大王最大
        if (id1 === 53) return 1;
        if (id2 === 53) return -1;
        // 小王第二大
        if (id1 === 52) return 1;
        if (id2 === 52) return -1;

        // 其他牌按数字排序
        let num1 = Math.floor(id1 / 4) + 3; // 计算牌的数字
        let num2 = Math.floor(id2 / 4) + 3;

        // 2最大，A第二，K第三...3最小
        if (num1 === 15) num1 = 18; // 2
        else if (num1 === 14) num1 = 17; // A
        else if (num1 === 13) num1 = 16; // K
        else if (num1 === 12) num1 = 15; // Q
        else if (num1 === 11) num1 = 14; // J
        else if (num1 === 10) num1 = 13;
        else if (num1 === 9) num1 = 12;
        else if (num1 === 8) num1 = 11;
        else if (num1 === 7) num1 = 10;
        else if (num1 === 6) num1 = 9;
        else if (num1 === 5) num1 = 8;
        else if (num1 === 4) num1 = 7;
        else if (num1 === 3) num1 = 6;

        if (num2 === 15) num2 = 18;
        else if (num2 === 14) num2 = 17;
        else if (num2 === 13) num2 = 16;
        else if (num2 === 12) num2 = 15;
        else if (num2 === 11) num2 = 14;
        else if (num2 === 10) num2 = 13;
        else if (num2 === 9) num2 = 12;
        else if (num2 === 8) num2 = 11;
        else if (num2 === 7) num2 = 10;
        else if (num2 === 6) num2 = 9;
        else if (num2 === 5) num2 = 8;
        else if (num2 === 4) num2 = 7;
        else if (num2 === 3) num2 = 6;

        return num1 - num2;
    });
}

// 主函数
function main() {
    // 初始化牌组
    initializeDeck();

    // 1. 洗牌
    const cardIds = Array.from(POKER_MAP.keys());
    for (let i = cardIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardIds[i], cardIds[j]] = [cardIds[j], cardIds[i]];
    }

    // 2. 创建玩家和底牌
    const player1 = [];
    const player2 = [];
    const player3 = [];
    const hiddenCards = [];

    // 3. 发牌 (17张牌给每个玩家，3张底牌)
    for (let i = 0; i < cardIds.length; i++) {
        const cardId = cardIds[i];
        if (i < 51) { // 前51张牌发给玩家
            if (i % 3 === 0) {
                player1.push(cardId);
            } else if (i % 3 === 1) {
                player2.push(cardId);
            } else {
                player3.push(cardId);
            }
        } else { // 最后3张作为底牌
            hiddenCards.push(cardId);
        }
    }

    // 4. 对玩家手牌进行排序
    sortCards(player1);
    sortCards(player2);
    sortCards(player3);
    sortCards(hiddenCards);

    // 5. 显示结果
    console.log("玩家1的手牌:", getCardNames(player1));
    console.log("玩家2的手牌:", getCardNames(player2));
    console.log("玩家3的手牌:", getCardNames(player3));
    console.log("底牌:", getCardNames(hiddenCards));
}

// 执行主函数
main();
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('按回车键退出...', () => {
    rl.close();
});