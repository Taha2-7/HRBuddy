package com.hr_buddy.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hr_buddy.dto.ResumeAnalysisResponse;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

@Service
public class ResumeAnalysisService {

    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResumeAnalysisService(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    public ResumeAnalysisResponse analyze(String resumeText) {

        String prompt = """
Analyze the resume below and respond ONLY in valid JSON format:

{
  "skills": "comma separated skills",
  "strengths": "strength summary",
  "weaknesses": "weakness summary",
  "fitForRole": "job fit explanation",
  "score": number between 0 and 100 representing overall fit

}

Resume:
""" + resumeText;

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(List.of(new ChatMessage("user", prompt)))
                .maxTokens(500)
                .build();

        String gptResponse = openAiService
                .createChatCompletion(request)
                .getChoices()
                .get(0)
                .getMessage()
                .getContent();

        try {
            return objectMapper.readValue(
                    gptResponse,
                    ResumeAnalysisResponse.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse resume analysis response", e);
        }
    }
}
