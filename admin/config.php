<?php
// admin/config.php
// Edit these values for SMTP mail. If left empty, PHPMailer won't be used and send_mail will fallback to mail().
define('MAIL_SMTP_HOST', getenv('MAIL_SMTP_HOST') ?: 'smtp.example.com');
define('MAIL_SMTP_USER', getenv('MAIL_SMTP_USER') ?: 'smtp_user');
define('MAIL_SMTP_PASS', getenv('MAIL_SMTP_PASS') ?: 'smtp_pass');
define('MAIL_SMTP_PORT', getenv('MAIL_SMTP_PORT') ?: 587);
define('MAIL_SMTP_SECURE', getenv('MAIL_SMTP_SECURE') ?: 'tls'); // tls or ssl
