angular.module('songhop.services', [])

.factory('User', function(){
  var o  = {
    favorites: []
  }

o.addSongToFavorites  = function(song) {
  if(!song) return false;

  o.favorites.unshift(song);
}


  return o;
});
