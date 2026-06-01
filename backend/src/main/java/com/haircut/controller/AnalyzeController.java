package com.haircut.controller;

import com.haircut.model.AnalyzeRequest;
import com.haircut.service.ClaudeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// @RestController diz ao Spring: "esta classe responde a pedidos HTTP com JSON"
// @RequestMapping define o prefixo de todos os endpoints desta classe
@RestController
@RequestMapping("/api")
public class AnalyzeController {

    // O Spring injeta automaticamente o ClaudeService aqui
    private final ClaudeService claudeService;

    public AnalyzeController(ClaudeService claudeService) {
        this.claudeService = claudeService;
    }

    // POST /api/analyze
    // O React envia a foto + preferências, este método processa e responde
    @PostMapping("/analyze")
    public ResponseEntity<String> analyze(@RequestBody AnalyzeRequest request) {
        try {
            // Valida que a imagem foi enviada
            if (request.getImageBase64() == null || request.getImageBase64().isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Imagem não encontrada\"}");
            }

            // Chama o serviço que fala com a API da Anthropic
            String result = claudeService.analyzeHaircut(request);

            // Devolve o JSON com os cortes recomendados
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.err.println("Erro ao analisar: " + e.getMessage());
            return ResponseEntity.internalServerError()
                .body("{\"error\": \"Erro interno. Verifica a API key.\"}");
        }
    }

    // GET /api/health - para confirmar que o backend está a funcionar
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("{\"status\": \"ok\"}");
    }
}
