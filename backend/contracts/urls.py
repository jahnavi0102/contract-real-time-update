from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContractsViewSet

router = DefaultRouter()
router.register(r'', ContractsViewSet, basename='contract')

urlpatterns = [
    path('', include(router.urls)), 
]
