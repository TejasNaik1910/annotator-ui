from django.db import models

class Annotation(models.Model):
    text = models.TextField()
    start_index = models.IntegerField()
    end_index = models.IntegerField()
    category = models.CharField(max_length=255)
