<?php

// Simple Laravel-style "Hello World" demo
header('Content-Type: application/json');

$response = [
    'message' => 'Hello from Laravel',
    'framework' => 'PHP Laravel',
    'version' => phpversion(),
    'timestamp' => date('Y-m-d H:i:s')
];

echo json_encode($response, JSON_PRETTY_PRINT);
