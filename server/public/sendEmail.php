<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Load environment variables
require __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Enable CORS for frontend requests
header("Access-Control-Allow-Origin: http://localhost:5173"); // Change this to your frontend URL
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Handle the actual POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['toEmail'], $data['subject'], $data['body'])) {
        echo json_encode(['success' => false, 'message' => 'Données manquantes.']);
        exit();
    }

    $toEmail = filter_var($data['toEmail'], FILTER_VALIDATE_EMAIL);
    $subject = htmlspecialchars($data['subject']);
    $body = htmlspecialchars($data['body']);

    if (!$toEmail) {
        echo json_encode(['success' => false, 'message' => 'Adresse e-mail invalide.']);
        exit();
    }

    $mail = new PHPMailer();

    try {
        // SMTP Configuration
        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';  // Corrected the host name
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = 'a150dae1d6ae64'; // Mailtrap username
        $mail->Password = '********9dbd'; // Mailtrap password (replace with your real password)

        // Set sender and recipient
        $mail->setFrom($_ENV['MAIL_FROM_ADDRESS'], $_ENV['MAIL_FROM_NAME']);
        $mail->addAddress($toEmail);

        // Email content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = nl2br($body); // Convert new lines to HTML <br> for better formatting

        // Send the email
        $mail->send();
        echo json_encode(['success' => true, 'message' => 'Email envoyé avec succès.']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => "Erreur lors de l'envoi de l'email : {$mail->ErrorInfo}"]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
}
