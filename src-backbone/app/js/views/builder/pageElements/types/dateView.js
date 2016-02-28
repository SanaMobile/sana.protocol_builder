module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageElements/types/dateView'),

    ui: {
        'datepicker': 'div.input-group.date',
        'dateField': 'input.date',
    },

    events: {
        'change @ui.dateField': '_onDateFormChanged',
    },

    onRender: function() {
        this.ui.datepicker.datepicker({
            todayBtn: 'linked',
            clearBtn: true,
            autoclose: true,
            language: i18n.language,
            format: 'mm/dd/yyyy',
        });
    },

    _onDateFormChanged: function(event) {
        let date = this.ui.dateField.val();

        this.model.debounceSave({
            answer: date,
        });
    },

});
