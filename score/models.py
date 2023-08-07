from django.db import models

# Create your models here.

class Record(models.Model):
    PLATFORMS_CHOICES = [
        ('DT', 'Desktop'),
        ('ML', 'Mobile'),
    ]
    
    nickname = models.CharField(max_length=10)
    score = models.IntegerField()
    platform = models.CharField(max_length=2, choices = PLATFORMS_CHOICES, default = 'DT')
    pub_date = models.DateTimeField(auto_now_add=True)
    
    
    
    def __str__(self):
        return f"{self.nickname} : {self.score}pts ({self.platform})"