package com.hr_buddy.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResumeAnalysisResponse {
    private String skills;
    private String strengths;
    private String weaknesses;
    private String fitForRole;
    private int score;
}
