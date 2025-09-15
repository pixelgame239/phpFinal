<?php
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    require "database_connect.php";
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['action'])?$data['action']:"";
    if($action=="updateCart"){
        try{
            $stmt = $pdo->prepare("Update users set cart_items = :cartItems where id = :id");
            $stmt->execute(["cartItems"=>$data['cartItems'], "id"=>$data['userID']]);
            echo json_encode(["status"=>"OK", "message"=>"Add item successfully"]);
        } catch (PDOException $e){
            echo json_encode(["status"=>"error", "message"=>$e->getMessage()]);
        }
    }
?>