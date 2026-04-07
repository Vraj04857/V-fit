package com.vfit.modules.ai.dto;

import java.time.LocalDateTime;

public class ChatResponse {

    private Long chatId;
    private String userMessage;
    private String aiResponse;
    private String apiUsed;
    private LocalDateTime createdAt;

    // Constructors
    public ChatResponse() {}

    public ChatResponse(Long chatId, String userMessage, String aiResponse, 
                        String apiUsed, LocalDateTime createdAt) {
        this.chatId = chatId;
        this.userMessage = userMessage;
        this.aiResponse = aiResponse;
        this.apiUsed = apiUsed;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getChatId() { return chatId; }
    public String getUserMessage() { return userMessage; }
    public String getAiResponse() { return aiResponse; }
    public String getApiUsed() { return apiUsed; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setChatId(Long chatId) { this.chatId = chatId; }
    public void setUserMessage(String userMessage) { this.userMessage = userMessage; }
    public void setAiResponse(String aiResponse) { this.aiResponse = aiResponse; }
    public void setApiUsed(String apiUsed) { this.apiUsed = apiUsed; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}