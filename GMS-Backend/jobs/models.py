from django.db import models
from django.conf import settings
from inventory.models import Part

class JobCard(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('READY', 'Ready for Delivery'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_cards')
    vehicle_reg_number = models.CharField(max_length=20)
    vehicle_model = models.CharField(max_length=100)
    reported_issues = models.TextField()
    
    assigned_mechanic = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_jobs', limit_choices_to={'role': 'MECHANIC'})
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Job #{self.id} - {self.vehicle_reg_number} ({self.status})"


class JobPart(models.Model):
    job = models.ForeignKey(JobCard, on_delete=models.CASCADE, related_name='parts_used')
    part = models.ForeignKey(Part, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price_at_use = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price per unit at the time of usage")

    def save(self, *args, **kwargs):
        if not self.price_at_use:
            self.price_at_use = self.part.price
        super().save(*args, **kwargs)

    @property
    def total_cost(self):
        return self.quantity * self.price_at_use

    def __str__(self):
        return f"{self.part.name} x {self.quantity} for Job #{self.job.id}"
