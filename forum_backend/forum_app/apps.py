# forum_app/apps.py

from django.apps import AppConfig

class ForumAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'forum_app'

    def ready(self):
        import forum_app.signals  # Import signals
