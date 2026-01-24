from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foosball_project.settings')
django.setup()

from tournaments.models import Team, Classification, Participant, GalleryImage
from tournaments.serializers import TeamSerializer, ClassificationSerializer, ParticipantSerializer, GalleryImageSerializer

app = FastAPI(title="Foosball Tournaments API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Foosball Tournaments FastAPI"}

@app.get("/api/teams/")
async def get_teams():
    teams = Team.objects.all()
    serializer = TeamSerializer(teams, many=True)
    return serializer.data

@app.get("/api/classifications/")
async def get_classifications():
    classifications = Classification.objects.all()
    serializer = ClassificationSerializer(classifications, many=True)
    return serializer.data

@app.get("/api/participants/")
async def get_participants():
    participants = Participant.objects.filter(is_active=True)
    serializer = ParticipantSerializer(participants, many=True)
    return serializer.data

@app.get("/api/gallery/")
async def get_gallery():
    images = GalleryImage.objects.all()
    serializer = GalleryImageSerializer(images, many=True)
    return serializer.data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
