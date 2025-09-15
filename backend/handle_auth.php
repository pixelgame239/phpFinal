<?php
    session_start();
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    require "database_connect.php";
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['action'])?$data['action']:"";
    if ($action==="register"){
        $username = $data['username'];
        $password = $data['password'];
        $hashedPass = password_hash($password, PASSWORD_BCRYPT);
        try{
            $stmt = $pdo->prepare("Insert into users(username,user_password) values (:username, :password)");
            $stmt->execute([":username"=>$username, ":password"=>$hashedPass]);
            $newID = $pdo -> lastInsertId();
            $stmt = $pdo->prepare("Select cart_items from users where id = :id");
            $stmt->execute([':id'=>$newID]);
            $cartData = $stmt->fetch(PDO::FETCH_ASSOC);
            $cartArr = json_decode($cartData['cart_items'], true);
            setcookie(
                "userInfo",
                json_encode(["userID"=>$newID, "username"=>$username, "role"=>"Customer", "cart_items"=>$cartArr]),
                time() + (60*60*24),
                "/",
                "",
                false,
                true
            );
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
                $cartArr = json_decode($user['cart_items'], true);
                if($user['user_role']=="Admin"){
                    $_SESSION['userID'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['role'] = $user['user_role'];
                    $_SESSION['cart_items'] = $cartArr;
                }
                else{
                    setcookie(
                        "userInfo",
                        json_encode(["userID"=>$user['id'], "username"=>$user['username'], "role"=>$user['user_role'], "cart_items"=>$cartArr]),
                        time() + (60*60*24),
                        "/",
                        "",
                        false,
                        true
                    );
                }
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
        try{
            session_destroy();
            $_SESSION = [];
            if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(), 
                '',
                time() - (60*60*24),
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
                );
            }
            setcookie(
                "userInfo",
                "",
                time() - (60*60*24),
                "/",
                "",
                false,
                true
            );
            echo json_encode(["status"=>"OK", "message"=>"Logged out"]);
        } catch(Exception $e){
            echo json_encode(['status'=>"Error", "message"=>$e]);
        }
    }
    else{
        if (isset($_SESSION['role']) && $_SESSION['role']==='Admin') {
            $user = [
            "userID"       => $_SESSION['userID'],
            "username" => $_SESSION['username'],
            "role"     => "Admin",
            "cart_items"=>$_SESSION['cart_items']
            ];
        }
        elseif (isset($_COOKIE['userInfo'])) {
            $user = json_decode($_COOKIE['userInfo'], true);
            $user['role'] = 'Customer';
        }
        else{
            $user = null;
        }
        echo json_encode($user);
    }
?>