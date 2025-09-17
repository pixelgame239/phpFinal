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
    elseif($action=="confirmOrder"){
        try{
            $stmt = $pdo->prepare("Insert into orders(user_id, total, status, created_at) values (:userID,:total,'Pending', NOW())");
            $stmt->execute(["userID"=>$data['userID'], "total"=>$data['total']]);
            $newOrderID = $pdo -> lastInsertId();
            foreach($data['cartItems'] as $item){
                $stmt = $pdo->prepare("Insert into order_items(order_id, food_id, quantity, price) values (:orderID, :foodID, :quantity,:price)");
                $stmt->execute(["orderID"=>$newOrderID, "foodID"=>$item['id'], "quantity"=>$item['quantity'], "price"=>$item['itemPrice']]);
            }
            echo json_encode(["status"=>"OK", "message"=>"Successfully ordered"]);
        } catch(PDOException $e){
            echo json_encode(["status"=>"error", "message"=>$e->getMessage()]);
        }
    }
    elseif($action=="fetchOrders"){
        try{
            $stmt = $pdo->prepare("Select o.*, i.quantity, i.price, f.food_name, f.price as unitPrice from orders o join order_items i on o.order_id=i.order_id join foods f on f.id=i.food_id where o.user_id = :userID");
            $stmt->execute(['userID'=>$data['userID']]);
            $userOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($userOrders);
        } catch(PDOException $e){
            echo json_encode(['status'=>"error", "message"=>$e->getMessage()]);
        }
    }
?>