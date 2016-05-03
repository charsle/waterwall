window.onload = function () {
    var Random = Mock.Random;
    Mock.mock('http://127.0.0.1:51117/wall.lk', {
        "success": true,
        "data|20": [{
            'src': 'img19.jpg',
            'desc': '@csentence()'
            }]
    })
    initWater({
        parent: 'wall_warper',
        box: 'miux_wall_box',
        successFun: createHtml,
        loadImg: 'images/loading-2.gif',
        url: 'http://127.0.0.1:51117/wall.lk',
        pageSize: 10
    })

    /**
     * 创建html模版
     * @param   {object}   data ajax数据
     * @returns {[[Type]]} 返回创建的div的节点
     */
    function createHtml(data, parent) {
        console.log(data);
        var oParent = document.getElementById(parent);
        for (var i in data) {
            var oDiv = document.createElement('div');
            oDiv.className = 'miux_wall_box';

            var c_Div = document.createElement('div');
            c_Div.className = 'all_box';

            var img_Div = document.createElement('div');
            img_Div.className = 'wall_box_img';

            var img_ = document.createElement('img');
            img_.src = 'images/' + data[i].src;
            img_Div.appendChild(img_);

            var tool_Div = document.createElement('div');
            tool_Div.className = 'wall_box_tool';

            var btn_Div1 = document.createElement('button');
            var btn_Div2 = document.createElement('button');

            var txt2 = document.createTextNode("采集");
            var txt3 = document.createTextNode(" 点赞");
            btn_Div1.appendChild(txt2);
            btn_Div2.appendChild(txt3);

            var des_Div = document.createElement('div');
            var txt3 = document.createTextNode(data[i].desc);
            des_Div.className = 'wall_box_user';
            des_Div.appendChild(txt3);

            oDiv.appendChild(c_Div);
            c_Div.appendChild(img_Div)

            c_Div.appendChild(tool_Div);
            tool_Div.appendChild(btn_Div1);
            tool_Div.appendChild(btn_Div2);
            c_Div.appendChild(des_Div);

            oParent.appendChild(oDiv);
        }
    }
}

function initWater(json) {
    var parent = json.parent;
    var box = json.box;
    var successFun = json.successFun;

    // console.log(successFun('sss'));

    ajaxRequest();

    var ajaxStatus = true;
    var page = 0;
    window.onscroll = function () {
        if (checkScrollBottom() && ajaxStatus) {
            page++;
            ajaxStatus = false;
            ajaxRequest();
        }
    }

    function ajaxRequest() {
        $.ajax({
            url: json.url,
            type: 'get',
            //            data: {
            //                page: 0,
            //                pageSize: json.pageSize
            //            },
            dataType: 'json',
            beforeSend: function () {
                if (page) {
                    var oParent = document.getElementById(parent);
                    //获取子节点的个数
                    var lastPinH = getLastHeight();
                    var load_div = document.createElement('div');
                    load_div.id = 'loadImg';
                    var load_img = document.createElement('img');
                    load_img.src = json.loadImg;

                    load_div.appendChild(load_img);
                    oParent.appendChild(load_div);
                    load_div.style.position = 'absolute';
                    load_div.style.top = lastPinH + 150 + 'px';
                    load_div.style.width = '100%';
                    load_div.style.backgroundColor = '#ccc';
                    load_div.style.textAlign = 'center';
                    //load_div.style.left = Math.floor((oParent.offsetWidth - load_div.offsetWidth) / 2) +'px';
                }
            },
            success: function (res) {
                successFun(res.data, parent)
                waterWall(parent, box);
            },
            complete: function () {
                if (page) {
                    document.getElementById(parent).removeChild(document.getElementById('loadImg'));
                }
                ajaxStatus = true;
            }
        });



    }
    /**
     * 检查滚动条是否到了底部
     * @returns {[[Type]]} true｜false
     */
    function checkScrollBottom() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var docHeight = document.documentElement.clientHeight || document.body.clientHeight;
        return getLastHeight() < scrollTop + docHeight ? true : false;
    }
    /**
     * [[Description]]
     * @param {[[Type]]} obj  运动对象
     * @param {[[Type]]} top  对象的top
     * @param {[[Type]]} left 对象的left
     */
    var startNum = 0;

    function setMoveStyle(obj, top, left, index, style) {
        if (index <= startNum) {
            return;
        }
        var docmentW = document.documentElement.clientWidth || document.body.clientWidth;
        obj.style.position = 'absolute';
        obj.style.top = getTotalHeight() + 'px';
        obj.style.left = Math.floor((docmentW - obj.offsetWidth) / 2) + 'px';
        //        $(obj).stop().animate({
        //            top: top,
        //            left: left
        //        }, 500);
        obj.style.top = top + 'px';
        obj.style.left = left + 'px';
        startNum = index; //更新索引
    }
    /**
     * 获取总的高度
     * @returns {number} [[Description]]
     */
    function getTotalHeight() {
        var allTotalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        return allTotalHeight
    }

    function getLastHeight() {
        var oParent = document.getElementById(parent);
        //获取子节点的个数
        var aPin = getClassObj(oParent, box);
        var lastPinH = aPin[aPin.length - 1].offsetTop + Math.floor(aPin[aPin.length - 1].offsetHeight / 2);
        return lastPinH;
    }

    function waterWall(parent, child) {
        //获取父元素
        var oParent = document.getElementById(parent);
        //获取子节点的个数
        var aPin = getClassObj(oParent, child);
        //每一个的宽度
        var aPinW = aPin[0].offsetWidth;
        //计算屏幕上最多可以放几个
        var num = Math.floor(document.documentElement.clientWidth / aPinW);
        //让父元素居中显示
        oParent.style.cssText = 'width:' + num * aPinW + 'px;margin:0 auto;';

        //整体高度数组
        var compareArr = [];
        for (var i = 0; i < aPin.length; i++) {
            if (i < num) {
                compareArr[i] = aPin[i].offsetHeight;
            } else {
                var minHeight = Math.min.apply({}, compareArr);
                //获取最小高度
                var minKey = getMinKey(compareArr, minHeight, i);
                setMoveStyle(aPin[i], minHeight, aPin[minKey].offsetLeft)
                compareArr[minKey] += aPin[i].offsetHeight;
            }
        }
    }
    /**
     * 获取数组最小值的键值对
     * @param   {[[Type]]} arr       高度数组
     * @param   {[[Type]]} minHeight 最小高度
     * @returns {[[Type]]} 最小的索引
     */
    function getMinKey(arr, minHeight) {
        for (var key in arr) {
            if (arr[key] == minHeight) {
                return key;
            }
        }
    }
    /**
     * 获取父元素下面的字元素
     * @param {object} parent    [[父元素]]
     * @param {string} className [[子元素]]
     * @returns {object} [[数组]]
     */
    function getClassObj(parent, className) {

        var child = parent.getElementsByTagName('div');
        var childArray = [];
        for (var i = 0; i < child.length; i++) {
            if (child[i].className == className) {
                childArray.push(child[i]);
            }
        }
        return childArray;
    }
}
