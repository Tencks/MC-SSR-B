
const db = require('./db')
const app = require('./app');


app.listen(app.get('port'), () => {
  console.log('Cultivando los ', app.get('port'), 'Grandes Daos');
});

