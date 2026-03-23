[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / utils/debug

# utils/debug

Centralized debug helper for nimbi-cms.

Provides a runtime gate for console messages and an internal
counter store useful for lightweight instrumentation in tests.
Call `setDebugLevel(level)` during initialization to control verbosity.

Debug levels:
 - 0: disabled
 - 1: errors only
 - 2: errors and warnings
 - 3: all messages (info/log)

Usage example:
```js
import { setDebugLevel, debugWarn } from './utils/debug.js'
setDebugLevel(2)
debugWarn('something notable')
```

## See

./init.js

## Variables

- [default](variables/default.md)

## Functions

- [debugError](functions/debugError.md)
- [debugInfo](functions/debugInfo.md)
- [debugLog](functions/debugLog.md)
- [debugWarn](functions/debugWarn.md)
- [getDebugCounters](functions/getDebugCounters.md)
- [getDebugLevel](functions/getDebugLevel.md)
- [hasLegacyDebug](functions/hasLegacyDebug.md)
- [incrementCounter](functions/incrementCounter.md)
- [isDebug](functions/isDebug.md)
- [isDebugLevel](functions/isDebugLevel.md)
- [resetDebugCounters](functions/resetDebugCounters.md)
- [setDebugLevel](functions/setDebugLevel.md)
- [syncLegacyCounter](functions/syncLegacyCounter.md)
