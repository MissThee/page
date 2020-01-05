package test.controller;

import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import test.repository.entity.Blog;
import test.repository.interf.BlogRepository;

import java.io.IOException;

@RestController
@RequestMapping
public class ManaController {
    private final BlogRepository blogRepository;
    private final ElasticsearchRestTemplate elasticsearchRestTemplate;

    public ManaController(ElasticsearchRestTemplate elasticsearchRestTemplate, BlogRepository blogRepository) {
        this.elasticsearchRestTemplate = elasticsearchRestTemplate;
        this.blogRepository = blogRepository;
    }

    @RequestMapping("/Index")
    public String createIndex() throws IOException {
        boolean deleteIndex = elasticsearchRestTemplate.deleteIndex(Blog.class);
        //创建Index，成功或已存在返回true，已存在时不会更新成现在的结构
        boolean createIndex = elasticsearchRestTemplate.createIndex(Blog.class);
        return deleteIndex + " " + createIndex;
    }

    @RequestMapping("/Mapping")
    public Boolean createMapping() throws IOException {
        //创建Mapping，成功或已存在返回true，已存在时不会更新成现在的结构
        return elasticsearchRestTemplate.putMapping(Blog.class);
        //可使用以下方法进行自定义设置，如关闭_source存储，但第二参数会覆盖实体类中注解的设置，各个属性也需手动设置，实体类的属性配置不再生效，仅能帮助构造请求中文档相关信息
//        return elasticsearchRestTemplate.putMapping(
//                Blog.class,
//                XContentFactory.jsonBuilder()
//                        .startObject()
//                        .startObject("_source")
//                        .field("enabled", false)
//                        .endObject()
//                        .startObject("properties")
//                        .startObject("title")
//                        .field("type","text")
//                        .field("store",true)
//                        .endObject()
//                        .endObject()
//                        .endObject()
//        );
    }

    @RequestMapping("/Document")
    public Blog createDocument() {
        //创建Document，成功或已存在返回true，已存在时根据id覆盖更新
        return blogRepository.save(new Blog() {{
            setId(6L);
            setTitle("今天天气不错");
            setContent("又是风和日丽的一天，没有下雨，晴空万里！！！");
        }});
    }

    @RequestMapping("/Document1")
    public IndexResponse createDocument1() throws IOException {
        return elasticsearchRestTemplate.getClient()//可使用getClient获取到RestHighLevelClient，之后可使用elasticsearch提供的方法编写代码
                .index(new IndexRequest("hello")
                                .type("_doc")
                                .source(XContentFactory.jsonBuilder()
                                        .startObject()
                                        .field("id", 5L)
                                        .field("title", "标题5")
                                        .field("content", "这是内容5")
                                        .endObject()
                                ),
                        RequestOptions.DEFAULT
                );
    }
}
