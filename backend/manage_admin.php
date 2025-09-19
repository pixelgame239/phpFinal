<?php
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    require "database_connect.php";
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['action'])?$data['action']:"";
    if($action == "getTables"){
        try{
            $stmt = $pdo->prepare("SELECT table_name FROM information_schema.tables WHERE table_schema = 'final'");
            $stmt->execute();
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            echo json_encode([$tables]);
        } catch(PDOException $e){
            echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
    }
    if($action=="fetchTable"){
        try{
            $tableName = $data['tableName'];
            $stmt = $pdo ->prepare("Select Count(*) as totalRows from `$tableName`");
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $totalRows = (int)$row['totalRows'];
            $totalPages = ceil($totalRows / 20);
            $currentPage = (int)$data['currentPage'];
            $limit = 20;
            $offset = ($currentPage-1) *$limit;
            $stmt = $pdo->prepare("Select * from `$tableName` limit :limit offset :offset");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $tableContents = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["totalPages"=>$totalPages, "tableContents"=>$tableContents]);
        } catch(PDOException $e){
            echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
    }
    if($action == "updateOrderStatus"){
        try{
            $stmt = $pdo->prepare("Update orders set status = :newStatus where order_id = :orderID");
            $stmt->execute(["newStatus"=>$data['newStatus'], "orderID"=>$data['orderID']]);
            echo json_encode(["status"=>"OK", "message"=>"Updated"]);
        }catch(PDOException $e){
            echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
    }
    if($action == "getCategories"){
        try{
            $stmt = $pdo->prepare("Select * from category");
            $stmt->execute();
            $categoryData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($categoryData);
        }catch(PDOException $e){
            echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
    }
    if($action=="editCategory"){
        try{
            $stmt = $pdo->prepare("Update category set category_name = :categoryName where id = :categoryID");
            $stmt->execute(["categoryName"=>$data['categoryName'], "categoryID"=>$data['categoryID']]);
            echo json_encode(["status"=>"OK", "message"=>"Updated"]);
        }catch(PDOException $e){
            echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
    }
    if($action=="insertCategory"){
        try{
            $stmt = $pdo ->prepare("Insert into category(category_name) values (:categoryName);");
            $stmt->execute(["categoryName"=>$data['categoryName']]);
            echo json_encode(["status"=>"OK", "message"=>"Inserted"]);
        }catch(PDOException $e){
            echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
    }
    if($action=="deleteCategory"){
        try{
            $stmt =$pdo ->prepare("Delete from category where id = :categoryID");
            $stmt->execute(["categoryID"=>$data['categoryID']]);
            echo json_encode(["status"=>"OK", "message"=>"Deleted"]);
        } catch(PDOException $e){
            echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
    }
    if($action=="updateFood"){
        try{
            $foodData = $data['foodData'];
            $stmt =$pdo->prepare("Update foods set food_name= :food_name, cat_id = :cat_id, description = :description, price = :price where id = :id");
            $stmt->execute(["food_name"=>$foodData['food_name'], "cat_id"=>$foodData['cat_id'], "description"=>$foodData['description'], "price"=>$foodData['price'], "id"=>$foodData['id']]);
            echo json_encode(["status"=>"OK", "message"=>"Updated"]);
        }catch(PDOException $e){
            echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
    }
    if($action=="addFood"){
        
    }
?>