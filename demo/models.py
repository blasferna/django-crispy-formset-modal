from django.contrib.auth.models import User
from django.db import models


class Invoice(models.Model):
    invoice_number = models.CharField(max_length=100)
    date = models.DateField()
    client = models.CharField(max_length=255)

    def __str__(self):
        return self.invoice_number


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.description


class PaymentTerm(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)


class Project(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
