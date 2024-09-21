from django.contrib import admin
from django.urls import path, include
from chatbot.views import get_data, home
from rest_framework_simplejwt.views import TokenRefreshView

# Import views from authentication app
from chatbot.views import RegisterView, LoginView, PasswordResetRequestView, PasswordResetConfirmView

urlpatterns = [
    path('admin/', admin.site.urls),
    # API for chatbot data 
    path('api/data/', get_data),
    # Home page
    path('', home),  # Root URL for the homepage
    # User authentication URLs
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Password reset URLs
    path('api/password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('api/password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
