package com.airesume.service;

import com.airesume.dto.InterviewDtos;
import com.airesume.exception.ResourceNotFoundException;
import com.airesume.model.InterviewQuestion;
import com.airesume.model.ResumeReport;
import com.airesume.model.User;
import com.airesume.repository.InterviewQuestionRepository;
import com.airesume.repository.ResumeReportRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewQuestionRepository interviewQuestionRepository;
    private final ResumeReportRepository resumeReportRepository;
    private final AuthService authService;
    private final OllamaService ollamaService;
    private final ObjectMapper objectMapper;

    @Transactional
    public InterviewDtos.InterviewGenerateResponse generateQuestions(InterviewDtos.InterviewGenerateRequest request) {
        User currentUser = authService.getCurrentUser();
        ResumeReport resumeReport = null;
        String resumeText = "";

        if (request.getResumeReportId() != null) {
            resumeReport = resumeReportRepository.findByIdAndUserId(request.getResumeReportId(), currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resume report not found with id: " + request.getResumeReportId()));
            resumeText = resumeReport.getParsedText();
        }

        List<String> requestedCategories = request.getCategories();
        if (requestedCategories == null || requestedCategories.isEmpty()) {
            requestedCategories = List.of("HR", "Java", "OOP", "DBMS", "SQL", "Spring Boot", "Project", "Behavioral");
        }

        String prompt = buildInterviewPrompt(resumeText, requestedCategories);
        String aiResponse = ollamaService.generateCompletion(prompt);

        List<InterviewDtos.InterviewQuestionDto> questionDtos = parseOrFallback(aiResponse, requestedCategories);

        List<InterviewQuestion> entityList = new ArrayList<>();
        for (InterviewDtos.InterviewQuestionDto dto : questionDtos) {
            InterviewQuestion q = InterviewQuestion.builder()
                    .user(currentUser)
                    .resumeReport(resumeReport)
                    .category(dto.getCategory())
                    .question(dto.getQuestion())
                    .sampleAnswer(dto.getSampleAnswer())
                    .difficulty(dto.getDifficulty() != null ? dto.getDifficulty() : "Medium")
                    .build();
            entityList.add(q);
        }

        entityList = interviewQuestionRepository.saveAll(entityList);

        List<InterviewDtos.InterviewQuestionDto> savedDtos = entityList.stream().map(q ->
                InterviewDtos.InterviewQuestionDto.builder()
                        .id(q.getId())
                        .category(q.getCategory())
                        .question(q.getQuestion())
                        .sampleAnswer(q.getSampleAnswer())
                        .difficulty(q.getDifficulty())
                        .build()
        ).toList();

        return InterviewDtos.InterviewGenerateResponse.builder()
                .resumeReportId(request.getResumeReportId())
                .questions(savedDtos)
                .build();
    }

    public List<InterviewDtos.InterviewQuestionDto> getUserQuestions(Long resumeReportId, String category) {
        User currentUser = authService.getCurrentUser();
        List<InterviewQuestion> questions;

        if (resumeReportId != null) {
            questions = interviewQuestionRepository.findByUserIdAndResumeReportId(currentUser.getId(), resumeReportId);
        } else if (category != null && !category.isBlank()) {
            questions = interviewQuestionRepository.findByUserIdAndCategory(currentUser.getId(), category);
        } else {
            questions = interviewQuestionRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        }

        return questions.stream().map(q ->
                InterviewDtos.InterviewQuestionDto.builder()
                        .id(q.getId())
                        .category(q.getCategory())
                        .question(q.getQuestion())
                        .sampleAnswer(q.getSampleAnswer())
                        .difficulty(q.getDifficulty())
                        .build()
        ).toList();
    }

    private String buildInterviewPrompt(String resumeText, List<String> categories) {
        return """
                You are a Principal Software Engineer and Interview Panel Chair.
                Generate targeted interview questions and detailed sample answers for the following categories: %s.
                Produce ONLY a valid JSON array matching the structure:

                [
                  {
                    "category": "Java",
                    "question": "How does ConcurrentHashMap achieve thread safety in Java 8+?",
                    "sampleAnswer": "In Java 8+, ConcurrentHashMap replaces segment locking with a combination of CAS (Compare-And-Swap) operations and synchronized blocks on individual bucket node heads, significantly improving concurrency throughput.",
                    "difficulty": "Hard"
                  }
                ]

                CANDIDATE RESUME CONTEXT:
                %s
                """.formatted(String.join(", ", categories), resumeText != null ? resumeText : "General Full Stack Developer Profile");
    }

    private List<InterviewDtos.InterviewQuestionDto> parseOrFallback(String aiResponse, List<String> categories) {
        if (aiResponse != null && !aiResponse.isBlank()) {
            try {
                JsonNode root = objectMapper.readTree(aiResponse);
                if (root.isArray()) {
                    List<InterviewDtos.InterviewQuestionDto> list = new ArrayList<>();
                    for (JsonNode node : root) {
                        list.add(InterviewDtos.InterviewQuestionDto.builder()
                                .category(node.path("category").asText("General"))
                                .question(node.path("question").asText(""))
                                .sampleAnswer(node.path("sampleAnswer").asText(""))
                                .difficulty(node.path("difficulty").asText("Medium"))
                                .build());
                    }
                    if (!list.isEmpty()) return list;
                }
            } catch (Exception e) {
                log.warn("Failed to parse Ollama interview questions JSON, using default question bank: {}", e.getMessage());
            }
        }
        return createFallbackQuestions(categories);
    }

    private List<InterviewDtos.InterviewQuestionDto> createFallbackQuestions(List<String> categories) {
        List<InterviewDtos.InterviewQuestionDto> list = new ArrayList<>();

        if (categories.contains("Java")) {
            list.add(InterviewDtos.InterviewQuestionDto.builder()
                    .category("Java")
                    .question("What is the difference between fail-fast and fail-safe iterators in Java?")
                    .sampleAnswer("Fail-fast iterators (e.g. ArrayList, HashMap) throw ConcurrentModificationException immediately if the underlying collection is modified during iteration. Fail-safe iterators (e.g. CopyOnWriteArrayList, ConcurrentHashMap) operate on a clone or snapshot of the collection, allowing iteration without throwing exceptions.")
                    .difficulty("Medium")
                    .build());
            list.add(InterviewDtos.InterviewQuestionDto.builder()
                    .category("Java")
                    .question("Explain Java 21 Virtual Threads and how they differ from Platform Threads.")
                    .sampleAnswer("Virtual Threads (JEP 444) are lightweight threads managed by the JVM rather than the OS kernel. Thousands or millions of virtual threads can run concurrently without high memory footprint, mounted dynamically onto underlying carrier platform threads during non-blocking execution.")
                    .difficulty("Hard")
                    .build());
        }

        if (categories.contains("Spring Boot")) {
            list.add(InterviewDtos.InterviewQuestionDto.builder()
                    .category("Spring Boot")
                    .question("How does Spring Boot auto-configuration work internally?")
                    .sampleAnswer("Spring Boot checks for classes on the classpath using `@EnableAutoConfiguration` and `@SpringBootApplication`. It inspects `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` and conditionally registers beans based on `@ConditionalOnClass`, `@ConditionalOnMissingBean`, and properties.")
                    .difficulty("Hard")
                    .build());
        }

        if (categories.contains("OOP")) {
            list.add(InterviewDtos.InterviewQuestionDto.builder()
                    .category("OOP")
                    .question("Explain the SOLID principles with practical Spring Boot examples.")
                    .sampleAnswer("Single Responsibility: Keep controllers thin and place domain logic in dedicated service classes. Open/Closed: Use interface polymorphism for strategy patterns without modifying core logic. Liskov Substitution: Ensure subclasses/implementations fulfill interface contracts. Interface Segregation: Keep granular interfaces. Dependency Inversion: Inject abstractions (interfaces) rather than concrete implementations.")
                    .difficulty("Medium")
                    .build());
        }

        if (categories.contains("DBMS") || categories.contains("SQL")) {
            list.add(InterviewDtos.InterviewQuestionDto.builder()
                    .category("DBMS")
                    .question("What are ACID properties in Relational Databases and how does InnoDB guarantee them?")
                    .sampleAnswer("Atomicity (undo log), Consistency (data constraints & foreign keys), Isolation (transaction isolation levels & MVCC / row-level locking), Durability (redo log flushing to disk).")
                    .difficulty("Medium")
                    .build());
            list.add(InterviewDtos.InterviewQuestionDto.builder()
                    .category("SQL")
                    .question("How would you optimize a slow running SQL query in MySQL?")
                    .sampleAnswer("1. Analyze execution plan using `EXPLAIN ANALYZE`. 2. Ensure proper B-Tree indexes exist on filtered/joined columns. 3. Avoid `SELECT *`. 4. Prevent wildcard prefix `LIKE '%term'`. 5. Optimize JOIN conditions and table stats.")
                    .difficulty("Medium")
                    .build());
        }

        if (categories.contains("Project")) {
            list.add(InterviewDtos.InterviewQuestionDto.builder()
                    .category("Project")
                    .question("Walk me through the architecture of your AI Resume Analyzer application and how you handled LLM response parsing.")
                    .sampleAnswer("The system uses a layered architecture (Controller -> Service -> Repository -> MySQL). PDF text is extracted using Apache PDFBox and dispatched via REST to local Ollama LLM. Strict JSON schema rules were enforced in the prompt, supported by Jackson serialization and a fallback heuristic extractor for reliability.")
                    .difficulty("Hard")
                    .build());
        }

        if (categories.contains("HR") || categories.contains("Behavioral")) {
            list.add(InterviewDtos.InterviewQuestionDto.builder()
                    .category("HR")
                    .question("Tell me about a time you faced a difficult technical bug right before a production deadline.")
                    .sampleAnswer("Use the STAR method: Situation (high priority production bug), Task (identify and patch root cause), Action (isolated using logging, created unit test reproducing error, implemented fix and verified via CI pipeline), Result (zero downtime deployment with regression test guarding future releases).")
                    .difficulty("Easy")
                    .build());
        }

        return list;
    }
}
