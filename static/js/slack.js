//---------------------------------------------------------
// 最初に実行
//---------------------------------------------------------
$(document).ready(function() {
  slack_postcontents_Get() ;
});

//---------------------------------------------------------
// slackへの投稿内容を取得する
//---------------------------------------------------------
function slack_postcontents_Get() {
  var get_url = "../api/slack/"
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
      $(data).each(function() {
        //連想配列をループ処理で値を取り出してtextareaにセットする
        document.getElementById("slack_post").value = this.detail;
      })
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

//---------------------------------------------------------
// slackへ投稿する
//---------------------------------------------------------
function slack_POST1() {
  var post_text =  $("#slack_post").val();
  payload = {
    'text': post_text
  }
  $.ajax({
    method: "POST",
    url: "https://hooks.slack.com/services/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",
    dataType: "text",
    data: JSON.stringify(payload),
    success: function(data) {
      console.log("slack_送信");
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}

function slack_POST2() {
  var post_text =  $("#slack_post").val();
  payload = {
    'text': post_text
  }
  $.ajax({
    method: "POST",
    url: "https://hooks.slack.com/services/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",
    dataType: "text",
    data: JSON.stringify(payload),
    success: function(data) {
      console.log("slack_送信");
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}
