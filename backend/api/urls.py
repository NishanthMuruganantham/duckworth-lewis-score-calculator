from django.urls import path
from .views import DLSScoreView, ResourceTableView, HealthCheckView, APIRootView


app_name = "api"

urlpatterns = [
    path("", APIRootView.as_view(), name="api_root"),
    path("calculate-dls-score/", DLSScoreView.as_view(), name="calculate_dls_score"),
    path("resource-table/", ResourceTableView.as_view(), name="resource_table"),
    path("health-check/", HealthCheckView.as_view(), name="health_check"),
]
