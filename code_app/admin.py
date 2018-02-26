from django.contrib import admin
from .models import Code
# Register your models here.


class CodeAdmin(admin.ModelAdmin):
    #fields = ["id", "title", "start", "end"]  # これを使用すると、adminで設定できる項目が決まる
    search_fields = ["id", "title","code_id","code_color"]  # これを使用すると、設定項目で検索できるようになる
    list_filter = ["id", "title","code_id","code_color"]  # これを使用すると、フィルターが横にできる
    list_display = ["id", "title","code_id","code_color"]  # 一覧画面に表示される


admin.site.register(Code, CodeAdmin)
