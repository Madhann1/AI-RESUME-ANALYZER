package com.airesume.repository;

import com.airesume.model.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {
    List<InterviewQuestion> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<InterviewQuestion> findByUserIdAndResumeReportId(Long userId, Long resumeReportId);
    List<InterviewQuestion> findByUserIdAndCategory(Long userId, String category);
}
