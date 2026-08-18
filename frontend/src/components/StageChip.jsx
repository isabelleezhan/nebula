import {getStageChipStyle, getStageMeta} from '../utils/stageVisuals'

function StageChip({stage, mini = false, label}) {
    const meta = getStageMeta(stage)

    return (
        <span
            className={mini ? 'stage-chip mini' : 'stage-chip'}
            style={getStageChipStyle(stage)}
        >
            <span className="stage-dot" aria-hidden="true"/>
            {label || meta.label}
        </span>
    )
}

export default StageChip
