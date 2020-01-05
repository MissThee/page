import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.test.context.junit4.SpringRunner;
import test.MainApp;
import test.repository.entity.Blog;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {MainApp.class})
public class TestApplication {
    @Autowired
    ElasticsearchTemplate elasticsearchTemplate;

    @Test
    public void whenQuerySuccess() {
        elasticsearchTemplate.createIndex(Blog.class);
    }
}