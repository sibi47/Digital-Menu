# Generated by Django 3.2 on 2024-06-07 06:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='menuitem',
            name='diet',
            field=models.CharField(choices=[('veg', 'Vegetarian'), ('non_veg', 'Non-Vegetarian')], default='veg', max_length=7),
        ),
    ]
