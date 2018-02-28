var calEvent_global = undefined; // モーダル操作用のグローバル変数
var start_global = null;
var end_global = null;
var project_color_global = "#FF0000";
var csrf_set = false;
var today_schedule_global = "";

// イベントコピー用のshiftkeyチェック
var copyKey = false;
$(document).keydown(function(e) {
  copyKey = e.shiftKey;
}).keyup(function() {
  copyKey = false;
});


function daystart_POST() {
  //文字列として、Slackにpostする内容をapiにpostし画面遷移させる

  today_schedule_GET(),

  // 目標内容をpostする
  objective_POST();
  console.log(today_schedule_global);
  var input1 = $("#daystartform_1").val();
  var input2 = $("#daystartform_2").val();
  var input3 = $("#daystartform_3").val();
  var today = moment(new Date()).format("YYYY-MM-DD");
  var post_text = '```\n' + today + 'の計画\n' + '重要目標：' + input1 + '\n理想目標：'
  + input2 + '\n本日のひとこと：' + input3 + '\n\n今日の予定\n' + today_schedule_global + '```';
  slack_postcontents_POST(post_text);
  window.location.href = "../slack/"
}



// 目標内容をpost
function objective_POST() {
  var today = moment(new Date()).format("YYYY-MM-DD");
  var input1 = $("#daystartform_1").val();
  eventData_JSON = {
    title: '重要：' + input1,
    start: today,
    end: today,
    className: "", //色用の変更180131
  };
  if(input1){
    calEvent_POST(eventData_JSON);
  }
  var input2 = $("#daystartform_2").val();
  eventData_JSON = {
    title: '理想：' + input2,
    start: today,
    end: today,
    className: "", //色用の変更180131
  };
  if(input2){
    calEvent_POST(eventData_JSON);
  }
}

// 今日のスケジュールをget

