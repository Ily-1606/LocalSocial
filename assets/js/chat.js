(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);
var notify_audio = new Audio("/assets/sound/notify.ogg");
var notify_typing = new Audio("/assets/sound/typing.ogg");

function list_user_loader(id) {
    var object = $(id);
    $.ajax({
        url: "/moddle/user.php?action=get_list_user",
        success: function(e) {
            delete_loader_bar(id);
            e = JSON.parse(e);
            if (e.status == false)
                toastr.error(e.msg);
            e = e.data;
            for (i = 0; i < e.length; i++) {
                object.append('<div class="user_room room_chat" id="user_' + e[i].id + '" attr_for_type="user" attr_for_id="' + e[i].id + '"><div class="d-inline-block align-middle mr-2"><img src="' + e[i]["avatar"] + '" width="60px" height="60px" class="rounded-circle"></div><div class="d-inline-block align-middle"><h4>' + e[i]["fullname"] + '</h4></div></div>');
            }
        },
        error: function(e) {
            delete_loader_bar(id);
            error(e);
        }
    })
}

function list_thread(id) {
    var object = $(id);
    $.ajax({
        url: "/moddle/message.php?action=get_list_thread",
        success: function(e) {
            delete_loader_bar(id);
            e = JSON.parse(e);
            if (e.status == false)
                toastr.error(e.msg);
            e = e.data;
            if (e.length > 0) {
                for (i = 0; i < e.length; i++) {
                    object.append(render_message_status_text(e[i]))
                }
            } else {
                $("#list_user_tab").click();
            }
        },
        error: function(e) {
            delete_loader_bar(id);
            error(e);
        }
    })
}

function render_message_status_text(data) {
    try {
        if (data["message"].type == "no_message")
            return '<div class="user_room room_chat ' + (window.room_id == data["list_user"][0].room_id ? "room_active" : "") + '" id="user_' + data["list_user"][0].room_id + '" attr_for_type="room" attr_for_id="' + data["list_user"][0].room_id + '"><div class="d-inline-block align-middle mr-2"><img src="' + data["list_user"][0]["avatar"] + '" width="60px" height="60px" class="rounded-circle"></div><div class="d-inline-block align-middle"><h4>' + data["list_user"][0]["fullname"] + '</h4><div class="replace_text"><small class="deleted_ms">[No message]</small></div></div></div>';
        else if (data["message"].type == "deleted")
            return '<div class="user_room room_chat ' + (window.room_id == data["list_user"][0].room_id ? "room_active" : "") + '" id="user_' + data["list_user"][0].room_id + '" attr_for_type="room" attr_for_id="' + data["list_user"][0].room_id + '"><div class="d-inline-block align-middle mr-2"><img src="' + data["list_user"][0]["avatar"] + '" width="60px" height="60px" class="rounded-circle"></div><div class="d-inline-block align-middle"><h4>' + data["list_user"][0]["fullname"] + '</h4><div class="replace_text"><small class="deleted_ms">[Message deleted]</small></div></div></div>';
        else if (data["message"].file != null)
            return '<div class="user_room room_chat ' + (window.room_id == data["list_user"][0].room_id ? "room_active" : "") + '" id="user_' + data["list_user"][0].room_id + '" attr_for_type="room" attr_for_id="' + data["list_user"][0].room_id + '"><div class="d-inline-block align-middle mr-2"><img src="' + data["list_user"][0]["avatar"] + '" width="60px" height="60px" class="rounded-circle"></div><div class="d-inline-block align-middle"><h4>' + data["list_user"][0]["fullname"] + '</h4><div class="replace_text"><small class="deleted_ms">[Sent a attachment]</small></div></div></div>';
        else
            return '<div class="user_room room_chat ' + (window.room_id == data["list_user"][0].room_id ? "room_active" : "") + '" id="user_' + data["list_user"][0].room_id + '" attr_for_type="room" attr_for_id="' + data["list_user"][0].room_id + '"><div class="d-inline-block align-middle mr-2"><img src="' + data["list_user"][0]["avatar"] + '" width="60px" height="60px" class="rounded-circle"></div><div class="d-inline-block align-middle"><h4>' + data["list_user"][0]["fullname"] + '</h4><div class="replace_text"><small>' + data["message"]["message_text"] + '</small></div></div></div>';
    } catch (e) {

    }
}

function render_last_message(data) {
    try {
        if (data.type == "no_message")
            return '<small class="deleted_ms">[No message]</small>';
        else if (data.type == "deleted")
            return '<small class="deleted_ms">[Message deleted]</small>';
        else if (data.file != null)
            return '<small class="deleted_ms">[Sent a attachment]</small>';
        else
            return '<small>' + data["message_text"] + '</small>';
    } catch (e) {

    }
}

function error(e) {
    console.info(e);
    toastr.error("Connection to server error! Please try againt.");
}

function loader_bar(id) {
    $(id).append('<div class="loader bar"><div></div></div>');
}

