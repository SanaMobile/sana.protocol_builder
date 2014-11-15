from django.http import HttpResponse
from django.template import RequestContext, loader

def index(request):
    template = loader.get_template('webapp/index.html')
    context = RequestContext(request, {
        'title' : "",
    })
    return HttpResponse(template.render(context))

def login(request):
    template = loader.get_template('webapp/login.html')
    context = RequestContext(request, {
        'title' : "Log In",
    })
    return HttpResponse(template.render(context))

def signup(request):
    template = loader.get_template('webapp/signup.html')
    context = RequestContext(request, {
        'title' : "Sign Up",
    })
    return HttpResponse(template.render(context))

def editor(request):
    template = loader.get_template('webapp/editor.html')
    context = RequestContext(request, {
        'title' : "",
    })
    return HttpResponse(template.render(context))
