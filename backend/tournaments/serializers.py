from rest_framework import serializers
from .models import Tournament, Team, Classification, Participant, GalleryImage, Match, MatchSeries


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'start_date', 'estimated_end_date', 'created_at']


class TeamSerializer(serializers.ModelSerializer):
    phone_number = serializers.SerializerMethodField()
    tournament_name = serializers.CharField(source='tournament.name', read_only=True)
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'group', 'phone_number', 'tournament', 'tournament_name', 'created_at']
    
    def get_phone_number(self, obj):
        # Get phone number from the first participant that has one
        participant = obj.participants.filter(phone_number__isnull=False).first()
        if participant:
            return participant.phone_number
        return obj.phone_number  # Fallback to team's phone number if exists


class ClassificationSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    goal_difference = serializers.ReadOnlyField()
    
    class Meta:
        model = Classification
        fields = ['id', 'team', 'team_name', 'points', 'games_played', 'games_won', 
                 'games_lost', 'goals_for', 'goals_against', 'goal_difference', 'position']


class ParticipantSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    
    class Meta:
        model = Participant
        fields = ['id', 'name', 'team', 'team_name', 'is_active', 'created_at']


class MatchSerializer(serializers.ModelSerializer):
    team1_name = serializers.CharField(source='team1.name', read_only=True)
    team2_name = serializers.CharField(source='team2.name', read_only=True)
    winner_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Match
        fields = '__all__'
    
    def get_winner_name(self, obj):
        winner = obj.winner
        return winner.name if winner else None


class MatchSeriesSerializer(serializers.ModelSerializer):
    matches = MatchSerializer(many=True, read_only=True)
    total_matches = serializers.ReadOnlyField()
    finished_matches = serializers.ReadOnlyField()
    
    class Meta:
        model = MatchSeries
        fields = '__all__'


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = '__all__'
