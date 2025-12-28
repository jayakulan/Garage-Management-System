from django.db import models
from jobs.models import JobCard

class Invoice(models.Model):
    STATUS_CHOICES = (
        ('UNPAID', 'Unpaid'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled'),
    )

    job = models.OneToOneField(JobCard, on_delete=models.CASCADE, related_name='invoice')
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    parts_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='UNPAID')
    
    issued_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    paid_date = models.DateTimeField(null=True, blank=True)

    def calculate_totals(self):
        # Calculate parts total from job parts
        parts_sum = sum(item.total_cost for item in self.job.parts_used.all())
        self.parts_total = parts_sum
        
        # Simple tax calculation logic (e.g., 10% on parts + labor) - this can be adjusted
        subtotal = float(self.labor_cost) + float(self.parts_total)
        self.grand_total = subtotal # Tax can be added here if needed
        # self.tax_amount = subtotal * 0.10
        # self.grand_total = subtotal + self.tax_amount
        self.save()

    def __str__(self):
        return f"Invoice #{self.id} for Job #{self.job.id} - {self.status}"
