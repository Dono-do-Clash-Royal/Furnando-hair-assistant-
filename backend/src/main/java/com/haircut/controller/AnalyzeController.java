package com.haircut.controller;

import com.haircut.model.AnalyzeRequest;
import com.haircut.service.ClaudeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AnalyzeController {

    private final ClaudeService claudeService;

    public AnalyzeController(ClaudeService claudeService) {
        this.claudeService = claudeService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<String> analyze(@RequestBody AnalyzeRequest request) {
        try {
            if (request.getImageBase64() == null || request.getImageBase64().isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Imagem não encontrada\"}");
            }
            String result = claudeService.analyzeHaircut(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Erro completo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("{\"status\": \"ok\"}");
    }
}