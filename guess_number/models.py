from django.db import models
from datetime import datetime, timedelta

# Create your models here.

class Results(models.Model): 
    """Таблица Результатов"""
    name = models.CharField('Имя', max_length = 10)
    milliseconds = models.BigIntegerField('Скорость')
    count = models.IntegerField('Ходы')
    max_number = models.IntegerField('Максимальное число')
    date_time = models.DateTimeField('Дата и время', default=datetime.now) 

    class Meta:
        ordering = ['count', 'milliseconds']  
        verbose_name = "Результат"                     
        verbose_name_plural = "Результаты"     
        
    def getInfo(self):
        dt = self.date_time.strftime("%d.%m.%y %H:%M:%S")
        tm = str(timedelta(milliseconds=self.milliseconds))
        return [self.name, str(self.count), tm[:len(tm)-4], dt]
        
        
 