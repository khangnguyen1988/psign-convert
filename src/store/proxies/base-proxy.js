import Vue from 'vue'
import ToastUtils from '@/utils/toast'

class BaseProxy {
  /**
   * The constructor of the BaseProxy.
   *
   * @param {string} endpoint   The endpoint being used.
   * @param {Object} parameters The parameters for the request.
   */
  constructor (endpoint, parameters = {}) {
    this.endpoint = endpoint
    this.parameters = parameters
  }

  /**
   * Method used to set the query parameters.
   *
   * @param {Object} parameters The given parameters.
   *
   * @returns {BaseProxy} The instance of the proxy.
   */
  setParameters (parameters) {
    Object.keys(parameters).forEach(key => {
      this.parameters[key] = parameters[key]
    })

    return this
  }

  /**
   * Method used to set a single parameter.
   *
   * @param {string} parameter The given parameter.
   * @param {*} value The value to be set.
   *
   * @returns {BaseProxy} The instance of the proxy.
   */
  setParameter (parameter, value) {
    this.parameters[parameter] = value

    return this
  }

  /**
   * Method used to remove all the parameters.
   *
   * @param {Array} parameters The given parameters.
   *
   * @returns {BaseProxy} The instance of the proxy.
   */
  removeParameters (parameters) {
    parameters.forEach(parameter => {
      delete this.parameters[parameter]
    })

    return this
  }

  /**
   * Method used to remove a single parameter.
   *
   * @param {string} parameter The given parameter.
   *
   * @returns {BaseProxy} The instance of the proxy.
   */
  removeParameter (parameter) {
    delete this.parameters[parameter]
    return this
  }

  /**
   * onSubmitSuccess
   * @param response
   * @param resolve
   * @param options
   * @returns {BaseProxy}
   */
  onSubmitSuccess (response, resolve, options) {
    if (!response.data || options.showResponseHeaders) {
      resolve(response)
    } else if (
      response.data &&
      (options.showResponseStatus || options.responseType === 'blob')
    ) {
      resolve(response.data)
    } else {
      resolve(response.data.data)
    }
    return this
  }

  /**
   * Handle submit error
   * @param response
   * @param reject
   * @param options
   */
  onSubmitError (response, reject) {
    if (response) {
      reject(response.data)
    } else {
      reject()
    }
    return this
  }

  /**
   * The method used to perform an AJAX-request.
   *
   * @param {string}      requestType The request type.
   * @param {string}      url         The URL for the request.
   * @param {Object|null} data        The data to be send with the request.
   * @param {Object|null} options     The options to be send with the request.
   *
   * @returns {Promise} The result in a promise.
   */
  submit (requestType, url, data = null, options = null) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    options = Object.assign(defaultOptions, options)

    const promise = new Promise((resolve, reject) => {
      const clientHttpRequest = Vue.$http[requestType]
      const responsePromise =
        requestType === 'get'
          ? clientHttpRequest(url + this.getParameterString(), options)
          : clientHttpRequest(url + this.getParameterString(), data, options)
      responsePromise
        .then(response => {
          this.onSubmitSuccess(response, resolve, options)
        })
        .catch(({ response }) => {
          this.onSubmitError(response, reject, options)
        })
    })

    if (options.showLoading) {
      this.handleLoadingToast(promise, ToastUtils.showToast('loading'))
    }

    this.afterSubmitHandler(promise, options)

    return promise
  }

  handleLoadingToast (promise, toast) {
    promise
      .then(() => {
        toast.goAway(0)
      })
      .catch(() => {
        toast.goAway(0)
      })
    return this
  }

  afterSubmitHandler (submitPromise, options) {
    const waitingTime = options.showLoading ? 500 : 0
    const toast = new ToastUtils(options ? options.toast : null)
    submitPromise
      .then(() => {
        setTimeout(() => {
          toast.show('success')
        }, waitingTime)
      })
      .catch(() => {
        setTimeout(() => {
          toast.show('error')
        }, waitingTime)
      })

    return this
  }

  /**
   * Method used to fetch all items from the API.
   *
   * @returns {Promise} The result in a promise.
   */
  all (options) {
    return this.submit('get', `/${this.endpoint}`, options)
  }

  /**
   * Method used to fetch a single item from the API.
   *
   * @param {int} id The given identifier.
   *
   * @returns {Promise} The result in a promise.
   */
  find (id, options) {
    return this.submit('get', `/${this.endpoint}/${id}`, options)
  }

  /**
   * Method used to create an item.
   *
   * @param {Object} item The given item.
   *
   * @returns {Promise} The result in a promise.
   */
  create (item, options) {
    return this.submit('post', `/${this.endpoint}`, item, options)
  }

  /**
   * Method used to update an item.
   *
   * @param {int}    id   The given identifier.
   * @param {Object} item The given item.
   *
   * @returns {Promise} The result in a promise.
   */
  update (id, item, options) {
    return this.submit('put', `/${this.endpoint}/${id}`, item, options)
  }

  /**
   * Method used to destroy an item.
   *
   * @param {int} id The given identifier.
   *
   * @returns {Promise} The result in a promise.
   */
  destroy (id, options) {
    return this.submit('delete', `/${this.endpoint}/${id}`, null, options)
  }

  /**
   * Method used to transform a parameters object to a parameters string.
   *
   * @returns {string} The parameter string.
   */
  getParameterString () {
    const keys = Object.keys(this.parameters)

    const parameterStrings = keys
      .filter(key => !!this.parameters[key])
      .map(key => `${key}=${encodeURIComponent(this.parameters[key])}`)

    return parameterStrings.length === 0
      ? ''
      : `?${parameterStrings.join('&')}`
  }
}

export default BaseProxy
