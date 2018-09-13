/**
 * 程序员客栈通用公共库
 *
 * 包含内容：
 * - config
 * - data
 *     - emojis
 *     - emotions
 * - widget
 *     - confirm
 *     - message
 *     - publisher
 * - util
 *
 * @author dong <ddliuhb@gmail.com>
 */

// namespace
var inn = {};

inn.documentTitle = document.title;

inn.event = {};
inn.event.ready = function(cb) {
    $(cb);
}

// 配置
inn.config = {
    mobile: false,
    cdn: 'http://inncdn.b0.upaiyun.com/',
    emoji_url: 'http://inncdn.b0.upaiyun.com/emojis/',
    emotion_url: 'http://oostatic.b0.upaiyun.com/image/emotion/',
};

// 数据
inn.data = {};

// 组件
inn.widget = {};

/**
 * 确认modal
 * @param  {Object}   options
 *         - title
 *         - message
 *         - icon
 * @param  {Function} cb
 */
inn.widget.confirm = function(options, cb) {
    options = $.extend({
        'title': '提示',
        'message': '确认吗？',
        'icon': 'warning circle',
        'type': 'basic'
    }, options);
    if (options.type == 'basic' ) {
        var template = '\
            <div class="ui basic modal">\
              <i class="close icon"></i>\
              <div class="header">\
                ' + options.title + '\
              </div>\
              <div class="content">\
                <div class="image">\
                  <i class="' + options.icon + ' icon"></i>\
                </div>\
                <div class="description">\
                  <p>' + options.message + '</p>\
                </div>\
              </div>\
              <div class="actions">\
                <div class="two fluid ui inverted buttons">\
                  <div class="ui red basic cancel inverted button">\
                    <i class="remove icon"></i>\
                    取消\
                  </div>\
                  <div class="ui green basic ok inverted button">\
                    <i class="checkmark icon"></i>\
                    确定\
                  </div>\
                </div>\
              </div>\
            </div>\
            ';
    } else {
        var template = '\
            <div class="ui modal small">\
            <i class="close icon"></i>\
            <div class="header">\
            ' + options.title + '\
            </div>\
          <div class="content">\
            <div class="image">\
              <i class="' + options.icon + ' icon"></i>\
            </div>\
            <div class="description">\
              <p>' + options.message + '</p>\
            </div>\
          </div>\
            <div class="actions">\
                <div class="ui black deny button">\
                取消\
                </div>\
                <div class="ui positive right labeled icon button">\
                确定\
                <i class="checkmark icon"></i>\
                </div>\
                </div>\
            </div>\
        ';
    }

    var modal = $(template.trim()).modal({
        duration: 0,
        onDeny: function() {
            cb(false);
        },
        onApprove: function() {
            cb(true);
        }
    }).modal('show');
};

/**
 * 提示消息
 * @param  {Object} options
 *         - title
 *         - message
 *         - redirect
 *         - icon
 *         - type: 提示类型，info, success, warning, error
 */
inn.widget.message = function(options) {
    var icons = {
        success: 'green checkmark',
        info: 'info circle',
        warning: 'yellow warning circle',
        error: 'red remove circle',
    };

    options = $.extend({
        title: '提示',
        type: 'info',
    }, options);

    if (!options.icon) {
        options.icon = icons[options['type']];
    }

    var $content = $('\
        <div class="ui page dimmer">\
            <div class="content">\
              <div class="center">\
                <h3 class="ui inverted icon header">\
                    <i class="' + options.icon + ' icon"></i>\
                    ' + options.message + ' \
                </h2>\
              </div>\
            </div>\
        </div>\
    '.trim());

    setTimeout(function() {
        $content.appendTo($('body')).dimmer({
            onHide: function() {
                setTimeout(function() {
                    $content.remove();
                }, 600);
            }
        }).dimmer('show');

    }, 50);

    if (options.redirect) {
        setTimeout(function() {
            window.location.href = options.redirect;
        }, 2000);
    }

    // $('body').append($content).dimmer('show');
};

