package test.proxyinterface;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
//动态实现接口。无实际实现类，代理实现接口功能。jdk动态代理实现。
public class ProxyTest {
    public static void main(String[] args) {
        //此处第二参数不能使用IUserDao.class.getInterfaces(),
        //  Class.getInterfaces()是获取某类所实现的所有接口，返回值Class<?>[]。
        //  所以在接口上使用这个方法，静态检查不会出错，实际运行结果不正确，因为其实际获取的是com.sun.proxy.$Proxy0
        IUser iUser = (IUser) Proxy.newProxyInstance(
                IUser.class.getClassLoader(),
                new Class[]{IUser.class},
                new InvocationHandler() {
                    @Override
                    public Object invoke(Object proxy, Method method, Object[] args) {
                      if (method.getName().equals("getUserName")) {
                        return "method call success!";
                      }
                      if (method.getName().equals("getUserId")) {
                        return 100;
                      }
                      return null;
                    }
                });
      System.out.println(iUser.getUserName());
      System.out.println(iUser.getUserId());
    }
}
