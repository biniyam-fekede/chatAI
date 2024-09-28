from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import MyUser
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.password_validation import validate_password
from .models import Message


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    phone_number = serializers.CharField(max_length=15, required=True)  # Required phone number

    class Meta:
        model = MyUser
        fields = ('email', 'first_name', 'last_name', 'phone_number', 'password', 'password2')  # Add phone_number

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        user = MyUser(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data['phone_number'],  # Add phone_number to create method
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

# Login Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials or user does not exist.")
        return {
            'user': user,
            'user_id': user.id,
            'email': user.email,
            'first_name': user.first_name,
        }


# Password Reset Request Serializer (sending the reset email)
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not MyUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('User with this email does not exist.')
        return value


# Password Reset Confirm Serializer (setting the new password)
class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    token = serializers.CharField()
    uidb64 = serializers.CharField()

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs

    def save(self, **kwargs):
        try:
            uid = force_str(urlsafe_base64_decode(self.validated_data['uidb64']))
            user = MyUser.objects.get(pk=uid)
            token = self.validated_data['token']

            # Check if the token is valid
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError("Token is invalid or has expired.")

            # Set the new password
            user.set_password(self.validated_data['password'])
            user.save()

        except (TypeError, ValueError, OverflowError, MyUser.DoesNotExist):
            raise serializers.ValidationError("Invalid token or user.")

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'title', 'conversation', 'timestamp', 'user']
        read_only_fields = ['id', 'timestamp', 'user']
