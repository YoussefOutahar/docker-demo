package com.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HelloController {

    @Value("${flask.api.url:http://python-flask:5001}")
    private String flaskApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from Spring Boot");
        response.put("framework", "Java Spring Boot");
        response.put("timestamp", LocalDateTime.now().toString());
        return response;
    }

    @GetMapping("/api/call-flask")
    public Map<String, Object> callFlask() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Call Flask API using Docker service name
            String flaskUrl = flaskApiUrl + "/api/data";
            Map<String, Object> flaskResponse = restTemplate.getForObject(flaskUrl, Map.class);

            response.put("success", true);
            response.put("message", "Spring Boot successfully called Flask API");
            response.put("springBootContainer", "java-springboot-demo");
            response.put("flaskApiUrl", flaskUrl);
            response.put("networkingType", "Server-to-Server (using Docker service name)");
            response.put("flaskData", flaskResponse);
            response.put("timestamp", LocalDateTime.now().toString());

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("message", "Failed to call Flask API");
            response.put("flaskApiUrl", flaskApiUrl);
        }

        return response;
    }
}
