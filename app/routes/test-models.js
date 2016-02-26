import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    var promises = {
      aamcpcrs: this.store.query('aamc-pcrs', {limit: 2}),
      aamcmethods: this.store.query('aamc-method', {limit: 2}),
      academicYears: this.store.query('academic-year', {limit: 2}),
      alerts: this.store.query('alert', {limit: 2}),
      cohorts: this.store.query('cohort', {limit: 2}),
      competencies: this.store.query('competency', {limit: 2}),
      courselearningmaterials: this.store.query('course-learning-material', {limit: 2}),
      courses: this.store.query('course', {limit: 2}),
      courseClerkshipTypes: this.store.query('course-clerkship-type', {limit: 2}),
      curriculuminventoryinstitutions: this.store.query('curriculum-inventory-institution', {limit: 2}),
      curriculuminventoryreports: this.store.query('curriculum-inventory-report', {limit: 2}),
      curriculuminventoryexports: this.store.query('curriculum-inventory-export', {limit: 2}),
      curriculuminventorysequences: this.store.query('curriculum-inventory-sequence', {limit: 2}),
      curriculuminventorysequenceblocks: this.store.query('curriculum-inventory-sequence-block', {limit: 2}),
      curriculuminventoryacademiclevels: this.store.query('curriculum-inventory-academic-level', {limit: 2}),
      departments: this.store.query('department', {limit: 2}),
      ilmsessions: this.store.query('ilm-session', {limit: 2}),
      instructorgroups: this.store.query('instructor-group', {limit: 2}),
      learnergroups: this.store.query('learner-group', {limit: 2}),
      learningmaterials: this.store.query('learning-material', {limit: 2}),
      learningmaterialuserrole: this.store.query('learning-material-user-role', {limit: 2}),
      learningmaterialstatus: this.store.query('learning-material-status', {limit: 2}),
      meshconcepts: this.store.query('mesh-concept', {limit: 2}),
      meshdescriptors: this.store.query('mesh-descriptor', {limit: 2}),
      meshqualifiers: this.store.query('mesh-qualifier', {limit: 2}),
      meshpreviousindexing: this.store.query('mesh-previous-indexing', {limit: 2}),
      objectives: this.store.query('objective', {limit: 2}),
      offerings: this.store.query('offering', {limit: 2}),
      programyears: this.store.query('program-year', {limit: 2}),
      programs: this.store.query('program', {limit: 2}),
      reports: this.store.query('report', {limit: 2}),
      schools: this.store.query('school', {limit: 2}),
      sessiondescriptions: this.store.query('session-description', {limit: 2}),
      sessionlearningmaterials: this.store.query('session-learning-material', {limit: 2}),
      sessiontypes: this.store.query('session-type', {limit: 2}),
      sessions: this.store.query('session', {limit: 2}),
      terms: this.store.query('term', {limit: 2}),
      users: this.store.query('user', {limit: 2}),
      userroles: this.store.query('user-role', {limit: 2}),
      vocabularies: this.store.query('vocabulary', {limit: 2}),
    };
    return Ember.RSVP.hash(promises);
  },
});
