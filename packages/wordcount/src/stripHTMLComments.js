/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export default function ( settings, text ) {
	if ( settings.HTMLcommentRegExp ) {
		return text.replace( settings.HTMLcommentRegExp , '' );
	}
	return text;
}
