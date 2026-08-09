export async function getActivePlanet(subjectId) {
    const response = await fetch(
        `/api/subjects/${subjectId}/active-planet`,
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    const data = await readResponseBody(response)

    if (!response.ok) {
        console.error('Active planet request failed:', response.status, data)

        throw new Error(data?.message || `Could not load active planet. Status: ${response.status}`)
    }

    return data
}

export async function getPlanetsForSubject(subjectId) {
    const response = await fetch(
        `/api/subjects/${subjectId}/planets`,
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    const data = await readResponseBody(response)

    if (!response.ok) {
        throw new Error(
            data?.message ||
            'Could not load planets.'
        )
    }

    return data
}

export async function getPlanet(planetId) {
    const response = await fetch(
        `/api/planets/${planetId}`,
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    const data = await readResponseBody(response)

    if (!response.ok) {
        throw new Error(
            data?.message ||
            'Could not load planet.'
        )
    }

    return data
}

async function readResponseBody(response) {
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
        return response.json()
    }

    return null
}

export async function renamePlanet(
    planetId,
    name
) {
    const response = await fetch(
        `/api/planets/${planetId}`,
        {
            method: 'PATCH',

            headers: {
                'Content-Type':
                    'application/json'
            },

            credentials: 'include',

            body: JSON.stringify({
                name
            })
        }
    )

    const data =
        await readResponseBody(response)

    if (!response.ok) {
        throw new Error(
            data?.message ||
            'Could not rename planet.'
        )
    }

    return data
}