from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, JsonResponse

from django.views.decorators.csrf import csrf_exempt

import requests

# Create your views here.
def index(request):
    context = {}
    
    return render(request, "templates/index.html", context)

def sendRequest(request, requestType):
    context = {}
    if request.method == "POST":
        if settings.NPS_API_KEY != None:
            r = requests.get(settings.NPS_API_URL + "/" + requestType +
             "?parkCode=" + request.POST["parkCode"] +
             "&api_key=" + settings.NPS_API_KEY)
                       
            data = r.json()
            
            context["data"] = data
            
        else:
            print("You don't have an API key environment variable set")
    
    return context

@csrf_exempt
def search(request):
    context = {}
    
    if request.method == "POST":
                        
        #Checks to make sure National Park API key environment variable is set
        if settings.NPS_API_KEY != None:
            r = requests.get(settings.NPS_API_URL + "/parks?stateCode=" + request.POST["state"] +
             "&q=" + request.POST["query"] + 
             "&fields=images" +
             "&limit=10&start=" + request.POST["start"] +
             "&api_key=" + settings.NPS_API_KEY)
            
            data = r.json()
            context["data"] = data
            
        else:
            print("You don't have an API key environment variable set")
    
    return JsonResponse(context);

@csrf_exempt
def visitorcenter(request):
    context = sendRequest(request, "visitorcenters")
    
    return JsonResponse(context)

@csrf_exempt
def campground(request):
    context = sendRequest(request, "campgrounds")
    
    return JsonResponse(context)

@csrf_exempt
def events(request):
    context = sendRequest(request, "events")
    
    return JsonResponse(context)

@csrf_exempt
def alerts(request):
    context = sendRequest(request, "alerts")
    
    return JsonResponse(context)

@csrf_exempt
def newsreleases(request):
    context = sendRequest(request, "newsreleases")
    
    return JsonResponse(context)

@csrf_exempt
def lessonplans(request):
    context = sendRequest(request, "lessonplans")
    
    return JsonResponse(context)
    
@csrf_exempt
def articles(request):
    context = sendRequest(request, "articles")
    
    return JsonResponse(context)

@csrf_exempt
def people(request):
    context = sendRequest(request, "people")
    
    return JsonResponse(context)
    
@csrf_exempt
def places(request):
    context = sendRequest(request, "places")
    
    return JsonResponse(context)

