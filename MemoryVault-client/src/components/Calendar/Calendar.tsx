import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
import './Calendar.css'

const dummyData = [
    { date: '2025-01-01', count: 1 },
    { date: '2025-01-03', count: 4 },
    { date: '2025-06-14', count: 2 },
]

const formatDate = (timestamp: Date) => {
    const date = new Date (timestamp);
    return (date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }));
}

const generateValues = (start: Date, end: Date, dummyData: {date: string; count: number}[]) => {
    const dataMap = new Map(dummyData.map(d => [d.date, d.count]));
    const values: {date: Date, count: number}[] = []

    const currDate = new Date(start)

    while(currDate <= end) {
        const day = currDate.toLocaleString('en-CA').slice(0, 10);
        values.push({
            // clone currDate (otherwise all the dates will share 
            // the same reference and show same date)
            date: new Date(currDate),
            count: dataMap.get(day) ?? 0,
        });
        currDate.setDate(currDate.getDate() + 1);
    }

    return values;
}

const shiftDate = (date: Date, numDays: number) => {
  const newDate = new Date(date);

  newDate.setDate(newDate.getDate() + numDays);
  return newDate;

}

export default function Calendar() {
    const endDate = new Date();  //today
    const startDate = shiftDate(endDate, -365);
    const values = generateValues(startDate, endDate, dummyData);
    
    return (
        <>
            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={values}
                classForValue={(value) => {
                    if (!value || value.count === 0) return 'color-empty';
                    return `color-scale-${value.count}`;
                }}
                tooltipDataAttrs={(value): Record<string, string> => {
                    if (!value) return {};
                    return {
                        'data-tooltip-id': 'heatmap-tooltip',
                        'data-tooltip-content': `${formatDate(value.date)} has count: ${value.count}`,
                    };

                }}
                showWeekdayLabels={true}
                onClick={value => {
                    if (value) {
                        alert(`${formatDate(value.date)} clicked with count: ${value.count}`);
                    }
                }}
            />
            <Tooltip id="heatmap-tooltip"/>
       </>
    )
}