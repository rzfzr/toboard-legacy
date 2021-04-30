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
                        this.$store.commit("setRunningEntry", timeEntry);
                    }
                }
            );
        },
        stopEntry(id) {
            this.$toggl.stopTimeEntry(id, (err, timeEntry) => {
                if (err) console.log(err);
                else {
                    console.log("succefully stopped ", timeEntry);
                    this.$store.commit("setRunningEntry", {});
                }
            });
        },
        toggle(description, project) {
            this.$toggl.getCurrentTimeEntry((err, timeEntry) => {
                if (err) console.log(err);
                else {
                    if (timeEntry) {
                        console.log("something already running ");
                        if (timeEntry.description == description &&
                            timeEntry.pid == this.$store.state.projects.find((x) => x.name == project).id) {
                            this.stopEntry(timeEntry.id)
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