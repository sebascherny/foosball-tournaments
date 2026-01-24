from django.contrib import admin
from .models import Team, Classification, Participant, GalleryImage, Match, MatchSeries


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(Classification)
class ClassificationAdmin(admin.ModelAdmin):
    list_display = ['team', 'points', 'games_played', 'games_won', 'games_lost', 'goal_difference', 'position']
    list_filter = ['games_played', 'games_won']
    ordering = ['-points', '-goals_for']


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ['name', 'team', 'is_active', 'created_at']
    list_filter = ['is_active', 'team']
    search_fields = ['name']


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['team1', 'team2', 'goals1', 'goals2', 'played_at', 'is_finished', 'winner']
    list_filter = ['is_finished', 'played_at']
    search_fields = ['team1__name', 'team2__name']
    ordering = ['-played_at']
    
    def winner(self, obj):
        winner = obj.winner
        return winner.name if winner else "Draw"
    winner.short_description = "Winner"


@admin.register(MatchSeries)
class MatchSeriesAdmin(admin.ModelAdmin):
    list_display = ['name', 'total_matches', 'finished_matches', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    filter_horizontal = ['matches']
    ordering = ['-created_at']


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'uploaded_at', 'order']
    list_filter = ['uploaded_at']
    search_fields = ['title', 'description']
    ordering = ['order', '-uploaded_at']
