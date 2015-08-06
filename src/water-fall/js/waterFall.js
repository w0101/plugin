(function ($) {
    var lineHeight = [];
    var line;
    var config;
    var $container;
    function init(options) {
        config = $.extend({}, $.fn.waterFall.defaults, options);
        $container = $('.' + config.container);
        var containerWidth = $container.width();
        lineInit(containerWidth);
        render(false);
    }
    function lineInit(containerWidth) {
        line = Math.floor(containerWidth / config.width);
        if (line < config.minRow) {
            line = config.minRow;
        }
        for (var i = 0; i < line; i++) {
            lineHeight[i] = 0;
        }
    }
    function findMinHeight () {
        var minHeight = lineHeight[0];
        var minLine = 0;
        for (var i = 1; i < line; i++) {
            if (minHeight > lineHeight[i]) {
                minHeight = lineHeight[i];
                minLine = i;
            }
        }
        return minLine;
    }
    function render(resize) {
        var renderClass = config.child;
        if (resize) {
            renderClass = 'block';
        }
        $('.' + renderClass).each(function(index) {
            var $this = $(this);
            var minLine = findMinHeight();

            $this.css({
                    'position': 'absolute',
                    'top': lineHeight[minLine] + 'px',
                    'left': (config.width + config.gap) * (minLine) + 'px'
                });

            if ((minLine + 1) !== line) {
                $this.css('margin-right', config.gap + 'px');
            }
            var height = $this.innerHeight();
            lineHeight[minLine] += (height + config.gap);
            $this.removeClass(config.child);
        });

    }
    $.fn.waterFall = function(options) {
        init(options);
        $(window).resize(function () {
            if (!config.resize) {
                return;
            }
            var callbackRun = false
            setTimeout(function () {
                if (callbackRun) {
                    return;
                }
                callbackRun = true;
                var width = $container.width();
                lineInit(width);
                render(true);
            }, 100);
        });
        return this.waterFall;
    }
    $.fn.waterFall.loader = function (success, end) {
        $(window).scroll(function (e) {
            var minLine = findMinHeight();
            var minHeight = lineHeight[minLine];
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var ajax = false;
            if (scrollTop >= minHeight - document.documentElement.clientHeight) {
                if (!ajax) {
                    $.ajax({
                        url: config.ajaxUrl,
                        type: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            success(data);
                            render(false);
                            ajax = false;
                        }
                    });
                    ajax = true;
                }
                
            }
        })
    }
    $.fn.waterFall.defaults = {
        container: '',
        child: '',
        width: 200,
        gap: 10,
        minRow: 3,
        resize: true,
        ajaxUrl: ''
    }
})(jQuery);