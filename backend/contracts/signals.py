from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from .models import Contract
from .serializers import ContractSerializer
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()

@receiver(post_save, sender=Contract)
def send_contract_create(sender, created, **kwargs):
    """
    Send contract create to frontend.
    """
    if created:
        async_to_sync(channel_layer.group_send)(
            "contracts_updates",
            {"type": "contract_create"},  
        )
    
@receiver(post_save, sender=Contract)
def send_contract_update(sender, instance, **kwargs):
    """
    Send contract update to frontend.
    """
    serializer = ContractSerializer(instance)
    async_to_sync(channel_layer.group_send)(
        "contracts_updates",
        {"type": "contract_update", "data": serializer.data},  
    )
        
@receiver(post_delete, sender=Contract)
def send_contract_delete(sender, instance, **kwargs):
    """
    Send contract delete to frontend.
    """
    async_to_sync(channel_layer.group_send)(
        "contracts_updates",
        {"type": "contract_delete"},  
    )
