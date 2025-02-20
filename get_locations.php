<?php
header('Content-Type: application/json');
include 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM locations");
    $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($locations);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>