// 修改花色定义，使用更通用的符号
const CARD_SUITS = ["?", "?", "?", "?"]; // 黑桃、红心、方块、梅花

// 优化getCardName函数，确保10显示正确
function getCardName(number) {
    if (number >= 3 && number <= 10) {
        return number === 10 ? "10" : number.toString();
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

// 优化排序函数，添加花色排序
function sortCards(cards) {
    const suitOrder = { "?": 4, "?": 3, "?": 2, "?": 1 };

    cards.sort((id1, id2) => {
        // 大王最大
        if (id1 === 53) return 1;
        if (id2 === 53) return -1;
        // 小王第二大
        if (id1 === 52) return 1;
        if (id2 === 52) return -1;

        // 计算牌的数字和花色
        const num1 = Math.floor(id1 / 4) + 3;
        const num2 = Math.floor(id2 / 4) + 3;
        const suit1 = POKER_MAP.get(id1).slice(-1);
        const suit2 = POKER_MAP.get(id2).slice(-1);

        // 调整数字权重（2最大，A第二...）
        const getWeight = (num) => {
            if (num === 15) return 18; // 2
            if (num === 14) return 17; // A
            if (num === 13) return 16; // K
            if (num === 12) return 15; // Q
            if (num === 11) return 14; // J
            return num + 3; // 3-10 → 6-13
        };

        const weight1 = getWeight(num1);
        const weight2 = getWeight(num2);

        // 先比较数字，数字相同再比较花色
        return weight1 !== weight2
            ? weight1 - weight2
            : suitOrder[suit2] - suitOrder[suit1];
    });
}