from rest_framework.decorators import api_view
from rest_framework.response import Response
from calculators.dls_calculator import DLSCalculator
from .serializers import DLSRequestSerializer
from .enums import DLSScenarioEnum

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
        return Response({"par_score": par_score})
    return Response(serializer.errors, status=400)
