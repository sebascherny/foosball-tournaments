from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Tournament, Team, Classification, Participant, GalleryImage, Match, MatchSeries
from .serializers import TournamentSerializer, TeamSerializer, ClassificationSerializer, ParticipantSerializer, GalleryImageSerializer, MatchSerializer, MatchSeriesSerializer


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class ClassificationViewSet(viewsets.ModelViewSet):
    queryset = Classification.objects.all()
    serializer_class = ClassificationSerializer
    
    def get_queryset(self):
        """Filter classifications by team group if provided"""
        queryset = Classification.objects.all()
        group = self.request.query_params.get('group', None)
        if group is not None:
            queryset = queryset.filter(team__group=group)
        return queryset
    
    @action(detail=False, methods=['get'])
    def table(self):
        """Get classification table ordered by position"""
        classifications = self.get_queryset()
        serializer = self.get_serializer(classifications, many=True)
        return Response(serializer.data)


class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    
    @action(detail=False, methods=['get'])
    def active(self):
        """Get only active participants"""
        participants = Participant.objects.filter(is_active=True)
        serializer = self.get_serializer(participants, many=True)
        return Response(serializer.data)


class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent matches"""
        matches = Match.objects.all()[:10]
        serializer = self.get_serializer(matches, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def finished(self, request):
        """Get finished matches"""
        matches = Match.objects.filter(is_finished=True)
        serializer = self.get_serializer(matches, many=True)
        return Response(serializer.data)


class MatchSeriesViewSet(viewsets.ModelViewSet):
    queryset = MatchSeries.objects.all()
    serializer_class = MatchSeriesSerializer
    
    @action(detail=True, methods=['post'])
    def add_match(self, request, pk=None):
        """Add a match to the series"""
        series = self.get_object()
        match_id = request.data.get('match_id')
        if match_id:
            try:
                match = Match.objects.get(id=match_id)
                series.matches.add(match)
                return Response({'status': 'match added'})
            except Match.DoesNotExist:
                return Response({'error': 'Match not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'match_id required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def remove_match(self, request, pk=None):
        """Remove a match from the series"""
        series = self.get_object()
        match_id = request.data.get('match_id')
        if match_id:
            try:
                match = Match.objects.get(id=match_id)
                series.matches.remove(match)
                return Response({'status': 'match removed'})
            except Match.DoesNotExist:
                return Response({'error': 'Match not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'match_id required'}, status=status.HTTP_400_BAD_REQUEST)


class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
