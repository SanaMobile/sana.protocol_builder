import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('procedure-card', 'Unit | Component | procedure card', {
    needs: ['helper:date-string'],
    setup: function() {
        // TODO: Remove this workaround after upgrading to Ember 2.0.0:
        // https://github.com/rwjblue/ember-qunit/issues/52#issuecomment-109611759
        this.registry.register('service:-routing', Ember.Object.extend({
            availableRoutes: function() { return ['index']; },
            hasRoute: function(name) { return name === 'index'; },
            isActiveForRoute: function() { return true; },
            generateURL: function() { return "/"; }
        }));
    }
});

var procedure = Ember.Object.create({
    lastModified: new Date("2015-07-17T18:05:41Z"),
});

test('it renders', function(assert) {
    var component = this.subject({ procedure: procedure });
    assert.equal(component._state, 'preRender');

    this.render();

    assert.equal(component._state, 'inDOM');
});
