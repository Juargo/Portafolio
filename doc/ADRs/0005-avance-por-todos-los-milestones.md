# ADR 0005 — Mostrar el avance de todos los milestones del repositorio

- **Estado:** Aceptada
- **Fecha:** 2026-10-13
- **Reemplaza en parte a:** ADR 0002 (solo la regla de "un milestone explícito por proyecto"; el cálculo al compilar, el token, el cron y los casos sin barra siguen vigentes).

## Contexto

La Reunión 006 y el ADR 0002 definieron que cada proyecto mide su avance con **un** milestone, declarado a mano en el campo `milestone` del frontmatter. Se descartó sumar todos los milestones porque el porcentaje bajaría cada vez que se abre uno nuevo.

En la Reunión 010, Jorge decide trabajar cada proyecto por varios milestones y que el portafolio calcule el avance de todos, sin tener que editar el `.md` cada vez que cambia de milestone.

## Decisión

La tarjeta de cada proyecto muestra **una barra por milestone** del repositorio, abiertos y cerrados, con su porcentaje (issues cerrados / total). No se suman entre sí, así que abrir un milestone nuevo no baja el avance de los demás.

- Se lee la misma respuesta de la API que antes: `GET /repos/{owner}/{repo}/milestones?state=all&per_page=100`.
- **Orden:** por fecha límite; los que no tienen fecha van al final, en orden de creación.
- Cada barra muestra el título del milestone y, si corresponde, "cerrado" o "vence {fecha}".
- Un milestone **sin issues** se omite (su porcentaje no está definido). Uno con datos incompletos también se omite, con un aviso en el build.
- El campo `milestone` del esquema de `proyectos` se elimina: alcanza con `repo`.

## Consecuencias

- Si el repositorio no tiene ningún milestone con issues, o la API falla, el proyecto se muestra sin barras y con su `estado`, como en el ADR 0002.
- **La tarjeta crece con cada milestone.** Con muchos (más de 6 u 8), conviene cerrar y archivar los viejos, o revisar esta decisión para limitar cuántos se muestran.
- Se leen hasta 100 milestones por repositorio (una sola página de la API).
