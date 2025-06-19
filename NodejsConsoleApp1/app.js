// �޸Ļ�ɫ���壬ʹ�ø�ͨ�õķ���
const CARD_SUITS = ["?", "?", "?", "?"]; // ���ҡ����ġ����顢÷��

// �Ż�getCardName������ȷ��10��ʾ��ȷ
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

// �Ż�����������ӻ�ɫ����
function sortCards(cards) {
    const suitOrder = { "?": 4, "?": 3, "?": 2, "?": 1 };

    cards.sort((id1, id2) => {
        // �������
        if (id1 === 53) return 1;
        if (id2 === 53) return -1;
        // С���ڶ���
        if (id1 === 52) return 1;
        if (id2 === 52) return -1;

        // �����Ƶ����ֺͻ�ɫ
        const num1 = Math.floor(id1 / 4) + 3;
        const num2 = Math.floor(id2 / 4) + 3;
        const suit1 = POKER_MAP.get(id1).slice(-1);
        const suit2 = POKER_MAP.get(id2).slice(-1);

        // ��������Ȩ�أ�2���A�ڶ�...��
        const getWeight = (num) => {
            if (num === 15) return 18; // 2
            if (num === 14) return 17; // A
            if (num === 13) return 16; // K
            if (num === 12) return 15; // Q
            if (num === 11) return 14; // J
            return num + 3; // 3-10 �� 6-13
        };

        const weight1 = getWeight(num1);
        const weight2 = getWeight(num2);

        // �ȱȽ����֣�������ͬ�ٱȽϻ�ɫ
        return weight1 !== weight2
            ? weight1 - weight2
            : suitOrder[suit2] - suitOrder[suit1];
    });
}