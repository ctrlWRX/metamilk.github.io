<?php
header('Content-Type: application/json');

// Database configuration
$servername = "localhost"; // Change if needed
$db_username = "root"; // Change to your DB username
$db_password = ""; // Change to your DB password
$dbname = "metamilk_database"; // Based on your database name

// Get the email from the request
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || empty($data['email'])) {
  echo json_encode(['success' => false, 'message' => 'Email is required']);
  exit;
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(['success' => false, 'message' => 'Invalid email format']);
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
  $stmt = $conn->prepare(
    "INSERT INTO user_profiles (username, first_name, last_name, birthday, email, timezone)"
    . " VALUES (NULL, NULL, NULL, NULL, ?, NULL)"
  );
  
  if (!$stmt) {
    throw new Exception("Prepare failed: " . $conn->error);
  }
  
  $stmt->bind_param("s", $email);
  
  if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Email saved successfully']);
  } else {
    throw new Exception("Execute failed: " . $stmt->error);
  }
  
  $stmt->close();
  $conn->close();
  
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
