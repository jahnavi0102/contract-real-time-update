import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ContractConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("contracts_updates", self.channel_name)
        await self.accept()
        
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("contracts_updates", self.channel_name)

    async def contract_create(self, event):
        await self.send(text_data=json.dumps({
            "type": "contract_create",
            "message": "A new contract has been created."
        }))

    async def contract_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "contract_update",
            "data": event["data"]
        }))

    async def contract_delete(self, event):
        await self.send(text_data=json.dumps({
            "type": "contract_delete",
            "message": "A contract has been deleted."
        }))
