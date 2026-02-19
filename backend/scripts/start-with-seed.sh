#!/bin/sh
set -e

# Run seed script if RUN_SEED environment variable is true
if [ "$RUN_SEED" = "true" ]; then
    echo "🌱 RUN_SEED is set to true. Executing seed script..."
    npm run seed
else
    echo "ℹ️ RUN_SEED is not set to true. Skipping seed script."
fi

# Execute the command passed to this script (default command from CMD in Dockerfile)
exec "$@"
