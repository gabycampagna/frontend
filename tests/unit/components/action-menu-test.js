import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('action-menu', 'ActionMenuComponent', {
  // specify the other units that are required for this test
  needs: [
    'helper:fa-icon',
    'component:rl-dropdown',
    'component:rl-dropdown-container',
    'component:rl-dropdown-toggle'
  ]
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  assert.equal(component._state, 'inDOM');
});
