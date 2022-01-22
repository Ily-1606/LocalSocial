<?php
session_start();
include("../_connect.php");
if (isset($_POST["email"]) && isset($_POST["password"]) && isset($_POST["captcha"])) {
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $password = mysqli_real_escape_string($conn, $_POST["password"]);
    $captcha = $_POST["captcha"];
    $data = [];
    if ($captcha == $_SESSION["captcha"]) {
        unset($_SESSION["captcha"]);
        $password = md5($password);
        $result = mysqli_query($conn, "SELECT * FROM `table_account` WHERE `email` = '$email' AND `password` = '$password'");
        $row = mysqli_fetch_assoc($result);
        if (mysqli_num_rows($result) >= 1) {
            $_SESSION["email"] = $row["email"];
            $_SESSION["id"] = $row["id"];
            $data["status"] = true;
            $data["msg"] = "Login successfull, we will redirect in 3s!";
        } else {
            $data["status"] = false;
            $data["msg"] = "Email or password not match! Please try againt!";
        }
    } else {
        unset($_SESSION["captcha"]);
        $data["status"] = false;
        $data["msg"] = "Captcha wrong!";
    }
    echo json_encode($data);
}
