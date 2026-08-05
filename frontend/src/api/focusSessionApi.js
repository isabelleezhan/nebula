export async function recordFocusSession({
                                             planetId,
                                             startedAt,
                                             endedAt,
                                             durationMinutes
                                         }) {
    const response = await fetch(
        '/api/focus-sessions',
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            credentials: 'include',

            body: JSON.stringify({
                planetId,
                startedAt,
                endedAt,
                durationMinutes
            })
        }
    )

    const data = await readResponseBody(response)

    if (!response.ok) {
        throw new Error(
            data?.message ||
            'Could not save focus session.'
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