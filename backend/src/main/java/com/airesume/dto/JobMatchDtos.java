package com.airesume.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class JobMatchDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobMatchRequest {
        @NotNull(message = "Resume report ID is required")
        private Long resumeReportId;

        private String jobTitle;

        @NotBlank(message = "Job description text is required")
        private String jobDescription;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobMatchResponse {
        private Long id;
        private Long resumeReportId;
        private String jobTitle;
        private String jobDescription;
        private Integer matchPercentage;
        private List<String> matchingSkills;
        private List<String> missingSkills;
        private List<LearningPathDto> learningPath;
        private String hiringRecommendation;
        private String createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LearningPathDto {
        private String topic;
        private List<String> keySubtopics;
        private String rationale;
    }
}
