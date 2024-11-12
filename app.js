const express = require('express');
const session = require("express-session");
const { google } = require('googleapis');
const fs = require('fs');
const app = express(); 
const path = require('path');
const saltRounds = 10;
conexion = require("./config/conexion");
const multer = require('multer');
const apikeys = require('./cred.json');
//bcrypt = require("bcrypt");

// Configuraciones 
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(require('./routes/regUsuario'));
app.use(require('./routes/codlogin'));
app.use(require('./routes/registrar'));

app.use(session({
  secret: 'mi_secreto', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } 
}));

// Configuración de multer para el manejo de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Carpeta temporal donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Rutas Estáticas 
app.use(express.static(path.join(__dirname, 'public'))); 
// Ruta para index 
app.get('/', (req, res) => { 
    res.render('index', { 
        link: 'http://lockeraa.alwaysdata.net' // Renderiza la vista index.ejs con una variable link   
    });
}); 
// Ruta para nosotros 
app.get('/nosotros', (req, res) => { 
    res.render('nosotros'); 
});
// Ruta para registrar 
app.get('/registrar', (req, res) => { 
    res.render('registrar'); 
});
// Ruta para login
app.get('/login', (req, res) => {
  res.render('login');
});
// Configuración de Google OAuth
const CLIENT_ID = '969040758536-0jalhru9efoto2mtq8sesluqkj9k5ce7.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04biZIksVIYqsCgYIARAAGAQSNwF-L9IrqGyMWkeblXEWMcbDfRnQ8s93kdNetNHs94uygSUdtPjMZPtw0CbNNqzk40aI-af1BKk';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  apikeys
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

// Ruta para la página de carga de archivos
app.get('/upload', (req, res) => {
  res.render('upload'); // Asegúrate de tener una vista 'upload.ejs' para el formulario de carga
});

// Ruta para manejar la carga de archivos
app.post('/upload', upload.single('video'), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    const response = await uploadFile(filePath, fileName);
    res.json({ message: 'Archivo subido con éxito', response });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).json({ message: 'Error al subir el archivo' });
  } finally {
    fs.unlinkSync(filePath); // Elimina el archivo temporal después de subirlo
  }
});

// Función para subir el archivo a Google Drive
async function uploadFile(filePath, fileName) {
  const fileMetaData = {
    name: fileName,
    parents: ["13BKI-kHci9VKAcNeqPPxGPwONFkY--2i"]
  };

  const media = {
    mimeType: 'video/mp4',
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetaData,
    media: media,
    fields: 'id'
  });

  return response.data;
}

// Configurar puerto del servidor 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, function () { console.log(`Servidor en marcha en http://localhost:${PORT}`); 
});