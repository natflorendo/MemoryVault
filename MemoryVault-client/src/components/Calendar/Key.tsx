import './Calendar.css';

const Keys = () => {
    return (
        <div className="key-wrapper react-calendar-heatmap">
            <p>Less</p>
            <svg width="22" height="22">
                <rect width={20} height={20} className="color-empty" />
            </svg>
            <svg width="22" height="22">
                <rect width={20} height={20} className="color-scale-1" />
            </svg>
            <svg width="22" height="22">
                <rect width={20} height={20} className="color-scale-2" />
            </svg>
            <svg width="22" height="22">
                <rect width={20} height={20} className="color-scale-3" />
            </svg>
            <svg width="22" height="22">
                <rect width={20} height={20} className="color-scale-4" />
            </svg>
            <p>More</p>
        </div>
    )
}
export default Keys;