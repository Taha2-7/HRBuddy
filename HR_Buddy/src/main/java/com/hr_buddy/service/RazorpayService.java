package com.hr_buddy.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hr_buddy.entity.Payroll;
import com.hr_buddy.enums.PayrollStatus;
import com.hr_buddy.exception.PayrollNotFoundException;
import com.hr_buddy.repository.PayrollRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final PayrollRepository payrollRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public JSONObject createOrder(Long payrollId) {

        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new PayrollNotFoundException("Payroll not found"));

        if (payroll.getStatus() == PayrollStatus.PAID) {
            throw new RuntimeException("Payroll already paid");
        }

        try {
            RazorpayClient razorpayClient =
                    new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            int amountInPaise = (int) Math.round(payroll.getNetSalary() * 100);
            
            

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "payroll_" + payroll.getId());
            orderRequest.put("payment_capture", 1);

            Order order = razorpayClient.orders.create(orderRequest);

            JSONObject response = new JSONObject();
            response.put("orderId", order.get("id").toString());
            response.put("amount", amountInPaise);
            response.put("currency", "INR");
            response.put("key", razorpayKeyId);
            response.put("payrollId", payroll.getId());
            response.put("employeeName", payroll.getEmployee().getName());

            return response;

        } catch (RazorpayException e) {
            throw new RuntimeException("Razorpay Order Creation Failed: " + e.getMessage(), e);
        }
    }
}
