from django.urls import path
from .views import DLSScoreView, ResourceTableView


app_name = "api"

urlpatterns = [
    path("calculate-dls-score/", DLSScoreView.as_view(), name="calculate_dls_score"),
    path("resource-table/", ResourceTableView.as_view(), name="resource_table"),
]
