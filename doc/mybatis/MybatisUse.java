package test.mybatis1;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class Main {
  public void mybatis1() throws IOException {
    InputStream inputStream = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(inputStream);
    SqlSession sqlSession = factory.openSession();
    List<User> list = sqlSession.selectList("com.demo.mapper.UserMapper.getUserByName", "tom");
  }
//1.创建SqlSessionFactoryBuilder对象，调用build(inputstream)方法读取并解析配置文件，返回SqlSessionFactory对象
//2.由SqlSessionFactory创建SqlSession 对象，没有手动设置的话事务默认开启
//3.调用SqlSession中的api，传入Statement Id和参数，内部进行复杂的处理，最后调用jdbc执行SQL语句，封装结果返回。

  public void mybatis2() throws IOException {
    //前三步都相同
    InputStream inputStream = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(inputStream);
    SqlSession sqlSession = factory.openSession();
    //MyBatis也实现了通过接口调用mapper配置文件中的SQL语句
    //这里不再调用SqlSession 的api，而是获得了接口对象，调用接口中的方法。
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    List<User> list = mapper.getUserByName("tom");
  }
}
