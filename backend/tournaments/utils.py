from .models import Classification


def update_team_classification(team, goals_for, goals_against):
    """Update team classification based on match result"""
    classification, created = Classification.objects.get_or_create(
        team=team,
        defaults={
            'points': 0,
            'games_played': 0,
            'games_won': 0,
            'games_lost': 0,
            'goals_for': 0,
            'goals_against': 0,
        }
    )
    
    # Update match statistics
    classification.games_played += 1
    classification.goals_for += goals_for
    classification.goals_against += goals_against
    
    # Determine match result and update points
    if goals_for > goals_against:
        # Win
        classification.games_won += 1
        classification.points += 3
    elif goals_for < goals_against:
        # Loss
        classification.games_lost += 1
    else:
        # Draw (if draws are allowed)
        classification.points += 1
    
    classification.save()
    return classification
