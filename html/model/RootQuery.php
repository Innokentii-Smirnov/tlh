<?php

namespace model;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/ExecutiveEditor.php';
require_once __DIR__ . '/Manuscript.php';
require_once __DIR__ . '/Reviewer.php';
require_once __DIR__ . '/User.php';
require_once __DIR__ . '/Stem.php';
require_once __DIR__ . '/MorphologicalAnalysis.php';
require_once __DIR__ . '/Wordform.php';

use GraphQL\Type\Definition\{ObjectType, Type};

abstract class RootQuery
{
  static ObjectType $queryType;
}

RootQuery::$queryType = new ObjectType([
  'name' => 'Query',
  'fields' => [
    'manuscriptCount' => [
      'type' => Type::nonNull(Type::int()),
      // FIXME: only own or approved manuscripts!
      'resolve' => fn(?int $_rootValue, array $args, ?User $user): int => Manuscript::selectManuscriptsCount(is_null($user) ? null : $user->username)
    ],
    'allManuscripts' => [
      'type' => Type::nonNull(Type::listOf(Type::nonNull(Manuscript::$graphQLType))),
      'args' => [
        'page' => Type::nonNull(Type::int())
      ],

      'resolve' => fn(?int $_rootValue, array $args, ?User $user): array => Manuscript::selectAllManuscriptsPaginated($args['page'], is_null($user) ? null : $user->username)
    ],
    'myManuscripts' => [
      'type' => Type::listOf(Type::nonNull(Type::string())),
      'resolve' => fn(?int $_rootValue, array $_args, ?User $user): ?array => !is_null($user)
        ? Manuscript::selectManuscriptIdentifiersForUser($user->username)
        : null,
    ],
    'manuscript' => [
      'type' => Manuscript::$graphQLType,
      'args' => [
        'mainIdentifier' => Type::nonNull(Type::string())
      ],
      'resolve' => fn(?int $_rootValue, array $args): ?Manuscript => Manuscript::selectManuscriptById($args['mainIdentifier'])
    ],
    'stemLookup' => [
      'type' => Stem::$graphQLType,
      'args' => [
        'form' => Type::nonNull(Type::string()),
        'pos' => Type::nonNull(Type::string()),
        'deu' => Type::nonNull(Type::string())
      ],
      'resolve' => fn(?int $_rootValue, array $args): ?Stem => Stem::selectStemFromDatabase($args['form'], $args['pos'], $args['deu'])
    ],
    'allStems' => [
      'type' => Type::nonNull(Type::listOf(Type::nonNull(Stem::$graphQLType))),
      'resolve' => fn(?int $_rootValue, array $args): array => Stem::selectAllStems()
    ],
    'morphologicalAnalysesByStemId' => [
      'type' => Type::nonNull(Type::listOf(Type::nonNull(MorphologicalAnalysis::$graphQLType))),
      'args' => [
        'stemId' => Type::nonNull(Type::int())
      ],
      'resolve' => fn(?int $_rootValue, array $args): array => MorphologicalAnalysis::selectMorphologicalAnalysesByStemId($args['stemId'])
    ],
    'transcriptionsByMorphologicalAnalysisId' => [
      'type' => Type::nonNull(Type::listOf(Type::nonNull(Wordform::$graphQLType))),
      'args' => [
        'morphologicalAnalysisId' => Type::nonNull(Type::int())
      ],
      'resolve' => fn(?int $_rootValue, array $args): array => Wordform::selectTranscriptionsByMorphologicalAnalysisId($args['morphologicalAnalysisId'])
    ],
    'reviewerQueries' => [
      'type' => Reviewer::$queryType,
      'resolve' => fn(?int $_rootValue, array $args, ?User $user): ?User => !is_null($user) && $user->isReviewer() ? $user : null
    ],
    'executiveEditorQueries' => [
      # TODO: make userQueries with field execEditorQueries, reviewerQueries and myManuscripts?
      'type' => ExecutiveEditor::$queryType,
      'resolve' => fn(?int $_rootValue, array $_args, ?User $user): ?User => !is_null($user) && $user->isExecutiveEditor() ? $user : null
    ]
  ]
]);


