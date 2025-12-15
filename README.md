# 8020REI - Home Dashboard

Dashboard de inversores inmobiliarios construido con React + Vite + Tailwind CSS.

## 🚀 Inicio Rápido

### Requisitos Previos

- [Node.js](https://nodejs.org/) versión 18 o superior
- [Git](https://git-scm.com/)
- Un editor de código (recomendado: [VS Code](https://code.visualstudio.com/))

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/TU_USUARIO/8020rei-dashboard.git
   cd 8020rei-dashboard
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre en tu navegador**
   
   Visita `http://localhost:5173`

## 📁 Estructura del Proyecto

```
8020rei-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── HomeDashboard.jsx    # Dashboard principal
│   ├── App.jsx                   # Componente raíz
│   ├── main.jsx                  # Punto de entrada
│   └── index.css                 # Estilos globales + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo en `localhost:5173` |
| `npm run build` | Genera build de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción |

## 🎨 Sistema de Diseño

El proyecto utiliza el sistema de diseño Kairo de 8020REI:

- **Colores principales**: `#14275F` (900), `#1665D4` (500)
- **Fuente**: Inter
- **Espaciado**: Sistema de 4px/8px
- **Border radius**: 12px para cards, 6-8px para botones

## 📝 Licencia

Proyecto privado - 8020REI © 2025
