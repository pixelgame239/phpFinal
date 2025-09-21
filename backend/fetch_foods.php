<?php
    header("Access-Control-Allow-Origin: http://online-restaurant.great-site.net");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    require "database_connect.php";
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['action']) ? $data['action']:"";
    if ($data && isset($data['action'])) {
        if($data['action'] == 'bestSeller'){
            try{
                $stmt = $pdo->query("Select * from foods order by order_count desc limit 3");
                $topFoods = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($topFoods);
            }catch(Exception $e){
                echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
        } 
        elseif($data['action']=='fetchAll'){
            $stmt = $pdo->query("Select f.*, category_name from foods f join category c on f.cat_id = c.id");
            $allFoods = $stmt ->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($allFoods);
        }
    }
    else{
        if (isset($_GET['parameter']) && trim($_GET['parameter']) !== '') {
            try{
                $searchParam = $_GET['parameter'];
                $searchTerm  = "%{$searchParam}%";

                $stmt = $pdo->prepare("
                    SELECT f.*, c.category_name
                    FROM foods f
                    JOIN category c ON f.cat_id = c.id
                    WHERE f.food_name LIKE :search
                ");
                $stmt->execute([':search' => $searchTerm]);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } catch(Exception $e){
                echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
            }
            
        } elseif(isset($_GET['productID']) && is_numeric($_GET['productID'])){
            $productID = $_GET['productID'];
            $stmt = $pdo->prepare("Select * from foods where id = :productID");
            $stmt->execute([':productID'=>$productID]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } 
        else {
            $stmt = $pdo->query("
                SELECT f.*, c.category_name
                FROM foods f
                JOIN category c ON f.cat_id = c.id
            ");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    }
?>