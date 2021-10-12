# mappaVerona

<h3>Pacchetti npm da installare:</h3>
-npm install @capacitor/device            // Permette di leggere la lingua del dispositivo<br/>
-npm install @capacitor/network           // Permette di leggere i dati riguardanti la connessione<br/>
-npm install @capacitor/storage           // Permette di salvare i dati sul dispositivo<br/>
-npm install @capacitor/geolocation       // Permette di usare la posizione<br/>

<b>NB</b>: "npx cap sync" ogni volta che si aggiungono nuovi npm<br/><br/>


<h3>Librerie da installare:</h3>
-node<br/>
-ionic<br/>
-capacitor<br/>
-leaflet<br/>
-react-leaflet<br/><br/>


<h3>Modifiche da apportare ai file interni al progetto:</h3>
<table>
  <tr>
    <th>Directory</th>
    <th>File</th>
    <th>Modifica</th>
    <th>Motivo</th>
  </tr>
  <tr>
    <td>node_modules</td>
    <td>-</td>
    <td>Cancella cartella .cache</td>
    <td>Progetto non si avvia</td>
  </tr>
  <tr>
    <td>android/app/src/main</td>
    <td>AndroidManifest.xml</td>
    <td>Aggiungi ad <b>application</b> android:usesCleartextTraffic="true"</td>
    <td>Vedere le immagini su android</td>
  </tr>
  <tr>
    <td>android/app/src/main</td>
    <td>AndroidManifest.xml</td>
    <td>
      <pre>
      &lt;!-- Geolocation API --&gt;
        &lt;uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" /&gt;
        &lt;uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" /&gt;
      </pre>
    </td>
    <td>Vedere le immagini su android</td>
  </tr>
  <tr>
    <td>-</td>
    <td>package.json</td>
    <td>
     <b>Cancella:</b><br/>
     "browserslist": {<br/>
       "production": [<br/>
          ">0.2%",<br/>
          "not dead",<br/>
          "not op_mini all"<br/>
        ],<br/>
        "development": [<br/>
          "last 1 chrome version",<br/>
          "last 1 firefox version",<br/>
          "last 1 safari version"<br/>
        ]<br/>
      },
<br/><br/>
<b>Aggiungi:</b><br/>
"browserslist": [<br/>
   ">0.2%",<br/>
  "not dead",<br/>
  "not op_mini all"<br/>
],
<br/><br/>

<b>Infine:</b><br/>
  npm install<br/>
  npm start
</td>
    <td></td>
  </tr>
</table><br/><br/>


<h3>Comandi per eseguire il progetto:</h3>
-ionic serve            // Esegue il progetto sul browser<br/>
-ionic cap run android  // Compila ed esegue il progetto su dispositivo Android
