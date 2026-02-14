Crystal WASM prime demo.

Local build:

```
CRYSTAL_LIBRARY_PATH="$PWD/wasm32-wasi-libs" crystal build prime.cr -o web/prime.wasm --target wasm32-wasi
```

Serve:

```
python -m http.server 8000
```

WASM libs:
https://github.com/kojix2/wasm-libs (v0.0.4 wasm32-wasi-libs.tar.gz)
