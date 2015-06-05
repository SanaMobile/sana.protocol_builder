import Application from "../routes/application";

export default Application.extend({
    model: function(params) {
        return this.store.find('procedure', params.procedure_id);
    }
});
