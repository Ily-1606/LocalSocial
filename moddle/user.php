<?php
session_start();
$data = array();
include_once("functions.php");
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    if ($action == "get_list_user") {
        if (check_user_login()) {
            if (isset($_GET["next"])) {
                //   $next =
            }
            include_once("../_connect.php");
            $data["status"] = true;
            $data["data"] = array();
            $id_user = $_SESSION["id"];
            $rs = mysqli_query($conn, "SELECT * FROM table_account WHERE id != $id_user LIMIT 0,10");
            while ($row = mysqli_fetch_array($rs)) {
                $arr = array();
                $arr["avatar"] = $row["avatar"];
                $arr["fname"] = $row["first_name"];
                $arr["lname"] = $row["last_name"];
                $arr["fullname"] = $row["first_name"] . " " . $row["last_name"];
                $arr["id"] = $row["id"];
                array_push($data["data"], $arr);
            }
        } else {
            $data["status"] = false;
            $data["msg"] = "Please login againt.";
        }
    } elseif ($action == "search_user") {
        if (isset($_POST["email"])) {
            include_once("../_connect.php");
            $email = mysqli_real_escape_string($conn, $_POST["email"]);
            if (check_user_login()) {
                $id_user = $_SESSION["id"];
                $rs = mysqli_query($conn, "SELECT * FROM table_account WHERE id != $id_user AND email = '$email' LIMIT 1");
                if (mysqli_num_rows($rs)) {
                    $data["status"] = true;
                    $data["data"] = array();
                    while ($row = mysqli_fetch_array($rs)) {
                        $arr = array();
                        $arr["avatar"] = $row["avatar"];
                        $arr["fname"] = $row["first_name"];
                        $arr["lname"] = $row["last_name"];
                        $arr["fullname"] = $row["first_name"] . " " . $row["last_name"];
                        $arr["id"] = $row["id"];
                        array_push($data["data"], $arr);
                    }
                } else {
                    $data["status"] = false;
                    $data["msg"] = "Not found user.";
                }
            } else {
                $data["status"] = false;
                $data["msg"] = "Please login againt.";
            }
        } else {
            $data["status"] = false;
            $data["msg"] = "Email is invalid.";
        }
    } elseif ($action == "get_avatar") {
        if (isset($_GET["user_id"])) {
            include_once("../_connect.php");
            $user_id = mysqli_real_escape_string($conn, $_GET["user_id"]);
            if (check_user_login()) {
                $rs = mysqli_query($conn, "SELECT * FROM table_account WHERE id = $user_id LIMIT 1");
                if (mysqli_num_rows($rs)) {
                    $row = mysqli_fetch_assoc($rs);
                    header("Location: " . $row["avatar"]);
                    die;
                } else {
                    header("Location: /assets/img/male.png");
                    die;
                }
            } else {
                header("Location: /assets/img/male.png");
                die;
            }
        } else {
            header("Location: /assets/img/male.png");
            die;
        }
        die;
    } elseif ($action == "update_proflie") {
        if (isset($_POST["old_password"]) && isset($_POST["new_password"]) && isset($_POST["re_new_password"])) {
            include_once("../_connect.php");
            $old_password = mysqli_real_escape_string($conn, $_POST["old_password"]);
            $new_password = mysqli_real_escape_string($conn, $_POST["new_password"]);
            $re_new_password = mysqli_real_escape_string($conn, $_POST["re_new_password"]);
            if (check_user_login()) {
                $id_user = $_SESSION["id"];
                $rs = mysqli_query($conn, "SELECT * FROM table_account WHERE id = $id_user LIMIT 1");
                $rs = mysqli_fetch_assoc($rs);
                if (isset($_FILES["avatar"])) {
                    if ($_FILES["avatar"]["error"] == 0) {
                        $imageFileType = strtolower(pathinfo($_FILES["avatar"]["name"], PATHINFO_EXTENSION));
                        if ($imageFileType == "jpg" || $imageFileType = "jpeg" || $imageFileType == "png") {
                            $now = time();
                            $file_name = "/storage/avatar/for_user_$id_user-$now.$imageFileType";
                            $file_face = "/storage/face/for_user_$id_user-$now.$imageFileType";
                            if (move_uploaded_file($_FILES["avatar"]["tmp_name"], $_SERVER["DOCUMENT_ROOT"] . "/$file_face")) {
                                chmod($_SERVER["DOCUMENT_ROOT"] . "/storage", 0777);
                                if (mysqli_query($conn, "UPDATE table_account SET face_recognition = '$file_face' WHERE id = $id_user")) {
                                    if ($rs["face_recognition"] != NULL && file_exists(".." . $rs["face_recognition"]))
                                        unlink(".." . $rs["face_recognition"]);
                                    resize_image($_SERVER["DOCUMENT_ROOT"] . "/$file_face", "100", "100", $_SERVER["DOCUMENT_ROOT"] . "/$file_name");
                                    if (mysqli_query($conn, "UPDATE table_account SET avatar = '$file_name' WHERE id = $id_user")) {
                                        if ($rs["avatar"] != "/assets/img/male.png" && file_exists(".." . $rs["avatar"]))
                                            unlink(".." . $rs["avatar"]);
                                        $data["status"] = true;
                                        $data["msg"] = "Update success.";
                                    }
                                } else {
                                    $data["status"] = false;
                                    $data["msg"] = "Something went wrong.";
                                }
                            } else {
                                $data["status"] = false;
                                $data["msg"] = "Something went wrong.";
                            }
                        } else {
                            $data["status"] = false;
                            $data["msg"] = "Only upload image.";
                        }
                        //$img = resize_image($_FILES["av"], 200, 200);
                    } else {
                        $data["status"] = false;
                        $data["msg"] = "Upload avatar failed.";
                    }
                }
                if ($old_password != "" && $new_password != "" && $re_new_password != "") {
                    $old_password = md5($old_password);
                    if ($new_password == $re_new_password) {
                        $new_password = md5($new_password);
                        $rs = mysqli_query($conn, "SELECT * FROM table_account WHERE id = $id_user AND `password` = '$old_password' LIMIT 1");
                        if (mysqli_num_rows($rs)) {
                            $rs = mysqli_query($conn, "UPDATE table_account SET `password` = '$new_password' WHERE id = $id_user");
                            if ($rs) {
                                $data["status"] = true;
                                $data["msg"] = "Update account success.";
                            } else {
                                $data["status"] = false;
                                $data["msg"] = "Something went wrong.";
                            }
                        } else {
                            $data["status"] = false;
                            $data["msg"] = "Old password wrong.";
                        }
                    } else {
                        $data["status"] = false;
                        $data["msg"] = "New password and retype new password wrong.";
                    }
                }
            } else {
                $data["status"] = false;
                $data["msg"] = "Please login againt.";
            }
        } else {
            $data["status"] = false;
            $data["msg"] = "Please enter field data.";
        }
    } elseif ($action == "login_with_facerecogniton") {
        if (isset($_POST["file"])) {
            include_once("../_connect.php");
            include_once("functions.php");
            $output_file = $_SERVER["DOCUMENT_ROOT"] . "/storage/face_login/face_login_" . time() . ".jpeg";
            $file = base64_decode($_POST["file"]);
            $file = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $file));
            file_put_contents($output_file, $file);
            $rs = mysqli_query($conn, "SELECT * FROM table_account WHERE face_recognition is not NULL");
            $faces = [];
            while ($row = mysqli_fetch_array($rs)) {
                array_push($faces, array("path" => $_SERVER["DOCUMENT_ROOT"] . "/" . $row["face_recognition"],"id"=> $row["id"]));
            }
            $faces = json_encode($faces);
            $result = json_decode(send_to_face_recognition($output_file, $faces), true);
            if ($result["face_found_in_image"] == true) {
                if ($result["is_picture_match"] == true) {
                    $rs = mysqli_query($conn, "SELECT * FROM table_account WHERE id ='" . $result["who_match"] . "'");
                    $row = mysqli_fetch_assoc($rs);
                    $_SESSION["id"] = $row["id"];
                    $_SESSION["email"] = $row["email"];
                    $data["status"] = true;
                    $data["msg"] = "Login success.";
                    $data["position"] = $result["position_face"];
                } else {
                    $data["status"] = false;
                    $data["msg"] = "Face not match.";
                }
            } else {
                $data["status"] = false;
                $data["msg"] = "No faces in picture.";
            }
            unlink($output_file);
        } else {
            $data["status"] = false;
            $data["msg"] = "Please enter field data.";
        }
    } else {
        $data["status"] = false;
        $data["msg"] = "Unknow this action.";
    }
}
echo json_encode($data);
