from rest_framework.decorators import api_view
from rest_framework.response import Response
from calculators.dls_calculator import DLSCalculator
from .serializers import DLSRequestSerializer
from .enums import DLSScenarioEnum
from django.http import JsonResponse
from rest_framework import status

@api_view(['GET'])
def hello_nishanth(request):
    return Response({"message": "Hello, Nishanth!"})


@api_view(['POST'])
def calculate_dls_score(request):
    print(request.data)
    serializer = DLSRequestSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        dls_scenario = validated_data.get("dls_scenario")
        dls_calculator = DLSCalculator()
        par_score = dls_calculator.calculate_par_score(dls_scenario, **validated_data)
        return JsonResponse(
            {
                "par_score": par_score,
                "status": "success"
            },
            status=status.HTTP_202_ACCEPTED
        )
    return Response(serializer.errors, status=400)
