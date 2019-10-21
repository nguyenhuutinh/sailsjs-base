module.exports = {
  async createScreenshot(req, res, appScreenshot, url, appScreenshotFd, post) {

    try {
      var postImage = await PostImage.create({ name: appScreenshot, url: url, fd: appScreenshotFd, owner: post.id }).fetch();
      //    var data = (postImage.screenshot || []).push(postImage.id)
      var resp = await Posts.addToCollection(post.id, 'screenshot').members([postImage.id]);

      console.log(resp)
      res.json(resp)
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  async anAsyncFunction(cat_id, post_id){
    try {
      var cat =  await Category.find({ id: cat_id });
      var update =
      console.log(post_id, cat)
    } catch (error) {
      return res.status(404).send(error.message);
    }
  },
  async updatePost(req, res, post, newdata) {
    var {categories} = newdata
    
    if (categories && categories.length > 0) {
      console.log("aaa")
      await Category.addToCollection(categories[0], 'posts', [post.id]);
      // await Promise.all(categories.map((record, index) => {
      //   this.anAsyncFunction(record, post.id)
      // }))
      // try{
        
        var resp = await Posts.addToCollection(post.id, 'categories').members(categories  );
      //   console.log(resp)
      // }catch(error){
      //   return res.status(400).send(error.message);
      // }
      
      
      
    }
    try {
      var _data = _.omit(newdata, 'categories')
      var post = await Posts.update({id: post.id}, _data)
      return res.json(post)
    } catch (error) {
      return res.status(404).send(error.message);
    }


  }

}