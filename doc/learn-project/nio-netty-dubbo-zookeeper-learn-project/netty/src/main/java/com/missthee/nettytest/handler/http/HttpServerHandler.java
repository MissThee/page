package com.missthee.nettytest.handler.http;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import io.netty.handler.codec.http.multipart.DefaultHttpDataFactory;
import io.netty.handler.codec.http.multipart.HttpPostRequestDecoder;
import io.netty.handler.codec.http.multipart.InterfaceHttpData;
import io.netty.handler.codec.http.multipart.MemoryAttribute;
import io.netty.util.CharsetUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/*
 * 自定义处理的handler
 */
public class HttpServerHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private Logger logger = LoggerFactory.getLogger(HttpServerHandler.class);
    /*
     * 处理请求
     */

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest fullHttpRequest) throws Exception {
        try {
            logger.debug("\n\r" + fullHttpRequest);
            FullHttpResponse fullHttpResponse;
            HttpMethod method = fullHttpRequest.method();
            if (method == HttpMethod.GET) {
                logger.debug(String.valueOf(getGetParamsFromChannel(fullHttpRequest)));
                String jsonString = JSON.toJSONString(Res.success("GET method over", "OK"));
                ByteBuf buf = Unpooled.copiedBuffer(jsonString, CharsetUtil.UTF_8);
                fullHttpResponse = resBuild(buf, HttpResponseStatus.OK);
            } else if (method == HttpMethod.POST) {
                logger.debug(String.valueOf(getPostParamsFromChannel(fullHttpRequest)));
                String jsonString = JSON.toJSONString(Res.success("POST method over", "OK"));
                ByteBuf buf = Unpooled.copiedBuffer(jsonString, CharsetUtil.UTF_8);
                fullHttpResponse = resBuild(buf, HttpResponseStatus.OK);
            } else {
                String jsonString = JSON.toJSONString(Res.failure("UNKNOWN method", ""));
                ByteBuf buf = Unpooled.copiedBuffer(jsonString, CharsetUtil.UTF_8);
                fullHttpResponse = resBuild(buf, HttpResponseStatus.OK);
            }
            // 发送响应
            ctx.writeAndFlush(fullHttpResponse)
                    .addListener(ChannelFutureListener.CLOSE).addListener(ChannelFutureListener.CLOSE_ON_FAILURE);
        } catch (Exception e) {
            String jsonString = JSON.toJSONString(Res.success("ERROR", ""));
            ByteBuf buf = Unpooled.copiedBuffer(jsonString, CharsetUtil.UTF_8);
            ctx.writeAndFlush(resBuild(buf, HttpResponseStatus.INTERNAL_SERVER_ERROR))
                    .addListener(ChannelFutureListener.CLOSE);
        }
    }

    /*
     * 获取GET方式传递的参数
     */
    private Map<String, Object> getGetParamsFromChannel(FullHttpRequest fullHttpRequest) {
        Map<String, Object> params = new HashMap<>();
        QueryStringDecoder decoder = new QueryStringDecoder(fullHttpRequest.uri());
        Map<String, List<String>> paramList = decoder.parameters();
        for (Map.Entry<String, List<String>> entry : paramList.entrySet()) {
            params.put(entry.getKey(), entry.getValue().get(0));
        }
        return params;
    }

    /*
     * 获取POST方式传递的参数
     */
    private Map<String, Object> getPostParamsFromChannel(FullHttpRequest fullHttpRequest) {
        Map<String, Object> params;
        String strContentType = fullHttpRequest.headers().get("Content-Type").trim();
        if (strContentType.contains("x-www-form-urlencoded")) {
            params = getFormParams(fullHttpRequest);
        } else if (strContentType.contains("application/json")) {
            params = getJSONParams(fullHttpRequest);
        } else {
            params = null;
        }
        return params;
    }

    /*
     * 解析from表单数据（Content-Type = x-www-form-urlencoded）
     */
    private Map<String, Object> getFormParams(FullHttpRequest fullHttpRequest) {
        Map<String, Object> params = new HashMap<>();

        HttpPostRequestDecoder decoder = new HttpPostRequestDecoder(new DefaultHttpDataFactory(false), fullHttpRequest);
        List<InterfaceHttpData> postData = decoder.getBodyHttpDatas();

        for (InterfaceHttpData data : postData) {
            if (data.getHttpDataType() == InterfaceHttpData.HttpDataType.Attribute) {
                MemoryAttribute attribute = (MemoryAttribute) data;
                params.put(attribute.getName(), attribute.getValue());
            }
        }

        return params;
    }

    /*
     * 解析json数据（Content-Type = application/json）
     */
    private Map<String, Object> getJSONParams(FullHttpRequest fullHttpRequest) {
        Map<String, Object> params = new HashMap<>();

        ByteBuf content = fullHttpRequest.content();
        byte[] reqContent = new byte[content.readableBytes()];
        content.readBytes(reqContent);
        String strContent = new String(reqContent, StandardCharsets.UTF_8);
        try {
            JSONObject jsonParams = JSON.parseObject(strContent);
            for (String key : jsonParams.keySet()) {
                params.put(key, jsonParams.get(key));
            }
        } catch (Exception e) {
            logger.warn("param can not convert to json");
        }
        return params;
    }

    private FullHttpResponse resBuild(ByteBuf content, HttpResponseStatus httpResponseStatus) {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        FullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, httpResponseStatus, content);
        response.headers().set("Content-Type", HttpHeaderValues.APPLICATION_JSON + ";" + "charset=" + CharsetUtil.UTF_8);
        response.headers().set("Content_Length", response.content().readableBytes());
        return response;
    }

}