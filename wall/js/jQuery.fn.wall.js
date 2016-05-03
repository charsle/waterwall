(function ($) {
    var MiuxWall = function (ele, options) {
        this.elements = ele;
        var defaults = {
            itemSelector: '.box',
            method: '',
            isAnimated: true,
            getResource: function (index) {}
        };
        this.setting = $.extend({}, defaults, options);
    };
    MiuxWall.prototype = {
        resize: function () {
            var $this = this;
            $(window).scroll(function () {
                //console.log($this.checkscrollside());
                if ($this.checkscrollside() && $this.onOff) {
                    $this.onOff = false;
                    if ($this.setting.method == '' || typeof $this.setting.method == {} || typeof $this.setting.method == 'function') {
                        throw '请配置正确的方法名';
                    } else {
                        console.log($this.checkscrollside());
                        // $this.getAjaxData();
                    }
                };
            })
        },
        renderHtml:function(){
            
        },
        getAjaxData: function () {
            var $this = this;
            $.getJSON($this.setting.method, function (res) {
                // console.log(res);
                if (res.success) {
                    for (var i = 0; i < res.data.length; i++) {
                        //(function (i) {
                        var newDom = $this.addHTMLDom(res.data[i].src);
                        $this.elements.append(newDom);
                        $this.init();
                        //})(i)
                    }
                    // $this.onOff=true;
                }

            });
        },
        addHTMLDom: function (img) {
            return [
                '<div class="miux_wall_box">',
                '<div class="all_box">',
                '    <div class="wall_box_img">',
                '        <img src="' + img + '">',
                '    </div>',
                '    <div class="wall_box_tool pt10">',
                '        <button>采集</button>',
                '        <button>点赞</button>',
                '    </div>',
                '    <div class="wall_box_user pt10">',
                '        阿斯顿卡上的阿克苏河',
                '    </div>',
                ' </div>',
                '</div>'

            ].join('');
        },
        init: function () {
            //获取父节点的宽度
            var $parentWidth = $('.right').width();
            //获取传入下面的所有的div
            var $childBoxs = this.elements.find('>div');
            //计算第一个的宽度是多少
            var $childWidth = $childBoxs.eq(0).outerWidth();
            //计算在父节点下可以现实几列
            var $cols = Math.floor(($parentWidth / $childWidth));
            //重置瀑布流整体宽度
            this.elements.css({
                width: $childWidth * $cols,
                'margin': '0 auto',
            })
            this.getAllBoxHeightArr($childBoxs, $cols);
        },
        //存储每个盒子的高度
        getAllBoxHeightArr: function (childBoxs, cols) {
            var boxArr = new Array();
            childBoxs.each(function (index, value) {
                var $boxHeight = childBoxs.eq(index).outerHeight();
                if (index < cols) {
                    boxArr.push($boxHeight);
                } else {
                    var $minHeight = Math.min.apply(null, boxArr); //计算最小的高度
                    var $minHeightIndex = $.inArray($minHeight, boxArr);
                    $(value).css({
                        position: 'absolute',
                        top: $minHeight,
                        left: childBoxs.eq($minHeightIndex).position().left
                    });
                    boxArr[$minHeightIndex] += childBoxs.eq(index).outerHeight();
                }
            });
        },
        //检查是否在在底部
        checkscrollside: function () {
            var $childBoxs = this.elements.find('>div');
            var lastBoxHeight = $childBoxs.last().offset().top + Math.floor($childBoxs.last().height());
            var scrollTop = $(window).scrollTop();
            var documentH = $(window).height(); //页面高度
            this.elements.height(lastBoxHeight);
            return (lastBoxHeight < scrollTop + documentH) ? true : false;
        }
    }
    $.fn.MiuxWall = function (options) {
        var $this = $(this);
        var wall = new MiuxWall($this, options);
        wall.init();
        // wall.resize();
    }
})(jQuery);
