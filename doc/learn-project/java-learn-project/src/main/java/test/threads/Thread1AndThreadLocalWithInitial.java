package test.threads;

import java.util.function.Supplier;

//InheritableThreadLocal父子线程传递值
public class Thread1AndThreadLocalWithInitial {
  public static void main(String[] args) {
    ThreadLocal<String> tlWithInitial = ThreadLocal.withInitial(
      new Supplier<String>() {
        @Override
        public String get() {
          return "初始值";
        }
      }
    );

    new Thread(() -> {
      String a = tlWithInitial.get();
      System.out.println(a);//tl with initial string
    }).start();
  }
}
