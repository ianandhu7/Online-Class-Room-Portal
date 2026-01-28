from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test users for student, teacher, and admin roles'

    def handle(self, *args, **options):
        test_users = [
            {
                'username': 'student@example.com',
                'email': 'student@example.com',
                'name': 'Student User',
                'password': 'student123',
                'role': 'student',
            },
            {
                'username': 'teacher@example.com',
                'email': 'teacher@example.com',
                'name': 'Teacher User',
                'password': 'teacher123',
                'role': 'teacher',
            },
            {
                'username': 'admin@example.com',
                'email': 'admin@example.com',
                'name': 'Admin User',
                'password': 'admin123',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        ]

        for user_data in test_users:
            email = user_data['email']
            
            # Check if user already exists
            if User.objects.filter(email=email).exists():
                self.stdout.write(
                    self.style.WARNING(f'User {email} already exists, skipping...')
                )
                continue
            
            # Create user
            password = user_data.pop('password')
            user = User.objects.create_user(**user_data)
            user.set_password(password)
            user.save()
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created {user.role} user: {email}')
            )

        self.stdout.write(
            self.style.SUCCESS('\n=== LOGIN CREDENTIALS ===')
        )
        self.stdout.write('Student Login:')
        self.stdout.write('  Email: student@example.com')
        self.stdout.write('  Password: student123')
        self.stdout.write('')
        self.stdout.write('Teacher Login:')
        self.stdout.write('  Email: teacher@example.com')
        self.stdout.write('  Password: teacher123')
        self.stdout.write('')
        self.stdout.write('Admin Login:')
        self.stdout.write('  Email: admin@example.com')
        self.stdout.write('  Password: admin123')
        self.stdout.write('========================')