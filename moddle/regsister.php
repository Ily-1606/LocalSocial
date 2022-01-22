<?php
session_start();
include("../_connect.php");
include("functions.php");
$rs = mysqli_query($conn, "SELECT * FROM table_config");
$row = mysqli_fetch_assoc($rs);
$secure_code_base = $row["secure_code"];
$email_base = $row["email"];
if (isset($_POST["email"]) && isset($_POST["password"]) && isset($_POST["re_password"]) && isset($_POST["Firstname"]) && isset($_POST["Lastname"]) && isset($_POST["Securecode"]) && isset($_POST["telephone"]) && isset($_POST["gender"]) && isset($_POST["captcha"])) {
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $password = mysqli_real_escape_string($conn, $_POST["password"]);
    $re_password = mysqli_real_escape_string($conn, $_POST["re_password"]);
    $first_name = mysqli_real_escape_string($conn, $_POST["Firstname"]);
    $last_name = mysqli_real_escape_string($conn, $_POST["Lastname"]);
    $secure_code = mysqli_real_escape_string($conn, $_POST["Securecode"]);
    $phone_number = mysqli_real_escape_string($conn, $_POST["telephone"]);
    $gender = mysqli_real_escape_string($conn, $_POST["gender"]);
    $captcha = mysqli_real_escape_string($conn, $_POST["captcha"]);
    $data = array();
    if ($captcha == $_SESSION["captcha"]) {
        unset($_SESSION["captcha"]);
        if (filter_var($email, FILTER_VALIDATE_EMAIL) == false || endsWith($email, $email_base) == false) {
            $data["status"] = false;
            $data["msg"] = "Email invalid!";
            echo json_encode($data);
            die; //Thoát khỏi chương trình
        }
        if ($password != $re_password) {
            $data["status"] = false;
            $data["msg"] = "Password not match!";
            echo json_encode($data);
            die;
        }
        $password = md5($password);
        if ($secure_code != $secure_code_base) {
            $data["status"] = false;
            $data["msg"] = "Secure code wrong!";
            echo json_encode($data);
            die;
        }
        if ($gender != 1 && $gender != 2) {
            $data["status"] = false;
            $data["msg"] = "Gender wrong!";
            echo json_encode($data);
            die;
        }
        $result = mysqli_query($conn, "SELECT id FROM table_account WHERE email = '$email' LIMIT 1");
        if (mysqli_num_rows($result)) {
            $data["status"] = false;
            $data["msg"] = "Email is exist!";
            echo json_encode($data);
            die;
        }
        $result = mysqli_query($conn, "INSERT INTO `table_account` (`email`,`password`,`first_name`,`last_name`,`phone_number`,`gender`) VALUES ('$email','$password','$first_name','$last_name','$phone_number',$gender)");
        if ($result) {
            $data["status"] = true;
            $data["msg"] = "Regsister completed! We will redirect in 3s!";
            $result = mysqli_query($conn, "SELECT * FROM `table_account` WHERE email = '$email' LIMIT 1");
            $result = mysqli_fetch_assoc($result);
            $_SESSION["id"] = $result["id"];
            $_SESSION["email"] = $result["email"];
        } else {
            $data["status"] = false;
            $data["msg"] = "Regsister failed, please try againt!";
        }
        echo json_encode($data);
    } else {
        unset($_SESSION["captcha"]);
        $data["status"] = false;
        $data["msg"] = "Captcha wrong!";
        echo json_encode($data);
    }
}
