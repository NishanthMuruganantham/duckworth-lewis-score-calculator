from django.urls import path
from . import views

app_name = "api"

urlpatterns = [
    path("hello/", views.hello_nishanth, name="hello_nishanth")
]
