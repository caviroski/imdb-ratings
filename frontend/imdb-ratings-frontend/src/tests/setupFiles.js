// test/setupFiles.js
import { TextEncoder, TextDecoder } from 'text-encoding';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}
