<?php
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    require "database_connect.php";
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents("php://input"), true);
    try{
        $stmt=$pdo->query("Select Count(*) as count from users where user_role = 'Customer'");
        $customerCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        $stmt=$pdo->query("Select Count(*) as count from orders");
        $orderCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        $stmt=$pdo->query("Select Sum(total) as revenue from orders");
        $revenueData = $stmt->fetch(PDO::FETCH_ASSOC)['revenue'];
        if($revenueData==null){
            $revenueData =0;
        }
        echo json_encode(["customerCount"=>$customerCount, "orderCount"=>$orderCount, "revenueData" => $revenueData]);
    }catch(PDOException $e){
        echo json_encode(['error'=>$e->getMessage()]);
    }
?>