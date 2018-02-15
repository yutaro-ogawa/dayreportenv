from django.contrib import admin
from .models import Label
# Register your models here.


class LabelAdmin(admin.ModelAdmin):
    #fields = ["id", "title", "start", "end"]  # これを使用すると、adminで設定できる項目が決まる
    search_fields = ["id", "title","label_id","label_color", "delete_flg"]  # これを使用すると、設定項目で検索できるようになる
    list_filter = ["id", "title","label_id","label_color", "delete_flg"]  # これを使用すると、フィルターが横にできる
    list_display = ["id", "title","label_id","label_color", "delete_flg"]  # 一覧画面に表示される


admin.site.register(Label, LabelAdmin)
