from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction, models
from .models import Tournament, Team, Participant, Match, Classification
from .serializers import TournamentSerializer, TeamSerializer, MatchSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_team(request):
    """Register a new team with participants"""
    try:
        data = request.data
        team_name = data.get('team_name')
        password = data.get('password')
        participants = data.get('participants', [])
        tournament_id = data.get('tournament_id')
        
        if not team_name or not password:
            return Response({
                'error': 'Team name and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(participants) != 2:
            return Response({
                'error': 'Exactly 2 participants are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get tournament (use default if not specified)
        if tournament_id:
            try:
                tournament = Tournament.objects.get(id=tournament_id)
            except Tournament.DoesNotExist:
                return Response({
                    'error': 'Tournament not found'
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Use the default tournament
            tournament = Tournament.objects.first()
            if not tournament:
                return Response({
                    'error': 'No tournament available'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if team name already exists in this tournament
        if Team.objects.filter(name=team_name, tournament=tournament).exists():
            return Response({
                'error': f'Team name already exists in tournament "{tournament.name}"'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            # Create user account
            username = team_name.lower().replace(' ', '_')
            if User.objects.filter(username=username).exists():
                username = f"{username}_{Team.objects.count()}"
            
            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=team_name
            )
            
            # Create team
            team = Team.objects.create(
                user=user,
                tournament=tournament,
                name=team_name,
            )
            
            # Create participants
            for participant_data in participants:
                Participant.objects.create(
                    name=participant_data.get('name'),
                    phone_number=participant_data.get('phone_number'),
                    team=team,
                    is_active=True
                )
            
            # Create token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'message': 'Team registered successfully',
                'token': token.key,
                'team': TeamSerializer(team).data
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_team(request):
    """Login team and return token"""
    try:
        team_name = request.data.get('team_name')
        password = request.data.get('password')
        
        if not team_name or not password:
            return Response({
                'error': 'Team name and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Find team and get username
        try:
            team = Team.objects.get(name=team_name)
            username = team.user.username
        except Team.DoesNotExist:
            return Response({
                'error': 'Invalid team name or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Authenticate user
        user = authenticate(request=request, username=username, password=password)
        if user is None:
            return Response({
                'error': 'Invalid team name or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get or create token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Login successful',
            'token': token.key,
            'team': TeamSerializer(team).data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_team(request):
    """Logout team by deleting token"""
    try:
        request.user.auth_token.delete()
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_team(request):
    """Get current user's team information"""
    try:
        team = request.user.team
        return Response({
            'team': TeamSerializer(team).data
        }, status=status.HTTP_200_OK)
    except Team.DoesNotExist:
        return Response({
            'error': 'No team associated with this user'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_opponent_teams(request):
    """Get list of teams that can be played against (same group, excluding own team)"""
    try:
        user_team = request.user.team
        opponent_teams = Team.objects.filter(
            group=user_team.group
        ).exclude(id=user_team.id)
        
        teams_data = []
        for team in opponent_teams:
            teams_data.append({
                'id': team.id,
                'name': team.name,
                'group': team.group
            })
        
        return Response({
            'teams': teams_data
        }, status=status.HTTP_200_OK)
        
    except Team.DoesNotExist:
        return Response({
            'error': 'No team associated with this user'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def load_match_result(request):
    """Load a match result between user's team and opponent team"""
    try:
        user_team = request.user.team
        data = request.data
        
        opponent_team_id = data.get('opponent_team_id')
        user_goals = data.get('user_goals', 0)
        opponent_goals = data.get('opponent_goals', 0)
        
        if not opponent_team_id:
            return Response({
                'error': 'Opponent team ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            opponent_team = Team.objects.get(id=opponent_team_id)
        except Team.DoesNotExist:
            return Response({
                'error': 'Opponent team not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if teams are in same group
        if user_team.group != opponent_team.group:
            return Response({
                'error': 'Can only play against teams in the same group'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create match
        match = Match.objects.create(
            team1=user_team,
            team2=opponent_team,
            team1_goals=user_goals,
            team2_goals=opponent_goals,
            is_finished=True
        )
        
        # Update classifications
        from .utils import update_team_classification
        update_team_classification(user_team, user_goals, opponent_goals)
        update_team_classification(opponent_team, opponent_goals, user_goals)
        
        return Response({
            'message': 'Match result loaded successfully',
            'match': MatchSerializer(match).data
        }, status=status.HTTP_201_CREATED)
        
    except Team.DoesNotExist:
        return Response({
            'error': 'No team associated with this user'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_team_matches(request):
    """Get all matches for the user's team"""
    try:
        user_team = request.user.team
        matches = Match.objects.filter(
            models.Q(team1=user_team) | models.Q(team2=user_team)
        ).order_by('-created_at')
        
        return Response({
            'matches': MatchSerializer(matches, many=True).data
        }, status=status.HTTP_200_OK)
        
    except Team.DoesNotExist:
        return Response({
            'error': 'No team associated with this user'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_team_to_tournament(request):
    """Assign current user's team to a tournament"""
    try:
        user = request.user
        if not hasattr(user, 'team') or not user.team:
            return Response({
                'error': 'User does not have an associated team'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        team = user.team
        tournament_id = request.data.get('tournament_id')
        
        if not tournament_id:
            return Response({
                'error': 'Tournament ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({
                'error': 'Tournament not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if team name already exists in the target tournament
        if Team.objects.filter(name=team.name, tournament=tournament).exclude(id=team.id).exists():
            return Response({
                'error': f'A team with name "{team.name}" already exists in tournament "{tournament.name}"'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Assign team to tournament
        team.tournament = tournament
        team.save()
        
        # Create or update classification for the team
        from .utils import update_team_classification
        update_team_classification(team, 0, 0)  # Initialize with 0 wins and 0 losses
        
        return Response({
            'message': f'Team "{team.name}" successfully assigned to tournament "{tournament.name}"',
            'team': TeamSerializer(team).data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to assign team to tournament: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_available_tournaments(request):
    """Get list of available tournaments for team assignment"""
    try:
        tournaments = Tournament.objects.all().order_by('-created_at')
        tournament_data = []
        
        for tournament in tournaments:
            teams_count = Team.objects.filter(tournament=tournament).count()
            tournament_info = TournamentSerializer(tournament).data
            tournament_info['teams_count'] = teams_count
            tournament_data.append(tournament_info)
        
        return Response({
            'tournaments': tournament_data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to get tournaments: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
