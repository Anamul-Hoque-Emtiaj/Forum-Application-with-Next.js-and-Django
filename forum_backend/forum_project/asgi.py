import os
from channels.routing import get_default_application
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'forum_project.settings')
django_asgi_app = get_asgi_application()

import forum_project.routing

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AuthMiddlewareStack(
        URLRouter(
            forum_project.routing.websocket_urlpatterns
        )
    ),
})
