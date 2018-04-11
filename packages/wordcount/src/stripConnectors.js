/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export default function ( settings, text ) {
	if ( settings.connectorRegExp ) {
		return text.replace(settings.connectorRegExp, ' ');
	}
	return text;
}
