import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { run } = Ember;

moduleForComponent('search-box', 'Integration | Component | search box', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{search-box}}`);

  assert.equal(this.$('input[type=search]').length, 1);
});

test('clicking search focus input and calls search', function(assert) {
  this.on('search', function(value){
    assert.equal(value, '');
  });
  this.render(hbs`{{search-box search=(action 'search')}}`);
  run(() => {
    this.$('span').click();
    assert.ok(this.$('input').is(":focus"));
  });
});

test('typing calls search', function(assert) {
  this.on('search', function(value){
    assert.equal(value, 'typed it');
  });
  this.render(hbs`{{search-box search=(action 'search')}}`);
  run(() => {
    this.$('input').val('typed it');
    this.$('input').trigger('change');
    this.$('input').trigger('keypress', {which: 50});
  });
});

test('escape calls clear', function(assert) {
  this.on('clear', function(){
    assert.ok(true);
  });
  this.on('search', parseInt)
  this.render(hbs`{{search-box search=(action 'search') clear=(action 'clear')}}`);
  run(() => {
    this.$('input').val('typed it');
    this.$('input').trigger('change');
    this.$('input').trigger($.Event('keyup', { keyCode: 27 }));
  });
});