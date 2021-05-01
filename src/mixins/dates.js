export default {
    methods: {
        getTime(seconds, showSeconds = false) {
            const d = Number(seconds);
            const h = Math.floor(d / 3600);
            const m = Math.floor((d % 3600) / 60);
            const s = Math.floor((d % 3600) % 60);
            const hDisplay =
                h > 0 ? `${h.toString().length > 1 ? `${h}` : `${0}${h}`}` : "00";
            const mDisplay =
                m > 0 ? `${m.toString().length > 1 ? `${m}` : `${0}${m}`}` : "00";
            const sDisplay =
                s > 0 ? `${s.toString().length > 1 ? `${s}` : `${0}${s}`}` : "00";
            if (showSeconds) return `${hDisplay}:${mDisplay}:${sDisplay}`;
            else return `${hDisplay}:${mDisplay}`;
        },

        getPreviousMonday() {
            var date = new Date();
            var day = date.getDay();
            var prevMonday = new Date();
            if (date.getDay() == 0) {
                prevMonday.setDate(date.getDate() - 7);
            } else {
                prevMonday.setDate(date.getDate() - (day - 1));
            }
            prevMonday.setHours(0, 0, 0, 0);
            return prevMonday.toISOString();
        },

        formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate();
            // year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month].join('/');
        }
    },
};