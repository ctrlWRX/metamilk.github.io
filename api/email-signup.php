<?php
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Database configuration
$servername = "localhost"; // Change if needed
$db_username = "root"; // Change to your DB username
$db_password = "8169"; // Change to your DB password
$dbname = "metamilk"; // Based on your database name

// Get the email from the request
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email is required']);
    exit;
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

try {
    // Create connection
    $conn = new mysqli($servername, $db_username, $db_password, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Prepare SQL statement (prevents SQL injection)
    $stmt = $conn->prepare("INSERT INTO user_profiles (email) VALUES (?)");
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("s", $email);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(['message' => 'Thank you! Your email has been saved.']);
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
