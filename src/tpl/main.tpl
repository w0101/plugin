<!DOCTYPE html>
<html>
<head>
    <title>water Fall</title>
    <style type="text/css">
        div{
            width: 100px;
            height: 100px;
            padding: 20px;
            border: 5px solid #eee;
        }
    </style>
</head>
<body>
    <div></div>
    <input type="button" id="btn" value="获取数据"/>
    <script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js"></script>
    <script type="text/javascript">
        window.onload = function () {
            $('#btn').click(function () {
                $.ajax({
                    type: 'GET',
                    url: '{%$tplData.mpAjaxUrl|escape:javascript%}',
                    dataType: 'json',
                    success: function (data) {
                        console.log(data);
                        var img = $('<img src="' + data.data.tplData.imgPath + '"/>');
                        $('div').append(img);
                    }
                });
            })
        }
    </script>
</body>
</html>