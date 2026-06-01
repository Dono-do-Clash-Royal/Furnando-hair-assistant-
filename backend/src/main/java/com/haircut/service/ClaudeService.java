package com.haircut.service;

import com.haircut.model.AnalyzeRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

// @Service diz ao Spring que esta classe faz "trabalho de negócio"
// O Spring cria-a automaticamente e injeta-a onde for preciso
@Service
public class ClaudeService {

    // Lê os valores do application.properties
    @Value("${anthropic.api.key}")
    private String apiKey;

    @Value("${anthropic.api.url}")
    private String apiUrl;

    @Value("${anthropic.model}")
    private String model;

    // WebClient é o "HTTP client" do Spring - faz pedidos a outras APIs
    private final WebClient webClient;

    public ClaudeService() {
        this.webClient = WebClient.builder().build();
    }

    public String analyzeHaircut(AnalyzeRequest request) {
        // Constrói o texto das preferências para incluir no prompt
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

        // Monta o corpo do pedido para a API da Anthropic
        // O formato é: modelo, tokens máximos, e a mensagem com imagem + texto
        Map<String, Object> requestBody = Map.of(
            "model", model,
            "max_tokens", 1000,
            "messages", List.of(
                Map.of(
                    "role", "user",
                    "content", List.of(
                        // Bloco de imagem (base64)
                        Map.of(
                            "type", "image",
                            "source", Map.of(
                                "type", "base64",
                                "media_type", "image/jpeg",
                                "data", request.getImageBase64()
                            )
                        ),
                        // Bloco de texto (o prompt)
                        Map.of(
                            "type", "text",
                            "text", prompt
                        )
                    )
                )
            )
        );

        // Faz o pedido POST à API e espera pela resposta
        Map response = webClient.post()
            .uri(apiUrl)
            .header("x-api-key", apiKey)
            .header("anthropic-version", "2023-06-01")
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map.class)
            .block(); // .block() espera pela resposta (pedido síncrono)

        // Extrai o texto da resposta (estrutura: content[0].text)
        if (response != null && response.containsKey("content")) {
            List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
            if (!content.isEmpty()) {
                return (String) content.get(0).get("text");
            }
        }

        throw new RuntimeException("Resposta inesperada da API da Anthropic");
    }
}
