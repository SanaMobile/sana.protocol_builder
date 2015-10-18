module.exports = Marionette.Behavior.extend({

    ui: {
        form: 'form'
    },

    events: {
        'submit @ui.form': 'auth',
    },

    show_errors_in_form: function($form, errors) {
        $form.find('.alert').text(null);
        $form.find('.has-error').removeClass('has-error');
        $form.find('span').remove();

        Object.keys(errors).forEach(function(key) {
            if (key === '__all__') {
                $form.find('.alert').text(errors[key]);
            } else {
                var $input = $form.find('input[name=' + key + ']');
                if ($input.length) {
                    var $parents = $input.parents('.form-group');
                    $parents.addClass('has-error');
                    $parents.append('<span>' + errors[key] + '</span>');
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
