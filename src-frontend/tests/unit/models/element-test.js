import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('element', 'Unit | Model | element', {
    needs: ['model:page']
});

test('it has a default element type of ENTRY', function(assert) {
    var element = this.subject();

    assert.equal(element.get('elementType'), 'ENTRY');
});

test('it has a default empty array for choices', function(assert) {
    var element = this.subject();

    assert.deepEqual(element.get('choices'), []);
});

test('it does not have choices when the element type is ENTRY', function(assert) {
    var element = this.subject();

    Ember.run(function() {
        element.set('elementType', 'ENTRY');
    });

    assert.equal(element.get('hasChoices'), false);
});

test('it has choices when the element type is SELECT', function(assert) {
    var element = this.subject();

    Ember.run(function() {
        element.set('elementType', 'SELECT');
    });

    assert.equal(element.get('hasChoices'), true);
});
