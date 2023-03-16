export async function login(url, user, password, headers) {
  return fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      username: user,
      password: password,
    }),
  })
    .then(async (response) => {
      if (!response.status) {
        return { status: response.status, response: await response.json() };
      }
      return {
        status: response.status,
        response: await response.json(),
        headers: response.headers.get("JWT"),
      };
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function logout(url, headers) {
  return fetch(url, {
    method: "GET",
    headers: headers,
  })
    .then(async (response) => {
      if (!response.status) {
        return { status: response.status, response: await response.json() };
      }
      return {
        status: response.status,
        response: await response.json(),
      };
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getElements(url, headers) {
  return fetch(url, {
    method: "GET",
    headers: headers,
  })
    .then(async (response) => {
      if (!response.status) {
        return { status: response.status, response: await response.json() };
      }
      return { status: response.status, response: await response.json() };
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function postElements(url, headers, body) {
  console.log(JSON.stringify(body));
  return fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      if (!response.status) {
        return { status: response.status, response: await response.json() };
      }
      return { status: response.status, response: await response.json() };
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function putElements(url, headers, body) {
  return fetch(url, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      if (!response.status) {
        return { status: response.status, response: await response.json() };
      }
      return { status: response.status, response: await response.json() };
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function deleteElements(url, headers) {
  return fetch(url, {
    method: "DELETE",
    headers: headers,
  })
    .then(async (response) => {
      if (!response.status) {
        return { status: response.status, response: await response.json() };
      }
      return await response.json();
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getElementsWithParams(url, headers, params) {
  return fetch(url, {
    method: "GET",
    headers: headers,
    params: params,
  })
    .then(async (response) => {
      if (!response.status) {
        return { status: response.status, response: await response.json() };
      }
      return await response.json();
    })
    .catch((error) => {
      console.log(error);
    });
}
