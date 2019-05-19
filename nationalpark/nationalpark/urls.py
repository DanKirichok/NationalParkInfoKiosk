"""nationalpark URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from infokiosk import views

urlpatterns = [
    url(r'^admin', admin.site.urls),
    url(r'^search/', views.search, name = "Search"),
    url(r'^visitorcenter/', views.visitorcenter, name = "Visitor Center"),
    url(r'^campground/', views.campground, name = "Campgrounds"),
    url(r'^alerts/', views.alerts, name = "Alerts"),
    url(r'^events/', views.events, name = "Events"),
    url(r'^newsreleases/', views.newsreleases, name = "News Releases"),
    url(r'^lessonplans/', views.lessonplans, name = "Lesson Plans"),
    url(r'^articles/', views.articles, name = "Articles"),
    url(r'^people/', views.people, name = "People"),
    url(r'^places/', views.places, name = "Places"),
    url(r'^', views.index, name = "Home"),
]