function delete_loader_bar(id) {
    $(id).find('.loader.bar').remove();
}

function check_type_file(fileName) {
    var extensionLists = {};
    extensionLists.video = ['m4v', 'avi', 'mpg', 'mp4', 'webm'];
    extensionLists.image = ['jpg', 'gif', 'bmp', 'png', 'jpeg'];
    regex = new RegExp('[^.]+$');
    extension = fileName.match(regex)[0];
    if (extensionLists.image.indexOf(extension) > -1) {
        return "image";
    } else if (extensionLists.video.indexOf(extension) > -1) {
        return "video";
    } else {
        return "other";
    }
}

function confirm_modal(body, callback) {
    var id_modal = "modal_" + new Date().getTime();
    var html = '<section class="modal fade" id="' + id_modal + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog modal-lg">' +
        '<div class="modal-content modal-popup">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<div class="container-fluid">' +
        '<div class="row">' +
        '<div class="col-md-12 col-sm-12">' +
        '<div class="tab-pane active" id="">' +
        '<div class="submit_form ">' +
        body +
        '<div class="row">' +
        '<div class="col">' +
        '<button class="form-control" id="cancel_' + id_modal + '">Cancel</button>' +
        '</div><div class="col">' +
        '<button class="form-control submit_form_btn" id="confirm_' + id_modal + '">Confirm</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</section>';
    $("body").append(html);
    $(function() {
        $("#" + id_modal).on("hidden.bs.modal", function() {
            $(this).remove();
        });
        $("#" + id_modal).modal({ "show": true });
        $("#cancel_" + id_modal).click(function() {
            $("#" + id_modal).modal("hide");
        });
        $("#confirm_" + id_modal).click(function() {
            callback(id_modal);
        });
    })
}

function create_modal(header, body, cancel, confirm, cancel_fn, confirm_fn, some_fn) {
    var id_modal = "modal_" + new Date().getTime();
    var html = '<section class="modal fade" id="' + id_modal + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog modal-lg">' +
        '<div class="modal-content modal-popup">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<div class="container-fluid">' +
        '<div class="row">' +
        '<div class="col-md-12 col-sm-12">' +
        '<div class="modal-title">' +
        '<h2>' + header + '</h2>' +
        '</div>' +
        '<div class="tab-pane active" id="">' +
        '<div class="submit_form  text-left">' +
        body +
        '<div class="row">' +
        (cancel == undefined ? '' : '<div class="col">' +
            '<button class="form-control" id="cancel_' + id_modal + '">' + cancel + '</button>' +
            '</div>') +
        (confirm == undefined ? '' : '<div class="col">' +
            '<button class="form-control submit_form_btn" id="confirm_' + id_modal + '">' + confirm + '</button>' +
            '</div>') +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</section>';
    $("body").append(html);
    $(function() {
        $("#" + id_modal).on("hidden.bs.modal", function() {
            $(this).remove();
        });
        $("#" + id_modal).modal({ "show": true });
        $("#cancel_" + id_modal).click(function() {
            cancel_fn(id_modal);
        });
        $("#confirm_" + id_modal).click(function() {
            confirm_fn(id_modal);
        });
        if (some_fn != undefined)
            some_fn(id_modal);
    })
}

