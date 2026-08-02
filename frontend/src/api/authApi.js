export async function registerUser(email, password) {
    const response = await fetch('/api/auth/register', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        credentials: 'include',

        body: JSON.stringify({
            email,
            password
        })
    })

    const data = await readResponseBody(response)

    if (!response.ok) {
        throw new Error(
            data?.message || 'Registration failed.'
        )
    }

    return data
}

export async function loginUser(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        credentials: 'include',

        body: JSON.stringify({
            email,
            password
        })
    })

    const data = await readResponseBody(response)

    if (!response.ok) {
        throw new Error(
            data?.message || 'Incorrect email or password.'
        )
    }

    return data
}

export async function logoutUser() {
    const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    })

    if (!response.ok) {
        const data = await readResponseBody(response)

        throw new Error(
            data?.message || 'Logout failed.'
        )
    }
}

export async function getCurrentUser() {
    const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
    })

    if (response.status === 401) {
        return null
    }

    const data = await readResponseBody(response)

    if (!response.ok) {
        throw new Error(
            data?.message ||
            'Could not check authentication.'
        )
    }

    return data
}

async function readResponseBody(response) {
    const contentType =
        response.headers.get('content-type')

    if (
        contentType &&
        contentType.includes('application/json')
    ) {
        return response.json()
    }

    return null
}