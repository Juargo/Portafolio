import { describe, expect, it } from 'vitest';
import { mailtoHref } from './index';

describe('mailtoHref', () => {
  it('prefills subject and body in each language', () => {
    expect(mailtoHref('es')).toBe(
      'mailto:jorgeretamalaburto@gmail.com?subject=Proyecto%20freelance&body=Hola%20Jorge%2C%0A%0A',
    );
    expect(mailtoHref('en')).toBe(
      'mailto:jorgeretamalaburto@gmail.com?subject=Freelance%20project&body=Hi%20Jorge%2C%0A%0A',
    );
  });

  it('encodes spaces as %20, not +, so mail clients show them as spaces', () => {
    expect(mailtoHref('es')).not.toContain('+');
  });
});
