from django.shortcuts import render
from django.views.generic import View

# ユーザー追加用
from django.views.generic import CreateView
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.http import HttpResponseRedirect

# Create your views here.
class IndexView(View):
    def get(self, request):
        return render(request, 'site_manage_app/index.html')

# ユーザーの新規登録
class Register(CreateView):
    template_name ="registration/register.html"
    form_class = UserCreationForm
    success_url = reverse_lazy('register-success')

    def form_valid(self, form):
        form.save()
        return HttpResponseRedirect(self.success_url)
