let Helpers = require('utils/helpers');


module.exports = Marionette.Behavior.extend({

    ui: {
        form: 'form'
    },

    events: {
        'submit @ui.form': '_auth',
    },

    _auth: function(event) {
        event.preventDefault();

        let self = this;
        let $form = this.ui.form;

        this.options.onAuthenticate(
            $form.serializeArray(),
            function(errors) {
                self._showErrorsInForm($form, errors);
            },
            function(jqXHR, textStatus, errorThrown) {
                console.warn(jqXHR);
            }
        );
    },

    _showErrorsInForm: function($form, errors) {
        $form.find('.alert').remove();
        $form.find('.has-error').removeClass('has-error');
        $form.find('span.help-block').remove();

        Object.keys(errors).forEach(function(key) {
            if (key === '__all__') {
                $form.prepend(Helpers.createAlertHTML(errors[key], 'danger'));
            } else {
                let $input = $form.find('input[name=' + key + ']');
                if ($input.length) {
                    let $parents = $input.parents('.form-group');
                    $parents.addClass('has-error');
                    $parents.append('<span class="help-block">' + errors[key] + '</span>');
                }
            }
        });
    },

});
