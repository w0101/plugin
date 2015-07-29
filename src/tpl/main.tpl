<!DOCTYPE html>
<html>
<head>
    <title>water Fall</title>
    <link rel="stylesheet" type="text/css" href="src/css/main.less"></link>
</head>
<body>
    <div class="container">
        {%foreach $tplData.dataList as $item%}
            <div class="block">
                <img src="{%$item.imgUrl|escape:'html'%}"/>
                <p class="des">{%$item.text|escape:'html'%}</p>
            </div>
        {%/foreach%}
    </div>
    <script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js"></script>
    <script type="text/javascript" src='src/js/waterFall.js'></script>
    <script type="text/javascript">
        window.onload = function () {
            $('.container').waterFall({
                container: 'container',
                child: 'block',
                width: 298
            });
        }
    </script>
</body>
</html>