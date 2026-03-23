[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / slugResolvers

# Variable: slugResolvers

> `const` **slugResolvers**: `Set`\<`Function`\>

Set of custom slug resolver functions.
Each resolver is a function `(slug, contentBase)` that may return a
markdown path string or a Promise resolving to a string, or `null` if
the slug cannot be resolved.
