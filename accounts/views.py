from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.models import User
from django.db import IntegrityError

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
            else:
                errors.append('New password does not match its confirmation.')
        else:
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

    if request.method == 'POST':
        post = request.POST
        errors = {}
        required_text_fields = [
            ['user_name', 'user name'],
            ['full_name', 'full name'],
            ['email', 'email'],
        ]

        for field in required_text_fields:
            if not (field[0] in post) or len(post[field[0]]) == 0:
                errors[field[0]] = [ "Missing " + field[1] + "." ]

        if not ('password' in post) or len(post['password']) == 0:
            errors['password'] = [ "Missing password." ]
        elif not ('confirm_password' in post) or len(post['confirm_password']) == 0:
            errors['confirm_password'] = [ "Missing password confirmation." ]
        elif not (post['password'] == post['confirm_password']):
            errors['password'] = [ "Passwords do not match." ]

        """If there are no errors, create a new user."""

        if len(errors) > 0:
            return render_to_response('admin.html',
              context_instance=RequestContext(request, {
                "is_staff": u.is_staff,
                "create_user_errors": errors
            }))
        else:
            try:
                u = User.objects.create_user(post['user_name'],
                    post['email'], post['password'])
            except IntegrityError:
                print ""
                print "user name fail"
                print ""
                errors['user_name'] = [ "User name already in use. Please choose another." ]
                return render_to_response('admin.html',
                  context_instance=RequestContext(request, {
                    "is_staff": u.is_staff,
                    "create_user_errors": errors
                }))

            if 'is_admin' in post:
                u.is_staff = True
            u.save()
                
            return render_to_response('admin.html',
              context_instance=RequestContext(request, {
                "is_staff": u.is_staff,
                "created_user": post['user_name']
            }))
    else:
        return render_to_response('admin.html',
          context_instance=RequestContext(request, {
            "is_staff": u.is_staff
        }))
