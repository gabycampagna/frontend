import Ember from 'ember';
import DS from 'ember-data';

const {Component, computed, RSVP, inject} = Ember;
const {PromiseArray} = DS;
const {equal} = computed;
const {service} = inject;

export default Component.extend({
  store: service(),
  isSaving: false,
  classNames: ['detail-view'],
  sessions: [],
  sessionsToOverride: [],
  noSessionsAsIs: equal('sessionsToOverride.length', 0),
  publishableCollapsed: true,
  unPublishableCollapsed: true,
  allSessionsAsIs: computed('sessionsToOverride.[]', 'overridableSessions.[]', function(){
    return this.get('sessionsToOverride').get('length') === this.get('overridableSessions').get('length');
  }),
  publishableSessions: computed('sessions.[]', function(){
    let defer = RSVP.defer();
    
    this.get('sessions').then(sessions=>{
      let filteredSessions = sessions.filter(session => {
        return session.get('allPublicationIssuesLength') === 0;
      });
      
      defer.resolve(filteredSessions);
    });
    
    return PromiseArray.create({
      promise: defer.promise
    });
  }),
  unPublishableSessions: computed('sessions.[]', function(){
    let defer = RSVP.defer();
    
    this.get('sessions').then(sessions=>{
      let filteredSessions = sessions.filter(session => {
        return session.get('requiredPublicationIssues').get('length') > 0;
      });
      
      defer.resolve(filteredSessions);
    });
    
    return PromiseArray.create({
      promise: defer.promise
    });
  }),
  overridableSessions: computed('sessions.[]', function(){
    let defer = RSVP.defer();
    
    this.get('sessions').then(sessions=>{
      let filteredSessions = sessions.filter(session => {
        return (
          session.get('requiredPublicationIssues').get('length') === 0 &&
          session.get('optionalPublicationIssues').get('length') > 0
        );
      });
      
      defer.resolve(filteredSessions);
    });
    
    return PromiseArray.create({
      promise: defer.promise
    });
  }),
  publishCount: computed(
    'publishableSessions.length',
    'sessionsToOverride.length',
    function(){
      return parseInt(this.get('publishableSessions.length')) + parseInt(this.get('sessionsToOverride.length'));
    }
  ),
  scheduleCount: computed(
    'publishableSessions.length',
    'sessionsToOverride.length',
    'overridableSessions.length',
    function(){
      return parseInt(this.get('publishableSessions.length')) + 
             parseInt(this.get('overridableSessions.length')) -
             parseInt(this.get('sessionsToOverride.length'));
    }
  ),
  ignoreCount: computed(
    'sessionsToOverride.length',
    'overridableSessions.length',
    function(){
      return parseInt(this.get('overridableSessions.length')) -
             parseInt(this.get('sessionsToOverride.length'));
    }
  ),
  actions: {
    toggleSession(session){
      if(this.get('sessionsToOverride').contains(session)){
        this.get('sessionsToOverride').removeObject(session);
      } else{
        this.get('sessionsToOverride').pushObject(session);
      }
    },
    publishAllAsIs(){
      this.get('overridableSessions').forEach(session =>{
        if(!this.get('sessionsToOverride').contains(session)){
          this.get('sessionsToOverride').pushObject(session);
        }
      });
    },
    publishNoneAsIs(){
      this.get('overridableSessions').forEach(session =>{
        if(this.get('sessionsToOverride').contains(session)){
          this.get('sessionsToOverride').removeObject(session);
        }
      });
    },
    save(){
      this.set('isSaving', true);
      let publishEvent = this.get('store').createRecord('publish-event');
      let asIsSessions = this.get('sessionsToOverride');
      publishEvent.save().then(savedPublishEvent => {
        let promises = [];
        this.get('overridableSessions').forEach(session =>{
          session.set('publishedAsTbd', !asIsSessions.contains(session));
          session.set('publishEvent', savedPublishEvent);
          promises.pushObject(session.save());
        });
        this.get('publishableSessions').forEach(session => {
          session.set('publishEvent', savedPublishEvent);
          promises.pushObject(session.save());
        });
        RSVP.all(promises).then(()=>{
          this.set('isSaving', false);
        });
      });
      
    },
    togglePublishableCollapsed(){
      this.set('publishableCollapsed', !this.get('publishableCollapsed'));
    },
    toggleUnPublishableCollapsed(){
      this.set('unPublishableCollapsed', !this.get('unPublishableCollapsed'));
    }
  }
});