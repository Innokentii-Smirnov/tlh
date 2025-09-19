const baseServerUrl = process.env.NODE_ENV !== 'development'
  ? `/tlh_editor/${process.env.REACT_APP_VERSION}`
  : 'http://localhost:8066';

export const baseUrl = process.env.NODE_ENV !== 'development'
  ? `${baseServerUrl}/public`
  : '';

export const apolloUri = `${baseServerUrl}/graphql.php`;

export const pictureUploadUrl = (mainIdentifier: string): string => `${baseServerUrl}/uploadPicture.php?id=${encodeURIComponent(mainIdentifier)}`;

export const pictureBaseUrl = (mainIdentifier: string): string => `${baseServerUrl}/uploads/${encodeURIComponent(mainIdentifier)}`;

export const homeUrl = '/';

export const createManuscriptUrl = '/createManuscript';

export const registerUrl = '/registerForm';
export const loginUrl = '/login';
export const forgotPasswordUrl = '/forgotPassword';
export const resetPasswordUrl = '/resetPassword';

export const preferencesUrl = '/preferences';

export const oxtedUrl = '/OXTED';

export const xmlComparatorUrl = '/xmlComparator';

export const documentMergerUrl = '/documentMerger';

export const dictionaryViewerUrl = '/dictionaryViewer';

export const macroeditorUrl = '/macroeditor';

export const userManagementUrl = '/userManagement';

export const pipelineManagementUrl = '/pipelineManagement';

// Fragments

export const manuscriptsUrlFragment = 'manuscripts';

export const managePicturesUrl = 'managePictures';

export const createTransliterationUrl = 'createTransliteration';

export const transliterationReviewUrl = 'transliterationReview';

export const xmlConversionUrl = 'xmlConversion';

export const firstXmlReviewUrl = 'firstXmlReview';

export const secondXmlReviewUrl = 'secondXmlReview';

export const approveDocumentUrl = 'approveDocument';

const hurrianLexicalDatabaseUrl = process.env.NODE_ENV !== 'development'
  ? 'http://hurrian_lexical_database:8080'
  : 'http://localhost:8080';

export const getHurrianLexicalDatabaseUrl = hurrianLexicalDatabaseUrl;

export const uploadLexicalDatabaseUrl =
  `${hurrianLexicalDatabaseUrl}/uploadLexicalDatabase`;

export const replaceMorphologicalAnalysisUrl =
  `${hurrianLexicalDatabaseUrl}/replaceMorphologicalAnalysis`;

export const replaceTranslationUrl =
  `${hurrianLexicalDatabaseUrl}/replaceTranslation`;

export const replaceStemUrl =
  `${hurrianLexicalDatabaseUrl}/replaceStem`;

export const replacePosUrl =
  `${hurrianLexicalDatabaseUrl}/replacePos`;

export const addAttestationUrl =
  `${hurrianLexicalDatabaseUrl}/addAttestation`;

export const removeAttestationUrl =
  `${hurrianLexicalDatabaseUrl}/removeAttestation`;

export const addLineUrl =
  `${hurrianLexicalDatabaseUrl}/addLine`;

export const updateLineUrl =
  `${hurrianLexicalDatabaseUrl}/updateLine`;

// Foreign urls

const tlhAnalyzerBaseUrl = process.env.NODE_ENV === 'development'
  ? 'https://www.hethport3.uni-wuerzburg.de/'
  : '';

export const tlhWordAnalyzerUrl = `${tlhAnalyzerBaseUrl}/TLHaly/jasonanalysis.php`;

export const tlhDocumentAnalyzerUrl = `${tlhAnalyzerBaseUrl}/TLHaly/deuteDokument.php`;

export const getCuneiformUrl = `${tlhAnalyzerBaseUrl}/TLHcuni/create_cuneiform_single.php`;