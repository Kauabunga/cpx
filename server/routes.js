/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {

  // Insert routes below
  app.use('/api/levys', require('./api/levy'));
  app.use('/api/bics', require('./api/bic'));
  app.use('/api/businessnames', require('./api/businessnames'));


  // All undefined asset or api routes should return a 404
  app.route('/:url(api|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
