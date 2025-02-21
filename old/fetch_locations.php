/* fetch_locations.php */
<?php
$host = 'localhost';
$dbname = 'smart_campus';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit;
}

$query = $_GET['query'];
$sql = "SELECT * FROM locations WHERE name LIKE '%$query%' OR description LIKE '%$query%'";
$result = $conn->query($sql);

$locations = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $locations[] = $row;
    }
}

echo json_encode($locations);
$conn->close();
?>
