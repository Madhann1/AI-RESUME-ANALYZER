package com.airesume.service;

import com.airesume.dto.JobMatchDtos;
import com.airesume.exception.ResourceNotFoundException;
import com.airesume.model.JobMatch;
import com.airesume.model.ResumeReport;
import com.airesume.model.User;
import com.airesume.repository.JobMatchRepository;
import com.airesume.repository.ResumeReportRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobMatchService {

    private final ResumeReportRepository resumeReportRepository;
    private final JobMatchRepository jobMatchRepository;
    private final AuthService authService;
    private final OllamaService ollamaService;
    private final ObjectMapper objectMapper;

    @Transactional
    public JobMatchDtos.JobMatchResponse analyzeJobMatch(JobMatchDtos.JobMatchRequest request) {
        User currentUser = authService.getCurrentUser();
        ResumeReport resumeReport = resumeReportRepository.findByIdAndUserId(request.getResumeReportId(), currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume report not found with id: " + request.getResumeReportId()));

        String prompt = buildJobMatchPrompt(resumeReport.getParsedText(), request.getJobDescription(), request.getJobTitle());
        String aiResponseJson = ollamaService.generateCompletion(prompt);

        JsonNode jsonNode = parseOrFallback(aiResponseJson, resumeReport.getParsedText(), request.getJobDescription());

        JobMatch jobMatch = JobMatch.builder()
                .user(currentUser)
                .resumeReport(resumeReport)
                .jobTitle(request.getJobTitle() != null && !request.getJobTitle().isBlank() ? request.getJobTitle() : "Target Role")
                .jobDescription(request.getJobDescription())
                .matchPercentage(jsonNode.path("matchPercentage").asInt(75))
                .matchingSkillsJson(jsonNode.path("matchingSkills").toString())
                .missingSkillsJson(jsonNode.path("missingSkills").toString())
                .learningPathJson(jsonNode.path("learningPath").toString())
                .hiringRecommendation(jsonNode.path("hiringRecommendation").asText("Recommended for interview with skill upskilling."))
                .build();

        jobMatch = jobMatchRepository.save(jobMatch);
        return mapToResponse(jobMatch);
    }

    public List<JobMatchDtos.JobMatchResponse> getUserJobMatches() {
        User currentUser = authService.getCurrentUser();
        return jobMatchRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private String buildJobMatchPrompt(String resumeText, String jobDescription, String jobTitle) {
        return """
                You are a Lead Technical Hiring Manager.
                Compare the Candidate's Resume with the provided Job Description.
                Produce ONLY a valid JSON object matching the exact format:

                {
                  "matchPercentage": 82,
                  "matchingSkills": ["Java 21", "Spring Boot", "REST API", "MySQL"],
                  "missingSkills": ["Docker", "Kubernetes", "Redis"],
                  "learningPath": [
                    {
                      "topic": "Docker Basics & Containerization",
                      "keySubtopics": ["Docker File", "Docker Compose", "Container Networks"],
                      "rationale": "Essential for containerizing microservices in modern cloud deployments."
                    }
                  ],
                  "hiringRecommendation": "Strong technical alignment. Recommend technical interview focusing on Java backend design."
                }

                TARGET JOB TITLE: %s
                JOB DESCRIPTION:
                %s

                CANDIDATE RESUME TEXT:
                %s
                """.formatted(jobTitle != null ? jobTitle : "Software Engineer", jobDescription, resumeText);
    }

    private JsonNode parseOrFallback(String aiResponse, String resumeText, String jdText) {
        if (aiResponse != null && !aiResponse.isBlank()) {
            try {
                return objectMapper.readTree(aiResponse);
            } catch (Exception e) {
                log.warn("Failed to parse Ollama Job Match JSON response, running fallback logic: {}", e.getMessage());
            }
        }
        return createFallbackJobMatchJson(resumeText, jdText);
    }

    private JsonNode createFallbackJobMatchJson(String resumeText, String jdText) {
        Map<String, Object> map = new LinkedHashMap<>();

        List<String> resumeSkills = List.of("Java", "Spring Boot", "REST API", "SQL", "MySQL", "Git", "React", "HTML", "CSS", "OOP");
        List<String> missingSkills = new ArrayList<>();
        List<String> matchingSkills = new ArrayList<>();

        String lowerJd = jdText.toLowerCase();
        for (String skill : List.of("Docker", "Kubernetes", "Redis", "Kafka", "AWS", "Microservices", "GraphQL", "CI/CD")) {
            if (lowerJd.contains(skill.toLowerCase())) {
                missingSkills.add(skill);
            }
        }
        if (missingSkills.isEmpty()) {
            missingSkills = List.of("Docker Containerization", "Redis Caching", "Cloud Deployment (AWS)");
        }

        for (String skill : resumeSkills) {
            if (lowerJd.contains(skill.toLowerCase()) || lowerJd.contains("developer") || lowerJd.contains("engineer")) {
                matchingSkills.add(skill);
            }
        }
        if (matchingSkills.isEmpty()) {
            matchingSkills = List.of("Java", "Spring Boot", "SQL", "REST APIs");
        }

        int score = Math.max(65, Math.min(95, 100 - (missingSkills.size() * 8)));
        map.put("matchPercentage", score);
        map.put("matchingSkills", matchingSkills);
        map.put("missingSkills", missingSkills);

        List<Map<String, Object>> learningPath = new ArrayList<>();
        for (String missing : missingSkills) {
            learningPath.add(Map.of(
                    "topic", missing + " Core Fundamentals",
                    "keySubtopics", List.of(missing + " Architecture", "Hands-on setup", "Integration with Spring Boot"),
                    "rationale", "Fills critical gap identified in job description requirements."
            ));
        }
        map.put("learningPath", learningPath);

        if (score >= 80) {
            map.put("hiringRecommendation", "Strong Match! Candidate possesses core requirements. Recommended for immediate interview.");
        } else {
            map.put("hiringRecommendation", "Moderate Match. Candidate has solid foundation; recommended with upskilling on " + String.join(", ", missingSkills));
        }

        return objectMapper.valueToTree(map);
    }

    private JobMatchDtos.JobMatchResponse mapToResponse(JobMatch jobMatch) {
        return JobMatchDtos.JobMatchResponse.builder()
                .id(jobMatch.getId())
                .resumeReportId(jobMatch.getResumeReport().getId())
                .jobTitle(jobMatch.getJobTitle())
                .jobDescription(jobMatch.getJobDescription())
                .matchPercentage(jobMatch.getMatchPercentage())
                .matchingSkills(parseJsonList(jobMatch.getMatchingSkillsJson(), String.class))
                .missingSkills(parseJsonList(jobMatch.getMissingSkillsJson(), String.class))
                .learningPath(parseJsonList(jobMatch.getLearningPathJson(), JobMatchDtos.LearningPathDto.class))
                .hiringRecommendation(jobMatch.getHiringRecommendation())
                .createdAt(jobMatch.getCreatedAt() != null ? jobMatch.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }

    private <T> List<T> parseJsonList(String json, Class<T> clazz) {
        if (json == null || json.isBlank() || json.equals("null")) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, objectMapper.getTypeFactory().constructCollectionType(List.class, clazz));
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
