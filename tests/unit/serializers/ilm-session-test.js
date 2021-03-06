import { moduleForModel, test } from 'ember-qunit';

moduleForModel('ilm-session', 'Unit | Serializer | ilm session', {
  // Specify the other units that are required for this test.
  needs: [
    'model:session',
    'model:learner-group',
    'model:instructor-group',
    'model:user',
    'serializer:ilm-session'
  ]
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
