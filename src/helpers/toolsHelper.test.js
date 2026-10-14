import { describe,it,expect,vi } from 'vitest';
import { isValidEmail,getInitials,formatDate,unwrapData,showErrorDialog,showSuccessDialog,confirmDialog } from './toolsHelper.js';
vi.mock('sweetalert2',()=>({default:{fire:vi.fn(async()=>({isConfirmed:true}))}}));
import Swal from 'sweetalert2';
describe('toolsHelper',()=>{
 it('validates email',()=>{expect(isValidEmail('a@b.com')).toBe(true);expect(isValidEmail('nope')).toBe(false);expect(isValidEmail('')).toBe(false)});
 it('creates initials',()=>{expect(getInitials('Karina Putri Sion')).toBe('KP');expect(getInitials('  delcom ')).toBe('D');expect(getInitials('')).toBe('')});
 it('formats dates and handles invalid values',()=>{expect(formatDate('')).toBe('-');expect(formatDate('not-date')).toBe('-');expect(formatDate('2025-01-01')).not.toBe('-')});
 it('unwraps API data with fallback',()=>{expect(unwrapData({data:{x:3}},'x')).toBe(3);expect(unwrapData({},'x',[])).toEqual([])});
 it('shows error and success dialogs',async()=>{await showErrorDialog('oops');await showSuccessDialog('ok');expect(Swal.fire).toHaveBeenCalledTimes(2)});
 it('returns confirmation result',async()=>{expect(await confirmDialog('continue?')).toBe(true);Swal.fire.mockResolvedValueOnce({isConfirmed:false});expect(await confirmDialog('stop?')).toBe(false)});
});
