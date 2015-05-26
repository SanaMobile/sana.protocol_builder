import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'https://sanaprotocolbuilder.me/api',
  headers: function() {
    var headers = {};

    var authorizationToken = Cookies.get('authorizationToken');
    if (authorizationToken) {
      headers.Authorization = 'Token ' + authorizationToken;
    }

    return headers;
  }.property().volatile()
});
