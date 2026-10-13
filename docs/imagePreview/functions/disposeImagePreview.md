[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [imagePreview](../README.md) / disposeImagePreview

# Function: disposeImagePreview()

> **disposeImagePreview**(): `void`

Close and release the shared preview modal.

`_createModal` already drops its reference when the modal leaves the
document, so this is mostly explicit teardown for symmetry with the other
module singletons — but it also closes an open dialog, which otherwise
stays visible after the mount element is removed.

## Returns

`void`
