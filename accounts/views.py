from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.models import User

@login_required
def accounts_profile(request):
    u = request.user
    return render_to_response('profile.html',
      context_instance=RequestContext(request, {
        "is_staff": u.is_staff
    }))

@login_required
@staff_member_required
def accounts_admin(request):
    u = request.user
    return render_to_response('admin.html',
      context_instance=RequestContext(request, {
        "is_staff": u.is_staff
    }))
