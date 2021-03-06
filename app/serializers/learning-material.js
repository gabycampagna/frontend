import Ember from 'ember';
import DS from 'ember-data';

const { get } = Ember;

export default DS.RESTSerializer.extend({
  isNewSerializerAPI: true,
  serialize: function(snapshot, options) {
    var json = this._super(snapshot, options);

    //When POSTing new file learningMaterials we need to include the file hash
    const fileHash = get(snapshot.record, 'fileHash');
    if (fileHash) {
      json.fileHash = fileHash;
    }
    
    //don't persist this, it is handled by the server
    delete json.absoluteFileUri;
    delete json.uploadDate;

    return json;
  }
});
