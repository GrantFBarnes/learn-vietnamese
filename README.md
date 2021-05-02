# Learn Vietnamese

This is NodeJS and Angular website to help learn and practice the Vietnamese language.

## Environment Variables

You will need to set the following environment variables

```
JWT_SECRET // secret to encrypt tokens
GFB_EDIT_SECRET // secret to allow edit access
GFB_HOSTING_ENV // prod or something else
MYSQL_TU_PASSWORD // MySQL DB trusted user password
```

_Note that these can change to what ever values desired for deployment._

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Deploy

Run `node backend/server.js` to host the backend and display the static UI files generated from the production build.
