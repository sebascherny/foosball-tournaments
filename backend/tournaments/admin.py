from django.contrib import admin
from .models import Team, Classification, Participant, GalleryImage, Match, MatchSeries


def assign_to_group_a(modeladmin, request, queryset):
    """Admin action to assign selected teams to Group A"""
    # Only assign teams that don't have a group assigned
    unassigned_teams = queryset.filter(group__isnull=True)
    updated_count = unassigned_teams.update(group='A')
    
    if updated_count:
        modeladmin.message_user(
            request,
            f"Successfully assigned {updated_count} team(s) to Group A."
        )
    else:
        modeladmin.message_user(
            request,
            "No unassigned teams were selected.",
            level='WARNING'
        )

assign_to_group_a.short_description = "Assign to Group A"


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'group', 'created_at']
    list_filter = ['group', 'created_at']
    search_fields = ['name']
    actions = [assign_to_group_a]
    
    def get_queryset(self, request):
        """Show all teams but highlight unassigned ones"""
        return super().get_queryset(request)
    
    def changelist_view(self, request, extra_context=None):
        """Add context for unassigned teams"""
        extra_context = extra_context or {}
        extra_context['unassigned_count'] = self.model.objects.filter(group__isnull=True).count()
        return super().changelist_view(request, extra_context=extra_context)


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
