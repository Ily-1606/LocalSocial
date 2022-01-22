<?php
session_start();
include("../_connect.php");
include("../moddle/functions.php");
if (check_user_login()) {
    $id = $_SESSION["id"];
    $account = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM table_account WHERE id = $id"));
    $role = $account["role"];
    if ($role == "admin") {
?>
        <html>
        <?php include("../header.php"); ?>

        <body>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-6">
                        <div class="row mb-4">
                            <div class="col-12">
                                <section class="navbar custom-navbar navbar-fixed-top col-12 pb-1" role="navigation">
                                    <div class="row align-items-center col-12">
                                        <div class="col-3 text-left">
                                            <img src="/assets/img/LG.png" width="100px">
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                        <form action="/moddle/admin.php" method="POST" id="form_ajax">
                            <div class="form-group">
                                <label for="secure_code">Secure code</label>
                                <input type="text" class="form-control" id="secure_code" name="secure_code" placeholder="Enter email">
                                <small id="emailHelp" class="form-text text-muted">Secure code for regsister.</small>
                            </div>
                            <div class="form-group">
                                <label for="email">Email valid</label>
                                <input type="text" class="form-control" id="email" name="email" placeholder="Your email of company">
                                <small id="emailHelp" class="form-text text-muted">Example: @gmail, @vku.udn.vn</small>
                            </div>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </form>
                        <a href="member.php">Quản lý người dùng</a>
                    </div>
                </div>
                <div id="result"></div>
            </div>
        </body>
        <?php include("../footer.php"); ?>
        <script>
            $(document).ready(function() {
                $("#form_ajax").submit(function() {
                    $.ajax({
                        url: $(this).attr("action"),
                        method: $(this).attr("method"),
                        data: $(this).serialize(),
                        success: function(e) {
                            $("#result").html(e);
                        },
                        error: function(e) {
                            console.info(e);
                            toastr.error("Conection error!");
                        }
                    });
                    return false;
                });
            });
        </script>

        </html>
<?php
    } else {
        die("Access denied!");
    }
} else {
    header("Location: /index.php");
}
