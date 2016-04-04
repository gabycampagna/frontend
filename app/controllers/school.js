import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  queryParams: [
    'schoolCompetencyDetails',
    'schoolManageCompetencies',
    'schoolVocabularyDetails',
    'schoolManagedVocabulary',
    'schoolManagedVocabularyTerm',
  ],
  schoolCompetencyDetails: false,
  schoolManageCompetencies: false,
  schoolVocabularyDetails: false,
  schoolManagedVocabulary: null,
  schoolManagedVocabularyTerm: null,
});
