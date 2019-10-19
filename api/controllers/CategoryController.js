/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    list: function (req, res) {
        var perPage = req.query.limit;
        var currentPage = req.query.page;

        var conditions = { };
        PaginationService.paginate(res, Category, conditions, currentPage, perPage, [], 'createdAt DESC');

    },
    uploadCatScreenshot: function (req, res) {
        console.log(sails.config.appPath)
        req.file('attach').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            dirname: require('path').resolve(sails.config.appPath, 'upload/screenshot')
        }, function whenDone(err, uploadedFiles) {
            console.log(err)
            if (err) {
                return res.serverError(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }
            

            // Get the base URL for our deployed application from our custom config
            // (e.g. this might be "http://foobar.example.com:1339" or "https://example.com")
            var baseUrl = sails.config.urls.api_url + '/api/images/';
            // Generate a unique URL where the avatar can be downloaded.
            var appScreenshot = uploadedFiles[0].filename.replace(/ /g,"_")
            // resp.appScreenshot.add(appScreenshot)
            // Grab the first file and use it's `fd` (file descriptor)
            var appScreenshotFd = uploadedFiles[0].fd
            var url = baseUrl + appScreenshot
            Category.findOne({ id: req.param('id') }).exec(function (err, cat) {
                CategoryService.createScreenshot(req,res, appScreenshot, url, appScreenshotFd, cat)
                // Posts.update({ id: req.params.id }, {
                //     appScreenshot : (post.appScreenshot || [] ).push(appScreenshot),
                //     appScreenshotFd : (post.appScreenshotFd || [] ).push(appScreenshotFd),
                //     })
                //     .exec(function (err ) {
                //         console.log(err)
                //         if (err) return res.serverError(err);
                //         return res.ok();
                //     });
            })
            
        });
    },
    create: (req, res) => {
        // console.log(req.user)
        let blog = {}
        if (req) {
            blog.name = req.body.name;
        }
        
        Category.create(blog).exec((err) => {
            console.log(err)
            if (err) res.status(500).send({ error: 'Db error' });
            res.status(200).json(blog)
        })

    },
    get: (req, res) => {

        if (req.query.slug) {
            Category.findOne({ slug: req.query.slug }).populate('owner').exec((err, data) => {
                // console.log("get", req.query.slug)
                if (err) return res.send(500, { error: 'db error' });   
                // console.log("data",data)
                var _data = _.omit( data, ['fd', 'owner'] )
                return res.json(_data   )
            })
        }else{
            Category.findOne({ id: req.params.id }).populate('screenshot').exec((err, data) => {
                console.log("get", data)
                if (err) return res.send(500, { error: 'db error' });
                var _data = data
                _data.screenshot = (data.screenshot || [] ).map((record)=>{
                   var record = _.omit( record, [ 'createdAt','updatedAt' ,  'fd', 'owner'] )
                   record.uid = record.id;
                   record.status = 'done'
                   return record
                })
                // console.log("data", _data)
                return res.json(_data   )
                

            })
        }
        // return res.notFound()

    },

    delete: (req, res) => {
        Category.destroy({ id: req.params.id }).exec((err) => {
            if (err) res.send(500, { error: 'db error' });
            res.ok()
        })
    },
    edit: (req, res) => {
        Category.findOne({ id: req.params.id }).exec((err, data) => {
            if (err) res.send(500, { error: 'db error' });
            res.ok()

        })
    },

    update: (req, res) => {
        let q = req.allParams();
        // console.log(q)
        let newData = { title: req.body.title_edited, body: req.body.body_edited };
        let t = req.body.title_edited;
        let b = req.body.body_edited;

        Category.update({ id: req.params.id }, newData).exec((err) => {
            if (err) res.send(500, { error: 'db error' });

            res.ok()
        })
    }

};