function render_message(e, object) {
    if (e.ower_user == "me") {
        if (e.type == "deleted") {
            object.prepend('<div attr_for_id="' + e.id_message + '" attr_for_time="' + e.timestamp + '" class="message row col-12 justify-content-end mt-2"><div class="message_outer"><div class="message_content rounded deleted_ms">[Message deleted]</div><div class="text-right"><small>' + time_intel(e.timestamp) + '</small></div></div></div>');
        } else if (e.file != null) {
            if (check_type_file(e.file) == "image")
                var media = '<img src="' + e.file + '">';
            else if (check_type_file(e.file) == "video")
                var media = '<video src="' + e.file + '" controls muted>';
            else
                var media = '<a href="' + e.file + '" target="_blank">' + create_badge_file(e.file) + '</a>';
            object.prepend('<div attr_for_id="' + e.id_message + '" attr_for_time="' + e.timestamp + '" class="message row col-12 justify-content-end mt-2"><div class="trash"><img src="/assets/img/trash.svg"></div><div class="message_outer"><div class="media-area">' + media + '</div><div class="text-right"><small>' + time_intel(e.timestamp) + '</small></div></div></div>');
        } else if (e.message_text == '[like]') {
            object.prepend('<div attr_for_id="' + e.id_message + '" attr_for_time="' + e.timestamp + '" class="message row col-12 justify-content-end mt-2"><div class="trash"><img src="/assets/img/trash.svg"></div><div class="message_outer"><div class="reaction-area"><div class="like cursor-pointer"><img src="/assets/img/like.svg" width="45px" height="45px" /></div></div><div class="text-right"><small>' + time_intel(e.timestamp) + '</small></div></div></div>');
        } else {
            object.prepend('<div attr_for_id="' + e.id_message + '" attr_for_time="' + e.timestamp + '" class="message row col-12 justify-content-end mt-2"><div class="trash"><img src="/assets/img/trash.svg"></div><div class="message_outer"><div class="message_content rounded"><div class="message_text">' + e.message_text + '</div></div><div class="text-right"><small>' + time_intel(e.timestamp) + '</small></div></div></div>');
        }
    } else {
        if (e.type == "deleted") {
            object.prepend('<div attr_for_time="' + e.timestamp + '" class="message row col-12 justify-content-start mt-2"><div class="mr-2"><img src="' + e.avatar + '" width="40px" height="40px" class="rounded-circle"></div><div class="message_outer"><div class="message_content rounded"><div class="message_text deleted_ms">[Message deleted]</div></div><div class="text-left"><small>' + time_intel(e.timestamp) + '</small></div></div></div>');
        } else if (e.file != null) {
            if (check_type_file(e.file) == "image")
                var media = '<img src="' + e.file + '">';
            else if (check_type_file(e.file) == "video")
                var media = '<video src="' + e.file + '" controls muted>';
            else
                var media = '<a href="' + e.file + '" target="_blank">' + create_badge_file(e.file) + '</a>';
            object.prepend('<div attr_for_id="' + e.id_message + '" attr_for_time="' + e.timestamp + '" class="message row col-12 justify-content-start mt-2"><div class="mr-2"><img src="' + e.avatar + '" width="40px" height="40px" class="rounded-circle"></div><div class="message_outer"><div class="media-area">' + media + '</div><div class="text-left"><small>' + time_intel(e.timestamp) + '</small></div></div></div>');
        } else if (e.message_text == '[like]') {
            object.prepend('<div attr_for_id="' + e.id_message + '" attr_for_time="' + e.timestamp + '" class="message row col-12 justify-content-start mt-2"><div class="mr-2"><img src="' + e.avatar + '" width="40px" height="40px" class="rounded-circle"></div><div class="message_outer"><div class="reaction-area"><div class="like cursor-pointer"><img src="/assets/img/like.svg" width="45px" height="45px" /></div></div><div class="text-left"><small>' + time_intel(e.timestamp) + '</small></div></div></div>');
        } else {
            object.prepend('<div attr_for_id="' + e.id_message + '" attr_for_time="' + e.timestamp + '" class="message row col-12 justify-content-start mt-2"><div class="mr-2"><img src="' + e.avatar + '" width="40px" height="40px" class="rounded-circle"></div><div class="message_outer"><div class="message_content rounded"><div class="message_text">' + e.message_text + '</div></div><div class="text-left"><small>' + time_intel(e.timestamp) + '</small></div></div></div>');
        }
    }
}

