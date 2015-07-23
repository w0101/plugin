<?php

function execute() {
    return json_decode(file_get_contents(__DIR__ . "/main.json"), true);
}

function getResponseType() {
    return "smarty";
}