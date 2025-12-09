from django.urls import path
from .views import DLSScoreView

app_name = "api"

urlpatterns = [
    path("calculate-dls-score/", DLSScoreView.as_view(), name="calculate_dls_score"),
]
