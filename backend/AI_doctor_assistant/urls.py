from django.contrib import admin
from django.urls import path, include
from chatbot.views import get_data, home
from rest_framework_simplejwt.views import TokenRefreshView

# Import views from chatbot app
from chatbot.views import (
    RegisterView, 
    LoginView, 
    PasswordResetRequestView, 
    PasswordResetConfirmView,
    save_conversation, 
    get_conversations, 
    get_conversation_detail,
    get_latest_conversation,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),  # Home page
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('api/password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/', include('chatbot.urls')),  # Include URLs from chatbot app
    path('api/save-conversation/', save_conversation, name='save_conversation'),  # Adjusted path
    path('api/conversations/', get_conversations, name='get_conversations'),  # Adjusted path
    path('api/conversations/<int:conversation_id>/', get_conversation_detail, name='get_conversation_detail'),  # Adjusted path for details
    path('api/conversations/latest/', get_latest_conversation, name='latest_conversation'),
]
