const out = document.getElementById("output");

fetch("./prime.wasm")
  .then((res) => res.arrayBuffer())
  .then((bytes) => WebAssembly.compile(bytes))
  .then((module) => WebAssembly.instantiate(module, stubImports(module)))
  .then((instance) => {
    const nextPrime = instance.exports.next_prime;
    if (typeof nextPrime !== "function") {
      throw new Error("Exported function 'next_prime' not found.");
    }

    const maxValue = 2_000_000;
    const primes = [];
    while (true) {
      const p = nextPrime();
      if (p === 0 || p > maxValue) {
        break;
      }
      primes.push(p);
    }

    out.textContent = primes.join(" ");
  })
  .catch((e) => out.textContent = e.message);

function stubImports(module) {
  const imports = {};
  for (const { module: mod, name, kind } of WebAssembly.Module.imports(module)) {
    const target = (imports[mod] ??= {});
    if (kind === "function") {
      target[name] = mod === "wasi_snapshot_preview1" && name === "proc_exit"
        ? (code) => { throw new Error(`WASI proc_exit(${code}) called`); }
        : () => 0;
    } else if (kind === "memory") {
      target[name] = new WebAssembly.Memory({ initial: 1 });
    } else if (kind === "table") {
      target[name] = new WebAssembly.Table({ initial: 0, element: "funcref" });
    } else {
      target[name] = 0;
    }
  }
  return imports;
}
