var Helpers = require('utils/helpers');

module.exports = Marionette.Behavior.extend({

    ui: {
        form: 'form'
    },

    events: {
        'submit @ui.form': 'auth',
    },

    show_errors_in_form: function($form, errors) {
        $form.find('.alert').remove();
        $form.find('.has-error').removeClass('has-error');
        $form.find('span.help-block').remove();

        Object.keys(errors).forEach(function(key) {
            if (key === '__all__') {
                $form.prepend(Helpers.create_alert_html(errors[key], 'danger'));
            } else {
                var $input = $form.find('input[name=' + key + ']');
                if ($input.length) {
                    var $parents = $input.parents('.form-group');
                    $parents.addClass('has-error');
                    $parents.append('<span class="help-block">' + errors[key] + '</span>');
                }
            }
        });
    },

    auth: function(event) {
        event.preventDefault();

        var form_view = this;
        var $form = this.ui.form;

        this.options.session_authenticator(
            $form.serializeArray(), 
            function(errors) {
                form_view.show_errors_in_form($form, errors);
            },
            function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        );
    },

});
