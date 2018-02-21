from django.contrib import admin
from .models import Day_time
# Register your models here.


class Day_timeAdmin(admin.ModelAdmin):
    #fields = ["id", "title", "start", "end"]  # これを使用すると、adminで設定できる項目が決まる
    search_fields = ["id","title", "place","start","end","project","task","label","hurikaeri","color","detail","delete_flg", "created_date","username"]  # これを使用すると、設定項目で検索できるようになる
    list_filter = ["id","title", "place","start","end","project","task","label","hurikaeri","color","detail","delete_flg", "created_date","username"]  # これを使用すると、フィルターが横にできる
    list_display = ["id","title", "place","start","end","project","task","label","hurikaeri","color","detail","delete_flg", "created_date","username"]  # 一覧画面に表示される


admin.site.register(Day_time, Day_timeAdmin)
