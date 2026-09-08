package com.airesume.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OllamaService {

    private final ObjectMapper objectMapper;

    @Value("${app.ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${app.ollama.model:gemma3}")
    private String defaultModel;

    public String generateCompletion(String prompt) {
        return generateCompletion(prompt, defaultModel);
    }

    public String generateCompletion(String prompt, String model) {
        String targetModel = (model != null && !model.isBlank()) ? model : defaultModel;
        String endpoint = ollamaBaseUrl + "/api/generate";

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", targetModel);
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            log.info("Sending request to Ollama endpoint: {} with model: {}", endpoint, targetModel);
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.has("response")) {
                    return sanitizeJsonResponse(root.get("response").asText());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to reach Ollama server at {}: {}. Falling back to smart default evaluation parser.", endpoint, e.getMessage());
        }

        return null;
    }

    /**
     * Helper method to clean Markdown formatting (e.g. ```json ... ```) often produced by LLMs.
     */
    public String sanitizeJsonResponse(String rawResponse) {
        if (rawResponse == null) return "{}";
        String trimmed = rawResponse.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }
}
