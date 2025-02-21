<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow cross-origin requests

// Database connection
$host = 'localhost';
$dbname = 'smart_campus';
$username = 'root'; // Default XAMPP MySQL username
$password = '';     // Default XAMPP MySQL password (empty)

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch all locations
    $stmt = $pdo->query("SELECT id, name, category, latitude, longitude, description FROM locations");
    $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format coordinates as an array [latitude, longitude]
    foreach ($locations as &$location) {
        $location['coordinates'] = [
            (float)$location['latitude'],
            (float)$location['longitude']
        ];
        unset($location['latitude']); // Remove individual fields
        unset($location['longitude']);
    }

    echo json_encode($locations);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>