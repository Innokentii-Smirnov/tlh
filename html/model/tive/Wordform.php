<?php

namespace model\tive;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../sql_helpers.php';

use Exception;
use GraphQL\Type\Definition\{ObjectType, Type};
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class Wordform
{
  static ObjectType $graphQLType;

  public int $id;
  public string $transcription;

  function __construct(int $id, string $transcription)
  {
    $this->id = $id;
    $this->transcription = $transcription;
  }

  private static function fromDbAssocRow(array $row): Wordform
  {
    return new Wordform($row['wordform_id'], $row['transcription']);
  }

  static function selectWordformById(int $id): Wordform
  {
    return SqlHelpers::executeSingleReturnRowQuery(
      "select * from tive_wordforms where wordform_id = ?;",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('i', $id),
      fn(array $row): Wordform => Wordform::fromDbAssocRow($row)
    );
  }

  static function selectByUniqueKey(string $transcription): Wordform
  {
    return SqlHelpers::executeSingleReturnRowQuery(
      "select * from tive_wordforms where transcription = ?;",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('s', $transcription),
      fn(array $row): Wordform => Wordform::fromDbAssocRow($row)
    );
  }
}

Wordform::$graphQLType = new ObjectType([
  'name' => 'Wordform',
  'fields' => static fn(): array => [
    'id' => Type::nonNull(Type::int()),
    'transcription' => Type::nonNull(Type::string()),
    'morphosyntacticWords' => [
      'type' => Type::nonNull(Type::listof(Type::nonNull(MorphosyntacticWord::$graphQLType))),
      'resolve' => fn(Wordform $wordform): array => MorphosyntacticWord::selectMorphosyntacticWordsByWordformId($wordform->id)
    ]
  ]
]);
