[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / utils/debug

# utils/debug

Centralized debug helper for nimbi-cms. Backed by PowerLogger from
performance-helpers for level management and counter instrumentation.

Debug levels:
 - 0: disabled
 - 1: errors only
 - 2: errors and warnings
 - 3: all messages (info/log)

## See

./init.js

## Variables

- [\_logger](variables/logger.md)
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
