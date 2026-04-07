package com.vfit.modules.ai.service;

import com.vfit.modules.ai.dto.ChatResponse;
import com.vfit.modules.ai.entity.AiChatHistory;
import com.vfit.modules.ai.repository.AiChatHistoryRepository;
import com.vfit.modules.user.entity.Profile;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.ProfileRepository;
import com.vfit.modules.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiAssistantService {

    @Autowired
    private OpenRouterApiService openRouterService;

    @Autowired
    private AiChatHistoryRepository chatHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    private static final String SYSTEM_PROMPT = 
        "You are V-Fit AI Assistant, a helpful fitness and nutrition coach. " +
        "You provide guidance on workouts, diet, nutrition, and healthy lifestyle. " +
        "Keep responses concise, friendly, and motivating. " +
        "Focus on evidence-based fitness and nutrition advice. " +
        "If asked about medical conditions, always recommend consulting a healthcare professional.";

    // UC-12: Send message to AI
    @Transactional
    public ChatResponse chat(Long userId, String userMessage) {
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get user profile for context
        Profile profile = profileRepository.findByUser_UserId(userId).orElse(null);
        
        String contextualPrompt = SYSTEM_PROMPT;
        
        if (profile != null) {
            contextualPrompt += "\n\nUser context: ";
            if (profile.getFitnessGoal() != null) {
                contextualPrompt += "Goal: " + profile.getFitnessGoal() + ". ";
            }
            if (profile.getDietaryPreference() != null) {
                contextualPrompt += "Diet preference: " + profile.getDietaryPreference() + ". ";
            }
            if (profile.getActivityLevel() != null) {
                contextualPrompt += "Activity level: " + profile.getActivityLevel() + ".";
            }
        }

        System.out.println(" User " + userId + " asked: " + userMessage);

        // Get AI response
        String aiResponse = openRouterService.getChatCompletion(
                userMessage, contextualPrompt);

        // Save to history
        AiChatHistory chat = new AiChatHistory();
        chat.setUser(user);
        chat.setUserMessage(userMessage);
        chat.setAiResponse(aiResponse);
        chat.setApiUsed("gpt-4o-mini");

        AiChatHistory saved = chatHistoryRepository.save(chat);

        return new ChatResponse(
                saved.getChatId(),
                saved.getUserMessage(),
                saved.getAiResponse(),
                saved.getApiUsed(),
                saved.getCreatedAt()
        );
    }

    // Get chat history
    public List<ChatResponse> getChatHistory(Long userId, Integer limit) {
        List<AiChatHistory> history;
        
        if (limit != null && limit > 0) {
            history = chatHistoryRepository.findTop10ByUser_UserIdOrderByCreatedAtDesc(userId);
        } else {
            history = chatHistoryRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
        }

        return history.stream()
                .map(chat -> new ChatResponse(
                        chat.getChatId(),
                        chat.getUserMessage(),
                        chat.getAiResponse(),
                        chat.getApiUsed(),
                        chat.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}