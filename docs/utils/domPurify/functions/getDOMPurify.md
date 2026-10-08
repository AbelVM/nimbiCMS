[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/domPurify](../README.md) / getDOMPurify

# Function: getDOMPurify()

> **getDOMPurify**(): `any`

Get the DOMPurify sanitize function, creating it on first call.

DOMPurify v3 returns the sanitize function directly from `DOMPurify(window)`
in supported environments. In unsupported environments (e.g., test
environments without a real DOM), it may return the factory function itself
with a `.sanitize` method. This wrapper normalizes the return value so
callers can always use the result as a sanitize function.

## Returns

`any`
