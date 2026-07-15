# Sistema base para nueva empresa

Esta carpeta es una copia independiente y limpia del sistema. No comparte archivos de configuración ni imágenes de marca con `SeniorFlow-main`.

## Identidad de la empresa

El nombre, dirección, teléfono, correo, web, datos de pago y logo se cargarán desde **Configuración**. Los PDF toman esos datos desde la configuración centralizada.

Para el logo recomiendo:

- PNG con fondo transparente.
- Relación horizontal aproximada 3:1 o 4:1.
- Tamaño ideal: 1200 × 300 px.
- Peso preferible: menos de 500 KB.
- Texto y símbolos con buen margen interno para que se lean al reducirse en encabezados.

El sistema redimensiona automáticamente la imagen cargada y la usa en los encabezados de los PDF.

## Firebase

`firebase-config.js` quedó sin credenciales de la empresa anterior. Se completará con el nuevo proyecto Firebase antes de usar la aplicación.
