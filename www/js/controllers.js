angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, User, Recomendations) {

  var showLoading = function(){
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  }
  var hideLoading = function(){
    $ionicLoading.hide();
  }
  showLoading();

  $scope.songs = [];
  Recomendations.init().then(function(){
    $scope.currentSong = Recomendations.queue[0];
    Recomendations.playCurrentSong();
  }).then(function(){
    hideLoading();
    $scope.currentSong.loaded = true;

  });

  $scope.sendFeedback = function(bool) {

    if(bool) User.addSongToFavorites($scope.currentSong);
    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;

    Recomendations.nextSong();

    $timeout(function () {
      var randomSong = Math.round(Math.random() * ($scope.songs.length - 1));
      $scope.currentSong  = Recomendations.queue[0];
      $scope.currentSong.loaded = false;
    }, 250);

    Recomendations.playCurrentSong().then(function(){
      $scope.currentSong.loaded = true;
    });
  };

  $scope.currentSong = angular.copy($scope.songs[0]);

  $scope.nextAlbumImage = function(){
    if (Recomendations.queue.length > 1) {
      return Recomendations.queue[1].image_large;
    }
    return '';
  }

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, $window, User) {
  $scope.username = User.username;
  $scope.favorites = User.favorites;
  $scope.openSong = function(song){
    $window.open(song.open_url, "_system")
  }

  $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  }
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, $window, Recomendations, User) {

  $scope.favCount = User.favoriteCount;

  $scope.enteringFavorites = function(){
    User.newFavorites = 0;
    Recomendations.haltAudio();
  }
  $scope.leavingFavorites = function(){
    Recomendations.init();
  }
  $scope.logout = function() {  
    User.destroySession();
    $window.location.href = 'index.html';
  }

})
.controller('SplashCtrl', function($scope, $state, User){
  $scope.submitForm = function(username, signingUp) {
    User.auth(username, signingUp).then(function(){
      $state.go('tab.discover')
    }, function(){
      alert('Try nother username');
    });
  }
});
