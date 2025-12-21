import os
from django.conf import settings
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from calculators.dls_calculator import DLSCalculator
from .serializers import DLSRequestSerializer
from .services import DLSService


class DLSScoreView(APIView):
    """
    API View for calculating Duckworth-Lewis-Stern (DLS) par scores.
    """

    def post(self, request):
        """
        Calculates the DLS par score based on the provided scenario and data.
        """
        serializer = DLSRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dls_service = DLSService()

        try:
            par_score = dls_service.calculate(serializer.validated_data)
            response_data = {
                "par_score": par_score,
                "revised_target": par_score + 1,
                "messages": ["Target calculated successfully."]
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            response_data = {
                "status": "error",
                "message": str(e)
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class ResourceTableView(APIView):
    """
    API View for retrieving the DLS resource table.
    """

    def get(self, request):
        """
        Returns the DLS resource table data.
        """
        match_format = request.query_params.get("match_format", "T20")
        calculator = DLSCalculator(match_format)
        df = calculator.resource_table_df

        data = {
            "columns": list(df.columns),
            "data": df.values.tolist()
        }
        return Response(data, status=status.HTTP_200_OK)


class HealthCheckView(APIView):
    """
    API View for health checks.
    """

    def get(self, request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class APIRootView(APIView):
    """
    Root API View to provide information about available endpoints.
    """

    def get(self, request):
        return Response({
            "message": "Welcome to the Duckworth-Lewis-Stern (DLS) Score Calculator API",
            "endpoints": {
                "calculate-dls-score": "/calculate-dls-score/",
                "resource-table": "/resource-table/",
                "health-check": "/health-check/",
                "openapi-schema": "/openapi-schema.yaml",
            },
            "version": "v1.0.0",
            "documentation": "https://github.com/NishanthMuruganantham/duckworth-lewis-score-calculator"
        }, status=status.HTTP_200_OK)


class SwaggerSchemaView(APIView):
    """
    API View for serving the OpenAPI schema.
    """

    def get(self, request):
        file_path = os.path.join(settings.BASE_DIR, "openapi-schema.yaml")
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                content = f.read()
            return HttpResponse(content, content_type="text/yaml")
        return Response({"error": "Schema not found"}, status=status.HTTP_404_NOT_FOUND)
