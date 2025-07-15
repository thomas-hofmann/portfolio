<?php
$jsonFile = 'data.json';
$rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@thomas-hofmann';

// Daten aus JSON-Datei laden
if (!file_exists($jsonFile)) {
    exit;
}

$data = json_decode(file_get_contents($jsonFile), true);
if ($data === null) {
    exit;
}

// RSS-Feed abrufen
$response = @file_get_contents($rssUrl);
if ($response === false) {
    exit;
}

$rssData = json_decode($response, true);
if (!isset($rssData['items'][0]['pubDate'])) {
    exit;
}

// Datum des neuesten Artikels holen
$latestPubDate = $rssData['items'][0]['pubDate'];

// Prüfen und ggf. aktualisieren
if ($data['last-article-pub-date'] !== $latestPubDate) {
    $data['article-counter'] += 1;
    $data['last-article-pub-date'] = $latestPubDate;

    // Neue Daten speichern
    file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Keine Ausgabe
exit;