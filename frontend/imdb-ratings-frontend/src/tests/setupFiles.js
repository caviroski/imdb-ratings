// test/setupFiles.js
import { TextEncoder, TextDecoder } from 'text-encoding';
import 'jest-localstorage-mock';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
