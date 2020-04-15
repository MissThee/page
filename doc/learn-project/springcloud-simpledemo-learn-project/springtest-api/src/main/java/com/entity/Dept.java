package com.entity;

import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Accessors(chain = true)
//使用lombok需添加maven坐标，安装lombok插件，setting→annotation processors中设置√enable annotation processing。
public class Dept implements Serializable {
    private Integer id;
    private String name;
    private String db_source;//来自哪个数据库，微服务架构可以一个服务对应一个数据库，同一信息被存储到不同的数据库

//    public static void main(String[] args) {
//        Dept dept = new Dept();
//        dept.setName("12");
//    }
}
