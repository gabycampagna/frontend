import { moduleForModel, test } from 'ember-qunit';
import {a as testgroup} from 'ilios/tests/helpers/test-groups';
import modelList from '../../helpers/model-list';

moduleForModel('vocabulary', 'Unit | Model | vocabulary' + testgroup, {
  // Specify the other units that are required for this test.
  needs: modelList
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});