function append_render_message(e, object) {
    $("#no_message").remove();
    if (e.type == "typing") {
        if (e.room_id == window.room_id) {
            var who_el = object.find("#typing_" + e.info_user.user_id);
            time = new Date().getTime();
            if (who_el.length == 0) {
                object.append('<div class="message row col-12 justify-content-start mt-2" id="typing_' + e.info_user.user_id + '" attr_for_user="' + e.info_user.user_id + '" attr_for_time="' + time + '"><div class="mr-2"><img src="' + e.info_user.avatar + '" width="40px" height="40px" class="rounded-circle"></div><div class="message_outer"><div class="reaction-area"><div id="wave"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div></div></div>');
                notify_typing.play();
                object.scrollTop($('.message_list')[0].scrollHeight);
            } else {
                who_el = object.find("#typing_" + e.info_user.user_id);
                who_el.attr("attr_for_time", time);
            }
            var handle = setTimeout(function() {
                current_time = new Date().getTime();
                who_el = object.find("#typing_" + e.info_user.user_id);
                if (current_time - 5000 > who_el.attr("attr_for_time")) {
                    who_el.remove();
                }
            }, 5000);
        }
    } else {
        notify_audio.play();
        $("#list_recent .user_room[attr_for_id='" + e.room_id + "'] .replace_text").html(render_last_message(e.info_user));
        if (e.info_user.user_id == window.user_id) {
            if (e.info_user.file != null) {
                if (check_type_file(e.info_user.file) == "image")
                    var media = '<img src="' + e.info_user.file + '">';
                else if (check_type_file(e.info_user.file) == "video")
                    var media = '<video src="' + e.info_user.file + '" controls muted>';
                else
                    var media = '<a href="' + e.info_user.file + '" target="_blank">' + create_badge_file(e.info_user.file) + '</a>';
                object.append('<div attr_for_id="' + e.info_user.id_message + '" attr_for_time="' + e.info_user.timestamp + '" class="message row col-12 justify-content-end mt-2"><div class="trash"><img src="/assets/img/trash.svg"></div><div class="message_outer"><div class="media-area">' + media + '</div><div class="text-right"><small>' + time_intel(e.info_user.timestamp) + '</small></div></div></div>');
            } else if (e.info_user.message_text == '[like]') {
                object.append('<div attr_for_id="' + e.info_user.id_message + '" attr_for_time="' + e.info_user.timestamp + '" class="message row col-12 justify-content-end mt-2"><div class="trash"><img src="/assets/img/trash.svg"></div><div class="message_outer"><div class="reaction-area"><div class="like cursor-pointer"><img src="/assets/img/like.svg" width="45px" height="45px" /></div></div><div class="text-right"><small>' + time_intel(e.info_user.timestamp) + '</small></div></div></div>');
            } else {
                object.append('<div attr_for_id="' + e.info_user.id_message + '" attr_for_time="' + e.info_user.timestamp + '" class="message row col-12 justify-content-end mt-2"><div class="trash"><img src="/assets/img/trash.svg"></div><div class="message_outer"><div class="message_content rounded"><div class="message_text">' + e.info_user.message_text + '</div></div><div class="text-right"><small>' + time_intel(e.info_user.timestamp) + '</small></div></div></div>');
            }
        } else {
            if (e.info_user.file != null) {
                if (check_type_file(e.info_user.file) == "image")
                    var media = '<img src="' + e.info_user.file + '">';
                else if (check_type_file(e.info_user.file) == "video")
                    var media = '<video src="' + e.info_user.file + '" controls muted>';
                else
                    var media = '<a href="' + e.info_user.file + '" target="_blank">' + create_badge_file(e.info_user.file) + '</a>';
                object.append('<div attr_for_id="' + e.info_user.id_message + '" attr_for_time="' + e.info_user.timestamp + '" class="message row col-12 justify-content-start mt-2"><div class="mr-2"><img src="' + e.info_user.avatar + '" width="40px" height="40px" class="rounded-circle"></div><div class="message_outer"><div class="media-area">' + media + '</div><div class="text-left"><small>' + time_intel(e.info_user.timestamp) + '</small></div></div></div>');
            } else if (e.info_user.message_text == '[like]') {
                object.append('<div attr_for_id="' + e.info_user.id_message + '" attr_for_time="' + e.info_user.timestamp + '" class="message row col-12 justify-content-start mt-2"><div class="mr-2"><img src="' + e.info_user.avatar + '" width="40px" height="40px" class="rounded-circle"></div><div class="message_outer"><div class="reaction-area"><div class="like cursor-pointer"><img src="/assets/img/like.svg" width="45px" height="45px" /></div></div><div class="text-left"><small>' + time_intel(e.info_user.timestamp) + '</small></div></div></div>');
            } else {
                object.append('<div attr_for_id="' + e.info_user.id_message + '" attr_for_time="' + e.info_user.timestamp + '" class="message row col-12 justify-content-start mt-2"><div class="mr-2"><img src="' + e.info_user.avatar + '" width="40px" height="40px" class="rounded-circle"></div><div class="message_outer"><div class="message_content rounded"><div class="message_text">' + e.info_user.message_text + '</div></div><div class="text-left"><small>' + time_intel(e.info_user.timestamp) + '</small></div></div></div>');
            }
        }
        object.scrollTop($('.message_list')[0].scrollHeight);
    }
}

function load_data_message(id, room_id, type, hash_page, scroll) {
    $(".input_chat").removeClass("d-none");
    loader_bar(id);
    window.room_id = room_id;
    var object = $(id);
    $.ajax({
        url: "/moddle/message.php?action=get_list_message&room_id=" + room_id + "&type=" + type + (hash_page != undefined ? "&next_page=" + hash_page : ""),
        success: function(e) {
            delete_loader_bar(id);
            e = JSON.parse(e);
            if (e.status) {
                scrolling = false;
                $("#title_message").html(e.name_room);
                if (e.data.length > 0) {
                    object.find("#no_message").remove();
                    if (e.data.length == 1) {
                        render_message(e.data[0], object);
                    } else {
                        for (i = 0; i < e.data.length; i++) {
                            render_message(e.data[i], object);
                            if (i == e.data.length - 1) {
                                if (object.hasScrollBar() == false) {
                                    scrolling = true;
                                    hash_page = btoa($($(".message_list>div")[0]).attr("attr_for_time"));
                                    load_data_message(id, room_id, type, hash_page, scroll);
                                } else if (scroll == true)
                                    $('.message_list').scrollTop($('.message_list')[0].scrollHeight);
                            }
                        }
                    }
                } else {
                    if (scroll == true && hash_page == undefined)
                        object.html('<div class="center_text_absolute" id="no_message">No messages here!</div>');
                    scrolling = true;
                }
            } else {
                scrolling = false;
                toastr.error("Error when start chat, please try againt.");
            }
            window.room_id = e.room_id;
            window.history.pushState(null, "LocalSocical", "/index.php?thread_id=" + e.room_id);
        },
        error: function(e) {
            delete_loader_bar(id);
            error(e);
        }
    })
}

