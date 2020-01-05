package test.repository.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@Document(indexName = "hello", type = "_doc", shards = 5, replicas = 1)
public class Blog { //类型在Elasticsearch存储中并无对应关系，全靠注解配置
    @Id
    @Field(type = FieldType.Long)
    private Long id;
    @Field(type = FieldType.Text, analyzer = "ik_max_word",store = true)
    private String title;
    @Field(type = FieldType.Text, analyzer = "ik_max_word")
    private String content;
    @Field(type = FieldType.Text, analyzer = "ik_max_word")
    private String note;
}
