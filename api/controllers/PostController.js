/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    list: function (req, res) {
        var perPage = req.query.limit;
        var currentPage = req.query.page;

        var conditions = { status: 'published' };
        PaginationService.paginate(res, Posts, conditions, currentPage, perPage, [], 'createdAt DESC');

    },
    uploadAppIcon: function (req, res) {
        // console.log(sails.config.appPath)
        req.file('attach').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            dirname: require('path').resolve(sails.config.appPath, 'upload/images')
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
            var baseUrl = sails.config.urls.api_url + '/api';
            console.log(req.params.id)
            // Save the "fd" and the url where the avatar for a user can be accessed
            Posts.update({ id: req.params.id }, {

                // Generate a unique URL where the avatar can be downloaded.
                appIcon: require('util').format('%s/post/%s/icon', baseUrl, req.params.id),

                // Grab the first file and use it's `fd` (file descriptor)
                appIconFd: uploadedFiles[0].fd
            })
                .exec(function (err) {
                    console.log(err)
                    if (err) return res.serverError(err);
                    return res.ok();
                });
        });
    },
    /**
     * Download avatar of the user with the specified id
     *
     * (GET /user/avatar/:id)
     */
    getAppIcon: function (req, res) {

        Posts.findOne({ id: req.param('id') }).exec(function (err, post) {

            if (err) return res.serverError(err);
            if (!post) return res.notFound();

            // User has no avatar image uploaded.
            // (should have never have hit this endpoint and used the default image)
            if (!post.appIconFd) {
                return res.notFound();
            }

            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk(/* optional opts */);

            // set the filename to the same file as the user uploaded
            res.set("Content-disposition", "attachment; filename='" + post.title + "'");

            // Stream the file down
            fileAdapter.read(post.appIconFd)
                .on('error', function (err) {
                    return res.serverError(err);
                })
                .pipe(res);
        });
    },
    
    uploadAppScreenshot: function (req, res) {
        // console.log(sails.config.appPath)
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
            Posts.findOne({ id: req.param('id') }).exec(function (err, post) {
                if(err){
                    return res.serverError(err)
                }
                
                PostsService.createScreenshot(req,res, appScreenshot, url, appScreenshotFd, post)
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
    addAppVersion: function(req, res){
        Posts.findOne({ id: req.param('id') }).exec(function (err, post) {
            if(err){
                return res.serverError(err)
            }
            let version = {}
                if (req) {
                    version.release_note = req.body.release_note;
                    version.version = req.body.version;
                    version.version_name = req.body.version_name;
                    version.download_link1 = req.body.download_link1;
                    version.download_link2 = req.body.download_link2;
                }
            AppVersionService.createVersion(req,res, version.version, version.version, version.release_note, version.download_link1, version.download_link2, post)
        })
    },
    /**
     * Download avatar of the user with the specified id
     *
     * (GET /user/avatar/:id)
     */
    getAppScreenshot: function (req, res) {
        if(req.param('0') == undefined){
            return  res.notFound()
        }
        PostImage.findOne({ name: req.param('0') }).exec(function (err, data) {

            if (err) return res.serverError(err);
            if (!data) return res.notFound();

            // User has no avatar image uploaded.
            // (should have never have hit this endpoint and used the default image)
            if (!data.fd) {
                return res.notFound();
            }

            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk(/* optional opts */);

            // set the filename to the same file as the user uploaded
            res.set("Content-disposition", "attachment; filename='" + data.name + "'");

            // Stream the file down
            fileAdapter.read(data.fd)
                .on('error', function (err) {
                    return res.serverError(err);
                })
                .pipe(res);
        });
    },
    async create(req, res) {
        if (req.user == undefined) {
            return res.notFound()
        }
        let blog = {}
        if (req) {
            blog.title = req.body.title;
            blog.content = req.body.content;
            blog.status = req.body.status;
            blog.owner = req.user.id
            // blog.category = 
        }
        if (req.body.category) {
            // Search for an existing user
            const existingCategory = await Category.findOne({
                id: req.body.category
            });

            if (!existingCategory) {
                return res.badRequest('Category not exists.');
            }
            blog.category = req.body.category
        }



        Posts.create(blog).exec((err) => {
            // console.log(err)
            if (err) return res.status(500).send({ error: 'Db error' });
            // res.redirect('/blogs/list')
            res.status(200).json(blog)
        })

    },

    delete: (req, res) => {
        Posts.destroy({ id: req.params.id }).exec((err) => {
            if (err) res.send(500, { error: 'db error' });
            res.ok()
        })
    },
    edit: (req, res) => {
        Posts.findOne({ id: req.params.id }).exec((err, data) => {
            if (err) res.send(500, { error: 'db error' });
            res.json(data)

        })
    },
    get: (req, res) => {

        if (req.query.slug) {
            Posts.findOne({ slug: req.query.slug }).populate('screenshot').populate('versions').populate('categories').exec((err, data) => {
                // console.log("get", req.query.slug)
                if (err) return res.send(500, { error: 'db error' });   
                // console.log("data",data)
                var _data = _.omit( data, ['fd', 'owner'] )
                return res.json(_data   )
            })
        }else{
            Posts.findOne({ id: req.params.id }).populate('screenshot').populate('versions').populate('categories').exec((err, data) => {
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

    update: (req, res) => {
        let q = req.allParams();
        // console.log(q)
        let newData = { title: req.body.title, content: req.body.content, appAuthor: req.body.author, appstoreLink: req.body.appstore_link, previewText: req.body.previewText, rate: req.body.rate, price: req.body.price, categories: req.body.categories };
        Posts.findOne({ id: req.params.id }).exec((err, post) => {
            if (err) res.send(500, { error: 'db error' });
            PostsService.updatePost( req , res, post, newData)

        })
       
    }

};

