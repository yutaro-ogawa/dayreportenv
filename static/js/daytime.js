//---------------------------------------------------------
// 最初にリストを読み取る
//---------------------------------------------------------
$(document).ready(function() {
  project_Get_selecter();
  task_Get_selecter();
  label_Get_selecter();
});





//---------------------------------------------------------
// fullCalendar関連の設定
//---------------------------------------------------------
$(function() {
  var calEvent_global = undefined; // モーダル操作用のグローバル変数
  var exists_event_global = false; // イベントのグローバル変数



  $('#calendar').fullCalendar({
      //参考ページ　https://www.arms-soft.co.jp/blog/1061/
      height: 650,
      //ヘッダーの設定
      header: {
        left: '',
        center: 'title',
        right: 'prev  agendaWeek month today next'
      },
      defaultView: 'agendaWeek',
      firstDay: 1,
      views: {
        basic: {
          titleFormat: 'M/D ddd',
          columnFormat: 'M/D ddd'
          // options apply to basicWeek and basicDay views
        },
        agenda: {
          titleFormat: 'M/D ddd',
          columnFormat: 'M/D ddd'

          // options apply to agendaWeek and agendaDay views
        },
        week: {
          titleFormat: 'M/D ddd',
          columnFormat: 'M/D ddd'

          // options apply to basicWeek and agendaWeek views
        },
        day: {
          titleFormat: 'M/D ddd',
          columnFormat: 'M/D ddd'
          // options apply to basicDay and agendaDay views
        }
      },

      timeFormat: 'H:mm', // uppercase H for 24-hour clock
      axisFormat: 'H:mm', //時間軸に表示する時間の表示フォーマットを指定する

      allDaySlot: true, // 終日表示の枠を表示するか

      editable: true, // イベントを編集するか、ドラッグできる
      eventDurationEditable: true, // イベント期間をドラッグしで変更するかどうか
      slotEventOverlap: true, // イベントを重ねて表示するか
      selectable: true,
      selectHelper: true,
      navLinks: false, // can click day/week names to navigate views
      droppable: true, // イベントをドラッグできるかどうか

      select: function(start, end, jsEvent, view) {
        //日の枠内を選択したときの処理

        //イベントをクリックしたときの処理　初期表示
        $('#inputModal').on('show.bs.modal', function() {
          document.getElementById("inputModal-start").value = moment(start).format("hh:mm");
          document.getElementById("inputModal-end").value = moment(end).format("hh:mm");
          document.getElementById("inputModal-place").value = "14F";
          document.getElementById("inputModal-detail").value = "";
          document.getElementById("inputModal-project").value = "1";
          document.getElementById("inputModal-task").value = "2";
          document.getElementById("inputModal-label").value = "2";
          document.getElementById("inputModal-radio0").checked=true;
        });


        $('#inputModal').modal();
        $("#inputModal-cancel").click(function() {
          // モーダル内のキャンセルボタン
          $('.modal').find('input').val('');
          $('#inputModal-save').unbind();
          $('#calendar').fullCalendar('unselect');
        });

        $("#inputModal-save").click(function() {

          //　モーダル内の登録ボタン
          var title = $("#inputModal-title").val();
          var start_time = $("#inputModal-start").val();
          var start_day = moment(start).format("YYYY-MM-DD");
          var end_time = $("#inputModal-end").val();
          //var end_day = moment(end).format("YYYY-MM-DD");
          var place = $("#inputModal-place").val();
          var project_id = $("#inputModal-project").val();
          var task_id = $("#inputModal-task").val();
          var label_id = $("#inputModal-label").val();
          //振り返りのradioボタン
          var hurikaeri0 = document.getElementById("inputModal-radio0").checked;
          var hurikaeri1 = document.getElementById("inputModal-radio1").checked;
          var hurikaeri2 =document.getElementById("inputModal-radio2").checked;
          var hurikaeri3 = document.getElementById("inputModal-radio3").checked;
          var hurikaeri4 = document.getElementById("inputModal-radio4").checked;
          var hurikaeri =1;
          if (hurikaeri1 == true) {
            hurikaeri = "1";
          } else if (hurikaeri2 == true) {
            hurikaeri = "2";
          }  else if (hurikaeri3 == true) {
            hurikaeri = "3";
          }  else if (hurikaeri4 == true) {
            hurikaeri = "4";
          } else {
            hurikaeri = "0";
          }

          project_Get_color(project_id); // htmlhiddenの要素を非同期で書き換え
          var project_color = $("#project_color").val();

          if (title) {
            eventData_JSON = {
              title: title + '@' + place,
              place: place,
              start: start_day + 'T' + start_time,
              end: start_day + 'T' + end_time,
              className: "", //色用の変更180131
              project: project_id,
              task: task_id,
              label: label_id,
              hurikaeri: hurikaeri,
              color: project_color,
            };
            console.log(eventData_JSON);
            //calEvent_POST(eventData_JSON);
            //calEvent_Get(view);
            $('#calendar').fullCalendar('renderEvent', eventData_JSON, true); // stick? = true
          }

          $('.modal').find('input').val('');
          $('#inputModal-save').unbind();
          $('#calendar').fullCalendar('unselect');
        });
      },

      eventClick: function(calEvent, jsEvent, view) {
        calEvent_global = calEvent; //globalパラメータに渡す
        //イベントをクリックしたときの処理
        $('#editModal').on('show.bs.modal', function() {
          document.getElementById("editModalInput1").value = calEvent.title;
        });
        $('#editModal').modal('show');
        //モーダルを閉じる動作は下側で定義
        $('#calendar').fullCalendar('unselect');
      },



      //
      googleCalendarApiKey: 'AIzaSyC3pE8ovaTqgOmPPUXmeC4dA5k-Xmwv5zM',

      //Ajaxで自動取得 eventを自動で描画する
      eventSources: [{
          events: function(start, end, timezone, callback) {
            var get_url = "../api/calevent?start_date=" + (moment(start).format("YYYY-MM-DD")) + "&end_date=" + (moment(end).format("YYYY-MM-DD"));
            //パラメータで日付をわたす
            console.log(get_url);
            $.ajax({
              method: "GET",
              url: get_url,
              dataType: "json",
              data: "",
              contentType: "application/json",
              success: function(data) {
                console.log(data);
                var events = [];
                $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('addEventSource', data);
                callback(events);
              },
              error: function(data) {
                console.log("Ajax create Failed")
              }
            })
          }
        },
        //祝日

        {
          googleCalendarId: 'ja.japanese#holiday@group.v.calendar.google.com',
          className: 'fc-holiday-event',
          success: function(events) {
            $(events.items).each(function() {
              //this.url = null;
              //this.items[0].url = null;
              this.htmlLink = null;
              console.log(this);


              //console.log(this.items[0].htmlLink);
              //console.log(this.items);


            });
          },

        },
      ],




    } //  $('#calendar').fullCalendar

  ); //$(function()



  // 以下モーダルでボタンを押したときの動き
  $("#editModal-1").click(function() {
    calEvent_global.title = document.getElementById("editModalInput1").value;
    $('#calendar').fullCalendar('updateEvent', calEvent_global);
    eventData_JSON = calEvent2JSON(calEvent_global);
    calEvent_PUT(eventData_JSON);
  });

  $("#editModal-2").click(function() {
    $('#calendar').fullCalendar("removeEvents", calEvent_global.id); //イベント（予定）の削除
    eventData_JSON = calEvent2JSON(calEvent_global);
    calEvent_Delete(eventData_JSON);
  });


  $("#editModal-3").click(function() {
    calEvent_global.title = "◯ ：" + calEvent_global.title.substr(3);
    calEvent_global.className[0] = "fc-event-success"; //色用の変更180131
    $('#calendar').fullCalendar('updateEvent', calEvent_global);
    eventData_JSON = calEvent2JSON(calEvent_global);
    calEvent_PUT(eventData_JSON);

  });

  $("#editModal-4").click(function() {
    calEvent_global.title = "△ ：" + calEvent_global.title.substr(3);
    calEvent_global.className[0] = "fc-event-soso"; //色用の変更180131
    $('#calendar').fullCalendar('updateEvent', calEvent_global);
    eventData_JSON = calEvent2JSON(calEvent_global);
    calEvent_PUT(eventData_JSON);
  });

  $("#editModal-5").click(function() {
    calEvent_global.title = "✖ ：" + calEvent_global.title.substr(3);
    calEvent_global.className[0] = "fc-event-fail"; //色用の変更180131
    $('#calendar').fullCalendar('updateEvent', calEvent_global);
    eventData_JSON = calEvent2JSON(calEvent_global);
    calEvent_PUT(eventData_JSON);
  });

});



