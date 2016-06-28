from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from models import MDSLink


class SignupForm(UserCreationForm):
    first_name = forms.CharField(required=True, label='First Name', help_text='Your first name', max_length=20)
    last_name = forms.CharField(required=True, label='Last Name', help_text='Your last name', max_length=20)
    email = forms.EmailField(required=True, label='Email', help_text='This will be your username when you login')
    mds_link = forms.URLField(required=False, label='mds', help_text='MDS Link')

    def save(self, commit=True):
        user = super(SignupForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        mds = MDSLink(user=user, mds_link=self.cleaned_data['mds_link'])
        if commit:
            user.save()
            mds.save()
        return user

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'first_name', 'last_name', 'mds_link')
