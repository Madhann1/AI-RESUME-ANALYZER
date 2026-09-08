package com.airesume.service;

import com.airesume.dto.DashboardDtos;
import com.airesume.dto.ResumeDtos;
import com.airesume.model.User;
import com.airesume.repository.InterviewQuestionRepository;
import com.airesume.repository.JobMatchRepository;
import com.airesume.repository.ResumeReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ResumeReportRepository resumeReportRepository;
    private final JobMatchRepository jobMatchRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final ResumeAnalysisService resumeAnalysisService;
    private final AuthService authService;

    public DashboardDtos.StatsResponse getDashboardStats() {
        User currentUser = authService.getCurrentUser();
        Long userId = currentUser.getId();

        Long totalResumes = resumeReportRepository.countByUserId(userId);
        Double averageScoreRaw = resumeReportRepository.findAverageOverallScoreByUserId(userId);
        Double averageScore = averageScoreRaw != null ? Math.round(averageScoreRaw * 10.0) / 10.0 : 0.0;

        long totalJobMatches = jobMatchRepository.findByUserIdOrderByCreatedAtDesc(userId).size();
        long totalQuestions = interviewQuestionRepository.findByUserIdOrderByCreatedAtDesc(userId).size();

        List<ResumeDtos.ResumeReportSummaryDto> recentResumes = resumeAnalysisService.getUserResumes();
        if (recentResumes.size() > 5) {
            recentResumes = recentResumes.subList(0, 5);
        }

        return DashboardDtos.StatsResponse.builder()
                .totalResumes(totalResumes)
                .averageScore(averageScore)
                .totalJobMatches(totalJobMatches)
                .totalInterviewQuestions(totalQuestions)
                .recentAnalyses(recentResumes)
                .build();
    }
}
