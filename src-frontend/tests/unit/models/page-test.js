import { moduleForModel, test } from 'ember-qunit';

moduleForModel('page', 'Unit | Model | page', {
    needs: ['model:procedure', 'model:element']
});

test('it exists', function(assert) {
    var model = this.subject();
    assert.ok(!!model);
});
