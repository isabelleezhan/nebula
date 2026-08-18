// A ticked, segmented progress meter
function XpMeter({percentage, segments = 12}) {
    const clampedPercentage =
        Math.max(0, Math.min(percentage ?? 0, 100))

    const filledSegments =
        Math.round((clampedPercentage / 100) * segments)

    return (
        <div className="xp-track" role="progressbar"
             aria-valuenow={Math.round(clampedPercentage)}
             aria-valuemin={0}
             aria-valuemax={100}
        >
            {Array.from({length: segments}).map((_, index) => (
                <div
                    key={index}
                    className={
                        index < filledSegments
                            ? 'xp-tick filled'
                            : 'xp-tick'
                    }
                />
            ))}
        </div>
    )
}

export default XpMeter
