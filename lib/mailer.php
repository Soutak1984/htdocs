<?php
// lib/mailer.php
// Simple mail wrapper: uses PHPMailer (if installed via Composer) or falls back to PHP mail().
// To enable PHPMailer SMTP, run `composer require phpmailer/phpmailer` in the project root.

function send_mail($to, $subject, $body, $from = 'no-reply@yourdomain.com', $replyTo = null) {
    // try PHPMailer first
    if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
        require __DIR__ . '/../vendor/autoload.php';
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        try {
            // SMTP configuration - edit in config below
            $mail->isSMTP();
            $mail->Host = MAIL_SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = MAIL_SMTP_USER;
            $mail->Password = MAIL_SMTP_PASS;
            $mail->SMTPSecure = MAIL_SMTP_SECURE; // 'tls' or 'ssl'
            $mail->Port = MAIL_SMTP_PORT;

            $mail->setFrom($from);
            $mail->addAddress($to);
            if ($replyTo) $mail->addReplyTo($replyTo);
            $mail->isHTML(false);
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("PHPMailer error: " . $mail->ErrorInfo);
            return false;
        }
    } else {
        // fallback to simple mail()
        $headers = "From: $from\r\n";
        if ($replyTo) $headers .= "Reply-To: $replyTo\r\n";
        return mail($to, $subject, $body, $headers);
    }
}
/*
$mail->Host = 'smtp.hostinger.com';
$mail->Username = 'your_email@yourdomain.com';
$mail->Password = 'your_email_password';
$mail->Port = 465;  // or 587 for TLS */

