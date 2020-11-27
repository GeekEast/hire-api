```sh
nest g controller coffee
nest g controller coffee --no-spec # no testing
nest g controller coffee coffees/abc # genereate abc.controller.ts in src/coffees/abs/
nest g controller modules/abc --dry-run # won't generate controllers but will give you docs
```


- there is no way in `Nest.js` to list all routes like `rails routes` in ROR.



- if you simply `throw 'A random Errr'`, it will give a 500 internal server error to the client.

- generate dto to declare type on received body
```javascript
// don't have to add .ts
nest g class coffees/dto/create-coffee.dto --no-spec
```

### DTO
- type-safe with shape definition
- still need validation added using decorators

### Validation
- failed validation will return status code as `Bad Request: 400` with message.
- `whitelist`: will strip out all unwanted attributes from `body`.
- `forbidNonWhitelisted`: will throw an error is any unwanted params are passed in `body`.


### Docker Compose
```sh
# run the docker containers in detached mode (in the background);
docker-compose up -d
```

### Entity
- represent a relationship between typescript class and a database table.
```
nest g class coffees/entities/flavor.entity --no-spec
```

### Repository Pattern
- used manipulate the database


### Cascading Insert and Updates