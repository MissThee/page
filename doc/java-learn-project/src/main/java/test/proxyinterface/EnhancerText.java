package test.proxyinterface;


import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

//动态实现接口。无实际实现类，代理实现接口功能。cglib实现。
public class EnhancerText {
  public static void main(String[] args) {
    //代理对象
    IUser iUser = (IUser) new Enhancer() {{
      setSuperclass(IUser.class);
      setCallback(new MethodInterceptor() {
        @Override
        public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
          if (method.getName().equals("getUserName")) {
            return "method call success!";
          }
          if (method.getName().equals("getUserId")) {
            return 100;
          }
          return null;
        }
      });
    }}.create();
    //执行代理对象的方法
    System.out.println(iUser.getUserName());
    System.out.println(iUser.getUserId());
  }
}
