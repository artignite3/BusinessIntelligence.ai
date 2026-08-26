import json
import random
import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

os.makedirs('data', exist_ok=True)
np.random.seed(42)
random.seed(42)

start_date = datetime(2026, 7, 1)
days = 45

# -------------------------------------------------------------
# 1. GENERATE SOURCE A: DAILY SALES & FINANCIAL LEDGER
# -------------------------------------------------------------
sales_records = []
regions = ['West', 'East', 'North', 'South']
categories = ['Electronics', 'Home & Living', 'EV Accessories', 'Apparel']

for d in range(days):
    cur_date = start_date + timedelta(days=d)
    date_str = cur_date.strftime('%Y-%m-%d')
    day_of_week = cur_date.weekday() # 5,6 is weekend
    
    for r in regions:
        for cat in categories:
            # Baseline volume
            base_orders = random.randint(150, 220)
            avg_price = 120.0 if cat == 'Electronics' else (85.0 if cat == 'EV Accessories' else 60.0)
            
            # Weekend seasonality factor
            weekend_multiplier = 0.85 if day_of_week in [5, 6] else 1.0
            
            # SCENARIO 1 INJECTION: Multi-factor drop on Day 14 in West Region Electronics
            discount_rate = 0.05
            cancellation_rate = 0.02
            
            if d == 14 and r == 'West' and cat == 'Electronics':
                # Price discount misconfig + port delay cancellations + payment failures
                discount_rate = 0.22 # Unintended deep discount
                base_orders = int(base_orders * 0.72) # 28% drop in successful orders
                cancellation_rate = 0.18 # High cancellations due to shipping delay
            
            # SCENARIO 2 INJECTION: High return rate in Electronics on Day 20-22
            return_rate = 0.04
            if 20 <= d <= 22 and cat == 'Electronics':
                return_rate = 0.18 # Spiked returns
                
            orders_count = int(base_orders * weekend_multiplier)
            gross_amount = round(orders_count * avg_price, 2)
            discounts = round(gross_amount * discount_rate, 2)
            returns_refund = round(gross_amount * return_rate, 2)
            margin_cost = round(gross_amount * 0.58, 2)
            net_revenue = round(gross_amount - discounts - returns_refund, 2)
            
            sales_records.append({
                'date': date_str,
                'region': r,
                'category': cat,
                'orders_count': orders_count,
                'gross_amount': gross_amount,
                'discounts': discounts,
                'returns_refund': returns_refund,
                'margin_cost': margin_cost,
                'net_revenue': net_revenue,
                'cancellations': int(orders_count * cancellation_rate)
            })

df_sales = pd.DataFrame(sales_records)
df_sales.to_csv('data/sales_orders.csv', index=False)
print("Generated data/sales_orders.csv successfully")

# -------------------------------------------------------------
# 2. GENERATE SOURCE B: HOURLY WMS LOGISTICS & TELEMETRY
# -------------------------------------------------------------
logistics_records = []
carriers = ['FastExpress_Carrier_A', 'BlueDart_Carrier_B', 'RegionalLogistics_C']

for d in range(days):
    cur_date = start_date + timedelta(days=d)
    date_str = cur_date.strftime('%Y-%m-%d')
    
    for r in regions:
        # Normal dispatch delay: 1.5 to 3.5 hours
        avg_dispatch_delay_hours = round(random.uniform(1.8, 3.2), 1)
        otif_rate = round(random.uniform(92.0, 97.5), 1)
        transit_damage_claims = random.randint(1, 4)
        
        # SCENARIO 1: Port Gateway Bottleneck in West on Day 14
        if d == 14 and r == 'West':
            avg_dispatch_delay_hours = 48.5 # Severe 48h bottleneck
            otif_rate = 61.2 # Heavy OTIF drop
            carrier_chosen = 'FastExpress_Carrier_A'
        # SCENARIO 2: Courier Transit Package Damage on Days 20-22
        elif 20 <= d <= 22:
            transit_damage_claims = random.randint(35, 52) # Courier mishandling
            carrier_chosen = 'RegionalLogistics_C'
        else:
            carrier_chosen = random.choice(carriers)
            
        logistics_records.append({
            'date': date_str,
            'region': r,
            'primary_carrier': carrier_chosen,
            'avg_dispatch_delay_hours': avg_dispatch_delay_hours,
            'otif_percentage': otif_rate,
            'transit_damage_claims': transit_damage_claims,
            'warehouse_stockout_flag': 1 if (d == 14 and r == 'West') else 0
        })

df_logistics = pd.DataFrame(logistics_records)
df_logistics.to_csv('data/logistics_wms.csv', index=False)
print("Generated data/logistics_wms.csv successfully")

