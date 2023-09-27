import json
from datetime import datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ReservationSerializer
from .models import Reservations
from django.core.exceptions import ObjectDoesNotExist


# Getting all the reservations
@api_view(['GET'])
def get_all_reservations(request):
    try:
        reservations = Reservations.objects.all()
        serializer = ReservationSerializer(reservations, many=True, context={'include_id': True,
                                                                             'include_status': True})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Get specific user reservations
@api_view(['GET'])
def get_user_reservations(request):
    try:
        first_name = request.query_params.get("reservation_first_name")
        last_name = request.query_params.get("reservation_last_name")
        phone_number = request.query_params.get("phone_number")

        if not all([first_name, last_name, phone_number]):
            return Response({'errors': ['First name, last name, and phone number are required.']},
                            status=status.HTTP_400_BAD_REQUEST)

        reservations = Reservations.objects.filter(
            reservation_first_name=first_name,
            reservation_last_name=last_name,
            phone_number=phone_number
        )

        if not reservations:
            return Response({'message': 'No reservations found for the specified user.'},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = ReservationSerializer(reservations, many=True, context={'include_id': True,
                                                                             'include_status': True})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# creating a new reservation
@api_view(['POST'])
def create_reservation(request):
    try:
        data = request.data
    except json.JSONDecodeError:
        return Response({'errors': ['Json expected.']}, status=status.HTTP_400_BAD_REQUEST)

    # TODO: move to utils
    reservation_date = data.get("reservation_date")
    reservation_time = data.get("reservation_time")

    if reservation_date and reservation_time:
        try:
            reservation_datetime = datetime.strptime(
                f"{reservation_date} {reservation_time}", '%Y-%m-%d %H:%M')
        except ValueError:
            return Response({'errors': ['Invalid date or time format.']}, status=status.HTTP_400_BAD_REQUEST)

        existing_reservation = Reservations.objects.filter(
            reservation_datetime=reservation_datetime, status='R').first()

        if existing_reservation:
            return Response({'message': 'Date is already reserved.'}, status=status.HTTP_400_BAD_REQUEST)

        data["reservation_datetime"] = reservation_datetime
        data.pop("reservation_date", None)
        data.pop("reservation_time", None)
        serializer = ReservationSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'errors': ['Reservation date and time are required.']}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_reservation(request):
    try:
        data = request.data
        print(data)
        reservation = Reservations.objects.get(pk=data.get("id"))
    except (json.JSONDecodeError, ObjectDoesNotExist):
        return Response({'errors': ['Reservation not found.']}, status=status.HTTP_404_NOT_FOUND)

    # TODO: move to utils
    reservation_date = data.get("reservation_date")
    reservation_time = data.get("reservation_time")

    if reservation_date and reservation_time:
        try:
            reservation_datetime = datetime.strptime(
                f"{reservation_date} {reservation_time}", '%Y-%m-%d %H:%M')
        except ValueError:
            return Response({'errors': ['Invalid date or time format.']}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the updated date and time conflict with an existing reservation
        existing_reservation = Reservations.objects.filter(
            reservation_datetime=reservation_datetime, status='R').exclude(pk=data.get("id")).first()

        if existing_reservation:
            return Response({'message': 'Date is already reserved.'}, status=status.HTTP_400_BAD_REQUEST)

        reservation.reservation_datetime = reservation_datetime
        reservation.reservation_first_name = data.get("reservation_first_name", reservation.reservation_first_name)
        reservation.reservation_last_name = data.get("reservation_last_name", reservation.reservation_last_name)
        reservation.phone_number = data.get("phone_number", reservation.phone_number)
        reservation.number_of_guests = data.get("number_of_guests", reservation.number_of_guests)
        reservation.status = data.get("status", reservation.status)
        reservation.save()

        serializer = ReservationSerializer(reservation, context={'include_id': True, 'include_status': True})
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'errors': ['Reservation date and time are required.']}, status=status.HTTP_400_BAD_REQUEST)
