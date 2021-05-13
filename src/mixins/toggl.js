export default {
    methods: {
        createEntry(entryDescription, projectID) {
            console.log("Creating: " + entryDescription, projectID);
            this.$toggl.startTimeEntry({
                    description: entryDescription,
                    pid: projectID,
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
        stopEntry(entryID) {
            console.log("Stopping: " + entryID);
            this.$toggl.stopTimeEntry(entryID, (err, timeEntry) => {
                if (err) console.log(err);
                else {
                    console.log("succefully stopped ", timeEntry);
                    this.$store.commit("setRunningEntry", {});
                }
            });
        },
        toggle(entryDescription, projectID) {
            console.log('Togglying: ', entryDescription, projectID);
            this.$toggl.getCurrentTimeEntry((err, timeEntry) => {
                if (err) console.log(err);
                else {
                    if (timeEntry) {
                        console.log("Something already running: ", timeEntry.description, timeEntry.pid);
                        console.log("Checking if it is:", entryDescription, projectID);
                        if (timeEntry.pid == projectID && timeEntry.description == entryDescription) {
                            console.log('Matched! Stopping');
                            this.stopEntry(timeEntry.id)
                        } else {
                            console.log('Not Matched! Starting new');
                            this.createEntry(entryDescription, projectID);
                        }
                    } else {
                        console.log("Nothing running! Starting new");
                        this.createEntry(entryDescription, projectID);
                    }
                }
            });
        },
        getProject(entry) {
            return this.$store.state.projects.find(p => p.id == entry.pid)
        }
    }
};