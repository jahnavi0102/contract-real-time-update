from django.db import models

class Contract(models.Model):
    CONTRACT_STATUSES = [
        ('draft', 'Draft'),
        ('finalized', 'Finalized'),
        ('expired', 'Expired'),
    ]
    
    contract_id = models.AutoField(primary_key=True)
    client_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=CONTRACT_STATUSES, default='draft')
    contract_type = models.CharField(max_length=100, null=True)
    effective_date = models.DateField(null=True, blank=True)
    expiration_date = models.DateField(null=True, blank=True)
    contract_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    description = models.TextField(null=True)
    uploaded_by = models.CharField(max_length=255, default='admin')
    last_modified = models.DateTimeField(auto_now=True)
    contract_created = models.DateTimeField(auto_now_add=True)

