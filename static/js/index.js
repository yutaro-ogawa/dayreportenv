function daystart_POST() {
  payload = {
    'text': 'hello!\nworld!'
  }
  $.ajax({
    method: "POST",
    url: "https://hooks.slack.com/services/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",
    dataType: "text",
    data: JSON.stringify(payload),
    success: function(data) {
      console.log("朝送信");
    },
    error: function(data) {
      console.log("Ajax create Failed")
    }
  })
}
