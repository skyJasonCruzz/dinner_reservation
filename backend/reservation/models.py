from django.db import models
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta


# Reservation Model
class Reservations(models.Model):
    objects = models.Manager()
    RESERVED = 'R'
    CANCELLED = 'C'

    STATUS_CHOICES = (
        (RESERVED, 'Reserved'),
        (CANCELLED, 'Cancelled'),
    )
    id = models.AutoField(primary_key=True)
    reservation_datetime = models.DateTimeField()
    reservation_first_name = models.CharField(max_length=100)
    reservation_last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)
    number_of_guests = models.IntegerField()
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=RESERVED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # override the save method to add caching for the reservation model
    def save(self, *args, **kwargs):
        cache_key = "reservation_save_count"

        now = timezone.now()
        last_saved = cache.get(cache_key, now)
        time_elapsed = now - last_saved

        if time_elapsed >= timedelta(minutes=30):
            save_count = 1
        else:
            save_count = cache.get(cache_key + "_count", 0)

            if save_count >= 3:
                raise Exception("Only 3 reservations are allowed every 30 minutes, please try again later.")

            save_count += 1

        cache.set(cache_key, now, 1800)
        cache.set(cache_key + "_count", save_count, 1800)

        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.reservation_first_name} {self.reservation_last_name}'
