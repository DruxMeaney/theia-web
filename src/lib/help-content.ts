export const HELP_TOPICS: { id: string; title: string; content: string }[] = [
  {
    id: "bienvenida",
    title: "Bienvenida y filosofía de trabajo",
    content: `# Bienvenida y filosofía de trabajo

Este etiquetador está pensado para **trabajo clínico-técnico**: rapidez sin perder trazabilidad.

## Principios
- **Carpeta = universo**: eliges una carpeta raíz y todo cuelga de ahí.
- **Rutas relativas**: las imágenes se identifican por su ruta relativa desde la carpeta raíz.
- **Anotaciones normalizadas**: las cajas se guardan en coordenadas 0–1 para ser independientes del tamaño.
- **Guardar proyecto ≠ exportar**:
  - *Guardar proyecto* = tu "fuente de verdad" (JSONL del proyecto).
  - *Exportar* = generar formatos para entrenamiento/uso externo (COCO/YOLO/MONAI/JSONL alterno).

## Una regla de oro
Si trabajas en equipo: definan **criterio** antes de etiquetar en volumen
(ver "Criterios de etiquetado" y "Control de calidad").`,
  },
  {
    id: "guia_rapida",
    title: "Guía rápida (flujo recomendado)",
    content: `# Guía rápida (flujo recomendado)

1) **Archivo → Cargar carpeta…**
   Selecciona la carpeta raíz donde están las imágenes.

2) **Cargar etiquetas**
   - Si existe \`labels.json\` en esa carpeta, la app lo intenta usar.
   - Si no, usa **Archivo → Cargar etiquetas…**.

3) **Revisar una imagen**
   - Navega con **←/→** (o botones).
   - Usa **Zoom** y **PAN** si necesitas microdetalle.

4) **Etiquetar**
   - Activa **Etiquetar (E)**.
   - Arrastra para dibujar la caja.
   - Elige la clase/tipo en el modal.

5) **Corregir**
   - Activa **Seleccionar (V)**.
   - Ajusta posición/tamaño.

6) **Guardar proyecto**
   - **Archivo → Guardar** (JSONL).
   - Si es la primera vez: **Guardar como…**.

Consejo: si vas rápido, haz ciclos:
**Etiquetar → Siguiente imagen → Etiquetar → Guardar cada X minutos**.`,
  },
  {
    id: "tutorial_01_primer_proyecto",
    title: "Tutorial 1: primer proyecto (carpeta → etiquetas → guardar)",
    content: `# Tutorial 1: primer proyecto (carpeta → etiquetas → guardar)

Objetivo: terminar con un **JSONL de proyecto** guardado y reabrible.

## Paso a paso
1) **Carga la carpeta**
   - Archivo → Cargar carpeta…
   - Verifica que el Explorador (árbol) muestre tus subcarpetas/archivos.

2) **Carga \`labels.json\`**
   - Si no te lo pidió automáticamente:
     Archivo → Cargar etiquetas…
   - Confirma que al etiquetar te aparezcan las clases correctas.

3) **Etiqueta 3 imágenes de prueba**
   - E → dibuja 1–3 cajas por imagen.
   - Cambia imagen con →.

4) **Guarda**
   - Archivo → Guardar como…
   - Pon un nombre claro (ej. \`minerva_lote01.jsonl\`).

5) **Prueba que abre**
   - Archivo → Abrir JSONL…
   - Debes ver las cajas renderizadas.

## Señales de que todo va bien
- El contador del título cambia (ej. 12/340).
- La lista "Anotaciones" refleja lo que dibujaste.
- Al reabrir, las cajas caen en la imagen correcta.

## Si algo falla
Ve a "Emparejamiento de rutas" y "Solución de problemas".`,
  },
  {
    id: "tutorial_02_etiquetado_fluido",
    title: "Tutorial 2: etiquetado fluido (zoom/pan/editar sin perderte)",
    content: `# Tutorial 2: etiquetado fluido (zoom/pan/editar sin perderte)

Objetivo: etiquetar microdetalles rápido sin perder orientación.

## Rutina recomendada por imagen
1) **Zoom al detalle** (rueda del ratón).
2) **PAN** (P) para colocar el detalle al centro.
3) **Etiquetar** (E) → dibuja.
4) Si quedó chueca:
   - **Seleccionar** (V) → ajusta.
5) Vuelve a vista cómoda:
   - Reduce zoom un poco y continúa.

## Tips que ahorran tiempo
- Si estás corrigiendo mucho: baja un poco el zoom. El "pixel perfect" no siempre mejora el entrenamiento.
- Mantén un criterio estable de "cuánto fondo" dejas dentro de la caja (ver "Consistencia").
- Si un caso es dudoso, puedes:
  - Etiquetar como "Artefacto" (si tu esquema lo contempla), o
  - Dejarlo sin etiquetar y anotarlo en tu bitácora externa (o en la "Actividad").

## Errores típicos
- Dibujar cajas minúsculas por accidente: si se cancela, no es bug; es protección.
- Cambiar herramienta sin querer: revisa el resaltado del botón activo.`,
  },
  {
    id: "tutorial_03_importar_exportar",
    title: "Tutorial 3: importar y exportar (COCO/JSONL/YOLO/MONAI)",
    content: `# Tutorial 3: importar y exportar (COCO/JSONL/YOLO/MONAI)

Objetivo: entrar desde un formato y salir en otro sin perder clases.

## Caso A: COCO → trabajar → exportar JSONL
1) Carga carpeta de imágenes.
2) Archivo → Importar → COCO…
3) Revisa 2–3 imágenes (cajas y clases).
4) Corrige/añade.
5) Archivo → Guardar (proyecto JSONL).
6) Exporta: Archivo → Exportar → JSONL (Vertex)…

## Caso B: JSONL (Vertex) → revisar → exportar COCO
1) Carga carpeta.
2) Archivo → Importar → JSONL (Vertex)…
3) Revisa coincidencias.
4) Exporta: Archivo → Exportar → COCO…

## Caso C: Exportar MONAI (máscaras)
1) Guarda tu proyecto JSONL.
2) Exportar → MONAI (máscaras PNG)…
3) Verifica:
   - \`masks_png/\` lleno
   - \`dataset_monai.json\` con \`labels_map\` coherente.

## Recomendación clave
Primero decide tu **catálogo de clases** (labels.json).
Cambiar clases a mitad suele complicar entrenamientos y comparaciones.`,
  },
  {
    id: "interfaz",
    title: "Interfaz general",
    content: `# Interfaz general

## Menú superior
- **Archivo**: carpeta, etiquetas, proyectos, importar/exportar, opciones, salir.
- **Ayuda**: Centro de ayuda, Acerca de…

## Lateral izquierdo (tabs)
### Explorador
- Árbol de carpetas/archivos.
- "Actividad de la sesión": bitácora de acciones (útil para auditoría).

### Búsqueda
- Filtra por subcarpeta (primer nivel).
- Filtra por texto ("Contiene").
- Lista de resultados: clic para abrir una imagen.

## Columna de controles (botones verticales)
Atajos rápidos:
- Cargar carpeta / abrir JSONL / guardar JSONL
- Navegar carpetas e imágenes
- Herramientas: PAN, Ajustar, Reset, Etiquetar, Seleccionar, Borrar

## Visor
- Canvas: imagen + cajas.
- Abajo: lista "Anotaciones" de la imagen actual.`,
  },
  {
    id: "gestionar_archivos",
    title: "Estructura de carpetas y nombres (recomendaciones)",
    content: `# Estructura de carpetas y nombres (recomendaciones)

## Objetivo
Que tu proyecto sea estable: que al reabrir o exportar, todo empareje sin sorpresas.

## Recomendación de estructura
carpeta_raiz/
  estudio_001/
    img_0001.png
    img_0002.png
  estudio_002/
    img_0001.png
  labels.json
  (opcional) config.json
  (opcional) tu_proyecto.jsonl

## Reglas prácticas
- Evita renombrar archivos cuando ya hay anotaciones.
- Evita duplicar nombres idénticos en diferentes carpetas si luego mezclas datasets.
- Si trabajas por lotes: un JSONL por lote (más fácil de auditar y respaldar).

## DICOM
Si usas DICOM, idealmente mantén una carpeta por estudio/serie.`,
  },
  {
    id: "cargar_carpeta",
    title: "Cargar carpeta de imágenes",
    content: `# Cargar carpeta de imágenes

## ¿Qué hace?
Escanea recursivamente la carpeta y carga:
- \`.jpg\`, \`.jpeg\`, \`.png\`
- \`.dcm\`, \`.dicom\` (si tienes dependencias DICOM)

Las imágenes se indexan por **ruta relativa** desde la carpeta raíz.

## Pasos
1) Archivo → Cargar carpeta…
2) Elige la carpeta raíz.
3) La app:
   - Calcula tamaño de cada imagen.
   - Llena el Explorador.
   - Llena la lista de Búsqueda.
   - Abre la primera imagen (si existe).

## Consejos
- Si tu carpeta tiene miles de imágenes, el primer escaneo puede tardar un poco.
- Para lotes grandes, trabaja por subconjuntos (subcarpetas).`,
  },
  {
    id: "labels_tipos",
    title: "Etiquetas (labels.json) y tipos (config.json)",
    content: `# Etiquetas (labels.json) y tipos (config.json)

## labels.json (clases)
Es el catálogo de clases válidas para tus cajas. Ejemplos:
- Microcalcificación
- Lesión
- Artefacto

### Formatos aceptados
1) Diccionario:
{ "labels": ["Microcalcificación", "Lesión", "Artefacto"] }

2) Lista:
["Microcalcificación", "Lesión", "Artefacto"]

## config.json (tipos para el modal)
La app lee \`types\` desde:
1) \`config.json\` en la carpeta actual, o
2) \`assets/config.json\`, o
3) fallback interno.

Ejemplo:
{
  "types": ["Microcalcificación", "Lesión", "Artefacto"]
}

## Recomendación
Mantén \`labels.json\` y \`types\` alineados para evitar confusiones (mismas clases).`,
  },
  {
    id: "navegacion",
    title: "Navegación (imágenes y carpetas)",
    content: `# Navegación (imágenes y carpetas)

## Imagen anterior/siguiente
- Teclas: **← / →** (también **↑ / ↓**)
- Botones: flechas en la columna de controles

## Carpeta anterior/siguiente
- Botones de carpeta arriba/abajo (columna de controles).
Te llevan a la primera imagen de la carpeta anterior/siguiente según el orden actual.

## Sincronización
La app intenta mantener sincronizada la selección:
- Lista de Búsqueda
- Árbol del Explorador

## Filtros
Si aplicas filtros, la navegación se hace sobre el conjunto filtrado.`,
  },
  {
    id: "zoom_pan",
    title: "Zoom y desplazamiento (PAN)",
    content: `# Zoom y desplazamiento (PAN)

## Zoom
- Rueda del ratón: acerca/aleja respecto al puntero.
- Botón derecho + arrastrar vertical: zoom anclado al punto de inicio.

## PAN (mover vista)
- Herramienta **PAN** (P): arrastra con clic izquierdo.
- Botón central (si existe): también permite PAN.

## Tip
Cuando trabajas microcalcificaciones:
- Haz zoom al detalle
- PAN para centrar
- Etiqueta
- Baja un poco el zoom antes de pasar a la siguiente imagen (reduce fatiga visual).`,
  },
  {
    id: "brillo_contraste",
    title: "Brillo y contraste (Ajustar)",
    content: `# Brillo y contraste (Ajustar)

## Activar
- Tecla **C** o botón "Ajustar".

## Controles
- Arrastre **vertical**: brillo
- Arrastre **horizontal**: contraste
- Se muestra indicador visual (sol/contraste) según el eje dominante.

## Valor neutro
En este build, **1.0 = imagen original**:
- Brillo 1.0: sin cambio
- Contraste 1.0: sin cambio

## Reset
- Doble clic izquierdo en el canvas, o
- Botón "Reset"

## Recomendación clínica
Ajusta para ver mejor, pero evita "sobreprocesar" si eso cambia tu criterio de qué es una lesión.
El objetivo es consistencia, no "hacer que se vea bonito".`,
  },
  {
    id: "etiquetar",
    title: "Crear anotaciones (Etiquetar)",
    content: `# Crear anotaciones (Etiquetar)

## Activar
- Tecla **E** o botón "Etiquetar".

## Crear una caja
1) Clic izquierdo y arrastra.
2) Suelta.
3) Elige la clase en el modal.
4) La caja aparece en "Anotaciones".

## Guardado
- Coordenadas normalizadas (0–1).
- Nombre de clase en \`displayName\`.

## Buenas prácticas
- Cajas ajustadas, sin exceso de fondo.
- Si tienes duda, aplica tu criterio de equipo (ver "Consistencia").`,
  },
  {
    id: "seleccionar_editar",
    title: "Seleccionar / mover / redimensionar",
    content: `# Seleccionar / mover / redimensionar

## Activar
- Tecla **V** o botón "Seleccionar".

## Qué puedes hacer
- Mover caja (arrastrar).
- Redimensionar (arrastrar desde bordes/esquinas según el hit_test).

## Consejo
Cuando corrijas:
1) Ajusta tamaño
2) Ajusta posición
3) Revisa que la lista de anotaciones refleje el cambio
4) Guarda (si ya hiciste un bloque de correcciones)`,
  },
  {
    id: "eliminar",
    title: "Eliminar anotaciones",
    content: `# Eliminar anotaciones

## Desde la lista "Anotaciones"
1) Selecciona una anotación.
2) Presiona **Supr/Del** o usa el botón de borrar.
3) Confirma si aplica.

## Recomendación
Borra desde la lista para evitar eliminar la caja equivocada.`,
  },
  {
    id: "proyecto_jsonl",
    title: "Proyecto JSONL (nuevo, abrir, guardar, recientes)",
    content: `# Proyecto JSONL (nuevo, abrir, guardar, recientes)

El proyecto principal se guarda como **JSONL** (una línea por imagen).

## Nuevo JSONL
- Archivo → Nuevo JSONL
- Elige ruta/nombre
- Se genera un esqueleto según tus imágenes

## Abrir JSONL
- Archivo → Abrir JSONL…
- Importa cajas a las imágenes que emparejen por ruta/nombre

## Guardar / Guardar como
- Guardar: sobre el mismo archivo
- Guardar como: crea un archivo nuevo (útil para versiones)

## Recientes
- Archivo → Recientes
- Lista accesos rápidos a tus últimos proyectos

## Tip de versionado
Crea versiones por fecha:
- \`lote01_2026-01-20.jsonl\`
Así puedes regresar si algo se corrompe o si cambias criterio.`,
  },
  {
    id: "rutas_emparejamiento",
    title: "Emparejamiento de rutas (cómo encuentra la imagen correcta)",
    content: `# Emparejamiento de rutas (cómo encuentra la imagen correcta)

Al importar JSONL/COCO, la app intenta emparejar anotaciones con imágenes locales.

## Orden típico de emparejamiento
1) Por **sufijo de ruta** (si el JSONL trae \`gs://.../carpeta/archivo.png\`)
2) Si falla: por **nombre base** (\`archivo.png\`) buscando coincidencia exacta

## Qué puede salir mal
- Dos imágenes con el mismo nombre en carpetas distintas (colisión por nombre base).
- Cambiaste la estructura de carpetas después de etiquetar.

## Cómo evitarlo
- Nombres únicos o rutas estables.
- Mantener la misma carpeta raíz del proyecto.
- Evitar mover archivos entre subcarpetas una vez iniciado el etiquetado.`,
  },
  {
    id: "importar_exportar",
    title: "Importar / exportar (JSONL, COCO, YOLO)",
    content: `# Importar / exportar (JSONL, COCO, YOLO)

## Importar
- JSONL (Vertex): carga cajas desde un JSONL.
- COCO: importa desde COCO JSON.
- YOLO: depende de que el bloque de importación esté integrado en tu build.

## Exportar
- JSONL (Vertex): listo para Vertex AI.
- COCO: estándar de datasets.
- YOLO: \`.txt\` por imagen + \`classes.txt\` en \`yolo_labels/\`.
- MONAI: máscaras PNG + dataset_monai.json.

## Importante
Exportar **no siempre marca** que guardaste tu proyecto principal.
Tu "proyecto" es el JSONL de guardado.`,
  },
  {
    id: "exportar_vertex",
    title: "Exportar para Vertex AI (qué revisar antes de entrenar)",
    content: `# Exportar para Vertex AI (qué revisar antes de entrenar)

## ¿Qué produce?
JSONL con:
- \`imageGcsUri\`: se arma como \`gcs_prefix + / + ruta_relativa\`
- \`boundingBoxAnnotations\`: tus cajas
- \`dataItemResourceLabels\`: \`ml_use\` si lo definiste

## Checklist antes de subir a GCS
1) Tu carpeta local debe coincidir con cómo se verá en GCS (mismas rutas relativas).
2) \`gcs_prefix\` debe apuntar al lugar correcto (sin doble slash).
3) Revisa 5–10 líneas del JSONL:
   - ¿la ruta se ve bien?
   - ¿las cajas tienen 0–1?
   - ¿las clases están bien escritas?

## Consejo
Si vas a entrenar por particiones (entrenamiento/validación/prueba),
decide tu estrategia antes y sé consistente en \`ml_use\`.`,
  },
  {
    id: "exportar_monai",
    title: "Exportar máscaras para MONAI",
    content: `# Exportar para MONAI

Ahora tienes **dos salidas** desde el mismo asistente:

## A) Máscaras PNG (segmentación)
Genera:
- \`masks_png/\`: una máscara PNG por imagen
- \`dataset_monai.json\`: pares {image, label} + \`labels_map\`

Interpretación:
- 0 = fondo
- 1..N = clases

## B) BBoxes → Python (detección)
Genera:
- \`dataset_monai_det.py\` (o el nombre que elijas) con:
  - \`DATA\`: [{image, boxes, labels, width, height}, ...]
  - \`LABELS_MAP\`: {"Clase": id} con ids 0..N-1

Notas:
- \`boxes\` está en formato XYXY en píxeles.
- Puedes incluir imágenes sin anotaciones para negativos.

Buenas prácticas:
- Guarda tu proyecto JSONL antes de exportar.
- Verifica 1–2 imágenes al azar (coordenadas y clases).`,
  },
  {
    id: "dicom",
    title: "Archivos DICOM (si aplica)",
    content: `# Archivos DICOM (si aplica)

## Requisitos
Para abrir DICOM, la app intenta usar:
- \`pydicom\`
- \`numpy\`
- (opcional) \`apply_voi_lut\`

Si falla PixelData, a veces necesitas:
- \`pylibjpeg[all]\`
- \`gdcm\`

## Visualización
- Convierte el DICOM a RGB para mostrar.
- Si es MONOCHROME1, invierte intensidades.

## Consejo
Si tienes series muy pesadas, trabaja por series (subcarpetas) para evitar carga excesiva.`,
  },
  {
    id: "consistencia",
    title: "Criterios de etiquetado (consistencia entre personas)",
    content: `# Criterios de etiquetado (consistencia entre personas)

Si van 2+ personas, esto es lo que más impacta el entrenamiento.

## Qué definir antes
1) **Qué entra y qué no entra** (ej. "microcalcificación dudosa").
2) **Cuánta "margen" de fondo** se permite.
3) **Casos ambiguos**:
   - clase "Artefacto"
   - o no etiquetar y registrar.

## Reglas simples que ayudan
- Si el objeto está "cortado" por borde, etiqueta lo visible (consistente).
- Si hay agrupaciones, define si es:
  - varias cajas pequeñas, o
  - una caja grande que las contenga.

## Revisión por pares
Cada cierto número de imágenes:
- 1 persona etiqueta
- otra revisa 10–20 al azar
- ajustan criterio si hay deriva`,
  },
  {
    id: "control_calidad",
    title: "Control de calidad (revisión rápida y auditoría)",
    content: `# Control de calidad (revisión rápida y auditoría)

## Revisión rápida (10 minutos)
1) Filtra por subcarpeta (Búsqueda).
2) Abre 20 imágenes espaciadas (no consecutivas).
3) Preguntas:
   - ¿clases correctas?
   - ¿tamaños consistentes?
   - ¿hay cajas fuera de lugar?

## Auditoría ligera (por lote)
- Exporta a COCO y revisa estadísticas con una herramienta externa si lo deseas,
pero aquí al menos:
  - revisa que "Anotaciones" no esté vacía donde debería haber
  - revisa que no haya clases "typo" (ej. "Microcalficación")

## Bitácora
La "Actividad de la sesión" sirve como rastro de:
- cargas
- importaciones/exportaciones
- guardados
Útil para reconstruir qué pasó si algo sale raro.`,
  },
  {
    id: "atajos",
    title: "Atajos de teclado (resumen)",
    content: `# Atajos de teclado (resumen)

## Archivo / proyecto
- Cargar carpeta: **Ctrl+L / ⌘L**
- Nuevo JSONL: **Ctrl+N / ⌘N**
- Abrir JSONL: **Ctrl+O / ⌘O**
- Guardar: **Ctrl+S / ⌘S**
- Guardar como: **Ctrl+Shift+S / ⌘⇧S**
- Opciones: **Ctrl+, / ⌘,**
- Salir: **Ctrl+Q / ⌘Q**

## Herramientas
- PAN: **P**
- Etiquetar: **E**
- Ajustar brillo/contraste: **C**
- Seleccionar: **V**

## Navegación
- Imagen anterior/siguiente: **←/→** (también **↑/↓**)

## Ayuda
- Centro de ayuda: **F1**`,
  },
  {
    id: "rendimiento",
    title: "Rendimiento y estabilidad (consejos prácticos)",
    content: `# Rendimiento y estabilidad (consejos prácticos)

## Si se siente lento
- Evita zoom extremo sostenido (úsalo sólo al marcar).
- Trabaja por subcarpetas (lotes).
- En DICOM, reduce el universo cargado (una serie a la vez).

## Si se traba al cargar
- Revisa que no haya archivos corruptos.
- Evita rutas muy largas o con caracteres raros.
- Mantén tu carpeta en un disco rápido si puedes.

## Regla práctica
"Más rápido" suele venir de:
- lotes más pequeños
- guardados frecuentes
- criterio claro (menos corrección posterior)`,
  },
  {
    id: "respaldo",
    title: "Respaldo y seguridad del proyecto (no perder trabajo)",
    content: `# Respaldo y seguridad del proyecto (no perder trabajo)

## Lo mínimo indispensable
- Guarda el JSONL del proyecto.
- Haz copia del JSONL al terminar cada sesión.

## Estrategia por fecha
- \`lote01_2026-01-20.jsonl\`
- \`lote01_2026-01-21.jsonl\`

## Si trabajas en equipo
- Una carpeta compartida con control de versiones (o al menos copias diarias).
- No editen dos personas el mismo JSONL a la vez.`,
  },
  {
    id: "solucion_problemas",
    title: "Solución de problemas (FAQ)",
    content: `# Solución de problemas (FAQ)

## "No me deja etiquetar"
Causa: no hay etiquetas cargadas.
Solución: Archivo → Cargar etiquetas…

## "No se ven cajas al abrir JSONL"
- Verifica que cargaste la misma carpeta raíz.
- Si hay nombres repetidos, puede emparejar mal (ver "Emparejamiento de rutas").

## "DICOM no abre"
- Instala: \`pip install pydicom numpy\`
- Si falla PixelData: \`pip install 'pylibjpeg[all]'\` y \`pip install gdcm\`

## "Se ve muy oscuro/claro"
Usa Ajustar (C) y luego Reset si te pasaste.

## "Cerré sin querer"
Si guardaste: Archivo → Recientes → abre tu JSONL.`,
  },
  {
    id: "glosario",
    title: "Glosario (términos y campos)",
    content: `# Glosario (términos y campos)

- **Ruta relativa**: \`subcarpeta/imagen.png\` respecto a la carpeta raíz.
- **Caja / BBox**: rectángulo delimitador.
- **Coordenadas normalizadas**: valores 0–1 (proporción de ancho/alto).
- **displayName**: nombre de la clase (ej. "Microcalcificación").
- **JSONL**: archivo de texto con 1 JSON por línea.
- **COCO**: formato estándar con \`images\`, \`annotations\`, \`categories\`.
- **YOLO**: formato por imagen con \`class cx cy w h\`.
- **MONAI máscaras**: PNGs con valores de clase por píxel (segmentación).
- **ml_use**: etiqueta para partición (training/validation/test).`,
  },
  {
    id: "formatos",
    title: "Formatos y convenciones (resumen técnico)",
    content: `# Formatos y convenciones (resumen técnico)

## Coordenadas
Las cajas se guardan normalizadas:
- xMin, yMin, xMax, yMax en rango 0–1

## JSONL (Vertex)
Una línea por imagen con:
- imageGcsUri
- boundingBoxAnnotations: [{displayName, xMin, yMin, xMax, yMax, ...}]
- dataItemResourceLabels (ml_use)
- annotation_set_name (si lo usas)

## COCO
- images: {id, file_name, width, height}
- categories: {id, name}
- annotations: {id, image_id, category_id, bbox[x,y,w,h], area, iscrowd}

## YOLO
Por imagen: \`class cx cy w h\` (normalizado)
+ \`classes.txt\`

## MONAI
- Máscaras PNG con ids de clase
- \`dataset_monai.json\` con pares image/label relativos`,
  },
];
