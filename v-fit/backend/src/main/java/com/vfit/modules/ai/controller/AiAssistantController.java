package com.vfit.modules.ai.controller;

import com.vfit.modules.ai.dto.ChatRequest;
import com.vfit.modules.ai.dto.ChatResponse;
import com.vfit.modules.ai.service.AiAssistantService;
import com.vfit.shared.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*")
public class AiAssistantController {

    @Autowired
    private AiAssistantService aiAssistantService;

    @Autowired
    private SecurityUtils securityUtils;

    // UC-12: Chat with AI Assistant
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@Valid @RequestBody ChatRequest request) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            ChatResponse response = aiAssistantService.chat(userId, request.getMessage());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get chat history
    @GetMapping("/history")
    public ResponseEntity<?> getChatHistory(
            @RequestParam(required = false) Integer limit) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            List<ChatResponse> history = aiAssistantService.getChatHistory(userId, limit);
            return ResponseEntity.ok(history);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}