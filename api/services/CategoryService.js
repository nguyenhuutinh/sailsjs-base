module.exports = {
    async createScreenshot (req, res, appScreenshot,url , appScreenshotFd, cat){
        
        try {
            var postImage = await PostImage.create({name: appScreenshot, url: url, fd: appScreenshotFd, category: cat.id}).fetch();
           var data = (postImage.screenshot || []).push(cat.id)
            var resp = await Category.addToCollection(cat.id, 'screenshot').members([postImage.id]);

            console.log( resp)
            res.json(resp)
          } catch (error) {
            res.status(400).send(error.message);
          }
    }
    
}