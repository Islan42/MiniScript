from django.urls import path
from . import views

app_name = 'score'
urlpatterns = [
    path('', views.top_general, name='index'),
    path('desktop/', views.top_desktop, name='desktop'),
    path('mobile/', views.top_mobile, name='mobile'),
    path('all/', views.top_all, name='all'),
    path('create/', views.scoreCreate, name='score-create'),
]