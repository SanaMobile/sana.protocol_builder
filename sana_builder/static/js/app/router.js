define(['ember', 'SanaBuilder'], function (Ember, SanaBuilder) {
    return function () {
        SanaBuilder.Router.map(function () {
            this.route('/');
            this.route('about');
            this.route('features');
            this.route('documentation');
        });
    }
})