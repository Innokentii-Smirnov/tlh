<?php

namespace model;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../sql_helpers.php';

use Exception;
use GraphQL\Type\Definition\{ObjectType, Type};
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class Wordform
{
  static ObjectType $graphQLType;

  public string $transcription;

  function __construct(string $transcription)
  {
    $this->transcription = $transcription;
  }

  private static function fromDbAssocRow(array $row): Wordform
  {
    return new Wordform($row['transcription']);
  }

  static function selectWordformById(int $id): Wordform
  {
    return SqlHelpers::executeSingleReturnRowQuery(
      "select transcription from tive_wordforms where wordform_id = ?;",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('i', $id),
      fn(array $row): Wordform => Wordform::fromDbAssocRow($row)
    );
  }
}

Wordform::$graphQLType = new ObjectType([
  'name' => 'Wordform',
  'fields' => [
    'transcription' => Type::nonNull(Type::string())
  ]
]);
