var fs = require('fs');
var path = require('path');
var queryString = require('querystring');
//var moment = require('moment');
//var chalk = require('chalk');
//var error = chalk.bold.red;
//var info = chalk.bold.gray;

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;
function error500(context, e) {
    context.status = 500;
    console.log(error('\nError Happen: ' + e.toString() + '\n'));
    context.start();
}

function error404(context) {
    context.status = 404;
    console.log(error('Not Mock Path: ' + context.request.pathname));
    context.start();
}

function requestHandler(req) {
    var pathName = req.pathname || '';
    
    var mockFilePath = process.cwd() + '/mock' + pathName;
    
    if (!fs.existsSync(mockFilePath + '.js')) {
        return false;
    }

    // writeLogFile(req, 'Request Path: ' + pathName, 'INFO');
    console.log('Request Path: ' + pathName);
    delete require.cache[require.resolve(mockFilePath)];
    var mockDataHandler = require(mockFilePath);
    return mockDataHandler;
}
exports.getLocations = function () {
    return [
        {
            location: /^\/redirect-local/,
            handler: redirect('redirect-target', false)
        },
        {
            location: /^\/redirect-remote/,
            handler: redirect('http://www.baidu.com', false)
        },
        {
            location: /^\/redirect-target/,
            handler: content('redirectd!')
        },
        {
            location: '/empty',
            handler: empty()
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autocss()
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /\.styl($|\?)/,
            handler: [
                file(),
                stylus()
            ]
        },
        {
            location: /^\/ajax.*/,
            handler: [
                function (context) {
                    try {

                        context.stop();
                        var request = context.request;
                        var mockDataHandler = requestHandler(request);
                        if (mockDataHandler) {
                            var query = queryString.parse(
                                request.search.substr(1)
                            );

                            var postData = request.bodyBuffer || '';
                            var reqBody = queryString.parse(
                                postData.toString()
                            );

                            var data = mockDataHandler.response(
                                query, request, reqBody, context
                            );

                            var contentType = context.header['Content-Type'];

                            // 返回值未指定内容类型，默认按JSON格式处理返回
                            if (!contentType) {
                                contentType = 'application/json;charset=UTF-8';
                                context.content = JSON.stringify(data || {});
                            }

                            var timeout = mockDataHandler.timeout;

                            if (timeout) {
                                setTimeout(function () {
                                    context.start();
                                }, timeout);
                            }
                            else {
                                context.start();
                            }
                        }
                        else {
                            error404(context);
                        }
                    }
                    catch (e) {
                        error500(context, e);
                    }
                }
            ]
        },
        {
            // location: /.php$/,
            location: /\.php($|\?)|^\/index/,
            handler: [
                php(
                    'php-cgi',
                    '',
                    function (context) {
                        var req = context.request;
                        var search = req.search || '';
                        return {
                            pathname: '/mock/index.php',
                            search: search
                                + (search.indexOf('?') === -1 ? '?' : '&')
                                + 'pathname='
                                + req.pathname
                        }
                    }
                )
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
