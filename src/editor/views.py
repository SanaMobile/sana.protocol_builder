from django.http import HttpResponse
from django.template import RequestContext, loader

def editor(request):
    template = loader.get_template('editor.html')
    context = RequestContext(request, {
        'title' : "",
    })
    return HttpResponse(template.render(context))