package test.classloader;

public class TestClassLoader {
    public static void main(String[] args) {

        ClassLoader loader = TestClassLoader.class.getClassLoader();  //等同于ClassLoader.getSystemClassLoader()
        System.out.println(loader.getClass().getName());              //sun.misc.Launcher$AppClassLoader
        System.out.println(loader.getParent().getClass().getName());  //sun.misc.Launcher$ExtClassLoader
        System.out.println(loader.getParent().getParent()); //null

        ClassLoader myLoader = new MyClassLoader();
        System.out.println(myLoader.getClass().getName());                          //test.classloader.MyClassLoader
        System.out.println(myLoader.getParent().getClass().getName());              //sun.misc.Launcher$AppClassLoader
        System.out.println(myLoader.getParent().getParent().getClass().getName());  //sun.misc.Launcher$ExtClassLoader
        System.out.println(myLoader.getParent().getParent().getParent());           //null

        System.out.println(myLoader.getParent() == loader); //true
        System.out.println(loader == ClassLoader.getSystemClassLoader()); //true

    }
}
//1. 启动类加载器(Bootstrap ClassLoader):
//   这个类加载器负责将\lib目录下的类库加载到虚拟机内存中,用来加载java的核心库,此类加载器并不继承于java.lang.ClassLoader,不能被java程序直接调用,代码是使用C++编写的.是虚拟机自身的一部分.
//2. 扩展类加载器(Extension ClassLoader):
//   这个类加载器负责加载\lib\ext目录下的类库,用来加载java的扩展库,开发者可以直接使用这个类加载器.
//3. 应用程序类加载器(Application ClassLoader):
//   这个类加载器负责加载用户类路径(CLASSPATH)下的类库,一般我们编写的java类都是由这个类加载器加载,这个类加载器是CLassLoader中的getSystemClassLoader()方法的返回值,所以也称为系统类加载器.一般情况下这就是系统默认的类加载器.
//4. 自己定义的类加载器。除此之外,我们还可以加入自己定义的类加载器,以满足特殊的需求,需要继承java.lang.ClassLoader类.
