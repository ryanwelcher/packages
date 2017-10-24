/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export function stripTags( text, settings ) {
	return text.replace( settings.HTMLRegExp, '\n' );
}

/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export function stripHTMLComments( text, settings ) {
	return text.replace( settings.HTMLcommentRegExp , '' );
}

/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export function stripShortcodes( text,  settings  ) {
	return text.replace( settings.shortcodesRegExp, '\n' );
}

/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export function stripSpaces( text, settings ) {
	return text.replace( settings.spaceRegExp, ' ' );
}

/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export function stripHTMLEntities( text, settings ) {
	return text.replace( settings.HTMLEntityRegExp, '' );
}

/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export function stripConnectors( text, settings ) {
	return text.replace( settings.connectorRegExp, ' ' );
}

/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export function stripRemoveables( text, settings ) {
	return text.replace( settings.removeRegExp, '' );
}

/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export function transposeHTMLEntitiesToCountableChars( text, settings ) {
	return text.replace( settings.HTMLEntityRegExp, 'a' );
}

/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export function transpostAstralsToCountableChar( text, settings ) {
	return text.replace( settings.astralRegExp, 'a');
}




