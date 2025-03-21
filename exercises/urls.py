from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('exercises/', views.exercise_list, name='exercise_list'),
    path('exercise/<int:exercise_id>/', views.exercise_detail, name='exercise_detail'),
    path('exercise/<int:exercise_id>/session/', views.exercise_session, name='exercise_session'),
    path('update-progress/', views.update_progress, name='update_progress'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('rewards/', views.rewards, name='rewards'),
    path('redeem-reward/', views.redeem_reward, name='redeem_reward'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('add-reward/', views.add_reward, name='add_reward'),
    path('delete-reward/', views.delete_reward, name='delete_reward'),
    path('check-achievements/', views.check_achievements, name='check_achievements'),
] 