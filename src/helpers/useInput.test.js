import { describe,it,expect } from 'vitest';
import { useInput } from './useInput.js';
describe('useInput',()=>{it('tracks value and resets errors',()=>{const input=useInput('initial');expect(input.value).toBe('initial');input.value='changed';input.error='invalid';expect(input.value).toBe('changed');expect(input.error).toBe('invalid');input.reset();expect(input.value).toBe('initial');expect(input.error).toBe('')})});
