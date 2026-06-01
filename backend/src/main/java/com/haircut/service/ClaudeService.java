package com.haircut.service;

import com.haircut.model.AnalyzeRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
public class ClaudeService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    @Value("${anthropic.api.url}")
    private String apiUrl;

    @Value("${anthropic.model}")
    private String model;

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

        String prompt = """
            Analisa esta foto do rosto de uma pessoa e recomenda cortes de cabelo.
            
            Preferências indicadas: %s
            
            Responde APENAS com JSON válido, sem texto extra, sem markdown. Estrutura:
            {
              "formato_rosto": "oval/redondo/quadrado/coração/losango/oblongo",
              "descricao_formato": "1 frase descrevendo o formato detectado",
              "cortes": [
                {
                  "nome": "nome do corte",
                  "porque": "explicação em 2 frases do porquê funciona",
                  "tags": ["tag1","tag2","tag3"],
                  "dificuldade": "Fácil / Moderado / Exige cuidado"
                }
              ],
              "dica_geral": "1 conselho personalizado"
            }
            Devolve exatamente 3 cortes, ordenados do mais ao menos recomendado.
            """.formatted(prefsText);

        // Bloco de imagem
        Map<String, Object> imageSource = new HashMap<>();
        imageSource.put("type", "base64");
        imageSource.put("media_type", "image/jpeg");
        imageSource.put("data", request.getImageBase64());

        Map<String, Object> imageBlock = new HashMap<>();
        imageBlock.put("type", "image");
        imageBlock.put("source", imageSource);

        // Bloco de texto
        Map<String, Object> textBlock = new HashMap<>();
        textBlock.put("type", "text");
        textBlock.put("text", prompt);

        // Mensagem
        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", Arrays.asList(imageBlock, textBlock));

        // Body completo
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("max_tokens", 1000);
        requestBody.put("messages", Collections.singletonList(message));

        Map response = webClient.post()
            .uri(apiUrl)
            .header("x-api-key", apiKey)
            .header("anthropic-version", "2023-06-01")
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map.class)
            .block();

        if (response != null && response.containsKey("content")) {
            List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
            if (!content.isEmpty()) {
                return (String) content.get(0).get("text");
            }
        }

        throw new RuntimeException("Resposta inesperada da API da Anthropic");
    }
}