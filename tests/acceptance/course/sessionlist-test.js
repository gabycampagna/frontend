/* global moment */
import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'ilios/tests/helpers/start-app';

var application;
var fixtures = {};
var url = '/course/1';
module('Acceptance: Course - Session List', {
  beforeEach: function() {
    application = startApp();
    server.create('user', {id: 4136});
    server.create('school');
    fixtures.sessionTypes = server.createList('sessionType', 1, {
      sessions: [1,2,3,4]
    });
    server.create('course', {
      sessions: [1,2,3,4]
    });
    fixtures.sessions = [];
    fixtures.sessions.pushObject(server.create('session', {
      course: 1,
      sessionType: 1,
      offerings: [1,2,3]
    }));
    fixtures.sessions.pushObject(server.create('session', {
      course: 1,
      sessionType: 1,
    }));
    fixtures.sessions.pushObject(server.create('session', {
      course: 1,
      sessionType: 1,
    }));
    fixtures.sessions.pushObject(server.create('session', {
      course: 1,
      sessionType: 1,
    }));
    let today = moment().hour(8);
    fixtures.offerings = [];
    fixtures.offerings.pushObject(server.create('offering', {
      session: 1,
      startDate: today.format(),
      endDate: today.clone().add(1, 'hour').format(),
    }));
    fixtures.offerings.pushObject(server.create('offering', {
      session: 1,
      startDate: today.clone().add(1, 'day').add(1, 'hour').format(),
      endDate: today.clone().add(1, 'day').add(4, 'hour').format(),
    }));
    fixtures.offerings.pushObject(server.create('offering', {
      session: 1,
      startDate: today.clone().add(2, 'days').format(),
      endDate: today.clone().add(3, 'days').add(1, 'hour').format(),
    }));
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('session list', function(assert) {
  visit(url);

  andThen(function() {
    var container = find('.sessions-list');
    var rows = find('tbody tr', container);
    assert.equal(rows.length, fixtures.sessions.length);
    for(let i = 0; i < fixtures.sessions.length; i++){
      assert.equal(getElementText(find('td:eq(0)', rows.eq(i))), getText(fixtures.sessions[i].title));
      assert.equal(getElementText(find('td:eq(1)', rows.eq(i))), getText(fixtures.sessionTypes[fixtures.sessions[i].sessionType - 1].title));
      assert.equal(getElementText(find('td:eq(4)', rows.eq(i))), fixtures.sessions[i].offerings.length);
    }
  });
});

test('expanded offering', function(assert) {
  visit(url);

  andThen(function() {
    var container = find('.sessions-list');
    click('tbody tr:eq(0) td:eq(4)', container);
    andThen(()=>{
      let dateBlocks = find('tbody tr:eq(2) .offering-block', container);
      assert.equal(dateBlocks.length, 3);
      //the first two offerings are single date offerings
      for(let i = 0; i < 2; i++){
        let block = dateBlocks.eq(i);
        let offering = fixtures.offerings[i];
        assert.equal(getElementText(find('.offering-block-date-dayofweek', block)), getText(moment(offering.startDate).format('dddd')));
        assert.equal(getElementText(find('.offering-block-date-dayofmonth', block)), getText(moment(offering.startDate).format('MMMM Do')));
        assert.equal(getElementText(find('.offering-block-time-time-starttime', block)), getText('Starts:' + moment(offering.startDate).format('LT')));
        assert.equal(getElementText(find('.offering-block-time-time-endtime', block)), getText('Ends:' + moment(offering.endDate).format('LT')));
      }
      //the third offering is multiday
      for(let i = 2; i < 3; i++){
        let block = dateBlocks.eq(i);
        let offering = fixtures.offerings[i];
        let expectedText = 'Multiday' +
          'Starts' + moment(offering.startDate).format('dddd MMMM Do [@] LT') +
          'Ends' + moment(offering.endDate).format('dddd MMMM Do [@] LT');
        assert.equal(getElementText(find('.multiday-offering-block-time-time', block)), getText(expectedText));
      }
    });
  });
});

test('no offerings', function(assert) {
  visit(url);

  andThen(function() {
    var container = find('.sessions-list');
    click('tbody tr:eq(1) td:eq(4)', container);
    andThen(()=>{
        assert.equal(getElementText(find('tbody tr:eq(3)')), getText('This session has no offerings'));
    });
  });
});

test('close offering details by cliking number', function(assert) {
  visit(url);

  andThen(function() {
    var container = find('.sessions-list');
    click('tbody tr:eq(0) td:eq(4)', container).then(()=>{
      assert.equal(find('tbody tr', container).length, 6);
      click('tbody tr:eq(0) td:eq(4)', container).then(()=>{
        assert.equal(find('tbody tr', container).length, 4);
      });
    });
  });
});

test('close offering details with close button', function(assert) {
  visit(url);

  andThen(function() {
    var container = find('.sessions-list');
    click('tbody tr:eq(0) td:eq(4)', container).then(()=>{
      assert.equal(find('tbody tr', container).length, 6);
      click('tbody tr:eq(1) td:eq(0)', container).then(()=>{
        assert.equal(find('tbody tr', container).length, 4);
      });
    });
  });
});

test('new session', function(assert) {
  visit(url);
  var newTitle = 'new session title, woohoo';
  andThen(function() {
    var container = find('.sessions-list');
    click('.sessions-list .detail-actions .add');
    andThen(function(){
      fillIn('.sessions-list .newsession input:eq(0)', newTitle);
      click('.sessions-list .newsession .done');
    });
  });
  andThen(function(){
    assert.equal(currentPath(), 'course.session.index');
    var container = find('.session-overview');
    assert.equal(getElementText(find('.title .content', container)), getText(newTitle));
  });
});
