import { moduleForModel, test } from 'ember-qunit';

moduleForModel('procedure', 'Unit | Model | procedure', {
    needs: ['model:page']
});

test('it exists', function(assert) {
    var model = this.subject();
    assert.ok(!!model);
});
