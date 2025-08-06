package com.example.booktablebackend.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

/**
 * @author :37824
 * @description:TODO
 * @date :2025/04/28 17:55
 */
@Slf4j
@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private VerificationCodeService verificationCodeService;

    @Value("${spring.mail.username}")
    private String mailAddress;
    public void sendVerificationEmail(String toEmail) throws MessagingException {
        String verificationCode = generateSixDigitString();
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(mailAddress);
        helper.setTo(toEmail);
        helper.setSubject("Welcome to BookTable! Please verify your email address");

        String content = "<p>Hi,</p>"
                + "<p>Thank you for signing up for <b>BookTable</b>!</p>"
                + "<p>Please use the following verification code to complete your registration:</p>"
                + "<h2 style='color: #2e6c80;'> " + verificationCode + "</h2>"
                + "<p>This code will expire in <b>5 minutes</b>.</p>"
                + "<br>"
                + "<p>If you did not create an account, please ignore this email.</p>"
                + "<br>"
                + "<p>Thanks,<br>The BookTable Team</p>";

        helper.setText(content, true);
        verificationCodeService.saveCode(toEmail, verificationCode);
        log.info("Email: "+toEmail+" Code: "+ verificationCode);
        mailSender.send(message);
    }

    public static String generateSixDigitString() {
        Random random = new Random();
        int number = random.nextInt(1000000);
        return String.format("%06d", number);
    }

    public void sendReservationSuccessEmail(String userName, String toEmail, String restaurantName, LocalDateTime dateTime, int numPeople, Long openingId) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);


        helper.setFrom(mailAddress);
        helper.setTo(toEmail);
        helper.setSubject("BookTable - Your reservation is confirmed!");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' HH:mm");

        String content = "<p>Hi, " + userName + "</p>"
                + "<p>Thank you for booking with <b>BookTable</b>!</p>"
                + "<p>Your reservation at <b>" + restaurantName + "</b> has been successfully confirmed.</p>"
                + "<p><b>Reservation Details:</b></p>"
                + "<ul>"
                + "<li>Date & Time: " + dateTime.format(formatter) + "</li>"
                + "<li>Number of People: " + numPeople + "</li>"
                + "</ul>"
                + "<p>If you wish to cancel your reservation, please click the button below:</p>"
                + "<p><a href=\"http://202lb-172909912.us-east-2.elb.amazonaws.com:8080/api/openings/cancel/" + openingId + "\" "
                + "style=\"display:inline-block;padding:10px 20px;background-color:#ff4d4f;color:white;text-decoration:none;"
                + "border-radius:5px;font-weight:bold;\">Cancel Booking</a></p>"
                + "<br>"
                + "<p>We look forward to serving you!</p>"
                + "<br>"
                + "<p>Best regards,<br>The BookTable Team</p>";


        helper.setText(content, true);

        mailSender.send(message);
    }

}
