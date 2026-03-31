package com.linhdev.drumify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class DrumifyApplication {

    public static void main(String[] args) {
        SpringApplication.run(DrumifyApplication.class, args);
    }
}
