package com.missthee.fluxtest.handler;

import com.missthee.fluxtest.dao.CityRepository;
import com.missthee.fluxtest.entity.City;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

@Component
public class CityHandler {

    private final CityRepository cityRepository;

    @Autowired
    public CityHandler(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
//        return Mono.create(cityMonoSink -> cityMonoSink.success(cityRepository.save(city)));
    }

    public Mono<City> save(City city) {
        return cityRepository.save(city);
    }

    public Mono<City> findCityById(Long id) {
        return cityRepository.findById(id);
//        return Mono.justOrEmpty(cityRepository.findCityById(id));
    }

    public Flux<City> findAllCity() {
        return cityRepository.findAll();
//        return Flux.fromIterable(cityRepository.findAll());

    }

    public Mono<City> modifyCity(City city) {
        return cityRepository.save(city);
//        return Mono.create(cityMonoSink -> cityMonoSink.success(cityRepository.updateCity(city)));
    }

    public Mono<Long> deleteCity(Long id) {
        try {
            Mono<Void> voidMono = cityRepository.deleteById(id);
        } catch (Exception e) {
            return Mono.create(cityMonoSink -> cityMonoSink.error(e));
        }
        return Mono.create(cityMonoSink -> cityMonoSink.success(id));
//        return Mono.create(cityMonoSink -> cityMonoSink.success(cityRepository.deleteCity(id)));
    }

    public Mono<ServerResponse> helloCity(ServerRequest request) {
        return ServerResponse
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromObject("{\"test\":\"Hello, City!\"}"));
    }
//    ServerResponse 是对响应的封装，可以设置响应状态、响应头、响应正文。比如 ok 代表的是 200 响应码、MediaType 枚举是代表这文本内容类型、返回的是 String 的对象。
//    这里用 Mono 作为返回对象，是因为返回包含了一个 ServerResponse 对象，而不是多个元素。

}