# -------------------------------------------------------------
# 3. GENERATE SOURCE C: UNSTRUCTURED CUSTOMER VOICE & REVIEWS
# -------------------------------------------------------------
tickets = []
ticket_id_counter = 1000

# Normal tickets
normal_templates = [
    ("Great quality product, fast shipping.", 0.85, "General Feedback"),
    ("Loved the color and finish, would buy again.", 0.90, "Product Review"),
    ("Packaging was fine, arrived on time.", 0.70, "Logistics Review"),
    ("Customer inquiring about warranty extension.", 0.10, "Support Inquiry")
]

# Scenario 1 tickets (Day 14 West Payment Gateway & Shipping Delay)
s1_templates = [
    ("My card was charged twice on checkout but order status still shows pending on iOS app #504.", -0.88, "Payment Gateway Failure"),
    ("Payment gateway timeout error during checkout in California. Order not confirmed!", -0.92, "Payment Gateway Failure"),
    ("Order delayed by 3 days at West Coast Distribution Port. No tracking update available.", -0.82, "Logistics Port Bottleneck"),
    ("Terrible shipping delay in West region, had to cancel my order.", -0.85, "Logistics Cancellation")
]

# Scenario 2 tickets (Days 20-22: Product is Loved, but Package Crushed by Courier)
s2_templates = [
    ("The headphones sound amazing! 5 stars for sound, but the outer delivery box was completely crushed by courier.", 0.65, "Courier Transit Damage"),
    ("Great audio quality, but arrived with broken packaging due to rough handling by courier. Requesting replacement.", 0.55, "Courier Transit Damage"),
    ("Product itself works perfectly, but shipping box was torn open. 5 stars for product, 1 star for delivery.", 0.60, "Courier Transit Damage"),
    ("Sound is crystal clear! Returning only because corner plastic broke during shipping impact.", 0.50, "Courier Transit Damage")
]

for d in range(days):
    cur_date = start_date + timedelta(days=d)
    date_str = cur_date.strftime('%Y-%m-%d')
    
    # Generate 15 normal tickets daily
    for _ in range(15):
        text, sentiment, topic = random.choice(normal_templates)
        tickets.append({
            'ticket_id': f'TCK-{ticket_id_counter}',
            'date': date_str,
            'region': random.choice(regions),
            'category': random.choice(categories),
            'text': text,
            'sentiment_score': sentiment,
            'topic': topic
        })
        ticket_id_counter += 1
        
    # Inject Scenario 1 tickets on Day 14
    if d == 14:
        for _ in range(40):
            text, sentiment, topic = random.choice(s1_templates)
            tickets.append({
                'ticket_id': f'TCK-{ticket_id_counter}',
                'date': date_str,
                'region': 'West',
                'category': 'Electronics',
                'text': text,
                'sentiment_score': sentiment,
                'topic': topic
            })
            ticket_id_counter += 1
            
    # Inject Scenario 2 tickets on Days 20-22
    if 20 <= d <= 22:
        for _ in range(35):
            text, sentiment, topic = random.choice(s2_templates)
            tickets.append({
                'ticket_id': f'TCK-{ticket_id_counter}',
                'date': date_str,
                'region': 'West',
                'category': 'Electronics',
                'text': text,
                'sentiment_score': sentiment,
                'topic': topic
            })
            ticket_id_counter += 1

with open('data/customer_feedback.json', 'w', encoding='utf-8') as f:
    json.dump(tickets, f, indent=2)
print("Generated data/customer_feedback.json successfully")

# -------------------------------------------------------------
# 4. GENERATE SCENARIO 3: COLD START NEW SKU LAUNCH (11 DAYS HISTORY)
# -------------------------------------------------------------
cold_start_records = []
cs_start_date = start_date + timedelta(days=34) # Last 11 days

for d in range(11):
    c_date = cs_start_date + timedelta(days=d)
    date_str = c_date.strftime('%Y-%m-%d')
    
    # Days 1-8: steady initial launch sales (18-24 units)
    # Day 9-11: sudden drop to 4 units due to lack of marketing promo
    units_sold = random.randint(18, 25) if d < 8 else random.randint(3, 6)
    
    cold_start_records.append({
        'date': date_str,
        'sku_id': 'SKU-EV-CHARGER-01',
        'sku_name': 'EV Smart Charger Pack Pro',
        'category': 'EV Accessories',
        'units_sold': units_sold,
        'launch_day_number': d + 1,
        'category_peer_avg_units': 21.5 # Inherited prior baseline
    })

df_cs = pd.DataFrame(cold_start_records)
df_cs.to_csv('data/cold_start_sku.csv', index=False)
print("Generated data/cold_start_sku.csv successfully")
