/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export default function ( settings, text ) {
	if ( settings.astralRegExp ) {
		return text.replace( settings.astralRegExp, 'a');
	}
	return text;
}
