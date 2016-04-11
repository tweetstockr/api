// admin routes ================================================================

'use strict';

module.exports = function(app) {

    var UsersController = require('./usersController'),
        usersController = new UsersController();

    var TournamentsController = require('./tournamentsController'),
        tournamentsController = new TournamentsController();

    app.get('/admin', isLoggedInAsAdministrator, function(req, res) {
      res.render('admin/index');
    });

    // USERS ===================================================================

    app.get('/admin/users/list/:page', isLoggedInAsAdministrator, function(req, res) {

      var configAdmin = require('../config/admin');

      var page = 1
      if ( typeof req.params.page !== 'undefined' && req.params.page )
        page = req.params.page;

      var search = '';
      if ( typeof req.query.search !== 'undefined' && req.query.search )
        search = req.query.search;

      usersController.list(configAdmin.resultsPerPage, page, search, function(usersList){
        if (usersList.page > usersList.pages)
          res.redirect('/admin/users/list/1?search=' + usersList.search);

        res.render('admin/users/list', usersList);
      });
    });

    app.get('/admin/users/edit/:user', isLoggedInAsAdministrator, function(req, res){
      usersController.user(req.params.user,function(user){
        res.render('admin/users/edit', {
          'user' : user
        });
      });
    });

    app.post('/admin/users/edit/:user', isLoggedInAsAdministrator, function(req, res){

      var id = req.params.user;

      usersController.update(id, req.body, function(user){
        res.redirect('/admin/users/edit/' + id);
      });

    });

    app.get(/admin\/users/, function(req, res) {
      res.redirect('/admin/users/list/1');
    });

    // TOURNAMENTS =============================================================

    app.get('/admin/tournaments/list', isLoggedInAsAdministrator, function(req, res) {

      tournamentsController.list(function(tournamentsList){
        res.render('admin/tournaments/list', tournamentsList);
      });
    });

};


// route middleware to ensure user is logged in as administrator ===============
function isLoggedInAsAdministrator(req, res, next) {

    var configAdmin = require('../config/admin');
    var configGeneral = require('../config/config');

    if (req.isAuthenticated()){

      var admins = configAdmin.administrators.split(',');
      var currentUsername = req.user.twitter.username;

      for (var i = 0; i < admins.length; i++) {
          if (admins[i] === currentUsername)
            return next();
      };
      return res.redirect(configGeneral.homeUrl);
      // return res.redirect(configGeneral.apiUrl + '/auth/twitter');

    } else
      return res.redirect(configGeneral.homeUrl);
      // return res.redirect(configGeneral.apiUrl + '/auth/twitter');

}
