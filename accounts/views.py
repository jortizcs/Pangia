from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.models import User

@login_required
def accounts_profile(request):
    u = request.user

    if request.method == 'POST':
        post = request.POST
        errors = []
        """Check that the current password matches. If so, update password."""
        if 'current_password' in post and u.check_password(post['current_password']):
            if 'new_password' in post and 'confirm_new_password' in post and post['new_password'] == post['confirm_new_password']:
                u.set_password(post['new_password'])
                u.save()
                return render_to_response('profile.html',
                  context_instance=RequestContext(request, {
                    "is_staff": u.is_staff
                }))
            else:
                errors.append('New password does not match its confirmation.')
                return render_to_response('profile.html',
                  context_instance=RequestContext(request, {
                    "is_staff": u.is_staff,
                    "password_errors": errors
                }))
        else:
            print ""
            print "FAILED"
            print ""
            errors.append('Invalid current password.')
            return render_to_response('profile.html',
              context_instance=RequestContext(request, {
                "is_staff": u.is_staff,
                "password_errors": errors
            }))
    else:
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
