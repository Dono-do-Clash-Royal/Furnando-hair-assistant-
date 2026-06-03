package com.haircut.service;

import com.haircut.model.AnalyzeRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.*;

@Service
public class ClaudeService {

    @Value("${openrouter.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public ClaudeService() {
        this.webClient = WebClient.builder().build();
    }

    public String analyzeHaircut(AnalyzeRequest request) {
        String prefsText = request.getPreferences() == null ? "não especificadas"
            : request.getPreferences().entrySet().stream()
                .map(e -> e.getKey() + ": " + e.getValue())
                .reduce((a, b) -> a + ", " + b)
                .orElse("não especificadas");

        String prompt = "Analisa esta foto do rosto de uma pessoa e recomenda cortes de cabelo. "
            + "Preferências: " + prefsText + ". "
            + "Responde APENAS com JSON válido sem markdown: "
            + "{\"formato_rosto\":\"oval\",\"descricao_formato\":\"frase\","
            + "\"cortes\":[{\"nome\":\"nome\",\"porque\":\"explicacao\",\"tags\":[\"t1\"],\"dificuldade\":\"Facil\"}],"
            + "\"dica_geral\":\"conselho\"}. Devolve 3 cortes.";

        Map<String, Object> imageUrl = new HashMap<>();
        imageUrl.put("url", "data:image/jpeg;base64," + request.getImageBase64());

        Map<String, Object> imagePart = new HashMap<>();
        imagePart.put("type", "image_url");
        imagePart.put("image_url", imageUrl);

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("type", "text");
        textPart.put("text", prompt);

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", Arrays.asList(textPart, imagePart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "google/gemma-3-27b-it");
        requestBody.put("messages", Collections.singletonList(message));

        try {
            Map response = webClient.post()
                .uri("https://openrouter.ai/api/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .header("HTTP-Referer", "http://localhost:5173")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

            if (response != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> msg = (Map<String, Object>) choices.get(0).get("message");
                    return (String) msg.get("content");
                }
            }
            throw new RuntimeException("Resposta vazia do OpenRouter");

        } catch (WebClientResponseException e) {
            System.err.println("Erro HTTP: " + e.getStatusCode());
            System.err.println("Resposta do servidor: " + e.getResponseBodyAsString());
            throw new RuntimeException("Erro OpenRouter: " + e.getResponseBodyAsString());
        }
    }
}