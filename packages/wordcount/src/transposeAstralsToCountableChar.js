/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export default function ( text ) {
	if ( this.settings.astralRegExp ) {
		return text.replace( this.settings.astralRegExp, 'a');
	}
	return text;
}
