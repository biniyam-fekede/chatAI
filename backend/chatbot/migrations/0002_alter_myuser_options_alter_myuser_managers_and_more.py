# Generated by Django 5.1 on 2024-09-21 00:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatbot', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='myuser',
            options={},
        ),
        migrations.AlterModelManagers(
            name='myuser',
            managers=[
            ],
        ),
        migrations.RemoveField(
            model_name='myuser',
            name='date_joined',
        ),
        migrations.RemoveField(
            model_name='myuser',
            name='username',
        ),
        migrations.AlterField(
            model_name='myuser',
            name='first_name',
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='last_name',
            field=models.CharField(max_length=30),
        ),
    ]
