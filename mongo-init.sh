mongo --eval "db = db.getSiblingDB('$MONGODB_DBNAME'); db.createUser({ user: '$MONGODB_USERNAME', pwd: '$MONGODB_PASSWORD', roles: [{ role: 'readWrite', db: '$MONGODB_DBNAME' }] });"
