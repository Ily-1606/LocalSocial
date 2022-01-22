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
        <link rel="stylesheet" href="/assets/dataTables/css/jquery.dataTables.min.css">

        <body>
            <div class="container">
                <div class="row justify-content-center">
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
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover" id="h_table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Permission</th>
                                    <th>Full name</th>
                                    <th>Phone number</th>
                                    <th>Email</th>
                                    <th>Gender</th>
                                    <th>Join in</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $stt = 1;
                                $res = mysqli_query($conn, "SELECT * FROM table_account");
                                while ($row = mysqli_fetch_array($res)) {
                                ?>
                                    <tr>
                                        <td><?php echo $stt; ?></td>
                                        <td><?php echo $row["role"]; ?></td>
                                        <td><img src="<?php echo $row["avatar"]; ?>" width="45px" height="45px" class="rounded-circle mr-1"><?php echo $row["first_name"] . " " . $row["last_name"]; ?></td>
                                        <td><?php echo $row["phone_number"]; ?></td>
                                        <td><?php echo $row["email"]; ?></td>
                                        <td><?php if ($row["gender"] == 1) echo "Male";
                                            else echo "Female"; ?></td>
                                        <td><?php echo $row["create_time"] ?></td>
                                    </tr>
                                <?php
                                    $stt++;
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                    <a href="index.php">Quản lý hệ thống</a>
                </div>
                <div id="result"></div>
            </div>
        </body>
        <?php include("../footer.php"); ?>
        <script src="/assets/dataTables/js/jquery.dataTables.min.js"></script>
        <script>
            $(document).ready(function() {
                $('#h_table').DataTable();
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