// 用户信息卡片
inn.widget.userCard = {
    cache: {},
    userid: null,
    nickname: null,
    current: null,
    $popup: null,
    $source: null,
    left: null,
    top: null,
    closeTimeout: null,
    init: function() {
        var self = this;
        $(document).on('mouseenter', '.getuserinfo', function(e) {
            var $source = $(this);
            var userid = $source.attr('userid');
            var nickname = $source.text();
            var key = self.getKey(userid, nickname);

            self.close();

            self.$source = $(this);
            self.userid = userid;
            self.nickname = nickname;
            self.key = key;
            self.left = e.pageX + 10;
            self.top = e.pageY + 10;
            self.show();
        });

        $(document).on('mouseleave', '.getuserinfo', function() {
            self.closeTimeout = setTimeout(function() {
                self.close();
                self.closeTimeout = null;
            }, 300);
        });
    },
    show: function() {
        var self = this;
        var userid = self.userid;
        var nickname = self.nickname;
        var key = self.key;
        self.getInfo(userid, nickname, function(err, info) {
            if (err || self.key != key) {
                return;
            }

            if (self.$popup) {
                self.$popup.remove();
            }

            var html = self.render(info);
            self.$popup = $('<div></div>').css({ position: "absolute", left: self.left, top: self.top, display: 'none'}).appendTo($('body')).fadeIn('fast').html(html);
            self.$popup.on('mouseenter', function() {
                if (self.closeTimeout) {
                    clearTimeout(self.closeTimeout);
                    self.closeTimeout = null;
                }
            }).on('mouseleave', function() {
                self.close();
            });
        });
    },
    close: function() {
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = null;
        }
        this.$popup && this.$popup.remove();
        this.$popup = null;
        this.$source = null
        this.left = null
        this.top = null;
        this.key = null;
        this.userid = null;
        this.nickname = null;
    },
    getKey: function(userId, nickname) {
        return userId?userId:nickname;
    },
    getInfo: function(userid, nickname, cb) {
        var key = this.getKey(userid, nickname);
        if (this.cache.hasOwnProperty(key)) {
            return cb(null, this.cache[key]);
        }

        var self = this;

        $.ajax({
            type: "POST",
            dataType: "json",
            url: baseUrl + "api/user/get_info",
            data: {userid: userid, usernickname: nickname},
            success: function(msg) {
                if (!msg.status || msg.status == 'login') {
                    return cb(new Error('failed'));
                }

                self.cache[key] = msg;
                cb(null, msg);
            },
            error: function(err) {
                cb(err);
            }
        });
    },
    render: function(msg) {
        if (msg.data.user_relation == 'priority') {
            var relationhtml = "<a class='btn_quaned do_quantacancel' title='点击取消关注'>已关注</a>";
        } else if (msg.data.user_relation == 'shield') {
            var relationhtml = "<a href='" + baseUrl + "u/" + msg.data.uid + "' class='btn_quaned' target='_blank' title='点击取消屏蔽'>已屏蔽</a>";
        } else {
            var relationhtml = "<a class='btn_quan do_quanta'>关注</a>";
        }
        if (msg.data.remark != null) {
            var userremarkhtml = "<a class='f12' id='user_remark_set' title='点击修改备注'>(" + msg.data.remark + ")</a>";
        } else {
            var userremarkhtml = "<a class='f12' id='user_remark_set' title='点击设置备注'>(备注)</a>";
        }
        if (msg.data.typename != null) {
            var usertypenamehtml = "<a target='_blank' href='" + baseUrl + "/Index/user?w=usertype&n=" + msg.data.type + "'>" + msg.data.typename + "</a>";
        } else {
            var usertypenamehtml = "";
        }
        var inhtml = "<div class='ui card user_info_top_div' userid='" + msg.data.uid + "'>"
            + "<div class='content'>"
            + "      <div class='author'>"
            + "        <img class='ui avatar image' src='" + msg.data.icon_url + "' /> <a href='" + baseUrl + "u/" + msg.data.uid + "' target='_blank'>" + msg.data.nickname + "</a> " + userremarkhtml
            + "        <span class='right floated time user_info_top_div_quan_p_do'>"
            + "        <i class='like icon'></i>" + relationhtml
            + "        </span>"
            + "      </div>"
            + "    </div>"
            + "    <div class='content user_info_main_div'>"
            + "      <div class='description'><span class='category'>"
            + "        <i class='location arrow icon'></i><a target='_blank' href='" + baseUrl + "Index/user?province=" + msg.data.province_id + "&city=" + msg.data.city_id + "'>" + msg.data.city + "</a> &nbsp; <a target='_blank' href='" + baseUrl + "Index/user?occupation=" + msg.data.occupation_id + "&direction=" + msg.data.direction_id + "'>" + msg.data.direction + "</a> &nbsp; "
            + "      </span></div>"
            + "      <div class='description'><i class='idea icon'></i>" + msg.data.introduction + "</span></div>"
            + "    </div>"
            + "    <div class='extra content meta'><i class='trophy icon'></i>等级:" + msg.data.degree + " &nbsp; <i class='unhide icon'></i>关注: " + msg.data.follow + " &nbsp; <i class='users icon'></i>粉丝:<span id='quaned_nums_common'>" + msg.data.fans + "</span></div>"
            + "  </div>";


        // $('.user_info_div').css({ position: "absolute", left: positionleft, top: positiontop }).fadeIn('fast').html(inhtml);

        return inhtml;
    }
}

