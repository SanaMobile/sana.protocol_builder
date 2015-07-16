import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('modal-dialog', 'Unit | Component | modal dialog', {
    // needs: ['component:foo', 'helper:bar']
});

test('it exists', function(assert) {
    var component = this.subject();
    assert.ok(!!component);
});

test('it renders', function(assert) {
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    // TODO: Find a way to get this to pass in the PhantomJS environment
    // TODO: Find a way to prevent this from hijacking the testem environment in Chrome
    // this.render();

    // assert.equal(component._state, 'inDOM');
});
