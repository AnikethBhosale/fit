from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    exp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    reward_points = models.IntegerField(default=0)
    is_admin = models.BooleanField(default=False)

    def add_exp(self, amount):
        """Add experience points and update level if necessary."""
        self.exp += amount
        new_level = (self.exp // 100) + 1
        if new_level > self.level:
            self.level = new_level
        self.save()

    def calculate_level(self):
        """Calculate and update user's level based on total EXP."""
        self.level = (self.exp // 100) + 1
        self.save()

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image_url = models.URLField()
    difficulty = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ])
    exp_per_rep = models.IntegerField(default=0, help_text='Experience points earned per repetition')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    reps_completed = models.IntegerField(default=0)
    exp_earned = models.IntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Calculate EXP earned based on reps and exercise's exp_per_rep
        self.exp_earned = self.reps_completed * self.exercise.exp_per_rep
        # Update user's total EXP
        self.user.add_exp(self.exp_earned)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.exercise.name}"

class Reward(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    points_cost = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class UserReward(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE)
    redeemed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.reward.name}"

class Leaderboard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_exp = models.IntegerField(default=0)
    rank = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-total_exp']

    def __str__(self):
        return f"{self.user.username} - Rank {self.rank}"

class Achievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.name}"

class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.description}"
