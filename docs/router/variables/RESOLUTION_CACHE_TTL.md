[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [router](../README.md) / RESOLUTION\_CACHE\_TTL

# Variable: RESOLUTION\_CACHE\_TTL

> **RESOLUTION\_CACHE\_TTL**: `number`

Time‑to‑live (TTL) for cache entries, in milliseconds.  After this duration
a stored resolution will be treated as if it does not exist, triggering a
fresh lookup.  Setting to a non‑positive number disables expiration.
This value is exported as a `let` so that callers (such as `initCMS`) can
override it dynamically if they need a different cache lifetime.
