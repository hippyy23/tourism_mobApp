# mappaVerona

## Ambiente necessario
Per eseguire il codice di questo progetto è necessario installare Node e Ionic CLI. Se si vuole eseguire l'applicazione su un emulatore bisogna installare e configurare Android Studio.

## Comandi per eseguire il progetto
Eseguire su un emulatore Android (necessario Android Studio ed un emulatore configurato):

```
ionic cap run android
```
Eseguire il progetto su browser:
```
ionic serve
```

## Modifiche da effettuare alla prima installazione o in caso di errori

### Modifiche da apportare ai file interni al progetto
| Directory  | File | Modifica | Motivo |
| ------------- | ------------- | ------------- | ------------- |
| node_modules  | -  | Cancella cartella .cache(se presente)  | Progetto non si avvia  |
| android  | local.properties  | Crea il file ed inserisci dentro questa stringa "sdk.dir=C:\\users\\Michele\\AppData\\Local\\Android\\sdk"  | Errore capacitor, non permette di aprire l'emulatore  |
| android/app/src/main  | AndroidManifest.xml  | Aggiungi ad <b>application</b> android:usesCleartextTraffic="true"  | Vedere le immagini su android  |

### Ulteriori modifiche:
- Modifica Manifest<br/>
Directory: android/app/src/main<br/>
File: AndroidManifest.xml  <br/>
Codice:

```
<!-- Geolocation API -->
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

Motivo: Vedere le immagini su android 

- Modifica `package.json`<br/>
Cancella:

```
"browserslist": {
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ]
},
```

Aggiungi:

```
"browserslist": [
   ">0.2%",
  "not dead",
  "not op_mini all"
],
```

Infine:
- npm install
- npm start

## Librerie installate (npm install)
- **@capacitor/device**            // Permette di leggere la lingua del dispositivo
- **@capacitor/network**           // Permette di leggere i dati riguardanti la connessione
- **@capacitor/storage**           // Permette di salvare i dati sul dispositivo
- **@capacitor/geolocation**       // Permette di usare la posizione
- **node**
- **ionic**
- **capacitor**
- **leaflet**
- **react-leaflet**

<!-- "npx cap sync" ogni volta che si aggiungono nuovi npm --> 

<!-- "ncu -u" aggiorna il package json -->
