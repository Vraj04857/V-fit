package com.vfit;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.boot.SpringApplication;

@SpringBootApplication
@EnableJpaAuditing
public class VFitApplication {
    
    public static void main(String[] args){
        SpringApplication.run(VFitApplication.class, args);
        System.out.println("======================================");
        System.out.println("V-Fit Backend Started Successfully!");
        System.out.println("API Base URL: http://localhost:8080/api");
        System.out.println("Health Check: http://localhost:8080/api/actuator/health");
        System.out.println("========================================");
    }
}
