# Repositorio de mi web personal

## URL: [https://camilosalinas.com/](https://camilosalinas.com/)

Tambien se puede usar

### URL: [https://camilosalinas.me/](https://camilosalinas.me/)

He aquí mi pequeño (que se torno en gran) experimento probando tecnologías de distintos tipos y cruzando por incontables campos del front-end. mi pagina web personal es mas que eso, una web personal, es un proyecto el cual me ha ayudado a crecer y aprender distintas cosas que hoy actualmente hacen que me apasione del mundo de la web y el front-end.

Previamente (Y como se puede observar en la rama "holdingOld") tenía un repositorio con un frontend en Angular, algunos subdominios estaticos y otras cosas.
Ahora he re hecho mi página web con mis nuevos conocimientos y con el ánimo de poner en práctica mis habilidades con nuevas técnologias y computación visual.

En especial utilicé tecnologías web cómo:

- WebGl por medio de ThreeJS
- Animaciones avanzadas con el uso de GSAP
- Uso del WebAudioAPI para analizar música
- Eventos para realizar animaciones basadas en el movimiento del ratón

La página está compuesta por 8 secciones:

1. El banner inicial interactivo con mi nombre y fotos en el background que se mueven con el ratón
2. Una sección con una breve descripción de quién soy y que hago
3. Una sección de articulos con mis proyectos destacados
4. Una Galería con mis experiencias y premios
5. Una sección interactiva dónde tener una experiencia visual y auditiva con mis canciones favoritas
6. Una galería donde se muestran mis hobbies
7. Una sección donde se muestra mi experiencia acádemica
8. El footer con mi información de contacto

Cosas por hacer:

- Mantener las imágenes optimizadas y revisar los presupuestos de rendimiento al agregar contenido (ver `PERFORMANCE.md`).
- Investigar como evitar que Three JS en la sección de canciones no haga e.preventDefault(), Causando errores en la consola al hacer scroll sobre esta sección
- Refinar el contenido
- Editar los audios de la experiencia visual para que estos no tengan las intros de los videos de donde salieron (o quizá conectarlos directamente al API de spotify)
- Poder mutear las canciones una vez desplegadas JAJAJAJAJA

La arquitectura del sitio esta hecha de tal manera:

- Dominio proveido por Namecheap
- DNS servidos por CloudFlare
- El Sitio esta siendo servido por Netlify
- Tambien está siendo continuamente desplegado por Netlify cada vez que hay un push sobre la rama master
- El codigo está en github

[![Netlify Status](https://api.netlify.com/api/v1/badges/ed034a0f-e8ce-457e-8fe1-aa412317864e/deploy-status)](https://app.netlify.com/sites/thirsty-chandrasekhar-200788/deploys)

## Performance tooling

The site remains static HTML/CSS/JavaScript. Optimized images and vendor files are committed; deployment does not require a build step. See [PERFORMANCE.md](PERFORMANCE.md) for measurements and verification.

With Node.js 20.19+ installed:

```sh
npm ci
npm run images:generate
npx playwright install chromium
npm test
```

`images:generate` preserves the originals, regenerates content-hashed WebP variants from `scripts/image-sources.json`, and updates existing image references and dimensions in `index.html`. Add new images to that list and use their URLs from `scripts/image-manifest.json`. Commit the generated assets, manifest, and HTML together. Old generated files can be removed after confirming they have no references. Animated variants are capped at 640 pixels wide to avoid increasing their download size.

Alternatively, set `CHROME_PATH` to an installed Chrome executable when running tests. Set `PERFORMANCE_SCREENSHOTS` to a directory to save desktop/mobile screenshots. The tests start and stop their own local server.
