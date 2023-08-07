from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .models import Record
# Create your views here.

def index(request):
    # return HttpResponse('Hello World')
    pass
    
def top_desktop(request):
    query_set = Record.objects.filter(platform__exact='DT').order_by('-score')
    
    topScores = generateTopScores(query_set)
    return JsonResponse(topScores, safe=False)
    
def top_mobile(request):
    query_set = Record.objects.filter(platform__exact='ML').order_by('-score')
    
    topScores = generateTopScores(query_set)
    return JsonResponse(topScores, safe=False)
    
def top_general(request):
    query_set = Record.objects.order_by('-score')
    
    topScores = generateTopScores(query_set)
    return JsonResponse(topScores, safe=False)


from django.views.decorators.csrf import csrf_exempt

# @csrf_exempt
def scoreCreate(request):
    if request.method == 'POST':
        return HttpResponse('Created')


#UTILS

def generateTopScores(query_set):
    topScores = []
    for record in query_set:
        topScores.append(
            {
                'Nickname': record.nickname,
                'Score': record.score,
                'Platform': record.platform,
                'Date': record.pub_date,
            }
        )
    return topScores