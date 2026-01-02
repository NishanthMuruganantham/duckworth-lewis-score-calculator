from django.urls import path
from .views import DLSScoreView, ResourceTableView, HealthCheckView, APIRootView, SwaggerSchemaView, PrivacyPolicyView


app_name = "api"

urlpatterns = [
    path("", APIRootView.as_view(), name="api_root"),
    path("calculate-dls-score/", DLSScoreView.as_view(), name="calculate_dls_score"),
    path("resource-table/", ResourceTableView.as_view(), name="resource_table"),
    path("health-check/", HealthCheckView.as_view(), name="health_check"),
    path("privacy-policy/", PrivacyPolicyView.as_view(), name="privacy_policy"),
    path("openapi-schema.yaml", SwaggerSchemaView.as_view(), name="openapi_schema"),
]
