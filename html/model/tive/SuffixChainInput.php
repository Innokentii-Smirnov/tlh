<?php

namespace model\tive;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../sql_helpers.php';
require_once __DIR__ . '/SuffixChain.php';

use GraphQL\Type\Definition\{InputObjectType, Type};
use mysqli;
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class SuffixChainInput
{
  static InputObjectType $graphQLInputObjectType;
  
  public string $suffixes;
  public string $morphTag;
  public string $pos;
  
  function __construct(string $suffixes, string $morphTag, string $pos)
  {
    $this->suffixes = $suffixes;
    $this->morphTag = $morphTag;
    $this->pos = $pos;
  }
  
  static function fromGraphQLInput(array $input): SuffixChainInput
  {
    return new SuffixChainInput($input['suffixes'], $input['morphTag'], $input['pos']);
  }
  
  function insert(): bool
  {
    return SqlHelpers::executeSingleChangeQuery(
      "insert ignore into tive_suffix_chains (suffixes, morph_tag, pos) values (?, ?, ?);",
      fn(mysqli_stmt $stmt) => $stmt->bind_param('sss', $this->suffixes, $this->morphTag, $this->pos)
    );
  }

  function findOrInsert(): SuffixChain
  {
    $this->insert();
    return SuffixChain::selectByUniqueKey($this->suffixes, $this->morphTag, $this->pos);
  }
}

// GraphQL

SuffixChainInput::$graphQLInputObjectType = new InputObjectType([
  'name' => 'SuffixChainInput',
  'fields' => [
    'suffixes' => Type::nonNull(Type::string()),
    'morphTag' => Type::nonNull(Type::string()),
    'pos' => Type::nonNull(Type::string())
  ]
]);
