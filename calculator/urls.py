from django.urls import path
from . import views

app_name = 'calculator'

urlpatterns = [
    path('', views.index, name='cricket_match_details'),
]
