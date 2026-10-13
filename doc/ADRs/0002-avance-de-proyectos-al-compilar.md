# ADR 0002 — Calcular el avance de proyectos al compilar

- **Estado:** Aceptada
- **Fecha:** 2026-10-12

## Contexto

La Reunión 006 decidió mostrar una barra de progreso por proyecto. El porcentaje es la proporción de issues cerrados sobre el total de un milestone de GitHub, declarado en el frontmatter de cada proyecto (`repo` y `milestone`).

El sitio es estático (Astro + Vercel) y el MVP no tiene backend (Reunión 002). Falta decidir en qué momento se consulta la API de GitHub.

## Decisión

El porcentaje se obtiene **durante el build**, y el HTML publicado ya incluye el valor. Para que el dato no envejezca, un **workflow programado de GitHub Actions** llama una vez al día al **deploy hook** de Vercel, que recompila el sitio.

El build consulta la API de GitHub **autenticado con un token de solo lectura**, aunque los repositorios sean públicos.

## Motivos

- **El sitio sigue siendo estático.** No se agrega una función serverless ni JavaScript en el cliente.
- **Un cupo de peticiones propio.** La API de GitHub sin autenticar permite 60 peticiones por hora por IP. Si se consultara desde el navegador, cada visitante gastaría su propio cupo. En el build se consulta una sola vez por proyecto, pero las máquinas de build de Vercel pueden compartir IP con otros proyectos y agotar ese cupo por causas ajenas. Con token, el límite es de 5.000 peticiones por hora y pertenece a la cuenta, no a la IP.
- **Sin saltos ni huecos.** Una consulta en el cliente hace aparecer la barra después de cargar la página, y deja un hueco si GitHub falla. Al compilar, la barra llega lista en el HTML.
- **Rendimiento.** Menos JavaScript y ningún request extra ayudan a la meta de Lighthouse ≥ 90 (P-10).

## Alternativas descartadas

- **Consultar en cada visita desde el navegador:** solo sirve para repositorios públicos sin token y queda expuesta al límite por IP, al salto visual y a los fallos de GitHub.
- **Función serverless en Vercel:** daría datos frescos y permitiría usar un token, pero suma backend al MVP y no se justifica por un dato que cambia pocas veces al día.

## Consecuencias

- El porcentaje puede tener **hasta un día de atraso**. Para acelerarlo, se puede disparar el workflow a mano.
- El deploy hook de Vercel se guarda como **secreto del repositorio** en GitHub, nunca en el código.
- El token es un **fine-grained token de solo lectura** (permiso de lectura de issues y metadatos). Se guarda como variable de entorno del build en Vercel, en Production y Preview, nunca en el código. Si falta, el build no se rompe: consulta sin autenticar y queda expuesto al límite por IP.
- Los repositorios consultados deben ser públicos. Si en el futuro hace falta uno privado, basta con darle acceso al mismo token, sin cambiar esta decisión.
- El build **nunca se rompe** por el avance de un proyecto. En todos estos casos el proyecto se publica sin barra y muestra su `estado`:
  - la API de GitHub falla, no responde o devuelve un límite agotado;
  - el repositorio no existe o devuelve 404;
  - el milestone declarado no existe en el repositorio;
  - el milestone no tiene issues (total cero, el porcentaje no está definido).
- El caso en que el milestone tiene issues y todos están cerrados muestra la barra al 100 %.
- El esquema de `proyectos` en `src/content.config.ts` suma un campo opcional `milestone`.
