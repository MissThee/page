package test;

import org.apache.http.HttpHost;
import org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsRequest;
import org.elasticsearch.action.bulk.BulkProcessor;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.client.indices.PutMappingRequest;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.TransportAddress;
import org.elasticsearch.common.unit.ByteSizeUnit;
import org.elasticsearch.common.unit.ByteSizeValue;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.script.mustache.SearchTemplateRequest;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.transport.client.PreBuiltTransportClient;

import java.io.IOException;
import java.net.InetAddress;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class ElasticSearchClientMana {
    public static void main(String[] args) throws IOException, ExecutionException, InterruptedException {
        es7();
    }

    public static void es6() throws IOException, ExecutionException, InterruptedException {
        //创建Settings对象，设置配置信息
        Settings settings = Settings.builder()
                //指定集群名称
                .put("cluster.name", "my-elasticsearch")
                .build();
        //设置集群链接信息（es7不推荐，es8将移除）
        TransportClient transportClient = new PreBuiltTransportClient(settings).addTransportAddresses(
                new TransportAddress(InetAddress.getByName("127.0.0.1"), 9301),
                new TransportAddress(InetAddress.getByName("127.0.0.1"), 9302),
                new TransportAddress(InetAddress.getByName("127.0.0.1"), 9303)
        );
        boolean isExist = transportClient
                .admin().indices().exists(new IndicesExistsRequest("hello")).get().isExists();
        if (!isExist) {
            //创建索引
            transportClient
                    .admin()
                    .indices()
                    .prepareCreate("hello")//准备创建索引
                    .get();//执行方法
        }
        //创建mappings
        XContentBuilder mappingsXContentBuilder = XContentFactory.jsonBuilder()
                .startObject()
                .startObject("properties")
                .startObject("id")
                .field("type", "long")
                .field("store", true)
                .endObject()
                .startObject("title")
                .field("type", "text")
                .field("store", true)
                .field("analyzer", "ik_smart")
                .endObject()
                .startObject("content")
                .field("type", "text")
                .field("store", true)
                .field("analyzer", "ik_smart")
                .endObject()
                .endObject()
                .endObject();
        if (false) {
            transportClient
                    .admin()
                    .indices()
                    .preparePutMapping("hello")//准备创建文档配置
                    .setType("_doc")//设置Type信息（7或以上默认只能传_doc）
                    .setSource(mappingsXContentBuilder)//设置mapping信息。
                    .get();//执行方法
        }

        XContentBuilder documentXContentBuilder = XContentFactory.jsonBuilder()
                .startObject()
                .field("id", "5")
                .field("title", "标题5")
                .field("content", "这是内容5")
                .endObject();
        //添加文档
        if (false) {
            transportClient
                    .prepareIndex()
                    .setIndex("hello")
                    .setType("_doc")
//                .setId("5")
                    .setSource(documentXContentBuilder)
                    .get();
        }
        //查询
        {
            SearchResponse searchResponse = transportClient
                    .prepareSearch("hello")
//                    .setQuery(QueryBuilders.idsQuery().addIds("klZIdG8BkR5f_NWsfFq2"))
//                    .setQuery(QueryBuilders.termQuery("content", 5))
                    .setQuery(QueryBuilders.queryStringQuery("标题").defaultField("title"))//defaultField不指定defaultField则查所有
                    .setFrom(0)//分页 起始行下标号
                    .setSize(5)//分页 单页数据条数
                    .get();
            //查询结果记录数
            System.out.println("总记录数:" + searchResponse.getHits().getTotalHits());
            for (SearchHit searchHit : searchResponse.getHits()) {
                Map<String, Object> sourceAsMap = searchHit.getSourceAsMap();
                System.out.println(sourceAsMap.get("id"));
                System.out.println(sourceAsMap.get("title"));
                System.out.println(sourceAsMap.get("content"));
            }
        }
        transportClient.close();
    }

    public static void es7() throws IOException {
        //rest低级客户端创建（不能操作索引）
        RestClient restClient = RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"))
                .build();
        restClient.close();
        //rest高级客户端创建
        RestHighLevelClient restHighLevelClient = new RestHighLevelClient(
                RestClient.builder(
                        new HttpHost("localhost", 9200, "http"),
                        new HttpHost("localhost", 9201, "http"))
        );
        boolean isExist = restHighLevelClient.indices().exists(
                new GetIndexRequest("hello"),
                RequestOptions.DEFAULT
        );
        if (!isExist) {
            //创建索引
            restHighLevelClient
                    .indices()
                    .create(new CreateIndexRequest("hello"), RequestOptions.DEFAULT);
        }
        //创建mappings
        XContentBuilder mappingsXContentBuilder = XContentFactory.jsonBuilder()
                .startObject()
                .startObject("properties")
                .startObject("id")
                .field("type", "long")
                .field("store", true)
                .endObject()
                .startObject("title")
                .field("type", "text")
                .field("store", true)
                .field("analyzer", "ik_smart")
                .endObject()
                .startObject("content")
                .field("type", "text")
                .field("store", true)
                .field("analyzer", "ik_smart")
                .endObject()
                .endObject()
                .endObject();
        if (!isExist) {
            //创建索引(附带mappings)
            restHighLevelClient
                    .indices()
                    .create(
                            new CreateIndexRequest("hello")
                                    .mapping(mappingsXContentBuilder)
                                    .settings(Settings.builder()
                                            .put("index.number_of_shards", 3)
                                            .put("index.number_of_replicas", 1)
                                            .build()
                                    )
                            , RequestOptions.DEFAULT);
        }
        if (false) {
            restHighLevelClient
                    .indices()
                    .putMapping(
                            new PutMappingRequest("hello")
                                    .source(mappingsXContentBuilder),
                            RequestOptions.DEFAULT
                    );
        }
        XContentBuilder documentXContentBuilder = XContentFactory.jsonBuilder()
                .startObject()
                .field("id", 5L)
                .field("title", "标题5")
                .field("content", "这是内容5")
                .endObject();
        if (false) {
            //添加文档
            restHighLevelClient.index(
                    new IndexRequest("hello")
//                        .id("5")
                            .source(documentXContentBuilder),
                    RequestOptions.DEFAULT
            );
        }
        if (false) {
            //批量添加文档
            restHighLevelClient.bulk(
                    new BulkRequest() {{
                        add(new IndexRequest("hello").source(documentXContentBuilder));
                        add(new IndexRequest("hello").source(documentXContentBuilder));
                        add(new IndexRequest("hello").source(documentXContentBuilder));
                    }}
                    , RequestOptions.DEFAULT
            );
        }
        if (false) {
            //processor插入数据
            BulkProcessor.Listener listener = new BulkProcessor.Listener() {
                @Override
                public void beforeBulk(long executionId, BulkRequest request) {
                    System.out.printf("---尝试插入{%s}条数据---\n", request.numberOfActions());
                }

                @Override
                public void afterBulk(long executionId, BulkRequest request, BulkResponse response) {
                    System.out.printf("---尝试插入{%s}条数据成功---\n", request.numberOfActions());
                }

                @Override
                public void afterBulk(long executionId, BulkRequest request, Throwable failure) {
                    System.out.println("---尝试插入数据失败---");
                }
            };
            BulkProcessor bulkProcessor = BulkProcessor.builder((request, bulkListener) ->
                    restHighLevelClient.bulkAsync(request, RequestOptions.DEFAULT, bulkListener), listener)
                    .setBulkActions(10000)
                    .setBulkSize(new ByteSizeValue(10, ByteSizeUnit.MB))
                    .setFlushInterval(TimeValue.timeValueSeconds(5))
                    .setConcurrentRequests(2)
                    .build();
            bulkProcessor.add(new IndexRequest("hello").source(documentXContentBuilder));
        }
        //查询
        {
            SearchResponse searchResponse = restHighLevelClient.search(
                    new SearchRequest("hello")
                            .source(SearchSourceBuilder
                                    .searchSource()
                                    .from(0)
                                    .size(5)
                                    //.query(QueryBuilders.idsQuery().addIds("klZIdG8BkR5f_NWsfFq2"))
                                    //.query(QueryBuilders.termQuery("content", 5))
                                    .query(QueryBuilders.queryStringQuery("标题").defaultField("title"))
                            )
                    , RequestOptions.DEFAULT);
            //查询结果记录数
            System.out.println("总记录数:" + searchResponse.getHits().getTotalHits());
            for (SearchHit searchHit : searchResponse.getHits()) {
                Map<String, Object> sourceAsMap = searchHit.getSourceAsMap();
                System.out.println(sourceAsMap.get("id"));
                System.out.println(sourceAsMap.get("title"));
                System.out.println(sourceAsMap.get("content"));
            }
        }
        restHighLevelClient.close();
    }
}
