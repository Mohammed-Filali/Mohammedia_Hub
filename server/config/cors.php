<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */


        'paths' => ['api/*', 'sanctum/csrf-cookie'], // Les routes concernées par CORS
        'allowed_methods' => ['*'], // Autoriser toutes les méthodes (GET, POST, etc.)
        'allowed_origins' => ['http://localhost:5173'], // Autoriser les requêtes depuis ce domaine
        'allowed_origins_patterns' => [],
        'allowed_headers' => ['*'], // Autoriser tous les en-têtes
        'exposed_headers' => [],
        'max_age' => 0,
        'supports_credentials' => true,

];
