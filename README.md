
Built by https://www.blackbox.ai

---

# Análisis de Registro de Muertes

## Project Overview
El proyecto *Análisis de Registro de Muertes* es una herramienta de visualización interactiva diseñada para explorar y analizar la proporción de muertes registradas en diferentes países de América Latina. Utilizando datos de "Nuestro Mundo en Datos", permite a los usuarios comparar tendencias a lo largo del tiempo, entre diferentes países, y visualizar la distribución geográfica de los registros de muertes.

## Installation
Para ejecutar el proyecto localmente, sigue estos pasos:

1. **Descarga el repositorio**:
   Clona el repositorio en tu máquina local utilizando el siguiente comando:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
   
2. **Navega al directorio del proyecto**:
   ```bash
   cd AnalisisRegistroMuertes
   ```

3. **Ejecuta un servidor local**:
   Puedes usar un servidor local como [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en Visual Studio Code o cualquier otro servidor estático para abrir el archivo `index.html`.

## Usage
Una vez que el proyecto esté en funcionamiento, abre `index.html` en tu navegador. Desde la página principal, puedes interactuar con las siguientes funcionalidades:

- Selección de años y países para visualizar datos específicos.
- Gráficos interactivos que muestran las tendencias de muertes registradas a lo largo del tiempo y comparaciones entre diferentes países.
- Un mapa interactivo que representa la distribución geográfica de los registros de muertes.

## Features
El proyecto incluye las siguientes características:

- **Selección múltiple de países** para comparar y analizar los datos.
- **Filtrado por año** para concentrar el análisis en períodos específicos.
- **Visualización de tendencias** y cambios a lo largo del tiempo.
- **Tooltips informativos** en gráficos que proporcionan detalles adicionales.
- **Mapa interactivo** con información detallada sobre los registros de muertes por país.

## Dependencies
Este proyecto utiliza las siguientes bibliotecas que están integradas en el archivo `index.html`:

- [D3.js](https://d3js.org/) para gráficos y visualizaciones.
- [Leaflet](https://leafletjs.com/) para visualización de mapas.

No se requieren dependencias adicionales más allá de estas bibliotecas externas.

## Project Structure
La estructura del proyecto está organizada de la siguiente manera:

```
/AnalisisRegistroMuertes
│
├── index.html              # Archivo principal HTML
├── css
│   └── style.css          # Estilos personalizados
├── js
│   └── app.js             # Script JavaScript personalizado
```

### Descripción de las Secciones
- `index.html`: Contiene la estructura principal de la página, incluyendo navegación y secciones para filtros y visualizaciones.
- `css/style.css`: Archivo de estilo para dar formato y aspecto a la aplicación.
- `js/app.js`: Archivo JavaScript para gestionar la lógica de la aplicación y las interacciones del usuario.

## Reflexión Final
El análisis de los datos de registro de muertes en América Latina revela tendencias significativas y oportunidades de mejora en el registro de muertes. A pesar del progreso general, se necesita atención en ciertos países para alcanzar niveles óptimos en el registro de muertes. Este proyecto busca destacar esas diferencias y fomentar la conciencia sobre la importancia del registro adecuado de muertes.

## Mantenimiento
Este proyecto es mantenido por Luisa Acosta. Siéntete libre de abrir un issue en el repositorio o contribuir con mejoras.

---
© 2025 - Todos los derechos reservados