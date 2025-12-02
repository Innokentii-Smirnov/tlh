<?php

namespace model\tive;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../sql_helpers.php';
require_once __DIR__ . '/MorphologicalAnalysis.php';

use Exception;
use GraphQL\Type\Definition\{ObjectType, Type};
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class Stem
{
  static ObjectType $graphQLType;
  static ObjectType $graphQLMutationsType;

  public int $id;
  public string $form;
  public string $pos;
  public string $deu;
  public string $eng;

  function __construct(int $id, string $form, string $pos, string $deu, string $eng)
  {
    $this->id = $id;
    $this->form = $form;
    $this->pos = $pos;
    $this->deu = $deu;
    $this->eng = $eng;
  }

  private static function fromDbAssocRow(array $row): Stem
  {
    return new Stem($row['stem_id'], $row['form'], $row['pos'], $row['deu'], $row['eng']);
  }

  // SQL

  static function selectStemFromDatabase(string $form, string $pos, string $deu): ?Stem
  {
    return SqlHelpers::executeSingleReturnRowQuery(
      "select * from tive_stems where form = ? and pos = ? and deu = ?;",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('sss', $form, $pos, $deu),
      fn(array $row): Stem => Stem::fromDbAssocRow($row)
    );
  }

  /** @throws Exception */
  function insert(): bool
  {
    return SqlHelpers::executeSingleChangeQuery(
      "insert into tive_stems (form, pos, deu, eng) values (?, ?, ?, ?);",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('ssss', $this->form, $this->pos, $this->deu, $this->eng)
    );
  }

  static function selectStemById(int $id): Stem
  {
    return SqlHelpers::executeSingleReturnRowQuery(
      "select * from tive_stems where stem_id = ?;",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('i', $id),
      fn(array $row): Stem => Stem::fromDbAssocRow($row)
    );
  }

  /** @return Stem[] */
  static function selectAllStems(): array
  {
    return SqlHelpers::executeMultiSelectQuery(
      "select * from tive_stems;",
      null,
      fn(array $row): Stem => Stem::fromDbAssocRow($row)
    );
  }

  /** @throws Exception */
  function changeForm(string $form): bool
  {
    return SqlHelpers::executeSingleChangeQuery(
      "update tive_stems set form = ? where stem_id = ?;",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('si', $form, $this->id)
    );
  }

  /** @throws Exception */
  function changePos(string $pos): bool
  {
    return SqlHelpers::executeSingleChangeQuery(
      "update tive_stems set pos = ? where stem_id = ?;",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('si', $pos, $this->id)
    );
  }

  /** @throws Exception */
  function changeGermanTranslation(string $deu): bool
  {
    return SqlHelpers::executeSingleChangeQuery(
      "update tive_stems set deu = ? where stem_id = ?;",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('si', $deu, $this->id)
    );
  }

  /** @throws Exception */
  function changeEnglishTranslation(string $eng): bool
  {
    return SqlHelpers::executeSingleChangeQuery(
      "update tive_stems set eng = ? where stem_id = ?;",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('si', $eng, $this->id)
    );
  }
}

Stem::$graphQLType = new ObjectType([
  'name' => 'Stem',
  'fields' => static fn(): array => [
    'id' => Type::nonNull(Type::int()),
    'form' => Type::nonNull(Type::string()),
    'pos' => Type::nonNull(Type::string()),
    'deu' => Type::nonNull(Type::string()),
    'eng' => Type::nonNull(Type::string()),
    'morphologicalAnalyses' => [
      'type' => Type::nonNull(Type::listOf(Type::nonNull(MorphologicalAnalysis::$graphQLType))),
      'resolve' => fn(Stem $stem): array => MorphologicalAnalysis::selectMorphologicalAnalysesByStemId($stem->id)
    ]
  ]
]);

Stem::$graphQLMutationsType = new ObjectType([
  'name' => 'StemMutations',
  'fields' => [
    'changeForm' => [
      'type' => Type::nonNull(Type::boolean()),
      'args' => [
        'form' => Type::nonNull(Type::string())
      ],
      'resolve' => function(Stem $stem, array $args): bool {
        return $stem->changeForm($args['form']);
      }
    ],
    'changePos' => [
      'type' => Type::nonNull(Type::boolean()),
      'args' => [
        'pos' => Type::nonNull(Type::string())
      ],
      'resolve' => function(Stem $stem, array $args): bool {
        return $stem->changePos($args['pos']);
      }
    ],
    'changeGermanTranslation' => [
      'type' => Type::nonNull(Type::boolean()),
      'args' => [
        'deu' => Type::nonNull(Type::string())
      ],
      'resolve' => function(Stem $stem, array $args): bool {
        return $stem->changeGermanTranslation($args['deu']);
      }
    ],
    'changeEnglishTranslation' => [
      'type' => Type::nonNull(Type::boolean()),
      'args' => [
        'eng' => Type::nonNull(Type::string())
      ],
      'resolve' => function(Stem $stem, array $args): bool {
        return $stem->changeEnglishTranslation($args['eng']);
      }
    ]
  ]
]);