if (!inn.config.mobile) {
    inn.event.ready(function() {
        inn.widget.userCard.init();
    });
}


// 查看联系方式
inn.widget.viewContact = {
    init: function(uid) {
        var self = this;
        $('body').on('click', '.view_connect_btn', function() {
            // 未登录
            if (inn.data.uid == '0') {
                $('.ajax_login_btn').trigger('click');
                return;
            }
            self.$btn = $(this);
            self.uid = self.$btn.attr('userid');
            var url = self.$btn.attr('url');
            self.load(0, url);
            return false;
        });
    },
    load: function(confirm, url) {
        var me = this;
        if (this.$btn.hasClass('ui')) {
            this.$btn.addClass('loading');
        } else {
            $Inn.loading.show();
        }
        confirm = confirm?1:0;

        !url && (url = '/resume/view/' + this.uid + '?confirm=' + confirm);
        url = baseUrl + url.substr(1, url.length);
        var $wrapper = $('<div></div>');
        $('body').append($wrapper);
        $wrapper.load(url, function() {
            if (me.$btn.hasClass('ui')) {
                me.$btn.removeClass('loading');
            } else {
                $Inn.loading.hide();
            }
        });
        this.$wrapper = $wrapper;
    },
    onReady: function($modal) {
        var self = this;

        $modal.modal({
            onApprove: function() {
                self.close($modal);
                setTimeout(function() {
                    self.load(true);
                }, 1000);
            },
            onHidden: function() {
                self.close($modal);
            }
        });

        $modal.modal('show');
    },
    close: function($modal) {
        var self = this;
        if (this.$btn.hasClass('ui')) {
            this.$btn.removeClass('loading');
        } else {
            $Inn.loading.hide();
        }
        $modal.remove();
        self.$wrapper.remove();
    }
}

inn.event.ready(function() {
    inn.widget.viewContact.init();
})

// 作品赞按钮
inn.event.ready(function() {
    var ua = navigator.userAgent;
    var isAndroid = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    $('body').on('click', 'a[data-widget=works_plus_btn]', function(){
        var $this = $(this);
        var wid = $this.data("id");
        var $num = $this.find('em,[data-role=number]');

        inn.ajax.post({
            url: '/ajax/worksplustoggle',
            data: {
                wid: wid
            },
            success: function (data) {
                if (data.status == -4) {
                    if (isAndroid) {
                        window.app_event.user_login();
                    } else {
                        window.app_event('user_login');
                    }
                } else {
                    $num.html(data.data.count);
                    $this.toggleClass('active');
                }
            }
        })
    });
});

// 关注按钮
inn.event.ready(function() {
    $('body').on('click', 'a[data-widget=user_follow_btn]', function() {
        var $this = $(this);
        var uid = $this.data('uid');
        var $number = $this.find('[data-role=number]');
        var status = $this.hasClass('active');

        var url = status? "/ajax/quantacancel": "/ajax/quanta";
        inn.ajax.post({
            url: url,
            data:{uid: uid}
        }).done(function(data) {
            $this.toggleClass('active');
        }).fail(function(data) {
            inn.widget.message({
                type: 'error',
                message: data.info
            });
        });
    });
});

