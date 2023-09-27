from rest_framework import serializers
from .models import Reservations


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservations
        fields = ['reservation_datetime', 'reservation_first_name', 'reservation_last_name',
                  'phone_number', 'number_of_guests']

    def to_representation(self, instance):
        include_id = self.context.get('include_id', False)
        include_status = self.context.get('include_status', False)

        if include_id:
            self.fields['id'] = serializers.IntegerField()

        if include_status:
            self.fields['status'] = serializers.SerializerMethodField()

        return super().to_representation(instance)

    @staticmethod
    def get_status(obj):
        return dict(Reservations.STATUS_CHOICES).get(obj.status, obj.status)
