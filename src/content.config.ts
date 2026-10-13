import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Contenido separado del código: editas tu portafolio como notas.
 * Un archivo por idioma, en subcarpetas `es/` y `en/`.
 */

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z.object({
    titulo: z.string(),
    estado: z.enum(['idea', 'diseno', 'desarrollo', 'publicado']),
    nota: z.string().optional(), // ej. "meta 28 oct"
    descripcion: z.string(),
    stack: z.array(z.string()).default([]),
    enlace: z.string().url().optional(),
    repo: z.string().url().optional(),
    // Título del milestone de GitHub que mide el avance (Reunión 006).
    milestone: z.string().optional(),
    orden: z.number().default(99),
  }),
});

const trayectoria = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trayectoria' }),
  schema: z.object({
    cargo: z.string(),
    periodo: z.string(),
    desde: z.number(), // para ordenar
    descripcion: z.string(),
    capas: z.array(z.string()).default([]),
  }),
});

const skills = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/skills' }),
  schema: z.object({
    nombre: z.string(),
    categoria: z.string(),
    // Niveles postergados (decisión Reunión 003): quedan opcionales.
    nivelActual: z.number().min(1).max(5).optional(),
    nivelMeta: z.number().min(1).max(5).optional(),
    evidencia: z.array(z.string()).default([]),
    orden: z.number().default(99),
  }),
});

export const collections = { proyectos, trayectoria, skills };
