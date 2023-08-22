from django.db import models


class CommonModel(models.Model):
    created_ts = models.DateTimeField(
        auto_now_add=True, verbose_name="Created TimeStamp"
    )
    updated_ts = models.DateTimeField(auto_now=True, verbose_name="Updated TimeStamp")

    class Meta:
        abstract = True
        ordering = (
            "created_ts",
            "updated_ts",
        )
