package com.haircut.model;

import java.util.Map;

public class AnalyzeRequest {

    private String imageBase64;
    private Map<String, String> preferences;

    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }

    public Map<String, String> getPreferences() { return preferences; }
    public void setPreferences(Map<String, String> preferences) { this.preferences = preferences; }
}