function today_schedule_GET() {
  var get_url = "../api/day_time?start_date=" + (moment(new Date()).format("YYYY-MM-DD")) + "&end_date=" + ((moment(new Date()).add(1, 'days')).format("YYYY-MM-DD"));
  //パラメータで日付をわたす
  console.log(get_url);
  var retdata = $.ajax({
    method: "GET",
    url: get_url,
    dataType: "json",
    data: "",
    contentType: "application/json",
    async: false,
    success: function(data) {
      $(data).each(function() {
        //連想配列をループ処理で値を取り出してtextareaにセットする
        today_schedule_global = today_schedule_global + moment(this.start).format("HH:mm") + '～' + moment(this.end).format("HH:mm");
        today_schedule_global = today_schedule_global + "：" + this.title;
        today_schedule_global = today_schedule_global + "\n";
      })
      console.log(today_schedule_global)
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  }).responseText;
  return retdata;
}


// slackへの投稿内容をpost
function slack_postcontents_POST(post_text) {
  var get_url = "../api/slack/"
  payload = {
    detail: post_text
  }
  console.log(get_url);
  $.ajax({
    method: "POST",
    url: get_url,
    dataType: "json",
    data: JSON.stringify(payload),
    contentType: "application/json",
    async: false,
    success: function(data) {
      console.log(data)
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}


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

//POSTでEVENTを追加
function calEvent_POST(eventData_JSON) {
  $.ajax({
    method: "POST",
    url: "../api/calevent/",
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

  var exists_event_global = false; // イベントのグローバル変数



  $('#calendar').fullCalendar({
      //参考ページ　https://www.arms-soft.co.jp/blog/1061/
      height: 600,
      //ヘッダーの設定
      header: {
        left: '',
        center: 'title',
        right: 'prev  agendaWeek month today next'
      },
      defaultView: 'agendaWeek',
      firstDay: 1,
      scrollTime: '07:00:00',
      views: {
        basic: {
          titleFormat: 'M/D ddd',
          columnFormat: 'M/D ddd'
          // options apply to basicWeek and basicDay views
        },
        agenda: {
          titleFormat: 'M/D ddd',
          columnFormat: 'M/D ddd',
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
      timezone: 'Asia/Tokyo', // タイムゾーン設定
      allDaySlot: false, // 終日表示の枠を表示するか

      editable: true, // イベントを編集するか、ドラッグできる
      eventDurationEditable: true, // イベント期間をドラッグしで変更するかどうか
      slotEventOverlap: true, // イベントを重ねて表示するか
      selectable: true,
      selectHelper: true,
      navLinks: false, // can click day/week names to navigate views
      droppable: true, // イベントをドラッグできるかどうか



      // イベントをリサイズしたときに更新する
      eventResize: function(event, jsEvent, ui, view) {

        calEvent_global = event; //globalパラメータに渡す
        day_timeEvent_Get(event); // 気持ち悪いが、calEvent_globalにeventが入る
        console.log(calEvent_global);

        //calevent_globalの値を取得
        var start_day = moment(event.start).format("YYYY-MM-DD");
        var start_time = moment(event.start).format("HH:mm");
        var end_time = moment(event.end).format("HH:mm");

        // PUT操作
        if (calEvent_global.title) {
          eventData_JSON = {
            id: calEvent_global.id,
            title: calEvent_global.title,
            place: calEvent_global.place,
            start: start_day + 'T' + start_time,
            end: start_day + 'T' + end_time,
            className: calEvent_global.className, //色用の変更180131
            project: calEvent_global.project,
            task: calEvent_global.task,
            label: calEvent_global.label,
            hurikaeri: calEvent_global.hurikaeri,
            color: calEvent_global.color,
            detail: calEvent_global.detail,
          };
        }
        console.log(eventData_JSON);
        daytimeEvent_PUT(eventData_JSON);
        //calEvent_Get(view);
        //$('#calendar').fullCalendar('renderEvent', eventData_JSON, true); // stick? = true

      },

      //　ドロップしたときに更新する
      eventDrop: function(event, delta, revertFunc) {

        // 通常のドロップ
        if (!copyKey) {
          calEvent_global = event; //globalパラメータに渡す
          day_timeEvent_Get(event); // 気持ち悪いが、calEvent_globalにeventが入る
          console.log(calEvent_global);

          //calevent_globalの値を取得
          var start_day = moment(event.start).format("YYYY-MM-DD");
          var start_time = moment(event.start).format("HH:mm");
          var end_time = moment(event.end).format("HH:mm");

          // PUT操作
          if (calEvent_global.title) {
            eventData_JSON = {
              id: calEvent_global.id,
              title: calEvent_global.title,
              place: calEvent_global.place,
              start: start_day + 'T' + start_time,
              end: start_day + 'T' + end_time,
              className: calEvent_global.className, //色用の変更180131
              project: calEvent_global.project,
              task: calEvent_global.task,
              label: calEvent_global.label,
              hurikaeri: calEvent_global.hurikaeri,
              color: calEvent_global.color,
              detail: calEvent_global.detail,
            };
          }
          console.log(eventData_JSON);
          daytimeEvent_PUT(eventData_JSON);
          //calEvent_Get(view);
          //$('#calendar').fullCalendar('renderEvent', eventData_JSON, true); // stick? = true
        }
        //コピードロップ
        else {
          calEvent_global = event; //globalパラメータに渡す
          day_timeEvent_Get(event); // 気持ち悪いが、calEvent_globalにeventが入る
          console.log(calEvent_global);

          //calevent_globalの値を取得
          var start_day = moment(event.start).format("YYYY-MM-DD");
          var start_time = moment(event.start).format("HH:mm");
          var end_time = moment(event.end).format("HH:mm");

          // PUT操作
          if (calEvent_global.title) {
            eventData_JSON = {
              title: calEvent_global.title,
              place: calEvent_global.place,
              start: start_day + 'T' + start_time,
              end: start_day + 'T' + end_time,
              className: calEvent_global.className, //色用の変更180131
              project: calEvent_global.project,
              task: calEvent_global.task,
              label: calEvent_global.label,
              hurikaeri: 0,
              color: calEvent_global.color,
              detail: calEvent_global.detail,
            };
          }
          console.log(eventData_JSON);
          daytimeEvent_POST(eventData_JSON);
          //calEvent_Get(view);
          //$('#calendar').fullCalendar('renderEvent', eventData_JSON, true); // stick? = true
        }

      },




      select: function(start, end, jsEvent, view) {
        //日の枠内を選択したときの処理

        //イベントをクリックしたときの処理　初期表示
        $('#inputModal').on('show.bs.modal', function() {
          document.getElementById("inputModal-start").value = moment(start).format("HH:mm");
          document.getElementById("inputModal-end").value = moment(end).format("HH:mm");
          document.getElementById("inputModal-place").value = "14F";
          document.getElementById("inputModal-detail").value = "";
          document.getElementById("inputModal-project").value = "1";
          document.getElementById("inputModal-task").value = "1";
          document.getElementById("inputModal-label").value = "1";
          document.getElementById("inputModal-radio0").checked = true;
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
          var detail = $("#inputModal-detail").val();
          //振り返りのradioボタン
          var hurikaeri0 = document.getElementById("inputModal-radio0").checked;
          var hurikaeri1 = document.getElementById("inputModal-radio1").checked;
          var hurikaeri2 = document.getElementById("inputModal-radio2").checked;
          var hurikaeri3 = document.getElementById("inputModal-radio3").checked;
          var hurikaeri4 = document.getElementById("inputModal-radio4").checked;
          var hurikaeri = 1;
          if (hurikaeri1 == true) {
            hurikaeri = "1";
          } else if (hurikaeri2 == true) {
            hurikaeri = "2";
          } else if (hurikaeri3 == true) {
            hurikaeri = "3";
          } else if (hurikaeri4 == true) {
            hurikaeri = "4";
          } else {
            hurikaeri = "0";
          }

          project_Get_color(project_id); // project_color_globalに色を格納

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
              color: project_color_global,
              detail: detail,
            };
            console.log(eventData_JSON);
            daytimeEvent_POST(eventData_JSON);
            //calEvent_Get(view);
            //$('#calendar').fullCalendar('renderEvent', eventData_JSON, true); // stick? = true
          }

          $('.modal').find('input').val('');
          $('#inputModal-save').unbind();
          $('#calendar').fullCalendar('unselect');
        });


      },

      eventClick: function(calEvent, jsEvent, view) {

        calEvent_global = calEvent; //globalパラメータに渡す
        day_timeEvent_Get(calEvent);
        console.log(calEvent_global);

        //イベントをクリックしたときの処理　初期表示
        $('#editModal').on('show.bs.modal', function() {
          var title = calEvent_global.title;
          var index = title.indexOf("@");
          title = title.substring(0, index);
          document.getElementById("editModal-title").value = title;
          start_day = moment(calEvent_global.start).format("YYYY-MM-DD");
          //var end_day = moment(end).format("YYYY-MM-DD");
          document.getElementById("editModal-start").value = moment(calEvent_global.start).format("HH:mm");
          document.getElementById("editModal-end").value = moment(calEvent_global.end).format("HH:mm");
          document.getElementById("editModal-place").value = calEvent_global.place;
          document.getElementById("editModal-detail").value = calEvent_global.detail;
          document.getElementById("editModal-project").value = calEvent_global.project;
          document.getElementById("editModal-task").value = calEvent_global.task;
          document.getElementById("editModal-label").value = calEvent_global.label;
          document.getElementById("editModal-detail").value = calEvent_global.detail;
          //振り返りのradioボタン

          if (calEvent_global.hurikaeri == 1) {
            document.getElementById("editModal-radio1").checked = true;
          } else if (calEvent_global.hurikaeri == 2) {
            document.getElementById("editModal-radio2").checked = true;
          } else if (calEvent_global.hurikaeri == 3) {
            document.getElementById("editModal-radio3").checked = true;
          } else if (calEvent_global.hurikaeri == 4) {
            document.getElementById("editModal-radio4").checked = true;
          } else {
            document.getElementById("editModal-radio0").checked = true;
          }


        });


        //イベントをクリックしたときの処理
        $('#editModal').modal();

        $("#editModal-cancel").click(function() {
          // モーダル内のキャンセルボタン
          $('.modal').find('input').val('');
          $('#editModal-save').unbind();
          $('#calendar').fullCalendar('unselect');
        });

        $("#editModal-save").click(function() {

          //　モーダル内の更新ボタン
          var id = calEvent_global.id;
          var title = $("#editModal-title").val();
          var start_time = $("#editModal-start").val();
          var start_day = moment(calEvent_global.start).format("YYYY-MM-DD");
          var end_time = $("#editModal-end").val();
          //var end_day = moment(end).format("YYYY-MM-DD");
          var place = $("#editModal-place").val();
          var project_id = $("#editModal-project").val();
          var task_id = $("#editModal-task").val();
          var label_id = $("#editModal-label").val();
          var detail = $("#editModal-detail").val();
          //振り返りのradioボタン
          var hurikaeri0 = document.getElementById("editModal-radio0").checked;
          var hurikaeri1 = document.getElementById("editModal-radio1").checked;
          var hurikaeri2 = document.getElementById("editModal-radio2").checked;
          var hurikaeri3 = document.getElementById("editModal-radio3").checked;
          var hurikaeri4 = document.getElementById("editModal-radio4").checked;
          var hurikaeri = 1;
          if (hurikaeri1 == true) {
            hurikaeri = "1";
          } else if (hurikaeri2 == true) {
            hurikaeri = "2";
          } else if (hurikaeri3 == true) {
            hurikaeri = "3";
          } else if (hurikaeri4 == true) {
            hurikaeri = "4";
          } else {
            hurikaeri = "0";
          }

          project_Get_color(project_id); // project_color_globalに色を格納

          if (title) {
            eventData_JSON = {
              id: id,
              title: title + '@' + place,
              place: place,
              start: start_day + 'T' + start_time,
              end: start_day + 'T' + end_time,
              className: "", //色用の変更180131
              project: project_id,
              task: task_id,
              label: label_id,
              hurikaeri: hurikaeri,
              color: project_color_global,
              detail: detail,
            };
            console.log(eventData_JSON);
            daytimeEvent_PUT(eventData_JSON);
            //calEvent_Get(view);
            //$('#calendar').fullCalendar('renderEvent', eventData_JSON, true); // stick? = true
          }

          $('.modal').find('input').val('');
          $('#editModal-save').unbind();
          $('#calendar').fullCalendar('unselect');
        });

        $("#editModal-delete").click(function() {
          //　モーダル内の削除ボタン
          var id = calEvent_global.id;
          var title = $("#editModal-title").val();
          var start_time = $("#editModal-start").val();
          var start_day = moment(calEvent_global.start).format("YYYY-MM-DD");
          var end_time = $("#editModal-end").val();
          //var end_day = moment(end).format("YYYY-MM-DD");
          var place = $("#editModal-place").val();
          var project_id = $("#editModal-project").val();
          var task_id = $("#editModal-task").val();
          var label_id = $("#editModal-label").val();
          var detail = $("#editModal-detail").val();
          //振り返りのradioボタン
          var hurikaeri0 = document.getElementById("editModal-radio0").checked;
          var hurikaeri1 = document.getElementById("editModal-radio1").checked;
          var hurikaeri2 = document.getElementById("editModal-radio2").checked;
          var hurikaeri3 = document.getElementById("editModal-radio3").checked;
          var hurikaeri4 = document.getElementById("editModal-radio4").checked;
          var hurikaeri = 1;
          if (hurikaeri1 == true) {
            hurikaeri = "1";
          } else if (hurikaeri2 == true) {
            hurikaeri = "2";
          } else if (hurikaeri3 == true) {
            hurikaeri = "3";
          } else if (hurikaeri4 == true) {
            hurikaeri = "4";
          } else {
            hurikaeri = "0";
          }

          project_Get_color(project_id); // project_color_globalに色を格納

          if (title) {
            eventData_JSON = {
              id: id,
              title: title + '@' + place,
              place: place,
              start: start_day + 'T' + start_time,
              end: start_day + 'T' + end_time,
              className: "", //色用の変更180131
              project: project_id,
              task: task_id,
              label: label_id,
              hurikaeri: hurikaeri,
              color: project_color_global,
              detail: detail,
            };
            console.log(eventData_JSON);
            daytimeEvent_Delete(eventData_JSON);
            //calEvent_Get(view);
            //$('#calendar').fullCalendar('renderEvent', eventData_JSON, true); // stick? = true
          }

          $('.modal').find('input').val('');
          $('#editModal-save').unbind();
          $('#calendar').fullCalendar('unselect');
        });
      },



      //
      googleCalendarApiKey: 'AIzaSyC3pE8ovaTqgOmPPUXmeC4dA5k-Xmwv5zM',

      //Ajaxで自動取得 eventを自動で描画する
      eventSources: [{
          events: function(start, end, timezone, callback) {
            start_global = start;
            end_global = end;
            var get_url = "../api/day_time?start_date=" + (moment(start_global).format("YYYY-MM-DD")) + "&end_date=" + (moment(end_global).format("YYYY-MM-DD"));
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





});



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

//POSTでEVENTを追加
function daytimeEvent_POST(eventData_JSON) {
  $.ajax({
    method: "POST",
    url: "../api/day_time/",
    dataType: "json",
    data: JSON.stringify(eventData_JSON),
    contentType: "application/json",
    async: false,
    success: function(data) {
      console.log(data);
      day_timeEvent_GetALL();
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

//PUTでEVENTを編集
function daytimeEvent_PUT(eventData_JSON) {
  $.ajax({
    method: "PUT",
    url: "../api/day_time/" + eventData_JSON.id + "/",
    dataType: "json",
    data: JSON.stringify(eventData_JSON),
    contentType: "application/json",
    async: false,
    success: function(data) {
      console.log(data);
      day_timeEvent_GetALL();
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

//PUTでEVENTを編集
function daytimeEvent_Delete(eventData_JSON) {
  $.ajax({
    method: "DELETE",
    url: "../api/day_time/" + eventData_JSON.id + "/",
    dataType: "json",
    data: JSON.stringify(eventData_JSON),
    contentType: "application/json",
    async: false,
    success: function(data) {
      console.log(data);
      day_timeEvent_GetALL();
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}


//Eventを取得する
function day_timeEvent_Get(eventData_JSON) {
  var get_url = "../api/day_time/" + eventData_JSON.id + "/"
  //パラメータで日付をわたす
  console.log(get_url);
  $.ajax({
    method: "GET",
    url: get_url,
    dataType: "json",
    data: "",
    contentType: "application/json",
    async: false,
    success: function(data) {
      calEvent_global = data;
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

function day_timeEvent_GetALL() {
  var get_url = "../api/day_time?start_date=" + (moment(start_global).format("YYYY-MM-DD")) + "&end_date=" + (moment(end_global).format("YYYY-MM-DD"));
  //パラメータで日付をわたす
  console.log(get_url);
  $.ajax({
    method: "GET",
    url: get_url,
    dataType: "json",
    data: "",
    contentType: "application/json",
    async: false,
    success: function(data) {
      console.log(data);
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
  $("#editModal-project").children().remove();
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
        let op2 = document.createElement("option");
        op2.value = this.id; //value値
        op2.text = this.title; //テキスト値
        document.getElementById("editModal-project").appendChild(op2);
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
  $("#editModal-task").children().remove();

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
        let op2 = document.createElement("option");
        op2.value = this.id; //value値
        op2.text = this.title; //テキスト値
        document.getElementById("editModal-task").appendChild(op2);

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
  $("#editModal-label").children().remove();

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

        let op2 = document.createElement("option");
        op2.value = this.id; //value値
        op2.text = this.title; //テキスト値
        document.getElementById("editModal-label").appendChild(op2);
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
        project_color_global = this.project_color;

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
