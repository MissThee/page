package com;

import com.netflix.client.RequestSpecificRetryHandler;
import com.netflix.client.RetryHandler;
import com.netflix.client.config.IClientConfig;

import java.util.Map;

public class MyRequestSpecificRetryHandler extends RequestSpecificRetryHandler {
    public MyRequestSpecificRetryHandler(boolean okToRetryOnConnectErrors, boolean okToRetryOnAllErrors) {
        super(okToRetryOnConnectErrors, okToRetryOnAllErrors);
    }

    public MyRequestSpecificRetryHandler(boolean okToRetryOnConnectErrors, boolean okToRetryOnAllErrors, RetryHandler baseRetryHandler, IClientConfig requestConfig) {
        super(okToRetryOnConnectErrors, okToRetryOnAllErrors, baseRetryHandler, requestConfig);
        Map<String, Object> properties = requestConfig.getProperties();

    }
}
