<?php

namespace model\tive;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../sql_helpers.php';
require_once __DIR__ . '/MorphologicalAnalysis.php';
require_once __DIR__ . '/MorphologicalAnalysisInput.php';
require_once __DIR__ . '/Wordform.php';
require_once __DIR__ . '/WordformInput.php';
require_once __DIR__ . '/MorphosyntacticWord.php';

use GraphQL\Type\Definition\{InputObjectType, Type};
use mysqli;
use mysqli_stmt;
use sql_helpers\SqlHelpers;

class MorphosyntacticWordInput
{
  static InputObjectType $graphQLInputObjectType;
  
  public MorphologicalAnalysis $morphologicalAnalysis;
  public Wordform $wordform;
  
  function __construct(MorphologicalAnalysis $morphologicalAnalysis, Wordform $wordform)
  {
    $this->morphologicalAnalysis = $morphologicalAnalysis;
    $this->wordform = $wordform;
  }
  
  static function fromGraphQLInput(array $input): MorphosyntacticWordInput
  {
    $morphologicalAnalysisInput = MorphologicalAnalysisInput::fromGraphQLInput($input['morphologicalAnalysisInput']);
    $wordformInput = WordformInput::fromGraphQLInput($input['wordformInput']);
    $morphologicalAnalysis = $morphologicalAnalysisInput->findOrInsert();
    $wordform = $wordformInput->findOrInsert();
    return new MorphosyntacticWordInput($morphologicalAnalysis, $wordform);
  }
  
  function insert(): bool
  {
    return SqlHelpers::executeSingleChangeQuery(
      "insert ignore into tive_morphosyntactic_words (morphological_analysis_id, wordform_id) values (?, ?);",
      fn(mysqli_stmt $stmt) => $stmt->bind_param('ii', $this->morphologicalAnalysis->id, $this->wordform->id)
    );
  }

  function findOrInsert(): MorphosyntacticWord
  {
    $this->insert();
    return MorphosyntacticWord::selectByUniqueKey($this->morphologicalAnalysis->id, $this->wordform->id);
  }
}

// GraphQL

MorphosyntacticWordInput::$graphQLInputObjectType = new InputObjectType([
  'name' => 'MorphosyntacticWordInput',
  'fields' => [
    'morphologicalAnalysisInput' => Type::nonNull(MorphologicalAnalysisInput::$graphQLInputObjectType),
    'wordformInput' => Type::nonNull(WordformInput::$graphQLInputObjectType)
  ]
]);
