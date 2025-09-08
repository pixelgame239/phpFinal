<?php
    session_start();
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    require "database_connect.php";
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'];
    if ($action==="register"){
        $username = $data['username'];
        $password = $data['password'];
        $hashedPass = password_hash($password, PASSWORD_BCRYPT);
        try{
            $stmt = $pdo->prepare("Insert into users(username,user_password) values (:username, :password)");
            $stmt->execute([":username"=>$username, ":password"=>$hashedPass]);
            echo json_encode(["status"=>"OK", "message"=>"Successfully registered"]);
        } catch (PDOException $e){
            echo json_encode(["status"=>"Error", "message"=>"Username already exists"]);
        }
    }
    elseif($action ==="login"){
        $username = $data['username'];
        $password = $data['password'];
        $stmt = $pdo->prepare("Select * from users where username = :username");
        $stmt->execute([":username"=>$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $dbPass = $user["user_password"]??"Null";
        if($user){
            if(password_verify($password, $user['user_password'])){
                $_SESSION['userID'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['role'] = $user['user_role'];
                echo json_encode(["status"=>"OK", "message"=>"Logged in"]);
            }
            else{
                echo json_encode(["status"=>"Error", "message"=>"Password failed"]);
            }
        }
        else{
            echo json_encode(["status"=>"Error", "message"=>"Invalid credentials"]);
        }
    }
    else if($action ==="logout"){
        session_destroy();
        echo json_encode(["status"=>"OK", "message"=>"Logged out"]);
    }
?>