'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _authService = require('../auth.service');

var router = _express2['default'].Router();

router.get('/', _passport2['default'].authenticate('twitter', {
  failureRedirect: '/signup',
  session: false
})).get('/callback', _passport2['default'].authenticate('twitter', {
  failureRedirect: '/signup',
  session: false
}), _authService.setTokenCookie);

exports['default'] = router;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
