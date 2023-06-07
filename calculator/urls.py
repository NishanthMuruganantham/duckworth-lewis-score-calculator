from django.urls import path
from . import views

app_name = 'calculator'

urlpatterns = [
    path('cricket-match-details/', views.cricket_match_details, name='cricket_match_details'),
]
