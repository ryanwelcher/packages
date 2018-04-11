/**
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export default function( settings, text ) {
	if ( settings.HTMLRegExp ) {
		return text.replace(settings.HTMLRegExp, '\n');
	}
}
