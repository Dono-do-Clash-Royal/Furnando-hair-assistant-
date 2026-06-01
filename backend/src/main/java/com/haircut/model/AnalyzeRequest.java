package com.haircut.model;

import lombok.Data;
import java.util.Map;

// @Data do Lombok gera automaticamente getters, setters, toString, etc.
// Poupa imenso código repetitivo!
@Data
public class AnalyzeRequest {

    // A foto em formato base64 (texto muito longo que representa a imagem)
    private String imageBase64;

    // As respostas do questionário, ex: {"comprimento": "Curto", "franja": "Não"}
    private Map<String, String> preferences;
}
