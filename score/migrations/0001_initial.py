# Generated by Django 4.2.3 on 2023-08-05 21:51

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nickname', models.CharField(max_length=10)),
                ('score', models.IntegerField()),
                ('pub_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
