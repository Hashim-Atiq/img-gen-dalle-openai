from django.db import models
from backend.resources import CommonModel


# Create your models here.
class Post(CommonModel):
    name = models.TextField(null=False, blank=False)
    prompt = models.TextField(null=False, blank=False)
    img_url = models.TextField(null=False, blank=False)
