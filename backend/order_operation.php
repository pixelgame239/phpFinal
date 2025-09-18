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
            $stmt= $pdo->prepare("Select order_id, total, status, created_at from orders where user_id = :userID");
            $stmt->execute(['userID'=>$data['userID']]);
            $userOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $orderDetail = [];
            foreach($userOrders as $singleOrder){
                $orderID = $singleOrder['order_id'];
                $stmt = $pdo->prepare("Select i.quantity, i.price, f.id, f.food_name, f.price as unitPrice from order_items i join foods f on f.id=i.food_id where i.order_id = :orderID");
                $stmt->execute(['orderID'=>$orderID]);
                $tempOrder = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $orderDetail[] = [
                    'orderID'=>$singleOrder['order_id'],
                    'total'=>$singleOrder['total'],
                    'status'=>$singleOrder['status'],
                    'created_at'=>$singleOrder['created_at'],
                    'orderItems'=>$tempOrder
                ];
            }
            echo json_encode(['orderDetails'=>$orderDetail]);
        } catch(PDOException $e){
            echo json_encode(['status'=>"error", "message"=>$e->getMessage()]);
        }
    }
    elseif($action=="updateOrder"){
        try{
            $stmt = $pdo->prepare("Update orders set total = :total where order_id = :orderID");
            $stmt->execute(["total"=>$data['total'], "orderID"=>$data["orderID"]]);
            foreach($data['orderItems'] as $item){
                $stmt = $pdo->prepare("Update order_items set quantity= :quantity, price= :price where order_id = :orderID and food_id = :foodID");
                $stmt->execute(["quantity"=>$item['quantity'], "price"=>$item['price'], "orderID"=>$data["orderID"], "foodID"=>$item['id']]);
            }
            echo json_encode(["status"=>"OK", "message"=>"Update successfully"]);
        } catch(PDOException $e){
            echo json_encode(['status'=>"error", "message"=>$e->getMessage()]);
        }
    }
    elseif($action=="cancelOrder"){
        try{
            $stmt = $pdo ->prepare("Update orders set status = 'Cancelled' where order_id = :orderID");
            $stmt->execute(["orderID"=>$data['orderID']]);
            echo json_encode(["status"=>"OK", "message"=>"Cancel successfully"]);
        }   catch(PDOException $e){
            echo json_encode(['status'=>"error", "message"=>$e->getMessage()]);
        }
    }
    elseif($action=="deleteOrder"){
        try{
            $stmt = $pdo->prepare("Delete from orders where order_id= :orderID");
            $stmt->execute(["orderID"=>$data['orderID']]);
            echo json_encode(["status"=>"OK", "message"=>"Delete successfully"]);
        }   catch(PDOException $e){
            echo json_encode(['status'=>"error", "message"=>$e->getMessage()]);
        }
    }
?>