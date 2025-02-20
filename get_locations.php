<?php
header('Content-Type: application/json');
include 'config.php';

try {
    $search = isset($_GET['search']) ? $_GET['search'] : '';

    $query = "SELECT * FROM locations WHERE name LIKE :search LIMIT 10";
    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
    $stmt->execute();

    $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($locations);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