//---------------------------------------------------------
// その他の設定
//---------------------------------------------------------

// fullCalendarのeventデータをpostするjson形式に変更する関数です
function calEvent2JSON(calEvent) {
  var eventData_JSON = {
    title: calEvent.title,
    start: calEvent.start,
    end: calEvent.end,
    id: calEvent.id,
    className: calEvent.className[0], //色用の変更180131
  };
  console.log(eventData_JSON);

  return eventData_JSON;
}


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

//POSTでEVENTを追加
function calEvent_POST(eventData_JSON) {
  $.ajax({
    method: "POST",
    url: "../api/calevent/",
    dataType: "json",
    data: JSON.stringify(eventData_JSON),
    contentType: "application/json",
    success: function(data) {
      console.log(data);
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

//PUTでEVENTを編集
function calEvent_PUT(eventData_JSON) {
  $.ajax({
    method: "PUT",
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

//Eventを取得する
function calEvent_Get(view) {
  var get_url = "../api/calevent?start_date=" + (moment(view.start).format("YYYY-MM-DD")) + "&end_date=" + (moment(view.end).format("YYYY-MM-DD"));
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
      $('#calendar').fullCalendar('removeEvents');
      $('#calendar').fullCalendar('addEventSource', data);
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

//});

//-------------------------------------------------------------------------
// 動的にselect要素を生成
//-------------------------------------------------------------------------
//プロジェクトをJsonから取得
function project_Get_selecter() {
  $("#inputModal-project").children().remove();
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
        //連想配列をループ処理で値を取り出してセレクトボックスにセットする
        let op = document.createElement("option");
        op.value = this.id; //value値
        op.text = this.title; //テキスト値
        document.getElementById("inputModal-project").appendChild(op);
      })
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

//タスクをJsonから取得
function task_Get_selecter() {
  var get_url = "../api/code";
  $("#inputModal-task").children().remove();

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
        //連想配列をループ処理で値を取り出してセレクトボックスにセットする
        let op = document.createElement("option");
        op.value = this.id; //value値
        op.text = this.title; //テキスト値
        document.getElementById("inputModal-task").appendChild(op);
      })
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

//ラベルをJsonから取得
function label_Get_selecter() {
  var get_url = "../api/label";
  $("#inputModal-label").children().remove();

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
        //連想配列をループ処理で値を取り出してセレクトボックスにセットする
        let op = document.createElement("option");
        op.value = this.id; //value値
        op.text = this.title; //テキスト値
        document.getElementById("inputModal-label").appendChild(op);
      })
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

//-------------------------------------------------------------------------
// プロジェクトカラーをゲット
//-------------------------------------------------------------------------
//プロジェクトをJsonから取得
//非同期通信にしている
function project_Get_color(project_id) {
  var get_url = "../api/project/" + project_id + "/";
  console.log(get_url);

  var project = $.ajax({
    method: "GET",
    url: get_url,
    dataType: "json",
    data: "",
    contentType: "application/json",
    async: false,

    success: function(data) {
      $(data).each(function() {
        document.getElementById("project_color").value = this.project_color;

      });
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  });
  return project;
}

//-------------------------------------------------------------------------
// プロジェクトカラーをゲット
//-------------------------------------------------------------------------
// PUTとGETの順番が入れ替わるのを防ぐスリープ
function sleep(ms) {
  const d1 = new Date();
  while (true) {
    const d2 = new Date();
    if (d2 - d1 > ms) {
      break;
    }
  }
}

//-------------------------------------
//新規の作成系 プロジェクト
//-------------------------------------
function projectcancel() {
  //モーダルのリセットをしておく
  $("#pmodalInput1").val('');
  $("#pmodalInput2").val('');
  $("#pmodalInput3").val('#00ff00');
  $('#project-register-Modal').modal('hide');
}

function projectsave() {
  //　モーダル内の登録ボタン
  var project_title = $("#pmodalInput1").val();
  var project_id = $("#pmodalInput2").val();
  var project_color = $("#pmodalInput3").val();

  if (project_title) {
    project_JSON = {
      title: project_title,
      project_id: project_id,
      project_color: project_color,
    };
    project_POST(project_JSON);
    project_Get_selecter();

    //モーダルのリセットをしておく
    $("#pmodalInput1").val('');
    $("#pmodalInput2").val('');
    $("#pmodalInput3").val('#00ff00');
    $('#project-register-Modal').modal('hide');
  }
}

//POST
function project_POST(project_JSON) {
  $.ajax({
    method: "POST",
    url: "../api/project/",
    dataType: "json",
    data: JSON.stringify(project_JSON),
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

//-------------------------------------
//新規の作成系 タスク
//-------------------------------------
function codecancel() {
  //モーダルのリセットをしておく
  $("#tmodalInput1").val('');
  $("#tmodalInput2").val('');
  $("#tmodalInput3").val('#00ff00');
  $('#code-register-Modal').modal('hide');
}

function codesave() {
  //　モーダル内の登録ボタン
  var code_title = $("#tmodalInput1").val();
  var code_id = $("#tmodalInput2").val();
  var code_color = $("#tmodalInput3").val();

  if (code_title) {
    code_JSON = {
      title: code_title,
      code_id: code_id,
      code_color: code_color,
    };
    code_POST(code_JSON);
    task_Get_selecter();

    //モーダルのリセットをしておく
    $("#tmodalInput1").val('');
    $("#tmodalInput2").val('');
    $("#tmodalInput3").val('#00ff00');
    $('#code-register-Modal').modal('hide');
  }
}

//POST
function code_POST(code_JSON) {
  $.ajax({
    method: "POST",
    url: "../api/code/",
    dataType: "json",
    data: JSON.stringify(code_JSON),
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

//-------------------------------------
//新規の作成系 ラベル
//-------------------------------------
function labelcancel() {
  //モーダルのリセットをしておく
  $("#lmodalInput1").val('');
  $("#lmodalInput2").val('');
  $("#lmodalInput3").val('#00ff00');
  $('#label-register-Modal').modal('hide');
}

function labelsave() {
  //　モーダル内の登録ボタン
  var label_title = $("#lmodalInput1").val();
  var label_id = $("#lmodalInput2").val();
  var label_color = $("#lmodalInput3").val();

  if (label_title) {
    label_JSON = {
      title: label_title,
      label_id: label_id,
      label_color: label_color,
    };
    label_POST(label_JSON);
    label_Get_selecter();

    //モーダルのリセットをしておく
    $("#lmodalInput1").val('');
    $("#lmodalInput2").val('');
    $("#lmodalInput3").val('#00ff00');
    $('#label-register-Modal').modal('hide');
  }
}

//POST
function label_POST(label_JSON) {
  $.ajax({
    method: "POST",
    url: "../api/label/",
    dataType: "json",
    data: JSON.stringify(label_JSON),
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
