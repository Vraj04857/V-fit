package com.vfit.modules.ai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenRouterApiService {

    @Value("${external.openrouter.api-key}")
    private String apiKey;

    @Value("${external.openrouter.base-url}")
    private String baseUrl;

    private final WebClient webClient;

    public OpenRouterApiService() {
        this.webClient = WebClient.builder().build();
    }

@SuppressWarnings("unchecked")
    public String getChatCompletion(String userMessage, String systemPrompt) {
        try {
            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            
            // ✅ USING GPT-4o-mini - High quality, low cost
            requestBody.put("model", "openai/gpt-4o-mini");
            
            Map<String, String> systemMsg = new HashMap<>();
            systemMsg.put("role", "system");
            systemMsg.put("content", systemPrompt);
            
            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", userMessage);
            
            requestBody.put("messages", List.of(systemMsg, userMsg));

            System.out.println("🤖 Sending request to OpenRouter AI...");
            System.out.println("   Model: GPT-4o-mini (OpenAI)");
            System.out.println("   User message: " + userMessage);

            // Make API call
            Map<String, Object> response = webClient.post()
                    .uri(baseUrl + "/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .header("HTTP-Referer", "https://vfit.app")  // Optional: for tracking
                    .header("X-Title", "V-Fit Fitness Assistant")  // Optional: for tracking
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = 
                        (List<Map<String, Object>>) response.get("choices");
                
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, Object> message = 
                            (Map<String, Object>) firstChoice.get("message");
                    String content = (String) message.get("content");
                    
                    System.out.println("✅ AI Response received (" + 
                            content.length() + " characters)");
                    
                    // Log usage for cost tracking (optional)
                    if (response.containsKey("usage")) {
                        Map<String, Object> usage = (Map<String, Object>) response.get("usage");
                        System.out.println("   📊 Tokens used: " + usage);
                    }
                    
                    return content;
                }
            }

            return "I apologize, but I couldn't generate a response. Please try again.";

        } catch (Exception e) {
            System.err.println("❌ OpenRouter API Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get AI response: " + e.getMessage());
        }
    }
}