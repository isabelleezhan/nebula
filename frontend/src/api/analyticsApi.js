export async function getWeeklyAnalytics() {
    const response = await fetch(
        '/api/analytics/weekly',
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    const data =
        await readResponseBody(response)

    if (!response.ok) {
        throw new Error(
            data?.message ||
            'Could not load weekly analytics.'
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