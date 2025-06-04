ANÁLISIS INTERACTIVO DE REGISTRO DE MUERTES
=========================================

Esta aplicación web proporciona una visualización interactiva de datos sobre la proporción de muertes registradas en diferentes países a lo largo del tiempo.

DESCRIPCIÓN DE LA APLICACIÓN
---------------------------
La aplicación ofrece tres tipos principales de visualizaciones:
1. Gráfico de líneas temporales que muestra la evolución de los registros a lo largo del tiempo
2. Gráfico de barras para comparar países en un año específico
3. Mapa interactivo que muestra la distribución geográfica de los datos

INSTALACIÓN Y USO
----------------
1. Asegúrese de que todos los archivos estén en la estructura correcta:
   /
   ├── index.html
   ├── css/
   │   └── style.css
   ├── js/
   │   └── app.js
   └── data/
       └── share-of-deaths-registered.csv

2. Para ejecutar la aplicación:
   - Asegúrese de tener una conexión a Internet (necesaria para cargar las bibliotecas y el mapa base)
   - Abra index.html en un navegador web moderno
   - Para servir la aplicación localmente, puede usar Python:
     python3 -m http.server 8000

REQUISITOS TÉCNICOS
------------------
- Navegador web moderno con soporte para JavaScript ES6+
- Conexión a Internet para:
  * Cargar las bibliotecas D3.js y Leaflet
  * Cargar los mapas base de OpenStreetMap
  * Cargar las fuentes de Google Fonts

ESTRUCTURA DEL PROYECTO
---------------------
- index.html: Página principal de la aplicación
- css/style.css: Estilos y diseño responsivo
- js/app.js: Lógica de la aplicación y visualizaciones
- data/share-of-deaths-registered.csv: Datos de registro de muertes

FUNCIONALIDADES
--------------
1. Filtros interactivos:
   - Selección de año
   - Selección de país

2. Visualizaciones:
   - Series temporales con múltiples países
   - Gráfico de barras comparativo
   - Mapa coroplético interactivo

3. Características adicionales:
   - Diseño responsivo para diferentes dispositivos
   - Tooltips informativos
   - Transiciones animadas
   - Leyendas y escalas de color

MANEJO DE ERRORES
----------------
La aplicación incluye:
- Validación de datos
- Mensajes de error amigables
- Manejo de casos donde los datos no están disponibles
- Recuperación graciosa ante errores de carga

CRÉDITOS Y LICENCIAS
-------------------
- Datos: Nuestro Mundo en Datos
- Bibliotecas:
  * D3.js para visualizaciones
  * Leaflet para mapas interactivos
  * OpenStreetMap para mapas base
- Fuentes: Google Fonts (Roboto, Open Sans)

ACTUALIZACIONES Y MANTENIMIENTO
-----------------------------
Para actualizar los datos:
1. Reemplace el archivo CSV en la carpeta 'data'
2. Asegúrese de mantener la misma estructura de columnas:
   - Entidad
   - Código
   - Año
   - Proporción de muertes registradas

Para modificar las visualizaciones:
1. Los estilos se pueden ajustar en style.css
2. La lógica de visualización se encuentra en app.js
3. La estructura de la página se puede modificar en index.html

SOPORTE
-------
Para reportar problemas o sugerir mejoras:
1. Verifique que está usando la última versión
2. Compruebe la consola del navegador para mensajes de error
3. Asegúrese de que todos los archivos están presentes y accesibles

NOTAS ADICIONALES
---------------
- La aplicación está optimizada para rendimiento y usabilidad
- Se recomienda usar navegadores actualizados para mejor experiencia
- Los datos se cargan de manera asíncrona para mejor rendimiento
\n\n## Instrucciones para Navegar y Comprender la Aplicación\n\n1. Introducción\nEsta aplicación ofrece una visualización interactiva de datos sobre la proporción de muertes registradas en diferentes países de América Latina durante el período 2015-2019.\n\n2. Navegación Principal\n- En la parte superior, encontrarás un menú con tres secciones principales:\n  a) Visualizaciones\n  b) Filtros\n  c) Documentación\n\n3. Sección Visualizaciones\n- Aquí se presentan tres gráficos principales:\n  1) Evolución Temporal: Muestra la tendencia de registro de muertes a lo largo del tiempo para los países seleccionados.\n  2) Comparación por País: Compara la proporción de muertes registradas entre diferentes países para el año seleccionado.\n  3) Distribución Geográfica: Visualiza la distribución global de los registros de muertes en un mapa interactivo.\n- Los gráficos están organizados verticalmente para facilitar la visualización.\n\n4. Sección Filtros\n- Ubicada a la izquierda, permite seleccionar:\n  a) Año: Usa el menú desplegable para elegir el año de interés.\n  b) Países: Selecciona uno o varios países usando las casillas de verificación.\n  c) Botones para seleccionar o deseleccionar todos los países rápidamente.\n- Los filtros afectan los datos mostrados en las visualizaciones.\n\n5. Sección Documentación\n- Contiene pestañas con información detallada sobre:\n  a) Fuente y Estructura de los Datos\n  b) Variables Clave y Cobertura\n  c) Tipos de Análisis Disponibles\n  d) Funcionalidades Interactivas de la aplicación\n\n6. Sección Análisis de Tendencias\n- Ubicada a la derecha de los filtros, muestra tarjetas con información sobre cambios y tendencias en el registro de muertes por país.\n- Está organizada horizontalmente y ocupa todo el espacio disponible.\n\n7. Uso Interactivo\n- Puedes combinar filtros para explorar diferentes escenarios y observar cómo cambian las visualizaciones.\n- El mapa es interactivo, permitiendo acercar, alejar y explorar regiones específicas.\n\n8. Información Adicional\n- En el pie de página encontrarás créditos y el nombre del desarrollador.\n\nEsperamos que estas instrucciones te ayuden a navegar y comprender la aplicación de manera efectiva.\n
