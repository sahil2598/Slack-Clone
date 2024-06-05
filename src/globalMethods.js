export function createInit(method, request = null) {
    // console.log('Inside createInit')
    let headers = new Headers();
    let api_key = localStorage.getItem('sahiln_belay_api_key');
    headers.append("API-KEY", api_key);
    headers.append("Content-Type", "application/json");

    let myInit = {}
    if (!request) {
        myInit = {
            method: method,
            headers: headers
        };
    }
    else {
        myInit = {
            method: method,
            headers: headers,
            body: JSON.stringify(request)
        };
    }

    return myInit;
}

export async function getUser() {
    let response = await fetch('/api/user/api_key', createInit('GET'));
    let user = await response.json();
    return user;
}