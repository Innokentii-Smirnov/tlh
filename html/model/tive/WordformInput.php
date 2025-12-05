<?php

namespace model\tive;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../sql_helpers.php';
require_once __DIR__ . '/Wordform.php';

use GraphQL\Type\Definition\{InputObjectType, Type};
use mysqli;
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class WordformInput
{
  static InputObjectType $graphQLInputObjectType;
  
  public string $transcription;
  
  function __construct(string $transcription)
  {
    $this->transcription = $transcription;
  }
  
  static function fromGraphQLInput(array $input): WordformInput
  {
    return new WordformInput($input['transcription']);
  }
  
  function insert(): bool
  {
    return SqlHelpers::executeSingleChangeQuery(
      "insert ignore into tive_wordforms (transcription) values (?);",
      fn(mysqli_stmt $stmt) => $stmt->bind_param('s', $this->transcription)
    );
  }

  function findOrInsert(): Wordform
  {
    $this->insert();
    return Wordform::selectByUniqueKey($this->transcription);
  }
}

// GraphQL

WordformInput::$graphQLInputObjectType = new InputObjectType([
  'name' => 'WordformInput',
  'fields' => [
    'transcription' => Type::nonNull(Type::string())
  ]
]);
