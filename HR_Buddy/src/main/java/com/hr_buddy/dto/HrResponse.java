package com.hr_buddy.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HrResponse {
    private Long id;
    private String name;
    private String username;
    private String departmentName;
    private boolean enabled;
}
