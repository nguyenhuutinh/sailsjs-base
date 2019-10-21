module.exports = {
    async createVersion (req, res, version_name, version, release_note, download_link1, download_link2, post){
        
        try {
            var version = await AppVersion.create({version_name: version_name, version: version, release_note: release_note, download_link1 : download_link1, download_link2: download_link2, post: post.id}).fetch();
        //    var data = (postImage.screenshot || []).push(postImage.id)
            var resp = await Posts.addToCollection(post.id, 'versions').members([version.id]);

            console.log( resp)
            res.json(resp)
          } catch (error) {
            res.status(400).send(error.message);
          }
    }
    
}