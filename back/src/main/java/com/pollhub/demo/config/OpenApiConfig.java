package com.pollhub.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI pollHubOpenAPI() {
        return new OpenAPI().info(
            new Info()
                .title("PollHub API")
                .version("v1")
                .description("Basic authentication and poll API documentation")
        );
    }
}
