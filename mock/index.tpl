<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title>mock</title>
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
        }
        #wrapper {
            margin: 10px;
            display: none;
        }

        li {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div id="wrapper">
        <h4>mock</h4>
        <ul>
        </ul>
    </div>
    <script type="text/javascript">

        function buildLi(host, path, args) {
            return ''
                + '<li>'
                +   '<a href="http://'
                +     host
                +     '/'
                +     path + args
                +     '" target="_blank">'
                +   path
                +   '</a>'
                + '</li>'
        }

        window.onload = function () {
            var host = window.location.host;

            var liStr = ''
                + buildLi(
                    host,
                    'index',
                    ''
                    // 加上从卡片跳转过来的参数
                    // '?serverTime=1403681435437'
                    // + '&pvid=1403681435435490'
                    // + '&resourceid=29300'
                    // + '&subqid=1403681435435490'
                    // + '&sid=0'
                    // + '&pssid=0'
                    // + '&tn=baidu'
                    // + '&qid=16187461473511931986'
                    // + '&wd=%E5%8C%97%E4%BA%AC%E5%A9%9A%E7%BA%B1%E6%91%84%E5%BD%B1'
                    // + '&zt=ps'
                    // + '&query=%E5%8C%97%E4%BA%AC%E5%A9%9A%E7%BA%B1%E6%91%84%E5%BD%B1'
                    // + '&F_tagA='
                    // + '&F_tagB='
                    // + '&F_tagP=%E5%8C%97%E4%BA%AC'
                );

            var ulContainer = document.getElementsByTagName('ul')[0];
            ulContainer.innerHTML += liStr;

            document.getElementById('wrapper').style.display = 'block';
        }
    </script>
</body>
</html>
