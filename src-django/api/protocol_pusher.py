import os

from django.db import transaction
from pyfcm import FCMNotification

from api.models import Device, PushEvent


def push_procedure_to_devices(owner, procedure_id):
    # api_key from https://console.firebase.google.com/project/sanamobile-1f7b1/settings/general/
    push_service = FCMNotification(
        api_key="FILL API KEY HERE"
    )

    secret_key = os.urandom(32).encode('hex')
    PushEvent.objects.create(procedure_id=procedure_id, secret_key=secret_key)

    # create a data message
    data_message = {
        "type": "newProcedure",
        "procedureId": procedure_id,
        "secretKey": secret_key,
        "fetchUrl": "/api/procedures/{}/fetch?secret={}".format(procedure_id, secret_key),
    }

    registration_ids = Device.objects.all().values_list('registration_id', flat=True)
    registration_ids = [i.encode('ascii', 'ignore') for i in registration_ids]

    result = push_service.notify_multiple_devices(registration_ids=registration_ids, data_message=data_message)
