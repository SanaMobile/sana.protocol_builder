const ACTIVE_SUBROUTINE_CHANGE_EVENT = 'change:activeSubroutine';

const App = require('utils/sanaAppInstance');

const Subroutine = require('models/subroutine');

let Subroutines = Backbone.Collection.extend({

    model: Subroutine,

    comparator: 'display_name',

    initialize : function(models, options){
        this.query = '';
        this.fetch();
    },

    url: function(){
        return '/api/subroutines?search=' + this.query;
    },

    createNewSubroutine: function() {
        const subroutine = new Subroutine({
            name: 'default',
            display_name: 'default',
            description: 'default',
        });

        const self = this;
        subroutine.save({}, {
            success: function() {
                console.info('Created subroutine', subroutine.get('id'));
                self.add(subroutine);
                self.setActiveSubroutine(subroutine);
            },
            error: function() {
                console.warn('Failed to create subroutine', subroutine.get('id'));
                App().RootView.showNotification('Failed to create subroutine!');
            },
        });
    },

    setActiveSubroutine: function(subroutine) {
        if (this.activeSubroutine) {
            this.activeSubroutine.setSelected(false);
        }

        console.log(subroutine);

        this.activeSubroutine = subroutine;
        this.activeSubroutine.setSelected(true);
        this.trigger(ACTIVE_SUBROUTINE_CHANGE_EVENT, subroutine);
    },

    getActiveSubroutine: function() {
        return this.activeSubroutine;
    },
});

Subroutines.ACTIVE_SUBROUTINE_CHANGE_EVENT = ACTIVE_SUBROUTINE_CHANGE_EVENT;
module.exports = Subroutines;