// 简历赞按钮
inn.event.ready(function() {
    var ua = navigator.userAgent;
    var isAndroid = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    $('body').on('click', 'a[data-widget=resume_plus_btn]', function() {
        var $this = $(this);
        var uid = $this.data('uid');
        var $number = $this.find('[data-role=number]');
        $this.addClass('loading');
        inn.ajax.post({
            url: "/ajax/resumeplustoggle",
            data: {to_user_id : uid},
            success: function (data) {
                $this.removeClass('loading');
                if (data.status == -4) {
                    if (isAndroid) {
                        window.app_event.user_login();
                    } else {
                        window.app_event('user_login');
                    }
                } else {
                    $number.html(data.data);
                    $this.toggleClass('active', data.status == 2);
                }
            }
        });
    });
});

// 邀请更新履历
inn.event.ready(function() {
    $('body').on('click', 'a[data-widget=view_invite_btn]', function() {
        // $(this).addClass("loading");
        var userid = $(this).data("uid");
        var $resumediv = '<div id="resume_div"></div>';
        $(".main").after($resumediv);
        $("#resume_div").load(baseUrl + "resume/viewinvite/" + userid);
        return false;
    });
});

// 系统消息
inn.event.ready(function() {
    var $markread = $('[data-widget="message-box"] [data-role="mark-all-read"]');
    var titleBilnkArr = '';
    function updateView(msg) {
        if (msg.data.totalNums != 0) {
            if(!inn.titleBlinking) {
                titleBilnkArr = titleBilnk();
            }
            $('.message_nav_icon').addClass('red').transition('tada');
            $markread.show();
        } else {
            clearBlink(titleBilnkArr);
            inn.titleBlinking = false;
            $('.message_nav_icon').removeClass('red');
            $markread.hide();
        }
        if (msg.data.messageSystemNums != 0) {
            $('#message_system_nums').show().html(msg.data.messageSystemNums);
        } else {
            $('#message_system_nums').hide();
        }
        if (msg.data.messageProjectNums != 0) {
            $('#message_project_nums').show().html(msg.data.messageProjectNums);
        } else {
            $('#message_project_nums').hide();
        }
        if (msg.data.messageCommunityReplyNums != 0) {
            $('#message_comment_nums').show().html(msg.data.messageCommunityReplyNums);
        } else {
            $('#message_comment_nums').hide();
        }
        if (msg.data.messageCommunityAtNums != 0) {
            $('#message_at_nums').show().html(msg.data.messageCommunityAtNums);
        } else {
            $('#message_at_nums').hide();
        }
        if (msg.data.messageCommunityNums != 0) {
            $('#message_plus_nums').show().html(msg.data.messageCommunityNums);
        } else {
            $('#message_plus_nums').hide();
        }
        if (msg.data.messageCoinNums != 0) {
            $('#message_coin_nums').show().html(msg.data.messageCoinNums);
        } else {
            $('#message_coin_nums').hide();
        }

        var allMessageNums = parseInt(msg.data.messageSystemNums) + parseInt(msg.data.messageProjectNums) + parseInt(msg.data.messageCommunityReplyNums) + parseInt(msg.data.messageCommunityAtNums) + parseInt(msg.data.messageCommunityNums) + parseInt(msg.data.messageCoinNums);
        if (allMessageNums != 0) {
            $('#J_messageNums').show().html(allMessageNums)
        } else {
            $('#J_messageNums').hide()
        }
    }
    // 标题闪烁
    function titleBilnk(){
        if(inn.config.mobile){
            return false;
        }
        var step = 0,
            _title = inn.documentTitle;
        var timer = setInterval(function() {
          step++;
          if (step == 3) {step = 1};
          if (step == 1) {document.title = '【　　　】' + _title};
          if (step == 2) {document.title = '【您有新消息】' + _title};
        }, 500);
        inn.titleBlinking = true;
        return [timer, _title];
    }
    // 停止闪烁
    function clearBlink(timerArr){
        if(timerArr) {
          clearInterval(timerArr[0]);
          document.title = timerArr[1];
        }
    }

    function mseeageNumsOnce() {
        $.ajax({
            type: "POST",
            url: "/ajax/getmessage",
            global: false,
            data: {acquireseconds: 'default'},
            dataType: "json",
            success: function (msg) {
                if (msg.status == 'ok') {
                    var acquiremilliseconds = msg.data.acquireSeconds;
                    updateView(msg);
                    setTimeout(mseeageNumsOnce, acquiremilliseconds);
                }
            },
            timeout: 10000,
            error: function () {
                $('#message_talk_nums_div').fadeIn('fast');
                $('#message_talk_content_info_p').html('系统检测到您断网了!');
                setTimeout(mseeageNumsOnce, 1000);
            }
        });
        $('#message_talk_nums_span_close').click(function () {
            $('#message_talk_nums_div').fadeOut('fast');
        });
    }
    // 登录后调用消息接口
    if (inn.data.uid != '0') {
        mseeageNumsOnce();
    }

    // 全部标记已读
    $markread.on('click', function() {
        inn.ajax.post({
            url: '/message/ajaxMarkAllAsRead'
        }).done(function() {
            updateView(
                {"data":{"totalNums":"0","messageAtNums":"0","messageCommentNums":"0","messageSystemNums":"0","messageCoinNums":"0"}}
            );
        });
    });
});

