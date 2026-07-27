# BatSlop

## ¿Y ahora qué?

BatSlop es una pequeña extensión de navegador que tiene como objetivo solucionar los problemas de visualización actuales en muchos subreddits donde las publicaciones que deberían informarte sobre algún proyecto de IA muestran incorrectamente "I made" (lo hice) o "I programmed" (lo programé) cuando deberían decir "AI made..." (la IA hizo...) y "AI programmed...". Nada más, nada menos. Disfrútalo.

## Configuración

Por defecto, BatSlop solo procesa publicaciones de los subreddits objetivo configurados. Esto también se aplica en la página de inicio de Reddit, `r/all` y `r/popular`: las publicaciones de los subreddits objetivo se alteran, mientras que las de otros subreddits se dejan intactas.

La ventana emergente incluye un interruptor opcional de **All of Reddit**. Cuando está activado, los títulos y vistas previas de las publicaciones que coincidan pueden alterarse en todo Reddit, independientemente del subreddit.

## Instalación

### Firefox

Instala BatSlop desde la tienda oficial de complementos de Firefox:

<https://addons.mozilla.org/en-US/firefox/addon/batslop/>

Este es el método de instalación recomendado para Firefox porque la extensión está firmada y permanece instalada normalmente.

### Chrome / Edge / Brave

Instala BatSlop desde la Chrome Web Store:

<https://chromewebstore.google.com/detail/batslop/cagjmdmmekfkonhkljnpcmnelbihncco>

### Desarrollo / Pruebas

#### Cargar desde el código fuente

1. Descarga o clona este repositorio.
2. Abre la página de depuración de extensiones de tu navegador:
   - Chrome / Edge / Brave: `chrome://extensions`, `edge://extensions`, o `brave://extensions`
   - Firefox: `about:debugging#/runtime/this-firefox`
3. Carga la carpeta del repositorio como una extensión no empaquetada en los navegadores de la familia Chrome, o selecciona `manifest.json` como un complemento temporal en Firefox.

#### Paquete de lanzamiento para la familia Chrome

Los lanzamientos de GitHub también incluyen un archivo para la familia Chrome para pruebas manuales:

- `BatSlop-<version>-chrome.zip`

1. Descarga `BatSlop-<version>-chrome.zip` desde los artefactos del lanzamiento.
2. Extrae el archivo ZIP.
3. Abre `chrome://extensions` (o `edge://extensions`, `brave://extensions`).
4. Activa el **Modo de desarrollador**.
5. Haz clic en **Cargar descomprimida** y selecciona la carpeta de la extensión extraída.

#### Paquete de Firefox no firmado

Los lanzamientos de GitHub también incluyen un paquete de Firefox no firmado para pruebas:

- `BatSlop-<version>-firefox-unsigned.xpi`

1. Descarga `BatSlop-<version>-firefox-unsigned.xpi` desde los artefactos del lanzamiento.
2. Abre `about:debugging#/runtime/this-firefox`.
3. Haz clic en **Cargar complemento temporal**.
4. Selecciona el archivo `.xpi`.

> **Nota:** El archivo `.xpi` de GitHub no está firmado y está destinado únicamente a pruebas temporales. Los usuarios de Firefox deben instalar la versión firmada desde la tienda de complementos de Firefox.
