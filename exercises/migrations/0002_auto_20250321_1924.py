from django.db import migrations

def create_sample_exercises(apps, schema_editor):
    Exercise = apps.get_model('exercises', 'Exercise')
    
    exercises = [
        {
            'name': 'Push-up',
            'description': 'A classic upper body exercise that targets chest, shoulders, and triceps.',
            'image_url': '/static/images/exercises/pushup.jpg',
            'difficulty': 'beginner',
            'exp_per_rep': 5
        },
        {
            'name': 'Squat',
            'description': 'A fundamental lower body exercise that targets legs and core.',
            'image_url': '/static/images/exercises/squat.jpg',
            'difficulty': 'beginner',
            'exp_per_rep': 4
        },
        {
            'name': 'Plank',
            'description': 'A core exercise that improves stability and endurance.',
            'image_url': '/static/images/exercises/plank.jpg',
            'difficulty': 'intermediate',
            'exp_per_rep': 3
        },
        {
            'name': 'Arm Raises',
            'description': 'A shoulder exercise that improves upper body strength and mobility.',
            'image_url': '/static/images/exercises/arm-raises.jpg',
            'difficulty': 'beginner',
            'exp_per_rep': 2
        },
        {
            'name': 'Jumping Jack',
            'description': 'A full-body cardio exercise that improves coordination and cardiovascular fitness.',
            'image_url': '/static/images/exercises/jumping-jack.jpg',
            'difficulty': 'intermediate',
            'exp_per_rep': 4
        }
    ]
    
    for exercise_data in exercises:
        Exercise.objects.create(**exercise_data)

def remove_sample_exercises(apps, schema_editor):
    Exercise = apps.get_model('exercises', 'Exercise')
    Exercise.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('exercises', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_sample_exercises, remove_sample_exercises),
    ] 