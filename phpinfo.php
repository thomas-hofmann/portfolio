<?php
header('Content-Type: text/plain; charset=utf-8');

echo 'opcache.enable=' . var_export(ini_get('opcache.enable'), true) . PHP_EOL;
echo 'opcache.file_cache=' . var_export(ini_get('opcache.file_cache'), true) . PHP_EOL;
echo 'opcache.file_cache_only=' . var_export(ini_get('opcache.file_cache_only'), true) . PHP_EOL;
echo 'opcache.validate_timestamps=' . var_export(ini_get('opcache.validate_timestamps'), true) . PHP_EOL;
echo 'opcache_get_status_available=' . (function_exists('opcache_get_status') ? 'yes' : 'no') . PHP_EOL;

if (function_exists('opcache_get_status')) {
    $s = opcache_get_status(false);
    echo 'opcache_enabled_runtime=' . (($s['opcache_enabled'] ?? false) ? 'yes' : 'no') . PHP_EOL;
}
