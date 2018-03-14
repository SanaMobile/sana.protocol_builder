const Element = require('models/element');

module.exports = Element.extend({
    urlRoot: '/api/abstractElements',

    toJSON: function() {
        let json = _.pick(this.attributes,
            'id',
            'display_index',
            'concept',
            'subroutine',
            'page',
            'element_type',
            'question',
            'required'
        );

        if (this.isChoiceBased()) {
            json.choices = this.choices.pluck('text');
            json.answer = this.choices.getDefaultAnswers();
        } else if (this.isPluginBased()) {
            json.action = this.get('action');
            json.mime_type = this.get('mime_type');
        } else {
            json.answer = [
                this.get('answer')
            ];
        }

        return json;
    },
});
