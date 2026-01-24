import random
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import user_passes_test
from django.db import transaction
from .models import Tournament, Team
from .serializers import TournamentSerializer, TeamSerializer


def is_admin_user(user):
    """Check if user is admin/staff"""
    return user.is_authenticated and (user.is_staff or user.is_superuser)


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """Admin login endpoint"""
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if user and (user.is_staff or user.is_superuser):
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'Admin login successful',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid credentials or insufficient permissions'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response({
            'error': f'Login failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_passes_test(is_admin_user)
def create_tournament(request):
    """Admin-only: Create a new tournament"""
    try:
        serializer = TournamentSerializer(data=request.data)
        if serializer.is_valid():
            tournament = serializer.save()
            return Response({
                'message': 'Tournament created successfully',
                'tournament': TournamentSerializer(tournament).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'error': 'Invalid tournament data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'Failed to create tournament: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_passes_test(is_admin_user)
def get_tournament_teams(request, tournament_id):
    """Admin-only: Get teams by group within a tournament"""
    try:
        tournament = Tournament.objects.get(id=tournament_id)
        teams = Team.objects.filter(tournament=tournament).order_by('group', 'name')
        
        # Group teams by their group
        teams_by_group = {}
        teams_without_group = []
        
        for team in teams:
            if team.group:
                if team.group not in teams_by_group:
                    teams_by_group[team.group] = []
                teams_by_group[team.group].append(TeamSerializer(team).data)
            else:
                teams_without_group.append(TeamSerializer(team).data)
        
        return Response({
            'tournament': TournamentSerializer(tournament).data,
            'teams_by_group': teams_by_group,
            'teams_without_group': teams_without_group,
            'total_teams': teams.count()
        }, status=status.HTTP_200_OK)
        
    except Tournament.DoesNotExist:
        return Response({
            'error': 'Tournament not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Failed to get tournament teams: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_passes_test(is_admin_user)
def assign_team_groups(request, tournament_id):
    """Admin-only: Assign specific teams to specific groups"""
    try:
        tournament = Tournament.objects.get(id=tournament_id)
        team_assignments = request.data.get('assignments', [])
        
        if not team_assignments:
            return Response({
                'error': 'No team assignments provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        updated_teams = []
        
        with transaction.atomic():
            for assignment in team_assignments:
                team_id = assignment.get('team_id')
                group = assignment.get('group')
                
                if not team_id or not group:
                    return Response({
                        'error': 'Each assignment must have team_id and group'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                try:
                    team = Team.objects.get(id=team_id, tournament=tournament)
                    team.group = group
                    team.save()
                    updated_teams.append(TeamSerializer(team).data)
                except Team.DoesNotExist:
                    return Response({
                        'error': f'Team with id {team_id} not found in tournament {tournament.name}'
                    }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'message': f'Successfully assigned {len(updated_teams)} teams to groups',
            'updated_teams': updated_teams
        }, status=status.HTTP_200_OK)
        
    except Tournament.DoesNotExist:
        return Response({
            'error': 'Tournament not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Failed to assign team groups: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@user_passes_test(is_admin_user)
def randomly_assign_groups(request, tournament_id):
    """Admin-only: Randomly assign groups to teams without groups"""
    try:
        tournament = Tournament.objects.get(id=tournament_id)
        available_groups = request.data.get('groups', ['A', 'B', 'C'])
        
        # Get teams without groups
        teams_without_group = Team.objects.filter(
            tournament=tournament,
            group__isnull=True
        ) | Team.objects.filter(
            tournament=tournament,
            group=''
        )
        
        if not teams_without_group.exists():
            return Response({
                'message': 'No teams without groups found',
                'assigned_teams': []
            }, status=status.HTTP_200_OK)
        
        updated_teams = []
        
        with transaction.atomic():
            for team in teams_without_group:
                # Randomly assign a group
                assigned_group = random.choice(available_groups)
                team.group = assigned_group
                team.save()
                updated_teams.append(TeamSerializer(team).data)
        
        return Response({
            'message': f'Successfully randomly assigned {len(updated_teams)} teams to groups',
            'assigned_teams': updated_teams,
            'available_groups': available_groups
        }, status=status.HTTP_200_OK)
        
    except Tournament.DoesNotExist:
        return Response({
            'error': 'Tournament not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Failed to randomly assign groups: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@user_passes_test(is_admin_user)
def list_tournaments(request):
    """Admin-only: List all tournaments with team counts"""
    try:
        tournaments = Tournament.objects.all().order_by('-created_at')
        tournament_data = []
        
        for tournament in tournaments:
            teams_count = Team.objects.filter(tournament=tournament).count()
            teams_by_group = {}
            
            # Count teams by group
            for team in Team.objects.filter(tournament=tournament):
                group = team.group or 'No Group'
                teams_by_group[group] = teams_by_group.get(group, 0) + 1
            
            tournament_info = TournamentSerializer(tournament).data
            tournament_info['teams_count'] = teams_count
            tournament_info['teams_by_group'] = teams_by_group
            tournament_data.append(tournament_info)
        
        return Response({
            'tournaments': tournament_data,
            'total_tournaments': len(tournament_data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to list tournaments: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
