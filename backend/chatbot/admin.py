from django.contrib import admin
from .models import MyUser, Message  # Import your models

@admin.register(MyUser)
class MyUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'phone_number', 'is_active', 'is_staff')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_conversation_summary', 'timestamp')

    def get_conversation_summary(self, obj):
        if obj.conversation:
            # Assuming conversation is a list of dicts with 'message' and 'response' keys
            first_entry = obj.conversation[0] if len(obj.conversation) > 0 else {'message': '', 'response': ''}
            return f"User: {first_entry.get('message', '')[:50]} | Bot: {first_entry.get('response', '')[:50]}"
        return "No conversation"

    get_conversation_summary.short_description = 'Conversation Summary'
