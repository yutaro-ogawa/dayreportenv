//---------------------------------------------------------
// 最初にpcodeリストを読み取る
//---------------------------------------------------------
$(document).ready(function() {
  label_Get();
});


//---------------------------------------------------------
// 各ボタンの関数
//---------------------------------------------------------

function labelsave() {
  //　モーダル内の登録ボタン
  var label_title = $("#modalInput1").val();
  var label_id = $("#modalInput2").val();
  var label_color = $("#modalInput3").val();

  if (label_title) {
    label_JSON = {
      title: label_title,
      label_id: label_id,
      label_color: label_color,
    };
    label_POST(label_JSON);

    // POSTとGETの順番が入れ替わるのを防ぐスリープ
    const d1 = new Date();
    while (true) {
      const d2 = new Date();
      if (d2 - d1 > 100) {
        break;
      }
    }

    label_Get();

    //モーダルのリセットをしておく
    $("#modalInput1").val('');
    $("#modalInput2").val('');
    $("#modalInput3").val('#00ff00');
  }
}

// 登録済みのタスクの編集
var id_global = undefined; // モーダル操作用のグローバル変数
function labelputmodal(id) {
  //　編集ボタン
  var label_title = $('#label_title_' + id + '').text();
  var label_id = $('#label_id_' + id + '').text();
  var label_color = $('#label_color_' + id + '').text();

  $('#editModal').on('show.bs.modal', function() {
    document.getElementById("editmodalInput1").value = label_title;
    document.getElementById("editmodalInput2").value = label_id;
    document.getElementById("editmodalInput3").value = label_color;
  });
  id_global = id;
  $('#editModal').modal('show');
}

function labelput() {
  //　編集モーダル内の更新ボタン
  var label_title = $("#editmodalInput1").val();
  var label_id = $("#editmodalInput2").val();
  var label_color = $("#editmodalInput3").val();

  if (label_title) {
    label_JSON = {
      title: label_title,
      label_id: label_id,
      label_color: label_color,
      id: id_global,
    };
    label_PUT(label_JSON);

    // PUTとGETの順番が入れ替わるのを防ぐスリープ
    const d1 = new Date();
    while (true) {
      const d2 = new Date();
      if (d2 - d1 > 100) {
        break;
      }
    }

    label_Get();

  }
}

function labeldelete() {
  //　モーダル内の削除ボタンで論理削除
  if (confirm('本当にこのラベルを削除してよろしいですか？')) {
    var label_title = $("#editmodalInput1").val();
    var label_id = $("#editmodalInput2").val();
    var label_color = $("#editmodalInput3").val();
    if (label_title) {
      label_JSON = {
        title: label_title,
        label_id: label_id,
        label_color: label_color,
        id: id_global,
        delete_flg: true,
      };
      label_PUT(label_JSON);

      // PUTとGETの順番が入れ替わるのを防ぐスリープ
      const d1 = new Date();
      while (true) {
        const d2 = new Date();
        if (d2 - d1 > 100) {
          break;
        }
      }

      label_Get();

    }
  } else {}
}

//---------------------------------------------------------
// CSRF設定
//---------------------------------------------------------

//CSRF_tokenを取得する
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

//CSRFのいらないmethodの定義
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

//AJAXの前にcsrftokenをセット
$.ajaxSetup({
  crossDomain: false, // obviates need for sameOrigin test
  beforeSend: function(xhr, settings) {
    if (!csrfSafeMethod(settings.type)) {
      var csrftoken = getCookie('csrftoken');
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
  }
});


//---------------------------------------------------------
// Ajaxの設定
//---------------------------------------------------------

//POST
function label_POST(label_JSON) {
  $.ajax({
    method: "POST",
    url: "../api/label/",
    dataType: "json",
    data: JSON.stringify(label_JSON),
    contentType: "application/json",
    success: function(data) {
      console.log(data);
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

//PUT
function label_PUT(label_JSON) {
  $.ajax({
    method: "PUT",
    url: "../api/label/" + label_JSON.id + "/",
    dataType: "json",
    data: JSON.stringify(label_JSON),
    contentType: "application/json",
    success: function(data) {
      console.log(data)
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

//Eventを取得する 表も自動で描画する
function label_Get() {
  //HTMLを初期化
  $("table.label_tbl tbody").html("");

  var get_url = "../api/label";
  //パラメータで日付をわたす
  console.log(get_url);
  $.ajax({
    method: "GET",
    url: get_url,
    dataType: "json",
    data: "",
    contentType: "application/json",
    success: function(data) {
      console.log(data)
      //HTMLを生成
      $(data).each(function() {
        $('<tr>' +
          '<td class="text-center" id="label_title_' + this.id + '">' + this.title + '</td>' +
          '<td class="text-center" id="label_id_' + this.id + '">' + this.label_id + '</td>' +
          '<td class="text-center" id="label_color_' + this.id + '"style="background-color:' + this.label_color + '">' + this.label_color + '</td>' +
          '<td>' +
          '<button class="center-block" type="button" id="' + this.id + '" class="btn btn-default" onclick="labelputmodal(' + this.id + ')">編集・消去</button>' +
          '</td>' +
          '</tr>').appendTo('table.label_tbl tbody');
        $('#label_table').css({
          "width": "60%"
        });
      })
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

/*
//DeleteでEVENTを削除
function calEvent_Delete(eventData_JSON) {
  $.ajax({
    method: "DELETE",
    url: "../api/calevent/" + eventData_JSON.id + "/",
    dataType: "json",
    data: JSON.stringify(eventData_JSON),
    contentType: "application/json",
    success: function(data) {
      console.log(data)
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}
*/

//---------------------------------------------------------
//
//---------------------------------------------------------
