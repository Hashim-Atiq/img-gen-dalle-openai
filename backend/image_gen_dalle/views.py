from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Post
from .serializers import PostSerialiser
import os
import openai
import cloudinary

openai.api_key = os.getenv("OPENAI_API_KEY")
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)


# Create your views here.
@api_view(["GET"])
def TestView(request):
    return Response(data="Ok", status=status.HTTP_200_OK)


@api_view(["POST"])
def GenerateNewImageView(request):
    prompt = request.data["prompt"]

    try:
        aiResponse = openai.Image.create(
            prompt=prompt, n=1, size="1024x1024", response_format="b64_json"
        )

        res_img = aiResponse["data"][0]["b64_json"]
        res_data = {"photo": res_img}

        return Response(
            data=res_data,
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print(e)
        return Response(
            data="Something Went Wrong.", status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def GetGalleryImgs(request):
    try:
        posts = Post.objects.all()
        return Response(
            data={"success": True, "data": PostSerialiser(posts, many=True).data},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print("Error: ", e)
        return Response(data={"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def AddImgToGallery(request):
    try:
        name = request.data["name"]
        prompt = request.data["prompt"]
        photo = request.data["photo"]

        photoUrl = cloudinary.uploader.upload(photo)
        print(photoUrl)
        newPost = Post.objects.create(name=name, prompt=prompt, img_url=photoUrl["url"])
        newPost = PostSerialiser(newPost)

        return Response(
            data={"success": True, "data": newPost.data}, status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(data={"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
