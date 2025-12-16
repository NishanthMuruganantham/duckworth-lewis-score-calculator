from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import DLSRequestSerializer
from .services import DLSService
from calculators.dls_calculator import DLSCalculator


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
        match_format = request.query_params.get("format", "T20")
        calculator = DLSCalculator(match_format)
        df = calculator.resource_table_df

        data = {
            "columns": list(df.columns),
            "data": df.values.tolist()
        }
        return Response(data, status=status.HTTP_200_OK)
