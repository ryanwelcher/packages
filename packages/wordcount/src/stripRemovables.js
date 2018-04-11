
/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export default function ( settings, text ) {
	if ( settings.removeRegExp ) {
		return text.replace(settings.removeRegExp, '');
	}
	return text;
}
