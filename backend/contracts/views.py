
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from .serializers import ContractSerializer
from .models import Contract
from django.db.models import Q
from .utils import ContractPagination


class ContractsViewSet(viewsets.ViewSet):
    """
    Contract CRUD operations.
    """
    pagination_class = ContractPagination

    def create(self, request):
        """
        Create Contract.
        """
        try:
            data = request.data
            serializer = ContractSerializer(data=data)
            if not serializer.is_valid():
                result = {"data":data, "status":False, "message": serializer.errors}
                return Response(data=result, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            result = {"data":serializer.data, "status":True, "message": "Created successfully"}
            return Response(data=result, status=status.HTTP_201_CREATED)
        except:
            result = {"data":data, "status":False, "message": "An error occurred"}
            return Response(data=result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def retrieve(self, request, pk=None):
        """
        Retrieve Contract.
        """
        try:
            contract_instance = Contract.objects.get(contract_id=pk)
            serializer = ContractSerializer(contract_instance)
            result = {"data":serializer.data, "status":True, "message": "Retrieved successfully"}
            return Response(data=result, status=status.HTTP_200_OK)
        except:
            result = {"data":None, "status":False, "message": "An error occurred"}
            return Response(data=result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        """
        Update Contract.
        """
        try:
            data = request.data
            contract_instance = Contract.objects.get(contract_id=pk)
            
            if contract_instance.status == 'expired':
                serializer = ContractSerializer(contract_instance)
                result = {"data":serializer.data, "status":False, "message": f"Contract is {contract_instance.status} and you cannot edit it"}
                return Response(data=result, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = ContractSerializer(contract_instance, data=data, partial=True)
            if not serializer.is_valid():
                result = {"data":data, "status":False, "message": serializer.errors}
                return Response(data=result, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            result = {"data":serializer.data, "status":True, "message": "Updated successfully"}
            return Response(data=result, status=status.HTTP_200_OK)
        except:
            result = {"data":data, "status":False, "message": "An error occurred"}
            return Response(data=result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request):
        """
        List Contracts with filtering, searching, and pagination.
        """
        # try:
        queryset = Contract.objects.all().order_by('-contract_created')
        
        if not queryset:
            result = {"data":None, "status":True, "message": "No data available"}
            return Response(data=result, status=status.HTTP_200_OK)
        
        # Filtering by status 
        status_filter = request.GET.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)


        # Searching by client_name or contract ID
        search_query = request.GET.get("search")
        if search_query:
            queryset = queryset.filter(Q(client_name__icontains=search_query) | Q(contract_id__contains=search_query))

        # Apply pagination
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = ContractSerializer(paginated_queryset, many=True)

        # return paginator.get_paginated_response(serializer.data)
        result = {"data":paginator.get_paginated_response(serializer.data).data, "status":True, "message": "Retrieved successfully"}
        return Response(data=result, status=status.HTTP_200_OK)
        # except:
        #     result = {"data":None, "status":False, "message": "An error occurred"}
        #     return Response(data=result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self, request, pk=None):
        """
        Delete Contract.
        """
        try:
            contract_instance = Contract.objects.get(contract_id=pk)
            contract_instance.delete()
            result = {"data":None, "status":True, "message": "Deleted successfully"}
            return Response(data=result, status=status.HTTP_200_OK)
        except:
            result = {"data":None, "status":False, "message": "An error occurred"}
            return Response(data=result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       
        