import java.util.ArrayList;
import java.util.List;

public class Main {
    static class Person {
        private String name;
        public Person(String name) {
            this.name = name;
        }
        @Override
        public String toString() {
            return "Person{name='" + name + "'}";
        }
    }

    public static void main(String[] args) {
        // 第一个队伍
        List<String> team1 = new ArrayList<>();
        team1.add("迪丽热巴");
        team1.add("宋远桥");
        team1.add("苏星河");
        team1.add("石破天");
        team1.add("石中玉");
        team1.add("老子");
        team1.add("庄子");
        team1.add("洪七公");

        // 第二个队伍
        List<String> team2 = new ArrayList<>();
        team2.add("古力娜扎");
        team2.add("张无忌");
        team2.add("赵丽颖");
        team2.add("张三丰");
        team2.add("尼古拉斯赵四");
        team2.add("张天爱");
        team2.add("张二狗");

        // 1. 第一个队伍只要名字为3个字的成员姓名
        List<String> team1Filtered = new ArrayList<>();
        for (String name : team1) {
            if (name.length() == 3) {
                team1Filtered.add(name);
            }
        }

        // 2. 第一个队伍筛选之后只要前3个人
        List<String> team1Final = new ArrayList<>();
        for (int i = 0; i < team1Filtered.size() && i < 3; i++) {
            team1Final.add(team1Filtered.get(i));
        }

        // 3. 第二个队伍只要姓张的成员姓名
        List<String> team2Filtered = new ArrayList<>();
        for (String name : team2) {
            if (name.startsWith("张")) {
                team2Filtered.add(name);
            }
        }

        // 4. 第二个队伍筛选之后不要前2个人
        List<String> team2Final = new ArrayList<>();
        for (int i = 2; i < team2Filtered.size(); i++) {
            team2Final.add(team2Filtered.get(i));
        }

        // 5. 将两个队伍合并为一个队伍
        List<String> allNames = new ArrayList<>();
        allNames.addAll(team1Final);
        allNames.addAll(team2Final);

        // 6. 根据姓名创建 Person 对象
        List<Person> personList = new ArrayList<>();
        for (String name : allNames) {
            personList.add(new Person(name));
        }

        // 7. 打印整个队伍的Person对象信息
        for (Person person : personList) {
            System.out.println(person);
        }
    }
}