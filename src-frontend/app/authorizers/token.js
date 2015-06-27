import Base from 'simple-auth/authorizers/base';

export default Base.extend({
    authorize: function(jqXHR, requestOptions) {
        var session = this.get('session');

        if (session.isAuthenticated) {
            var token = session.get('secure.token');
            var header = 'Token ' + token;

            jqXHR.setRequestHeader('Authorization', header);
        }
    }
});
