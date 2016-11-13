angular.module('starter.controllers', ['ngCordova'])

.controller('appCtrl', function($scope, $state) {
  
  $scope.logout = function() { 
      $state.go('login');
    };
})

.controller('cargaInicialCtrl', function($state, $scope) {
  
  document.addEventListener('deviceready', function() {
    $state.go('login');
  });
})

.controller('loginCtrl', function($state, $scope, $cordovaSQLite, $ionicLoading) {

  $scope.recordarCredenciales = {};
  $scope.recordarCredenciales.checked = true;

  $scope.loginData = 
  {
    email: '',
    password : ''
  };

  var db = null;

  document.addEventListener('deviceready', function() {
    db = window.sqlitePlugin.openDatabase({name: 'miBase.db', location: 'default'});

    db.transaction(function(tx) {
      // crea la tabla si no existe en bd sqlite
      tx.executeSql('CREATE TABLE IF NOT EXISTS login (email, password)');
      // lee el registro de bd sqlite
      tx.executeSql('SELECT count(*) AS mycount FROM login', [], function(tx, rs) {
        if (rs.rows.item(0).mycount > 0) {
          tx.executeSql('SELECT * FROM login', [], function(tx, rs) {
            $scope.loginData.email = rs.rows.item(0).email;
            $scope.loginData.password = rs.rows.item(0).password;     
          });
        }
      }); 
    });
  });


  // Login
  $scope.login = function() {
    $ionicLoading.show({
      template: '<p>Verificando credenciales...</p><ion-spinner icon="android"></ion-spinner>'
    });
    if ($scope.loginData.email == "jp.torrellas@gmx.com" && $scope.loginData.password == "123") {
      //Recordar Credenciales
      if ($scope.recordarCredenciales.checked == true) {
        var email = $scope.loginData.email;
        var password = $scope.loginData.password;
        document.addEventListener('deviceready', function() {
          db.transaction(function(tx) {
            tx.executeSql('DROP TABLE login');
            tx.executeSql('CREATE TABLE IF NOT EXISTS login (email, password)');
            // inserta un nuevo registro en bd sqlite
            tx.executeSql('INSERT INTO login (email, password) VALUES (?,?)', [email, password]);
          });
        });
      }
      else {
        db.transaction(function(tx) {
          // borra los registros que haya en bd sqlite
          tx.executeSql('DROP TABLE login');
        });
      }
      $scope.loginData = {};
      $state.go('app.inicio');
    }
    else {
      $scope.loginData = {};
      alert('usuario o contraseña incorrecto.');
    }
    $ionicLoading.hide();  
  };
})

.controller('inicioCtrl', function($state, $scope, $cordovaSQLite) {
  $scope.saludo="Bienvenido!";
})