// 头部搜索
inn.event.ready(function() {
    var $container = $('[data-widget=top-search]');
    var $dropdown;
    var counter = 0;
    var cache = {};
    function initDropdown() {
        if (!$dropdown) {
            $dropdown = $('<div class="dropdown" style="display:none;"></div>')
            $container.append($dropdown);
        }
    }
    function get(keyword, cb) {
        if (cache.hasOwnProperty(keyword)) {
            return cb(cache[keyword]);
        }

        inn.ajax.get({
            url: '/search/ajaxSuggestion',
            data: {
                keyword: keyword
            }
        }).done(function(data) {
            cache[keyword] = data;
            cb(data);
        });
    }
    initDropdown();

    $container.find('input').on('keyup focus', function() {

        counter++;
        var currentCounter = counter;

        var keyword = $(this).val().trim();
        if (!keyword) {
            var history = inn.localStorage.get('search_history');
            if (!history) {
                $dropdown.hide();
            } else {
                var html = '';
                html = '<div class="header">搜索历史</div><ul class="history">' + history.map(function(keyword) {
                    return '<li class="clearfix"><a rel="nofollow" href="javascript:;" data-value="'+keyword+'">' + keyword + '</a></li>'
                }).join('') + '</ul>';
                $dropdown.html(html).show();
            }

            return true;
        }

        get(keyword, function(data) {
            if (currentCounter != counter) return;
            var users = data.data.users.list;
            var works = data.data.works.list;

            if (!users.length && !works.length) {
                $dropdown.hide();
                return;
            }

            var html = '';
            if (users.length) {
                html += '<div class="header">用户（ID，一句话简介，个人介绍中包含关键词的用户）</div><ul class="users">' +
                    users.map(function(user) {
                        return '<li class="clearfix"><a href="/u/' + user.uid + '"><div class="avatar"><img src="' + user.icon_url_small + '"></div><div class="info"><em>' + user.nickname + '</em><span>' + (user.introduction?user.introduction:'') + '</span></div></a></li>';
                    }).join('') +
                    '</ul>';
            }
            if (works.length) {
                html += '<div class="header">作品（作品名称，介绍包括关键词的作品）</div><ul class="works">' +
                    works.map(function(work) {
                        return '<li class="clearfix"><div class="avatar"><a href="/u/' + work.uid + '"><img src="' + work.icon_small + '"></div><div class="name"><a href="' + work.url + '" target="_blank" class="clearfix"><em>' + work.name + '</em></div><div class="description"><span>' + work.description + '</span></div></li>';
                    }).join('') +
                    '</ul>';
            }

            html += '<div class="footer"><a  rel="nofollow"href="javascript:;" data-role="submit">查看所有</a></div>';
            $dropdown.html(html).show();
        });
    }).on('blur', function() {
        setTimeout(function() {
            $dropdown.hide();
        }, 500);
    });

    $container.on('click', 'a[data-role=submit]', function() {
        $container.find('form').submit();
        return false;
    });

    $container.find('form').on('submit', function() {
        var keyword = $container.find('input').val().trim();
        if (keyword == '') {
            return false;
        }
        var history = inn.localStorage.get('search_history', []);
        var index = history.indexOf(keyword);
        if (index != -1) {
            history.splice(index, 1);
        }
        history.unshift(keyword);
        if (history.length > 5) {
            history = history.slice(0, 5);
        }
        inn.localStorage.set('search_history', history);
    });

    $container.on('click', '.history a', function() {
        var keyword = $(this).data('value');
        $container.find('input').val(keyword);
        $container.find('form').submit();
    });
});

