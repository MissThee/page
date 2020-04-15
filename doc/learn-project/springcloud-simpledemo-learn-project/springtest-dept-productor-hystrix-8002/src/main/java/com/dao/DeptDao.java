package com.dao;

import com.entity.Dept;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;

//Mapper注解调用application中配置的路径下的xml文件
@Mapper
@Component//添加此注解以消除使用@Autowired装配代码中对象报错的现象（不加此注解会提示报错，但运行正常）
public interface DeptDao {
    //不需写此类的实现类，查询语句在mapper配置文件中
    public boolean addDept(Dept dept);

    public Dept findById(int id);

    public List<Dept> findAll();
}
