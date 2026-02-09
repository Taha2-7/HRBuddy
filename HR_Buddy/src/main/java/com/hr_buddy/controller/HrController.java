package com.hr_buddy.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hr_buddy.dto.AttendanceResponse;
import com.hr_buddy.dto.CoverLetterResponse;
import com.hr_buddy.dto.CreateEmployeeRequest;
import com.hr_buddy.dto.DepartmentResponse;
import com.hr_buddy.dto.EmployeeResponse;
import com.hr_buddy.dto.HrDashboardResponse;
import com.hr_buddy.dto.LeaveDecisionRequest;
import com.hr_buddy.dto.LeaveResponse;
import com.hr_buddy.dto.PayrollResponse;
import com.hr_buddy.dto.ResumeAnalysisResponse;
import com.hr_buddy.entity.LeaveRequest;
import com.hr_buddy.entity.Payroll;
import com.hr_buddy.security.CustomUserDetails;
import com.hr_buddy.service.AttendanceService;
import com.hr_buddy.service.CoverLetterService;
import com.hr_buddy.service.DepartmentService;
import com.hr_buddy.service.HrDashboardService;
import com.hr_buddy.service.HrService;
import com.hr_buddy.service.LeaveService;
import com.hr_buddy.service.PayrollService;
import com.hr_buddy.service.RazorpayService;
import com.hr_buddy.service.ResumeAnalysisService;
import com.hr_buddy.util.PdfTextExtractor;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/hr")
@AllArgsConstructor
public class HrController {

    private final HrService hrService;
    private final LeaveService leaveService;
    private final AttendanceService attendanceService;
    private final PayrollService payrollService;
    private final RazorpayService razorpayService;
    private final PdfTextExtractor pdfTextExtractor;
    private final ResumeAnalysisService resumeAnalysisService;
    private final CoverLetterService coverLetterService;
    private final HrDashboardService hrDashboardService;
    private final DepartmentService departmentService;
    
//    public HrController(HrService hrService, LeaveService leaveService, AttendanceService attendanceService, PayrollService payrollService, RazorpayService razorpayService) {
//        this.hrService = hrService;
//		this.leaveService = leaveService;
//		this.attendanceService = attendanceService;
//		this.payrollService = payrollService;
//		this.razorpayService = razorpayService;
//    }

    @GetMapping("/dashboard")
    public ResponseEntity<HrDashboardResponse> dashboard() {
        return ResponseEntity.ok(hrDashboardService.getDashboard());
    }

    @PostMapping("/attendance/mark")
    public ResponseEntity<String> markMyAttendance(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return ResponseEntity.ok(
                attendanceService.markAttendance(user.getUsername())
        );
    }

    @GetMapping("/attendance/status")
    public ResponseEntity<Boolean> attendanceStatus(
            @AuthenticationPrincipal CustomUserDetails user) {

        boolean marked =
                attendanceService.isAttendanceMarkedToday(user.getUsername());

        return ResponseEntity.ok(marked);
    }
    
    // ================================
    // EMPLOYEE MANAGEMENT
    // ================================
    @GetMapping("/employees")
    public List<EmployeeResponse> getAllEmployees() {
    	return hrService.getAllEmployees();
    }
    
    @PostMapping("/employee")
    public String createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
    	hrService.createEmployee(request);
        return "Employee created successfully";
    }
    
    @PutMapping("/employee/{id}/deactivate")
    public String deactivateEmployee(@PathVariable Long id) {
    	hrService.deactivateEmployee(id);
    	return "Employee account deactivated";
    }
    
    @GetMapping("/departments")
    public List<DepartmentResponse> getDepartments() {
        return hrService.getAllDepartments();
    }

    
    @GetMapping("/leaves")
    public List<LeaveResponse> allLeaves() {
        return leaveService.getAllLeavesForHr();
    }

    @PutMapping("/leaves/{id}")
    public String decideLeave(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id,
            @Valid @RequestBody LeaveDecisionRequest request
    ) {
        return leaveService.updateLeaveStatus(
                id,
                request.getStatus(),
                user.getUsername()
        );
    }
    
    @GetMapping("/attendance")
    public List<AttendanceResponse> attendanceByDate(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date,

            @RequestParam(required = false)
            Long departmentId
    ) {
        if (departmentId != null) {
            return attendanceService
                    .getAttendanceByDateAndDepartment(date, departmentId);
        }

        return attendanceService.getAttendanceByDate(date);
    }


    
    
 // ================================
    // GENERATE PAYROLL (ALL EMPLOYEES)
    // ================================
    @PostMapping("payroll/all")
    public ResponseEntity<String> generatePayrollForAll() {
        return ResponseEntity.ok(
                payrollService.generatePayrollForAllEmployees()
        );
    }

    // ================================
    // GENERATE PAYROLL (ONE EMPLOYEE)
    // ================================
    @PostMapping("payroll/{username}")
    public ResponseEntity<String> generatePayrollForEmployee(
            @PathVariable String username) {

        return ResponseEntity.ok(
                payrollService.generatePayrollForEmployee(username)
        );
    }

    // ================================
    // VIEW PAYROLL (ONE EMPLOYEE)
    // ================================
    @GetMapping("payroll/{username}")
    public ResponseEntity<PayrollResponse> getPayroll(
            @PathVariable String username) {

        return ResponseEntity.ok(
                payrollService.getPayrollForEmployee(username)
        );
    }

    // ==================================================
    // RAZORPAY – PAY SALARY
    // ==================================================
    @PostMapping("payroll/{payrollId}/pay")
    public ResponseEntity<?> paySalary(@PathVariable Long payrollId) {
    	return ResponseEntity.ok(razorpayService.createOrder(payrollId).toMap());
    }

    
    @PutMapping("/payroll/{payrollId}/markPaid")
    public String markPaid(@PathVariable Long payrollId) {
        return payrollService.markPayrollAsPaid(payrollId);
    }

    
    // ==================================================
    // Resume Analysis
    // ==================================================
    
    @PostMapping(
    	    value = "/resume/analyze",
    	    consumes = "multipart/form-data"
    	)
    	public ResponseEntity<ResumeAnalysisResponse> analyzeResumePdf(
    	        @RequestParam("file") MultipartFile file
    	) {

    	    if (file.isEmpty()) {
    	        throw new IllegalArgumentException("Resume PDF cannot be empty");
    	    }

    	    try {
    	        // ✅ Convert MultipartFile → InputStream
    	        String resumeText =
    	                pdfTextExtractor.extractText(file.getInputStream());

    	        ResumeAnalysisResponse response =
    	                resumeAnalysisService.analyze(resumeText);

    	        return ResponseEntity.ok(response);

    	    } catch (Exception e) {
    	    	e.printStackTrace();
    	        throw new RuntimeException("Failed to process resume PDF", e);
    	    }
    	}
    
    
    
    @PostMapping("/cover-letter")
    public ResponseEntity<CoverLetterResponse> generateCoverLetter(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobDescription") String jobDescription
    ) {
        try {
            String resumeText = pdfTextExtractor.extractText(
                    file.getInputStream());

            return ResponseEntity.ok(
                    coverLetterService.generateCoverLetter(
                            resumeText,
                            jobDescription
                    )
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate cover letter", e);
        }
    }


    
}
