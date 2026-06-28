<?php
header('Content-Type: application/json; charset=utf-8');

// API Infos
$API_KEY = "w547tgiprgmypbdzz6hs41geopwtolhntn0zvngw";
$MEDIUM_FEED = "https://medium.com/feed/@thomas-hofmann";
$rssToJsonUrl = "https://api.rss2json.com/v1/api.json?rss_url=" . urlencode($MEDIUM_FEED) . "&api_key=" . $API_KEY;

// Cache-Datei (liegt im gleichen Ordner)
$cacheFile = __DIR__ . "/medium.json";
$cacheTTL  = 60 * 30; // 30 Minuten Gültigkeit

// Wenn Cache existiert und noch frisch ist → direkt ausgeben
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTTL)) {
    echo file_get_contents($cacheFile);
    exit;
}

// API abrufen
$response = @file_get_contents($rssToJsonUrl);

if ($response === false) {
    // Fallback: alte Datei, falls vorhanden
    if (file_exists($cacheFile)) {
        echo file_get_contents($cacheFile);
        exit;
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Medium Feed konnte nicht geladen werden"]);
        exit;
    }
}

// Ergebnis speichern
file_put_contents($cacheFile, $response);

// Ausgabe
echo $response;