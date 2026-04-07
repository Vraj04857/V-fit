package com.vfit.modules.ai.repository;

import com.vfit.modules.ai.entity.AiChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiChatHistoryRepository extends JpaRepository<AiChatHistory, Long> {
    List<AiChatHistory> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    List<AiChatHistory> findTop10ByUser_UserIdOrderByCreatedAtDesc(Long userId);
}