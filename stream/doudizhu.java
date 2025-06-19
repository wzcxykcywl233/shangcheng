package pm;

import java.util.*;

public class Tset3 {
    public static void main(String[] args) {
        List<String> type = Arrays.asList("♥", "♠", "♦", "♣");
        List<String> typecount = new ArrayList<>();

        for (int i = 3; i <= 10; i++) {
            typecount.add("" + i);
        }
        typecount.add("J");
        typecount.add("Q");
        typecount.add("K");
        typecount.add("A");
        typecount.add("2");  // 2在A后面

        Map<Integer, String> poke = new HashMap<>();
        int index = 0;
        for (String s : typecount) {
            for (String sc : type) {
                poke.put(index, sc + s);
                index++;
            }
        }
        // 大小王放在最后（排序时最大）
        poke.put(52, "小王");
        poke.put(53, "大王");

        List<Integer> number = new ArrayList<>();
        for (int i = 0; i < 54; i++) {
            number.add(i);
        }
        Collections.shuffle(number);

        List<Integer> p1 = new ArrayList<>();
        List<Integer> p2 = new ArrayList<>();
        List<Integer> p3 = new ArrayList<>();
        List<Integer> buttonpoke = new ArrayList<>();

        for (int i = 0; i < 54; i++) {
            if (i >= 51) {
                buttonpoke.add(number.get(i));
            } else {
                switch (i % 3) {
                    case 0: p1.add(number.get(i)); break; // 第0张给玩家1
                    case 1: p2.add(number.get(i)); break; // 第1张给玩家2
                    case 2: p3.add(number.get(i)); break; // 第2张给玩家3
                }
            }
        }

        // 排序后展示（点数从小到大，花色不参与排序）
        Collections.sort(p1);
        Collections.sort(p2);
        Collections.sort(p3);
        Collections.sort(buttonpoke);

        // 转换为牌面显示
        List<String> hand1 = mapCards(p1, poke);
        List<String> hand2 = mapCards(p2, poke);
        List<String> hand3 = mapCards(p3, poke);
        List<String> hidden = mapCards(buttonpoke, poke);

        System.out.println("玩家1：" + hand1);
        System.out.println("玩家2：" + hand2);
        System.out.println("玩家3：" + hand3);
        System.out.println("底牌：" + hidden);
    }

    private static List<String> mapCards(List<Integer> keys, Map<Integer, String> deck) {
        List<String> cards = new ArrayList<>();
        for (Integer key : keys) {
            cards.add(deck.get(key));
        }
        return cards;
    }
}