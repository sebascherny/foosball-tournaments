from django.db import models
from django.contrib.auth.models import User


class Tournament(models.Model):
    name = models.CharField(max_length=100, unique=True)
    start_date = models.DateField()
    estimated_end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['start_date']


class Team(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='team', null=True, blank=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='teams', null=True, blank=True)
    name = models.CharField(max_length=100)
    group = models.CharField(max_length=10, default=None, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        if self.tournament:
            return f"{self.name} ({self.tournament.name})"
        return self.name
    
    class Meta:
        ordering = ['name']
        unique_together = [['name', 'tournament']]


class Classification(models.Model):
    team = models.OneToOneField(Team, on_delete=models.CASCADE, related_name='classification')
    points = models.IntegerField(default=0)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)
    games_lost = models.IntegerField(default=0)
    goals_for = models.IntegerField(default=0)
    goals_against = models.IntegerField(default=0)
    position = models.IntegerField(null=True, blank=True)
    
    @property
    def goal_difference(self):
        return self.goals_for - self.goals_against
    
    def __str__(self):
        return f"{self.team.name} - {self.points} pts"
    
    class Meta:
        ordering = ['-points', '-goals_for']


class Participant(models.Model):
    name = models.CharField(max_length=100)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='participants', null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class Match(models.Model):
    team1 = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='matches_as_team1')
    team2 = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='matches_as_team2')
    goals1 = models.IntegerField(default=0)
    goals2 = models.IntegerField(default=0)
    played_at = models.DateTimeField(auto_now_add=True)
    is_finished = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.team1.name} {self.goals1} - {self.goals2} {self.team2.name}"
    
    @property
    def winner(self):
        if self.goals1 > self.goals2:
            return self.team1
        elif self.goals2 > self.goals1:
            return self.team2
        return None  # Draw
    
    class Meta:
        ordering = ['-played_at']


class MatchSeries(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    matches = models.ManyToManyField(Match, related_name='series', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name
    
    @property
    def total_matches(self):
        return self.matches.count()
    
    @property
    def finished_matches(self):
        return self.matches.filter(is_finished=True).count()
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Match Series"


class GalleryImage(models.Model):
    title = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to='gallery/')
    description = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title or f"Image {self.id}"
    
    class Meta:
        ordering = ['order', '-uploaded_at']
