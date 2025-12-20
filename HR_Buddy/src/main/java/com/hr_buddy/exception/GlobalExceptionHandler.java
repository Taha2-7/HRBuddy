package com.hr_buddy.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.hr_buddy.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	
	private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /* ================= VALIDATION ERRORS ================= */

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
          .getFieldErrors()
          .forEach(error ->
                  errors.put(error.getField(), error.getDefaultMessage())
          );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
    }

    /* ================= EMPLOYEE ================= */

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEmployeeNotFound(
            EmployeeNotFoundException ex) {

        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    /* ================= ATTENDANCE ================= */

    @ExceptionHandler(AttendanceAlreadyMarkedException.class)
    public ResponseEntity<ErrorResponse> handleAttendanceAlreadyMarked(
            AttendanceAlreadyMarkedException ex) {

        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    /* ================= LEAVE ================= */

    @ExceptionHandler(InvalidLeaveRequestException.class)
    public ResponseEntity<ErrorResponse> handleInvalidLeaveRequest(
            InvalidLeaveRequestException ex) {

        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(LeaveAlreadyProcessedException.class)
    public ResponseEntity<ErrorResponse> handleLeaveAlreadyProcessed(
            LeaveAlreadyProcessedException ex) {

        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    /* ================= PAYROLL ================= */

    @ExceptionHandler(PayrollAlreadyGeneratedException.class)
    public ResponseEntity<ErrorResponse> handlePayrollAlreadyGenerated(
            PayrollAlreadyGeneratedException ex) {

        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }
    
    @ExceptionHandler(PayrollNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlePayrollNotFound(
            PayrollNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                        HttpStatus.NOT_FOUND.value(),
                        ex.getMessage(),
                        LocalDateTime.now()
                ));
    }


    /* ================= FALLBACK ================= */

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(
            RuntimeException ex) {

    	log.error("🔥 Runtime exception occurred", ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    /* ================= HELPER METHOD ================= */

    private ResponseEntity<ErrorResponse> buildError(
            HttpStatus status,
            String message) {

        return ResponseEntity
                .status(status)
                .body(new ErrorResponse(
                        status.value(),
                        message,
                        LocalDateTime.now()
                ));
    }
}
