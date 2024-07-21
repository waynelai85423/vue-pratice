import axios from "axios";

class AxiosClient {
  /**
   * 建立 axios 請求
   *
   * @param options
   * @returns {number}
   */
  request(options = {}) {
    // 每次請求時都會建立新的 axios
    let instance = axios.create({
      ...options,
      baseURL: `${process.env.PATH_PREFIX || ""}/${options.key}-api`,
      timeout: 120000,
      headers: {
        "Content-Type":
          options.contractType || "application/json;charset=UTF-8",
        "Cache-Control": "no-cache",
        Accept: "application/json"
      }
    });

    // 設定 interceptors
    this.setInterceptors(instance, options.url, options.originResponse);
    return instance;
  }

  /**
   * 針對需要特殊處理的路徑設定不同的 interceptors
   *
   * @param instance
   * @param url
   * @param originResponse 回傳
   */
  setInterceptors = (instance, url, originResponse) => {
    // 針對請求設定 interceptors
    // instance.interceptors.request.use(
    //   config => {
    //     if (process.isClient) {
    //       config.headers.Authorization =
    //         global.localStorage.getItem("Authorization") || "";
    //     }
    //     return config;
    //   },
    //   err => Promise.reject(err)
    // );

    // 針對回應設定 interceptors
    instance.interceptors.response.use(
      response => {
        return response.data.data;
      },
      err => {
        if (err.response) {
          console.error("errMsg", { err });
          switch (err.response.status) {
            case 403:
              // if (process.isClient) {
              //   global.localStorage.removeItem("Authorization");
              // }
              return this._handleErr(
                err.response,
                "查無授權進行此操作，可能是登入逾時或授權不足"
              );
            case 401:
              return this._handleErr(err.response, "查無授權進行此操作");
            case 400:
            case 404:
            case 405:
            case 500:
              return this._handleErr(err.response);
            default:
              return this._handleErr(err.response);
          }
          return this._handleErr(err);
        }

        // timeout
        if (err.request) {
          if (err.request.readyState === 4 && err.request.status === 0) {
            // TODO: 處理請求 timeout
          }
          return this._handleErr("net::ERR_REQUEST_TIMEOUT");
        }

        // 網路斷線
        if (process.isClient && !global.navigator.onLine) {
          // TODO: 跳到 offline 頁面
          return this._handleErr("net::ERR_INTERNET_DISCONNECTED");
        }
        return Promise.reject(err);
      }
    );
  };

  _handleErr(err, message) {
    console.error("get error: ", err);
    if (err.data?.apierror) {
      return Promise.reject({
        status: err.data.apierror.status,
        message: err.data.apierror.message,
        subErrors: err.data.apierror.subErrors,
        exception: err.data.apierror.exception,
        stackTrace: err.data.apierror.stackTrace
      });
    } else if (err.data?.error) {
      return Promise.reject({
        status: "ERROR",
        message: err.data.error,
        subErrors: [
          { message: message },
          { message: err.data.error_description }
        ].filter(se => se.message),
        exception: "",
        stackTrace: []
      });
    } else {
      return Promise.reject({
        status: "ERROR",
        message: message || `[${err.status}] ${err.statusText}`,
        exception: "",
        stackTrace: []
      });
    }
  }
}

export default new AxiosClient();
