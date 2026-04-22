package com.linhdev.drumify.configuration;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2); // Số luồng luôn duy trì
        executor.setMaxPoolSize(5); // Số luồng tối đa khi hàng đợi đầy
        executor.setQueueCapacity(100); // Hàng đợi chờ xử lý
        executor.setThreadNamePrefix("DrumifyAsync-");
        executor.initialize();
        return executor;
    }
}
