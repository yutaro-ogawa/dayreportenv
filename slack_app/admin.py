from django.contrib import admin
from .models import Slack_text
# Register your models here.


class Slack_textAdmin(admin.ModelAdmin):
    #fields = ["id", "title", "start", "end"]  # これを使用すると、adminで設定できる項目が決まる
    search_fields = ("detail","created_date","username") # これを使用すると、設定項目で検索できるようになる
    list_filter =("detail","created_date","username")  # これを使用すると、フィルターが横にできる
    list_display =("detail","created_date","username")  # 一覧画面に表示される


admin.site.register(Slack_text, Slack_textAdmin)
