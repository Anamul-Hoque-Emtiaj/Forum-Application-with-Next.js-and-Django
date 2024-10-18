# middleware.py

from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from urllib.parse import parse_qs

class TokenAuthMiddleware:
    """
    Custom middleware that takes token from query string and authenticates the user.
    """

    async def __call__(self, scope, receive, send):
        # Clone the scope to avoid mutating the original
        scope = dict(scope)
        # Parse the query string
        query_string = scope['query_string'].decode()
        params = parse_qs(query_string)
        token_key = params.get('token', [None])[0]

        # Get the user
        scope['user'] = await self.get_user(token_key)

        # Return the inner application with updated scope
        return await self.app(scope, receive, send)

    def __init__(self, app):
        self.app = app

    @database_sync_to_async
    def get_user(self, token_key):
        try:
            token = Token.objects.get(key=token_key)
            return token.user
        except Token.DoesNotExist:
            return AnonymousUser()
