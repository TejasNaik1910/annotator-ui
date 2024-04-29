from django.shortcuts import render
from django.http import JsonResponse
from django.template import loader
from .models import Annotation

def annoui(request):
    if request.method == "POST":
        data = request.POST
        annotation = Annotation.objects.create(
            text=data["text"],
            start_index=int(data["start"]),
            end_index=int(data["end"]),
            category=data["category"]
        )
        return JsonResponse({"success": True})
    
    # If it's a GET request, render the template with some sample text
    text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    context = {"text": text}
    return render(request, "index.html", context)