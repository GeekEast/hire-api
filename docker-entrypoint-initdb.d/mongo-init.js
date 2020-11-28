print(
  'Start #################################################################',
);

db = db.getSiblingDB('api_dev_db');
db.createUser({
  user: 'api_user',
  pwd: 'api1234',
  roles: [{ role: 'readWrite', db: 'api_dev_db' }],
});

print('END #################################################################');