function send_message(text, room_id) {
    $.ajax({
        url: "/moddle/message.php?action=send_message",
        method: "POST",
        data: "room_id=" + room_id + "&message=" + text,
        success: function(e) {

        },
        error: function(e) {
            error(e);
        }
    })
}

function time_ago(time, return_day) {
    var now = new Date().getTime() / 1000;
    var diff = now - time;
    d = diff / 60 / 60 / 24;
    h = diff / 60 / 60;
    m = diff / 60;
    if (d > 1) {
        ago = new Date(time * 1000);
        if (return_day)
            return Math.floor(d) + " days";
        else
            return
    } else if (h > 1) {
        return Math.round(h) + " hours";
    } else if (m > 1) {
        return Math.round(m) + " minutes";
    } else {
        return "just";
    }
}

function time_intel(time) {
    var now = new Date();
    var ago = new Date(time * 1000);
    hour = ago.getHours();
    minute = ago.getMinutes();
    date = ago.getDate();
    month = ago.getMonth() + 1;
    if (ago.getFullYear() == now.getFullYear()) {
        return hour + ":" + minute + " " + date + "/" + month;
    } else {
        return hour + ":" + minute + " " + date + "/" + month + "/" + ago.getFullYear();
    }
}

function create_modal_media(source) {
    var blob_file = URL.createObjectURL(source);
    if (source.type.split('/')[0] == "image")
        var media = '<div class="media_preview"><img src="' + blob_file + '" width="325px" /></div>';
    else if (source.type.split('/')[0] == "video")
        var media = '<div class="media_preview"><video src="' + blob_file + '" width="325px" controls /></div>';
    else
        var media = '<div class="media_preview">' + create_badge_file(source.name) + '</div>'
    var html = '<section class="modal fade" id="modal_media" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog modal-lg">' +
        '<div class="modal-content modal-popup">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<div class="container-fluid">' +
        '<div class="row">' +
        '<div class="col-md-12 col-sm-12">' +
        '<div class="tab-pane active" id="create_media">' +
        '<div class="submit_form">' +
        media +
        '<div class="row">' +
        '<div class="col">' +
        '<button class="form-control" id="cancel_media">Cancel</button>' +
        '</div><div class="col">' +
        '<button class="form-control submit_form_btn" id="upload_media">Upload</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</section>';
    $("body").append(html);
    $(function() {
        $("#modal_media").on("hidden.bs.modal", function() {
            $(this).remove();
        });
        $("#modal_media").modal({ "show": true });
        $("#cancel_media").click(function() {
            $("#modal_media").modal("hide");
        });
        $("#upload_media").click(function() {
            var fd = new FormData();
            fd.append('fname', source.name);
            fd.append('data', source);
            fd.append('room_id', window.room_id);
            $.ajax({
                type: 'POST',
                url: '/moddle/files.php?action=upload',
                beforeSend: function() {
                    loader_bar("#modal_media>div");
                },
                data: fd,
                processData: false,
                contentType: false
            }).done(function(data) {
                delete_loader_bar("#modal_media>div");
                $("#modal_media").modal("hide");
            });
        });
    })
}
async function search_user(email) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/moddle/user.php?action=search_user",
            method: "POST",
            data: "email=" + email,
            success: function(e) {
                resolve(e);
            },
            error: function(e) {
                error(e);
                reject(e);
            }
        });
    });
}

function ping_typing(room_id) {
    $.ajax({
        url: "/moddle/message.php?action=ping_typing",
        method: "POST",
        data: "room_id=" + room_id
    });
}

function create_badge_file(data) {
    return '<div class="d-inline-block badged_file"><div class="d-flex rounded-pill p-2 border align-items-center"><img src="/assets/img/file.svg"" width="30px" height="30px" class="rounded"/><div class="ml-2">' + data + '</div></div></div>';
}

