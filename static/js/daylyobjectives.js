$(function() {
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
          columnFormat:'M/D ddd'

          // options apply to basicWeek and basicDay views
        },
        agenda: {
          titleFormat: 'M/D ddd',
          columnFormat:'M/D ddd'

          // options apply to agendaWeek and agendaDay views
        },
        week: {
          titleFormat: 'M/D ddd',
          columnFormat:'M/D ddd'

          // options apply to basicWeek and agendaWeek views
        },
        day: {
          titleFormat: 'M/D ddd',
          columnFormat:'M/D ddd'
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
        $('#sampleModal').modal();
        $("#modal-save").click(function () {
          $('#modal-save').unbind();
          var input1 = $("#modalInput1").val();
          var input2 = $("#modalInput2").val();
          if (input1) {
            eventData = {
              title: '最重要：'+input1,
              start: start,
              end: end
            };
            $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
          }
          if (input2) {
            eventData = {
              title: '理想：'+input2,
              start: start,
              end: end
            };
            $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            $('#calendar').fullCalendar('unselect');

          }
        $('.modal').find('input').val('');


        });

        //alert(start.toISOString()+' is clicked!' );
      },

      eventClick: function(calEvent, jsEvent, view) {
        $('#sampleModal').modal();

        //イベントをクリックしたときの処理

      },

      droppable: true, // イベントをドラッグできるかどうか
      events: [
        {
          title: 'WSI室での活動を始めるWSI室での活動を始めるWSI室での活動を始める',
          start: '2018-01-14',
        }
      ],


    }

  );
});

$('#sampleModal').on('hidden', function() {
    $(this).removeData('modal');
});
