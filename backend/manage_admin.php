<?php
    header("Access-Control-Allow-Origin: http://online-restaurant.great-site.net");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    require "database_connect.php";
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action']??$_GET['action']??"";
    $uploadDir = __DIR__ .  '/assets/';
    $food_image_base_url = 'assets/';
    function get_food_image_filename($food_name) {
        $filename = strtolower($food_name);
        $filename = preg_replace('/[^\w\s]/u', '', $filename);
        $filename = preg_replace('/\s+/', '_', $filename);
        return $filename . '.jpg';
    }
    function handle_food_action($pdo, $is_insert) {
        $food_name = $_POST['food_name'] ?? '';
        $cat_id = $_POST['cat_id'] ?? '';
        $description = $_POST['description'] ?? '';
        $price = $_POST['price'] ?? '';
        $food_id = $_POST['id'] ?? null; 
        $image_file_data = $_FILES['food_image'] ?? null;
        $image_filename = get_food_image_filename($food_name);
        $full_upload_path = $GLOBALS['uploadDir'] . $image_filename;
        $db_image_path = $GLOBALS['food_image_base_url'] . $image_filename;
        if ($image_file_data && $image_file_data['error'] === UPLOAD_ERR_OK) {
            if (file_exists($full_upload_path)) {
                unlink($full_upload_path);
            }
            if (!move_uploaded_file($image_file_data['tmp_name'], $full_upload_path)) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Failed to upload image.']);
                return;
            }
        } else {
            if (!$is_insert && !($image_file_data && $image_file_data['error'] === UPLOAD_ERR_OK)) {
                $db_image_path = $_POST['food_image'] ?? ''; 
            }
        }
        if ($is_insert) {
            $stmt = $pdo->prepare("INSERT INTO foods (food_name, cat_id, description, price, food_image) VALUES (:foodName, :catID, :descr, :price, :foodImg)");
            $success = $stmt->execute(["foodName"=>$food_name, "catID"=>$cat_id, "descr"=>$description, "price"=>$price, "foodImg"=>$db_image_path]);
        } else {
            $stmt = $pdo->prepare("UPDATE foods SET food_name = :foodName, cat_id = :catID, description = :descr, price = :price, food_image = :foodImg WHERE id = :foodID");
            $success = $stmt->execute(["foodName"=>$food_name, "catID"=>$cat_id, "descr"=>$description, "price"=>$price, "foodImg"=>$db_image_path, "foodID"=>$food_id]);
        }
        if ($success) {
            echo json_encode(['status' => 'OK']);
        } else {
            echo json_encode(['status' => 'Error', 'message' => 'Database operation failed.']);
        }
    }
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
           handle_food_action($pdo, false);
        }catch(Exception $e){
            echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
    }
    if($action=="addFood"){
        try{
            handle_food_action($pdo, true);     
        }catch(Exception $e){
            echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
    }
    if($action=="deleteFood"){
        try{
            $stmt =$pdo->prepare("Delete from foods where id = :foodID");
            $stmt->execute(["foodID"=>$data['foodID']]);
            echo json_encode(["status"=>"OK", "message"=>"Deleted"]);
        }catch(PDOException $e){
            echo json_encode(["status"=>"Error", "message"=>$e->getMessage()]);
        }
    }
?>