# ADR 0002 — Calcular el avance de proyectos al compilar

- **Estado:** Aceptada
- **Fecha:** 2026-10-12

## Contexto

La Reunión 006 decidió mostrar una barra de progreso por proyecto. El porcentaje es la proporción de issues cerrados sobre el total de un milestone de GitHub, declarado en el frontmatter de cada proyecto (`repo` y `milestone`).

El sitio es estático (Astro + Vercel) y el MVP no tiene backend (Reunión 002). Falta decidir en qué momento se consulta la API de GitHub.

## Decisión

El porcentaje se obtiene **durante el build**, y el HTML publicado ya incluye el valor. Para que el dato no envejezca, un **workflow programado de GitHub Actions** llama una vez al día al **deploy hook** de Vercel, que recompila el sitio.

## Motivos

- **El sitio sigue siendo estático.** No se agrega una función serverless ni JavaScript en el cliente.
- **Sin límite de peticiones a la vista.** La API de GitHub sin autenticar permite 60 peticiones por hora por IP. Si se consultara desde el navegador, cada visitante gastaría su propio cupo. En el build se consulta una sola vez por proyecto.
- **Sin saltos ni huecos.** Una consulta en el cliente hace aparecer la barra después de cargar la página, y deja un hueco si GitHub falla. Al compilar, la barra llega lista en el HTML.
- **Rendimiento.** Menos JavaScript y ningún request extra ayudan a la meta de Lighthouse ≥ 90 (P-10).

## Alternativas descartadas

- **Consultar en cada visita desde el navegador:** solo sirve para repositorios públicos sin token y queda expuesta al límite por IP, al salto visual y a los fallos de GitHub.
- **Función serverless en Vercel:** daría datos frescos y permitiría usar un token, pero suma backend al MVP y no se justifica por un dato que cambia pocas veces al día.

## Consecuencias

- El porcentaje puede tener **hasta un día de atraso**. Para acelerarlo, se puede disparar el workflow a mano.
- El deploy hook de Vercel se guarda como **secreto del repositorio** en GitHub, nunca en el código.
- Si la API de GitHub falla durante el build, el build **no debe romperse**: el proyecto se publica sin barra y muestra su `estado`.
- Los repositorios consultados deben ser públicos. Si en el futuro hace falta uno privado, se agrega un token de solo lectura como variable de entorno del build, sin cambiar esta decisión.
- El esquema de `proyectos` en `src/content.config.ts` suma un campo opcional `milestone`.
