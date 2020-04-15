package com.missthee.nettytest.handler.http;

import java.io.Serializable;
import java.util.HashMap;

public class Res<T> implements Serializable {
    private Boolean result;
    private T data;
    private String msg;

    private Res(Boolean result, T data, String msg) {
        this.result = result;
        try {
            data = data == null ? (T) new HashMap() : data;
        } catch (Exception ignored) {
        }
        this.data = data;
        this.msg = msg == null ? "" : msg;
    }

    public Res() {
    }

    public static <T> Res<T> res(Boolean result, T data, String msg) {
        return new Res<>(result, data, msg);
    }

    public static <T> Res<T> res(Boolean result, T data) {
        return new Res<>(result, data, "");
    }

    public static <T> Res<T> res(Boolean result, String msg) {
        return new Res<>(result, null, "");
    }

    public static <T> Res<T> res(Boolean result) {
        return new Res<>(result, null, "");
    }

    public static <T> Res<T> success(T data, String msg) {
        return new Res<>(true, data, msg);
    }

    public static <T> Res<T> success(T data) {
        return new Res<>(true, data, "");
    }

    public static <T> Res<T> success(String msg) {
        return new Res<>(true, null, msg);
    }

    public static <T> Res<T> success() {
        return new Res<>(true, null, "");
    }

    public static <T> Res<T> failure(T data, String msg) {
        return new Res<>(false, data, msg);
    }

    public static <T> Res<T> failure(T data) {
        return new Res<>(false, data, "");
    }

    public static <T> Res<T> failure(String msg) {
        return new Res<>(false, null, msg);
    }

    public static <T> Res<T> failure() {
        return new Res<>(false, null, "");
    }


    public Boolean getResult() {
        return result;
    }

    public void setResult(Boolean result) {
        this.result = result;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

}