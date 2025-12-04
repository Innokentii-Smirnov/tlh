<?php

namespace model\tive;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../sql_helpers.php';

use Exception;
use GraphQL\Type\Definition\{ObjectType, Type};
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class SuffixChain
{
  static ObjectType $graphQLType;

  public int $id;
  public string $suffixes;
  public string $morphTag;
  public string $pos;

  function __construct(int $id, string $suffixes, string $morphTag, string $pos)
  {
    $this->id = $id;
    $this->suffixes = $suffixes;
    $this->morphTag = $morphTag;
    $this->pos = $pos;
  }

  private static function fromDbAssocRow(array $row): SuffixChain
  {
    return new SuffixChain($row['suffix_chain_id'], $row['suffixes'], $row['morph_tag'], $row['pos']);
  }

  static function selectSuffixChainById(int $id): SuffixChain
  {
    return SqlHelpers::executeSingleReturnRowQuery(
      "select * from tive_suffix_chains where suffix_chain_id = ?;",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('i', $id),
      fn(array $row): SuffixChain => SuffixChain::fromDbAssocRow($row)
    );
  }

  static function selectByUniqueKey(string $suffixes, string $morphTag, string $pos): ?SuffixChain
  {
    return SqlHelpers::executeSingleReturnRowQuery(
      "select * from tive_suffix_chains where suffixes = ? and morph_tag = ? and pos = ?;",
      fn(mysqli_stmt $stmt): bool => $stmt->bind_param('sss', $suffixes, $morphTag, $pos),
      fn(array $row): SuffixChain => SuffixChain::fromDbAssocRow($row)
    );
  }
}

SuffixChain::$graphQLType = new ObjectType([
  'name' => 'SuffixChain',
  'fields' => [
    'id' => Type::nonNull(Type::int()),
    'suffixes' => Type::nonNull(Type::string()),
    'morphTag' => Type::nonNull(Type::string()),
    'pos' => Type::nonNull(Type::string())
  ]
]);
