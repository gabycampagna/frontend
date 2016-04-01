import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';
import NewUser from 'ilios/mixins/newuser';

const { inject, computed, isEmpty, isPresent, RSVP } = Ember;
const { service } = inject;
const { Promise } = RSVP;

const Validations = buildValidations({
  username: [
    validator('presence', {
      presence: true,
      dependentKeys: 'allowCustomUserName.content',
      disabled(){
        return !this.get('model.allowCustomUserName.content');
      }
    }),
    validator('length', {
      max: 100
    }),
  ],
  password: [
    validator('presence', true)
  ],
  otherId: [
    validator('length', {
      max: 16
    }),
  ],
});

export default Ember.Component.extend(NewUser, Validations, {
  i18n: service(),
  ajax: service(),
  iliosConfig: service(),

  init(){
    this._super(...arguments);
    this.set('searchResults', []);
    if (isPresent(this.get('searchTerms'))) {
      this.send('findUsersInDirectory');
    }
  },
  classNames: ['new-directory-user'],

  searchResults: [],
  selectedUser: false,
  isSearching: false,
  searchResultsReturned: false,
  tooManyResults: false,
  searchTerms: null,

  allowCustomUserName: computed('iliosConfig.authenticationType', function(){
    return new Promise (resolve => {
      this.get('iliosConfig.authenticationType').then(type => {
        resolve(type === 'form');
      });
    });
  }),

  actions: {
    findUsersInDirectory(){
      let searchTerms = this.get('searchTerms');
      this.set('searchResultsReturned', false);
      this.set('tooManyResults', false);
      if (!isEmpty(searchTerms)) {
        this.set('isSearching', true);
        var url = '/application/directory/search?limit=51&searchTerms=' + searchTerms;
        const ajax = this.get('ajax');
        ajax.request(url).then(data => {
          let mappedResults = data.results.map(result => {
            result.addable = isPresent(result.firstName) && isPresent(result.lastName) && isPresent(result.email) && isPresent(result.campusId);
            return result;
          });
          this.set('tooManyResults', mappedResults.length > 50);
          this.set('searchResults', mappedResults);
          this.set('isSearching', false);
          this.set('searchResultsReturned', true);
        });
      }
    },
    pickUser(user){
      this.set('selectedUser', true);
      this.set('firstName', user.firstName);
      this.set('lastName', user.lastName);
      this.set('email', user.email);
      this.set('campusId', user.campusId);
      this.set('phone', user.telephoneNumber);
      this.set('username', user.username);
    },
    unPickUser(){
      this.set('selectedUser', false);
      this.set('firstName', null);
      this.set('lastName', null);
      this.set('email', null);
      this.set('campusId', null);
      this.set('phone', null);
      this.set('username', null);
    }
  }
});
