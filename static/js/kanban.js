//---------------------------------------------------------
// 最初にリストを読み取る
//---------------------------------------------------------
$(document).ready(function() {
  Get_SprintBoard();
});



//https://bootsnipp.com/snippets/5K2P8
$(function() {
  //
  var kanbanCol = $('.panel-body');
  //kanbanCol.css('max-height', (window.innerHeight - 150) + 'px');
  kanbanCol.css('max-height', '250px');

  var kanbanColCount = parseInt(kanbanCol.length);
  $('.container-fluid').css('min-width', (kanbanColCount * 350) + 'px');

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
    console.log("aaa")
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
      console.log(targetId) //  ボートのid like ICEBOX
      console.log(elementId) // タスクのid
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
function Get_SprintBoard() {
  $("#ICEBOX").children().remove();
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
        var tmp_text = '<div class="kanban-entry-inner"><div class="kanban-label"><h2>' + this.title + '</h2></div></div>';
        var div = document.createElement('article');
        div.classList.add('kanban-entry');
        div.classList.add('grab');
        div.setAttribute('draggable', true);
        div.id = this.id;
        div.innerHTML = tmp_text; //html要素に変換

        switch (this.belonging_id) {
          case 0:
            document.getElementById("ICEBOX").appendChild(div);
            break;
          case 1:
            document.getElementById("WAITING").appendChild(div);
            break;
          case 2:
            document.getElementById("SPRINTBACKLOG").appendChild(div);
            break;
          case 3:
            document.getElementById("DOING").appendChild(div);
            break;
          case 4:
            document.getElementById("DONE").appendChild(div);
            break;
          case 5:
            document.getElementById("TRASH").appendChild(div);
            break;
          default:
            document.getElementById("ICEBOX").appendChild(div);

        }

        console.log(div)
      })
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}
