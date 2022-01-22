<?php
function render_message()
{
    return 0;
}
function check_user_login()
{
    if (isset($_SESSION["id"]) && isset($_SESSION["email"]))
        return true;
    return false;
}
function get_single_message($row)
{
    //echo json_encode($row);
    $arr = array();
    $arr["avatar"] = $row["avatar"];
    $arr["fname"] = $row["first_name"];
    $arr["lname"] = $row["last_name"];
    $arr["fullname"] = $row["first_name"] . " " . $row["last_name"];
    $arr["user_id"] = $row["user_id"];
    $arr["id_message"] = $row["id"];
    $arr["type"] = "show";
    if ($row["hidden"] == null)
        $arr["type"] = "no_message";
    else if ($row["hidden"] == 0)
        $arr["message_text"] = $row["message_text"];
    else
        $arr["type"] = "deleted";
    $arr["file"] = $row["attachment"];
    $arr["time_sent"] = $row["create_time"];
    $time = new DateTime($row["create_time"]);
    $arr["timestamp"] = $time->format('U');
    if ($_SESSION["id"] == $row["user_send"])
        $arr["ower_user"] = "me";
    else
        $arr["ower_user"] = "other";
    return $arr;
}
function render_messages($room_id, $next_page = null)
{
    global $conn;
    $data = array();
    $sub_query = "";
    if ($next_page != null) {
        $next_page = date("Y/m/d H:i:s", $next_page);
        $sub_query = " AND table_messages.create_time < '$next_page'";
    }
    $rs = mysqli_query($conn, "SELECT table_account.id AS user_id, table_account.avatar, table_account.first_name, table_account.last_name, table_messages.* FROM `table_messages` INNER JOIN table_account ON table_messages.user_send = table_account.id WHERE thread_id = $room_id $sub_query ORDER BY create_time DESC LIMIT 0,10");
    while ($row = mysqli_fetch_array($rs)) {
        $arr = get_single_message($row);
        array_push($data, $arr);
    }
    return $data;
}
function render_list_thread($id_user, $next_page = null)
{
    global $conn;
    $data = array();
    $sub_query = "";
    if ($next_page != null) {
        $next_page = date("Y/m/d H:i:s", $next_page);
        $sub_query = " AND table_messages.create_time < '$next_page'";
    }
    $rs_data = mysqli_query($conn, "SELECT * FROM table_thread WHERE JSON_SEARCH(member_list,'one', '$id_user') IS NOT NULL ORDER BY update_time DESC LIMIT 0,10");
    while ($row = mysqli_fetch_array($rs_data)) {
        $arr = array();
        $arr["list_user"] = array();
        $arr["message"] = array();
        $rs = mysqli_query($conn, "SELECT table_account.id AS user_id, table_account.avatar, table_account.first_name, table_account.last_name, table_messages.* FROM `table_messages` INNER JOIN table_account ON table_messages.user_send = table_account.id WHERE thread_id = " . $row["id"] . " ORDER BY create_time DESC LIMIT 1");
        $rs = mysqli_fetch_assoc($rs);
        $arr["message"] = get_single_message($rs);
        $info_user = array();
        if ($row["type"] == "per_to_per") {
            $list_member = json_decode($row["member_list"]);
            for ($i = 0; $i < count($list_member); $i++) {
                $id = $list_member[$i];
                if ($id != $id_user) {
                    $rs = mysqli_query($conn, "SELECT * FROM table_account WHERE id = $id");
                    $rs = mysqli_fetch_assoc($rs);
                    $info_user["fullname"] = $rs["first_name"] . " " . $rs["last_name"];
                    $info_user["avatar"] = $rs["avatar"];
                    $info_user["room_id"] = $row["id"];
                    array_push($arr["list_user"], $info_user);
                }
            }
        } else {
            $info_user["fullname"] = $row["name_room"];
            $info_user["avatar"] = "/assets/img/male.png";
            $info_user["room_id"] = $row["id"];
            array_push($arr["list_user"], $info_user);
        }
        array_push($data, $arr);
    }
    return $data;
}
function update_last_thread($room_id)
{
    global $conn;
    $now = time();
    return mysqli_query($conn, "UPDATE table_thread SET update_time = $now WHERE id = $room_id");
}
function check_user_in_room($room_id)
{
    global $conn;
    $id_user = $_SESSION["id"];
    if (mysqli_num_rows(mysqli_query($conn, "SELECT * FROM table_thread WHERE JSON_SEARCH(member_list,'one', '$id_user') IS NOT NULL AND id = $room_id")))
        return true;
    return false;
}
function send_wss($message)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "http://localhost:1338/push",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => $message,
        CURLOPT_HTTPHEADER => array(
            "Content-Type: application/json"
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    echo $response;
}
function resize_image($file, $newwidth, $newheight, $filename)
{
    $image_type = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    list($width, $height) = getimagesize($file);
    $dst = imagecreatetruecolor($newwidth, $newheight);
    if ($image_type == "jpg" || $image_type == "jpeg") {
        $src = imagecreatefromjpeg($file);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
        imagejpeg($dst, $filename);
    } elseif ($image_type == "png") {
        $src = imagecreatefrompng($file);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
        imagepng($dst, $filename);
    }
}
function send_to_face_recognition($face, $faces)
{
    $data = array("face" => $face, "faces" => $faces);
    $data = http_build_query($data);
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "http://localhost:5001/",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => $data,
        CURLOPT_HTTPHEADER => array(
            "Content-Type: application/x-www-form-urlencoded",
            "Content-Length: " . strlen($data)
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    return $response;
}
function endsWith($string, $endString)
{
    $len = strlen($endString);
    if ($len == 0) {
        return true;
    }
    return (substr($string, -$len) === $endString);
}
