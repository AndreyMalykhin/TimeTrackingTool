export default class TimeEntryService {
    constructor(fetcher) {
        this._fetcher = fetcher;
    }

    getByUser(userId, startDate, endDate) {
        const params = encodeURIComponent(JSON.stringify(
            {userId, from: `"${startDate}"`, to: `"${endDate}"`}));
        return this._fetcher.fetch(
            `1/query/data/entriesByPeriod?parameters=${params}`);
    }

    save(entry) {
        if (entry.id) {
            return this._fetcher.fetch(
                `1/objects/timeEntries/${entry.id}?returnObject=true`,
                {
                    method: 'PUT',
                    body: JSON.stringify(entry)
                }
            );
        }

        return this._fetcher.fetch(`1/objects/timeEntries?returnObject=true`, {
            method: 'POST',
            body: JSON.stringify(entry)
        });
    }
}
