import DRFAdapter from './drf';

export default DRFAdapter.extend({
    headers: function() {
        var headers = {};

        var authorizationToken = Cookies.get('authorizationToken');
        if (authorizationToken) {
            headers.Authorization = 'Token ' + authorizationToken;
        }

        return headers;
    }.property().volatile()
});
