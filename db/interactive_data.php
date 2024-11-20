<?php

define("RESPONSE_CODE_OK", 200);
define("RESPONSE_CODE_NOT_FOUND", 404);
define("RESPONSE_CODE_SERVER_ERROR", 500);

/**
Manages data in a single interactive
*/
class Interactive_Data
{
  private $conn;
  private $interactiveId;
  private $interactiveName;
  
  public function __construct() {
    if (isset($_REQUEST["interactive_name"])) {
      $this->interactiveName = $_REQUEST["interactive_name"];
    } else {
      $this->sendResponse(RESPONSE_CODE_NOT_FOUND);
    }
    
    $this->dbConnect();
    
    $this->getInteractive();    
  }
  
  private function getInteractive() {
    $select = $this->conn->prepare("select id from kp_interactive where name = :interactive_name");
    $select->bindParam(":interactive_name", $this->interactiveName);
    $select->execute();
    $interactive = $select->fetch();
    
    if ($interactive === false) {
      $this->sendResponse(RESPONSE_CODE_NOT_FOUND);
    } else {
      $this->interactiveId = $interactive["id"];
    }
  }
  
  private function dbConnect() {
    require_once("db.php");
    
    try {
      $this->conn = new PDO("mysql:host=$servername;dbname=$dbName", $username, $password);
    } catch (PDOException $e) {
      $this->sendResponse(RESPONSE_CODE_SERVER_ERROR);
    } catch (Exception $e) {
      $this->sendResponse(RESPONSE_CODE_SERVER_ERROR);
    }
  }
  
  private function sendResponse($statusCode, $data=null) {
    $returnData = array(
      "message" => "",
      "data" => $data
    );
    
    switch ($statusCode) {
      case 200:
        $returnData["message"] = "OK";
        header('HTTP/1.1 200 OK');
        break;
      case 201:
        $returnData["message"] = "Created";
        header('HTTP/1.1 201 Created');
        break;
      case RESPONSE_CODE_NOT_FOUND:
        $returnData["message"] = "Interactive not found";
        header('HTTP/1.1 404 Resource not found');
        break;
      case RESPONSE_CODE_SERVER_ERROR:
        $returnData["message"] = "Server error";
        header('HTTP/1.1 500 Internal Server Error');
        break;
    }
    
    die(json_encode($returnData));
  }
  
  public function get() {
    try {
      $select = $this->conn->prepare(
          "select data from kp_interactive_data where interactive_id = :interactive_id");
      $select->bindParam(":interactive_id", $this->interactiveId);
      $select->execute();
      $result = $select->fetchAll(PDO::FETCH_ASSOC);
      
      // Remove "data" from $result - can we do this with PDO??
      $responseData = array();
      foreach ($result as $i => $k) {
        foreach ($k as $v) {
          array_push($responseData, $v);
        }
      }

      $this->sendResponse(RESPONSE_CODE_OK, $responseData);
    } catch (PDOException $e) {
      $this->sendResponse(RESPONSE_CODE_SERVER_ERROR);
    } catch (Exception $e) {
      $this->sendResponse(RESPONSE_CODE_SERVER_ERROR);
    }
  }
  
  public function post() {
    try {
      $insert = $this->conn->prepare(
          "insert into kp_interactive_data
      (interactive_id, data) values (:interactive_id, :data)");
      $insert->bindParam(":interactive_id", $this->interactiveId);
      $insert->bindParam(":data", $_REQUEST["submission"]);
      $insert->execute();
      
      $this->sendResponse(201, $this->conn->lastInsertId());
    } catch (PDOException $e) {
      
    } catch (Exception $e) {
      
    }
  }
}

$interactiveData = new Interactive_Data();

$method = $_SERVER["REQUEST_METHOD"];
switch($method) {
  case 'GET':
    $interactiveData->get();
    break;
  case 'POST':
    $interactiveData->post();
    break;
}

?>
