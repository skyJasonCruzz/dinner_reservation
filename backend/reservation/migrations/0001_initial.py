# Generated by Django 4.2.5 on 2023-09-27 03:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Reservations',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('reservation_datetime', models.DateTimeField()),
                ('reservation_first_name', models.CharField(max_length=100)),
                ('reservation_last_name', models.CharField(max_length=100)),
                ('phone_number', models.CharField(max_length=100)),
                ('number_of_guests', models.IntegerField()),
                ('status', models.CharField(choices=[('R', 'Reserved'), ('C', 'Cancelled')], default='R', max_length=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
