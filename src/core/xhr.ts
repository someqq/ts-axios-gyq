import { createError } from '../helpers/error'
import { parseHeaders } from '../helpers/header'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, url, method = 'get', headers, responseType, timeout } = config

        const request = new XMLHttpRequest()

        if (responseType) {
            request.responseType = responseType
        }

        request.open(method.toUpperCase(), url, true)

        request.onreadystatechange = function handleLoad() {
            if (request.readyState !== 4) {
                return
            }

            const responseHeaders = parseHeaders(request.getAllResponseHeaders())
            const responseData = responseType && responseType !== 'text' ? request.response : request.responseText
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }
            resolve(response)
        }




        Object.keys(headers).forEach((name) => {
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name]
                //当传入的 data 为空的时候，请求 header 配置 Content-Type 是没有意义的，把它删除

            } else {
                request.setRequestHeader(name, headers[name])
            }
        })

        request.onerror = function handleError() {
            reject(createError(
                'Network Error',
                config,
                null,
                request
            ))
        }
        if (timeout) {
            request.timeout = timeout
        }

        request.ontimeout = function handleTimeout() {
            reject(createError(
                `Timeout of ${config.timeout} ms exceeded`,
                config,
                'ECONNABORTED',
                request
            ))
        }
        request.onreadystatechange = function handleLoad() {
            if (request.readyState !== 4) {
                return
            }

            if (request.status === 0) {
                return
            }

            const responseHeaders = parseHeaders(request.getAllResponseHeaders())
            const responseData =
                responseType && responseType !== 'text' ? request.response : request.responseText
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }
            handleResponse(response)
        }

        function handleResponse(response: AxiosResponse) {
            if (response.status >= 200 && response.status < 300) {
                resolve(response)
            } else {
                reject(createError(
                    `Request failed with status code ${response.status}`,
                    config,
                    null,
                    request,
                    response
                ))
            }
        }
        request.send(data)
    })
}