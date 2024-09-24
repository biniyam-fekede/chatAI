from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from .models import MyUser, Message
from .serializers import RegisterSerializer, LoginSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes, force_str
from django.utils.http import urlsafe_base64_encode
from .model_service import ModelService
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


# ------------------------ Views ------------------------

# Registration View
class RegisterView(GenericAPIView):
    queryset = MyUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user_id': user.id,
                'email': user.email,
                'first_name': user.first_name,
            }, status=201)
        return Response(serializer.errors, status=400)


# Login View
class LoginView(GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            # Generate tokens using Simple JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'email': user.email,
                'first_name': user.first_name,
            })

        return Response(serializer.errors, status=400)


# Password Reset Request View
class PasswordResetRequestView(GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = MyUser.objects.get(email=email)

            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))

            reset_link = f"http://127.0.0.1:8000/api/password-reset-confirm/{uidb64}/{token}/"
            return Response({"reset_link": reset_link}, status=200)
        return Response(serializer.errors, status=400)


# Password Reset Confirm View
class PasswordResetConfirmView(GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password reset successfully!"}, status=200)
        return Response(serializer.errors, status=400)


# Home View
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Homepage!")


# ------------------------ Chatbot Views ------------------------

model_service = ModelService()

@csrf_exempt  # Temporarily disable CSRF for simplicity
def get_data(request):
    if request.method == 'POST':
        # Parse the JSON request from the frontend
        data = json.loads(request.body)
        user_input = data.get('message', '')

        # Get model prediction from GPT-2
        response_text = model_service.predict(user_input)

        # Save message to the database if the user is authenticated
        if request.user.is_authenticated:
            Message.objects.create(user=request.user, message=user_input, response=response_text)

        # Send the response back as JSON
        return JsonResponse({'response': response_text})

    return JsonResponse({'error': 'Invalid request method'}, status=400)