function create_badge_user(id, data) {
    var object = $(id);
    object.append('<div class="d-inline-block badged_user"><div class="d-flex rounded-pill p-2 border align-items-center"><img src="' + data["avatar"] + '" width="30px" height="30px" class="rounded-circle"/><div class="ml-2">' + data["fullname"] + '</div><div class="ml-2 close_badge cursor-pointer" aria-hidden="true" attr_for_id="' + data["id"] + '">×</div></div></div>');
}
$(document).ready(function() {
    $("body").on('keypress', "#search_email", async function(e) {
        if (e.which == 13) {
            loader_bar("#modal-form>div");
            let res_user = await search_user($(this).val());
            res_user = JSON.parse(res_user);
            if (res_user.status) {
                var res_user_id = res_user["data"][0];
                var current_value = JSON.parse($("input#list_user").val());
                if (current_value.length == 0) {
                    current_value.push(res_user_id["id"]);
                    $("#list_user").val(JSON.stringify(current_value));
                    create_badge_user("#show_list_user", res_user_id);
                } else {
                    for (i = 0; i < current_value.length; i++) { //Kiểm tra người dùng đã có chưa?
                        if (current_value[i] == res_user_id["id"])
                            break;
                        if (i == current_value.length - 1) { //Thêm người dùng vào modal;
                            current_value.push(res_user_id["id"]);
                            $("#list_user").val(JSON.stringify(current_value)); //Thêm value vào ô input
                            create_badge_user("#show_list_user", res_user_id); //Tạo DOM hiển thị kết quả tìm kiếm
                        }
                    }
                }
            } else {
                toastr.error(res_user.msg);
            }
            $(this).val('');
            delete_loader_bar("#modal-form>div");
            return false;
        }
    });
    $("#list_user_tab").click(function() {
        $(this).find("a").tab("show");
        $(".active_list").removeClass("active");
        if ($(".list_user").find(".user_room").length == 0) {
            list_user_loader(".list_user");
        }
    });
    $("#list_recent_tab").click(function() {
        $(".active_list").removeClass("active");
        $(this).find("a").tab("show");
        if ($(".list_recent").find(".user_room").length == 0) {
            list_thread(".list_recent");
        }
    })
    list_thread(".list_recent");
    $("body").on("click", ".close_badge", function() {
        var current_value = JSON.parse($("#list_user").val());
        var id = $(this).attr("attr_for_id");
        for (i = 0; i < current_value; i++) {
            if (current_value[i] == id) {
                current_value.splice(i, 1);
                $("#list_user").val(JSON.stringify(current_value));
                break;
            }
        }
        $(this).parents(".badged_user").remove();
    });
    last_typing = new Date().getTime();
    $("#chat_message").on('keyup', function(e) {
        if (e.which == 13) {
            send_message($(this).val(), window.room_id);
            $(this).val('');
            return false;
        } else {
            if (new Date().getTime() - 4000 > last_typing) {
                last_typing = new Date().getTime();
                ping_typing(window.room_id);
            }
        }
    });
    $("#file").change(function() {
        create_modal_media($(this)[0].files[0]);
    })
    $("#btn-like").click(function() {
        send_message('[like]', window.room_id);
    });
    $(".list_user, .list_recent").on("click", ".room_chat", function() {
        $(".message_list").html('');
        load_data_message(".message_list", $(this).attr("attr_for_id"), $(this).attr("attr_for_type"));
        $(".room_chat").removeClass("room_active");
        $(this).addClass("room_active");
    });
    if (window.room_id != '') {
        load_data_message(".message_list", window.room_id, "room", undefined, true);
    }
    $(".message_list").scroll(function() {
        if ($(".message_list").scrollTop() == 0) {
            if (scrolling == false) {
                hash_page = btoa($($(".message_list>div")[0]).attr("attr_for_time"));
                load_data_message(".message_list", window.room_id, "room", hash_page);
            }
        }
    });
    $("#setting").click(function() {
        create_modal("Setting", '<div class="form-group">' +
            '<button class="form-control submit_form_btn" id="manage_modal">Manage member</button>' +
            '<label for="change_name">Change name</label>' +
            '<input type="text" class="form-control" id="change_name" placeholder="Enter new name">' +
            '</div><div class="form-group">' +
            '<label for="add_user">Add user</label>' +
            '<input type="text" class="form-control" id="search_email" placeholder="Press enter to search">' +
            '<input type="hidden" name="list_user" value="[]" id="list_user" />' +
            '<div class="" id="show_list_user"></div>' +
            '</div><small class="text-muted">Leave it blank if not changed</small>' +
            '<div class="row"><div class="col-12"></div></div>', "Leave group", "Confirm",
            function(id_modal) {
                loader_bar("#" + id_modal + ">div");
                $.ajax({
                    url: "/moddle/message.php?action=leave_room",
                    method: "POST",
                    data: "room_id=" + window.room_id,
                    success: function(e) {
                        delete_loader_bar("#" + id_modal + ">div");
                        e = JSON.parse(e);
                        if (e.status) {
                            toastr.success(e.msg);
                            $("#" + id_modal).modal("hide");
                            window.location.href = "/";
                        } else
                            toastr.error(e.msg);
                    },
                    error: function(e) {
                        delete_loader_bar("#" + id_modal + ">div");
                        error(e);
                    }
                })
            },
            function(id_modal) {
                loader_bar("#" + id_modal + ">div");
                $.ajax({
                    url: "/moddle/message.php?action=update_group",
                    method: "POST",
                    data: "room_id=" + window.room_id + "&name_room=" + $("#change_name").val() + "&add_user=" + $("#list_user").val(),
                    success: function(e) {
                        delete_loader_bar("#" + id_modal + ">div");
                        e = JSON.parse(e);
                        if (e.status) {
                            toastr.success(e.msg);
                            $("#" + id_modal).modal("hide");
                            //window.location.href = "/";
                        } else
                            toastr.error(e.msg);
                    },
                    error: function(e) {
                        delete_loader_bar("#" + id_modal + ">div");
                        error(e);
                    }
                });

            },
            function(id_modal) {
                $("#manage_modal").click(function(e) {
                    loader_bar("#" + id_modal + ">div");
                    $.ajax({
                        url: "/moddle/message.php?action=get_user_in_room",
                        method: "POST",
                        data: "room_id=" + window.room_id,
                        success: function(e) {
                            delete_loader_bar(("#" + id_modal + ">div"));
                            e = JSON.parse(e);
                            if (e.status) {
                                $("#" + id_modal).modal("hide");
                                var html = "";
                                for (i = 0; i < e.data.length; i++) {
                                    html += '<div class="user_room p-0 mt-2" attr_for_id="' + e.data[i].user_id + '"><div class="d-inline-block align-middle mr-2"><img src="' + e.data[i].avatar + '" width="50px" height="50px" class="rounded-circle"></div><div class="d-inline-block align-middle"><h4>' + e.data[i].fullname + '</h4></div><div class="d-inline-block align-middle float-right"><img src="' + (e.data[i]["administrator"] ? "/assets/img/admin.svg" : "/assets/img/user.svg") + '" width="30px" height="30px" class="change_permission"><img src="/assets/img/logout.svg" width="30px" height="30px" style="margin-left: 15px" class="kick"></div></div>';
                                    if (i == e.data.length - 1) {
                                        create_modal("Memebers list", '<div class="max_height_500">' + html + '</div>', "Cancel", undefined, function(id_modal) {
                                            $("#" + id_modal).modal("hide");
                                        }, undefined, function(id_modal) {
                                            $(".kick").click(function() {
                                                $_this = $(this);
                                                loader_bar("#" + id_modal + ">div");
                                                $.ajax({
                                                    url: "/moddle/message.php?action=kick",
                                                    method: "POST",
                                                    data: "room_id=" + window.room_id + "&user_id=" + $_this.parents(".user_room").attr("attr_for_id"),
                                                    success: function(e) {
                                                        delete_loader_bar("#" + id_modal + ">div");
                                                        e = JSON.parse(e);
                                                        if (e.status) {
                                                            $_this.parents(".user_room").remove();
                                                            toastr.success(e.msg);
                                                            //window.location.href = "/";
                                                        } else
                                                            toastr.error(e.msg);
                                                    },
                                                    error: function(e) {
                                                        delete_loader_bar("#" + id_modal + ">div");
                                                        error(e);
                                                    }
                                                });
                                            });
                                            $(".change_permission").click(function() {
                                                $_this = $(this);
                                                loader_bar("#" + id_modal + ">div");
                                                $.ajax({
                                                    url: "/moddle/message.php?action=change_permission",
                                                    method: "POST",
                                                    data: "room_id=" + window.room_id + "&user_id=" + $_this.parents(".user_room").attr("attr_for_id"),
                                                    success: function(e) {
                                                        delete_loader_bar("#" + id_modal + ">div");
                                                        e = JSON.parse(e);
                                                        if (e.status) {
                                                            toastr.success(e.msg);
                                                            //window.location.href = "/";
                                                        } else
                                                            toastr.error(e.msg);
                                                    },
                                                    error: function(e) {
                                                        delete_loader_bar("#" + id_modal + ">div");
                                                        error(e);
                                                    }
                                                });
                                            })
                                        });
                                    }
                                }
                            } else {
                                toastr.error(e.msg);
                            }
                        },
                        error: function(e) {
                            error(e);
                            delete_loader_bar(("#" + id_modal + ">div"));
                        }
                    })
                });
            });
    });
    $("body").on("click", ".trash", function() {
        var id_message = $(this).parents(".message").attr("attr_for_id");
        confirm_modal("Do you want delete this message? You couldn't restore it.", function callback(id_modal) {
            loader_bar("#" + id_modal + ">div");
            $.ajax({
                url: "/moddle/message.php?action=delete_message",
                method: "POST",
                data: "id_message=" + id_message,
                success: function(params) {
                    delete_loader_bar("#" + id_modal + ">div");
                    $("#" + id_modal).modal("hide");
                    params = JSON.parse(params);
                    if (params.status)
                        toastr.success(params.msg)
                    else
                        toastr.error(params.msg);
                },
                error: function name(params) {
                    delete_loader_bar("#" + id_modal + ">div");
                    error(params);
                }
            })
        });
    });
    $(".add_group").click(function() {
        create_modal("Create group", '<input type="text" class="form-control" name="name_group" id="name_group" placeholder="Group name" required>' +
            '<input type="text" class="form-control" name="email" id="search_email" placeholder="Enter email to search" required>' +
            '<input type="hidden" name="list_user" value="[]" id="list_user" />' +
            '<div class=" text-left" id="show_list_user"></div>' +
            '<div class="row align-items-center">' +
            '<div class="col">' +
            '<input name="captcha" type="text" placeholder="Enter result" id="captcha" class="form-control">' +
            '</div>' +
            '<div class="col">' +
            '<img src="/captcha.php" class="recaptcha_form" />' +
            '</div>' +
            '</div>', undefined, "Create", undefined,
            function(id_modal) {
                $.ajax({
                    url: "/moddle/message.php?action=create_room",
                    method: "POST",
                    data: "name_group=" + $("#name_group").val() + "&list_user=" + $("#list_user").val() + "&captcha=" + $("#captcha").val(),
                    beforeSend: function(e) {
                        loader_bar("#" + id_modal + ">div");
                    },
                    success: function(e) {
                        $(".recaptcha_form").attr("src", "/captcha.php?v=" + new Date().getTime());
                        delete_loader_bar("#" + id_modal + ">div");
                        e = JSON.parse(e);
                        if (e.status) {
                            window.location.href = "/index.php?thread_id=" + e.room_id;
                        } else {
                            toastr.error(e.msg);
                        }
                    },
                    error: function(e) {
                        delete_loader_bar("#" + id_modal + ">div");
                        error(e);
                    }
                })
            },
            function(id_modal) {

            })
    });
    $("#profile").click(function() {
        create_modal("Your profile's", '<div class="h5 mb-4">Change avatar</div>' +
            '<div class="row align-items-center">' +
            '<div class="col">' +
            '<label class="drag-here border rounded p-3 text-center d-block" for="upload_avatar" style="border-style: dashed!important">Chosse file</label>' +
            '<input name="upload_avatar" type="file" id="upload_avatar" class="d-none">' +
            '</div>' +
            '<div class="col">' +
            '<img src="/moddle/user.php?action=get_avatar&user_id=' + window.user_id + '" class="rounded-circle" width="60px" height="60px" id="avatar_preview" />' +
            '</div>' +
            '</div>' +
            '<div class="mt-2"><small class="text-muted">We\'ll use your avatar\'s for face recognition login.</small></div>' +
            '<div class="h5 mt-3 mb-4">Change password</div>' +
            '<input type="text" class="form-control" name="old_password" id="old_password" placeholder="Old password" required>' +
            '<input type="text" class="form-control" name="new_password" id="new_password" placeholder="New password" required>' +
            '<input type="text" class="form-control" name="re_new_password" id="re_new_password" placeholder="Retype new password" required>' +
            '<small class="text-muted">Leave it blank if not changed</small>', "Cancel", "Update",
            function(id_modal) {
                $("#" + id_modal).modal("hide");
            },
            function(id_modal) {
                var fd = new FormData();
                if ($("#upload_avatar")[0].files[0] != undefined)
                    fd.append('avatar', $("#upload_avatar")[0].files[0]);
                fd.append('old_password', $("#old_password").val());
                fd.append('new_password', $("#new_password").val());
                fd.append('re_new_password', $("#re_new_password").val());
                $.ajax({
                    url: "/moddle/user.php?action=update_proflie",
                    method: "POST",
                    processData: false,
                    contentType: false,
                    data: fd,
                    beforeSend: function(e) {
                        loader_bar("#" + id_modal + ">div");
                    },
                    success: function(e) {
                        delete_loader_bar("#" + id_modal + ">div");
                        e = JSON.parse(e);
                        if (e.status) {
                            window.location.href = "/";
                        } else {
                            toastr.error(e.msg);
                        }
                    },
                    error: function(e) {
                        delete_loader_bar("#" + id_modal + ">div");
                        error(e);
                    }
                })
            },
            function(id_modal) {
                $("#upload_avatar").change(function(e) {
                    var blob_file = URL.createObjectURL($(this)[0].files[0]);
                    $("#avatar_preview").attr("src", blob_file);
                });
            })
    });
});
document.onpaste = function(evt) {
    const dT = evt.clipboardData || window.clipboardData;
    if (dT.files.length > 0) {
        const file = dT.files[0];
        create_modal_media(file);
    }
};
$(function() {
    "use strict";
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
        //Không hỗ trợ wss
        return;
    }
    // open connection
    var connection = new WebSocket('ws://' + window.location.host + ':1338/?auth_key=' + auth_token);
    connection.onerror = function(error) {
        //Error
    }
    connection.onmessage = function(message) {
        message = JSON.parse(message.data);
        if (message.type == "show_message") {
            append_render_message(message, $(".message_list"))
        } else if (message.type == "typing") {
            append_render_message(message, $(".message_list"))
        } else if (message.type == "seen") {
            $("#seen_mark").attr({ "id": "" }).find('p').remove();
            $(".from_me:last-child").attr({ "id": "seen_mark" }).find('.message_body').append('<p class="small width_100 text-right">Đã xem</p>');
        } else if (message.type == "delete_message") {
            if (window.room_id == message.room_id) {
                $(".message[attr_for_id='" + message["message_id"] + "']").find(".message_outer").find('div:nth-of-type(1)').remove();
                $(".message[attr_for_id='" + message["message_id"] + "']").find(".message_outer").prepend('<div class="message_content rounded deleted_ms">[Message deleted]</div>');
                $(".message[attr_for_id='" + message["message_id"] + "']").find('.trash').remove();
            }
        }
    };
});