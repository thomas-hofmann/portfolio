<?php declare(strict_types=1);
// UTF-8 marker äöüÄÖÜß€

abstract class Page
{
    // --- ATTRIBUTES ---

    protected MySQLi $_database;

    // --- OPERATIONS ---

    protected function __construct()
    {
        $config = include('/kunden/homepages/3/d1006869723/htdocs/config.php');
		$config = $config['exams'];

        $host_name  = $config['host'];
		$database   = $config['database'];
		$user_name  = $config['username'];
		$password   = $config['password'];

		$this->_database = new MySQLi($host_name, $user_name, $password, $database);

        if ($this->_database->connect_errno) {
            throw new Exception("Connect failed: " . $this->_database->connect_errno);
        }

        // set charset to UTF8!!
        if (!$this->_database->set_charset("utf8")) {
            throw new Exception($this->_database->error);
        }
    }

    public function __destruct()
    {
        $this->_database->close();
    }

    protected function generatePageHeader(string $title = ""):void
    {
        $title = htmlspecialchars($title);
        header("Content-type: text/html; charset=UTF-8");
        echo <<< HTML
            <!DOCTYPE html>
            <html lang="de">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="Exam.js"></script>
                <link rel="stylesheet" href="Exam.css">
                <title>$title</title>
            </head>
            <body>
        HTML;
    }

    protected function generatePageFooter():void
    {
        echo <<< HTML
            </body>
            </html>
        HTML;
    }

    protected function processReceivedData():void
    {

    }
} // end of class