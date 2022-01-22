<?php
session_start();
$data = array();
include_once("functions.php");
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    if ($action == "upload") {
        if (isset($_POST["room_id"])) {
            $room_id = $_POST["room_id"];
            if (is_numeric($room_id)) {
                include_once("../_connect.php");
                include_once("functions.php");
                $room_id = mysqli_real_escape_string($conn, $room_id);
                if (check_user_login()) {
                    $id_user = $_SESSION["id"];
                    $info_thread = mysqli_query($conn, "SELECT * FROM table_thread WHERE id = $room_id");
                    if ($_FILES["data"]["error"] == 0) {
                        $imageFileType = strtolower(pathinfo($_FILES["data"]["name"],PATHINFO_EXTENSION));
                        $targetfile = "\/storage\/".time().".".$imageFileType;
                        move_uploaded_file($_FILES["data"]["tmp_name"], $_SERVER["DOCUMENT_ROOT"].$targetfile);
                        if (mysqli_num_rows($info_thread)) {
                            $rs = mysqli_query($conn, "INSERT INTO table_messages (`thread_id`,`attachment`,`user_send`) VALUES ($room_id,'$targetfile',$id_user)");
                            if ($rs) {
                                $id_message = mysqli_insert_id($conn);
                                $rs = mysqli_query($conn, "SELECT table_account.id AS user_id, table_account.avatar, table_account.first_name, table_account.last_name, table_messages.* FROM `table_messages` INNER JOIN table_account ON table_messages.user_send = table_account.id WHERE table_messages.id = $id_message");
                                $rs = mysqli_fetch_assoc($rs);
                                $array_m = array();
                                $info_thread = mysqli_fetch_assoc($info_thread);
                                $array_m["info_user"] = get_single_message($rs);
                                $array_m["send_to_user"] = json_decode($info_thread["member_list"]);
                                $array_m["type"] = "show_message";
                                $array_m["room_id"] = $room_id;
                                send_wss(json_encode($array_m));
                                $data["status"] = true;
                                $data["msg"] = "Message sent.";
                            } else {
                                $data["status"] = false;
                                $data["msg"] = "Wrong send message.";
                            }
                        } else {
                            $data["status"] = false;
                            $data["msg"] = "Error while upload file.";
                        }
                    } else {
                        $data["status"] = false;
                        $data["msg"] = "Room id not exist.";
                    }
                } else {
                    $data["status"] = false;
                    $data["msg"] = "Please login againt.";
                }
            } else {
                $data["status"] = false;
                $data["msg"] = "Room id is invalid.";
            }
        } else {
            $data["status"] = false;
            $data["msg"] = "Unknow room id.";
        }
    } else {
        $data["status"] = false;
        $data["msg"] = "Unknow this action.";
    }
}
echo json_encode($data);
