from django.urls import path, include

urlpatterns = [
    path('timetracker/', include('timetracker.urls'))
]
