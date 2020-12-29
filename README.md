# geocase-ui
This is a new GeoCASe web application currently called [GeoCASe 2.0](http://geocase.geocollections.info) which is still in development state. 
It is based on the previous GeoCASe application found [here](http://geocase.eu). It aims to replace/enhance the current Drupal-based solution (see https://github.com/geocollections/geocase-infrastructure).

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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Setup with docker-compose

### Build Docker images
```
docker-compose build
```

### Initiate SSL certificates (only for initial installation)
1)  configure the domains in line 8 of `init-letsencrypt.sh` for the creation of the certificate
1)  configure the domains and paths to the certificates in `nginx/conf.d/default.conf`
1)  execute `init-letsencrypt.sh` before the first start of the containers
```
chmod +x init-letsencrypt.sh
./init-letsencrypt.sh
```
More information [here](https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71).\
*Thanks to Philipp Schmieder for the [article](https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71) and the [repo](https://github.com/wmnnd/nginx-certbot) that provided the basis for the Let's Encrypt script.*\
*__TODO:__ Update to the [latest approach](https://medium.com/@pentacent/lets-encrypt-for-your-docker-app-in-less-than-5-minutes-24e5b38ca40b)*

### Start containers
```
docker-compose up -d
```
