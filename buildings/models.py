from django.db import models

class Building(models.Model):
    name = models.CharField(max_length=200, primary_key=True)
    address = models.CharField(max_length=200)
    
    def  __unicode__(self):
        return u'%s' % (self.name)

class Floor(models.Model):
    building = models.ForeignKey('Building')
    level = models.PositiveIntegerField(primary_key=True)

    def  __unicode__(self):
        return u'%s' % (self.level)

class Room(models.Model):
    floor = models.ForeignKey('Floor')
    roomname = models.CharField(max_length=20, primary_key=True)

    def  __unicode__(self):
        return u'%s' % (self.roomname)

class LiveFeedback(models.Model):
    building = models.ForeignKey('Building')
    floor = models.ForeignKey('Floor')
    room = models.ForeignKey('Room')
    submitter = models.CharField(max_length=200, blank=True)
    DISCOMFORT_CHOICES = (
        ('H', 'Hot'),
        ('C', 'Cold'),
        ('S', 'Stuffy'),
        ('N', 'Noisy'),
        ('D', 'Dark'),
        ('G', 'Glare')
    )
    discomfort = models.CharField(max_length=3, choices=DISCOMFORT_CHOICES, blank=True)
    COMFORT_CHOICES = (
        ('C', 'Comfortable'),
        ('V', 'Very Comfortable')
    )
    comfort = models.CharField(max_length=3, choices=COMFORT_CHOICES, blank=True)
    PRIORITY_CHOICES = (
        (3, '3'),
        (2, '2'),
        (1, '1')
    )
    priority = models.PositiveIntegerField(choices=PRIORITY_CHOICES, blank=False, default=2)
    comments = models.CharField(max_length=500, blank=True)
    submitted = models.DateTimeField(auto_now_add=True)

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
	
