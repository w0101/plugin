<?php

    date_default_timezone_set('Asia/Shanghai');

    $config = json_decode(file_get_contents('./config.json'), true);

    $smartyRoot = $config['smarty'];

    require_once "$smartyRoot/Smarty.class.php";

    $smarty = new Smarty();

    $smarty->setCompileDir('/tmp/smarty/templates_c');
    $smarty->setCacheDir('/tmp/smarty/cache');
    $smarty->setConfigDir('/tmp/smarty/configs');
    $smarty->setTemplateDir('../src');
    $smarty->left_delimiter = '{%';
    $smarty->right_delimiter = '%}';

    if (!isset($_GET['pathname'])
        || $_GET['pathname'] == '/mock/index.php'
    ) {
        // $smarty->assign('name', 'test');
        $smarty->display('./index.tpl');
        return;
    }

    $pathname = preg_replace('/\/$/', '', $_GET['pathname']);

    // echo($pathname . '<br>');
    // print_r(__DIR__);

    $route = json_decode(file_get_contents(__DIR__ . "/route.json"), true);

    // var_dump($route);
    // echo('<br>');
    // var_dump($pathname);
    // echo('<br>');

    if (!isset($route[$pathname])) {
        echo($pathname . ' 不存在');
        exit();
    }

    $actionConfig = $route[$pathname];
    $actionPath = $actionConfig['action'];

    // echo(__DIR__ . "/$actionPath");

    require_once __DIR__ . "/$actionPath";

    $data = execute();
    $type = isset($actionConfig['responseType']) ? $actionConfig['responseType'] : getResponseType();

    // var_dump($data);

    if ($type == 'smarty') {

        foreach ($data as $key => $value) {
            $smarty->assign($key, $value);
        }

        $smarty->display($actionConfig['tpl']);

        return;
    }



    // echo json_encode($data);

?>
