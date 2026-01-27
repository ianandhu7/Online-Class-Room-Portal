#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management import execute_from_command_line
from django.db import connection
from django.core.management.color import no_style

def init_database():
    print("=== INITIALIZING DATABASE ===")
    
    # Check database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✅ Database connection successful")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
    
    # Run migrations
    try:
        print("Running migrations...")
        execute_from_command_line(['manage.py', 'migrate', '--run-syncdb', '--verbosity=2'])
        print("✅ Migrations completed")
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    
    # Check if users_user table exists
    try:
        from users.models import User
        count = User.objects.count()
        print(f"✅ users_user table exists with {count} users")
        return True
    except Exception as e:
        print(f"❌ users_user table check failed: {e}")
        return False

if __name__ == '__main__':
    success = init_database()
    sys.exit(0 if success else 1)