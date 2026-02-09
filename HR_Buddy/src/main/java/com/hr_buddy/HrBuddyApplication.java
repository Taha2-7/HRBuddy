package com.hr_buddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HrBuddyApplication {

	public static void main(String[] args) {
		SpringApplication.run(HrBuddyApplication.class, args);
	}

}
