from django.db import models

class Building(models.Model):
	name = models.CharField(max_length=200, primary_key=True)
	address = models.CharField(max_length=200)
	
class AggStat(models.Model):
	path = models.CharField(max_length=500, db_index=True, unique=False)
	sum = models.DecimalField(max_digits=10, decimal_places=2)
	UNIT_CHOICES = (
		('W', 'Watt'),
		('KW', 'Kilowatt'),
		('KWH', 'Kilowatt-hour'),
		('LBS', 'Pound'),
		('KG', 'Kilogram'),
		('TON', 'Ton'),
		('J', 'Joule'),
		('A', 'Ampere'),
		('USD', 'Dollar'),
		('EUR', 'Euro'),
		('GBP', 'British-pound'),
		('GAL', 'Gallon'),
		('L', 'Liter'),
		('KL', 'Kiloliter'),
		('SFT', 'Square-Feet'),
		('SM', 'Square-Meter'),
		('CFT', 'Cubic-Feet'),
		('CM', 'Cubic-Meter')
	)
	units = models.CharField(max_length=3, choices=UNIT_CHOICES)
	WINDOW_SIZE_CHOICES = (
		('SEC', 'second'),
		('MIN', 'minute'),
		('HR', 'hour'),
		('D', 'day'),
		('M', 'month'),
		('Y', 'year')
	)
	window_size = models.CharField(max_length=3, choices=WINDOW_SIZE_CHOICES)
	start_time = models.DateTimeField(db_index=True)
	
class AvgStat(models.Model):
	path = models.CharField(max_length=500, db_index=True, unique=False)
	avg = models.DecimalField(max_digits=10, decimal_places=2)
	UNIT_CHOICES = (
		('W', 'Watt'),
		('KW', 'Kilowatt'),
		('KWH', 'Kilowatt-hour'),
		('LBS', 'Pound'),
		('KG', 'Kilogram'),
		('TON', 'Ton'),
		('J', 'Joule'),
		('A', 'Ampere'),
		('USD', 'Dollar'),
		('EUR', 'Euro'),
		('GBP', 'British-pound'),
		('GAL', 'Gallon'),
		('L', 'Liter'),
		('KL', 'Kiloliter'),
		('SFT', 'Square-Feet'),
		('SM', 'Square-Meter'),
		('CFT', 'Cubic-Feet'),
		('CM', 'Cubic-Meter'),
		('PSI', 'Pressure'),
		('F', 'Farenheit'),
		('C', 'Celsius'),
		('K', 'Kelvin'),
		('PPM', 'Parts-per-million')
	)
	units = models.CharField(max_length=3, choices=UNIT_CHOICES)
	WINDOW_SIZE_CHOICES = (
		('SEC', 'second'),
		('MIN', 'minute'),
		('HR', 'hour'),
		('D', 'day'),
		('M', 'month'),
		('Y', 'year')
	)
	window_size = models.CharField(max_length=3, choices=WINDOW_SIZE_CHOICES)
	start_time = models.DateTimeField(db_index=True)
	
