<?php

namespace model;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../sql_helpers.php';

use Exception;
use GraphQL\Type\Definition\{ObjectType, Type};
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class Stem
{
  static ObjectType $graphQLType;

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
    return new Stem($row['id'], $row['form'], $row['pos'], $row['deu'], $row['eng']);
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

  /** @return Stem[] */
  static function selectAllStems(): array
  {
    return SqlHelpers::executeMultiSelectQuery(
      "select stem_id as id, form, pos, deu, eng from tive_stems;",
      null,
      fn(array $row): Stem => Stem::fromDbAssocRow($row)
    );
  }
}

Stem::$graphQLType = new ObjectType([
  'name' => 'Stem',
  'fields' => [
    'id' => Type::nonNull(Type::int()),
    'form' => Type::nonNull(Type::string()),
    'pos' => Type::nonNull(Type::string()),
    'deu' => Type::nonNull(Type::string()),
    'eng' => Type::nonNull(Type::string())
  ]
]);