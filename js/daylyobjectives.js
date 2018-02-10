//---------------------------------------------------------
// fullCalendar関連の設定
//---------------------------------------------------------
$(function() {
  var calEvent_global = undefined; // モーダル操作用のグローバル変数
  var exists_event_global = false; // イベントのグローバル変数


  $('#calendar').fullCalendar({
      //参考ページ　https://www.arms-soft.co.jp/blog/1061/
      //ヘッダーの設定
      header: {
        left: '',
        //        left: 'today month,agendaWeek,agendaDay',
        center: 'title',
        right: 'prev today next'
      },
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
      editable: false, // イベントを編集するか、ドラッグできる

      allDaySlot: false, // 終日表示の枠を表示するか

      eventDurationEditable: false, // イベント期間をドラッグしで変更するかどうか

      slotEventOverlap: false, // イベントを重ねて表示するか

      selectable: true,

      selectHelper: true,


      select: function(start, end, jsEvent, view) {
        //日の枠内を選択したときの処理
        //現在ある全てのイベントを取得
        var selectedEvents = $('#calendar').fullCalendar('clientEvents', function(clEvent) {
          if (moment(start).format("YYYY-MM-DD") == moment(clEvent.start).format("YYYY-MM-DD")) {
            //すでに登録されている場合の処理
            console.log("すでにイベント登録済み");
            exists_event_global = false; //true;
            return true;
          }

          //描画されたものを全部jsonでとりたい場合
          //delete clEvent.source;
          //console.log(JSON.stringify(clEvent, null , "\t"));
        });



        if (exists_event_global == false) {
          //その日のイベントがないなら登録できる

          $('#inputModal').modal();
          $("#inputModal-cancel").click(function() {
            // モーダル内のキャンセルボタン
            $('.modal').find('input').val('');
            $('#inputModal-save').unbind();
            $('#calendar').fullCalendar('unselect');
          });

          $("#inputModal-save").click(function() {
            //　モーダル内の登録ボタン
            var input1 = $("#modalInput1").val();
            var input2 = $("#modalInput2").val();
            var username = $("#username").val();
            if (input1) {
              eventData_JSON = {
                title: '重要：' + input1,
                start: start,
                end: end,
                className: "",//色用の変更180131
              };
              calEvent_POST(eventData_JSON);
              //calEvent_Get(view);
              $('#calendar').fullCalendar('renderEvent', eventData_JSON, true); // stick? = true
            }
            if (input2) {
              eventData_JSON = {
                title: '理想：' + input2,
                start: start,
                end: end,
                className: "",//色用の変更180131
                //id: event_id_global,
                //username: username,
              };
              calEvent_POST(eventData_JSON);
              //calEvent_Get(view);
              $('#calendar').fullCalendar('renderEvent', eventData_JSON, true); // stick? = true
            }
            $('.modal').find('input').val('');
            $('#inputModal-save').unbind();
            $('#calendar').fullCalendar('unselect');
          });
        } else {
          exists_event_global = false;
        }
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
      droppable: false, // イベントをドラッグできるかどうか


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
              this.htmlLink= null;
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
    className: calEvent.className[0],//色用の変更180131
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

// Google calenderから祝日を
