export default {
    methods: {
        createEntry(description, project) {
            console.log("Creating: " + description, project);
            this.$toggl.startTimeEntry({
                    description: description,
                    pid: project.id,
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
            console.log("Stopping: " + id);
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
                        console.log("something already running: ", timeEntry);
                        console.log("trying with: ", description, project);
                        if (timeEntry.description == description &&
                            timeEntry.pid == project.id) {
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
        getProject(entry) {
            return this.$store.state.projects.find(p => p.id == entry.pid)
        }
    }
};