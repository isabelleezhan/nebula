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
        console.error(
            'Active planet request failed:',
            response.status,
            data
        )

        throw new Error(
            data?.message ||
            `Could not load active planet. Status: ${response.status}`
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