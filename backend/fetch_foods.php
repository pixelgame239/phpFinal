<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    require "database_connect.php";
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'];
    if ($data && isset($data['action']) && $data['action'] == 'bestSeller') {
        $stmt = $pdo->query("Select * from foods order by order_count desc limit 3");
        $topFoods = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($topFoods);
    }
    else{
        echo json_encode(['error'=>"Invalid action"]);
    }
?>