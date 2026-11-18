import { describe, expect, it } from 'vitest';
import { mailtoHref, whatsappHref } from './index';

describe('mailtoHref', () => {
  it('prefills subject and body in each language', () => {
    expect(mailtoHref('es')).toBe(
      'mailto:jorgeretamalaburto@gmail.com?subject=Consulta%20por%20servicio&body=Hola%20Jorge%2C%0A%0A',
    );
    expect(mailtoHref('en')).toBe(
      'mailto:jorgeretamalaburto@gmail.com?subject=Service%20inquiry&body=Hi%20Jorge%2C%0A%0A',
    );
  });

  it('encodes spaces as %20, not +, so mail clients show them as spaces', () => {
    expect(mailtoHref('es')).not.toContain('+');
  });
});

describe('whatsappHref', () => {
  it('opens a chat with the site number and a prefilled message', () => {
    expect(whatsappHref('es')).toBe(
      'https://wa.me/56945581138?text=Hola%20Jorge%2C%20vi%20tu%20p%C3%A1gina%20y%20necesito%20ayuda%20con%20',
    );
    expect(whatsappHref('en')).toMatch(/^https:\/\/wa\.me\/56945581138\?text=Hi%20Jorge/);
  });
});
