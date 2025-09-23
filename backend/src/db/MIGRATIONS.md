# Database Migrations

## Migration History

- **001_users.sql** - User authentication system
- **002** - Reserved for email verification (not implemented yet)
- **003_nightclub_schema.sql** - Events, bookings, gallery, admin users

## Running Migrations

```bash
# Run all migrations
node setup-nightclub-db.js

# Or run individual migrations with psql
psql $DB_URL -f src/db/migrations/001_users.sql
psql $DB_URL -f src/db/migrations/003_nightclub_schema.sql
```

## Notes

- Migration 002 was reserved for email verification but postponed
- When implementing email verification, use migration 004 or later
- Gaps in migration numbers are normal and acceptable