<?php
session_start();
include("../_connect.php");
include("../moddle/functions.php");
if (check_user_login()) {
    $id = $_SESSION["id"];
    $account = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM table_account WHERE id = $id"));
    $role = $account["role"];
    if ($role == "admin") {
        if (isset($_POST["secure_code"]) && isset($_POST["email"])) {
            $secure_code = mysqli_real_escape_string($conn, $_POST["secure_code"]);
            $email = mysqli_real_escape_string($conn, $_POST["email"]);
            $time = time();
            $sql = "UPDATE table_config SET secure_code = '$secure_code', email = '$email', update_time = $time";
            if (mysqli_query($conn, $sql)) {
                echo '<script>toastr.success("Update success!");</script>';
            } else {
                echo '<script>toastr.error("Something went wrong!");</script>';
            }
        } else {
            echo '<script>toastr.error("Wrong value!");</script>';
        }
    } else {
        echo '<script>toastr.error("Access denied!");</script>';
    }
} else {
    echo '<script>toastr.error("Access denied!");</script>';
}
