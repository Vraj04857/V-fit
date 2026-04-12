package com.vfit.modules.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("V-Fit — Reset Your Password");

            String htmlContent = buildResetEmailHtml(resetLink);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset email sent to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send reset email. Please try again later.");
        }
    }

    private String buildResetEmailHtml(String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #FAF9F0; margin: 0; padding: 0; }
                    .container { max-width: 520px; margin: 40px auto; background: #FFFFFF; border-radius: 12px;
                                 border: 1px solid rgba(44,44,26,0.12); overflow: hidden; }
                    .header { background: #3D5A3E; padding: 32px; text-align: center; }
                    .header h1 { color: #FAF9F0; font-family: serif; font-size: 28px; margin: 0; }
                    .body { padding: 32px; }
                    .body p { color: #2C2C1A; font-size: 15px; line-height: 1.6; }
                    .btn { display: inline-block; background: #3D5A3E; color: #FAF9F0 !important;
                           padding: 14px 32px; border-radius: 8px; text-decoration: none;
                           font-weight: 600; font-size: 15px; margin: 24px 0; }
                    .footer { padding: 20px 32px; border-top: 1px solid rgba(44,44,26,0.08);
                              font-size: 12px; color: #7A7A6A; text-align: center; }
                    .link-text { word-break: break-all; font-size: 13px; color: #7A7A6A; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>V-Fit</h1>
                    </div>
                    <div class="body">
                        <p>Hi there,</p>
                        <p>We received a request to reset your V-Fit password.
                           Click the button below to choose a new password:</p>
                        <div style="text-align: center;">
                            <a href="%s" class="btn">Reset Password</a>
                        </div>
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p class="link-text">%s</p>
                        <p>This link will expire in <strong>30 minutes</strong>.</p>
                        <p>If you didn't request this, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        &copy; 2026 V-Fit — Smart Fitness &amp; Diet Planner
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetLink, resetLink);
    }
}