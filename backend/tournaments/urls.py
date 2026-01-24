from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, auth_views, admin_views

router = DefaultRouter()
router.register(r'tournaments', views.TournamentViewSet)
router.register(r'teams', views.TeamViewSet)
router.register(r'classifications', views.ClassificationViewSet)
router.register(r'participants', views.ParticipantViewSet)
router.register(r'matches', views.MatchViewSet)
router.register(r'match-series', views.MatchSeriesViewSet)
router.register(r'gallery', views.GalleryImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Authentication endpoints
    path('auth/register/', auth_views.register_team, name='register_team'),
    path('auth/login/', auth_views.login_team, name='login_team'),
    path('auth/logout/', auth_views.logout_team, name='logout_team'),
    path('auth/me/', auth_views.get_user_team, name='get_user_team'),
    # Match loading endpoints
    path('auth/opponents/', auth_views.get_opponent_teams, name='get_opponent_teams'),
    path('auth/load-match/', auth_views.load_match_result, name='load_match_result'),
    path('auth/my-matches/', auth_views.get_team_matches, name='get_team_matches'),
    path('auth/assign-tournament/', auth_views.assign_team_to_tournament, name='assign_team_to_tournament'),
    path('auth/tournaments/', auth_views.get_available_tournaments, name='get_available_tournaments'),
    # Admin endpoints
    path('admin/login/', admin_views.admin_login, name='admin_login'),
    path('admin/tournaments/', admin_views.list_tournaments, name='admin_list_tournaments'),
    path('admin/tournaments/create/', admin_views.create_tournament, name='admin_create_tournament'),
    path('admin/tournaments/<int:tournament_id>/teams/', admin_views.get_tournament_teams, name='admin_get_tournament_teams'),
    path('admin/tournaments/<int:tournament_id>/assign-groups/', admin_views.assign_team_groups, name='admin_assign_team_groups'),
    path('admin/tournaments/<int:tournament_id>/random-groups/', admin_views.randomly_assign_groups, name='admin_randomly_assign_groups'),
]
