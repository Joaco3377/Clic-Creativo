# Click Creativo — Landing

Sitio hecho con **Vite + React**. El formulario de contacto abre WhatsApp
directamente (no necesita backend).

---

## 1. Probarlo en tu compu (opcional)

Necesitás tener [Node.js](https://nodejs.org) instalado. Después, en una terminal
dentro de esta carpeta:

```bash
npm install      # solo la primera vez
npm run dev      # levanta el sitio en http://localhost:5173
```

Cuando cambiás algo, se actualiza solo en el navegador.

---

## 2. Subirlo a GitHub y publicarlo en Vercel

### Paso A — Crear el repo en GitHub
1. Entrá a [github.com](https://github.com) y creá una cuenta (si no tenés).
2. Botón **New** (o el `+` arriba a la derecha → *New repository*).
3. Ponele un nombre, ej. `click-creativo`. Dejalo en **Public** o **Private**, da igual.
4. **No** marques ninguna opción de "Add README" (ya tiene uno).
5. Create repository.

### Paso B — Subir estos archivos
La forma más fácil sin usar la terminal:
1. En la página del repo recién creado, clic en **uploading an existing file**.
2. Arrastrá **todos los archivos y carpetas de este proyecto** (menos `node_modules`
   y `dist`, que no van — el `.gitignore` ya los ignora).
3. Abajo, **Commit changes**.

### Paso C — Conectar Vercel
1. Entrá a [vercel.com](https://vercel.com) y creá la cuenta con **"Continue with GitHub"**.
2. **Add New → Project**.
3. Elegí el repo `click-creativo` de la lista → **Import**.
4. Vercel detecta solo que es Vite. No toques nada → **Deploy**.
5. En ~1 minuto tenés el sitio online con una URL tipo `click-creativo.vercel.app`.

Listo. **Cada vez que cambies algo en GitHub, Vercel republica solo.**

---

## 3. Cómo actualizar imágenes y textos después

Todo lo editable está en **`src/App.jsx`**. Arriba del archivo hay listas fáciles de tocar.

### Cambiar textos
Buscá la lista que corresponda y editá el texto entre comillas:
- `SERVICES` → los 8 servicios (título y descripción)
- `VALORES` → los valores
- `CLIENTS` → nombres de las marcas
- `TESTIMONIALS` → los testimonios
- `STATS` → los números (años, marcas, etc.)
- `FOUNDERS` → nombres y roles de las fundadoras

### Cambiar el número de WhatsApp
Está arriba de todo, en la línea:
```js
const WHATSAPP = "5492646608412";
```

### Cargar imágenes reales
1. Poné las imágenes dentro de la carpeta **`public/`** (ej. `public/candela.jpg`).
2. En `App.jsx`, donde ahora hay un texto placeholder, se referencia con `/nombre.jpg`.
   Por ejemplo, para las fundadoras, cambiar el placeholder por una imagen real:
   ```jsx
   <img src="/candela.jpg" alt="Candela Coll" style={{ width: 120, height: 120, borderRadius: 999, objectFit: "cover" }} />
   ```

> Si algo de esto te traba, pasámelo y te digo exactamente qué línea cambiar.

---

## 4. Conectar tu dominio (Cloudflare u otro)

En Vercel: **Project → Settings → Domains → Add**. Vercel te muestra los registros
DNS que tenés que cargar en Cloudflare (son 2 o 3). Se hace una sola vez.
