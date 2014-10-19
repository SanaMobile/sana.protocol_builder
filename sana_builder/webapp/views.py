from django.http import HttpResponse
from django.template import RequestContext, loader

def index(request):
    template = loader.get_template('webapp/index.html')
    context = RequestContext(request, {
        'title' : "Sana Protocol Builder",
    })
    return HttpResponse(template.render(context))