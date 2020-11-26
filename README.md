```sh
nest g controller coffee
nest g controller coffee --no-spec # no testing
nest g controller coffee coffees/abc # genereate abc.controller.ts in src/coffees/abs/
nest g controller modules/abc --dry-run # won't generate controllers but will give you docs
```


- there is no way in `Nest.js` to list all routes like `rails routes` in ROR.