package com.dic.common.config.exception.custom;

public class MyMethodArgumentNotValidException extends Exception {
    public MyMethodArgumentNotValidException(String message) {
        super(message);
    }
}
