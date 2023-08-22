/* ============
 * State of the auth module
 * ============
 *
 * The initial state of the auth module.
 */

export default {
  authenticated: false,
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || {},
  errors: false
}
