package com.hr_buddy.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hr_buddy.dto.CoverLetterResponse;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoverLetterService {

    private final OpenAiService openAiService;

    public CoverLetterResponse generateCoverLetter(
            String resumeText,
            String jobDescription) {

        String prompt = """
You are writing a professional cover letter.

STRICT RULES:
- Do NOT invent companies, tools, or experience
- Do NOT use placeholders like [Your Name] or [Company Name]
- Use ONLY information present in the resume text
- If something is not mentioned, do not assume it
- Focus on backend engineering relevance
- Keep it under 350 words
- Write in a confident, clear, non-generic tone

Job Description:
{JOB_DESCRIPTION}

Candidate Resume Text:
{RESUME_TEXT}

Output:
Return ONLY the cover letter text. No explanations.
""".formatted(resumeText, jobDescription);

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(List.of(new ChatMessage("user", prompt)))
                .maxTokens(600)
                .build();

        String content = openAiService
                .createChatCompletion(request)
                .getChoices()
                .get(0)
                .getMessage()
                .getContent();

        return new CoverLetterResponse(content);
    }
}
