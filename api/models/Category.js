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
    name: {
      type: 'string',
      required: true,
      unique: true,
      // defaultsTo: "未分类"
    },
    previewText: {
      type: 'string',
      required: false,
      minLength: 1
    },
    posts: {
      collection: 'posts',
      via: 'categories'
    },
    numOfArticles:{
      type:'number',
    },
    screenshot: {
      collection: 'postimage',
      via: 'category',
      // dominant: true
    },
  },
  beforeCreate: function(obj, next){
    Category.count().exec(function(err, cnt){
        if(err) next();
        else{
            obj['no'] = cnt + 1;
            next();
        }
    })
  },
  afterCreate: function(category, cb){
    Category.findOne({id: category.id}).populate('posts').exec(function(err, category){
      this.numOfArticles = category.posts.length;
      cb();
    });
  },

  afterUpdate: function(category, cb){
    Category.findOne({id: category.id}).populate('posts').exec(function(err, category){
      this.numOfArticles = category.posts.length;
      cb();
    });
  },

  updateNumOfArticles: function(category, cb){
    Category.findOne({id: category.id}).populate('posts').exec(function(err, category){
      this.numOfArticles = category.posts.length;
      cb();
    });
  }


};

