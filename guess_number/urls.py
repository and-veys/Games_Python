from django.urls import path        #Импорт модуля Django

from . import views                    
    
urlpatterns = [
    path('', views.main, name="main"),   
]




