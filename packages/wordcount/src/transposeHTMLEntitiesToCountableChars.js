/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export default function ( settings, text ) {
	if ( settings.HTMLEntityRegExp ) {
		return text.replace(settings.HTMLEntityRegExp, 'a');
	}
	return text;
}
