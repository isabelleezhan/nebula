export async function getSubjects() {
    const response = await fetch('/api/subjects', {
        method: 'GET',
        credentials: 'include'
    })

    const data = await readResponseBody(response)

    if (!response.ok) {
        throw new Error(
            data?.message || 'Could not load subjects.'
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

export async function createSubject(name) {
    const response = await fetch('/api/subjects', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        credentials: 'include',

        body: JSON.stringify({
            name
        })
    })

    const data = await readResponseBody(response)

    if (!response.ok) {
        throw new Error(
            data?.message || 'Could not create subject.'
        )
    }

    return data
}