<?php

namespace model\tive;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../sql_helpers.php';
require_once __DIR__ . '/StemInput.php';
require_once __DIR__ . '/SuffixChainInput.php';
require_once __DIR__ . '/Stem.php';
require_once __DIR__ . '/SuffixChain.php';
require_once __DIR__ . '/MorphologicalAnalysis.php';

use GraphQL\Type\Definition\{InputObjectType, Type};
use mysqli;
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class MorphologicalAnalysisInput
{
  static InputObjectType $graphQLInputObjectType;
  
  public Stem $stem;
  public SuffixChain $suffixChain;
  
  function __construct(Stem $stem, SuffixChain $suffixChain)
  {
    $this->stem = $stem;
    $this->suffixChain = $suffixChain;
  }
  
  static function fromGraphQLInput(array $input): MorphologicalAnalysisInput
  {
    $stemInput = StemInput::fromGraphQLInput($input['stemInput']);
    $suffixChainInput = SuffixChainInput::fromGraphQLInput($input['suffixChainInput']);
    $stem = $stemInput->findOrInsert();
    $suffixChain = $suffixChainInput->findOrInsert();
    return new MorphologicalAnalysisInput($stem, $suffixChain);
  }
  
  function insert(): bool
  {
    return SqlHelpers::executeSingleChangeQuery(
      "insert ignore into tive_morphological_analyses (stem_id, suffix_chain_id) values (?, ?);",
      fn(mysqli_stmt $stmt) => $stmt->bind_param('ii', $this->stem->id, $this->suffixChain->id)
    );
  }

  function findOrInsert(): MorphologicalAnalysis
  {
    $this->insert();
    return MorphologicalAnalysis::selectByUniqueKey($this->stem->id, $this->suffixChain->id);
  }
}

// GraphQL

MorphologicalAnalysisInput::$graphQLInputObjectType = new InputObjectType([
  'name' => 'MorphologicalAnalysisInput',
  'fields' => [
    'stemInput' => Type::nonNull(StemInput::$graphQLInputObjectType),
    'suffixChainInput' => Type::nonNull(SuffixChainInput::$graphQLInputObjectType)
  ]
]);
