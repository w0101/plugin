(function ($) {
    function init(options) {
        var config = $.extend({}, $.fn.waterFall.defaults, options);
        var $container = $('.' + config.container);
        if (config.containerWidth > 0) {
            $container.css('width', config.containerWidth);
        }
        var containerWidth = $container.width();
        var line = Math.floor(containerWidth / config.width);
        if (line < config.minRow) {
            line = config.minRow;
        }
        var lineHeight = [];
        for (var i = 0; i < line; i++) {
            lineHeight.push(0);
        }
        $('.' + config.child).each(function(index) {
            var $this = $(this);
            $this.css({
                    'position': 'absolute',
                    'top': lineHeight[index % line] + 'px',
                    'left': (config.width + config.gap) * (index % line) + 'px'
                });

            if ((index + 1) % line !== 0) {
                $this.css('margin-right', config.gap + 'px');
            }
            var height = $this.innerHeight();
            lineHeight[index % line] += (height + config.gap);
        })
    }
    $.fn.waterFall = function(options) {
        init(options);
    }
    $.fn.waterFall.defaults = {
        container: '',
        child: '',
        width: 200,
        gap: 10,
        minRow: 3,
        containerWidth: 0
    }
})(jQuery);