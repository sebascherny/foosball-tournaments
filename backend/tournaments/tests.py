import pytest
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Team, Classification, Participant, GalleryImage


class TeamModelTest(TestCase):
    def test_team_creation(self):
        team = Team.objects.create(name="Test Team")
        self.assertEqual(team.name, "Test Team")
        self.assertTrue(team.created_at)

    def test_team_str_representation(self):
        team = Team.objects.create(name="Test Team")
        self.assertEqual(str(team), "Test Team")


class ClassificationModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name="Test Team")

    def test_classification_creation(self):
        classification = Classification.objects.create(
            team=self.team,
            points=10,
            games_played=5,
            games_won=3,
            games_lost=2,
            goals_for=15,
            goals_against=8
        )
        self.assertEqual(classification.goal_difference, 7)
        self.assertEqual(str(classification), "Test Team - 10 pts")


class ParticipantModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name="Test Team")

    def test_participant_creation(self):
        participant = Participant.objects.create(
            name="John Doe",
            team=self.team
        )
        self.assertEqual(participant.name, "John Doe")
        self.assertTrue(participant.is_active)


class TeamAPITest(APITestCase):
    def test_get_teams(self):
        Team.objects.create(name="Team 1")
        Team.objects.create(name="Team 2")
        
        url = reverse('team-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_team(self):
        url = reverse('team-list')
        data = {'name': 'New Team'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 1)


class ClassificationAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name="Test Team")

    def test_get_classifications(self):
        Classification.objects.create(
            team=self.team,
            points=10,
            games_played=5
        )
        
        url = reverse('classification-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
