seajs.config({
    base: inn.config.sta_url + '/js/',
    charset: 'utf-8',
    map: [
        [ /^(.*\.(?:css|js))(.*)$/i, '$1?version=' + inn.config.cdn_version ]
    ],
    paths: {
        'plugin': inn.config.sta_url + '/plugin',
        'css': inn.config.sta_url + '/css',
        'jsPath': '/Public/js',
        'page': inn.config.sta_url + '/js_dev/page',
        'common': inn.config.sta_url + '/js_v2/common',
        'plugins': inn.config.sta_url + '/js_v2/plugins'
    },
    alias: {
        core: 'inn/core.js',
        util: 'inn/util.js',
        common: '/Public/js_v2/common.js',
        lodash: 'inn/cmd_lib/lodash.js',
        bindMobile: 'inn/widget/bind_mobile',
        qrcode: 'inn/cmd_lib/qrcode.js',
        popup: 'inn/cmd_lib/magnific-popup.js',
        slick: 'inn/cmd_lib/slick.js',
        webuploader: 'inn/cmd_lib/webuploader.js',
        colorpicker: 'inn/cmd_lib/spectrum.js',
        datetimepicker: 'inn/cmd_lib/datetimepicker.js',
        template: 'inn/cmd_lib/template.js',
        countdown: 'inn/cmd_lib/jquery.countdown.js',
        semanticui: inn.config.sta_url + '/semanticui/semantic.min.js',
        wangEditor: inn.config.sta_url + '/plugin/wangEditor/js/wangEditor.min.js',
    }
});
