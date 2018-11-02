# Directory statistics

Directory statistics calculation utility

## Calculate statistics

```shell
python dir-stats.py path/to/dir > treemap/dir-stats.json
```

## Display statistics on a Tree Map

To display statistics on an interactive Tree Map,
run a web server like `http-server` in [`treemap`](treemap/) directory
and open a [browser window](http://127.0.0.1:8080).

```shell
http-server treemap/
```

## Resources

- [D3plus](http://d3plus.org)
- [Vue.js](https://vuejs.org)
- [http-server](https://www.npmjs.com/package/http-server)
