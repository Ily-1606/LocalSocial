<?php
session_start();
if (isset($_SESSION["id"]) && isset($_SESSION["email"])) {
    include("_connect.php");
    include("moddle/functions.php");
    $id = $_SESSION["id"];
    $email = $_SESSION["email"];
    $account = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM table_account WHERE id = $id"));

    //echo $email;
    $thread_id = "";
    if (isset($_GET["thread_id"])) {
        $thread_id = $_GET["thread_id"];
        if (is_numeric($thread_id)) {
            if (check_user_in_room($thread_id) == false) {
                unset($_SESSION["thread_id"]);
                header("Location: /");
                die;
            }
        } else {
            header("Location: /");
            die;
        }
    } else {
        if (isset($_SESSION["thread_id"])) {
            header("Location: /index.php?thread_id=" . $_SESSION["thread_id"]);
            die;
        }
    }
?>
    <html>
    <?php include("header.php"); ?>

    <body>
        <script>
            window.room_id = '<?php echo $thread_id; ?>';
            window.user_id = '<?php echo $id; ?>';
            window.auth_token = '<?php include("moddle/hash.php");
                                    echo encrypt($id . "-" . time()) ?>';
        </script>
        <div class="row border-bottom" style="background: #f8f9fa">
            <div class="col-12">
                <section class="navbar custom-navbar navbar-fixed-top col-12 pb-1" role="navigation">
                    <div class="row align-items-center col-12">
                        <div class="col-3 text-left">
                            <img src="/assets/img/LG.png" width="100px">
                        </div>
                        <div class="col-9 h4 text-center">
                            <span id="title_message"></span>
                            <span id="setting" class="text-white float-right">
                                <img src="/assets/img/cog.svg" width="30px" height="30px" />
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <div class="row main_chat">
            <div class="col-3 border-right frame_list_user p-0">
                <div class="row font-weight-bold mt-2 text-white">
                    <div class="col text-center">
                        <a href="#list_recent" id="list_recent_tab" class="pb-1 border-bottom active_list active" style="border-bottom-width: 2px!important;" aria-controls="list_recent" role="tab" data-toggle="tab" aria-selected="true">
                            Recently
                        </a>
                    </div>
                    <div class="col text-center">
                        <a href="#list_user" id="list_user_tab" class="pb-1 border-bottom active_list" style="border-bottom-width: 2px!important;" aria-controls="list_user" role="tab" data-toggle="tab" aria-selected="false">
                            All user
                        </a>
                    </div>
                </div>
                <div class="mt-4 ml-2">
                    <div class="list_user tab-pane fade" role="tabpanel" id="list_user">
                        <div class="loader bar">
                            <div></div>
                        </div>
                    </div>
                    <div class="list_recent tab-pane fade in active show" role="tabpanel" id="list_recent">
                        <div class="loader bar">
                            <div></div>
                        </div>
                    </div>
                </div>
                <div class="user_setting border-top">
                    <div class="user_room">
                        <div class="d-inline-block align-middle mr-2">
                            <img src="<?php echo $account["avatar"] ?>" width="60px" height="60px" class="rounded-circle">
                        </div>
                        <div class="d-inline-block align-middle">
                            <h4><?php echo $account["first_name"] . " " . $account["last_name"] ?></h4>
                            <small><a href="/logout.php">Log out</a></small> | 
                            <small><a href="#" id="profile">Profile</a></small>
                        </div>
                    </div>
                    <div class="add_group" data-toggle="modal" data-target="#modal-form">
                        <img src="/assets/img/plus.svg" width="40px" height="40px">
                    </div>
                </div>
            </div>
            <div class="col-9 frame_chat">
                <div class="message_list mt-3">
                    <div class="center_text_absolute" id="no_message">
                        No messages here!
                    </div>
                </div>
                <div class="input_chat row col-12 border-top d-none">
                    <div class="col-9">
                        <div class="submit_form">
                            <input type="text" name="chat_" placeholder="Enter message..." class="form-control input_s" id="chat_message">
                        </div>
                    </div>
                    <div class="col-3 row align-items-center text-right justify-content-end">
                        <input type="file" name="data" id="file" class="d-none">
                        <label class="attachment m-0 mr-4 cursor-pointer" for="file">
                            <img src="/assets/img/upload.svg" width="30px" height="30px" />
                        </label>
                        <div class="like cursor-pointer" id="btn-like">
                            <img src="/assets/img/like.svg" width="30px" height="30px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <?php include("footer.php"); ?>
    <script src="/assets/js/chat.js?ver=1" type="text/javascript"></script>
    <link rel="stylesheet" href="/assets/css/chat.css">

    </html>
<?php
} else {
    header("Location: /view/login.php");
}
