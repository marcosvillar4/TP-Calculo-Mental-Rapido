# TP Calculo Mental React

Proyecto inicial de una app/juego de cálculo mental rápido hecha con React Native y Expo.

## Estructura

- `App.js`: contenedor del menú principal y navegación hacia la partida.
- `components/menu/MainMenu.js`: pantalla principal con selectores e historial.
- `components/game/GameContent.js`: interfaz de la partida según el modo.
- `components/game/FinalResultScreen.js`: pantalla final de resultados.
- `components/common/MenuOption.js`: opción reutilizable para menús.
- `components/common/TabButton.js`: pestañas reutilizables para historial.
- `constants/gameOptions.js`: modos y dificultades.
- `utils/gameUtils.js`: lógica compartida del juego.

## Scripts

```bash
npm install
npm run start
npm run web
```

## Objetivo

- Correr en celulares Android/iOS
- Correr en navegador web
- Servir como base para el juego de cálculo mental
