/**
 *
 * @param {String} text
 * @param {Object} settings
 * @returns {string|*|XML|void}
 */
export default function ( text ) {
	return text.replace( this.settings.connectorRegExp, ' ' );
}
