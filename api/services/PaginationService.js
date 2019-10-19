/**
 * PaginateService.js
 */
var _ = require('lodash');
module.exports = {
    paginate: function(res, model, criteria, currentPage, perPage, populate_data, sort) {
        var _pagination = {
            pageNum: parseInt(currentPage) || 0,
            pageSize: parseInt(perPage) || 20
        };
        var conditions = criteria || {};
        var populate_data = populate_data || [];
        model.count(conditions).then(function(count) {
            var findQuery = model.find(conditions);
            if (sort) {
                findQuery = findQuery.sort(sort);
            }
            // console.log(findQuery)
            if (_.isArray(populate_data) && !_.isEmpty(populate_data)) {
                _(populate_data).forEach(function(populate) {
                    if(_.isObject(populate)){
                        findQuery = findQuery.populate(populate.name, populate.query);
                    } else {
                        findQuery = findQuery.populate(populate);
                    }
                });
            }
            findQuery = findQuery.paginate(_pagination.pageNum, _pagination.pageSize);
            return [count, findQuery];
        }).spread(function(count, data) {
            var numberOfPages = Math.ceil(count / _pagination.pageSize);
            var nextPage = parseInt(_pagination.page) + 1;
            var pagination = {
                page: _pagination.pageNum,
                perPage: _pagination.pageSize,
                previousPage: (_pagination.pageNum > 1) ? parseInt(_pagination.pageNum) - 1 : false,
                nextPage: (numberOfPages >= nextPage) ? nextPage : false,
                pageCount: numberOfPages,
                total: count
            }
            return ResponseService.json(200, res, undefined, data, pagination);
        }).catch(function(err) {
            return ResponseService.jsonResolveError(err, res);
        });
    },
}