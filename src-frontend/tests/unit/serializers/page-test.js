import { moduleForModel, test } from 'ember-qunit';

moduleForModel('page', 'Unit | Serializer | page', {
    // Specify the other units that are required for this test.
    needs: ['serializer:page', 'model:procedure', 'model:element']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
});
