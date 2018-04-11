/**
 * @param {Object} settings
 * @param {String} text
 * @returns {string|*|XML|void}
 */
export default function( settings, text ) {
	if ( settings.shortcodesRegExp ) {
		return text.replace(settings.shortcodesRegExp, '\n');
	}
	return text;
}