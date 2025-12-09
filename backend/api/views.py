from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DLSRequestSerializer

@api_view(['GET'])
def hello_nishanth(request):
    return Response({"message": "Hello, Nishanth!"})


@api_view(['POST'])
def calculate_dls_score(request):
    print(request.data)
    serializer = DLSRequestSerializer(data=request.data)
    if serializer.is_valid():
        return Response(serializer.data)
    return Response(serializer.errors, status=400)
