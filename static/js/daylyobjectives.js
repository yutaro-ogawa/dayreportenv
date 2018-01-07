$(function() {
  var calEvent_global = undefined; // モーダル操作用のグローバル変数
  var exists_event_global = false; // イベントのグローバル変数
  var event_id_global = 1; // eventのid
  $('#calendar').fullCalendar({
      //参考ページ　https://www.arms-soft.co.jp/blog/1061/
      //ヘッダーの設定
      header: {
        left: 'today month,agendaWeek,agendaDay',
        center: 'title',
        right: 'prev next'
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
      editable: true, // イベントを編集するか

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
            exists_event_global = true;
            return true;
          }
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
            if (input1) {
              eventData = {
                title: '最重要：' + input1,
                start: start,
                end: end,
                id: event_id_global,
              };
              event_id_global += 1;
              $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            }
            if (input2) {
              eventData = {
                title: '理想 ：' + input2,
                start: start,
                end: end,
                id: event_id_global,
              };
              event_id_global += 1;
              $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true

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

      droppable: true, // イベントをドラッグできるかどうか
      events: [{
        title: 'WSI室での活動を始めるWSI室での活動を始めるWSI室での活動を始める',
        start: '2018-01-14',
        id: 0,
      }],


    }

  );
  // 以下モーダルでボタンを押したときの動き
  $("#editModal-1").click(function() {
    calEvent_global.title = document.getElementById("editModalInput1").value;
    $('#calendar').fullCalendar('updateEvent', calEvent_global);
  });

  $("#editModal-2").click(function() {
    $('#calendar').fullCalendar("removeEvents", calEvent_global.id); //イベント（予定）の削除
  });


  $("#editModal-3").click(function() {
    calEvent_global.title = "  〇：" + calEvent_global.title.substr(4)
    $('#calendar').fullCalendar('updateEvent', calEvent_global);
  });

  $("#editModal-4").click(function() {
    calEvent_global.title = "  △：" + calEvent_global.title.substr(4)
    $('#calendar').fullCalendar('updateEvent', calEvent_global);
  });

  $("#editModal-5").click(function() {
    calEvent_global.title = "  ✖：" + calEvent_global.title.substr(4)
    $('#calendar').fullCalendar('updateEvent', calEvent_global);
  });

});
