import { getHurrianLexicalDatabaseUpdatesUrl } from '../../urls';
export const updatesStream = new EventSource(getHurrianLexicalDatabaseUpdatesUrl);
