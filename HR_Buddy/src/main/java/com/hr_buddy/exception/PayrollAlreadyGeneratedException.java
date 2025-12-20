package com.hr_buddy.exception;

public class PayrollAlreadyGeneratedException extends RuntimeException {
    public PayrollAlreadyGeneratedException(String message) {
        super(message);
    }
}
