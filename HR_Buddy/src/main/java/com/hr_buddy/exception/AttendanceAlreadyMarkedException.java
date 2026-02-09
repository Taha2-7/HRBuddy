package com.hr_buddy.exception;

public class AttendanceAlreadyMarkedException extends RuntimeException {
    public AttendanceAlreadyMarkedException(String message) {
        super(message);
    }
}
