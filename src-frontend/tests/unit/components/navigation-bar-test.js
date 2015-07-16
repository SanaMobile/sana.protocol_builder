import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('navigation-bar', 'Unit | Component | navigation bar', {
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

test('it renders', function(assert) {
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    this.render();

    assert.equal(component._state, 'inDOM');
});
