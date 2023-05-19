# Generated by Django 4.2.1 on 2023-05-19 13:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("demo", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PaymentTerm",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("due_date", models.DateField()),
                ("amount", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "invoice",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="demo.invoice"
                    ),
                ),
            ],
        ),
    ]