inn.widget.login = function() {
    if (inn.config.mobile) {
        window.location.href='/';
    } else {
        var $resumediv = '<div id="resume_div"></div>';
        $(".main").after($resumediv);
        $("#resume_div").load(baseUrl + "user/notloginajax");
    }
}

// 需要登录的链接
inn.event.ready(function() {
    if (!inn.data.uid) {
        $('body').on('click', 'a[data-widget=login]', function() {
            inn.widget.login();
            return false;
        });
    };
});

// 上传组件
inn.widget.Uploader = function(options) {
    var $container = options.element;
    seajs.use(['/Public/plugin/droppermaster/jquery.fs.dropper.js', '/Public/plugin/droppermaster/jquery.fs.dropper.css'], function() {
        seajs.importStyle('\
            .inn-uploader .filelists { margin: 10px 0; }\
            .inn-uploader .filelists h5 { margin: 5px 0 0; }\
            .inn-uploader .filelist { margin: 0; padding: 1px 0; }\
            .inn-uploader .filelistuploaded { margin: 0; padding: 1px 0; }\
            .inn-uploader .filelist li { background: #fff; border-bottom: 1px solid #eee; font-size: 14px; list-style: none; padding: 5px; }\
            .inn-uploader .filelistuploaded li { background: #fff; border-bottom: 1px solid #eee; font-size: 14px; list-style: none; padding: 5px; }\
            .inn-uploader .filelist li:before { display: none; }\
            .inn-uploader .filelistuploaded li:before { display: none; }\
            .inn-uploader .filelist li .file { color: #333; }\
            .inn-uploader .filelistuploaded li .file { color: #333; }\
            .inn-uploader .filelist li .progress { color: #666; float: right; font-size: 10px; text-transform: uppercase; }\
            .inn-uploader .filelist li .delete { color: red; cursor: pointer; float: right; font-size: 10px; text-transform: uppercase; }\
            .inn-uploader .filelist li.complete .progress { color: green; }\
            .inn-uploader .filelist li.error .progress { color: red; }\
            .dropper-input{width:0px}\
        ');
        var html = '<div class="inn-uploader"">\
        <div class="dropped"></div>\
        <div class="filelists">\
            <ol class="filelistuploaded">\
                <li><span class="file">name</span><i class="trash icon link" value="file-id"></i></li>\
            </ol>\
            <ol class="filelist complete"></ol>\
            <ol class="filelist queue"></ol>\
        </div>\
    </div>';
        html = '';
        var files = $container.data('files');
        if (files) {
            for (var i = 0; i < files.length; i++) {
                html += '<li><span class="file">' + files[i].file_name + '</span><i class="trash icon link" value="' + files[i].file_id + '"></i></li>';
            };
        }
        html = '<div class="inn-uploader"">\
            <div class="dropped"></div>\
            <div class="filelists">\
                <ol class="filelistuploaded">\
                    ' + html + '\
                </ol>\
                <ol class="filelist complete"></ol>\
                <ol class="filelist queue"></ol>\
            </div>\
        </div>';
        $container.html(html);

        var $filequeue = $container.find('.filelist.queue');
        var $filelist = $container.find('.filelist.complete');
        var $dropped = $container.find('.dropped');
        $dropped.dropper({
            action: "/userfile/upload",
            label: options.label,
            maxSize: 10485760,
            postData: {group:options.group}
        }).on("start.dropper", onStart)
          .on("complete.dropper", onComplete)
          .on("fileStart.dropper", onFileStart)
          .on("fileProgress.dropper", onFileProgress)
          .on("fileComplete.dropper", onFileComplete)
          .on("fileError.dropper", onFileError);

        $(window).one("pronto.load", function() {
            $dropped.dropper("destroy").off(".dropper");
        });

        $container.on('click', '.trash', function(){
            var $this = $(this);
            var fileid = $this.attr("value");
            if (!fileid) {
                $this.parent().slideUp('fast');
                return;
            }
            inn.ajax.post({
                url: '/userfile/delete',
                data: {file_id : fileid},
                dataType: "json"
            }).done(function(data){
                $this.parent().slideUp('fast');
            }).fail(function(data) {
                alert(data.info);
            });
        });

        function onStart(e, files) {
            console.log("Start");

            var html = '';

            for (var i = 0; i < files.length; i++) {
                html += '<li data-index="' + files[i].index + '"><span class="file">' + files[i].name + '</span><span class="progress">Queued</span><i class="trash icon link"></i></li>';
            }

            $filequeue.append(html);
        }

        function onComplete(e) {
            console.log("Complete");
            // All done!
        }

        function onFileStart(e, file) {
            console.log("File Start");

            $filequeue.find("li[data-index=" + file.index + "]")
                      .find(".progress").text("0%");
        }

        function onFileProgress(e, file, percent) {
            console.log("File Progress");

            $filequeue.find("li[data-index=" + file.index + "]")
                      .find(".progress").text(percent + "%");
        }

        function onFileComplete(e, file, response) {
            console.log("File Complete");

            var error = '';
            if (response.status === undefined) {
                error = '上传失败';
            } else if (response.status < 0) {
                error = response.info;
            }
            if (error) {
                $filequeue.find("li[data-index=" + file.index + "]").addClass("error")
                          .find(".progress").text(error);
            } else {
                var $target = $filequeue.find("li[data-index=" + file.index + "]");

                $target.find(".file").text(file.name);
                $target.find(".trash").attr({"value":response.data.file_id});
                $target.find(".progress").remove();
                $target.appendTo($filelist);
            }
        }

        function onFileError(e, file, error) {
            console.log("File Error");

            $filequeue.find("li[data-index=" + file.index + "]").addClass("error")
                      .find(".progress").text("Error: " + error);
        }
    });
};

