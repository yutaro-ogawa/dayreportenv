

//---------------------------------------------------------
// 最初にリストを読み取る
//---------------------------------------------------------
$(document).ready(function() {
  //project_Get_selecter();
  getSprintBoardAll();
});



//https://bootsnipp.com/snippets/5K2P8
$(function() {
  //
  var kanbanCol = $('.panel-body');
  //kanbanCol.css('max-height', (window.innerHeight - 150) + 'px');
  kanbanCol.css('max-height', '250px');

  var kanbanColCount = parseInt(kanbanCol.length);
  //$('.container-fluid').css('min-width', (kanbanColCount * 150) + 'px');

  draggableInit();

  // パネルタイトルをクリックした閉じる
  $('.panel-heading').click(function() {
    //var $panelBody = $(this).parent().children('.panel-body');
    //$panelBody.slideToggle();
  });
});

function draggableInit() {
  var sourceId;

  $('.panel-body').bind('dragstart', function(event) {
    sourceId = $(this).parent().attr('id');
    event.originalEvent.dataTransfer.setData("text/plain", event.target.getAttribute('id'));

  });

  $('.panel-body').bind('dragover', function(event) {
    event.preventDefault(); // 上位のイベントを止める
  });

  $('.panel-body').bind('drop', function(event) {
    var children = $(this).children();
    var targetId = children.attr('id');
    if (sourceId != targetId) {
      var elementId = event.originalEvent.dataTransfer.getData("text/plain");
      var element = document.getElementById(elementId);
      children.prepend(element);
      //console.log(targetId); //  ボートのid like ICEBOX
      //console.log(elementId); // タスクのid
       putSprintBoard (elementId, targetId);

    }

    event.preventDefault(); // 上位のイベントを止める
  });
}


//---------------------------------------------------------
// その他の設定
//---------------------------------------------------------

//$(document).ready(function() {
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
  //return (/^(GET|PUT|DELETE|PATCH|HEAD|OPTIONS|TRACE)$/.test(method));
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


//-------------------------------------------------------------------------
// 動的にsprintboardを生成
//-------------------------------------------------------------------------
//プロジェクトをJsonから取得
function getSprintBoardAll() {
  $("#ICEBOX").children().remove();
  $("#WAITING").children().remove();
  $("#SPRINTBACKLOG").children().remove();
  $("#DOING").children().remove();
  $("#DONE").children().remove();
  $("#TRASH").children().remove();

  var get_url = "../api/sprintboard";
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

        project_Get_color(this.project)
        var tmp_text = '<div class="kanban-entry-inner"><div class="kanban-label" style="background-color:'+ project_color_global +';"><h2>' + this.title + '</h2></div></div>';
        var div = document.createElement('article');
        div.classList.add('kanban-entry');
        div.classList.add('grab');
        div.setAttribute('draggable', true);
        div.id = this.id;
        div.innerHTML = tmp_text; //html要素に変換

        switch (this.belonging_id) {
          case "ICEBOX":
            document.getElementById("ICEBOX").appendChild(div);
            break;
          case "WAITING":
            document.getElementById("WAITING").appendChild(div);
            break;
          case "SPRINTBACKLOG":
            document.getElementById("SPRINTBACKLOG").appendChild(div);
            break;
          case "DOING":
            document.getElementById("DOING").appendChild(div);
            break;
          case "DONE":
            document.getElementById("DONE").appendChild(div);
            break;
          case "TRASH":
            document.getElementById("TRASH").appendChild(div);
            break;
          default:
            document.getElementById("ICEBOX").appendChild(div);

        }

        //console.log(div)
      })
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

// 特定の看板データを得る
//プロジェクトをJsonから取得
function getSprintBoard(board_id) {
  var get_url = "../api/sprintboard/" + board_id + "/";
  console.log(get_url);
  $.ajax({
    method: "GET",
    url: get_url,
    dataType: "json",
    data: "",
    contentType: "application/json",
    async: false,
    success: function(data) {
      //console.log(data)
      eventData_JSON = data;
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

// kanbantデータをjson形式に変更する関数です
function kanban2JSON(elementId, targetId) {
  getSprintBoard(elementId); // 看板オブジェクトを格納

  if(eventData_JSON.belonging_id == targetId){
    eventData_JSON.number = eventData_JSON.number + 1;
  }else{
    eventData_JSON.number = 0;
  }


  eventData_JSON.belonging_id = targetId; // 更新
  if(targetId == "TRASH"){
    eventData_JSON.delete_flg = true;
  }

  return eventData_JSON;
}

//PUTでEVENTを編集
function putSprintBoard(elementId, targetId) {
  kanban2JSON(elementId, targetId)

  $.ajax({
    method: "PUT",
    url: "../api/sprintboard/" + eventData_JSON.id + "/",
    dataType: "json",
    data: JSON.stringify(eventData_JSON),
    contentType: "application/json",
    async: false,
    success: function(data) {
      console.log(data);
      getSprintBoardAll();
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}




//プロジェクトをJsonから取得
//非同期通信にしている
function project_Get_color(project_id) {
  var get_url = "../api/project/" + project_id + "/";
  //console.log(get_url);

  var project = $.ajax({
    method: "GET",
    url: get_url,
    dataType: "json",
    data: "",
    contentType: "application/json",
    async: false,

    success: function(data) {
      $(data).each(function() {
        project_color_global = this.project_color;

      });
    },
    error: function(data) {
      project_color_global ='#ffffff';
      //console.log("Ajax create Failed")
    }
  });
  return project;
}

//プロジェクトをJsonから取得
function project_Get_selecter() {
  $("#inputModal-project").children().remove();
  $("#editModal-project").children().remove();
  $("#kinputModal-project").children().remove();
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
      //console.log(data)
      //HTMLを生成
      $(data).each(function() {
        //連想配列をループ処理で値を取り出してセレクトボックスにセットする
        let op = document.createElement("option");
        op.value = this.id; //value値
        op.text = this.title; //テキスト値
        document.getElementById("kinputModal-project").appendChild(op);
      })
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

function kanbanCancel() {
  // モーダル内のキャンセルボタン
  $("#kmodalInput1").val('');
  document.getElementById("kinputModal-project").value = "1";
  $('#createKanbanModal').modal('hide');
}


function kanbanSave() {
  //　モーダル内の登録ボタン
  var kanban_title = $("#kmodalInput1").val();
  var project_id = $("#kinputModal-project").val();
  console.log(project_id);

  eventData_JSON = {
    title: kanban_title,
    project: project_id,
    belonging_id: "ICEBOX",
    number: 0,
  };

  postSprintBoard(eventData_JSON);
  getSprintBoardAll();

  $('#createKanbanModal').modal('hide');
}

//POST
function postSprintBoard(eventData_JSON) {
  $.ajax({
    method: "POST",
    url: "../api/sprintboard/",
    dataType: "json",
    data: JSON.stringify(eventData_JSON),
    contentType: "application/json",
    async: false,
    success: function(data) {
      console.log(data);
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}
