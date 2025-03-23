from rest_framework import serializers
from .models import Contract


class ContractSerializer(serializers.Serializer):
    contract_id = serializers.IntegerField(read_only=True)
    client_name = serializers.CharField(max_length=255)
    status = serializers.ChoiceField(choices=Contract.CONTRACT_STATUSES, required=False)
    contract_type = serializers.CharField(max_length=100, required=False, allow_null=True)
    effective_date = serializers.DateField(required=False, allow_null=True)
    expiration_date = serializers.DateField(required=False, allow_null=True)
    contract_value = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    description = serializers.CharField(max_length=500, required=False, allow_null=True)
    uploaded_by = serializers.CharField(max_length=255, required=False)
    last_modified = serializers.DateTimeField(read_only=True)
    contract_created = serializers.DateTimeField(read_only=True)
    
    
    def validate(self, data):
        if data.get('expiration_date') and data.get('effective_date') and data["expiration_date"] < data["effective_date"]:
            raise serializers.ValidationError("Expiration date must be after effective date")
        if data.get('contract_value') and data['contract_value'] < 0:
            raise serializers.ValidationError("Contract value must be a positive number")
        return data
    
    def create(self, validated_data):
        return Contract.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance