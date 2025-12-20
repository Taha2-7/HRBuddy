package com.hr_buddy.exception;

public class LeaveAlreadyProcessedException extends RuntimeException {

    public LeaveAlreadyProcessedException(String message) {
        super(message);
    }
}
