from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_all_reservations, name='get_all_reservations'),
    path('create', views.create_reservation, name='create_reservation'),
    path('update', views.update_reservation, name='create_reservation'),
    path('user-reservation', views.get_user_reservations, name='get_user_reservations'),
]
