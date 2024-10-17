# forums/admin.py

from django.contrib import admin
from .models import Post, Comment

class CommentInline(admin.TabularInline):
    model = Comment
    extra = 1
    readonly_fields = ('author', 'created_at')
    can_delete = True

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'is_active', 'created_at', 'updated_at')
    search_fields = ('title', 'description', 'author__username')
    list_filter = ('is_active', 'created_at', 'author')
    ordering = ('-created_at',)
    inlines = [CommentInline]
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'author', 'parent', 'content_short', 'created_at')
    search_fields = ('post__title', 'author__username', 'content')
    list_filter = ('created_at', 'author')
    ordering = ('created_at',)
    autocomplete_fields = ('post', 'author', 'parent')

    def content_short(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_short.short_description = 'Content'
