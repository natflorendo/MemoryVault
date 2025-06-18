import type { Note } from '../types'; 

export const formatDate = (timestamp: Date) => {
    const date = new Date (timestamp);
    return (date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }));
}

export const generateValues = (start: Date, end: Date, data: {date: string; count: number}[]) => {
    const dataMap = new Map(data.map(d => [d.date, d.count]));
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

export const processNotesToHeatmap = (notes: Note[]) => {
    const countMap = new Map<string, number>();

    for(const note of notes) {
        const currDate = new Date(note.timestamp).toLocaleString('en-CA').slice(0, 10);
        // Update count in map
        countMap.set(currDate, 1 + (countMap.get(currDate) || 0))
    }

    // Convert the map entries into an array of objects
    return Array.from(countMap.entries()).map(([date, count]) => ({date, count}))
}

export const shiftDate = (date: Date, numDays: number) => {
  const newDate = new Date(date);

  newDate.setDate(newDate.getDate() + numDays);
  return newDate;

}