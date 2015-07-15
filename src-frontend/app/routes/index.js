import Application from 'src-frontend/routes/application';

export default Application.extend({
    beforeModel: function() {
        this.transitionTo('procedures');
    }
});
