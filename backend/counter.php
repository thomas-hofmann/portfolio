<?php
$counterFile = 'counter.txt';
$cookieName = 'visit_counter_prevent';
$cookieLifetime = 3600; // 1 Stunde

header('Content-Type: application/json');

// Wenn Cookie gesetzt ist → nicht zählen, nur aktuellen Wert ausgeben
if (isset($_COOKIE[$cookieName])) {
    if (file_exists($counterFile)) {
        $count = (int)file_get_contents($counterFile);
    } else {
        $count = 0;
    }
    echo json_encode(['total' => $count, 'status' => 'cached']);
    exit;
}

// Zähler aktualisieren mit Dateisperre (flock)
$count = 0;
$fp = fopen($counterFile, 'c+');
if ($fp === false) {
    // Fehler beim Öffnen der Datei
    http_response_code(500);
    echo json_encode(['error' => 'Could not open counter file']);
    exit;
}

if (flock($fp, LOCK_EX)) {
    // Datei einlesen
    $count = (int)fread($fp, 100);
    rewind($fp);
    ftruncate($fp, 0);
    $count++;
    fwrite($fp, (string)$count);
    fflush($fp);
    flock($fp, LOCK_UN);
} else {
    // Konnte die Sperre nicht bekommen
    http_response_code(500);
    echo json_encode(['error' => 'Could not lock counter file']);
    fclose($fp);
    exit;
}
fclose($fp);

// Cookie setzen, damit innerhalb 1h nicht erneut gezählt wird
setcookie($cookieName, '1', time() + $cookieLifetime, "/");

echo json_encode(['total' => $count, 'status' => 'counted']);