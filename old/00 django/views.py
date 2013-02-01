from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django import forms

__author__ = 'jww'

@login_required
def dashboard:
    return render_to_response('dashboard.html',
      context_instance=RequestContext(request, {}))

@login_required
def upload:
    return render_to_response('upload.html',
      context_instance=RequestContext(request, {}))
