from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate, logout
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib import messages
from .models import User, Exercise, UserProgress, Reward, UserReward, Leaderboard, Achievement, UserActivity
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
import json

def index(request):
    exercises = Exercise.objects.all()
    return render(request, 'exercises/home.html', {'exercises': exercises})

@login_required
def exercise_list(request):
    exercises = Exercise.objects.all()
    return render(request, 'exercises/exercise_list.html', {'exercises': exercises})

@login_required
def exercise_detail(request, exercise_id):
    exercise = get_object_or_404(Exercise, id=exercise_id)
    return render(request, 'exercises/exercise_detail.html', {'exercise': exercise})

@login_required
def exercise_session(request, exercise_id):
    exercise = get_object_or_404(Exercise, id=exercise_id)
    return render(request, 'exercises/exercise_session.html', {'exercise': exercise})

@login_required
def complete_exercise(request, exercise_id):
    if request.method == 'POST':
        exercise = get_object_or_404(Exercise, id=exercise_id)
        reps_completed = int(request.POST.get('reps_completed', 0))
        
        # Create UserProgress record
        progress = UserProgress.objects.create(
            user=request.user,
            exercise=exercise,
            reps_completed=reps_completed
        )
        
        # Update leaderboard
        leaderboard, created = Leaderboard.objects.get_or_create(user=request.user)
        leaderboard.total_exp = request.user.exp
        leaderboard.rank = Leaderboard.objects.filter(total_exp__gt=request.user.exp).count() + 1
        leaderboard.save()
        
        # Update ranks for all users
        for user in User.objects.all():
            leaderboard, _ = Leaderboard.objects.get_or_create(user=user)
            leaderboard.total_exp = user.exp
            leaderboard.rank = Leaderboard.objects.filter(total_exp__gt=user.exp).count() + 1
            leaderboard.save()
        
        return JsonResponse({
            'success': True,
            'exp_earned': progress.exp_earned,
            'total_exp': request.user.exp,
            'level': request.user.level
        })
    return JsonResponse({'success': False}, status=400)

@require_POST
@login_required
def update_progress(request):
    data = json.loads(request.body)
    exercise_id = data.get('exercise_id')
    reps = data.get('reps')
    
    exercise = get_object_or_404(Exercise, id=exercise_id)
    exp_earned = reps * 5  # 5 EXP per rep
    
    # Create or update user progress
    progress, created = UserProgress.objects.get_or_create(
        user=request.user,
        exercise=exercise,
        defaults={'reps_completed': reps, 'exp_earned': exp_earned}
    )
    
    if not created:
        progress.reps_completed += reps
        progress.exp_earned += exp_earned
        progress.save()
    
    # Update user's total EXP and level
    request.user.exp += exp_earned
    request.user.calculate_level()
    request.user.save()
    
    # Check for reward points (every 300 EXP)
    if request.user.exp % 300 < exp_earned:
        reward_points = 5 + (request.user.exp // 300) % 5  # 5-10 points
        request.user.reward_points += reward_points
        request.user.save()
    
    # Update leaderboard
    leaderboard, created = Leaderboard.objects.get_or_create(
        user=request.user,
        defaults={'total_exp': request.user.exp}
    )
    
    if not created:
        leaderboard.total_exp = request.user.exp
        leaderboard.save()
    
    # Update ranks
    Leaderboard.objects.all().order_by('-total_exp').update(rank=0)
    for rank, entry in enumerate(Leaderboard.objects.all().order_by('-total_exp'), 1):
        entry.rank = rank
        entry.save()
    
    return JsonResponse({
        'exp_earned': exp_earned,
        'total_exp': request.user.exp,
        'level': request.user.level,
        'reward_points': request.user.reward_points
    })

@login_required
def leaderboard(request):
    # Get all users ordered by total EXP
    users = User.objects.all().order_by('-exp')
    
    # Calculate ranks
    for i, user in enumerate(users, 1):
        user.rank = i
    
    context = {
        'leaderboard': users,
        'user_rank': users.filter(exp__gt=request.user.exp).count() + 1 if request.user.is_authenticated else None
    }
    return render(request, 'exercises/leaderboard.html', context)

@login_required
def rewards(request):
    rewards = Reward.objects.filter(is_active=True)
    user_rewards = UserReward.objects.filter(user=request.user)
    return render(request, 'exercises/rewards.html', {
        'rewards': rewards,
        'user_rewards': user_rewards
    })

@require_POST
@login_required
def redeem_reward(request):
    reward_id = request.POST.get('reward_id')
    reward = get_object_or_404(Reward, id=reward_id, is_active=True)
    
    if request.user.reward_points >= reward.points_cost:
        request.user.reward_points -= reward.points_cost
        request.user.save()
        
        UserReward.objects.create(user=request.user, reward=reward)
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'message': 'Insufficient points'})

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            if user.is_admin:
                return redirect('admin_dashboard')
            return redirect('index')
    
    return render(request, 'exercises/login.html')

