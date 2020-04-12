package test.threads;

//InheritableThreadLocal父子线程传递值
public class Thread1AndThreadLocal {
  public static void main(String[] args) {
    //主线程中赋值
    ThreadLocal<String> tl = new ThreadLocal<>();
    tl.set("tl string");//子线程获取不到值

    ThreadLocal<String> tlWithInitial = ThreadLocal.withInitial(() -> "tl with initial string");//子线程可以获取到值
    //ThreadLocal.withInitial子线程可以获取到值，因为此时拿到的对象是SuppliedThreadLocal(是ThreadLocal的子类)，其get()方法是被重写的指定方法(即上面返回字符串的方法)。
    //此时此对象的get方法不会从当前线程中的ThreadLocalMap中获取

    InheritableThreadLocal<String> itl = new InheritableThreadLocal<>();
    itl.set("itl string");//子线程可以获取到值


    System.out.println(Thread.currentThread().getName() + " MAIN ");
    //子线程中分别打印变量的信息
    new Thread(() -> {
      System.out.println(Thread.currentThread().getName() + "value ：" + tl.get());//null
      System.out.println(Thread.currentThread().getName() + "value ：" + tlWithInitial.get());//tl with initial string
      System.out.println(Thread.currentThread().getName() + "value ：" + itl.get());//itl string
      tl.set("1");
      tlWithInitial.set("2");
      itl.set("3");
      System.out.println(Thread.currentThread().getName() + "value ：" + tl.get());//1
      System.out.println(Thread.currentThread().getName() + "value ：" + tlWithInitial.get());//2
      System.out.println(Thread.currentThread().getName() + "value ：" + itl.get());//3
    }).start();
    try {
      Thread.sleep(2000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    System.out.println(Thread.currentThread().getName() + "value ：" + tl.get());//tl string
    System.out.println(Thread.currentThread().getName() + "value ：" + tlWithInitial.get());//tl with initial string
    System.out.println(Thread.currentThread().getName() + "value ：" + itl.get());//itl string
    System.out.println("END");
    //InheritableThreadLocal可让父线程为子线程变量赋值。源码简要理解：
    //1、调用InheritableThreadLocal的set()方法会获取当前线程(父)Thead对象，此对象中有两成员变量inheritableThreadLocals和threadLocals。InheritableThreadLocal继承于ThreadLocal，重写了部分方法，将值存储到inheritableThreadLocals中
    //2、主线程中创建子线程Thread对象时，Thread的init()方法会判断主线程中的inheritableThreadLocals是否为null，若不为null，将数据深拷贝到新建的子线程Thread对象的inheritableThreadLocals。实现父子线程传递值
    //（实现具体分析可见： https://blog.csdn.net/hewenbo111/article/details/80487252    ；  https://www.jianshu.com/p/a1d4cce7af53）
    //注：若InheritableThreadLocal与线程池搭配使用，因线程池中线程可能被缓存起来，重复使用同一线程时，不会再对此线程绑定变量进行初始化操作。解决方案可使用第三方类库 https://github.com/alibaba/transmittable-thread-local
  }
}
