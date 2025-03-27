/**
 * polyfills.js - 구형 브라우저를 위한 폴리필 모음
 * IE11 이하에서 현대적인 JavaScript 기능을 부분적으로 지원할 수 있게 합니다.
 */

// ES6 Promise 폴리필
if (typeof Promise === 'undefined') {
    console.log('Promise 폴리필 로드됨');
    // Promise 폴리필 구현 (간소화된 버전)
    window.Promise = function(executor) {
        var self = this;
        self.status = 'pending';
        self.value = undefined;
        self.reason = undefined;
        self.onFulfilledCallbacks = [];
        self.onRejectedCallbacks = [];

        function resolve(value) {
            if (self.status === 'pending') {
                self.status = 'fulfilled';
                self.value = value;
                self.onFulfilledCallbacks.forEach(function(callback) {
                    callback(value);
                });
            }
        }

        function reject(reason) {
            if (self.status === 'pending') {
                self.status = 'rejected';
                self.reason = reason;
                self.onRejectedCallbacks.forEach(function(callback) {
                    callback(reason);
                });
            }
        }

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    };

    Promise.prototype.then = function(onFulfilled, onRejected) {
        var self = this;
        return new Promise(function(resolve, reject) {
            function handleFulfilled(value) {
                try {
                    if (typeof onFulfilled === 'function') {
                        var result = onFulfilled(value);
                        resolve(result);
                    } else {
                        resolve(value);
                    }
                } catch (e) {
                    reject(e);
                }
            }

            function handleRejected(reason) {
                try {
                    if (typeof onRejected === 'function') {
                        var result = onRejected(reason);
                        resolve(result);
                    } else {
                        reject(reason);
                    }
                } catch (e) {
                    reject(e);
                }
            }

            if (self.status === 'fulfilled') {
                setTimeout(function() {
                    handleFulfilled(self.value);
                }, 0);
            } else if (self.status === 'rejected') {
                setTimeout(function() {
                    handleRejected(self.reason);
                }, 0);
            } else {
                self.onFulfilledCallbacks.push(function(value) {
                    setTimeout(function() {
                        handleFulfilled(value);
                    }, 0);
                });
                self.onRejectedCallbacks.push(function(reason) {
                    setTimeout(function() {
                        handleRejected(reason);
                    }, 0);
                });
            }
        });
    };

    Promise.prototype.catch = function(onRejected) {
        return this.then(null, onRejected);
    };

    Promise.resolve = function(value) {
        return new Promise(function(resolve) {
            resolve(value);
        });
    };

    Promise.reject = function(reason) {
        return new Promise(function(resolve, reject) {
            reject(reason);
        });
    };
}

// fetch 폴리필 (XMLHttpRequest 기반)
if (typeof fetch === 'undefined') {
    console.log('fetch 폴리필 로드됨');
    
    window.fetch = function(url, options) {
        return new Promise(function(resolve, reject) {
            options = options || {};
            var method = options.method || 'GET';
            var headers = options.headers || {};
            var body = options.body || null;
            
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            
            for (var header in headers) {
                if (headers.hasOwnProperty(header)) {
                    xhr.setRequestHeader(header, headers[header]);
                }
            }
            
            xhr.onload = function() {
                var response = {
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: xhr.getAllResponseHeaders(),
                    text: function() { return Promise.resolve(xhr.responseText); },
                    json: function() { return Promise.resolve(JSON.parse(xhr.responseText)); }
                };
                resolve(response);
            };
            
            xhr.onerror = function() {
                reject(new Error('Network error'));
            };
            
            xhr.send(body);
        });
    };
}

// Array.from 폴리필
if (!Array.from) {
    console.log('Array.from 폴리필 로드됨');
    
    Array.from = function(iterable) {
        var arr = [];
        if (iterable.length) {
            for (var i = 0; i < iterable.length; i++) {
                arr.push(iterable[i]);
            }
        }
        return arr;
    };
}

// Element.classList 폴리필 (IE9 이하)
if (!("classList" in document.documentElement)) {
    console.log('classList 폴리필 로드됨');
    
    Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function() {
            var self = this;
            var classes = self.className.split(' ').filter(Boolean);
            
            var classList = {};
            
            classList.add = function(className) {
                if (classes.indexOf(className) === -1) {
                    classes.push(className);
                    self.className = classes.join(' ');
                }
                return self;
            };
            
            classList.remove = function(className) {
                var index = classes.indexOf(className);
                if (index !== -1) {
                    classes.splice(index, 1);
                    self.className = classes.join(' ');
                }
                return self;
            };
            
            classList.toggle = function(className) {
                if (classes.indexOf(className) !== -1) {
                    return this.remove(className);
                } else {
                    return this.add(className);
                }
            };
            
            classList.contains = function(className) {
                return classes.indexOf(className) !== -1;
            };
            
            return classList;
        }
    });
}

// 브라우저 감지 및 경고 메시지
(function() {
    // IE 감지
    function isIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 이하
            return true;
        }
        
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11
            return true;
        }
        
        return false;
    }
    
    // 브라우저가 IE인 경우 경고 메시지 표시
    function showIEWarning() {
        var body = document.body;
        
        var warningDiv = document.createElement('div');
        warningDiv.style.position = 'fixed';
        warningDiv.style.top = '0';
        warningDiv.style.left = '0';
        warningDiv.style.right = '0';
        warningDiv.style.padding = '10px';
        warningDiv.style.backgroundColor = '#FFF3CD';
        warningDiv.style.color = '#856404';
        warningDiv.style.borderBottom = '1px solid #FFEEBA';
        warningDiv.style.zIndex = '9999';
        warningDiv.style.textAlign = 'center';
        warningDiv.style.fontSize = '14px';
        
        warningDiv.innerHTML = '최신 기능을 모두 사용하려면 Chrome, Firefox, Safari, 또는 Edge와 같은 최신 브라우저를 사용하세요. <a href="https://browsehappy.com/" style="color: #856404; font-weight: bold;" target="_blank">브라우저 업그레이드</a>';
        
        var closeButton = document.createElement('button');
        closeButton.innerText = '닫기';
        closeButton.style.marginLeft = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.backgroundColor = '#FFF3CD';
        closeButton.style.border = '1px solid #FFEEBA';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        
        closeButton.onclick = function() {
            warningDiv.style.display = 'none';
            // 7일 동안 경고 메시지 표시 안함 (쿠키 설정)
            var date = new Date();
            date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
            document.cookie = "ieWarningClosed=true; expires=" + date.toUTCString() + "; path=/";
        };
        
        warningDiv.appendChild(closeButton);
        
        // 쿠키 확인
        function getCookie(name) {
            var nameEQ = name + "=";
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1, cookie.length);
                }
                if (cookie.indexOf(nameEQ) === 0) {
                    return cookie.substring(nameEQ.length, cookie.length);
                }
            }
            return null;
        }
        
        // 쿠키가 없으면 경고 메시지 표시
        if (!getCookie('ieWarningClosed')) {
            body.insertBefore(warningDiv, body.firstChild);
        }
    }
    
    // 페이지 로드 시 실행
    document.addEventListener('DOMContentLoaded', function() {
        if (isIE()) {
            showIEWarning();
        }
    });
})(); 