#!/usr/bin/env python
import os
import sys
import django
import time

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management import execute_from_command_line
from django.db import connection
from django.core.management.color import no_style

def wait_for_db():
    """Wait for database to be available"""
    print("=== WAITING FOR DATABASE ===")
    max_retries = 30
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            print("✅ Database connection successful")
            return True
        except Exception as e:
            retry_count += 1
            print(f"Database not ready ({retry_count}/{max_retries}): {e}")
            time.sleep(2)
    
    print("❌ Database connection failed after all retries")
    return False

def init_database():
    print("=== INITIALIZING POSTGRESQL DATABASE ===")
    
    # Wait for database to be ready
    if not wait_for_db():
        return False
    
    # Run migrations
    try:
        print("Creating migrations...")
        execute_from_command_line(['manage.py', 'makemigrations', '--verbosity=2'])
        print("✅ Migrations created")
        
        print("Running migrations...")
        execute_from_command_line(['manage.py', 'migrate', '--verbosity=2'])
        print("✅ Migrations completed")
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    
    # Check if users_user table exists
    try:
        from users.models import User
        count = User.objects.count()
        print(f"✅ users_user table exists with {count} users")
    except Exception as e:
        print(f"❌ users_user table check failed: {e}")
        return False
    
    # Create test users
    try:
        print("Creating test users...")
        execute_from_command_line(['manage.py', 'create_test_users'])
        print("✅ Test users created")
    except Exception as e:
        print(f"❌ Test user creation failed: {e}")
        # Don't return False here, as this is not critical for basic functionality
    
    return True

if __name__ == '__main__':
    success = init_database()
    sys.exit(0 if success else 1)