"""
Django seed script to populate the database with test data.
Run with: python manage.py shell < seed_data.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gms_backend.settings')
django.setup()

from accounts.models import User
from inventory.models import Part
from jobs.models import JobCard, JobPart
from billing.models import Invoice
from django.utils import timezone
from datetime import timedelta

print("Starting database seeding...")

# Clear existing data (optional, comment out if you want to keep existing data)
# User.objects.filter(role__in=['ADMIN', 'MECHANIC', 'CUSTOMER']).delete()
# Part.objects.all().delete()

# 1. Create Default Users
print("\n✓ Creating default users...")

admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@gmail.com',
        'role': 'ADMIN',
        'phone': '+1234567890',
        'is_staff': True,
        'is_superuser': True
    }
)
if created:
    admin_user.set_password('admin')
    admin_user.save()
    print(f"  Created Admin: {admin_user.email}")
else:
    print(f"  Admin already exists: {admin_user.email}")

mechanic_user, created = User.objects.get_or_create(
    username='mechanic',
    defaults={
        'email': 'mechanic@gmail.com',
        'role': 'MECHANIC',
        'phone': '+1234567891'
    }
)
if created:
    mechanic_user.set_password('mechanic')
    mechanic_user.save()
    print(f"  Created Mechanic: {mechanic_user.email}")
else:
    print(f"  Mechanic already exists: {mechanic_user.email}")

customer_user, created = User.objects.get_or_create(
    username='customer',
    defaults={
        'email': 'customer@gmail.com',
        'role': 'CUSTOMER',
        'phone': '+1234567892'
    }
)
if created:
    customer_user.set_password('customer')
    customer_user.save()
    print(f"  Created Customer: {customer_user.email}")
else:
    print(f"  Customer already exists: {customer_user.email}")

# 2. Create Sample Inventory Parts
print("\n✓ Creating sample parts...")

parts_data = [
    {'name': 'Oil Filter', 'sku': 'OIL-001', 'price': 15.99, 'cost_price': 8.00, 'quantity': 50},
    {'name': 'Brake Pads', 'sku': 'BRAKE-001', 'price': 45.50, 'cost_price': 25.00, 'quantity': 30},
    {'name': 'Air Filter', 'sku': 'AIR-001', 'price': 22.00, 'cost_price': 12.00, 'quantity': 40},
    {'name': 'Spark Plug', 'sku': 'SPARK-001', 'price': 8.99, 'cost_price': 4.50, 'quantity': 100},
    {'name': 'Battery', 'sku': 'BATT-001', 'price': 95.00, 'cost_price': 50.00, 'quantity': 15},
    {'name': 'Coolant', 'sku': 'COOL-001', 'price': 12.50, 'cost_price': 6.00, 'quantity': 60},
    {'name': 'Transmission Fluid', 'sku': 'TRANS-001', 'price': 18.00, 'cost_price': 10.00, 'quantity': 25},
    {'name': 'Brake Fluid', 'sku': 'BRAKE-FLUID-001', 'price': 15.00, 'cost_price': 8.00, 'quantity': 40},
]

parts = {}
for part_data in parts_data:
    part, created = Part.objects.get_or_create(
        sku=part_data['sku'],
        defaults=part_data
    )
    parts[part.sku] = part
    if created:
        print(f"  Created Part: {part.name} (SKU: {part.sku})")
    else:
        print(f"  Part already exists: {part.name}")

# 3. Create Sample Job Cards
print("\n✓ Creating sample job cards...")

job_statuses = ['PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED']
job_cards = []

for i in range(5):
    job_card, created = JobCard.objects.get_or_create(
        customer=customer_user,
        vehicle_reg_number=f'REG-{1000+i}',
        defaults={
            'vehicle_model': f'Toyota Camry {2020+i}',
            'reported_issues': 'Engine noise, brake issues, oil change needed' if i % 2 == 0 else 'Transmission fluid leak, tire damage',
            'assigned_mechanic': mechanic_user,
            'status': job_statuses[i % len(job_statuses)],
            'estimated_cost': 150.00 + (i * 50),
            'created_at': timezone.now() - timedelta(days=5-i)
        }
    )
    job_cards.append(job_card)
    if created:
        print(f"  Created Job Card #{job_card.id}: {job_card.vehicle_reg_number} ({job_card.status})")
    else:
        print(f"  Job Card already exists: {job_card.vehicle_reg_number}")

# 4. Add Parts to Job Cards
print("\n✓ Adding parts to job cards...")

parts_list = list(parts.values())
for i, job_card in enumerate(job_cards):
    # Add 2-3 random parts to each job card
    for j in range(2 + (i % 2)):
        part = parts_list[j % len(parts_list)]
        job_part, created = JobPart.objects.get_or_create(
            job=job_card,
            part=part,
            defaults={
                'quantity': 1 + (j % 3),
                'price_at_use': part.price
            }
        )
        if created:
            print(f"  Added {part.name} x{job_part.quantity} to Job #{job_card.id}")

# 5. Create Invoices for completed jobs
print("\n✓ Creating sample invoices...")

for job_card in job_cards:
    if job_card.status in ['READY', 'COMPLETED']:
        invoice, created = Invoice.objects.get_or_create(
            job=job_card,
            defaults={
                'labor_cost': 100.00,
                'status': 'PAID' if job_card.status == 'COMPLETED' else 'UNPAID',
                'paid_date': timezone.now() if job_card.status == 'COMPLETED' else None
            }
        )
        if created:
            invoice.calculate_totals()
            print(f"  Created Invoice #{invoice.id} for Job #{job_card.id}")

print("\n✅ Database seeding completed successfully!")
print("\n📝 Default Credentials:")
print("   Admin:    admin@gmail.com / admin")
print("   Mechanic: mechanic@gmail.com / mechanic")
print("   Customer: customer@gmail.com / customer")
