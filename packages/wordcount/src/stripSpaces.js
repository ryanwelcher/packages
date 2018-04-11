/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export default function ( settings, text  ) {
	if ( settings.spaceRegExp ) {
		return text.replace(settings.spaceRegExp, ' ');
	}
}
