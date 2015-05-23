/* @flow */

define(['../app'], function() {
    require(['SanaBuilder', 'templates'], function (SanaBuilder) {
        SanaBuilder.deferReadiness(); // Avoid auto-initialization while setting up dependencies

        require(['router'], function (SetupRouter) {
            SetupRouter();

            // After everything setup, init app
            SanaBuilder.advanceReadiness();
        });
    });
});
