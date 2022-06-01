# Science Archive Client

A user-friendly frontend interface to an OCS Science Archive.

## Prerequesites:
* An OCS [Science Archive](https://github.com/observatorycontrolsystem/science-archive/)
* An OCS [Observation Portal](https://github.com/observatorycontrolsystem/observation-portal/)
* An OCS [Simbad2k Service](https://github.com/observatorycontrolsystem/simbad2k) for catalog lookups
* An OCS [Thumbnail Service](https://github.com/observatorycontrolsystem/thumbnail-service) to generate JPEG thumbnails from data products

## Environment variables

The following environment variables can be used to configure your specific science-archive client instance.

| Variable                              | Description                           | Default                 |
| ------------------------------------- | ------------------------------------- | ----------------------- |
| `VUE_APP_OBSERVATION_PORTAL_API_URL`  | Observation portal API URL            | `http://127.0.0.1:8000` |
| `VUE_APP_ARCHIVE_API_URL`             | Archive API URL                       | `http://127.0.0.1:8000` |
| `VUE_APP_SIMBAD_SERVICE_URL`          | Simbad service URL                    | `http://127.0.0.1:8000` |
| `VUE_APP_THUMBNAIL_SERVICE_URL`       | Thumbnail service URL                 | `http://127.0.0.1:8000` |

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints files and prints out lint errors
```
npm run lint:check
```

### Lints and fixes files
```
npm run lint:fix
```
