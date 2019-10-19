module.exports = {
    async createScreenshot (req, res, appScreenshot,url , appScreenshotFd, post){
        
        try {
            var postImage = await PostImage.create({name: appScreenshot, url: url, fd: appScreenshotFd, owner: post.id}).fetch();
        //    var data = (postImage.screenshot || []).push(postImage.id)
            var resp = await Posts.addToCollection(post.id, 'screenshot').members([postImage.id]);

            console.log( resp)
            res.json(resp)
          } catch (error) {
            res.status(400).send(error.message);
          }
    }
    
}