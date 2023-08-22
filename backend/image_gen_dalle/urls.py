from django.urls import path
from .views import TestView, GenerateNewImageView, AddImgToGallery, GetGalleryImgs


urlpatterns = [
    path("", TestView),
    path("generate_image", GenerateNewImageView),
    path("add_gallery", AddImgToGallery),
    path("get_gallery", GetGalleryImgs),
]
