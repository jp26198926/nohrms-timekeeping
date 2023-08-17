# Timekeeping App (timekeeping)

Timekeeping Terminal App

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).

### Deploy to Production ###
1. Download and Extract the Zip file
2. Open ```Timekeeping App.exe```
3. Click "Server" in the menu, and enter Server API
4. Click "Location" in the menu, and select the specific Location for this terminal
5. Click "Type" in the menu, to identify if the device is for Clock In or Out.

### NOTE - CORS Error ###
- You must enable cross-origin header in the API server
FOR DEBIAN AND UBUNTU SERVER
1. ``sudo a2enmod headers``
2. In ``apache2.conf`` file add the following code in ``<Directory /var/www/html>``
```bash
<Directory /var/www/html>
   //other code
   Header set Access-Control-Allow-Origin "*"
</Directory>
```
2a. Or in the ``.htaccess`` file.
```bash
Header add Access-Control-Allow-Origin "*"
```
3. Restart apache service ``systemctl restart apache2.service``
