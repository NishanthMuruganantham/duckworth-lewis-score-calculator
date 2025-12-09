from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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
                "status": "success",
                "data": {
                    "par_score": par_score
                }
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            response_data = {
                "status": "error",
                "message": str(e)
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
