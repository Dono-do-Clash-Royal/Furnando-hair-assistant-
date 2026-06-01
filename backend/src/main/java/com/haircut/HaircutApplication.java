package com.haircut;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication diz ao Spring: "arranca tudo a partir daqui"
@SpringBootApplication
public class HaircutApplication {

    public static void main(String[] args) {
        SpringApplication.run(HaircutApplication.class, args);
        System.out.println("✅ Backend a correr em http://localhost:8080");
    }
}
