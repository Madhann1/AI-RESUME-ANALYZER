package com.airesume.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class ResumeDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumeReportSummaryDto {
        private Long id;
        private String originalFileName;
        private String candidateName;
        private String candidateEmail;
        private Integer overallScore;
        private String createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumeReportDetailDto {
        private Long id;
        private String originalFileName;
        private String candidateName;
        private String candidateEmail;
        private String candidatePhone;
        private String parsedText;
        private List<String> skills;
        private List<EducationDto> education;
        private List<ProjectDto> projects;
        private List<ExperienceDto> experience;
        private List<String> certifications;
        private List<String> strengths;
        private List<String> weaknesses;
        private List<String> improvementSuggestions;
        private ScoreBreakdownDto scoreBreakdown;
        private Integer overallScore;
        private String createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ScoreBreakdownDto {
        private Integer skills;
        private Integer projects;
        private Integer experience;
        private Integer formatting;
        private Integer technicalDepth;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EducationDto {
        private String degree;
        private String institution;
        private String year;
        private String grade;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProjectDto {
        private String title;
        private String description;
        private List<String> technologies;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExperienceDto {
        private String role;
        private String company;
        private String duration;
        private String summary;
    }
}
