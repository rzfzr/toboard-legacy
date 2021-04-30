export default {
    methods: {
        createEntry(description, project) {
            this.$toggl.startTimeEntry({
                    description: description,
                    pid: this.$store.state.projects.find((x) => x.name == project).id,
                },
                (err, timeEntry) => {
                    if (err) console.log(err);
                    else {
                        console.log("succefully started: ", timeEntry);
                        this.$store.state.timeEntries.push(timeEntry);
                    }
                }
            );
        },
        toggle(description, project) {
            this.$toggl.getCurrentTimeEntry((err, timeEntry) => {
                if (err) console.log(err);
                else {
                    if (timeEntry) {
                        console.log("something already running ");
                        if (timeEntry.description == description) {
                            this.$toggl.stopTimeEntry(timeEntry.id, (err, timeEntry) => {
                                if (err) console.log(err);
                                else console.log("succefully stopped ", timeEntry);
                            });
                        } else {
                            this.createEntry(description, project);
                        }
                    } else {
                        this.createEntry(description, project);
                    }
                }
            });
        },
    }
};