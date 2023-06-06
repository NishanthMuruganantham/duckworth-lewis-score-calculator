from django.urls import path
from . import views

urlpatterns = [
    path('cricket-match-details/', views.cricket_match_details, name='cricket_match_details'),
    # Add other URL patterns if needed
]
