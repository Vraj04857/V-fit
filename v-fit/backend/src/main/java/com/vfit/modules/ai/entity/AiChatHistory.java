package com.vfit.modules.ai.entity;

import com.vfit.modules.user.entity.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_chat_history")
@EntityListeners(AuditingEntityListener.class)
public class AiChatHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long chatId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "user_message", columnDefinition = "TEXT")
    private String userMessage;

    @Column(name = "ai_response", columnDefinition = "TEXT")
    private String aiResponse;

    @Column(name = "api_used", length = 50)
    private String apiUsed;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public AiChatHistory() {}

    // Getters
    public Long getChatId() { return chatId; }
    public User getUser() { return user; }
    public String getUserMessage() { return userMessage; }
    public String getAiResponse() { return aiResponse; }
    public String getApiUsed() { return apiUsed; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setChatId(Long chatId) { this.chatId = chatId; }
    public void setUser(User user) { this.user = user; }
    public void setUserMessage(String userMessage) { this.userMessage = userMessage; }
    public void setAiResponse(String aiResponse) { this.aiResponse = aiResponse; }
    public void setApiUsed(String apiUsed) { this.apiUsed = apiUsed; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}