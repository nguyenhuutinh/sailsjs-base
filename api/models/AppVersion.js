/**
 * Category.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    no:{
      type:'number',
      
    },
    version_name: {
      type: 'string',
      required: true,
      unique: true,
      // defaultsTo: "未分类"
    },
    version: {
      type: 'number',
      required: true,
      unique: true,
    },
    release_note: {
      type: 'string',
      required: false,
      minLength: 1
    },
    download_link1:{
      type: 'string',
      required: false,
      minLength: 1
    },
    download_link2: {
      type: 'string',
      required: false,
      minLength: 1
    },
    post: {
        model: 'posts'
    },
  },
  beforeCreate: function(obj, next){
    AppVersion.count().exec(function(err, cnt){
        if(err) next();
        else{
            obj['no'] = cnt + 1;
            next();
        }
    })
  },


};