@login_required
def admin_dashboard(request):
    if not request.user.is_admin:
        return redirect('index')
    
    rewards = Reward.objects.all()
    return render(request, 'exercises/admin_dashboard.html', {'rewards': rewards})

@require_POST
@login_required
def add_reward(request):
    if not request.user.is_admin:
        return JsonResponse({'success': False, 'message': 'Unauthorized'})
    
    name = request.POST.get('name')
    description = request.POST.get('description')
    points_cost = request.POST.get('points_cost')
    
    reward = Reward.objects.create(
        name=name,
        description=description,
        points_cost=points_cost
    )
    
    return JsonResponse({'success': True, 'reward_id': reward.id})

@require_POST
@login_required
def delete_reward(request):
    if not request.user.is_admin:
        return JsonResponse({'success': False, 'message': 'Unauthorized'})
    
    reward_id = request.POST.get('reward_id')
    reward = get_object_or_404(Reward, id=reward_id)
    reward.is_active = False
    reward.save()
    
    return JsonResponse({'success': True})

def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        
        if password1 != password2:
            return render(request, 'exercises/signup.html', {
                'error_message': 'Passwords do not match.'
            })
        
        if User.objects.filter(username=username).exists():
            return render(request, 'exercises/signup.html', {
                'error_message': 'Username already exists.'
            })
        
        if User.objects.filter(email=email).exists():
            return render(request, 'exercises/signup.html', {
                'error_message': 'Email already exists.'
            })
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password1
        )
        
        login(request, user)
        return redirect('index')
    
    return render(request, 'exercises/signup.html')

@login_required
def profile_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        bio = request.POST.get('bio')
        
        if username != request.user.username and User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return redirect('profile')
        
        if email != request.user.email and User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            return redirect('profile')
        
        request.user.username = username
        request.user.email = email
        request.user.bio = bio
        request.user.save()
        
        messages.success(request, 'Profile updated successfully.')
        return redirect('profile')
    
    # Get user's recent achievements
    recent_achievements = Achievement.objects.filter(
        user=request.user
    ).order_by('-created_at')[:5]
    
    # Get user's recent activity
    recent_activity = UserActivity.objects.filter(
        user=request.user
    ).order_by('-timestamp')[:5]
    
    return render(request, 'exercises/profile.html', {
        'recent_achievements': recent_achievements,
        'recent_activity': recent_activity
    })

def logout_view(request):
    logout(request)
    return redirect('index')

@login_required
def check_achievements(request):
    # Check for various achievements
    achievements = []
    
    # First exercise achievement
    if UserProgress.objects.filter(user=request.user).count() == 1:
        achievement, created = Achievement.objects.get_or_create(
            user=request.user,
            name='First Steps',
            description='Completed your first exercise'
        )
        if created:
            achievements.append(achievement)
    
    # Level milestones
    level_achievements = {
        5: ('Getting Started', 'Reached level 5'),
        10: ('Intermediate', 'Reached level 10'),
        20: ('Advanced', 'Reached level 20'),
        50: ('Master', 'Reached level 50')
    }
    
    for level, (name, desc) in level_achievements.items():
        if request.user.level >= level:
            achievement, created = Achievement.objects.get_or_create(
                user=request.user,
                name=name,
                description=desc
            )
            if created:
                achievements.append(achievement)
    
    # Record activity for new achievements
    for achievement in achievements:
        UserActivity.objects.create(
            user=request.user,
            description=f'Earned achievement: {achievement.name}'
        )
    
    return JsonResponse({
        'achievements': [{
            'name': a.name,
            'description': a.description
        } for a in achievements]
    })
