package test.repository.interf;

import org.springframework.data.elasticsearch.repository.ElasticsearchCrudRepository;
import test.repository.entity.Blog;

public interface BlogRepository extends ElasticsearchCrudRepository<Blog, Long> {
}
