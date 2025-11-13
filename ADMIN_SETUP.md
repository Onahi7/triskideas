# Admin User Setup Guide

This guide explains how to set up the admin user for the Triskideas blog application.

## Prerequisites

1. Make sure you have a valid `DATABASE_URL` in your `.env.local` file
2. Ensure your database is accessible and running

## Database Setup

### 1. Create Admin Table

First, run the database migration to create the admin users table:

```bash
# Option 1: Using psql (if you have PostgreSQL client installed)
pnpm run db:migrate

# Option 2: Manual SQL execution
# Connect to your database and run the contents of scripts/add-admin-table.sql
```

### 2. Seed Admin User

Run the seeding script to create the admin user with the hashed password:

```bash
pnpm run seed:admin
```

This will create an admin user with the following credentials:
- **Username**: `admin`
- **Password**: `Trisky_2035`
- **Email**: `admin@triskideas.com`
- **Full Name**: `Dr. Ferdinand Ibu Ogbaji`

## Usage

After seeding, you can login to the admin panel using:
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `Trisky_2035`

## Security Features

- ✅ Password is hashed using bcryptjs with 12 salt rounds
- ✅ Database-based authentication (replaces localStorage)
- ✅ Admin user can be activated/deactivated
- ✅ Password update functionality available
- ✅ Secure credential verification

## Scripts Included

1. **`scripts/add-admin-table.sql`** - Creates the admin_users table
2. **`scripts/seed-admin.ts`** - Seeds the default admin user
3. **`lib/auth-utils.ts`** - Helper functions for authentication

## API Functions

The following functions are available in `lib/auth-utils.ts`:

- `verifyAdminCredentials(username, password)` - Verify login credentials
- `createAdminUser(username, password, email?, fullName?)` - Create new admin
- `updateAdminPassword(username, newPassword)` - Update admin password

## Environment Variables Required

```env
DATABASE_URL=your_neon_database_connection_string
```

## Troubleshooting

### If seeding fails:
1. Check your `DATABASE_URL` is correct
2. Ensure the admin table exists (run migration first)
3. Verify database connectivity
4. Check console output for specific error messages

### If login fails:
1. Ensure the admin user was seeded successfully
2. Check that `active = true` in the database
3. Verify the correct username and password
4. Check browser console for authentication errors

## Next Steps

After setting up the admin user, you may want to:

1. Update the auth context to use the new database-based authentication
2. Implement proper session management
3. Add role-based permissions
4. Create additional admin users if needed

## Security Recommendations

1. Change the default password after first login
2. Use environment variables for sensitive credentials
3. Implement proper session timeout
4. Add 2FA for enhanced security
5. Regular password rotation policy