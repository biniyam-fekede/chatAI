from django.urls import path
from .views import get_data
from .views import update_conversation_title  


urlpatterns = [
    path('get-data/', get_data, name='get_data'),  # Define the chatbot API URL for POST requests
    path('conversations/<int:conversation_id>/update-title/', update_conversation_title, name='update-conversation-title'),
]
