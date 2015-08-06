<!DOCTYPE html>
<html>
<head>
    <title>water Fall</title>
    <link rel="stylesheet" type="text/css" href="src/css/main.less"></link>
</head>
<body>
    <div class="container">
        {%foreach $tplData.dataList as $item%}
            <div class="block need-render">
                <img src="{%$item.imgUrl|escape:'html'%}"/>
                <p class="des">{%$item.text|escape:'html'%}</p>
            </div>
        {%/foreach%}
    </div>
    <script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js"></script>
    <script type="text/javascript" src='src/js/waterFall.js'></script>
    <script type="text/javascript">
        function success(data) {
            var dataList = data.data.tplData.dataList;
            for (var i = 0; i < dataList.length; i++) {
                var img = new Image();
                img.src = dataList[i].imgUrl;
                $('.container').append(
                    $('<div class="block need-render"></div>')
                        .append(img)
                        .append($('<p class="desc"></p>').html(dataList.text))
                );
            }
        }
        window.onload = function () {
            $('.container').waterFall({
                container: 'container',
                child: 'need-render',
                width: 298,
                ajaxUrl: '/ajax/data'
            }).loader(success);

        }
    </script>
</body>
</html>