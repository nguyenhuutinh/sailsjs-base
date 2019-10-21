/**
 * Post.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    no:{
      type: 'number'
    },
    title: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 150,
   
    },
    appIcon: {
      type: 'string',
      minLength: 1
    },
    appIconFd: {
      type: 'string',
      minLength: 1
    },
    screenshot: {
      collection: 'postimage',
      via: 'post',
      // dominant: true
    },
    categories: {
      collection: 'category',
      via: 'posts',
      // dominant: true
    },
    versions: {
      collection: 'appversion',
      via: 'post',
      // dominant: true
    },
    
    appAuthor:{
      type: 'string',
      minLength: 1
    },
    appstoreLink:{
      type: 'string',
      minLength: 1
    },
    downloadLink:{
      type: 'string',
      minLength: 1
    },
    rate:{
      type: 'number',
      defaultsTo: 5
    },
    price:{
      type: 'string',
      minLength: 1
    },
    previewText: {
      type: 'string',
      required: false,
      minLength: 1
    },
    content: {
      type: 'string',
      required: true,
      minLength: 1
    },
    
    slug: {
       type: 'slug',
      from: 'title',
      
    },
    
    status: {
      type: 'string',
      isIn: ['drafted', 'published'],
      required: true
    },
    pageViews: {
      type: 'json',
      columnType: 'array'
    },
    pageViewsCount: {
      type: 'number',
      defaultsTo: 0
    },
    author:{
      type: 'string',
      required: false
    },
    picture:{
      type: 'string'
    },
    tagsArray:  {
      type: 'json',
      columnType: 'array'
    },
    /*This parameter is active when the article is in the publish status*/
    archiveTime:{
      type: 'string',
    },

    /*Article to user is a many-to-many association*/
    owner: {
      model: 'user',
      required: true
    },
    /*Article to tags is a many-to-many association*/
    tags: {
      collection: 'tags',
      via: 'posts',
      dominant: true
    },
    /*article to archive is a one-to-many association*/
    archive: {
      model: 'archives',
    },
   

  },
  beforeCreate: function(obj, next){
    Posts.count().exec(function(err, cnt){
        if(err) next();
        else{
            obj['no'] = cnt + 1;
            next();
        }
    })
  }

};

