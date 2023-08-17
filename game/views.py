from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import  ensure_csrf_cookie

@ensure_csrf_cookie
def index(request):
    return render(request, 'game/index.html')