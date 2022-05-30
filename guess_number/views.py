

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import json
from django.db.models import Q
from .models import Results
import time
def main(request):
    if(request.method == "POST"): 
        temp = json.load(request) 
        data = temp["data"]
        q = Q(max_number = data["max_number"])
        pl = []
        index = -1
        if(data["count"]):
            rec = Results(**data)
            rec.save()             
            q1 = Q(count = data["count"])
            q2 = Q(milliseconds__lte = data["milliseconds"])
            q3 = Q(count__lt = data["count"])
            rows = Results.objects.filter(q & (q3 | (q1 & q2))).order_by("count", "milliseconds")
            index = rows.count()
            pl = rec.getInfo()[:3]
            pl[0] = str(index)
        if(index < temp["max_leaders"]):
            rows = Results.objects.filter(q)
        rows = rows[:temp["max_leaders"]]
        rows = map(lambda s: s.getInfo(), rows)
        answer = {"records": list(rows), "result": pl}
        return JsonResponse(answer)
    content = {"max_number": 1000, "max_leaders": 10}
    return render(request, "guess_number.html", content)

def test(request):
    content = {"PARAM_1": 10, "PARAM_2": 20}
    if(request.method.upper() == "POST"):
        print("*"*88)
        print(request.POST)
        print("*"*88)
        content = {"PARAM_1": 100, "PARAM_2": 200}
        time.sleep(5)        
    return render(request, "test.html", content)