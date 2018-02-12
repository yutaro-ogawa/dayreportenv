//---------------------------------------------------------
// 最初にpcodeリストを読み取る
//---------------------------------------------------------
$(document).ready(function() {
  project_Get();
});


//---------------------------------------------------------
// 各ボタンの関数
//---------------------------------------------------------

function projectsave() {
  //　モーダル内の登録ボタン
  var project_title = $("#modalInput1").val();
  var project_id = $("#modalInput2").val();
  var project_color = $("#modalInput3").val();

  if (project_title) {
    project_JSON = {
      title: project_title,
      project_id: project_id,
      project_color: project_color,
    };
    project_POST(project_JSON);

    // POSTとGETの順番が入れ替わるのを防ぐスリープ
    const d1 = new Date();
    while (true) {
      const d2 = new Date();
      if (d2 - d1 > 100) {
        break;
      }
    }

    project_Get();

    //モーダルのリセットをしておく
    $("#modalInput1").val('');
    $("#modalInput2").val('');
    $("#modalInput3").val('#00ff00');
  }
}

// 登録済みのタスクの編集
var id_global = undefined; // モーダル操作用のグローバル変数
function projectputmodal(id) {
  //　編集ボタン
  var project_title = $('#title_' + id + '').text();
  var project_id = $('#project_id_' + id + '').text();
  var project_color = $('#project_color_' + id + '').text();

  $('#editModal').on('show.bs.modal', function() {
    document.getElementById("editmodalInput1").value = project_title;
    document.getElementById("editmodalInput2").value = project_id;
    document.getElementById("editmodalInput3").value = project_color;
  });
  id_global = id;
  $('#editModal').modal('show');
}

function projectput() {
  //　モーダル内の更新ボタン
  var project_title = $("#editmodalInput1").val();
  var project_id = $("#editmodalInput2").val();
  var project_color = $("#editmodalInput3").val();

  if (project_title) {
    project_JSON = {
      title: project_title,
      project_id: project_id,
      project_color: project_color,
      id: id_global,
    };
    project_PUT(project_JSON);

    // PUTとGETの順番が入れ替わるのを防ぐスリープ
    const d1 = new Date();
    while (true) {
      const d2 = new Date();
      if (d2 - d1 > 100) {
        break;
      }
    }

    project_Get();

  }
}

function projectdelete() {
  //　モーダル内の削除ボタンで論理削除
  if (confirm('本当にこのプロジェクトを削除してよろしいですか？')) {
    var project_title = $("#editmodalInput1").val();
    var project_id = $("#editmodalInput2").val();
    var project_color = $("#editmodalInput3").val();
    if (project_title) {
      project_JSON = {
        title: project_title,
        project_id: project_id,
        project_color: project_color,
        id: id_global,
        delete_flg: true,
      };
      project_PUT(project_JSON);

      // PUTとGETの順番が入れ替わるのを防ぐスリープ
      const d1 = new Date();
      while (true) {
        const d2 = new Date();
        if (d2 - d1 > 100) {
          break;
        }
      }

      project_Get();

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
function project_POST(project_JSON) {
  $.ajax({
    method: "POST",
    url: "../api/project/",
    dataType: "json",
    data: JSON.stringify(project_JSON),
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
function project_PUT(project_JSON) {
  $.ajax({
    method: "PUT",
    url: "../api/project/" + project_JSON.id + "/",
    dataType: "json",
    data: JSON.stringify(project_JSON),
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
function project_Get() {
  //HTMLを初期化
  $("table.code_tbl tbody").html("");

  var get_url = "../api/project";
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
          '<td class="text-center" id="title_' + this.id + '">' + this.title + '</td>' +
          '<td class="text-center" id="project_id_' + this.id + '">' + this.project_id + '</td>' +
          '<td class="text-center" id="project_color_' + this.id + '"style="background-color:' + this.project_color + '">' + this.project_color + '</td>' +
          '<td>' +
          '<button class="center-block" type="button" id="' + this.id + '" class="btn btn-default" onclick="projectputmodal(' + this.id + ')">編集・消去</button>' +
          '</td>' +
          '</tr>').appendTo('table.code_tbl tbody');
        $('#code_table').css({
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