// 初始化上传组件
inn.event.ready(function() {
    $('[data-widget=uploader]').each(function() {
        var $this = $(this);
        var options = {
            element: $this,
            label: $this.data('label') || '点击或拖拽文件到这里',
            group: $this.data('group') || 'default',
            files: $this.data('files') || [],
        };

        new inn.widget.Uploader(options);
    });
});

inn.event.ready(function() {
    $('[data-widget=recharge-tips]').on('click', function() {
        inn.widget.message({
            message: '目前正在申请线上支付系统，开通之前请联系QQ号121670155先进行线下充值。'
        });
        return false;
    });
});

// 杂项
inn.util = {};

// 异步请求(通用json格式)
inn.ajax = function(params) {
    var result = $.Deferred();

    params = $.extend({
        cache: false,
        dataType: 'json'
    }, params);

    $.ajax(params).then(function(data) {
        if (!data.hasOwnProperty('status')) {
            result.reject({
                status: -6,
                info: '请求失败，请稍候重试',
                data: null
            });
        } else if (data.status == 'login' || data.status == -4) {
            inn.widget.login();
            // result.reject(data);
        } else if (data.status < 0) {
            result.reject(data);
        } else {
            result.resolve(data);
        }
    }, function(err) {
        result.reject({
            status: -6,
            info: '请求失败，请稍候重试',
            data: null
        });
    });

    return result;
};

inn.ajax.get = function(params) {
    params.type = 'GET';
    return inn.ajax(params);
}

inn.ajax.post = function(params) {
    params.type ='POST';
    return inn.ajax(params);
}

// 本地存储
inn.localStorage = {
    get: function(key, defaultValue) {
        var result = localStorage.getItem(key);
        if (result === null) {
            return defaultValue;
        }
        return JSON.parse(result);
    },
    set: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: function(key) {
        localStorage.removeItem(key);
    },
    clear: function(key) {
        localStorage.clear();
    }
}