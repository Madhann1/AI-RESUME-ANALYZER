package com.airesume.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class DashboardDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatsResponse {
        private Long totalResumes;
        private Double averageScore;
        private Long totalJobMatches;
        private Long totalInterviewQuestions;
        private List<ResumeDtos.ResumeReportSummaryDto> recentAnalyses;
    }
}
