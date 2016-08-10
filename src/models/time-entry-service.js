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
}
